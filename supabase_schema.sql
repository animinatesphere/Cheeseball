-- 1. PROFILES (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  role text default 'user', -- 'admin', 'super_admin'
  avatar_url text,
  phone text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. CURRENCIES (For AdminCurrencies & Market Assets)
create table public.currencies (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- e.g., 'Bitcoin'
  symbol text not null, -- e.g., 'BTC'
  price numeric not null default 0,
  change_24h text, -- e.g., '+3.40%'
  is_positive boolean default true,
  icon_url text, -- Store URL or Lucide icon name
  color_class text, -- e.g., 'bg-orange-500' for frontend styling
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. TRANSACTIONS / ORDERS (For AdminOrders & History)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  exchange_id text unique not null, -- e.g., 'ID:voec66skoivtqpmd'
  type text not null, -- 'buy', 'sell', 'swap'
  status text default 'waiting', -- 'waiting', 'approved', 'canceled'
  
  -- From (Source)
  from_amount numeric,
  from_currency_id uuid references public.currencies(id),
  from_token_network text, -- e.g., 'TRC-20'
  
  -- To (Destination)
  to_amount numeric,
  to_currency_id uuid references public.currencies(id),
  to_token_network text, -- e.g., 'BTC'
  
  wallet_address text,
  transaction_hash text,
  fee numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. NOTIFICATIONS (For AdminNotifications & System Alerts)
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  heading text,
  body text,
  recipient_role text default 'all', -- 'admin', 'user', 'all'
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. INCOME LOGS (For AdminIncome)
create table public.income_logs (
  id uuid default uuid_generate_v4() primary key,
  source text, -- e.g., 'Transaction Fee', 'Deposit'
  amount numeric not null,
  description text,
  transaction_ref_id uuid references public.transactions(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. SYSTEM STATUS (For AdminDashboard Widgets)
create table public.system_status (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null, -- e.g., 'Cloud API Gateway'
  status text default 'Healthy', -- 'Healthy', 'Down', 'Maintenance'
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.currencies enable row level security;
alter table public.transactions enable row level security;
alter table public.notifications enable row level security;
alter table public.income_logs enable row level security;
alter table public.system_status enable row level security;

-- Basic Policies (Adjust as needed for strict security)
-- Public read access for currencies & system status
create policy "Public currencies are viewable by everyone" on public.currencies for select using (true);
create policy "System status is viewable by everyone" on public.system_status for select using (true);

-- Admins can view all profiles & transactions
-- (You'll need a way to check roles, e.g., a function or claim)
-- For now, allowing authenticated users to see their own data
create policy "Users can see their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can see their own transactions" on public.transactions for select using (auth.uid() = user_id);
