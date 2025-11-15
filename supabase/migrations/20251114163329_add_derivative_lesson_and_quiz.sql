-- Add "The Derivative" lesson and quiz questions

-- First, verify the lesson exists (it should already be in the lessons table)
-- If not, we would need to insert it. Let's assume it exists from the module setup.

-- Delete any existing quiz questions for this lesson (in case of re-runs)
DELETE FROM lesson_quiz_questions
WHERE lesson_id = (
  SELECT id FROM lessons WHERE slug = 'the-derivative'
);

-- Delete old math problems for this lesson
DELETE FROM math_problems
WHERE lesson_id = (
  SELECT id FROM lessons WHERE slug = 'the-derivative'
);

-- Insert the 5 quiz questions into math_problems

-- Question 1: Basic derivative with power rule
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the derivative:\n\n$$\frac{d}{dS}(S^2 + 3S)$$',
  'Use the power rule: $\frac{d}{dx}x^n = nx^{n-1}$, and remember that derivatives are linear.',
  'Apply the power rule to each term:\n\n$$\frac{d}{dS}(S^2 + 3S) = \frac{d}{dS}S^2 + \frac{d}{dS}(3S)$$\n\n$$= 2S^{2-1} + 3S^{1-1}$$\n\n$$= 2S + 3$$',
  '2S+3',
  'calculus',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'the-derivative')
);

-- Question 2: Derivative of discount factor
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the derivative of the discount factor:\n\n$$\frac{d}{dr}e^{-rT}$$\n\nAssume $T = 2$.',
  'Remember that $\frac{d}{dx}e^{ax} = ae^{ax}$. Here $T$ is a constant.',
  'Using the chain rule with $T = 2$:\n\n$$\frac{d}{dr}e^{-rT} = \frac{d}{dr}e^{-2r} = -2e^{-2r}$$\n\nThe derivative is the exponent coefficient $(-2)$ times the original function.',
  '-2e^(-2r)',
  'calculus',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'the-derivative')
);

-- Question 3: Polynomial derivative
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the derivative:\n\n$$\frac{d}{dx}(3x^3 - 4x)$$',
  'Use the power rule on each term separately. Remember that $\frac{d}{dx}x = 1$.',
  'Apply the power rule term by term:\n\n$$\frac{d}{dx}(3x^3 - 4x) = 3 \cdot 3x^2 - 4 \cdot 1$$\n\n$$= 9x^2 - 4$$',
  '9x^2-4',
  'calculus',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'the-derivative')
);

-- Question 4: Delta at d1=0
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Finance-related: Delta of a call option.\n\nIf $\Delta = \Phi(d_1)$ and $d_1 = 0$, what is Delta?\n\nRecall: $\Phi(0) = 0.5$',
  'The standard normal CDF at zero gives you the probability that a standard normal random variable is less than zero.',
  'Given:\n- $\Delta = \Phi(d_1)$\n- $d_1 = 0$\n- $\Phi(0) = 0.5$\n\nTherefore:\n$$\Delta = \Phi(0) = 0.5$$\n\nThis means the option is exactly at-the-money, with a 50% probability of expiring in-the-money.',
  '0.5',
  'finance',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'the-derivative')
);

-- Question 5: Derivative of call payoff
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Finance-related: Piecewise derivative of the payoff.\n\nFor the call payoff:\n$$f(S_T) = \max(S_T - K, 0)$$\n\nWhat is $f''(S_T)$ when $S_T = 120$ and $K = 100$?',
  'When $S_T > K$, the payoff function is $f(S_T) = S_T - K$. What is the slope of a linear function?',
  'Since $S_T = 120 > K = 100$, we are in the region where:\n$$f(S_T) = S_T - K$$\n\nThe derivative is:\n$$f''(S_T) = \frac{d}{dS_T}(S_T - K) = 1$$\n\nThe slope is constant at 1 for all $S_T > K$ (the option behaves like owning the stock minus a fixed amount).',
  '1',
  'finance',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'the-derivative')
);

-- Link the quiz questions to the lesson in correct order
WITH new_problems AS (
  SELECT id, problem, ROW_NUMBER() OVER (ORDER BY
    CASE
      WHEN problem LIKE '%frac{d}{dS}(S^2 + 3S)%' THEN 1
      WHEN problem LIKE '%frac{d}{dr}e^{-rT}%' THEN 2
      WHEN problem LIKE '%frac{d}{dx}(3x^3 - 4x)%' THEN 3
      WHEN problem LIKE '%Delta of a call option%' THEN 4
      WHEN problem LIKE '%Piecewise derivative%' THEN 5
    END
  ) as order_num
  FROM math_problems
  WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'the-derivative')
)
INSERT INTO lesson_quiz_questions (lesson_id, problem_id, order_index)
SELECT
  (SELECT id FROM lessons WHERE slug = 'the-derivative'),
  id,
  order_num - 1  -- 0-indexed
FROM new_problems
ORDER BY order_num;
