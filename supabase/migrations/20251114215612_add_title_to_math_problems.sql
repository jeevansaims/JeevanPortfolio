-- Add title column to math_problems table
ALTER TABLE math_problems ADD COLUMN IF NOT EXISTS title TEXT;

-- Add comment
COMMENT ON COLUMN math_problems.title IS 'Optional short title for the math problem';
