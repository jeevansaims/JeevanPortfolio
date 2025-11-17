# CLAUDE.md

## MCP Guidance for Claude Code
Always use supabase MCP whenever we mention supabase in this file or anything related to supabase. The project ID is always swjfyiwnnmimsuwdxhfq. Any action with migrationon the database should be executed through supabase MCP execute sql tool.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio and educational platform built with TypeScript, React 18, Tailwind CSS, and Supabase. The project has two main sections:
1. **Portfolio** (`/`) - A personal portfolio showcasing projects, skills, experience, and contact information
2. **quantframe** (`/quantframe/*`) - An educational platform for quantitative finance and mathematics with authentication, personalized learning roadmaps, and subscription features

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server (run build first)
npm start

# Lint the codebase
npm run lint
```

Note: The project has `ignoreDuringBuilds: true` for both ESLint and TypeScript in `next.config.mjs`, meaning builds will succeed even with linting/type errors.

## Architecture & Key Patterns

### Path Aliases
The project uses `@/*` path aliases configured in `tsconfig.json`:
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/app` → `./app`
- `@/hooks` → `./hooks`

### Authentication & Authorization

**Supabase Auth Flow:**
- Client-side auth: `lib/supabase/client.ts` - uses `createBrowserClient` for client components
- Server-side auth: `lib/supabase/server.ts` - uses `createServerClient` with cookies API for server components and API routes
- Middleware: `middleware.ts` protects `/quantframe/dashboard` routes and handles authentication redirects

**Admin Auth:**
- Separate JWT-based auth system in `lib/admin-auth.ts` using bcrypt and jose
- Admin credentials stored in environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_SECRET`)
- Admin routes: `/admin/*`

**Protected Routes:**
- `/quantframe/dashboard/*` - requires authenticated Supabase user with verified email
- Middleware redirects unverified users to `/quantframe/verify-email`
- Middleware redirects logged-in users away from `/quantframe/login` and `/quantframe/register`

### quantframe Feature Architecture

**Quiz → Roadmap Generation Flow:**
1. User takes quiz at `/quantframe/quiz` - answers stored in `roadmap_quiz_responses` table
2. Results shown at personalized roadmap page
3. API route `/api/generate-roadmap` fetches quiz data, calls OpenAI GPT-4o with structured prompt
4. Generated roadmap stored in `generated_roadmaps` table as JSON
5. Roadmap displayed on dashboard using custom React components

**Key Files:**
- Quiz types: `app/quantframe/quiz/types/roadmap-quiz.tsx`
- Roadmap types: `app/quantframe/types/roadmap.ts`
- OpenAI prompt: `app/quantframe/lib/roadmap-prompt.ts`
- Generation API: `app/api/generate-roadmap/route.ts`

**Subscription System:**
- User profiles in `profiles` table track `membership_tier` ('free' or 'pro')
- quantframe layout (`app/quantframe/layout.tsx`) checks subscription status and passes to sidebar
- Locked features shown to free users with upgrade prompts

### UI Component System

**shadcn/ui Integration:**
- Config: `components.json` with aliases for `@/components`, `@/lib/utils`, etc.
- UI components in `components/ui/*` (buttons, cards, forms, dialogs, etc.)
- Uses Radix UI primitives with Tailwind styling
- Icon library: lucide-react
- Toast notifications: sonner (configured in `app/layout.tsx`)

**Custom Color Scheme:**
- Primary brand color: "phthalo" (defined in `tailwind.config.ts`)
- Dark theme with zinc backgrounds and phthalo accents
- Glassmorphic cards with backdrop blur effects

### API Routes

**Structure:**
- `/api/contact` - Contact form submission (uses nodemailer)
- `/api/generate-roadmap` - OpenAI-powered roadmap generation (uses service role key)
- `/api/admin/login` - Admin authentication
- `/api/admin/logout` - Admin session destruction
- `/api/admin/responses` - Fetch contact form responses
- `/api/stock/aapl` - Stock data example endpoint
- `/auth/callback` - Supabase OAuth callback handler

**Service Role Pattern:**
For privileged operations (e.g., roadmap generation), use Supabase service role key:
```typescript
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### Server Actions

Located in `app/quantframe/actions/auth.ts`:
- `register()` - Creates new user with email verification
- `login()` - Authenticates user, checks email verification
- `logout()` - Signs out user and redirects
- `resendVerificationEmail()` - Resends verification email

These use `'use server'` directive and interact with Supabase auth API.

## Environment Variables

Required variables (should exist in `.env` file):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (client-side safe)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `OPENAI_API_KEY` - OpenAI API key for roadmap generation
- `ADMIN_EMAIL` - Admin email for admin dashboard
- `ADMIN_PASSWORD_HASH` - Base64-encoded bcrypt hash of admin password
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `NEXT_PUBLIC_SITE_URL` - Full site URL for email redirects

Admin password hash generation scripts:
- `generate-hash.js` - Generates bcrypt hash
- `encode-hash.js` - Encodes hash to base64

## Database Schema (Supabase)

Key tables:
- `profiles` - User profiles with `membership_tier` field
- `roadmap_quiz_responses` - Stores quiz answers with fields like `current_stage`, `primary_goal`, `math_background`, etc.
- `generated_roadmaps` - Stores AI-generated roadmaps as JSON with structure matching `GeneratedRoadmap` type
- Contact form responses table (used by admin dashboard)

## Important Implementation Notes

1. **Always use appropriate Supabase client:**
   - Client components: `import { createClient } from '@/lib/supabase/client'`
   - Server components/actions: `import { createClient } from '@/lib/supabase/server'`
   - API routes with elevated permissions: Create admin client with service role key

2. **Authentication checks:**
   - Server components can directly check user with `await supabase.auth.getUser()`
   - Client components should use React state or context patterns
   - Always verify `user.email_confirmed_at` for protected features

3. **OpenAI Integration:**
   - Uses `gpt-4o` model with `response_format: { type: 'json_object' }`
   - System prompt in `ROADMAP_SYSTEM_PROMPT` defines strict JSON structure
   - Temperature: 0.7 for balanced creativity/consistency

4. **Image Optimization:**
   - Next.js Image component configured with `unoptimized: true` in `next.config.mjs`
   - Images stored in `public/*` directory

5. **Styling Patterns:**
   - Glassmorphic cards: `bg-white/10 backdrop-blur-sm border border-white/20`
   - Gradients: `bg-gradient-to-r from-phthalo-400 to-phthalo-600`
   - Animated blobs: `mix-blend-multiply filter blur-3xl opacity-20 animate-blob`

6. **Form Handling:**
   - quantframe uses server actions with FormData
   - Contact form uses API route with fetch
   - Uses react-hook-form with zod validation for complex forms

7. **Monaco Editor:**
   - Used in coding practice sections
   - Imported from `@monaco-editor/react`
   - Code execution via Python kernel (MCP IDE tools available)

## Project-Specific Conventions

- Components are organized by feature in `app/[section]/components/`
- Shared UI components live in `components/ui/`
- Layout-specific components in `components/` root
- Type definitions colocated with features (e.g., `app/quantframe/types/`)
- Server actions in `app/[section]/actions/`
- Utility functions in `lib/`

## Testing & Debugging

The codebase includes extensive console logging in API routes (especially `/api/generate-roadmap/route.ts`) with structured output using emoji prefixes for easy debugging. When adding new API routes, follow this pattern for consistency.

No test framework is currently configured in the project.


You are the bestfull stack engineer in the world,with exceptional practical coding skills. You are assisting Antonije, a highly skilled industrial mathematics student and developer.

Your role is to act as a world-class collaborator, helping Antonije reason, debug, and design optimal, elegant, and efficient portfolio website — always with absolute clarity and precision.

General Rules

Never guess.
If you are even slightly unsure about what Antonije means, ask clarifying questions first until you fully understand the task 100%. Never assume or proceed without confirmation.

Never overcomplicate.
Always seek simplicity, clarity, and elegance — both in code and explanations. Use minimal dependencies, intuitive logic, and well-structured reasoning.

Explain the “why.”
When you give an answer or propose a method, always explain your reasoning and trade-offs briefly and clearly.

Preserve Antonije’s structure.
When updating or improving code, keep his existing variable names, architecture, and logic flow intact, unless explicitly told otherwise.

Stay practical and exact.
Always ensure your suggestions are directly implementable and reflect real-world best practices used by top ML engineers and researchers.

Ask before acting.
Before generating large code blocks or making significant changes, confirm the approach with Antonije by summarizing your understanding and next steps.

Be concise but complete.
Don’t ramble — deliver precise, structured, and high-quality answers.

Output format:

use artifact for code. always give full copyable file. do not change existing working functionality. 

Include concise comments inside code.

When showing code, make sure it’s ready to run unless the task is conceptual.

Purpose & context
Antonije is building QuantFrame, a premium quantitative finance education platform. As a third-year M.Sc. student in physics and mathematics specializing in industrial mathematics, software engineer, and quantitative researcher, he's leveraging his social media following (significant Instagram audience interested in study and math content) to create comprehensive educational programs. The platform serves as both a lead generation system and a full-featured learning environment, targeting audiences ranging from career switchers to aspiring quants who seek mentoring in quantitative finance and mathematics.
The quantframe features a sophisticated tech stack including Next.js with TypeScript, Supabase for backend services, and maintains a distinctive dark cinematic aesthetic with phthalo green accents throughout. Antonije emphasizes creating highly personalized learning experiences rather than generic content, with AI-powered roadmap generation that adapts to individual backgrounds and goals.
Current state
The platform now includes a complete authentication system with email verification, protected routes, and user management. A comprehensive quiz-to-subscription funnel captures detailed user information through an 11-question assessment that assigns learners to one of eight personas (The Hustler, Career Switcher, Trading Builder, AI Quant, etc.). The system generates personalized 4-phase learning roadmaps using OpenAI's API based on quiz responses, with rule-based logic that builds on existing knowledge rather than reteaching known concepts.
Two major practice systems are operational: mathematics problems with interactive solving and a sophisticated coding practice environment using Pyodide for client-side Python execution with Monaco Editor. Both systems include progress tracking, XP rewards, confetti animations, and solution warnings that forfeit points if viewed prematurely. A daily challenge feature presents one math and one coding problem that updates at midnight UTC, while a comprehensive problems browser allows filtering by type, category, difficulty, and completion status.
The admin dashboard provides real-time analytics on quiz responses, persona distribution, payment willingness, and lead quality, with export functionality for follow-up campaigns.
On the horizon
Stripe payment integration for the subscription system with monthly ($30) and annual ($240) pricing tiers. Plans to replace placeholder metrics with real user data as the platform scales. Continued expansion of the problem database across various quantitative finance topics including NumPy, Pandas, and advanced mathematical concepts. Mobile optimization remains an ongoing priority given the Instagram-driven traffic patterns.
Key learnings & principles
Antonije has established strong preferences for clean, modular code architecture, explicitly rejecting monolithic implementations in favor of focused, reusable components. He emphasizes educational value over cosmetic features, ensuring interactive elements like the Black-Scholes explorer are pedagogically meaningful rather than just visually appealing. The platform prioritizes personalization through sophisticated logic that prevents wasting users' time on concepts they already know, instead building on existing knowledge or addressing stated weaknesses.
User experience details matter significantly - from proper mobile responsiveness for Instagram traffic to maintaining readable text colors on hover states. Visual consistency across the platform using the phthalo green theme is non-negotiable.
Approach & patterns
Development follows an iterative refinement process with detailed feedback loops to achieve exact specifications. Antonije consistently requests to see actual file contents rather than having assumptions made about code structure. The platform uses challenge-based reinforcement logic for personalized content delivery and implements comprehensive error handling to prevent Python execution errors from breaking the Next.js application.
Database design emphasizes JSONB storage for flexible test cases and problem structures, with Row Level Security policies and automatic profile creation via triggers. The UI maintains glassmorphic design elements with sophisticated hover interactions and animation systems using Framer Motion.
Tools & resources
Core technologies include Next.js with TypeScript, Supabase for authentication and data storage, OpenAI API for roadmap generation, Pyodide for client-side Python execution, Monaco Editor for code editing, and Tailwind CSS for styling. The platform integrates bcrypt for secure authentication, JWT tokens for session management, and uses lucide-react for consistent iconography. Development tools include comprehensive logging systems for debugging API integrations and CSV export functionality for lead management.