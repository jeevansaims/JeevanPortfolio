import { ProjectDefinition } from '@/lib/projects/types';

/**
 * Sample project that tests ALL block types
 * This is a minimal project to ensure all features work
 */
export const testAllFeaturesProject: ProjectDefinition = {
  slug: 'test-all-features',
  title: 'Test Project: All Features',
  description:
    'A sample project demonstrating all block types: markdown, code, exercises, quizzes, and concept checks.',
  difficulty: 'beginner',
  estimatedTimeMinutes: 15,
  tags: ['test', 'python', 'tutorial'],
  lastUpdated: '2025-01-15',

  notebookBlocks: [
    // 1. Markdown block
    {
      id: 'intro-markdown',
      type: 'markdown',
      content: `# Welcome to the Projects Vault

This is a **test project** to demonstrate all features.

## What You'll Learn

- How markdown blocks work (with LaTeX support)
- Code display blocks
- Interactive coding exercises with test cases
- Quiz questions
- Concept checks

Let's dive in! The formula for variance is:

$$
\\sigma^2 = \\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\mu)^2
$$

And inline math works too: $E[X] = \\mu$.`,
    },

    // 2. Quiz block
    {
      id: 'quiz-1',
      type: 'quiz',
      question: 'What does $\\sigma$ represent in statistics?',
      options: [
        'Mean',
        'Standard deviation',
        'Variance',
        'Median',
      ],
      correctOptionIndex: 1,
      explanation:
        'Correct! $\\sigma$ (sigma) represents standard deviation, while $\\sigma^2$ represents variance.',
    },

    // 3. Code block (display only)
    {
      id: 'code-display',
      type: 'code',
      language: 'python',
      code: `import numpy as np

# Example: calculating mean and standard deviation
data = [1, 2, 3, 4, 5]
mean = np.mean(data)
std = np.std(data)

print(f"Mean: {mean}")
print(f"Std: {std}")`,
      readOnly: true,
    },

    // 4. Markdown explaining the exercise
    {
      id: 'exercise-intro',
      type: 'markdown',
      content: `## Your First Exercise

Now it's your turn! Complete the function below to calculate the **sum of squares**.

The formula is: $\\text{SS} = \\sum_{i=1}^{n} x_i^2$`,
    },

    // 5. Exercise code block
    {
      id: 'exercise-sum-squares',
      type: 'exerciseCode',
      language: 'python',
      starterCode: `def sum_of_squares(numbers):
    """
    Calculate the sum of squares of a list of numbers.

    Example:
    >>> sum_of_squares([1, 2, 3])
    14  # 1^2 + 2^2 + 3^2 = 1 + 4 + 9 = 14
    """
    # TODO: Implement this function
    pass`,
      solutionCode: `def sum_of_squares(numbers):
    """
    Calculate the sum of squares of a list of numbers.
    """
    return sum(x**2 for x in numbers)`,
      hint: 'Loop through the numbers and square each one, then sum them all up!',
      testCases: [
        {
          input: [[1, 2, 3]],
          expected: 14,
          hidden: false,
          description: 'Test 1: [1, 2, 3]',
        },
        {
          input: [[0, 0, 0]],
          expected: 0,
          hidden: false,
          description: 'Test 2: All zeros',
        },
        {
          input: [[5]],
          expected: 25,
          hidden: false,
          description: 'Test 3: Single element',
        },
        {
          input: [[-1, -2, -3]],
          expected: 14,
          hidden: true,
          description: 'Hidden: Negative numbers',
        },
      ],
    },

    // 6. Concept check
    {
      id: 'concept-check-1',
      type: 'conceptCheck',
      question:
        'Why do we square the differences when calculating variance instead of just taking the absolute value?',
      answer:
        'Squaring gives more weight to larger deviations and makes the math easier (differentiable). It also has nice mathematical properties for statistical inference.',
    },

    // 7. Final quiz
    {
      id: 'final-quiz',
      type: 'quiz',
      question: 'What is the sum of squares for the list [2, 3, 4]?',
      options: ['9', '29', '14', '24'],
      correctOptionIndex: 1,
      explanation:
        'Correct! 2² + 3² + 4² = 4 + 9 + 16 = 29',
    },

    // 8. Final markdown
    {
      id: 'conclusion',
      type: 'markdown',
      content: `## Congratulations!

You've completed the test project and seen all block types in action.

**What's Next?**

Try the real projects to build practical quant finance skills!`,
    },
  ],

  // Career sections
  cvBullets: [
    'Implemented statistical calculations using Python and NumPy',
    'Demonstrated understanding of variance and standard deviation in data analysis',
  ],

  linkedinSummary:
    'Completed hands-on project demonstrating Python programming skills and statistical analysis fundamentals.',

  interviewTalkingPoints: [
    'Explain the difference between variance and standard deviation',
    'Discuss when to use sum of squares in statistical analysis',
    'Describe how Python and NumPy simplify mathematical computations',
  ],
};
