-- Add all 25 Calculus for Quants exam questions

-- Get the exam ID for linking
DO $$
DECLARE
  exam_uuid UUID;
  q_ids UUID[25];
BEGIN
  -- Get exam ID
  SELECT id INTO exam_uuid FROM module_exams
  WHERE module_id = (SELECT id FROM modules WHERE slug = 'calculus-for-quants');

  -- Section A: Limits & Continuity (Questions 1-6)

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute the limit:\n\n$$\lim_{x \to 2} (3x^2 - x + 4)$$',
   'For polynomial functions, you can directly substitute the value of $x$.',
   'Since this is a polynomial, substitute $x = 2$:\n\n$$3(2)^2 - 2 + 4 = 12 - 2 + 4 = 14$$',
   '14', 'calculus', 'beginner', 4)
  RETURNING id INTO q_ids[1];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute the limit:\n\n$$\lim_{h \to 0} \frac{(S_0 + h)^2 - S_0^2}{h}$$',
   'Expand $(S_0 + h)^2$ and simplify before taking the limit.',
   'Expand: $(S_0 + h)^2 - S_0^2 = 2S_0h + h^2$\n\nDivide by $h$: $2S_0 + h$\n\nAs $h \to 0$: $2S_0$',
   '2S_0', 'calculus', 'intermediate', 4)
  RETURNING id INTO q_ids[2];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Determine whether the following limit exists:\n\n$$\lim_{x \to 0} \frac{|x|}{x}$$',
   'Consider left and right limits. $|x| = -x$ when $x < 0$ and $|x| = x$ when $x > 0$.',
   'Left limit: $-1$, Right limit: $1$. Since they differ, limit does not exist.',
   'does not exist', 'calculus', 'intermediate', 4)
  RETURNING id INTO q_ids[3];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('For the call payoff $f(S_T) = \max(S_T - K, 0)$, compute the left and right limits at $S_T = K$.',
   'Consider what happens as you approach $K$ from below and above.',
   'Both left and right limits equal $0$ at $S_T = K$.',
   '0', 'finance', 'intermediate', 4)
  RETURNING id INTO q_ids[4];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute: $\lim_{\sigma \to 0} C(\sigma)$ for an in-the-money call option.',
   'When volatility approaches zero, the option becomes almost certain to expire in-the-money.',
   'The price converges to intrinsic value: $S_0 - Ke^{-rT}$',
   'S_0-Ke^(-rT)', 'finance', 'advanced', 4)
  RETURNING id INTO q_ids[5];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Is $g(x) = \begin{cases} x+1, & x<1 \\ 5, & x=1 \\ 2x-1, & x>1 \end{cases}$ continuous at $x=1$?',
   'Check if $\lim_{x \to 1} g(x) = g(1)$.',
   'Left limit = 2, Right limit = 1, $g(1) = 5$. Not continuous.',
   'no', 'calculus', 'intermediate', 4)
  RETURNING id INTO q_ids[6];

  -- Section B: Derivatives (Questions 7-13)

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute: $\frac{d}{dx}(4x^3 - 5x)$',
   'Use the power rule.',
   '$12x^2 - 5$',
   '12x^2-5', 'calculus', 'beginner', 4)
  RETURNING id INTO q_ids[7];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute the derivative of $D(r) = e^{-rT}$ with respect to $r$.',
   'Use chain rule.',
   '$-Te^{-rT}$',
   '-Te^(-rT)', 'finance', 'intermediate', 4)
  RETURNING id INTO q_ids[8];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('For $f(S_T) = \max(S_T - K, 0)$, compute $f''(S_T)$ when $S_T > K$.',
   'The function is $S_T - K$ when $S_T > K$.',
   'The derivative is $1$.',
   '1', 'finance', 'beginner', 4)
  RETURNING id INTO q_ids[9];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute: $\frac{d}{dx}(x^2 e^{2x})$',
   'Use product rule.',
   '$2xe^{2x}(1+x)$',
   '2xe^(2x)(1+x)', 'calculus', 'intermediate', 4)
  RETURNING id INTO q_ids[10];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('If $\Delta = \Phi(d_1)$ and $d_1 = 0$, what is Delta? ($\Phi(0) = 0.5$)',
   'Substitute into the formula.',
   '$\Delta = 0.5$',
   '0.5', 'finance', 'beginner', 4)
  RETURNING id INTO q_ids[11];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute: $\frac{d}{dx}\ln(x^2 + 1)$',
   'Use chain rule.',
   '$\frac{2x}{x^2+1}$',
   '2x/(x^2+1)', 'calculus', 'intermediate', 4)
  RETURNING id INTO q_ids[12];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Gradient descent: $f(x) = (x-3)^2$, $x_0 = 1$, $\alpha = 0.1$. Find $x_1$.',
   '$f''(x) = 2(x-3)$, use $x_1 = x_0 - \alpha f''(x_0)$.',
   '$x_1 = 1 - 0.1(-4) = 1.4$',
   '1.4', 'optimization', 'beginner', 4)
  RETURNING id INTO q_ids[13];

  -- Section C: Integrals (Questions 14-19)

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute: $\int_0^1 6x \, dx$',
   'Power rule.',
   '$6[\frac{x^2}{2}]_0^1 = 3$',
   '3', 'calculus', 'beginner', 4)
  RETURNING id INTO q_ids[14];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute: $\int e^{3x} \, dx$',
   'Exponential rule.',
   '$\frac{1}{3}e^{3x} + C$',
   '(1/3)e^(3x)+C', 'calculus', 'beginner', 4)
  RETURNING id INTO q_ids[15];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('If $p(r) = 2r$ on $[0,1]$, compute $E[R] = \int_0^1 r \cdot 2r \, dr$',
   'Simplify to $2\int r^2 dr$.',
   '$\frac{2}{3}$',
   '2/3', 'finance', 'intermediate', 4)
  RETURNING id INTO q_ids[16];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute: $PV = \int_0^2 5e^{-0.2t} \, dt$',
   'Exponential integration.',
   '$25(1-e^{-0.4})$',
   '25(1-e^(-0.4))', 'finance', 'intermediate', 4)
  RETURNING id INTO q_ids[17];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute: $\int_0^3 (t^2 + 1) \, dt$',
   'Integrate each term.',
   '$9 + 3 = 12$',
   '12', 'calculus', 'beginner', 4)
  RETURNING id INTO q_ids[18];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('For $p(x) = 1$ on $[0,1]$, compute $\int_0^1 (x - 0.5)^2 \, dx$',
   'Expand first.',
   '$\frac{1}{12}$',
   '1/12', 'finance', 'advanced', 4)
  RETURNING id INTO q_ids[19];

  -- Section D: Optimization (Questions 20-25)

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Find critical point of $f(x) = x^2 - 4x + 1$ where $f''(x) = 0$.',
   'Take derivative and solve.',
   '$x = 2$',
   '2', 'optimization', 'beginner', 4)
  RETURNING id INTO q_ids[20];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Gradient of $f(w) = w^T \begin{bmatrix} 2 & 0 \\ 0 & 8 \end{bmatrix} w$',
   '$\nabla f = 2Aw$.',
   '$[4w_1, 16w_2]$',
   '[4w_1, 16w_2]', 'optimization', 'intermediate', 4)
  RETURNING id INTO q_ids[21];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Gradient descent: $f(x) = (x-7)^2$, $x_0 = 0$, $\alpha = 0.2$. Find $x_1$.',
   'Use update formula.',
   '$x_1 = 2.8$',
   '2.8', 'optimization', 'beginner', 4)
  RETURNING id INTO q_ids[22];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('For $L(x, \lambda) = x^2 + \lambda(x - 1)$, find $\frac{\partial L}{\partial x}$.',
   'Treat $\lambda$ as constant.',
   '$2x + \lambda$',
   '2x+lambda', 'optimization', 'beginner', 4)
  RETURNING id INTO q_ids[23];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Compute $\mathbf{1}^T \Sigma^{-1} \mathbf{1}$ for $\Sigma = \begin{bmatrix} 4 & 0 \\ 0 & 1 \end{bmatrix}$',
   'Invert diagonal matrix.',
   '$\frac{5}{4}$',
   '5/4', 'optimization', 'intermediate', 4)
  RETURNING id INTO q_ids[24];

  INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
  VALUES
  ('Finite difference for $f(x) = x^2$ at $x=3$, $h=0.01$',
   'Evaluate $(f(x+h) - f(x))/h$.',
   '$6.01$',
   '6.01', 'optimization', 'beginner', 4)
  RETURNING id INTO q_ids[25];

  -- Link all questions to exam
  FOR i IN 1..25 LOOP
    INSERT INTO module_exam_questions (exam_id, problem_id, order_index, section_name)
    VALUES (
      exam_uuid,
      q_ids[i],
      i - 1,
      CASE
        WHEN i <= 6 THEN 'Section A - Limits & Continuity'
        WHEN i <= 13 THEN 'Section B - Derivatives'
        WHEN i <= 19 THEN 'Section C - Integrals'
        ELSE 'Section D - Optimization'
      END
    );
  END LOOP;

END $$;
