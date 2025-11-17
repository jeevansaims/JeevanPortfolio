-- Add coding-specific categories
INSERT INTO problem_categories (id, name, description) VALUES
  ('numpy', 'NumPy', 'NumPy arrays, operations, and numerical computing'),
  ('pandas', 'Pandas', 'Data manipulation with Pandas DataFrames'),
  ('python-basics', 'Python Basics', 'Fundamental Python programming concepts'),
  ('data-structures', 'Data Structures', 'Lists, dictionaries, sets, and other data structures'),
  ('algorithms', 'Algorithms', 'Sorting, searching, and algorithm design'),
  ('problem-solving', 'Problem Solving', 'General problem-solving and coding challenges')
ON CONFLICT (id) DO NOTHING;

-- Map existing math_problems categories to new category IDs
UPDATE math_problems
SET category = CASE 
  WHEN category = 'Probability' THEN 'probability'
  WHEN category = 'finance' THEN 'risk-metrics'
  WHEN category = 'optimization' THEN 'optimization-basics'
  WHEN category = 'calculus' THEN 'calculus'
  WHEN category IS NULL OR category = '' THEN 'calculus'
  ELSE 'calculus'
END;

-- Map existing coding_problems categories to new category IDs
UPDATE coding_problems
SET category = CASE 
  WHEN category = 'fill_gap' THEN 'python-basics'
  WHEN category = 'numpy' THEN 'numpy'
  WHEN category = 'pandas' THEN 'pandas'
  WHEN category = 'problem_solving' THEN 'problem-solving'
  WHEN category IS NULL OR category = '' THEN 'python-basics'
  ELSE 'python-basics'
END;

-- Add foreign key constraint to math_problems
ALTER TABLE math_problems
ADD CONSTRAINT fk_math_problems_category
FOREIGN KEY (category) REFERENCES problem_categories(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Add foreign key constraint to coding_problems
ALTER TABLE coding_problems
ADD CONSTRAINT fk_coding_problems_category
FOREIGN KEY (category) REFERENCES problem_categories(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Add comments
COMMENT ON CONSTRAINT fk_math_problems_category ON math_problems IS 'Ensures category must exist in problem_categories table';
COMMENT ON CONSTRAINT fk_coding_problems_category ON coding_problems IS 'Ensures category must exist in problem_categories table';
