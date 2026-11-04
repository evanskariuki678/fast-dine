-- Apply to existing databases to store delivery coordinates.
alter table public.delivery_addresses
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

alter table public.delivery_addresses
  drop constraint if exists delivery_addresses_coordinates_valid;

alter table public.delivery_addresses
  add constraint delivery_addresses_coordinates_valid check (
    (latitude is null and longitude is null)
    or (latitude is not null and longitude is not null
      and latitude between -90 and 90 and longitude between -180 and 180)
  );
