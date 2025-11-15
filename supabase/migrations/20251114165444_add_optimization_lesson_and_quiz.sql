-- Add "Optimization Concepts" lesson and quiz questions

-- Delete any existing quiz questions for this lesson (in case of re-runs)
DELETE FROM lesson_quiz_questions
WHERE lesson_id = (
  SELECT id FROM lessons WHERE slug = 'optimization-concepts'
);

-- Delete old math problems for this lesson
DELETE FROM math_problems
WHERE lesson_id = (
  SELECT id FROM lessons WHERE slug = 'optimization-concepts'
);

-- Insert the 5 quiz questions into math_problems

-- Question 1: Gradient of quadratic function
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Compute the gradient of the quadratic function:\n\n$$f(w) = w^T \begin{bmatrix} 2 & 0 \\\\ 0 & 4 \end{bmatrix} w$$',
  'For a quadratic form $w^T A w$, the gradient is $2Aw$ when $A$ is symmetric.',
  'For the quadratic form $f(w) = w^T A w$ where $A = \begin{bmatrix} 2 & 0 \\\\ 0 & 4 \end{bmatrix}$:\n\n$$\nabla f(w) = 2Aw = 2 \begin{bmatrix} 2 & 0 \\\\ 0 & 4 \end{bmatrix} \begin{bmatrix} w_1 \\\\ w_2 \end{bmatrix}$$\n\n$$= \begin{bmatrix} 4w_1 \\\\ 8w_2 \end{bmatrix}$$',
  '[4w_1, 8w_2]',
  'optimization',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'optimization-concepts')
);

-- Question 2: Gradient descent step
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Gradient descent step:\n\nGiven $f(x) = (x-5)^2$, $f''(x) = 2(x-5)$,\n\nstarting at $x_0 = 1$ with $\alpha = 0.1$, compute $x_1$.',
  'Use the gradient descent update formula: $x_{k+1} = x_k - \alpha \cdot f''(x_k)$.',
  'Apply gradient descent:\n\n$$x_1 = x_0 - \alpha \cdot f''(x_0)$$\n\n$$= 1 - 0.1 \cdot 2(1-5)$$\n\n$$= 1 - 0.1 \cdot 2(-4)$$\n\n$$= 1 - 0.1 \cdot (-8)$$\n\n$$= 1 + 0.8 = 1.8$$',
  '1.8',
  'optimization',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'optimization-concepts')
);

-- Question 3: Minimum variance portfolio
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Minimum variance portfolio (2 assets):\n\nIf $\Sigma = \begin{bmatrix} 4 & 0 \\\\ 0 & 9 \end{bmatrix}$, $\mathbf{1} = \begin{bmatrix} 1 \\\\ 1 \end{bmatrix}$,\n\ncompute the denominator $\mathbf{1}^T \Sigma^{-1} \mathbf{1}$.',
  'First compute $\Sigma^{-1}$ by inverting the diagonal matrix, then compute the matrix product.',
  'For a diagonal matrix, the inverse is:\n\n$$\Sigma^{-1} = \begin{bmatrix} 1/4 & 0 \\\\ 0 & 1/9 \end{bmatrix}$$\n\nNow compute:\n\n$$\mathbf{1}^T \Sigma^{-1} \mathbf{1} = \begin{bmatrix} 1 & 1 \end{bmatrix} \begin{bmatrix} 1/4 & 0 \\\\ 0 & 1/9 \end{bmatrix} \begin{bmatrix} 1 \\\\ 1 \end{bmatrix}$$\n\n$$= \begin{bmatrix} 1 & 1 \end{bmatrix} \begin{bmatrix} 1/4 \\\\ 1/9 \end{bmatrix} = \frac{1}{4} + \frac{1}{9} = \frac{9+4}{36} = \frac{13}{36}$$',
  '13/36',
  'finance',
  'intermediate',
  15,
  (SELECT id FROM lessons WHERE slug = 'optimization-concepts')
);

-- Question 4: Lagrangian derivative
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Lagrangian derivative:\n\nFor $L(x, \lambda) = x^2 + \lambda(x - 1)$,\n\ncompute $\frac{\partial L}{\partial x}$.',
  'Treat $\lambda$ as a constant when taking the partial derivative with respect to $x$.',
  'Taking the partial derivative with respect to $x$:\n\n$$\frac{\partial L}{\partial x} = \frac{\partial}{\partial x}[x^2 + \lambda(x - 1)]$$\n\n$$= 2x + \lambda$$\n\nThis is the stationarity condition used in Lagrange multiplier methods.',
  '2x+lambda',
  'optimization',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'optimization-concepts')
);

-- Question 5: Numerical gradient (finite difference)
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp, lesson_id)
VALUES (
  'Numerical gradient (finite difference):\n\nCompute $\frac{f(x+h) - f(x)}{h}$\n\nfor $f(x) = x^2$, $x = 2$, $h = 0.01$.',
  'Substitute the values into the finite difference formula and evaluate.',
  'Using the finite difference formula:\n\n$$\frac{f(x+h) - f(x)}{h} = \frac{(2+0.01)^2 - 2^2}{0.01}$$\n\n$$= \frac{(2.01)^2 - 4}{0.01}$$\n\n$$= \frac{4.0401 - 4}{0.01}$$\n\n$$= \frac{0.0401}{0.01} = 4.01$$\n\nThis approximates the derivative $f''(2) = 4$.',
  '4.01',
  'optimization',
  'beginner',
  10,
  (SELECT id FROM lessons WHERE slug = 'optimization-concepts')
);

-- Link the quiz questions to the lesson in correct order
WITH new_problems AS (
  SELECT id, problem, ROW_NUMBER() OVER (ORDER BY
    CASE
      WHEN problem LIKE '%Compute the gradient of the quadratic function%' THEN 1
      WHEN problem LIKE '%Gradient descent step%' THEN 2
      WHEN problem LIKE '%Minimum variance portfolio%' THEN 3
      WHEN problem LIKE '%Lagrangian derivative%' THEN 4
      WHEN problem LIKE '%Numerical gradient%' THEN 5
    END
  ) as order_num
  FROM math_problems
  WHERE lesson_id = (SELECT id FROM lessons WHERE slug = 'optimization-concepts')
)
INSERT INTO lesson_quiz_questions (lesson_id, problem_id, order_index)
SELECT
  (SELECT id FROM lessons WHERE slug = 'optimization-concepts'),
  id,
  order_num - 1  -- 0-indexed
FROM new_problems
ORDER BY order_num;
