create table public.orders (
  id text primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  total numeric(12, 2) not null check (total >= 0),
  payment_method text not null default 'upi',
  payment_status text not null default 'Payment under verification'
    check (payment_status in ('Payment under verification', 'Paid', 'Rejected')),
  utr text,
  payment_screenshot text,
  order_status text not null default 'Pending'
    check (order_status in ('Pending', 'Ready', 'Shipped', 'Delivered')),
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  payment_reviewed_at timestamptz
);

alter table public.orders enable row level security;

-- Keep customer order writes behind a server or Supabase Edge Function.
-- Do not expose admin approval policies to the browser anon key.
create policy "public can create orders"
on public.orders for insert
to anon, authenticated
with check (true);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_payment_status_idx on public.orders (payment_status);
