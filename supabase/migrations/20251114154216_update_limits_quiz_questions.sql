-- Update quiz questions for "Limits & Continuity" lesson

-- First, delete old quiz questions for this lesson
DELETE FROM lesson_quiz_questions
WHERE lesson_id = (
  SELECT id FROM lessons WHERE slug = 'limits-and-continuity'
);

-- Delete the old math problems that were used for the quiz
DELETE FROM math_problems
WHERE lesson_id = (
  SELECT id FROM lessons WHERE slug = 'limits-and-continuity'
);

-- Now insert the new 5 quiz questions into math_problems
-- Question 1: Basic polynomial limit
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the limit:\n\n$$\lim_{x \to 3} (2x^2 - x + 1)$$',
  'For polynomial functions, you can directly substitute the value of $x$.',
  'Since this is a polynomial, we can substitute $x = 3$ directly:\n\n$$2(3)^2 - 3 + 1 = 2(9) - 3 + 1 = 18 - 3 + 1 = 16$$',
  '16',
  'calculus',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'limits-and-continuity')
);

-- Question 2: Derivative limit
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the limit:\n\n$$\lim_{h \to 0} \frac{(S_0 + h)^2 - S_0^2}{h}$$\n\n(This is the derivative of $S^2$.)',
  'Expand the numerator $(S_0 + h)^2$ and simplify before taking the limit.',
  'Expand the numerator:\n\n$$(S_0 + h)^2 - S_0^2 = S_0^2 + 2S_0h + h^2 - S_0^2 = 2S_0h + h^2$$\n\nNow divide by $h$:\n\n$$\frac{2S_0h + h^2}{h} = \frac{h(2S_0 + h)}{h} = 2S_0 + h$$\n\nAs $h \to 0$: $2S_0 + h \to 2S_0$',
  '2S_0',
  'calculus',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'limits-and-continuity')
);

-- Question 3: Removable discontinuity
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the limit (removable discontinuity):\n\n$$\lim_{x \to 2} \frac{x^2 - 4}{x - 2}$$',
  'Factor the numerator using the difference of squares formula: $a^2 - b^2 = (a-b)(a+b)$.',
  'Factor the numerator:\n\n$$x^2 - 4 = (x-2)(x+2)$$\n\nSo the expression becomes:\n\n$$\frac{(x-2)(x+2)}{x-2} = x + 2$$ (for $x \neq 2$)\n\nNow take the limit:\n\n$$\lim_{x \to 2} (x + 2) = 2 + 2 = 4$$',
  '4',
  'calculus',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'limits-and-continuity')
);

-- Question 4: Call option payoff limit
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Finance-related: Compute the limit of a call option payoff as spot approaches strike:\n\n$$\lim_{S_T \to K} \max(S_T - K, 0)$$',
  'The max function selects the larger of two values. What happens when $S_T = K$?',
  'As $S_T$ approaches $K$, we have:\n\n$$S_T - K \to 0$$\n\nSo: $$\max(S_T - K, 0) \to \max(0, 0) = 0$$\n\nThe payoff is continuous at the strike but has a kink (the derivative changes).',
  '0',
  'finance',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'limits-and-continuity')
);

-- Question 5: Black-Scholes delta limit
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Finance-related: Limit of BlackScholes delta as volatility ’ 0 (in-the-money case).\n\nAssume $S_0 > K$. What is:\n\n$$\lim_{\sigma \to 0} \Delta_{\text{call}}(\sigma)$$',
  'When volatility is near zero and the option is in-the-money, think about how certain you are that it will expire in-the-money.',
  'When volatility approaches zero and $S_0 > K$ (in-the-money):\n\n- The stock price has almost no randomness\n- The option is almost certain to expire in-the-money\n- Delta measures how much the option price moves with the stock\n- For a deep in-the-money option with no volatility, it behaves like owning the stock directly\n\nTherefore: $$\Delta \to 1$$',
  '1',
  'finance',
  'advanced',
  20,
  (SELECT id FROM lessons WHERE slug = 'limits-and-continuity')
);

-- Now link these new problems to the lesson_quiz_questions table
-- We need to get the IDs of the problems we just inserted
-- Insert them in the correct order (1-5)

WITH new_problems AS (
  SELECT id, problem, ROW_NUMBER() OVER (ORDER BY
    CASE
      WHEN problem LIKE '%lim_{x \to 3}%' THEN 1
      WHEN problem LIKE '%lim_{h \to 0}%' THEN 2
      WHEN problem LIKE '%lim_{x \to 2}%' THEN 3
      WHEN problem LIKE '%lim_{S_T \to K}%' THEN 4
      WHEN problem LIKE '%lim_{\sigma \to 0}%' THEN 5
    END
  ) as order_num
  FROM math_problems
  WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'limits-and-continuity')
)
INSERT INTO lesson_quiz_questions (lesson_id, problem_id, order_index)
SELECT
  (SELECT id FROM lessons WHERE slug = 'limits-and-continuity'),
  id,
  order_num - 1  -- 0-indexed
FROM new_problems
ORDER BY order_num;
