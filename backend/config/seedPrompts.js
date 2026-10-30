// Public Demo Community Prompts Library (Clean, realistic prompts for the live site)
export const initialSeedPrompts = [
  {
    _id: 'seed_prompt_1',
    title: 'React 18 & Tailwind CSS Responsive Hero Component',
    description: 'Generates a clean, conversion-focused Hero section with gradient typography, CTA buttons, and responsive glassmorphic card.',
    category: 'Software Development',
    targetModel: 'Claude',
    tags: ['react', 'tailwind', 'frontend', 'ui', 'components'],
    author: 'Frontend Pro',
    prompt: `You are an expert Frontend Engineer. Build a responsive, high-converting Hero Section component in React 18 using Tailwind CSS for [PRODUCT_NAME, e.g. an AI productivity assistant].

Key Requirements:
1. Compelling headline with a subtle gradient text effect and value-proposition subtext.
2. Dual CTA buttons ("Start Free Trial" primary button and "Watch 2-Min Demo" secondary button).
3. Product preview card with glassmorphism (backdrop-blur-md) and glowing accent border.
4. Social proof strip featuring company logos and rating stars.
5. Fully responsive with mobile-first Tailwind utility classes.`,
    copies: 142,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_2',
    title: 'Express.js Modular REST API CRUD Router with Validation',
    description: 'Generates clean, maintainable Express.js routes with pagination, status codes, and input validation.',
    category: 'Software Development',
    targetModel: 'ChatGPT',
    tags: ['nodejs', 'express', 'api', 'backend', 'rest'],
    author: 'Backend Craftsman',
    prompt: `Act as a Senior Node.js / Express Developer. Create a production-ready REST API router module for a "[RESOURCE_NAME, e.g. Products]" resource.

Requirements:
1. Endpoints:
   - GET /api/[resource]: Paginated list with limit, skip, and sort query parameters.
   - GET /api/[resource]/:id: Single item lookup with 404 handling.
   - POST /api/[resource]: Create record with payload validation and 400 error handling.
   - PUT /api/[resource]/:id: Update record with partial fields support.
   - DELETE /api/[resource]/:id: Safe deletion returning 200/204 response.
2. Proper HTTP status codes (200, 201, 400, 404, 500).
3. Try-catch blocks forwarding unexpected errors to the Express next() middleware.`,
    copies: 189,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_3',
    title: 'SQL Query Performance & Indexing Optimizer',
    description: 'Analyzes slow SQL queries to detect table scans, optimize joins, and provide precise composite index recommendations.',
    category: 'Data & Analytics',
    targetModel: 'ChatGPT',
    tags: ['sql', 'database', 'performance', 'indexing', 'optimization'],
    author: 'Data Engineer',
    prompt: `You are a Principal Database Administrator. Analyze the following SQL query for execution bottlenecks and slow performance:

Query:
\`\`\`sql
[PASTE_SQL_QUERY_HERE]
\`\`\`

Provide:
1. Bottleneck Analysis: Point out sequential table scans, missing indexes, unoptimized JOIN conditions, or wildcard LIKE clauses.
2. Optimized Query: Provide the refactored, highly efficient SQL statement.
3. Indexing Recommendations: Provide exact CREATE INDEX commands (including composite indexes following the Equality-Range-Sort guideline).
4. Brief explanation of why the optimized version reduces CPU and I/O cycles.`,
    copies: 215,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_4',
    title: 'Python Pandas Data Cleaning & Normalization Pipeline',
    description: 'Transforms messy raw data into structured DataFrames with missing value imputation, type casting, and deduplication.',
    category: 'Data & Analytics',
    targetModel: 'ChatGPT',
    tags: ['python', 'pandas', 'data-cleaning', 'analytics'],
    author: 'Data Analyst',
    prompt: `Act as a Senior Python Data Engineer. Write a robust Pandas preprocessing script to clean a raw [DATA_TYPE, e.g. customer purchase records] dataset.

Steps required:
1. Ingest CSV data with resilient parsing and strip unexpected whitespace from column names.
2. Inspect and handle missing/NaN values (impute numerical columns with median, categorical with mode or "Unknown").
3. Detect and remove duplicate rows based on unique identifiers.
4. Parse and normalize date/time columns to standard ISO format (UTC).
5. Clean currency/numeric strings (remove "$" and "," and cast to float).
6. Print a summary report showing before-and-after row counts and data types.`,
    copies: 164,
    likes: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_5',
    title: 'High-Ranking Technical SEO Blog Post Outline & Keyword Strategy',
    description: 'Creates structured, search-intent driven article outlines with H2/H3 hierarchies, meta descriptions, and semantic keywords.',
    category: 'Writing & Copywriting',
    targetModel: 'Claude',
    tags: ['seo', 'content', 'marketing', 'blogging', 'copywriting'],
    author: 'SEO Strategist',
    prompt: `You are a Lead SEO Content Strategist. Create a high-ranking, search-intent optimized article outline for the target keyword: "[TARGET_KEYWORD, e.g. Docker container security best practices]".

Include:
1. 3 Click-Worthy Title Tag Options (under 60 characters with high CTR emotional triggers).
2. Compelling Meta Description (under 155 characters summarizing the core value).
3. Comprehensive H2 and H3 Heading Structure addressing search intent, competitor gaps, and practical steps.
4. Recommended LSI and secondary semantic keywords to integrate naturally.
5. "People Also Ask" FAQ Section answering the 3 most common user queries.`,
    copies: 98,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_6',
    title: 'Empathetic Customer Support Escalation & Resolution Email',
    description: 'Crafts professional, de-escalating customer service emails addressing technical glitches or billing inquiries.',
    category: 'General Productivity',
    targetModel: 'ChatGPT',
    tags: ['customer-support', 'communication', 'email', 'productivity'],
    author: 'Support Lead',
    prompt: `Write an empathetic, courteous, and professional customer support email responding to a user who reported: "[ISSUE_DESCRIPTION, e.g. unable to access account after billing renewal]".

Key Tone & Structure:
1. Acknowledge and validate their frustration immediately without being overly defensive.
2. Explain the root cause in simple, non-jargon terms so the customer feels respected.
3. Detail the immediate resolution steps already taken to resolve their issue.
4. Offer a token of goodwill (e.g. 1 month account credit or priority ticket status).
5. Provide a direct point of contact for any further questions.`,
    copies: 73,
    likes: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_7',
    title: 'Git Merge Conflict & Detached HEAD Troubleshooting Guide',
    description: 'Provides safe, step-by-step terminal commands to resolve tricky Git conflicts, stash mishaps, and commit history mistakes.',
    category: 'DevOps & Cloud',
    targetModel: 'General / Any LLM',
    tags: ['git', 'cli', 'version-control', 'devops'],
    author: 'Git Instructor',
    prompt: `Act as a Senior Git Engineer. A developer ran into the following Git problem:
Scenario: "[DESCRIBE_GIT_PROBLEM, e.g. accidentally committed a 100MB file / merge conflict on 4 files during rebase / detached HEAD state]".

Provide:
1. Safe Diagnostic Command: How to inspect the repository state without risking uncommitted changes.
2. Step-by-Step Recovery Commands: Numbered commands with exact syntax to resolve the issue safely.
3. Explanations: One-sentence explanation of what each command does to Git's index and commit graph.
4. Prevention Best Practice: How to avoid this issue in future team workflows.`,
    copies: 310,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_8',
    title: 'Automated Unit Test Suite Generator with Jest / Vitest',
    description: 'Generates robust test cases covering happy paths, edge cases, error boundaries, and mock functions.',
    category: 'Software Development',
    targetModel: 'Claude',
    tags: ['testing', 'jest', 'vitest', 'unit-test', 'qa'],
    author: 'QA Lead',
    prompt: `You are a Lead QA Automation Engineer. Write a comprehensive unit test suite using [FRAMEWORK, e.g. Jest or Vitest] for the following code snippet:

\`\`\`[LANGUAGE]
[PASTE_CODE_HERE]
\`\`\`

Test Requirements:
1. Happy Path: Test normal expected inputs and verify correct return values.
2. Edge Cases: Test null, undefined, empty strings, zero, and boundary limits.
3. Error Handling: Verify that functions throw expected custom errors or reject promises on invalid inputs.
4. Mocking: Mock external network requests or database calls cleanly using mock functions.`,
    copies: 135,
    likes: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_9',
    title: 'Human-Readable Regular Expression (Regex) Builder & Explainer',
    description: 'Creates precise Regex patterns for input validation with token-by-token explanations and passing/failing test fixtures.',
    category: 'Software Development',
    targetModel: 'General / Any LLM',
    tags: ['regex', 'developer-tools', 'validation', 'utilities'],
    author: 'Regex Master',
    prompt: `Create a clean, bulletproof Regular Expression (Regex) to validate: "[VALIDATION_RULE, e.g. strong password with 8+ characters, at least one uppercase, one lowercase, one number, and one symbol]".

Your answer must include:
1. Complete Regular Expression with appropriate flags (e.g. /pattern/g).
2. Token-by-Token Breakdown explaining what each character group accomplishes.
3. 3 Valid Examples that will pass validation.
4. 3 Invalid Examples that will fail validation (explaining why they fail).`,
    copies: 240,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_10',
    title: 'Modern Minimalist Vector Logo Generator for Midjourney',
    description: 'Generates crisp vector logo prompts with flat graphic styling, modern geometric shapes, and clean color schemes.',
    category: 'AI Art & Midjourney',
    targetModel: 'Midjourney',
    tags: ['midjourney', 'logo', 'design', 'vector', 'branding'],
    author: 'Brand Designer',
    prompt: `Create a professional Midjourney v6 prompt to design a modern minimalist vector logo for [COMPANY_NAME], a [INDUSTRY_DESCRIPTION, e.g. cloud security platform].

Prompt Structure:
Minimalist vector logo of [ICON_CONCEPT, e.g. an abstract origami falcon composed of geometric polygons], flat 2D graphic design, clean bold silhouettes, modern tech branding, vibrant duotone gradient palette (midnight navy and neon emerald), pure white solid background, Paul Rand and Saul Bass inspired, Behance featured, sharp vector art --no 3d render, photo, photorealistic, shadows, gradients, clutter --v 6.1 --style raw`,
    copies: 118,
    likes: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_11',
    title: 'Agile Sprint Retrospective & Action Item Summarizer',
    description: 'Transforms unstructured meeting notes into an organized Scrum retro summary with celebrations, pain points, and owners.',
    category: 'General Productivity',
    targetModel: 'ChatGPT',
    tags: ['agile', 'scrum', 'productivity', 'management'],
    author: 'Agile Coach',
    prompt: `Act as a certified Agile Scrum Master. Summarize the following unstructured team retrospective notes into an executive Sprint Retrospective Report:

Raw Notes:
"""
[PASTE_RAW_RETRO_NOTES_HERE]
"""

Format the report into:
1. Sprint Celebrations & Wins: Key achievements and milestones hit.
2. Impediments & Friction Points: Engineering bottlenecks, communication gaps, or tooling issues.
3. Action Item Matrix: Table with 3 columns:
   - Action Item (Specific, Measurable)
   - Owner / DRI
   - Target Completion Date`,
    copies: 62,
    likes: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed_prompt_12',
    title: 'TypeScript Interface & Zod Schema Auto-Generator',
    description: 'Converts raw JSON data into strictly-typed TypeScript interfaces and runtime Zod validation schemas.',
    category: 'Software Development',
    targetModel: 'Claude',
    tags: ['typescript', 'zod', 'validation', 'schemas'],
    author: 'TypeScript Lead',
    prompt: `Act as a Senior TypeScript Specialist. Given this sample JSON payload:

\`\`\`json
[PASTE_SAMPLE_JSON_PAYLOAD]
\`\`\`

Provide:
1. Strict TypeScript Interfaces: Nested interfaces with proper typing, readonly flags where appropriate, and optional properties marked with "?".
2. Matching Zod Validation Schema: Complete z.object({ ... }) schema matching the data types with email, min/max length, and optional validators.
3. Inferred Type Export: type SafePayload = z.infer<typeof PayloadSchema>;.`,
    copies: 175,
    likes: [],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
];
