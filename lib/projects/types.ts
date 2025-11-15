// Types for the Projects Vault feature

export type BlockType =
  | 'markdown'
  | 'code'
  | 'exerciseCode'
  | 'quiz'
  | 'conceptCheck'
  | 'output'
  | 'visualization'
  | 'resources';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// Base block interface
export interface BaseBlock {
  id: string;
  type: BlockType;
}

// Markdown explanation block
export interface MarkdownBlock extends BaseBlock {
  type: 'markdown';
  content: string; // Supports LaTeX via $...$ and $$...$$
}

// Read-only code display block
export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: 'python' | 'typescript' | 'javascript';
  code: string;
  readOnly?: boolean;
}

// Exercise code block with test cases
export interface ExerciseCodeBlock extends BaseBlock {
  type: 'exerciseCode';
  language: 'python' | 'typescript' | 'javascript';
  starterCode: string;
  solutionCode: string;
  hint?: string;
  testCases: TestCase[];
}

// Test case structure (matches existing pattern from code-editor.tsx)
export interface TestCase {
  input: any; // Can be string, array, object, or JSON
  expected: any;
  hidden: boolean;
  description?: string;
  tolerance?: number; // For floating-point comparisons
}

// Quiz block with multiple choice
export interface QuizBlock extends BaseBlock {
  type: 'quiz';
  question: string; // Supports LaTeX
  options: string[];
  correctOptionIndex: number;
  explanation: string; // Shown after correct answer
}

// Concept check (simple Q&A)
export interface ConceptCheckBlock extends BaseBlock {
  type: 'conceptCheck';
  question: string;
  answer: string; // Shown on "reveal"
}

// Expected output display
export interface OutputBlock extends BaseBlock {
  type: 'output';
  content: string;
  language?: 'python' | 'json' | 'text';
}

// Visualization block (future: charts)
export interface VisualizationBlock extends BaseBlock {
  type: 'visualization';
  title: string;
  description?: string;
  chartType?: 'line' | 'bar' | 'scatter';
  data?: any; // Future: recharts data
}

// Resources block
export interface ResourcesBlock extends BaseBlock {
  type: 'resources';
  title: string;
  links: Array<{
    label: string;
    url: string;
    type: 'paper' | 'docs' | 'article' | 'video';
  }>;
}

// Union type of all blocks
export type ProjectBlock =
  | MarkdownBlock
  | CodeBlock
  | ExerciseCodeBlock
  | QuizBlock
  | ConceptCheckBlock
  | OutputBlock
  | VisualizationBlock
  | ResourcesBlock;

// Complete project definition
export interface ProjectDefinition {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTimeMinutes: number;
  tags: string[];
  lastUpdated?: string;

  // Notebook content
  notebookBlocks: ProjectBlock[];

  // Career sections
  cvBullets?: string[];
  linkedinSummary?: string;
  interviewTalkingPoints?: string[];
}

// User progress tracking
export interface ProjectProgress {
  userId: string;
  projectSlug: string;
  completedBlockIds: string[];
  blockAttempts: Record<string, string>; // blockId -> user code/answer
  updatedAt: string;
}
