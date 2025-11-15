-- Add test exam questions for Calculus for Quants exam

-- Get exam ID
WITH exam AS (
  SELECT id FROM module_exams
  WHERE module_id = (SELECT id FROM modules WHERE slug = 'calculus-for-quants')
  LIMIT 1
),
-- Insert 5 test questions
q1 AS (
  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES (
    'Compute the limit: lim(x to 2) of (3x^2 - x + 4)',
    'For polynomials, substitute x directly.',
    'Substitute x = 2: 3(4) - 2 + 4 = 12 - 2 + 4 = 14',
    '14',
    'calculus',
    'beginner',
    4
  )
  RETURNING id
),
q2 AS (
  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES (
    'Compute: d/dx of (4x^3 - 5x)',
    'Use power rule.',
    'Apply power rule: 12x^2 - 5',
    '12x^2-5',
    'calculus',
    'beginner',
    4
  )
  RETURNING id
),
q3 AS (
  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES (
    'Compute: integral from 0 to 1 of 6x dx',
    'Use power rule for integration.',
    'Integral equals 6 * [x^2/2] from 0 to 1 = 3',
    '3',
    'calculus',
    'beginner',
    4
  )
  RETURNING id
),
q4 AS (
  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES (
    'Find critical point of f(x) = x^2 - 4x + 1',
    'Set derivative to zero.',
    'f prime(x) = 2x - 4 = 0, so x = 2',
    '2',
    'optimization',
    'beginner',
    4
  )
  RETURNING id
),
q5 AS (
  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES (
    'If Delta = 0.5, is the option at-the-money?',
    'Delta of 0.5 indicates ATM.',
    'Yes, Delta = 0.5 means at-the-money.',
    'yes',
    'finance',
    'beginner',
    4
  )
  RETURNING id
)
-- Link to exam
INSERT INTO module_exam_questions (exam_id, problem_id, order_index, section_name)
SELECT (SELECT id FROM exam), id, 0, 'Section A - Limits & Continuity' FROM q1
UNION ALL
SELECT (SELECT id FROM exam), id, 1, 'Section B - Derivatives' FROM q2
UNION ALL
SELECT (SELECT id FROM exam), id, 2, 'Section C - Integrals' FROM q3
UNION ALL
SELECT (SELECT id FROM exam), id, 3, 'Section D - Optimization' FROM q4
UNION ALL
SELECT (SELECT id FROM exam), id, 4, 'Section B - Derivatives' FROM q5;
