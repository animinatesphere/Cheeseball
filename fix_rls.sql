-- ==============================================================================
-- FIX RLS POLICIES
-- Run this script in your Supabase SQL Editor to unblock Admin & User actions.
-- ==============================================================================

-- 1. CURRENCIES (Admin actions)
-- Allow authenticated users to insert, update, delete currencies.
CREATE POLICY "Enable insert for authenticated users only" ON "public"."currencies"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "public"."currencies"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON "public"."currencies"
FOR DELETE
TO authenticated
USING (true);

-- 2. TRANSACTIONS (User actions: Buy/Swap)
-- Allow users to create their own transaction records.
CREATE POLICY "Enable insert for users based on user_id" ON "public"."transactions"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. NOTIFICATIONS (Admin actions)
CREATE POLICY "Enable insert for authenticated users only" ON "public"."notifications"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. INCOME LOGS (Admin actions)
CREATE POLICY "Enable insert for authenticated users only" ON "public"."income_logs"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. SYSTEM STATUS (Admin actions)
CREATE POLICY "Enable insert/update for authenticated users" ON "public"."system_status"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
