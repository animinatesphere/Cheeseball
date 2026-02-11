-- ==============================================================================
-- FIX TRANSACTION UPDATE POLICY
-- Run this script in Supabase SQL Editor to allow Admins to approve/decline orders.
-- ==============================================================================

-- Allow authenticated users (Admins) to update transaction details (like status)
CREATE POLICY "Enable update for authenticated users only" ON "public"."transactions"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
