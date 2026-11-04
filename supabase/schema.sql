-- The Fast Dine production database schema for Supabase.
-- Implements complete relational integrity, automated updated_at triggers,
-- comprehensive check constraints, indexing, audit trails, and strict Row Level Security (RLS).

-- Helper function to automatically update timestamps
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Categories
create table public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  display_order integer not null default 0,
  icon text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. Customer Profiles
create table public.profiles (
  id text primary key,
  full_name text not null default '',
  phone text check (phone is null or phone ~ '^\+?[0-9]{9,15}$'),
  locale text not null default 'en-KE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_phone_unique on public.profiles (phone) where phone is not null and phone <> '';

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_current_timestamp_updated_at();

-- 3. Delivery Addresses
create table public.delivery_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  label text not null default 'Home',
  recipient_name text not null,
  phone text not null check (phone ~ '^\+?[0-9]{9,15}$'),
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
create index delivery_addresses_coords_idx on public.delivery_addresses (latitude, longitude)
  where latitude is not null and longitude is not null;

create trigger set_delivery_addresses_updated_at
  before update on public.delivery_addresses
  for each row execute function public.set_current_timestamp_updated_at();

-- 4. Stores / Merchants
create table public.stores (
  id text primary key,
  category_id text not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
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

create trigger set_stores_updated_at
  before update on public.stores
  for each row execute function public.set_current_timestamp_updated_at();

-- 5. Products Catalog
create table public.products (
  id text primary key,
  store_id text not null references public.stores(id) on delete cascade,
  name text not null,
  description text not null default '',
  price_kes integer not null check (price_kes >= 0),
  old_price_kes integer check (old_price_kes is null or old_price_kes > price_kes),
  image_url text not null default '',
  tag text not null default '',
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_store_available_idx on public.products (store_id, is_available);

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_current_timestamp_updated_at();

-- 6. Payment Method Metadata (Tokenized / Non-sensitive display info only)
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

-- 7. Promo Codes
create table public.promo_codes (
  code text primary key,
  description text not null default '',
  discount_type text not null check (discount_type in ('percent', 'fixed_kes')),
  discount_value integer not null check (discount_value > 0),
  minimum_order_kes integer not null default 0 check (minimum_order_kes >= 0),
  starts_at timestamptz,
  expires_at timestamptz,
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  current_redemptions integer not null default 0 check (current_redemptions >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint promo_percent_range check (discount_type <> 'percent' or discount_value <= 100),
  constraint promo_dates_ordered check (starts_at is null or expires_at is null or expires_at > starts_at)
);

-- 8. Customer Orders
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
  updated_at timestamptz not null default now(),
  constraint order_total_arithmetic_check check (
    total_kes = item_subtotal_kes + delivery_fee_kes + service_fee_kes - discount_kes
  )
);

create index orders_user_placed_idx on public.orders (user_id, placed_at desc);
create index orders_status_idx on public.orders (status, placed_at desc);
create index orders_store_id_idx on public.orders (store_id);

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_current_timestamp_updated_at();

-- 9. Order Items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_kes integer not null check (unit_price_kes >= 0),
  line_total_kes integer not null check (line_total_kes >= 0),
  created_at timestamptz not null default now(),
  constraint order_items_line_math check (line_total_kes = unit_price_kes * quantity)
);

create index order_items_order_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);

-- 10. Order Status History (Lifecycle Audit Trail)
create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null check (status in ('placed', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled')),
  note text not null default '',
  created_at timestamptz not null default now()
);

create index order_status_history_order_idx on public.order_status_history (order_id, created_at asc);

-- 11. Promo Redemptions
create table public.promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  promo_code text not null references public.promo_codes(code) on delete restrict,
  order_id uuid not null unique references public.orders(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (user_id, promo_code)
);

create index promo_redemptions_promo_code_idx on public.promo_redemptions (promo_code);

-- 12. Support Tickets
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  user_id text,
  topic text not null,
  customer_name text not null,
  email text not null check (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  order_number text,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index support_tickets_user_idx on public.support_tickets (user_id, created_at desc);

create trigger set_support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.set_current_timestamp_updated_at();

-- 13. Customer Reviews
create table public.store_reviews (
  id uuid primary key default gen_random_uuid(),
  store_id text not null references public.stores(id) on delete cascade,
  user_id text not null,
  order_id uuid references public.orders(id) on delete set null,
  customer_name text not null default 'Customer',
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (order_id, user_id)
);

create index store_reviews_store_idx on public.store_reviews (store_id, created_at desc);

-- Seed basic categories
insert into public.categories (id, name, slug, display_order, icon) values
  ('food', 'Food', 'food_1', 1, '🍔'),
  ('groceries', 'Groceries', 'groceries_4', 2, '🥑'),
  ('pharmacy', 'Pharmacy & Beauty', 'pharmacy-beauty_3', 3, '🧴'),
  ('shops', 'Shops', 'shops_22', 4, '🎁'),
  ('deals', 'Fast Dine Deals', 'glovo-bargains-nbo', 5, '✨'),
  ('alcohol', 'Drinks', 'alcohol_21655', 6, '🍷')
on conflict (id) do nothing;

insert into public.promo_codes (code, description, discount_type, discount_value)
values ('FAST10', '10% off your order', 'percent', 10)
on conflict (code) do nothing;

-- ROW LEVEL SECURITY (RLS)
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.delivery_addresses enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.payment_methods enable row level security;
alter table public.promo_codes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.promo_redemptions enable row level security;
alter table public.support_tickets enable row level security;
alter table public.store_reviews enable row level security;

-- Public / Anon Read Policies
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

create policy "Store reviews are visible to everyone"
  on public.store_reviews for select to anon, authenticated using (true);

-- Authenticated Customer Policies (Owner-restricted)
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

create policy "Customers can read status history from their own orders"
  on public.order_status_history for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_status_history.order_id and o.user_id = (select auth.jwt()->>'sub'))
  );

create policy "Customers can read their own promo redemptions"
  on public.promo_redemptions for select to authenticated using ((select auth.jwt()->>'sub') = user_id);

create policy "Customers can create support tickets"
  on public.support_tickets for insert to anon, authenticated
  with check (user_id is null or (select auth.jwt()->>'sub') = user_id);

create policy "Customers can view their own support tickets"
  on public.support_tickets for select to authenticated
  using ((select auth.jwt()->>'sub') = user_id);

create policy "Customers can write reviews for their own delivered orders"
  on public.store_reviews for insert to authenticated
  with check (
    (select auth.jwt()->>'sub') = user_id
    and exists (
      select 1 from public.orders o
      where o.id = store_reviews.order_id
        and o.user_id = (select auth.jwt()->>'sub')
        and o.status = 'delivered'
    )
  );

-- Grants
grant select on public.categories, public.stores, public.products, public.promo_codes, public.store_reviews to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.delivery_addresses, public.payment_methods to authenticated;
grant select on public.orders, public.order_items, public.order_status_history, public.promo_redemptions to authenticated;
grant insert on public.support_tickets to anon, authenticated;
grant select on public.support_tickets to authenticated;
grant insert on public.store_reviews to authenticated;
