-- ==============================================================================
-- FIX PROFILE CREATION & EMAIL SYNC
-- Run this script in Supabase SQL Editor.
-- It fixes the "column profiles.email does not exist" error and the missing profile error.
-- ==============================================================================

-- 0. Add email column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- 1. Create/Update function to handle new user signup (including email)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the trigger (or replace if exists)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Backfill missing profiles
insert into public.profiles (id, full_name, email)
select id, raw_user_meta_data->>'full_name', email
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;

-- 4. Backfill email for existing profiles that might be missing it
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND public.profiles.email IS NULL;
