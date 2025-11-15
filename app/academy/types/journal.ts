// Journal post types for the Quant Journal

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  week_number: number | null;
  category: string;
  tags: string[];
  author_id: string | null;
  author_name: string;
  image_url: string;
  content_path: string;
  published: boolean;
  featured: boolean;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalPostWithContent extends JournalPost {
  content: string;
}

export type JournalCategory =
  | 'Quantitative Finance'
  | 'Mathematics'
  | 'Coding'
  | 'Career Advice'
  | 'Market Analysis'
  | 'Algorithms'
  | 'Statistics';
