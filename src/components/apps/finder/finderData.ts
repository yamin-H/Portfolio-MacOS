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
  kind: 'folder' | 'zip' | 'image' | 'pdf' | 'markdown' | 'code' | 'audio' | 'video' | 'app' | 'text' | 'generic'
  size: string
  sizeBytes: number
  dateModified: string
  dateCreated: string
  parentPath: string // e.g. "/Users/yamin" or "/Users/yamin/02_Resume_&_Credentials"
  tag?: FileTag
  appIconSrc?: string
  content?: string
  contentKey?: string
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
    id: 'root-hiring',
    name: '06_For_Hiring_Managers',
    isFolder: true,
    kind: 'folder',
    size: '48 KB',
    sizeBytes: 49152,
    dateModified: 'Today at 8:00 AM',
    dateCreated: 'Sep 01, 2024 at 9:00 AM',
    parentPath: '/Users/yamin',
    tag: 'gray',
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
- **Email:** contact@yamin.dev
- **Phone:** +880-01706960268
- **GitHub:** https://github.com/yamin
- **LinkedIn:** https://linkedin.com/in/yamin`,
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

## 1. Reliability is the Feature
A demo that works once on a golden prompt is not an engineering achievement. Every system I build has exponential backoff, structured error recovery, rollback handling, and retry limits before shipping.

## 2. Agents Need Observability
A multi-agent pipeline that fails silently is worse than no pipeline. Every node execution gets traced, every decision gets logged, and state transitions are deterministic. You cannot debug what you cannot see.

## 3. Queue Everything External
If an action touches an external API (LLM inference, GitHub webhooks, Slack alerts), it enters a BullMQ Redis queue with retry logic. This prevents runaway rate limits and thundering herds.

## 4. Own the Entire Loop
I build the webhook ingestion, the inference agent, the database schema, and the reactive frontend interface. Zero friction hand-offs.`,
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
    id: 'about-photo',
    name: 'Profile_Photo.png',
    isFolder: false,
    kind: 'image',
    size: '1.2 MB',
    sizeBytes: 1258291,
    dateModified: 'Sep 10, 2024 at 10:00 AM',
    dateCreated: 'Sep 10, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/01_About_Me',
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

- **Direct Email:** contact@yamin.dev
- **Mobile / WhatsApp:** +880-01706960268
- **GitHub:** [github.com/yamin](https://github.com/yamin)
- **LinkedIn:** [linkedin.com/in/yamin](https://linkedin.com/in/yamin)
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
  {
    id: 'resume-exec-summary',
    name: 'Executive_Summary_One_Pager.md',
    isFolder: false,
    kind: 'markdown',
    size: '2.4 KB',
    sizeBytes: 2457,
    dateModified: 'Yesterday at 6:00 PM',
    dateCreated: 'Mar 10, 2024 at 11:00 AM',
    parentPath: '/Users/yamin/02_Resume_&_Credentials',
    tag: 'red',
    content: `# Yamin Hossain — Executive One-Pager

### What I Do Best
I turn complex autonomous AI agent architectures into reliable, production-ready software.

### Highlights
1. **PR Review Agent:** Marketplace GitHub App indexing 6 months of team PR history. 6-node LangGraph pipeline with pgvector semantic similarity, cutting code review latency from hours to 85 seconds.
2. **Autonomous Bug Reproducer:** End-to-end agent reproducing GitHub issue bugs, generating failing tests, rewriting them conditionally upon error feedback, and opening automated fix PRs.
3. **Remotion Open Source:** Core contributions to Remotion (52.6k+ stars) across media rendering and audio sync pipelines.

### Availability
- **Status:** Immediately available for early-stage and high-growth remote engineering teams.`,
  },
  {
    id: 'resume-cert',
    name: 'DeepLearning_AI_LangGraph_Cert.pdf',
    isFolder: false,
    kind: 'pdf',
    size: '124 KB',
    sizeBytes: 126976,
    dateModified: 'Aug 18, 2024 at 3:15 PM',
    dateCreated: 'Aug 18, 2024 at 3:15 PM',
    parentPath: '/Users/yamin/02_Resume_&_Credentials',
    tag: 'green',
    content: `DeepLearning.AI Certificate of Completion: Advanced Multi-Agent Systems with LangGraph.
Covers state graphs, cyclical graphs, human-in-the-loop memory checkpoints, and tool routing.`,
  },
  {
    id: 'resume-transcript',
    name: 'Academic_Transcript_BEng.pdf',
    isFolder: false,
    kind: 'pdf',
    size: '210 KB',
    sizeBytes: 215040,
    dateModified: 'Jul 20, 2024 at 10:00 AM',
    dateCreated: 'Jul 20, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/02_Resume_&_Credentials',
    content: `Varendra University — Official Academic Record
Department of Electrical and Electronic Engineering (EEE)
Demonstrated strong foundations in discrete mathematics, control systems, signal processing, and computing architectures.`,
  },

  // ─── 03_Production_AI_Agents ─────────────────────────────────────────────
  {
    id: 'agents-pr-review',
    name: 'PR-Review-Agent',
    isFolder: true,
    kind: 'folder',
    size: '6.4 MB',
    sizeBytes: 6710886,
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
    size: '4.8 MB',
    sizeBytes: 5033164,
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
    size: '3.6 MB',
    sizeBytes: 3774873,
    dateModified: 'Today at 9:15 AM',
    dateCreated: 'Jan 01, 2024 at 12:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents',
    tag: 'purple',
  },

  // ─── PR-Review-Agent Subfolder ───────────────────────────────────────────
  {
    id: 'pr-readme',
    name: 'README.md',
    isFolder: false,
    kind: 'markdown',
    size: '6.8 KB',
    sizeBytes: 6963,
    dateModified: 'Today at 10:30 AM',
    dateCreated: 'Jun 10, 2024 at 2:00 PM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/PR-Review-Agent',
    tag: 'blue',
    content: `# PR Review Agent — Production GitHub App

Marketplace-installable GitHub App that ingests 6 months of team PR history and posts inline review comments referencing specific past team decisions — not generic lint rules.

### Key Capabilities:
- **Historical Memory:** Ingests merged PR discussions, rejects, and design compromises.
- **Precision Comments:** Surfaces past decisions like *"Your team rejected this pattern in PR #234 because of connection pool exhaustion."*
- **6-Node LangGraph Pipeline:** Diff chunking, semantic similarity retrieval via pgvector, multi-perspective code evaluation, commentary synthesis, and GitHub PR inline posting.
- **Latency & Reliability:** Median response time of 85 seconds, powered by BullMQ queuing and exponential backoff retry policies.`,
  },
  {
    id: 'pr-pipeline-graph',
    name: 'pipeline_architecture.ts',
    isFolder: false,
    kind: 'code',
    size: '4.2 KB',
    sizeBytes: 4300,
    dateModified: 'Today at 9:00 AM',
    dateCreated: 'Jun 12, 2024 at 11:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/PR-Review-Agent',
    content: `import { StateGraph, END, START } from "@langchain/langgraph";

interface AgentState {
  prUrl: string;
  diffChunks: string[];
  historicalContext: Array<{ prId: string; decision: string; similarity: number }>;
  reviewComments: Array<{ file: string; line: number; comment: string }>;
  status: "idle" | "parsing" | "indexing" | "synthesizing" | "posted";
}

export const prReviewWorkflow = new StateGraph<AgentState>({
  channels: {
    prUrl: null,
    diffChunks: { value: (x, y) => y ?? x, default: () => [] },
    historicalContext: { value: (x, y) => y ?? x, default: () => [] },
    reviewComments: { value: (x, y) => y ?? x, default: () => [] },
    status: { value: (x, y) => y ?? x, default: () => "idle" },
  }
})
  .addNode("ingestDiff", async (state) => { /* Tree-sitter diff chunking */ })
  .addNode("querySimilarDecisions", async (state) => { /* pgvector cosine search */ })
  .addNode("synthesizeReview", async (state) => { /* Claude 3.5 Sonnet analysis */ })
  .addNode("postInlineComments", async (state) => { /* GitHub API client */ })
  .addEdge(START, "ingestDiff")
  .addEdge("ingestDiff", "querySimilarDecisions")
  .addEdge("querySimilarDecisions", "synthesizeReview")
  .addEdge("synthesizeReview", "postInlineComments")
  .addEdge("postInlineComments", END);`,
  },
  {
    id: 'pr-interactive-app',
    name: 'Interactive_Visualizer.app',
    isFolder: false,
    kind: 'app',
    size: '1.2 MB',
    sizeBytes: 1258291,
    dateModified: 'Today at 10:00 AM',
    dateCreated: 'Jun 15, 2024 at 3:00 PM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/PR-Review-Agent',
    appIconSrc: '/finder.png',
    contentKey: 'pr-review-agent',
    content: 'Double-click to launch the live interactive LangGraph Pipeline Visualizer!',
  },
  {
    id: 'pr-benchmark-json',
    name: 'benchmark_metrics.json',
    isFolder: false,
    kind: 'code',
    size: '1.8 KB',
    sizeBytes: 1843,
    dateModified: 'Jul 01, 2024 at 12:00 PM',
    dateCreated: 'Jul 01, 2024 at 12:00 PM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/PR-Review-Agent',
    content: `{
  "benchmark_suite": "PR Review Agent v2.4",
  "evaluated_prs": 450,
  "metrics": {
    "median_latency_seconds": 84.8,
    "security_vulnerability_recall": "96.4%",
    "false_positive_rate": "3.1%",
    "team_decision_accuracy": "91.8%",
    "cost_per_reviewed_pr_usd": 0.042
  }
}`,
  },

  // ─── Autonomous-Bug-Reproducer Subfolder ──────────────────────────────────
  {
    id: 'bug-readme',
    name: 'README.md',
    isFolder: false,
    kind: 'markdown',
    size: '5.4 KB',
    sizeBytes: 5529,
    dateModified: 'Yesterday at 3:00 PM',
    dateCreated: 'Feb 15, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Autonomous-Bug-Reproducer',
    tag: 'blue',
    content: `# Autonomous Bug Reproducer

An autonomous debugging service that takes a raw GitHub issue description, sets up an isolated test sandbox, reproduces the bug with a newly authored failing test, synthesizes the fix, and opens a complete Pull Request.

### Key Innovations:
- **Self-Healing Test Rewriter:** When generated tests fail for environmental or syntactic errors rather than the underlying bug, the agent parses the stderr traceback and re-writes the test before re-evaluating.
- **7-Node Conditional Graph:** Uses LangGraph conditional edges to branch between code rewriting, dependency resolution, and test harness setup.`,
  },
  {
    id: 'bug-code',
    name: 'self_healing_test_agent.py',
    isFolder: false,
    kind: 'code',
    size: '3.8 KB',
    sizeBytes: 3891,
    dateModified: 'Yesterday at 2:30 PM',
    dateCreated: 'Feb 18, 2024 at 1:15 PM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Autonomous-Bug-Reproducer',
    content: `def route_test_failure(state: BugAgentState) -> str:
    """Intelligently branch based on test failure diagnostics."""
    if state["syntax_error_detected"]:
        return "rewrite_test_ast"
    elif state["environment_dependency_missing"]:
        return "install_sandbox_dependency"
    elif state["bug_reproduced_successfully"]:
        return "generate_codebase_fix"
    return "abort_and_log"`,
  },
  {
    id: 'bug-trace',
    name: 'execution_trace_demo.log',
    isFolder: false,
    kind: 'text',
    size: '2.1 KB',
    sizeBytes: 2150,
    dateModified: 'Feb 20, 2024 at 4:00 PM',
    dateCreated: 'Feb 20, 2024 at 4:00 PM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Autonomous-Bug-Reproducer',
    content: `[2026-02-20T14:02:11Z] [Node: IngestIssue] Ingested GitHub Issue #108: "Memory leak in event listener registration"
[2026-02-20T14:02:19Z] [Node: AuthorTest] Created tests/reproduce_issue_108.test.ts
[2026-02-20T14:02:34Z] [Node: RunSandbox] Test exited with code 1 (Failed as expected: 4 listener instances remaining)
[2026-02-20T14:02:58Z] [Node: FixCode] Applied WeakMap unsubscribe listener pattern to src/eventManager.ts
[2026-02-20T14:03:14Z] [Node: Verify] Test suite passed cleanly (100% assertions green)
[2026-02-20T14:03:22Z] [Node: OpenPR] PR #114 created successfully with automated fix and regression test.`,
  },

  // ─── Portfolio-OS Subfolder ──────────────────────────────────────────────
  {
    id: 'os-arch',
    name: 'architecture_and_decisions.md',
    isFolder: false,
    kind: 'markdown',
    size: '4.6 KB',
    sizeBytes: 4710,
    dateModified: 'Today at 9:00 AM',
    dateCreated: 'Jan 01, 2024 at 12:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Portfolio-OS',
    tag: 'purple',
    content: `# Portfolio OS — Architecture & Engineering Decisions

A fully interactive macOS desktop environment built from first principles on Next.js 16 App Router.

### Architectural Decisions:
- **Zustand Reactive Store:** Decoupled window management, focus elevation (z-index hierarchy), multitasking state, and system hardware toggles.
- **Web Audio API Synthesizer:** Zero external audio assets; pop, chime, click, and trash audio synthesized in real time via Web Audio oscillators.
- **Spring Physics Multitasking:** Framer Motion spring curves powering Mission Control, Stage Manager shelf, App Switcher HUD, and window snapping.`,
  },
  {
    id: 'os-multitasking',
    name: 'multitasking_engine.ts',
    isFolder: false,
    kind: 'code',
    size: '3.2 KB',
    sizeBytes: 3276,
    dateModified: 'Today at 8:45 AM',
    dateCreated: 'Jan 10, 2024 at 10:00 AM',
    parentPath: '/Users/yamin/03_Production_AI_Agents/Portfolio-OS',
    content: `// macOS Sequoia Tiling & Stage Manager Store Logic
export const calculateSnapBounds = (screenW: number, screenH: number, type: 'left' | 'right' | 'maximize') => {
  const topBarH = 28;
  const usableH = screenH - topBarH - 72;
  if (type === 'left') return { x: 8, y: topBarH + 6, width: screenW / 2 - 12, height: usableH - 12 };
  if (type === 'right') return { x: screenW / 2 + 4, y: topBarH + 6, width: screenW / 2 - 12, height: usableH - 12 };
  return { x: 8, y: topBarH + 6, width: screenW - 16, height: usableH - 12 };
};`,
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

  // ─── 06_For_Hiring_Managers ──────────────────────────────────────────────
  {
    id: 'hire-why',
    name: 'Why_Hire_Yamin.md',
    isFolder: false,
    kind: 'markdown',
    size: '3.4 KB',
    sizeBytes: 3481,
    dateModified: 'Today at 8:00 AM',
    dateCreated: 'Sep 01, 2024 at 9:00 AM',
    parentPath: '/Users/yamin/06_For_Hiring_Managers',
    tag: 'gray',
    content: `# Why Hire Yamin Hossain

### 1. Production Focus
I don't build toy demos that fall over when an API call fails. I implement state machine branching, exponential backoff, and full observability.

### 2. High Velocity & Independence
I am self-directed, accustomed to remote collaboration across time zones, and capable of taking an ambiguous problem from whiteboard to production deployment.

### 3. Immediate Value
Deep experience in TypeScript, Python, Next.js, and modern AI pipelines (LangGraph/pgvector) allows me to contribute code from day one.`,
  },
  {
    id: 'hire-30-60-90',
    name: '30_60_90_Day_Impact_Plan.md',
    isFolder: false,
    kind: 'markdown',
    size: '3.2 KB',
    sizeBytes: 3276,
    dateModified: 'Today at 8:15 AM',
    dateCreated: 'Sep 01, 2024 at 9:15 AM',
    parentPath: '/Users/yamin/06_For_Hiring_Managers',
    content: `# 30-60-90 Day Impact Plan

### First 30 Days (Learn & Ship)
- Immerse in team codebase, deployment pipelines, and coding standards.
- Ship first bug fix / minor feature within the first 48 hours.
- Build internal tooling / agent scripts to accelerate team productivity.

### Days 31-60 (Own & Architect)
- Own major architectural modules in AI agent orchestration or backend queuing.
- Enhance test coverage and observability monitoring.

### Days 61-90 (Scale & Lead)
- Proactively identify bottlenecks, optimize latency and cloud infrastructure costs.
- Mentor peers on LangGraph state management and reliable AI practices.`,
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
