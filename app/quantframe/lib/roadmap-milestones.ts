// Milestone mappings for progressive quiz
// Groups nodes within subcategories into logical learning checkpoints

export interface Milestone {
  id: string
  label: string
  description: string
  highestNodeSlug: string // The most advanced node in this milestone group
}

export interface SubcategoryMilestones {
  subcategory: string
  label: string
  milestones: Milestone[]
}

export interface CategoryMilestones {
  category: string
  subcategories: SubcategoryMilestones[]
}

// MATH MILESTONES
export const MATH_MILESTONES: SubcategoryMilestones[] = [
  {
    subcategory: 'foundations',
    label: 'Foundations',
    milestones: [
      {
        id: 'basic-algebra',
        label: 'Basic Algebra & Functions',
        description: 'Arithmetic, algebra, functions, graphs',
        highestNodeSlug: 'math-functions-graphs'
      },
      {
        id: 'calculus-basics',
        label: 'Calculus Fundamentals',
        description: 'Limits, continuity, single-variable calculus',
        highestNodeSlug: 'math-single-variable-calculus'
      },
      {
        id: 'advanced-calculus',
        label: 'Advanced Calculus',
        description: 'Multivariable calculus, vector calculus, ODEs',
        highestNodeSlug: 'math-differential-equations-odes'
      }
    ]
  },
  {
    subcategory: 'linear-algebra',
    label: 'Linear Algebra',
    milestones: [
      {
        id: 'linalg-basics',
        label: 'Linear Algebra Basics',
        description: 'Vectors, matrices, transformations',
        highestNodeSlug: 'math-linear-algebra-fundamentals'
      },
      {
        id: 'linalg-advanced',
        label: 'Advanced Linear Algebra',
        description: 'Decompositions, eigenvalues, positive definite matrices',
        highestNodeSlug: 'math-numerical-linear-algebra'
      }
    ]
  },
  {
    subcategory: 'probability-statistics',
    label: 'Probability & Statistics',
    milestones: [
      {
        id: 'prob-foundations',
        label: 'Probability Foundations',
        description: 'Random variables, distributions, expectation, Bayes theorem',
        highestNodeSlug: 'math-conditional-probability-bayes'
      },
      {
        id: 'statistical-inference',
        label: 'Statistical Inference',
        description: 'LLN, CLT, estimation, hypothesis testing, regression',
        highestNodeSlug: 'math-generalized-linear-models'
      },
      {
        id: 'time-series',
        label: 'Time Series Analysis',
        description: 'ARIMA, stationarity, GARCH models',
        highestNodeSlug: 'math-volatility-estimation-garch'
      }
    ]
  },
  {
    subcategory: 'stochastic-processes',
    label: 'Stochastic Processes',
    milestones: [
      {
        id: 'stochastic-basics',
        label: 'Basic Stochastic Processes',
        description: 'Brownian motion, Markov chains, Poisson processes',
        highestNodeSlug: 'math-poisson-processes'
      },
      {
        id: 'stochastic-advanced',
        label: 'Advanced Stochastic Calculus',
        description: 'Ito calculus, SDEs, martingales, Levy processes',
        highestNodeSlug: 'math-jump-diffusion-models'
      }
    ]
  },
  {
    subcategory: 'optimization',
    label: 'Optimization',
    milestones: [
      {
        id: 'optimization-basics',
        label: 'Core Optimization',
        description: 'Convex optimization, gradient methods, Lagrange multipliers',
        highestNodeSlug: 'math-lagrange-multipliers-duality'
      },
      {
        id: 'optimization-advanced',
        label: 'Advanced Optimization',
        description: 'Numerical methods, stochastic optimization, dynamic programming, RL',
        highestNodeSlug: 'math-rl-foundations'
      }
    ]
  },
  {
    subcategory: 'numerics',
    label: 'Numerical Methods',
    milestones: [
      {
        id: 'numerics-basics',
        label: 'Basic Numerical Methods',
        description: 'Root finding, integration, Monte Carlo',
        highestNodeSlug: 'math-monte-carlo-methods'
      },
      {
        id: 'numerics-advanced',
        label: 'Advanced Numerics',
        description: 'ODE/PDE solvers, variance reduction, HPC',
        highestNodeSlug: 'math-high-performance-computing-concepts'
      }
    ]
  },
  {
    subcategory: 'advanced-quant-math',
    label: 'Advanced Quant Math',
    milestones: [
      {
        id: 'advanced-math',
        label: 'Advanced Mathematical Topics',
        description: 'Measure theory, functional analysis, PDEs, Fourier analysis',
        highestNodeSlug: 'math-high-dimensional-statistics'
      }
    ]
  }
]

// CODING MILESTONES
export const CODING_MILESTONES: SubcategoryMilestones[] = [
  {
    subcategory: 'core-programming',
    label: 'Core Programming',
    milestones: [
      {
        id: 'programming-basics',
        label: 'Programming Fundamentals',
        description: 'Python, algorithms, Linux, Git, SQL',
        highestNodeSlug: 'coding-data-pipelines-etl'
      }
    ]
  },
  {
    subcategory: 'quant-python-stack',
    label: 'Quant Python Stack',
    milestones: [
      {
        id: 'python-basics',
        label: 'Core Python Libraries',
        description: 'NumPy, Pandas, SciPy, Matplotlib',
        highestNodeSlug: 'coding-matplotlib'
      },
      {
        id: 'python-advanced',
        label: 'Advanced Python Tools',
        description: 'TA-Lib, Statsmodels, Numba, Cython, PyTorch',
        highestNodeSlug: 'coding-pytorch'
      }
    ]
  },
  {
    subcategory: 'machine-learning',
    label: 'Machine Learning',
    milestones: [
      {
        id: 'ml-basics',
        label: 'Core Machine Learning',
        description: 'Supervised/unsupervised learning, feature engineering, model evaluation',
        highestNodeSlug: 'coding-regularization-sparsity'
      },
      {
        id: 'ml-advanced',
        label: 'Advanced ML Techniques',
        description: 'Ensembles, SVMs, dimensionality reduction',
        highestNodeSlug: 'coding-dimensionality-reduction'
      }
    ]
  },
  {
    subcategory: 'deep-learning',
    label: 'Deep Learning',
    milestones: [
      {
        id: 'dl-basics',
        label: 'Neural Networks Basics',
        description: 'Neural networks, CNNs, RNNs',
        highestNodeSlug: 'coding-rnns-lstms'
      },
      {
        id: 'dl-advanced',
        label: 'Advanced Deep Learning',
        description: 'Transformers, sequence modeling, autoencoders, deep RL',
        highestNodeSlug: 'coding-deep-reinforcement-learning'
      }
    ]
  },
  {
    subcategory: 'quant-dev',
    label: 'Quant Development',
    milestones: [
      {
        id: 'quant-dev',
        label: 'Production Systems',
        description: 'C++, concurrency, memory management, networking, performance optimization',
        highestNodeSlug: 'coding-event-driven-architecture'
      }
    ]
  },
  {
    subcategory: 'execution-backtesting',
    label: 'Execution & Backtesting',
    milestones: [
      {
        id: 'execution-basics',
        label: 'Trading Infrastructure',
        description: 'Market data, trading APIs, backtesting engines',
        highestNodeSlug: 'coding-backtesting-engine-design'
      },
      {
        id: 'execution-advanced',
        label: 'Advanced Infrastructure',
        description: 'Latency optimization, distributed systems, cloud compute',
        highestNodeSlug: 'coding-cloud-compute'
      }
    ]
  }
]

// FINANCE MILESTONES
export const FINANCE_MILESTONES: SubcategoryMilestones[] = [
  {
    subcategory: 'core-finance',
    label: 'Core Finance',
    milestones: [
      {
        id: 'finance-basics',
        label: 'Financial Markets Basics',
        description: 'Markets, microstructure, trading mechanics, order types',
        highestNodeSlug: 'finance-order-types-execution-logic'
      }
    ]
  },
  {
    subcategory: 'portfolio-theory',
    label: 'Portfolio Theory',
    milestones: [
      {
        id: 'portfolio-basics',
        label: 'Portfolio Management',
        description: 'MPT, mean-variance optimization, factor models',
        highestNodeSlug: 'finance-multi-asset-portfolios'
      }
    ]
  },
  {
    subcategory: 'risk-pricing',
    label: 'Risk & Pricing',
    milestones: [
      {
        id: 'risk-basics',
        label: 'Risk Management Basics',
        description: 'Risk fundamentals, VaR, derivatives basics',
        highestNodeSlug: 'finance-derivatives-basics'
      },
      {
        id: 'derivatives-pricing',
        label: 'Derivatives Pricing',
        description: 'Options, fixed income, swaps, volatility modeling',
        highestNodeSlug: 'finance-volatility-modelling'
      }
    ]
  },
  {
    subcategory: 'advanced-quant-finance',
    label: 'Advanced Quant Finance',
    milestones: [
      {
        id: 'advanced-finance',
        label: 'Advanced Quantitative Finance',
        description: 'Stochastic calculus, asset pricing, exotic options, stat arb',
        highestNodeSlug: 'finance-statistical-arbitrage'
      }
    ]
  }
]

// EXECUTION MILESTONES (Non-hierarchical - shown only if needed)
export const EXECUTION_CATEGORIES = [
  {
    id: 'career-prep',
    label: 'Resume & Portfolio Building',
    description: 'Resume, cover letter, LinkedIn, GitHub, project portfolios',
    subcategory: 'career-prep'
  },
  {
    id: 'recruiting-internships',
    label: 'Networking & Recruiting',
    description: 'Networking strategies, coffee chats, email outreach, internship search',
    subcategory: 'recruiting-internships'
  },
  {
    id: 'interview-prep',
    label: 'Interview Preparation',
    description: 'Mental math, probability puzzles, coding interviews, case studies',
    subcategory: 'interview-prep'
  },
  {
    id: 'execution-skills',
    label: 'Study & Productivity Systems',
    description: 'Time management, note-taking, study systems, learning plans',
    subcategory: 'execution-skills'
  }
]

export const ALL_MILESTONES = {
  math: MATH_MILESTONES,
  coding: CODING_MILESTONES,
  finance: FINANCE_MILESTONES,
  execution: EXECUTION_CATEGORIES
}
