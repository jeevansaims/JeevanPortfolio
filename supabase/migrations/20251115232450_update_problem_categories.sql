-- Add type column to problem_categories
ALTER TABLE problem_categories
ADD COLUMN type TEXT NOT NULL DEFAULT 'math';

-- Add check constraint to ensure type is either 'math' or 'coding'
ALTER TABLE problem_categories
ADD CONSTRAINT check_category_type
CHECK (type IN ('math', 'coding'));

-- First, update coding_problems that use 'data-structures' and 'algorithms' to use 'python-basics'
UPDATE coding_problems
SET category = 'python-basics'
WHERE category IN ('data-structures', 'algorithms');

-- Update coding_problems that use 'problem-solving' to use appropriate category
UPDATE coding_problems
SET category = 'python-basics'
WHERE category = 'problem-solving';

-- Now delete the coding categories that weren't requested
DELETE FROM problem_categories 
WHERE id IN ('data-structures', 'algorithms', 'problem-solving');

-- Update existing categories to type='coding' where appropriate
UPDATE problem_categories
SET type = 'coding',
    description = 'Vectors, matrices, broadcasting'
WHERE id = 'numpy';

UPDATE problem_categories
SET type = 'coding',
    description = 'Data cleaning, rolling windows, returns'
WHERE id = 'pandas';

UPDATE problem_categories
SET type = 'coding',
    description = 'Loops, functions'
WHERE id = 'python-basics';

-- Insert the new coding categories
INSERT INTO problem_categories (id, name, description, type) VALUES
  -- Python libraries
  ('matplotlib', 'Matplotlib', 'Plotting timeseries, histograms', 'coding'),
  ('scipy', 'SciPy', 'Optimization, stats', 'coding'),
  ('statsmodels', 'Statsmodels', 'Regressions', 'coding'),
  ('yfinance', 'yfinance / Data Loading', 'Loading financial data', 'coding'),
  -- Quant finance concepts
  ('return-calculations', 'Return Calculations', 'Calculating returns from price data', 'coding'),
  ('volatility-calculations', 'Volatility Calculations', 'Computing volatility and risk metrics', 'coding'),
  ('sharpe-ratio', 'Sharpe Ratio', 'Risk-adjusted performance metrics', 'coding'),
  ('drawdown', 'Drawdown', 'Measuring drawdowns and recovery', 'coding'),
  ('backtesting-basics', 'Backtesting Basics', 'Testing trading strategies', 'coding'),
  ('monte-carlo', 'Monte Carlo Simulations', 'Probabilistic simulations', 'coding'),
  ('portfolio-optimization', 'Portfolio Optimization', 'Simple portfolio optimization', 'coding')
ON CONFLICT (id) DO NOTHING;

-- Add comment to type column
COMMENT ON COLUMN problem_categories.type IS 'Type of category: math or coding';
