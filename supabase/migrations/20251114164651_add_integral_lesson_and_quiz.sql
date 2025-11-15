-- Add "The Integral" lesson and quiz questions

-- Delete any existing quiz questions for this lesson (in case of re-runs)
DELETE FROM lesson_quiz_questions
WHERE lesson_id = (
  SELECT id FROM lessons WHERE slug = 'the-integral'
);

-- Delete old math problems for this lesson
DELETE FROM math_problems
WHERE lesson_id = (
  SELECT id FROM lessons WHERE slug = 'the-integral'
);

-- Insert the 5 quiz questions into math_problems

-- Question 1: Basic definite integral
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the integral:\n\n$$\int_0^1 3x^2 \, dx$$',
  'Use the power rule for integration: $\int x^n \, dx = \frac{x^{n+1}}{n+1} + C$.',
  'Using the power rule:\n\n$$\int_0^1 3x^2 \, dx = 3 \cdot \left[\frac{x^3}{3}\right]_0^1$$\n\n$$= 3 \cdot \left(\frac{1^3}{3} - \frac{0^3}{3}\right)$$\n\n$$= 3 \cdot \frac{1}{3} = 1$$',
  '1',
  'calculus',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'the-integral')
);

-- Question 2: Expected value of triangular distribution
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Expected value of a triangular distribution:\n\nGiven $p(r) = 2r$ for $0 \le r \le 1$, compute $E[R]$:\n\n$$E[R] = \int_0^1 r \cdot p(r) \, dr$$',
  'Substitute $p(r) = 2r$ into the integral and use the power rule.',
  'Substitute the density function:\n\n$$E[R] = \int_0^1 r \cdot 2r \, dr = \int_0^1 2r^2 \, dr$$\n\n$$= 2 \left[\frac{r^3}{3}\right]_0^1$$\n\n$$= 2 \cdot \frac{1}{3} = \frac{2}{3}$$',
  '2/3',
  'finance',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'the-integral')
);

-- Question 3: Present value integral
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the present value:\n\n$$PV = \int_0^2 5e^{-0.1t} \, dt$$',
  'Use the exponential integration rule: $\int e^{ax} \, dx = \frac{1}{a}e^{ax} + C$.',
  'Using the exponential rule:\n\n$$PV = \int_0^2 5e^{-0.1t} \, dt = 5 \left[\frac{e^{-0.1t}}{-0.1}\right]_0^2$$\n\n$$= 5 \cdot \frac{1}{-0.1} \left(e^{-0.2} - e^0\right)$$\n\n$$= -50(e^{-0.2} - 1)$$\n\n$$= 50(1 - e^{-0.2})$$',
  '50(1-e^(-0.2))',
  'finance',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'the-integral')
);

-- Question 4: Return curve integral
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the integral:\n\n$$\int_0^2 0.05t \, dt$$',
  'Use the power rule. Remember that $t = t^1$.',
  'Using the power rule:\n\n$$\int_0^2 0.05t \, dt = 0.05 \left[\frac{t^2}{2}\right]_0^2$$\n\n$$= 0.05 \cdot \frac{4}{2}$$\n\n$$= 0.05 \cdot 2 = 0.1$$\n\nThis represents a 10% total return over the period.',
  '0.1',
  'calculus',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'the-integral')
);

-- Question 5: Variance integral
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Variance integral (simple):\n\nIf a random variable has density $p(x) = 1$ for $0 \le x \le 1$, compute:\n\n$$\int_0^1 (x - 0.5)^2 \, dx$$',
  'Expand $(x - 0.5)^2$ first, then integrate term by term.',
  'Expand the squared term:\n\n$$(x - 0.5)^2 = x^2 - x + 0.25$$\n\nIntegrate:\n\n$$\int_0^1 (x^2 - x + 0.25) \, dx = \left[\frac{x^3}{3} - \frac{x^2}{2} + 0.25x\right]_0^1$$\n\n$$= \frac{1}{3} - \frac{1}{2} + 0.25$$\n\n$$= \frac{1}{3} - \frac{1}{2} + \frac{1}{4} = \frac{4 - 6 + 3}{12} = \frac{1}{12}$$',
  '1/12',
  'finance',
  'advanced',
  20,
  (SELECT id FROM lessons WHERE slug = 'the-integral')
);

-- Link the quiz questions to the lesson in correct order
WITH new_problems AS (
  SELECT id, problem, ROW_NUMBER() OVER (ORDER BY
    CASE
      WHEN problem LIKE '%int_0^1 3x^2%' THEN 1
      WHEN problem LIKE '%Expected value of a triangular%' THEN 2
      WHEN problem LIKE '%int_0^2 5e^{-0.1t}%' THEN 3
      WHEN problem LIKE '%int_0^2 0.05t%' THEN 4
      WHEN problem LIKE '%Variance integral%' THEN 5
    END
  ) as order_num
  FROM math_problems
  WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'the-integral')
)
INSERT INTO lesson_quiz_questions (lesson_id, problem_id, order_index)
SELECT
  (SELECT id FROM lessons WHERE slug = 'the-integral'),
  id,
  order_num - 1  -- 0-indexed
FROM new_problems
ORDER BY order_num;
