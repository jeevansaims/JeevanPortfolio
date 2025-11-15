-- Create cancellation_surveys table to store user feedback when canceling
CREATE TABLE IF NOT EXISTS cancellation_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,

  -- Question 1: Main reason for leaving
  main_reason TEXT NOT NULL,
  main_reason_other TEXT,

  -- Question 2: Missing features (array of selected options)
  missing_features TEXT[],
  missing_features_other TEXT,

  -- Question 3: Satisfaction rating (1-5)
  satisfaction INTEGER NOT NULL CHECK (satisfaction >= 1 AND satisfaction <= 5),

  -- Question 4: What would convince them to stay
  convince_to_stay TEXT NOT NULL,

  -- Question 5: Likelihood to return (1-10)
  likely_to_return INTEGER NOT NULL CHECK (likely_to_return >= 1 AND likely_to_return <= 10),

  -- Question 6: Bugs/technical issues (optional)
  bugs TEXT,

  -- Question 7: New feature request (optional)
  new_feature TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Index for querying by user
  CONSTRAINT cancellation_surveys_user_id_idx UNIQUE (user_id, created_at)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS cancellation_surveys_created_at_idx ON cancellation_surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS cancellation_surveys_user_id_idx ON cancellation_surveys(user_id);

-- Enable Row Level Security
ALTER TABLE cancellation_surveys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own surveys
CREATE POLICY "Users can view their own cancellation surveys"
  ON cancellation_surveys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own surveys
CREATE POLICY "Users can create their own cancellation surveys"
  ON cancellation_surveys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can do everything (for admin/analytics)
CREATE POLICY "Service role has full access to cancellation surveys"
  ON cancellation_surveys
  FOR ALL
  USING (auth.role() = 'service_role');
