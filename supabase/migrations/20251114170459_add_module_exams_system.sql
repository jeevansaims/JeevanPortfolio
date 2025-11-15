-- Add module exams system and Calculus for Quants exam

-- Create module_exams table
CREATE TABLE IF NOT EXISTS module_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70, -- percentage needed to pass
  time_limit_minutes INTEGER, -- optional time limit
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create module_exam_questions junction table
CREATE TABLE IF NOT EXISTS module_exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES module_exams(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES math_problems(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  section_name TEXT, -- e.g., "Section A - Limits & Continuity"
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(exam_id, problem_id),
  UNIQUE(exam_id, order_index)
);

-- Create user_module_exam_attempts table
CREATE TABLE IF NOT EXISTS user_module_exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES module_exams(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  time_taken_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE module_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_exam_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for module_exams (public read, no write for users)
CREATE POLICY "Anyone can view published exams"
  ON module_exams FOR SELECT
  USING (is_published = true);

-- Policies for module_exam_questions (public read)
CREATE POLICY "Anyone can view exam questions"
  ON module_exam_questions FOR SELECT
  USING (true);

-- Policies for user_module_exam_attempts
CREATE POLICY "Users can view their own exam attempts"
  ON user_module_exam_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exam attempts"
  ON user_module_exam_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create the Calculus for Quants exam
INSERT INTO module_exams (module_id, title, description, passing_score, is_published)
VALUES (
  (SELECT id FROM modules WHERE slug = 'calculus-for-quants'),
  'Module 1 Exam: Calculus for Quants',
  'Comprehensive exam covering Limits & Continuity, Derivatives, Integrals, and Optimization Concepts. 25 questions total. You must score 70% or higher to pass.',
  70,
  true
);

-- Now add the 25 exam questions to math_problems (these will NOT have lesson_id set)

-- SECTION A: Limits & Continuity (6 questions)

-- Question 1
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the limit:\n\n$$\lim_{x \to 2} (3x^2 - x + 4)$$',
  'For polynomial functions, you can directly substitute the value of $x$.',
  'Since this is a polynomial, substitute $x = 2$:\n\n$$3(2)^2 - 2 + 4 = 3(4) - 2 + 4 = 12 - 2 + 4 = 14$$',
  '14',
  'calculus',
  'beginner',
  4
);

-- Question 2
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the limit:\n\n$$\lim_{h \to 0} \frac{(S_0 + h)^2 - S_0^2}{h}$$',
  'Expand $(S_0 + h)^2$ and simplify before taking the limit.',
  'Expand:\n\n$$(S_0 + h)^2 - S_0^2 = S_0^2 + 2S_0h + h^2 - S_0^2 = 2S_0h + h^2$$\n\nDivide by $h$:\n\n$$\frac{2S_0h + h^2}{h} = 2S_0 + h$$\n\nAs $h \to 0$: $2S_0 + h \to 2S_0$',
  '2S_0',
  'calculus',
  'intermediate',
  4
);

-- Question 3
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Determine whether the following limit exists:\n\n$$\lim_{x \to 0} \frac{|x|}{x}$$',
  'Consider the left and right limits separately. Remember that $|x| = -x$ when $x < 0$ and $|x| = x$ when $x > 0$.',
  'Check left and right limits:\n\nAs $x \to 0^-$: $\frac{|x|}{x} = \frac{-x}{x} = -1$\n\nAs $x \to 0^+$: $\frac{|x|}{x} = \frac{x}{x} = 1$\n\nSince the left and right limits differ, the limit does not exist.',
  'does not exist',
  'calculus',
  'intermediate',
  4
);

-- Question 4
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'For the call payoff $f(S_T) = \max(S_T - K, 0)$, compute the left and right limits at $S_T = K$.',
  'Consider what happens to the payoff as you approach $K$ from below and from above.',
  'Left limit (as $S_T \to K^-$):\n\nWhen $S_T < K$, the payoff is $0$, so: $\lim_{S_T \to K^-} f(S_T) = 0$\n\nRight limit (as $S_T \to K^+$):\n\nWhen $S_T > K$, the payoff is $S_T - K$, so: $\lim_{S_T \to K^+} f(S_T) = K - K = 0$\n\nBoth limits equal $0$.',
  '0',
  'finance',
  'intermediate',
  4
);

-- Question 5
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the limit:\n\n$$\lim_{\sigma \to 0} C(\sigma)$$\n\nAssume the call option is in-the-money and use the intuition from the lesson.',
  'When volatility approaches zero for an in-the-money option, it becomes almost certain to expire in-the-money.',
  'As $\sigma \to 0$ for an in-the-money call:\n\n- Uncertainty disappears\n- The option is almost certain to expire in-the-money\n- The price converges to its discounted intrinsic value\n\n$$\lim_{\sigma \to 0} C(\sigma) = S_0 - Ke^{-rT}$$\n\nThis is the intrinsic value.',
  'S_0-Ke^(-rT)',
  'finance',
  'advanced',
  4
);

-- Question 6
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'The function\n\n$$g(x) = \begin{cases} x+1, & x<1 \\\\ 5, & x=1 \\\\ 2x-1, & x>1 \end{cases}$$\n\nIs $g(x)$ continuous at $x=1$? Give a reason.',
  'Check if $\lim_{x \to 1} g(x) = g(1)$. Compute the left and right limits.',
  'Check continuity:\n\nLeft limit: $\lim_{x \to 1^-} g(x) = 1 + 1 = 2$\n\nRight limit: $\lim_{x \to 1^+} g(x) = 2(1) - 1 = 1$\n\n$g(1) = 5$\n\nSince the left and right limits don''t equal each other (and don''t equal $g(1)$), the function is **not continuous** at $x=1$.',
  'no',
  'calculus',
  'intermediate',
  4
);

-- SECTION B: Derivatives (7 questions)

-- Question 7
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the derivative:\n\n$$\frac{d}{dx}(4x^3 - 5x)$$',
  'Use the power rule on each term separately.',
  'Apply the power rule:\n\n$$\frac{d}{dx}(4x^3 - 5x) = 4 \cdot 3x^2 - 5 \cdot 1$$\n\n$$= 12x^2 - 5$$',
  '12x^2-5',
  'calculus',
  'beginner',
  4
);

-- Question 8
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the derivative of the discount factor:\n\n$$D(r) = e^{-rT}$$\n\nwith respect to $r$.',
  'Use the chain rule. Remember that $\frac{d}{dr}e^{ar} = ae^{ar}$.',
  'Using the chain rule:\n\n$$\frac{dD}{dr} = \frac{d}{dr}e^{-rT} = -T e^{-rT}$$',
  '-Te^(-rT)',
  'finance',
  'intermediate',
  4
);

-- Question 9
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'For the payoff\n\n$$f(S_T) = \max(S_T - K, 0)$$\n\ncompute $f''(S_T)$ when $S_T > K$.',
  'When $S_T > K$, the payoff is simply $f(S_T) = S_T - K$. What is the derivative of a linear function?',
  'When $S_T > K$:\n\n$$f(S_T) = S_T - K$$\n\nThe derivative is:\n\n$$f''(S_T) = 1$$\n\nThe slope is constant at $1$ for all $S_T > K$.',
  '1',
  'finance',
  'beginner',
  4
);

-- Question 10
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the derivative:\n\n$$\frac{d}{dx}(x^2 e^{2x})$$',
  'Use the product rule: $(uv)'' = u''v + uv''$.',
  'Using the product rule with $u = x^2$ and $v = e^{2x}$:\n\n$$\frac{d}{dx}(x^2 e^{2x}) = (2x)(e^{2x}) + (x^2)(2e^{2x})$$\n\n$$= 2xe^{2x} + 2x^2e^{2x}$$\n\n$$= 2xe^{2x}(1 + x)$$',
  '2xe^(2x)(1+x)',
  'calculus',
  'intermediate',
  4
);

-- Question 11
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'If $\Delta = \Phi(d_1)$ and $d_1 = 0$, what is Delta?\n\n(Use the fact that $\Phi(0) = 0.5$.)',
  'Substitute $d_1 = 0$ into the formula.',
  'Given $\Delta = \Phi(d_1)$ and $d_1 = 0$:\n\n$$\Delta = \Phi(0) = 0.5$$\n\nThis means the option is at-the-money.',
  '0.5',
  'finance',
  'beginner',
  4
);

-- Question 12
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the derivative:\n\n$$\frac{d}{dx}\ln(x^2 + 1)$$',
  'Use the chain rule: $\frac{d}{dx}\ln(u) = \frac{1}{u} \cdot \frac{du}{dx}$.',
  'Using the chain rule:\n\n$$\frac{d}{dx}\ln(x^2 + 1) = \frac{1}{x^2 + 1} \cdot \frac{d}{dx}(x^2 + 1)$$\n\n$$= \frac{1}{x^2 + 1} \cdot 2x$$\n\n$$= \frac{2x}{x^2 + 1}$$',
  '2x/(x^2+1)',
  'calculus',
  'intermediate',
  4
);

-- Question 13
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Let $f(x) = (x - 3)^2$.\n\nPerform ONE gradient descent step with learning rate $\alpha = 0.1$ starting from $x_0 = 1$.\n\nCompute $x_1$.',
  'First find $f''(x) = 2(x-3)$, then use $x_1 = x_0 - \alpha \cdot f''(x_0)$.',
  'Calculate:\n\n$f''(x) = 2(x - 3)$\n\n$f''(1) = 2(1 - 3) = -4$\n\n$x_1 = x_0 - \alpha \cdot f''(x_0)$\n\n$x_1 = 1 - 0.1 \cdot (-4) = 1 + 0.4 = 1.4$',
  '1.4',
  'optimization',
  'beginner',
  4
);

-- SECTION C: Integrals (6 questions)

-- Question 14
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the integral:\n\n$$\int_0^1 6x \, dx$$',
  'Use the power rule for integration.',
  'Using the power rule:\n\n$$\int_0^1 6x \, dx = 6 \left[\frac{x^2}{2}\right]_0^1$$\n\n$$= 6 \cdot \frac{1}{2} = 3$$',
  '3',
  'calculus',
  'beginner',
  4
);

-- Question 15
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the integral:\n\n$$\int e^{3x} \, dx$$',
  'Use the exponential rule: $\int e^{ax} \, dx = \frac{1}{a}e^{ax} + C$.',
  'Using the exponential rule:\n\n$$\int e^{3x} \, dx = \frac{1}{3}e^{3x} + C$$',
  '(1/3)e^(3x)+C',
  'calculus',
  'beginner',
  4
);

-- Question 16
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the expected value:\n\nIf $p(r) = 2r$ on $0 \le r \le 1$, compute\n\n$$E[R] = \int_0^1 r \cdot 2r \, dr$$',
  'Simplify to $2\int_0^1 r^2 \, dr$ and use the power rule.',
  'Simplify and integrate:\n\n$$E[R] = \int_0^1 2r^2 \, dr = 2\left[\frac{r^3}{3}\right]_0^1$$\n\n$$= 2 \cdot \frac{1}{3} = \frac{2}{3}$$',
  '2/3',
  'finance',
  'intermediate',
  4
);

-- Question 17
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the present value of a constant cash flow $C = 5$:\n\n$$PV = \int_0^2 5e^{-0.2t} \, dt$$',
  'Use the exponential integration rule.',
  'Using the exponential rule:\n\n$$PV = 5\int_0^2 e^{-0.2t} \, dt = 5\left[\frac{e^{-0.2t}}{-0.2}\right]_0^2$$\n\n$$= 5 \cdot \frac{1}{-0.2}(e^{-0.4} - 1)$$\n\n$$= -25(e^{-0.4} - 1)$$\n\n$$= 25(1 - e^{-0.4})$$',
  '25(1-e^(-0.4))',
  'finance',
  'intermediate',
  4
);

-- Question 18
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute:\n\n$$\int_0^3 (t^2 + 1) \, dt$$',
  'Integrate each term separately using the power rule.',
  'Integrate term by term:\n\n$$\int_0^3 (t^2 + 1) \, dt = \left[\frac{t^3}{3} + t\right]_0^3$$\n\n$$= \left(\frac{27}{3} + 3\right) - 0$$\n\n$$= 9 + 3 = 12$$',
  '12',
  'calculus',
  'beginner',
  4
);

-- Question 19
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'For a random variable on $[0,1]$ with density $p(x) = 1$, compute\n\n$$\int_0^1 (x - 0.5)^2 \, dx$$',
  'Expand $(x - 0.5)^2$ first, then integrate term by term.',
  'Expand and integrate:\n\n$$(x - 0.5)^2 = x^2 - x + 0.25$$\n\n$$\int_0^1 (x^2 - x + 0.25) \, dx = \left[\frac{x^3}{3} - \frac{x^2}{2} + 0.25x\right]_0^1$$\n\n$$= \frac{1}{3} - \frac{1}{2} + \frac{1}{4} = \frac{4 - 6 + 3}{12} = \frac{1}{12}$$',
  '1/12',
  'finance',
  'advanced',
  4
);

-- SECTION D: Optimization (6 questions)

-- Question 20
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Solve for critical points:\n\n$$f(x) = x^2 - 4x + 1$$\n\nFind the value of $x$ where $f''(x) = 0$.',
  'Take the derivative and set it equal to zero.',
  'Find the derivative:\n\n$$f''(x) = 2x - 4$$\n\nSet equal to zero:\n\n$$2x - 4 = 0$$\n\n$$x = 2$$',
  '2',
  'optimization',
  'beginner',
  4
);

-- Question 21
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the gradient of the quadratic function:\n\n$$f(w) = w^T \begin{bmatrix} 2 & 0 \\\\ 0 & 8 \end{bmatrix} w$$',
  'For a quadratic form $w^T A w$, the gradient is $2Aw$ when $A$ is symmetric.',
  'For the quadratic form $f(w) = w^T A w$:\n\n$$\nabla f(w) = 2Aw = 2\begin{bmatrix} 2 & 0 \\\\ 0 & 8 \end{bmatrix}\begin{bmatrix} w_1 \\\\ w_2 \end{bmatrix}$$\n\n$$= \begin{bmatrix} 4w_1 \\\\ 16w_2 \end{bmatrix}$$',
  '[4w_1, 16w_2]',
  'optimization',
  'intermediate',
  4
);

-- Question 22
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Gradient descent update:\n\nGiven $f(x) = (x-7)^2$, $f''(x) = 2(x-7)$,\n\nstarting at $x_0 = 0$ with $\alpha = 0.2$, compute $x_1$.',
  'Use the gradient descent formula: $x_1 = x_0 - \alpha \cdot f''(x_0)$.',
  'Calculate:\n\n$$f''(0) = 2(0 - 7) = -14$$\n\n$$x_1 = 0 - 0.2 \cdot (-14)$$\n\n$$x_1 = 0 + 2.8 = 2.8$$',
  '2.8',
  'optimization',
  'beginner',
  4
);

-- Question 23
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the Lagrangian derivative:\n\n$$L(x, \lambda) = x^2 + \lambda(x - 1)$$\n\nFind $\frac{\partial L}{\partial x}$.',
  'Treat $\lambda$ as a constant when taking the partial derivative with respect to $x$.',
  'Taking the partial derivative:\n\n$$\frac{\partial L}{\partial x} = 2x + \lambda$$',
  '2x+lambda',
  'optimization',
  'beginner',
  4
);

-- Question 24
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Compute the value of\n\n$$\mathbf{1}^T \Sigma^{-1} \mathbf{1}$$\n\nfor\n\n$$\Sigma = \begin{bmatrix} 4 & 0 \\\\ 0 & 1 \end{bmatrix}, \quad \mathbf{1} = \begin{bmatrix} 1 \\\\ 1 \end{bmatrix}$$',
  'First invert the diagonal matrix, then compute the matrix product.',
  'Invert the matrix:\n\n$$\Sigma^{-1} = \begin{bmatrix} 1/4 & 0 \\\\ 0 & 1 \end{bmatrix}$$\n\nCompute:\n\n$$\mathbf{1}^T \Sigma^{-1} \mathbf{1} = \begin{bmatrix} 1 & 1 \end{bmatrix}\begin{bmatrix} 1/4 & 0 \\\\ 0 & 1 \end{bmatrix}\begin{bmatrix} 1 \\\\ 1 \end{bmatrix}$$\n\n$$= \begin{bmatrix} 1 & 1 \end{bmatrix}\begin{bmatrix} 1/4 \\\\ 1 \end{bmatrix} = \frac{1}{4} + 1 = \frac{5}{4}$$',
  '5/4',
  'optimization',
  'intermediate',
  4
);

-- Question 25
INSERT INTO math_problems (problem, hint, solution, answer, category, difficulty, xp)
VALUES (
  'Numerical gradient (finite difference):\n\nCompute $\frac{f(x+h) - f(x)}{h}$\n\nfor $f(x) = x^2$, $x = 3$, $h = 0.01$.',
  'Substitute the values and evaluate the finite difference formula.',
  'Using the finite difference formula:\n\n$$\frac{f(3 + 0.01) - f(3)}{0.01} = \frac{(3.01)^2 - 9}{0.01}$$\n\n$$= \frac{9.0601 - 9}{0.01} = \frac{0.0601}{0.01} = 6.01$$\n\nThis approximates $f''(3) = 6$.',
  '6.01',
  'optimization',
  'beginner',
  4
);

-- Now link all exam questions to the exam in order
WITH exam AS (
  SELECT id FROM module_exams
  WHERE module_id = (SELECT id FROM modules WHERE slug = 'calculus-for-quants')
),
questions AS (
  SELECT
    id,
    problem,
    ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM math_problems
  WHERE lesson_id IS NULL
  AND created_at > (SELECT created_at FROM module_exams WHERE module_id = (SELECT id FROM modules WHERE slug = 'calculus-for-quants'))
  LIMIT 25
)
INSERT INTO module_exam_questions (exam_id, problem_id, order_index, section_name)
SELECT
  (SELECT id FROM exam),
  id,
  25 - row_num, -- Reverse order since they were inserted newest first
  CASE
    WHEN 25 - row_num BETWEEN 0 AND 5 THEN 'Section A - Limits & Continuity'
    WHEN 25 - row_num BETWEEN 6 AND 12 THEN 'Section B - Derivatives'
    WHEN 25 - row_num BETWEEN 13 AND 18 THEN 'Section C - Integrals'
    ELSE 'Section D - Optimization'
  END
FROM questions
ORDER BY row_num DESC;
