import { KnowledgeChunk } from './types'

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'about-yamin',
    fileKey: 'about.md',
    title: 'About Yamin Hossain',
    category: 'about',
    content: `Yamin Hossain is an AI-Native Software Engineer based in Rajshahi, Bangladesh.
He builds production LLM agents, LangGraph pipelines, and RAG systems end-to-end, with reliability practices that hold up under real load.
Key traits: Async queuing, exponential backoff, observable multi-agent pipelines. Not just demos; shipped products.
Status: Currently open to early-stage remote teams who want someone to own hard problems from day one.
Contact Email: yamindr@gmail.com, GitHub: github.com/yamin, LinkedIn: linkedin.com/in/yamin.`,
    keywords: ['yamin', 'who', 'about', 'bio', 'location', 'bangladesh', 'rajshahi', 'remote', 'role', 'engineer', 'hiring', 'status', 'contact'],
    recommendedActions: [
      { id: 'open-about', label: 'View About in Finder', icon: 'finder', actionType: 'open_file', payload: 'About/about.md' },
      { id: 'contact-mail', label: 'Email Yamin', icon: 'email', actionType: 'contact', payload: 'yamindr@gmail.com' },
    ],
  },
  {
    id: 'stack-ai-agents',
    fileKey: 'stack.md',
    title: 'AI & Agents Tech Stack',
    category: 'stack',
    content: `AI & Agents Stack:
- Frameworks: LangGraph, LangChain, RAG pipelines, pgvector
- Techniques: Prompt Engineering, Tool Calling, Guardrails, Evaluators
- Why LangGraph: Preferred over raw LangChain for anything with branching logic. Conditional edges and persistent state are non-negotiable in production agents.
- Latency & Reliability: Vector retrieval with 384-dimensional embeddings, hybrid keyword + semantic search, chunked diff processing.`,
    keywords: ['langgraph', 'langchain', 'rag', 'pgvector', 'agents', 'prompt engineering', 'tool calling', 'guardrails', 'branching', 'conditional edges', 'state', 'vector'],
    recommendedActions: [
      { id: 'open-stack', label: 'View Full Stack in Finder', icon: 'finder', actionType: 'open_file', payload: 'About/stack.md' },
      { id: 'term-neofetch', label: 'Run Neofetch in Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'neofetch' },
    ],
  },
  {
    id: 'stack-backend-infra',
    fileKey: 'stack.md',
    title: 'Backend, Databases & Infrastructure',
    category: 'stack',
    content: `Backend & Infra Stack:
- Backend: Python (FastAPI for inference layer), Node.js (Express/TypeScript for orchestration & webhooks), BullMQ, REST APIs, WebSocket, SSE.
- Databases: PostgreSQL, Prisma ORM, Redis (queue & cache), Neon serverless, MySQL.
- Infrastructure: Docker, Vercel, Render, Turborepo, Git, CI/CD pipelines.
- Architecture Rule: FastAPI for inference; Node.js for orchestration and webhooks. BullMQ + Redis for queue. Every agent call touching an external API goes through a queue without exception.`,
    keywords: ['python', 'fastapi', 'node', 'nodejs', 'express', 'typescript', 'bullmq', 'redis', 'queue', 'queuing', 'postgresql', 'prisma', 'docker', 'infrastructure', 'backend'],
    recommendedActions: [
      { id: 'open-stack-file', label: 'Open Stack in Finder', icon: 'finder', actionType: 'open_file', payload: 'About/stack.md' },
    ],
  },
  {
    id: 'philosophy-reliability',
    fileKey: 'philosophy.md',
    title: 'Engineering Philosophy: Reliability is the Feature',
    category: 'philosophy',
    content: `Engineering Philosophy - Reliability is the Feature:
A demo that works once is not a product. Every system Yamin builds has:
1. Exponential backoff with jitter on all external API requests.
2. Structured logging for incident traceability.
3. Rollback handling before shipping to production.
4. Fallback models when primary LLMs rate-limit or fail.
5. Strict output guardrails and schema validation (Zod / Pydantic).`,
    keywords: ['reliability', 'philosophy', 'backoff', 'exponential backoff', 'logging', 'rollback', 'production', 'pipeline', 'guardrails', 'error handling', 'failure'],
    recommendedActions: [
      { id: 'open-philosophy', label: 'Read Philosophy in Finder', icon: 'finder', actionType: 'open_file', payload: 'About/philosophy.md' },
    ],
  },
  {
    id: 'philosophy-observability-queues',
    fileKey: 'philosophy.md',
    title: 'Engineering Philosophy: Observability, Queues & End-to-End Ownership',
    category: 'philosophy',
    content: `Engineering Philosophy:
- Agents need observability: A multi-agent pipeline that fails silently is worse than no pipeline. Every node gets logged. Every decision gets traced. You cannot debug what you cannot see.
- Queue everything external: If it calls an API, it goes through a queue (BullMQ + Redis). Webhooks, LLM calls, GitHub API — all queued with retry logic. This is the difference between a system that handles load and one that falls over.
- Build the full thing: Yamin does not hand off pieces. He owns the webhook, the inference layer, the dashboard, and the deployment. End-to-end or not at all.`,
    keywords: ['observability', 'queue', 'queuing', 'tracing', 'logging', 'bullmq', 'ownership', 'full stack', 'end-to-end', 'philosophy'],
    recommendedActions: [
      { id: 'open-philosophy-2', label: 'View Philosophy File', icon: 'finder', actionType: 'open_file', payload: 'About/philosophy.md' },
    ],
  },
  {
    id: 'project-pr-review-agent',
    fileKey: 'pr-review-agent.md',
    title: 'PR Review Agent (Live GitHub App)',
    category: 'projects',
    content: `PR Review Agent:
- Status: Live Marketplace-installable GitHub App (June 2026 – Present)
- What it does: Ingests 6 months of merged PR history and posts inline review comments referencing specific past team decisions, not generic rules. Team knowledge becomes searchable and persistent.
- Example: Instead of "this function is too long", it says: "your team rejected this pattern in PR #234".
- Architecture: Webhook → Node.js orchestrator → BullMQ/Redis queue → Python FastAPI agent → pgvector → Next.js dashboard.
- Technical Depth: 6-node LangGraph pipeline, chunked diff processing, pgvector cosine similarity search across 384-dimensional embeddings, exponential backoff on all external calls, rollback handling, structured logging for incident traceability.
- Stack: Next.js, TypeScript, Python, FastAPI, LangGraph, LangChain, pgvector, PostgreSQL, Prisma, BullMQ, Redis, Docker.`,
    keywords: ['pr review agent', 'pr review', 'github app', 'pr', 'pull request', 'langgraph', 'pgvector', 'embeddings', 'diff', 'code review', 'bullmq', 'architecture'],
    recommendedActions: [
      { id: 'open-pr-project', label: '⚡ Simulate LangGraph Pipeline', icon: 'finder', actionType: 'open_file', payload: 'Projects/pr-review-agent.md' },
      { id: 'cat-pr', label: 'Inspect Pipeline in Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'pipeline' },
    ],
  },
  {
    id: 'project-bug-reproducer',
    fileKey: 'bug-reproducer.md',
    title: 'Bug Reproducer (Autonomous Debugging Service)',
    category: 'projects',
    content: `Bug Reproducer:
- Status: Live Autonomous End-to-End Debugging API Service (Feb 2026 – Present)
- What it does: Takes a GitHub issue URL, reproduces the bug in an isolated container, writes a failing test, generates a fix, verifies the test passes, and opens a PR. Full debugging cycle without human intervention.
- The hard part: When a test fails for the wrong reason, most agents retry blindly. This agent parses the error output and rewrites the test using that context before retrying.
- Architecture: 7-node LangGraph pipeline with conditional edges based on test failure type.
- Stack: Next.js, TypeScript, Node.js, Express.js, Python, FastAPI, LangChain, LangGraph, PostgreSQL, Prisma, BullMQ, Docker.`,
    keywords: ['bug reproducer', 'bug', 'reproducer', 'autonomous', 'debugging', 'test', 'failing test', 'github issue', 'langgraph', 'conditional edges', 'retry logic'],
    recommendedActions: [
      { id: 'open-bug-project', label: 'Open Bug Reproducer in Finder', icon: 'finder', actionType: 'open_file', payload: 'Projects/bug-reproducer.md' },
      { id: 'cat-bug', label: 'Inspect in Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'cat bug-reproducer.md' },
    ],
  },
  {
    id: 'project-remotion-oss',
    fileKey: 'remotion-contribution.md',
    title: 'Remotion Open Source Contribution (52k+ Stars)',
    category: 'projects',
    content: `Remotion Open Source Contribution:
- Target: Remotion (52.6k+ GitHub stars, remotion.dev)
- PR #7074 — preserveSilence option: Added preserveSilence option to renderMediaOnWeb(), ensuring silent head/tail frames are retained in the output file. Fixes timing misalignment when feeding exports into ASR transcription pipelines. Included regression test: a 5s composition always produces exactly 5s output regardless of silent segments.
- PR #7107 — playbackRate validation: Extended playbackRate validation in @remotion/player from ±4 to ±10 to match modern browser capabilities. Updated validation logic, API documentation, and unit tests (18 passing).
- Stack: TypeScript, React, Web Audio API, Bun.`,
    keywords: ['remotion', 'open source', 'oss', 'contribution', 'preserveSilence', 'renderMediaOnWeb', 'playbackRate', 'web audio', 'transcription', 'video'],
    recommendedActions: [
      { id: 'open-remotion-file', label: 'Open Remotion Notes in Finder', icon: 'finder', actionType: 'open_file', payload: 'Projects/remotion-contribution.md' },
    ],
  },
  {
    id: 'resume-qualifications',
    fileKey: 'yamin_resume.pdf',
    title: 'Yamin Hossain — Resume & Qualifications',
    category: 'resume',
    content: `Yamin Hossain — AI-Native Software Engineer
Education: Varendra University — B.Eng Electrical and Electronic Engineering (Oct 2022 – Mar 2026).
Experience & Projects:
- PR Review Agent: GitHub App, 6-node LangGraph pipeline, pgvector similarity search, BullMQ/Redis async queue, FastAPI backend.
- Bug Reproducer: Autonomous end-to-end debugging API service, 7-node LangGraph pipeline with conditional retry edges.
- Remotion Contributions: PR #7074 (preserveSilence in renderMediaOnWeb) and PR #7107 (playbackRate ±10 validation).
- Core Competencies: LangGraph multi-agent architecture, pgvector RAG systems, exponential backoff, async task queuing, full-stack Next.js/FastAPI pipelines.`,
    keywords: ['resume', 'cv', 'education', 'varendra', 'engineering', 'qualifications', 'experience', 'projects', 'skills'],
    recommendedActions: [
      { id: 'open-resume-file', label: 'Open Resume in Finder', icon: 'finder', actionType: 'open_file', payload: 'Resume/yamin_resume.pdf' },
    ],
  },
]
