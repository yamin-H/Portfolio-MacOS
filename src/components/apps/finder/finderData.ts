export type FileTag = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray'

export const TAG_COLORS: Record<FileTag, { name: string; hex: string }> = {
  red:    { name: 'Red',    hex: '#FF453A' },
  orange: { name: 'Orange', hex: '#FF9F0A' },
  yellow: { name: 'Yellow', hex: '#FFD60A' },
  green:  { name: 'Green',  hex: '#30D158' },
  blue:   { name: 'Blue',   hex: '#0A84FF' },
  purple: { name: 'Purple', hex: '#BF5AF2' },
  gray:   { name: 'Gray',   hex: '#98989D' },
}

export interface FSEntry {
  id: string
  name: string
  isFolder: boolean
  kind: 'folder' | 'zip' | 'image' | 'pdf' | 'markdown' | 'code' | 'audio' | 'video' | 'app' | 'text' | 'generic' | 'link'
  size: string
  sizeBytes: number
  dateModified: string
  dateCreated: string
  parentPath: string // e.g. "/Users/yamin" or "/Users/yamin/02_Resume_&_Credentials"
  tag?: FileTag
  appIconSrc?: string
  content?: string
  contentKey?: string
  url?: string
}

export const INITIAL_FS_ENTRIES: FSEntry[] = [
  // ─── ROOT HOME DIRECTORY: /Users/yamin ─────────────────────────────────────
  {
    id: 'root-about',
    name: '01_About_Me',
    isFolder: true,
    kind: 'folder',
    size: '1.8 MB',
    sizeBytes: 1887436,
    dateModified: 'Today at 9:41 AM',
    dateCreated: 'Oct 01, 2024 at 10:00 AM',
    parentPath: '/Users/yamin',
    tag: 'red',
  },
  {
    id: 'root-resume-folder',
    name: '02_Resume_&_Credentials',
    isFolder: true,
    kind: 'folder',
    size: '420 KB',
    sizeBytes: 430080,
    dateModified: 'Today at 10:15 AM',
    dateCreated: 'Oct 01, 2024 at 10:00 AM',
    parentPath: '/Users/yamin',
    tag: 'purple',
  },
  {
    id: 'root-projects',
    name: '03_Production_AI_Agents',
    isFolder: true,
    kind: 'folder',
    size: '14.8 MB',
    sizeBytes: 15518924,
    dateModified: 'Today at 11:20 AM',
    dateCreated: 'Jun 10, 2024 at 2:00 PM',
    parentPath: '/Users/yamin',
    tag: 'blue',
  },
  {
    id: 'root-opensource',
    name: '04_Open_Source_Impact',
    isFolder: true,
    kind: 'folder',
    size: '64 KB',
    sizeBytes: 65536,
    dateModified: 'Jul 15, 2024 at 4:10 PM',
    dateCreated: 'May 01, 2024 at 9:00 AM',
    parentPath: '/Users/yamin',
    tag: 'green',
  },
  {
    id: 'root-sysdesign',
    name: '05_System_Design_Case_Studies',
    isFolder: true,
    kind: 'folder',
    size: '128 KB',
    sizeBytes: 131072,
    dateModified: 'Aug 04, 2024 at 1:15 PM',
    dateCreated: 'Jun 15, 2024 at 11:30 AM',
    parentPath: '/Users/yamin',
    tag: 'yellow',
  },
  {
    id: 'root-playgrounds',
    name: '07_Playgrounds_&_Code',
    isFolder: true,
    kind: 'folder',
    size: '320 KB',
    sizeBytes: 327680,
    dateModified: 'Yesterday at 3:15 PM',
    dateCreated: 'Feb 10, 2024 at 8:00 PM',
    parentPath: '/Users/yamin',
  },
  {
    id: 'root-resume-file',
    name: 'Resume.pdf',
    isFolder: false,
    kind: 'pdf',
    size: '184 KB',
    sizeBytes: 188416,
    dateModified: 'Today at 9:41 AM',
    dateCreated: 'Jun 01, 2024 at 10:00 AM',
    parentPath: '/Users/yamin',
    tag: 'purple',
    content: `Yamin Hossain — AI-Native Software Engineer | LangGraph
Rajshahi, Bangladesh | +880-01706960268 | Email: contact@yamin.dev

AI-Native Software Engineer specializing in production LLM agents, LangGraph pipelines, and RAG systems. Ships complete products end-to-end with production reliability practices async queuing, exponential backoff, and observable multi-agent pipelines.`,
  },

  // ─── 01_About_Me ─────────────────────────────────────────────────────────
  {
    id: 'about-bio',
    name: 'Bio & Engineering Journey.md',
    isFolder: false,
    kind: 'markdown',
    size: '4.2 KB',
    sizeBytes: 4300,
    dateModified: 'Today at 9:41 AM',
    dateCreated: 'Jan 15, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/01_About_Me',
    tag: 'red',
    content: `# Yamin Hossain — AI-Native Software Engineer

Based in **Rajshahi, Bangladesh**.

I build **production LLM agents, LangGraph pipelines, and RAG systems** — end-to-end, with reliability practices that hold up under real production load.

### Engineering Background
- **Education:** Varendra University — Bachelor of Engineering in Electrical and Electronic Engineering (Oct 2022 – Mar 2026).
- **Core Focus:** Async queuing (BullMQ + Redis), exponential backoff, observable multi-agent state graphs, AST diff parsing, and vector similarity search.
- **Delivery Model:** End-to-end ownership. I don't hand off half-finished demos. I own the webhook layer, the inference pipeline, the database indexing, and the dashboard.

### Contact & Reach
- **Email:** yamindr3@gmail.com
- **Phone:** +880-01706960268
- **GitHub:** https://github.com/yamin-H
- **LinkedIn:** https://www.linkedin.com/in/yamin-hossain-n/`,
  },
  {
    id: 'about-philosophy',
    name: 'Engineering Philosophy.md',
    isFolder: false,
    kind: 'markdown',
    size: '2.8 KB',
    sizeBytes: 2867,
    dateModified: 'Yesterday at 4:20 PM',
    dateCreated: 'Jan 20, 2024 at 11:30 AM',
    parentPath: '/Users/yamin/01_About_Me',
    tag: 'yellow',
    content: `# Engineering Philosophy

1 · Reliability is the Feature — A demo that works once on a golden prompt is not an engineering achievement. Every system I build has exponential backoff, structured error recovery, rollback handling, and retry limits before shipping.

2 · Agents Need Observability — A multi-agent pipeline that fails silently is worse than a crashed server. Traceability via LangSmith, structured logging, latency profiling, and token accounting are day-one requirements.

3 · Code You Can Read at 3 AM — Clever one-liners cause 3 AM incidents. I write explicit, readable, well-typed code with clear domain boundaries, exhaustive error handling, and zero magic.

4 · Ship Small, Ship Often — Long branches breed merge hell and hidden regressions. I prefer trunk-based development, feature flags, atomic commits, and continuous deployment over quarterly big bangs.`,
  },
  {
    id: 'about-stack',
    name: 'Tech Stack & Specialization.md',
    isFolder: false,
    kind: 'markdown',
    size: '3.6 KB',
    sizeBytes: 3686,
    dateModified: 'Yesterday at 2:00 PM',
    dateCreated: 'Feb 01, 2024 at 9:00 AM',
    parentPath: '/Users/yamin/01_About_Me',
    tag: 'blue',
    content: `# Technical Stack & Specialization

### AI & Autonomous Agent Systems
- **LangGraph & LangChain:** Multi-agent state machines, conditional routing, human-in-the-loop cycles.
- **RAG & Vector Search:** pgvector, OpenAI / Anthropic embeddings, cosine similarity, chunked diff processing.
- **Prompt Engineering & Tool Calling:** Strict JSON schemas, guardrails, output validation.

### Backend & Orchestration
- **Python & FastAPI:** High-throughput async inference microservices, Pydantic data validation.
- **Node.js & Express / TypeScript:** Webhook ingestion, event handling, WebSocket / SSE streams.
- **BullMQ & Redis:** Background task queues, delayed jobs, rate-limiting, failure dead-letter queues.

### Frontend
- **React.js & Next.js 16:** App Router, Server Actions, Client Components, Turbopack.
- **TypeScript & Tailwind CSS:** Strict type-safety, responsive design, custom animation design systems.
- **State Management:** Zustand, React Context, Framer Motion spring physics.

### Databases & Infrastructure
- **PostgreSQL & Prisma ORM:** Relational schemas, migrations, pgvector extension.
- **Docker & Turborepo:** Monorepo architecture, containerized microservices, CI/CD automated pipelines.`,
  },
  {
    id: 'about-contact',
    name: 'Contact & Socials.md',
    isFolder: false,
    kind: 'markdown',
    size: '1.1 KB',
    sizeBytes: 1126,
    dateModified: 'Today at 8:30 AM',
    dateCreated: 'Feb 15, 2024 at 1:00 PM',
    parentPath: '/Users/yamin/01_About_Me',
    content: `# Get in Touch

Open to fullstack and AI engineering roles — remote, worldwide.

- **Email:** yamindr3@gmail.com
- **GitHub:** https://github.com/yamin-H
- **LinkedIn:** https://www.linkedin.com/in/yamin-hossain-n/
- **WhatsApp:** +880-01706960268
- **Location:** Rajshahi, Bangladesh (Available for remote roles worldwide)`,
  },

  // ─── 02_Resume_&_Credentials ─────────────────────────────────────────────
  {
    id: 'resume-main-pdf',
    name: 'Resume.pdf',
    isFolder: false,
    kind: 'pdf',
    size: '184 KB',
    sizeBytes: 188416,
    dateModified: 'Today at 9:41 AM',
    dateCreated: 'Jun 01, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/02_Resume_&_Credentials',
    tag: 'purple',
    content: `Yamin Hossain — AI-Native Software Engineer | LangGraph
Rajshahi, Bangladesh | +880-01706960268 | Email: contact@yamin.dev

Specializing in production LLM agents, LangGraph pipelines, and RAG systems. Ships complete products end-to-end with production reliability practices async queuing, exponential backoff, and observable multi-agent pipelines.`,
  },

  // ─── 03_Production_AI_Agents ─────────────────────────────────────────────
  {
    id: 'agents-pr-review',
    name: 'PR-Review-Agent',
    isFolder: true,
    kind: 'folder',
    size: '2 items',
    sizeBytes: 278,
    dateModified: 'Today at 11:00 AM',
    dateCreated: 'Jun 10, 2024 at 2:00 PM',
    parentPath: '/Users/yamin/03_Production_AI_Agents',
    tag: 'blue',
  },
  {
    id: 'agents-bug-reproducer',
    name: 'Autonomous-Bug-Reproducer',
    isFolder: true,
    kind: 'folder',
    size: '2 items',
    sizeBytes: 310,
    dateModified: 'Yesterday at 5:10 PM',
    dateCreated: 'Feb 15, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents',
    tag: 'blue',
  },
  {
    id: 'agents-portfolio-os',
    name: 'Portfolio-OS',
    isFolder: true,
    kind: 'folder',
    size: '2 items',
    sizeBytes: 282,
    dateModified: 'Today at 9:15 AM',
    dateCreated: 'Jan 01, 2024 at 12:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents',
    tag: 'purple',
  },

  // ─── PR-Review-Agent Subfolder (2 Files: GitHub Link & Live Demo) ────────
  {
    id: 'pr-github-link',
    name: 'GitHub Repository.url',
    isFolder: false,
    kind: 'link',
    size: '142 B',
    sizeBytes: 142,
    dateModified: 'Today at 10:30 AM',
    dateCreated: 'Jun 10, 2024 at 2:00 PM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/PR-Review-Agent',
    tag: 'blue',
    url: 'https://github.com/yamin-H/ai-pr-reviewer-yamin',
    content: `[InternetShortcut]
URL=https://github.com/yamin-H/ai-pr-reviewer-yamin

Title: PR Review Agent (GitHub Repository)
Description: Marketplace-installable GitHub App that ingests team PR history and posts inline review comments referencing past team decisions.`,
  },
  {
    id: 'pr-live-demo',
    name: 'Live Demo.url',
    isFolder: false,
    kind: 'link',
    size: '136 B',
    sizeBytes: 136,
    dateModified: 'Today at 11:00 AM',
    dateCreated: 'Jun 10, 2024 at 2:00 PM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/PR-Review-Agent',
    tag: 'green',
    url: 'https://ai-pr-reviewer-yamin.vercel.app/',
    content: `[InternetShortcut]
URL=https://ai-pr-reviewer-yamin.vercel.app/

Title: PR Review Agent (Live Production Demo)
Description: Live production dashboard and review demo for the PR Review Agent.`,
  },

  // ─── Autonomous-Bug-Reproducer Subfolder (2 Files: GitHub Link & Live Demo) 
  {
    id: 'bug-github-link',
    name: 'GitHub Repository.url',
    isFolder: false,
    kind: 'link',
    size: '158 B',
    sizeBytes: 158,
    dateModified: 'Yesterday at 3:00 PM',
    dateCreated: 'Feb 15, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Autonomous-Bug-Reproducer',
    tag: 'blue',
    url: 'https://github.com/yamin-H/Bug-Reproducer-Autonomous-AI-Agent',
    content: `[InternetShortcut]
URL=https://github.com/yamin-H/Bug-Reproducer-Autonomous-AI-Agent

Title: Bug Reproducer Autonomous AI Agent (GitHub Repository)
Description: Autonomous end-to-end debugging API service that reproduces bugs, authors failing tests, and opens verified PRs.`,
  },
  {
    id: 'bug-live-demo',
    name: 'Live Demo.url',
    isFolder: false,
    kind: 'link',
    size: '152 B',
    sizeBytes: 152,
    dateModified: 'Yesterday at 3:30 PM',
    dateCreated: 'Feb 15, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Autonomous-Bug-Reproducer',
    tag: 'green',
    url: 'https://bug-reproducer-autonomous-ai-agent.vercel.app/',
    content: `[InternetShortcut]
URL=https://bug-reproducer-autonomous-ai-agent.vercel.app/

Title: Bug Reproducer (Live Production Demo)
Description: Live web interface to trigger and observe autonomous bug reproduction and repair cycles.`,
  },

  // ─── Portfolio-OS Subfolder (2 Files: GitHub Link & Live Demo) ───────────
  {
    id: 'os-github-link',
    name: 'GitHub Repository.url',
    isFolder: false,
    kind: 'link',
    size: '138 B',
    sizeBytes: 138,
    dateModified: 'Today at 9:00 AM',
    dateCreated: 'Jan 01, 2024 at 12:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Portfolio-OS',
    tag: 'blue',
    url: 'https://github.com/yamin-H/Portfolio-MacOS',
    content: `[InternetShortcut]
URL=https://github.com/yamin-H/Portfolio-MacOS

Title: Portfolio OS (GitHub Repository)
Description: Interactive macOS Sequoia Desktop Environment and Production AI Systems Showcase.`,
  },
  {
    id: 'os-live-demo',
    name: 'Live Demo.url',
    isFolder: false,
    kind: 'link',
    size: '144 B',
    sizeBytes: 144,
    dateModified: 'Today at 9:15 AM',
    dateCreated: 'Jan 01, 2024 at 12:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Portfolio-OS',
    tag: 'green',
    url: 'https://portfolio-mac-os-zeta.vercel.app/',
    content: `[InternetShortcut]
URL=https://portfolio-mac-os-zeta.vercel.app/

Title: Portfolio OS (Live Production Demo)
Description: Production deployment of the macOS Sequoia Portfolio OS on Vercel.`,
  },

  // ─── 04_Open_Source_Impact ───────────────────────────────────────────────
  {
    id: 'os-remotion-7074',
    name: 'Remotion_PR_7074.md',
    isFolder: false,
    kind: 'markdown',
    size: '3.1 KB',
    sizeBytes: 3174,
    dateModified: 'Jul 15, 2024 at 4:10 PM',
    dateCreated: 'Jul 15, 2024 at 4:10 PM',
    parentPath: '/Users/yamin/04_Open_Source_Impact',
    tag: 'green',
    content: `# Remotion — PR #7074: preserveSilence Option

**Repository:** [remotion-dev/remotion](https://github.com/remotion-dev/remotion) (52.6k+ stars)

### Problem:
When exporting headless video compositions via \`renderMediaOnWeb()\`, silent lead-in or tail frames were truncated by certain encoder defaults, causing timing drift when ingested downstream by speech-to-text / ASR pipelines.

### Solution:
Introduced the \`preserveSilence\` boolean configuration flag to enforce exact media duration matching regardless of frame audio energy levels. Added strict regression tests ensuring an exact 5.00s composition yields exactly 5.00s audio output.`,
  },
  {
    id: 'os-remotion-7107',
    name: 'Remotion_PR_7107.md',
    isFolder: false,
    kind: 'markdown',
    size: '2.9 KB',
    sizeBytes: 2969,
    dateModified: 'Jul 22, 2024 at 11:00 AM',
    dateCreated: 'Jul 22, 2024 at 11:00 AM',
    parentPath: '/Users/yamin/04_Open_Source_Impact',
    tag: 'green',
    content: `# Remotion — PR #7107: playbackRate Validation

**Repository:** [remotion-dev/remotion](https://github.com/remotion-dev/remotion)

### Overview:
Extended the permitted \`playbackRate\` range in \`@remotion/player\` from \`±4\` to \`±10\` to accommodate modern browser Web Audio clocking capabilities. Updated validation constraints, unit tests (18 passing), and developer API documentation.`,
  },
  {
    id: 'os-ecosystem',
    name: '52k_Stars_Ecosystem_Impact.md',
    isFolder: false,
    kind: 'markdown',
    size: '2.4 KB',
    sizeBytes: 2457,
    dateModified: 'Aug 01, 2024 at 1:00 PM',
    dateCreated: 'Aug 01, 2024 at 1:00 PM',
    parentPath: '/Users/yamin/04_Open_Source_Impact',
    content: `# Open Source Philosophy & Impact

Contributing to high-profile repositories like Remotion means writing code that immediately runs in thousands of production rendering pipelines worldwide.

### Standards Maintained:
- Strict regression test suites
- Backward compatibility preservation
- Deterministic cross-platform behavior`,
  },

  // ─── 05_System_Design_Case_Studies ───────────────────────────────────────
  {
    id: 'sys-queue',
    name: 'Distributed_Queue_Architecture.md',
    isFolder: false,
    kind: 'markdown',
    size: '4.8 KB',
    sizeBytes: 4915,
    dateModified: 'Aug 04, 2024 at 1:15 PM',
    dateCreated: 'Jun 15, 2024 at 11:30 AM',
    parentPath: '/Users/yamin/05_System_Design_Case_Studies',
    tag: 'yellow',
    content: `# Distributed Queue Design for LLM Agent Workflows

Why every production AI system must be asynchronous by default.

### Key Architecture:
1. **Webhook Ingestion:** Immediately returns HTTP 202 Accepted, placing payload on a BullMQ Redis queue.
2. **Worker Concurrency Control:** Enforces strict per-tenant and global token rate limits to prevent provider 429 exceptions.
3. **Dead Letter Queue (DLQ):** Exponential backoff retries with full payload snapshots for operational debugging.`,
  },
  {
    id: 'sys-vector',
    name: 'Vector_DB_Indexing_pgvector.md',
    isFolder: false,
    kind: 'markdown',
    size: '3.9 KB',
    sizeBytes: 3993,
    dateModified: 'Aug 10, 2024 at 3:00 PM',
    dateCreated: 'Jun 20, 2024 at 2:00 PM',
    parentPath: '/Users/yamin/05_System_Design_Case_Studies',
    tag: 'yellow',
    content: `# Vector Database Indexing with pgvector

Architecting persistent memory for team engineering decisions.

### Schema & Indexing:
- **Embedding Dimensions:** 384 dimensions (all-MiniLM-L6-v2) for optimal latency-to-accuracy trade-offs.
- **Index Type:** IVFFlat with 100 lists for sub-10ms nearest-neighbor cosine similarity queries across 50,000+ PR diff chunks.`,
  },


  // ─── 07_Playgrounds_&_Code ───────────────────────────────────────────────
  {
    id: 'code-quickstart',
    name: 'langgraph_quickstart.py',
    isFolder: false,
    kind: 'code',
    size: '2.8 KB',
    sizeBytes: 2867,
    dateModified: 'Yesterday at 3:15 PM',
    dateCreated: 'Feb 10, 2024 at 8:00 PM',
    parentPath: '/Users/yamin/07_Playgrounds_&_Code',
    content: `from langgraph.graph import StateGraph, START, END
from typing import TypedDict

class PipelineState(TypedDict):
    query: str
    response: str

def generate_step(state: PipelineState):
    return {"response": f"Processed: {state['query']}"}

builder = StateGraph(PipelineState)
builder.add_node("generate", generate_step)
builder.add_edge(START, "generate")
builder.add_edge("generate", END)
graph = builder.compile()`,
  },
  {
    id: 'code-semantic',
    name: 'pgvector_semantic_search.ts',
    isFolder: false,
    kind: 'code',
    size: '3.1 KB',
    sizeBytes: 3174,
    dateModified: 'Yesterday at 3:20 PM',
    dateCreated: 'Feb 12, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/07_Playgrounds_&_Code',
    content: `import { prisma } from "../lib/prisma";

export async function findSimilarDecisions(embedding: number[], threshold = 0.82) {
  const vectorStr = \`[\${embedding.join(",")}]\`;
  return prisma.$queryRaw\`
    SELECT id, pr_number, decision_summary, 1 - (embedding <=> \${vectorStr}::vector) AS similarity
    FROM pr_decisions
    WHERE 1 - (embedding <=> \${vectorStr}::vector) > \${threshold}
    ORDER BY similarity DESC
    LIMIT 5;
  \`;
}`,
  },

  // ─── Desktop & Downloads Shortcuts ───────────────────────────────────────
  {
    id: 'desk-resume-file',
    name: 'Resume.pdf',
    isFolder: false,
    kind: 'pdf',
    size: '184 KB',
    sizeBytes: 188416,
    dateModified: 'Today at 9:41 AM',
    dateCreated: 'Jun 01, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/Desktop',
    tag: 'purple',
    content: `Yamin Hossain — AI-Native Software Engineer | LangGraph
Rajshahi, Bangladesh | +880-01706960268 | Email: contact@yamin.dev`,
  },
  {
    id: 'desk-bio',
    name: 'Quick_Bio.txt',
    isFolder: false,
    kind: 'text',
    size: '1.4 KB',
    sizeBytes: 1433,
    dateModified: 'Today at 8:00 AM',
    dateCreated: 'Today at 8:00 AM',
    parentPath: '/Users/yamin/Desktop',
    content: `Yamin Hossain
AI-Native Software Engineer specializing in production LLM agents, LangGraph pipelines, and RAG systems.
Location: Rajshahi, Bangladesh
Email: contact@yamin.dev
GitHub: github.com/yamin
LinkedIn: linkedin.com/in/yamin`,
  },
  {
    id: 'down-resume',
    name: 'Yamin_Hossain_Resume.pdf',
    isFolder: false,
    kind: 'pdf',
    size: '184 KB',
    sizeBytes: 188416,
    dateModified: 'Today at 9:41 AM',
    dateCreated: 'Today at 9:41 AM',
    parentPath: '/Users/yamin/Downloads',
    tag: 'purple',
    content: `Yamin Hossain — AI-Native Software Engineer | LangGraph`,
  },
  {
    id: 'down-whitepaper',
    name: 'AI_Agents_Architecture_Whitepaper.zip',
    isFolder: false,
    kind: 'zip',
    size: '4.8 MB',
    sizeBytes: 5033164,
    dateModified: 'Jul 10, 2024 at 2:00 PM',
    dateCreated: 'Jul 10, 2024 at 2:00 PM',
    parentPath: '/Users/yamin/Downloads',
    content: `Contents of AI_Agents_Architecture_Whitepaper.zip:
- Production_LangGraph_Patterns.pdf
- Observable_State_Machines.pdf
- Benchmark_Reproducibility_Guide.pdf`,
  },

  // ─── iCloud Drive (Matches User Reference Screenshot Exact Assets) ─────────
  {
    id: 'icloud-root',
    name: 'iCloud Drive',
    isFolder: true,
    kind: 'folder',
    size: '128 MB',
    sizeBytes: 134217728,
    dateModified: '8/20/25, 12:56 AM',
    dateCreated: 'Jan 01, 2024 at 12:00 AM',
    parentPath: '/Users/yamin',
    tag: 'blue',
  },
  {
    id: 'icloud-folder-4',
    name: '4. iDownloadBlog',
    isFolder: true,
    kind: 'folder',
    size: '42 MB',
    sizeBytes: 44040192,
    dateModified: '8/20/25, 12:56 AM',
    dateCreated: '8/20/25, 12:56 AM',
    parentPath: '/Users/yamin/iCloud Drive',
    tag: 'blue',
  },
  {
    id: 'icloud-folder-idb',
    name: 'iDownloadBlog',
    isFolder: true,
    kind: 'folder',
    size: '28 MB',
    sizeBytes: 29360128,
    dateModified: '8/20/25, 12:56 AM',
    dateCreated: '8/20/25, 12:56 AM',
    parentPath: '/Users/yamin/iCloud Drive/4. iDownloadBlog',
    tag: 'blue',
  },
  {
    id: 'icloud-folder-images',
    name: '3. Images',
    isFolder: true,
    kind: 'folder',
    size: '86 MB',
    sizeBytes: 90177536,
    dateModified: '12/6/22, 3:52 PM',
    dateCreated: '12/6/22, 3:00 PM',
    parentPath: '/Users/yamin/iCloud Drive',
    tag: 'blue',
  },
  {
    id: 'idb-img-2',
    name: 'iDownloadBlog 2.jpg',
    isFolder: false,
    kind: 'image',
    size: '8 MB',
    sizeBytes: 8388608,
    dateModified: '12/6/22, 3:52 PM',
    dateCreated: '12/6/22, 3:52 PM',
    parentPath: '/Users/yamin/iCloud Drive/3. Images',
    content: '/photos.png',
  },
  {
    id: 'idb-img-3',
    name: 'iDownloadBlog 3.jpg',
    isFolder: false,
    kind: 'image',
    size: '962 KB',
    sizeBytes: 985088,
    dateModified: '12/6/22, 3:51 PM',
    dateCreated: '12/6/22, 3:51 PM',
    parentPath: '/Users/yamin/iCloud Drive/3. Images',
    content: '/photos.png',
  },
  {
    id: 'idb-img-16',
    name: 'iDownloadBlog 16.jpg',
    isFolder: false,
    kind: 'image',
    size: '2.1 MB',
    sizeBytes: 2202009,
    dateModified: '12/6/22, 3:46 PM',
    dateCreated: '12/6/22, 3:46 PM',
    parentPath: '/Users/yamin/iCloud Drive/3. Images',
    content: '/photos.png',
  },
  {
    id: 'idb-img-10',
    name: 'iDownloadBlog 10.jpg',
    isFolder: false,
    kind: 'image',
    size: '3.9 MB',
    sizeBytes: 4089446,
    dateModified: '12/6/22, 3:46 PM',
    dateCreated: '12/6/22, 3:46 PM',
    parentPath: '/Users/yamin/iCloud Drive/3. Images',
    content: '/photos.png',
  },
  {
    id: 'idb-img-13',
    name: 'iDownloadBlog 13.jpg',
    isFolder: false,
    kind: 'image',
    size: '4.2 MB',
    sizeBytes: 4404019,
    dateModified: '12/6/22, 3:45 PM',
    dateCreated: '12/6/22, 3:45 PM',
    parentPath: '/Users/yamin/iCloud Drive/3. Images',
    content: '/photos.png',
  },
  {
    id: 'idb-keynote',
    name: 'AI Agent Architecture.key',
    isFolder: false,
    kind: 'generic',
    size: '14.2 MB',
    sizeBytes: 14889779,
    dateModified: '8/20/25, 11:30 AM',
    dateCreated: '8/20/25, 11:30 AM',
    parentPath: '/Users/yamin/iCloud Drive',
  },
  {
    id: 'idb-pages',
    name: 'Production Roadmap.pages',
    isFolder: false,
    kind: 'generic',
    size: '2.4 MB',
    sizeBytes: 2516582,
    dateModified: '8/18/25, 4:15 PM',
    dateCreated: '8/18/25, 4:15 PM',
    parentPath: '/Users/yamin/iCloud Drive',
  },
  {
    id: 'idb-numbers',
    name: 'Token Cost Model.numbers',
    isFolder: false,
    kind: 'generic',
    size: '890 KB',
    sizeBytes: 911360,
    dateModified: '8/15/25, 2:00 PM',
    dateCreated: '8/15/25, 2:00 PM',
    parentPath: '/Users/yamin/iCloud Drive',
  },
]
