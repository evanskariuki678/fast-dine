-- Create customer orders atomically using verified prices and fees from the
-- database catalog. The client never supplies trusted totals, user IDs, or fee amounts.
create or replace function public.create_order(
  p_store_id text,
  p_items jsonb,
  p_delivery_address jsonb,
  p_payment_method_type text,
  p_payment_method_label text,
  p_promo_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id text := (select auth.jwt()->>'sub');
  v_store public.stores%rowtype;
  v_item jsonb;
  v_product public.products%rowtype;
  v_product_id text;
  v_quantity integer;
  v_item_subtotal integer := 0;
  v_lines jsonb := '[]'::jsonb;
  v_delivery_fee integer;
  v_service_fee constant integer := 25;
  v_discount integer := 0;
  v_total integer;
  v_promo_code text := nullif(upper(trim(p_promo_code)), '');
  v_promo public.promo_codes%rowtype;
  v_order public.orders%rowtype;
begin
  if v_user_id is null then
    raise exception 'Sign in before placing an order.';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your basket is empty.';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'An order cannot contain more than 50 product lines.';
  end if;
  if p_payment_method_type is null or p_payment_method_type not in ('mpesa', 'card', 'cash') then
    raise exception 'Choose a valid payment method.';
  end if;
  if p_delivery_address is null or jsonb_typeof(p_delivery_address) <> 'object'
     or coalesce(trim(p_delivery_address->>'address_line'), '') = '' then
    raise exception 'Enter a delivery address before placing your order.';
  end if;

  select * into v_store
  from public.stores
  where id = p_store_id and is_active
  for share;
  if not found then
    raise exception 'This store is currently unavailable. Please refresh and try again.';
  end if;
  v_delivery_fee := v_store.delivery_fee_kes;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item) <> 'object'
       or coalesce(v_item->>'product_id', '') = ''
       or coalesce(v_item->>'quantity', '') !~ '^[0-9]{1,3}$' then
      raise exception 'The basket contains an invalid product or quantity.';
    end if;
    v_product_id := p_store_id || '__' || (v_item->>'product_id');
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity < 1 or v_quantity > 99 then
      raise exception 'Product quantities must be between 1 and 99.';
    end if;

    select * into v_product
    from public.products
    where id = v_product_id
      and store_id = p_store_id
      and is_available
    for share;
    if not found then
      raise exception 'A basket item is unavailable. Refresh the menu and try again.';
    end if;

    v_item_subtotal := v_item_subtotal + (v_product.price_kes * v_quantity);
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'product_name', v_product.name,
      'quantity', v_quantity,
      'unit_price_kes', v_product.price_kes,
      'line_total_kes', v_product.price_kes * v_quantity
    ));
  end loop;

  if v_promo_code is not null then
    select * into v_promo
    from public.promo_codes
    where code = v_promo_code
      and is_active
      and (starts_at is null or starts_at <= now())
      and (expires_at is null or expires_at > now())
    for update;
    if not found then
      raise exception 'That promo code is unavailable or has expired.';
    end if;
    if v_item_subtotal < v_promo.minimum_order_kes then
      raise exception 'This order does not meet the minimum amount for promo code %.', v_promo_code;
    end if;
    if exists (
      select 1 from public.promo_redemptions
      where user_id = v_user_id and promo_code = v_promo_code
    ) then
      raise exception 'You have already used promo code %.', v_promo_code;
    end if;
    if v_promo.max_redemptions is not null and v_promo.current_redemptions >= v_promo.max_redemptions then
      raise exception 'Promo code % has reached its maximum redemption limit.', v_promo_code;
    end if;
    v_discount := case v_promo.discount_type
      when 'percent' then floor(v_item_subtotal * v_promo.discount_value / 100.0)::integer
      else least(v_item_subtotal, v_promo.discount_value)
    end;

    update public.promo_codes
    set current_redemptions = current_redemptions + 1
    where code = v_promo_code;
  end if;

  v_total := v_item_subtotal + v_delivery_fee + v_service_fee - v_discount;

  insert into public.orders (
    order_number, user_id, store_id, status, currency,
    item_subtotal_kes, delivery_fee_kes, service_fee_kes,
    discount_kes, total_kes, promo_code, delivery_address,
    payment_method_type, payment_method_label
  ) values (
    'FD-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
    v_user_id, p_store_id, 'placed', 'KES',
    v_item_subtotal, v_delivery_fee, v_service_fee,
    v_discount, v_total, v_promo_code, p_delivery_address,
    p_payment_method_type, left(coalesce(p_payment_method_label, ''), 80)
  )
  returning * into v_order;

  insert into public.order_items (
    order_id, product_id, product_name, quantity, unit_price_kes, line_total_kes
  )
  select v_order.id,
         line->>'product_id',
         line->>'product_name',
         (line->>'quantity')::integer,
         (line->>'unit_price_kes')::integer,
         (line->>'line_total_kes')::integer
  from jsonb_array_elements(v_lines) as item(line);

  insert into public.order_status_history (order_id, status, note)
  values (v_order.id, 'placed', 'Order placed by customer via Fast Dine storefront');

  if v_promo_code is not null then
    insert into public.promo_redemptions (user_id, promo_code, order_id)
    values (v_user_id, v_promo_code, v_order.id);
  end if;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'placed_at', v_order.placed_at,
    'status', v_order.status,
    'item_subtotal_kes', v_order.item_subtotal_kes,
    'delivery_fee_kes', v_order.delivery_fee_kes,
    'discount_kes', v_order.discount_kes,
    'total_kes', v_order.total_kes,
    'store_id', v_order.store_id
  );
end;
$$;

revoke all on function public.create_order(text, jsonb, jsonb, text, text, text) from public, anon;
grant execute on function public.create_order(text, jsonb, jsonb, text, text, text) to authenticated;
