-- Create problem_categories table
CREATE TABLE IF NOT EXISTS problem_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE problem_categories IS 'Fixed list of problem categories for math and coding problems';

-- Insert math categories
INSERT INTO problem_categories (id, name, description) VALUES
  ('probability', 'Probability', 'Basic probability theory and applications'),
  ('expected-value', 'Expected Value', 'Calculating and working with expected values'),
  ('variance-covariance', 'Variance & Covariance', 'Variance, covariance, and correlation'),
  ('combinatorics', 'Combinatorics', 'Counting, permutations, and combinations'),
  ('random-variables', 'Random Variables', 'Discrete and continuous random variables'),
  ('joint-distributions', 'Joint Distributions & Conditional Probability', 'Joint distributions, conditional probability, and independence'),
  ('bayes-rule', 'Bayes'' Rule', 'Bayesian inference and applications'),
  ('statistics-basics', 'Statistics Basics', 'Descriptive statistics, sampling, and estimation'),
  ('inequalities', 'Inequalities', 'Mathematical inequalities and their applications'),
  ('limit-theorems', 'Limit Theorems', 'Central Limit Theorem, Law of Large Numbers, etc.'),
  ('calculus', 'Calculus', 'Differentiation, integration, and applications'),
  ('multivariable-calculus', 'Multivariable Calculus', 'Partial derivatives, gradients, and multiple integrals'),
  ('linear-algebra', 'Linear Algebra', 'Vectors, matrices, eigenvalues, and transformations'),
  ('vector-calculus', 'Vector Calculus', 'Vector fields, divergence, curl, and line integrals'),
  ('optimization-basics', 'Optimization Basics', 'Finding maxima and minima'),
  ('convexity', 'Convexity', 'Convex functions and optimization'),
  ('lagrange-multipliers', 'Lagrange Multipliers', 'Constrained optimization using Lagrange multipliers'),
  ('quadratic-optimization', 'Quadratic Optimization', 'Quadratic programming and portfolio optimization'),
  ('brownian-motion', 'Brownian Motion Basics', 'Introduction to Brownian motion and random walks'),
  ('stochastic-processes', 'Stochastic Processes', 'Time series, Markov chains, and stochastic calculus'),
  ('normal-distribution', 'Normal Distribution Applications', 'Normal distribution and its applications in finance'),
  ('correlation-regression', 'Correlation & Regression Basics', 'Linear regression and correlation analysis'),
  ('risk-metrics', 'Risk Metrics', 'VaR, CVaR, Sharpe ratio, and other risk measures'),
  -- Insert coding categories
  ('numpy', 'NumPy', 'NumPy arrays, operations, and numerical computing'),
  ('pandas', 'Pandas', 'Data manipulation with Pandas DataFrames'),
  ('python-basics', 'Python Basics', 'Fundamental Python programming concepts'),
  ('data-structures', 'Data Structures', 'Lists, dictionaries, sets, and other data structures'),
  ('algorithms', 'Algorithms', 'Sorting, searching, and algorithm design'),
  ('problem-solving', 'Problem Solving', 'General problem-solving and coding challenges')
ON CONFLICT (id) DO NOTHING;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_math_problems_category ON math_problems(category);

-- Create an index for faster lookups on coding_problems too
CREATE INDEX IF NOT EXISTS idx_coding_problems_category ON coding_problems(category);
