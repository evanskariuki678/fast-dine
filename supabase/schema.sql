-- The Fast Dine initial database schema for Supabase.
-- Customer-facing tables use RLS. Orders are read-only to browser clients;
-- create them through a trusted server function that recalculates all totals.

create table public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id text primary key,
  full_name text not null default '',
  phone text,
  locale text not null default 'en-KE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_phone_unique on public.profiles (phone) where phone is not null and phone <> '';

create table public.delivery_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  label text not null default 'Home',
  recipient_name text not null,
  phone text not null,
  address_line text not null,
  apartment text not null default '',
  delivery_note text not null default '',
  city text not null default 'Nairobi',
  latitude double precision check (latitude is null or latitude between -90 and 90),
  longitude double precision check (longitude is null or longitude between -180 and 180),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint delivery_addresses_coordinates_valid check (
    (latitude is null and longitude is null)
    or (latitude is not null and longitude is not null
      and latitude between -90 and 90 and longitude between -180 and 180)
  )
);

create index delivery_addresses_user_idx on public.delivery_addresses (user_id);
create unique index delivery_addresses_one_default_per_user on public.delivery_addresses (user_id) where is_default;

create table public.stores (
  id text primary key,
  category_id text not null references public.categories(id) on delete restrict,
  name text not null,
  description text not null default '',
  cuisine text not null default '',
  image_url text not null default '',
  accent_color text not null default '#159b81',
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  delivery_min_minutes integer not null default 20 check (delivery_min_minutes >= 0),
  delivery_max_minutes integer not null default 40 check (delivery_max_minutes >= delivery_min_minutes),
  delivery_fee_kes integer not null default 0 check (delivery_fee_kes >= 0),
  promo_text text not null default '',
  badge text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index stores_category_active_idx on public.stores (category_id, is_active);

create table public.products (
  id text primary key,
  store_id text not null references public.stores(id) on delete cascade,
  name text not null,
  description text not null default '',
  price_kes integer not null check (price_kes >= 0),
  old_price_kes integer check (old_price_kes is null or old_price_kes >= price_kes),
  image_url text not null default '',
  tag text not null default '',
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_store_available_idx on public.products (store_id, is_available);

-- This stores payment references/display metadata only. Never store full card
-- numbers, CVV, mobile-money PINs, or one-time passwords in this database.
create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  method_type text not null check (method_type in ('mpesa', 'card', 'cash')),
  display_name text not null default '',
  card_brand text check (card_brand is null or card_brand in ('Visa', 'Mastercard', 'American Express')),
  card_last4 char(4) check (card_last4 is null or card_last4 ~ '^[0-9]{4}$'),
  mobile_phone text,
  provider_token_reference text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  constraint payment_method_metadata_matches_type check (
    (method_type = 'card' and card_brand is not null and card_last4 is not null and mobile_phone is null)
    or (method_type = 'mpesa' and mobile_phone is not null and card_brand is null and card_last4 is null)
    or (method_type = 'cash' and card_brand is null and card_last4 is null and mobile_phone is null)
  )
);

create index payment_methods_user_idx on public.payment_methods (user_id);
create unique index payment_methods_one_default_per_user on public.payment_methods (user_id) where is_default;

create table public.promo_codes (
  code text primary key,
  description text not null default '',
  discount_type text not null check (discount_type in ('percent', 'fixed_kes')),
  discount_value integer not null check (discount_value > 0),
  minimum_order_kes integer not null default 0 check (minimum_order_kes >= 0),
  starts_at timestamptz,
  expires_at timestamptz,
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint promo_percent_range check (discount_type <> 'percent' or discount_value <= 100),
  constraint promo_dates_ordered check (starts_at is null or expires_at is null or expires_at > starts_at)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id text not null,
  store_id text references public.stores(id) on delete set null,
  status text not null default 'placed' check (status in ('placed', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled')),
  currency char(3) not null default 'KES' check (currency = 'KES'),
  item_subtotal_kes integer not null check (item_subtotal_kes >= 0),
  delivery_fee_kes integer not null default 0 check (delivery_fee_kes >= 0),
  service_fee_kes integer not null default 0 check (service_fee_kes >= 0),
  discount_kes integer not null default 0 check (discount_kes >= 0),
  total_kes integer not null check (total_kes >= 0),
  promo_code text,
  delivery_address jsonb not null,
  payment_method_type text check (payment_method_type is null or payment_method_type in ('mpesa', 'card', 'cash')),
  payment_method_label text not null default '',
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_placed_idx on public.orders (user_id, placed_at desc);
create index orders_status_idx on public.orders (status, placed_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_kes integer not null check (unit_price_kes >= 0),
  line_total_kes integer not null check (line_total_kes >= 0),
  created_at timestamptz not null default now()
);

create index order_items_order_idx on public.order_items (order_id);

create table public.promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  promo_code text not null references public.promo_codes(code) on delete restrict,
  order_id uuid not null unique references public.orders(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (user_id, promo_code)
);

insert into public.categories (id, name, slug) values
  ('food', 'Food', 'food_1'),
  ('groceries', 'Groceries', 'groceries_4'),
  ('pharmacy', 'Pharmacy & Beauty', 'pharmacy-beauty_3'),
  ('shops', 'Shops', 'shops_22'),
  ('deals', 'Fast Dine Deals', 'glovo-bargains-nbo'),
  ('alcohol', 'Drinks', 'alcohol_21655')
on conflict (id) do nothing;

insert into public.promo_codes (code, description, discount_type, discount_value)
values ('FAST10', '10% off your order', 'percent', 10)
on conflict (code) do nothing;

alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.delivery_addresses enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.payment_methods enable row level security;
alter table public.promo_codes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.promo_redemptions enable row level security;

create policy "Active categories are visible to everyone"
  on public.categories for select to anon, authenticated using (is_active);
create policy "Active stores are visible to everyone"
  on public.stores for select to anon, authenticated using (is_active);
create policy "Available products in active stores are visible to everyone"
  on public.products for select to anon, authenticated
  using (is_available and exists (
    select 1 from public.stores s where s.id = products.store_id and s.is_active
  ));
create policy "Current promo codes are visible to everyone"
  on public.promo_codes for select to anon, authenticated
  using (is_active and (starts_at is null or starts_at <= now()) and (expires_at is null or expires_at > now()));

create policy "Customers can read their own profile"
  on public.profiles for select to authenticated using ((select auth.jwt()->>'sub') = id);
create policy "Customers can create their own profile"
  on public.profiles for insert to authenticated with check ((select auth.jwt()->>'sub') = id);
create policy "Customers can update their own profile"
  on public.profiles for update to authenticated using ((select auth.jwt()->>'sub') = id) with check ((select auth.jwt()->>'sub') = id);

create policy "Customers manage their own addresses"
  on public.delivery_addresses for all to authenticated
  using ((select auth.jwt()->>'sub') = user_id) with check ((select auth.jwt()->>'sub') = user_id);
create policy "Customers manage their own payment methods"
  on public.payment_methods for all to authenticated
  using ((select auth.jwt()->>'sub') = user_id) with check ((select auth.jwt()->>'sub') = user_id);
create policy "Customers can read their own orders"
  on public.orders for select to authenticated using ((select auth.jwt()->>'sub') = user_id);
create policy "Customers can read items from their own orders"
  on public.order_items for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = (select auth.jwt()->>'sub'))
  );
create policy "Customers can read their own promo redemptions"
  on public.promo_redemptions for select to authenticated using ((select auth.jwt()->>'sub') = user_id);

grant select on public.categories, public.stores, public.products, public.promo_codes to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.delivery_addresses, public.payment_methods to authenticated;
grant select on public.orders, public.order_items, public.promo_redemptions to authenticated;
