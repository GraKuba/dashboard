-- Migration: Production Hardening
-- 1. Add user_id to monthly_reports
ALTER TABLE monthly_reports 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Enable RLS
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Drop existing policies to be clean
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON monthly_reports;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own reports" 
ON monthly_reports 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own reports" 
ON monthly_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own reports" 
ON monthly_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own data
CREATE POLICY "Users can delete own reports" 
ON monthly_reports 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Add Data Integrity Constraints
ALTER TABLE monthly_reports 
ADD CONSTRAINT check_boxes_produced_positive CHECK (boxes_produced >= 0),
ADD CONSTRAINT check_irrigation_positive CHECK (irrigation_hours >= 0),
ADD CONSTRAINT check_diesel_positive CHECK (diesel_consumed_liters >= 0);
