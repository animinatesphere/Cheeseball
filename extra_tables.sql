-- 1. GIFT CARD TRADES
create table public.gift_card_trades (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  card_type text not null, -- e.g., 'Amazon', 'iTunes'
  card_amount numeric not null,
  currency_to_receive text, -- e.g., 'NGN', 'USDT'
  status text default 'pending', -- 'pending', 'processing', 'completed', 'rejected'
  image_url text, -- For proof upload
  card_code text, -- Encrypted or hidden in production
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. PROMO CODES
create table public.promo_codes (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  discount_percentage numeric default 0,
  is_active boolean default true,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. REFERRAL REWARDS
create table public.referral_rewards (
  id uuid default uuid_generate_v4() primary key,
  referrer_id uuid references public.profiles(id),
  referred_user_id uuid references public.profiles(id),
  reward_amount numeric default 0,
  status text default 'pending', -- 'pending', 'paid'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.gift_card_trades enable row level security;
alter table public.promo_codes enable row level security;
alter table public.referral_rewards enable row level security;

-- RLS Policies
create policy "Users can see their own gift card trades" on public.gift_card_trades for select using (auth.uid() = user_id);
create policy "Users can create their own gift card trades" on public.gift_card_trades for insert with check (auth.uid() = user_id);
create policy "Promo codes are viewable by everyone" on public.promo_codes for select using (true);
create policy "Users can see their own referral rewards" on public.referral_rewards for select using (auth.uid() = referrer_id);
