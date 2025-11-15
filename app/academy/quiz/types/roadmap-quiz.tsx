// app/academy/types/roadmap-quiz.ts

export interface RoadmapQuizData {
  current_stage: string
  primary_goal: string
  math_background: string[]
  cs_skills: string[]
  market_knowledge: string[]
  hours_per_week: number
  learning_style: string
  motivation_level: number
  current_challenge: string[]
}

export interface RoadmapQuizResponse extends RoadmapQuizData {
  id: string
  user_id: string
  quiz_completed_at: string
  created_at: string
  updated_at: string
}

// Question steps for the quiz
export const QUIZ_STEPS = {
  CURRENT_STAGE: 0,
  PRIMARY_GOAL: 1,
  MATH_BACKGROUND: 2,
  CS_SKILLS: 3,
  MARKET_KNOWLEDGE: 4,
  HOURS_PER_WEEK: 5,
  LEARNING_STYLE: 6,
  MOTIVATION_LEVEL: 7,
  CURRENT_CHALLENGE: 8,
} as const

export const TOTAL_QUIZ_STEPS = 9

// Options for each question
export const CURRENT_STAGE_OPTIONS = [
  { value: 'student', label: 'Student (undergrad/grad)', emoji: '🎓' },
  { value: 'working', label: 'Working professional', emoji: '💼' },
  { value: 'trader', label: 'Active trader/investor', emoji: '📈' },
  { value: 'researcher', label: 'Researcher/Academic', emoji: '🔬' },
]

export const PRIMARY_GOAL_OPTIONS = [
  { value: 'internship', label: 'Land a quant internship', emoji: '🎯' },
  { value: 'job', label: 'Get a quant job (trader/researcher/engineer)', emoji: '💼' },
  { value: 'trade', label: 'Trade professionally (personal capital)', emoji: '📊' },
  { value: 'research', label: 'Pursue quant research (PhD/academic)', emoji: '🧪' },
]

export const MATH_BACKGROUND_OPTIONS = [
  { value: 'calculus', label: 'Calculus', emoji: '📐' },
  { value: 'linear_algebra', label: 'Linear Algebra', emoji: '🔢' },
  { value: 'probability', label: 'Probability & Statistics', emoji: '🎲' },
  { value: 'diff_eq', label: 'Differential Equations', emoji: '∂' },
  { value: 'optimization', label: 'Optimization', emoji: '📈' },
  { value: 'stochastic', label: 'Stochastic Calculus', emoji: '∫' },
  { value: 'none', label: 'None of the above', emoji: '❌' },
]

export const CS_SKILLS_OPTIONS = [
  { value: 'python_beginner', label: 'Python (beginner)', emoji: '🐍' },
  { value: 'python_intermediate', label: 'Python (intermediate)', emoji: '🐍' },
  { value: 'python_advanced', label: 'Python (advanced)', emoji: '🐍' },
  { value: 'data_structures', label: 'Data Structures & Algorithms', emoji: '🌳' },
  { value: 'ml', label: 'Machine Learning', emoji: '🤖' },
  { value: 'sql', label: 'Database/SQL', emoji: '🗄️' },
  { value: 'cpp', label: 'C++/Rust', emoji: '⚡' },
  { value: 'none', label: 'None of the above', emoji: '❌' },
]

export const MARKET_KNOWLEDGE_OPTIONS = [
  { value: 'basic_trading', label: 'Basic trading (stocks/crypto)', emoji: '📊' },
  { value: 'portfolio', label: 'Portfolio theory', emoji: '📈' },
  { value: 'derivatives', label: 'Derivatives (options/futures)', emoji: '📉' },
  { value: 'risk', label: 'Risk management', emoji: '🛡️' },
  { value: 'backtesting', label: 'Backtesting strategies', emoji: '⏮️' },
  { value: 'none', label: 'None of the above', emoji: '❌' },
]

export const HOURS_LABELS = [
  '0-5 hours',
  '5-10 hours',
  '10-20 hours',
  '20+ hours',
]

export const LEARNING_STYLE_OPTIONS = [
  { value: 'projects', label: 'Build projects (hands-on)', emoji: '🛠️' },
  { value: 'reading', label: 'Read papers/books (theory-first)', emoji: '📚' },
  { value: 'coding', label: 'Code challenges (practice-focused)', emoji: '⚡' },
  { value: 'mix', label: 'Mix of all', emoji: '🎯' },
]

export const MOTIVATION_LABELS = [
  'Just curious',
  'Somewhat interested',
  'Quite motivated',
  'Very motivated',
  'Highly committed',
  'Obsessed',
  'All-in',
  'Extremely dedicated',
  'Nothing will stop me',
  'This is my life',
]

export const CURRENT_CHALLENGE_OPTIONS = [
  { value: 'math', label: 'Math foundations - Need to strengthen calculus, linear algebra, or probability', emoji: '🧮' },
  { value: 'coding', label: 'Coding skills - Struggling with Python, algorithms, or data structures', emoji: '💻' },
  { value: 'markets', label: 'Understanding markets - Don\'t understand trading, derivatives, or portfolio theory', emoji: '📊' },
  { value: 'projects', label: 'Building projects - Don\'t know what to build or how to showcase work', emoji: '🛠️' },
  { value: 'interviews', label: 'Resume & getting interviews - Weak CV, can\'t land interviews or get past screening', emoji: '📄' },
  { value: 'technical', label: 'Passing technical interviews - Struggle with leetcode, brainteasers, or case studies', emoji: '🧪' },
  { value: 'direction', label: 'Don\'t know where to start - Overwhelmed by too many paths and resources', emoji: '🧭' },
]