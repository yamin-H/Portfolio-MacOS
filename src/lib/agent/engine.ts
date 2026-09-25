import { searchKnowledge, collectActionPills } from './retriever'
import { ActionPill } from './types'

export interface AgentResponse {
  text: string
  actionPills: ActionPill[]
  sources: string[]
}

export function generateAgentResponse(query: string): AgentResponse {
  const clean = query.trim()
  const lower = clean.toLowerCase()

  // 1. Semantic retrieval over portfolio content
  const matches = searchKnowledge(clean, 4)
  const sources = matches.map((m) => m.chunk.fileKey)
  const actionPills = collectActionPills(matches)

  // ── INTENT A: Pipeline Reliability & Engineering Philosophy ──────────────
  if (
    lower.includes('reliable') ||
    lower.includes('reliability') ||
    lower.includes('pipeline') ||
    lower.includes('approach to building') ||
    lower.includes('fall over') ||
    lower.includes('practices')
  ) {
    const text = `My approach to building reliable pipelines comes down to one non-negotiable rule: **reliability is the primary feature, not an afterthought.**

A demo that completes once in an isolated sandbox is easy; a system that processes thousands of webhook events under real LLM API rate limits without dropping state is where engineering begins. Here is my production framework:

1. **Queue Everything External (BullMQ + Redis):**
   Every external call—whether to OpenAI, Anthropic, or GitHub's API—must go through an async queue with retry semantics. If an API rate-limits or times out, the job fails gracefully back into the queue rather than crashing the HTTP worker.

2. **Exponential Backoff with Jitter:**
   Blind retries cause thundering herds. Every agent node employs exponential backoff coupled with randomized jitter and fallback models (e.g. falling back to an alternate provider or lighter model if latency spikes).

3. **Deterministic State & LangGraph Conditional Edges:**
   I use **LangGraph** over raw LangChain because production pipelines require persistent checkpointers and explicit conditional branching. When an LLM output fails schema validation, the graph routes to an error-correction node rather than a blind loop.

4. **Strict Output Guardrails:**
   LLM outputs are never trusted raw. Every response is parsed and strictly validated against Pydantic / Zod schemas before touching application databases.

5. **Full Observability:**
   Every node execution is traced with structured logs. When a multi-agent system misbehaves, I need to see the exact input tokens, prompt version, tool arguments, and latency breakdown within seconds.`

    const defaultPills: ActionPill[] = [
      { id: 'view-phil', label: 'Open Philosophy in Finder', icon: 'finder', actionType: 'open_file', payload: 'About/philosophy.md' },
      { id: 'view-pr-agent', label: 'Inspect PR Review Pipeline', icon: 'file', actionType: 'open_file', payload: 'Projects/pr-review-agent.md' },
      { id: 'open-term', label: 'Launch Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'cat philosophy.md' },
    ]

    return { text, actionPills: actionPills.length ? actionPills : defaultPills, sources: ['philosophy.md', 'stack.md'] }
  }

  // ── INTENT B: PR Review Agent ─────────────────────────────────────────────
  if (
    lower.includes('pr review') ||
    lower.includes('pr review agent') ||
    lower.includes('pull request') ||
    lower.includes('code review')
  ) {
    const text = `The **PR Review Agent** is a live GitHub App I built to solve team knowledge decay.

Most AI review tools give generic advice like *"this function is too long"*. The PR Review Agent ingests 6 months of a repository's merged PR discussions and commit history, embedding them into a **pgvector** database (384-dimensional vectors). 

When a new PR opens:
1. **GitHub Webhook** triggers a Node.js orchestrator that pushes the job onto a **BullMQ/Redis** queue.
2. A **Python FastAPI** worker picks up the job and runs a **6-node LangGraph pipeline**.
3. It performs chunked diff processing and queries **pgvector** for relevant past team discussions.
4. It posts inline review comments citing actual past decisions—e.g. *"your team rejected this pattern in PR #234 due to DB connection exhaustion."*
5. Everything is traceable through an observable Next.js dashboard with rollback handling and exponential backoff.`

    const pills: ActionPill[] = [
      { id: 'open-pr-doc', label: '⚡ Simulate LangGraph Pipeline', icon: 'finder', actionType: 'open_file', payload: 'Projects/pr-review-agent.md' },
      { id: 'term-cat-pr', label: 'Terminal pipeline cmd', icon: 'terminal', actionType: 'open_terminal', payload: 'pipeline' },
    ]

    return { text, actionPills: pills, sources: ['pr-review-agent.md'] }
  }

  // ── INTENT C: Bug Reproducer ──────────────────────────────────────────────
  if (
    lower.includes('bug reproducer') ||
    lower.includes('debugging') ||
    lower.includes('reproduce') ||
    lower.includes('failing test')
  ) {
    const text = `The **Bug Reproducer** is an autonomous end-to-end debugging API service that operates without human intervention:

- **The Problem:** When an AI debugging agent runs a generated test and the test fails for the *wrong* reason (e.g., import error or syntax mishap), standard agents fail into infinite retries.
- **My Solution:** A **7-node LangGraph pipeline** with conditional edges based on the specific failure category. It parses the test runner's stack trace, extracts the failure context, and rewrites the reproduction harness before attempting a code patch.
- **Outcome:** Takes a GitHub issue URL → spins up an isolated Docker container → reproduces the bug → writes a failing test → generates a verified fix → opens a clean PR.`

    const pills: ActionPill[] = [
      { id: 'open-bug-doc', label: 'View bug-reproducer.md', icon: 'finder', actionType: 'open_file', payload: 'Projects/bug-reproducer.md' },
      { id: 'open-term-bug', label: 'Read via Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'cat bug-reproducer.md' },
    ]

    return { text, actionPills: pills, sources: ['bug-reproducer.md'] }
  }

  // ── INTENT D: Remotion Contributions ──────────────────────────────────────
  if (
    lower.includes('remotion') ||
    lower.includes('open source') ||
    lower.includes('oss') ||
    lower.includes('star')
  ) {
    const text = `I am an active open-source contributor to **Remotion** (52.6k+ GitHub stars):

- **PR #7074 — \`preserveSilence\` option:**
  Added the \`preserveSilence\` flag to \`renderMediaOnWeb()\`. This guarantees silent head/tail audio frames are strictly retained in exported files, resolving critical timing drift issues when feeding video audio into ASR transcription pipelines. Included automated regression tests ensuring exact duration preservation.

- **PR #7107 — \`playbackRate\` validation:**
  Expanded the permitted playback rate in \`@remotion/player\` from \`±4\` to \`±10\` to accommodate modern high-speed scrubbing and canvas rendering, updating validation schemas, unit tests (18 passing), and API docs.`

    const pills: ActionPill[] = [
      { id: 'open-remotion-doc', label: 'View Remotion Notes', icon: 'finder', actionType: 'open_file', payload: 'Projects/remotion-contribution.md' },
    ]

    return { text, actionPills: pills, sources: ['remotion-contribution.md'] }
  }

  // ── INTENT E: Tech Stack & Tools ──────────────────────────────────────────
  if (
    lower.includes('stack') ||
    lower.includes('technologies') ||
    lower.includes('langchain') ||
    lower.includes('fastapi') ||
    lower.includes('tools') ||
    lower.includes('skills')
  ) {
    const text = `My technical stack is deliberately split by responsibility:

- **AI & Agents:** LangGraph (preferred for multi-node cyclical graphs with state), LangChain, pgvector, prompt engineering, schema guardrails, evaluation suites.
- **Inference Layer:** Python & FastAPI for high-throughput async LLM pipelines and embedding operations.
- **Orchestration & Webhooks:** Node.js, Express, TypeScript, and BullMQ + Redis for resilient queue management.
- **Frontend & OS:** React 19, Next.js, TypeScript, Tailwind CSS, Zustand, and direct DOM spring physics.
- **Databases & Infra:** PostgreSQL, Prisma ORM, Redis, Neon serverless, Docker, Vercel, and CI/CD automation.`

    const pills: ActionPill[] = [
      { id: 'open-stack-doc', label: 'Open stack.md in Finder', icon: 'finder', actionType: 'open_file', payload: 'About/stack.md' },
      { id: 'term-neofetch-stack', label: 'View neofetch in Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'neofetch' },
    ]

    return { text, actionPills: pills, sources: ['stack.md'] }
  }

  // ── INTENT F: Hiring, Status & Contact ────────────────────────────────────
  if (
    lower.includes('hire') ||
    lower.includes('contact') ||
    lower.includes('available') ||
    lower.includes('remote') ||
    lower.includes('email') ||
    lower.includes('location') ||
    lower.includes('reach')
  ) {
    const text = `I am based in **Rajshahi, Bangladesh**, working with global remote teams.

I am currently open to **early-stage remote engineering teams** looking for someone to own AI-native systems, agent pipelines, and high-reliability backend services from day one.

- **Email:** [yamindr@gamil.com](mailto:yamindr@gamil.com)
- **GitHub:** [github.com/yamin](https://github.com/yamin)
- **LinkedIn:** [linkedin.com/in/yamin](https://linkedin.com/in/yamin)

Feel free to send an email directly or click the contact badge below!`

    const pills: ActionPill[] = [
      { id: 'mail-yamin', label: 'Email yamindr@gamil.com', icon: 'email', actionType: 'contact', payload: 'yamindr@gamil.com' },
      { id: 'view-resume-doc', label: 'View Resume in Finder', icon: 'finder', actionType: 'open_file', payload: 'Resume/yamin_resume.pdf' },
      { id: 'run-sudo-hire', label: 'Run sudo hire in Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'sudo hire yamin' },
    ]

    return { text, actionPills: pills, sources: ['about.md', 'yamin_resume.pdf'] }
  }

  // ── INTENT G: General / Semantic RAG Fallback ──────────────────────────────
  if (matches.length > 0) {
    const top = matches[0].chunk
    const text = `Based on my portfolio documentation and engineering records:

**${top.title}:**
${top.content}

You can explore the full document in Finder or execute commands in Terminal to inspect the source files.`

    return { text, actionPills: actionPills.length ? actionPills : [
      { id: 'gen-finder', label: `Open ${top.fileKey}`, icon: 'finder', actionType: 'open_file', payload: top.fileKey },
    ], sources }
  }

  // ── Default fallback ──────────────────────────────────────────────────────
  const text = `I'm Yamin's AI Assistant, grounded in his production engineering work.

I can answer in-depth questions about:
- **Pipeline Reliability:** Exponential backoff, async BullMQ queuing, guardrails, and rollback handling.
- **LangGraph & Agents:** My live **PR Review Agent** and autonomous **Bug Reproducer**.
- **Tech Stack:** Python, FastAPI, Node.js, pgvector, PostgreSQL, and Next.js.
- **Open Source:** Contributions to Remotion (PR #7074 & PR #7107).

What would you like to explore?`

  return {
    text,
    actionPills: [
      { id: 'ask-pipeline', label: 'How do you build reliable pipelines?', icon: 'file', actionType: 'open_file', payload: 'About/philosophy.md' },
      { id: 'ask-pr-review', label: 'Explain PR Review Agent', icon: 'file', actionType: 'open_file', payload: 'Projects/pr-review-agent.md' },
      { id: 'open-terminal-def', label: 'Open Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'neofetch' },
    ],
    sources: ['about.md'],
  }
}
