# Journal Posts Setup

This directory contains MDX files for journal posts. Each post is referenced by the `content_path` field in the `journal_posts` database table.

## Directory Structure

```
content/journal/
├── README.md
├── understanding-black-scholes.mdx
└── intro-to-stochastic-calculus.mdx
```

## Adding Sample Posts to Database

To add the example journal posts to your database, you need to:

1. **Upload images to Supabase Storage** (journal-images bucket)
2. **Insert posts into the database** using the SQL below

### Step 1: Upload Images

You'll need to upload cover images for the posts to your Supabase Storage bucket `journal-images`.

Recommended dimensions: 1200x630px

Example image paths after upload:
- `https://[your-project].supabase.co/storage/v1/object/public/journal-images/black-scholes-cover.jpg`
- `https://[your-project].supabase.co/storage/v1/object/public/journal-images/stochastic-calculus-cover.jpg`

### Step 2: Insert Posts

**Option A: Use Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL below (update the image URLs first!)

**Option B: Use MCP Execute SQL**
Use the `mcp__supabase__execute_sql` tool with the SQL below.

```sql
-- Insert sample journal posts
-- IMPORTANT: Replace the image_url values with your actual Supabase Storage URLs

INSERT INTO public.journal_posts (
  slug,
  title,
  excerpt,
  week_number,
  category,
  tags,
  author_name,
  image_url,
  content_path,
  published,
  featured,
  publish_date
) VALUES
(
  'understanding-black-scholes',
  'Understanding the Black-Scholes Model: From Theory to Practice',
  'The Black-Scholes model revolutionized quantitative finance in 1973. Learn the intuition, mathematics, and practical applications of this groundbreaking options pricing model.',
  1,
  'Quantitative Finance',
  ARRAY['Options', 'Derivatives', 'Black-Scholes', 'Pricing Models', 'Greeks'],
  'Antonije Mirkovic',
  'https://[YOUR-PROJECT].supabase.co/storage/v1/object/public/journal-images/black-scholes-cover.jpg',
  'understanding-black-scholes.mdx',
  true,
  true,
  NOW()
),
(
  'intro-to-stochastic-calculus',
  'Introduction to Stochastic Calculus for Quants',
  'Stochastic calculus is essential for quantitative finance. Master Brownian motion, Itô''s Lemma, and the intuition behind pricing models with this practical guide.',
  2,
  'Mathematics',
  ARRAY['Stochastic Calculus', 'Brownian Motion', 'Itô Lemma', 'SDEs', 'Derivatives'],
  'Antonije Mirkovic',
  'https://[YOUR-PROJECT].supabase.co/storage/v1/object/public/journal-images/stochastic-calculus-cover.jpg',
  'intro-to-stochastic-calculus.mdx',
  true,
  false,
  NOW() - INTERVAL '1 day'
);
```

## Creating New Posts

### 1. Create MDX File

Create a new `.mdx` file in this directory with your content. Use LaTeX for math:

```markdown
# Your Post Title

Regular text here.

Inline math: $E = mc^2$

Block math:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### 2. Add Database Entry

Insert a new row in the `journal_posts` table with:
- `slug` - URL-friendly identifier (e.g., 'my-post-title')
- `title` - Full post title
- `excerpt` - Short description (150-200 chars)
- `week_number` - Week number (optional)
- `category` - Category from predefined list
- `tags` - Array of relevant tags
- `author_name` - Author name (default: 'Antonije Mirkovic')
- `image_url` - Full URL to cover image in Supabase Storage
- `content_path` - Filename of MDX file (e.g., 'my-post-title.mdx')
- `published` - true/false
- `featured` - true/false (featured posts appear as hero)
- `publish_date` - Publication date

### 3. Upload Cover Image

Upload a cover image (recommended 1200x630px) to the `journal-images` Supabase Storage bucket.

## Available Categories

- Quantitative Finance
- Mathematics
- Coding
- Career Advice
- Market Analysis
- Algorithms
- Statistics

## Admin Interface (Coming Soon)

An admin interface for managing journal posts will be added in a future update, making it easier to create, edit, and publish posts without manual SQL.

## LaTeX Support

The journal supports full LaTeX rendering via KaTeX:

- Inline math: `$...$`
- Display math: `$$...$$`
- All standard LaTeX math symbols and environments

## Code Blocks

Use fenced code blocks with language specification:

\```python
def hello_world():
    print("Hello, World!")
\```

## Image Paths

For images within posts, reference them from `/public/` or use absolute URLs.
