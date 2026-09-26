import { ActionPill } from './types'

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface JDMatchedSkill {
  name: string
  category: 'core' | 'ai' | 'backend' | 'devops' | 'architecture'
  confidence: number // 0 to 1
  provenIn: string[] // Project names
  finderFile: string
}

export interface JDEvidence {
  id: string
  projectTitle: string
  metric: string
  explanation: string
  finderFile: string
  terminalCmd?: string
  tags: string[]
}

export interface JDAnalysisResult {
  overallScore: number // 0 to 100
  fitRating: 'Exceptional Fit' | 'Strong Match' | 'Good Match' | 'Moderate Match'
  summary: string
  breakdown: {
    coreSkills: number
    aiAndWorkflows: number
    systemReliability: number
    fullStackOwnership: number
  }
  matchedSkills: JDMatchedSkill[]
  missingOrNuancedSkills: {
    name: string
    note: string
  }[]
  keyEvidence: JDEvidence[]
  actionPills: ActionPill[]
}

export interface JDPreset {
  id: string
  title: string
  companyType: string
  badge: string
  rawText: string
}

// ─── PRESET JOB DESCRIPTIONS ─────────────────────────────────────────────────

export const JD_PRESETS: JDPreset[] = [
  {
    id: 'ai-agent-engineer',
    title: 'Senior AI / Agentic Systems Engineer',
    companyType: 'Series A AI Startup',
    badge: 'LangGraph & RAG',
    rawText: `We are looking for an AI-Native Software Engineer to architect production LLM agents and multi-step autonomous workflows.
Requirements:
- Deep hands-on experience building multi-agent systems using LangGraph or LangChain.
- Strong proficiency in Python (FastAPI) and TypeScript (Node.js/Next.js).
- Experience building reliable RAG pipelines with vector databases (pgvector / Pinecone) and cosine embeddings.
- Background in async task orchestration using Redis and BullMQ.
- Proven focus on reliability: exponential backoff, rate-limit fallback models, structured evaluation, and failure recovery.
- Ability to own projects end-to-end from webhook ingestion to inference service to frontend dashboard.
- Experience with Docker and containerized agent sandboxing.`,
  },
  {
    id: 'fullstack-lead',
    title: 'Senior Full-Stack TypeScript Engineer',
    companyType: 'High-Growth Product Team',
    badge: 'Next.js 15 & Node.js',
    rawText: `We are hiring a Senior Full-Stack Engineer with exceptional UI craft and bulletproof backend architecture.
Requirements:
- 3+ years experience with Next.js (App Router), React 19, and modern TypeScript.
- World-class attention to design detail: fluid spring animations, micro-interactions, responsive layouts.
- Backend proficiency with Node.js, Express/FastAPI, PostgreSQL, and Prisma ORM.
- Experience implementing background queue systems (BullMQ, Redis) for heavy async jobs.
- Solid understanding of Docker, CI/CD automation, and Git workflows.
- Strong communication, proactive problem-solving, and autonomous ownership of complex features.`,
  },
  {
    id: 'backend-reliability',
    title: 'Backend & Pipeline Reliability Engineer',
    companyType: 'Enterprise Automation Platform',
    badge: 'BullMQ & Distributed Queues',
    rawText: `Looking for a systems-minded backend engineer who prioritizes production reliability and zero silent failures.
Requirements:
- Strong experience in Node.js/TypeScript and Python microservices.
- Expertise in background task queuing with BullMQ, Redis, and dead-letter queues.
- Mastery of distributed reliability patterns: exponential backoff with jitter, idempotency keys, circuit breakers.
- Hands-on database optimization with PostgreSQL, transaction handling, and schema migrations via Prisma.
- Containerization with Docker and container orchestration.
- Focus on observability, structured JSON logging, and automated regression testing.`,
  },
]

// ─── SKILLS DICTIONARY & PROJECT EVIDENCE MAPPING ────────────────────────────

interface KnownSkill {
  regex: RegExp
  name: string
  category: 'core' | 'ai' | 'backend' | 'devops' | 'architecture'
  weight: number
  provenIn: string[]
  finderFile: string
  terminalCmd?: string
}

const KNOWN_SKILLS: KnownSkill[] = [
  // AI & Agents
  {
    regex: /\b(langgraph|multi-?agent|agentic|state graph)\b/i,
    name: 'LangGraph Multi-Agent Workflows',
    category: 'ai',
    weight: 1.2,
    provenIn: ['PR Review Agent (6-node pipeline)', 'Bug Reproducer (7-node conditional graph)'],
    finderFile: 'Projects/pr-review-agent.md',
    terminalCmd: 'cat pr-review-agent.md',
  },
  {
    regex: /\b(rag|vector|pgvector|embedding|semantic search)\b/i,
    name: 'RAG & Vector Retrieval (pgvector)',
    category: 'ai',
    weight: 1.1,
    provenIn: ['PR Review Agent', 'Portfolio AI Spotlight Engine'],
    finderFile: 'Projects/pr-review-agent.md',
    terminalCmd: 'ai Explain your RAG engine architecture',
  },
  {
    regex: /\b(langchain|llm|tool calling|guardrails?|prompt engineering)\b/i,
    name: 'LLM Tool Calling & Guardrails',
    category: 'ai',
    weight: 1.0,
    provenIn: ['PR Review Agent', 'Bug Reproducer'],
    finderFile: 'About/stack.md',
    terminalCmd: 'cat stack.md',
  },
  // Backend & Queues
  {
    regex: /\b(bullmq|redis|queue|async job|background (task|job|worker))\b/i,
    name: 'BullMQ & Redis Async Pipelines',
    category: 'backend',
    weight: 1.2,
    provenIn: ['PR Review Agent', 'Bug Reproducer', 'Architecture Rule'],
    finderFile: 'About/philosophy.md',
    terminalCmd: 'cat philosophy.md',
  },
  {
    regex: /\b(python|fastapi)\b/i,
    name: 'Python & FastAPI Inference Layer',
    category: 'backend',
    weight: 1.0,
    provenIn: ['FastAPI inference service', 'Bug Reproducer container agent'],
    finderFile: 'About/stack.md',
    terminalCmd: 'neofetch',
  },
  {
    regex: /\b(node|nodejs|express|typescript)\b/i,
    name: 'TypeScript & Node.js Orchestration',
    category: 'core',
    weight: 1.1,
    provenIn: ['PR Review Agent Webhook Orchestrator', 'Portfolio OS'],
    finderFile: 'About/stack.md',
    terminalCmd: 'cat stack.md',
  },
  {
    regex: /\b(postgres|postgresql|prisma|sql|database)\b/i,
    name: 'PostgreSQL & Prisma ORM',
    category: 'backend',
    weight: 1.0,
    provenIn: ['PR Review Agent', 'Bug Reproducer', 'Neon Serverless'],
    finderFile: 'About/stack.md',
    terminalCmd: 'cat stack.md',
  },
  // Reliability & DevOps
  {
    regex: /\b(reliability|backoff|exponential backoff|jitter|circuit breaker|idempotenc?y)\b/i,
    name: 'Distributed Reliability & Exponential Backoff',
    category: 'architecture',
    weight: 1.25,
    provenIn: ['Reliability as a Feature philosophy', 'Webhook queue retry logic'],
    finderFile: 'About/philosophy.md',
    terminalCmd: 'cat philosophy.md',
  },
  {
    regex: /\b(docker|container|containeriz\w+|sandbox)\b/i,
    name: 'Docker Containerization & Sandboxing',
    category: 'devops',
    weight: 1.0,
    provenIn: ['Bug Reproducer isolated execution', 'Production Dockerfiles'],
    finderFile: 'Projects/bug-reproducer.md',
    terminalCmd: 'cat bug-reproducer.md',
  },
  {
    regex: /\b(observability|logging|tracing|telemetry)\b/i,
    name: 'Structured Logging & Pipeline Tracing',
    category: 'architecture',
    weight: 1.0,
    provenIn: ['PR Review Agent audit logs', 'Engineering Philosophy'],
    finderFile: 'About/philosophy.md',
    terminalCmd: 'cat philosophy.md',
  },
  // Frontend & Full-Stack
  {
    regex: /\b(next\.?js|react|tailwind|framer motion|ui|frontend|full-?stack)\b/i,
    name: 'Next.js 15, React & High-Fidelity UI Craft',
    category: 'core',
    weight: 1.1,
    provenIn: ['Portfolio OS (1:1 macOS recreation)', 'PR Review Agent Dashboard', 'Remotion OSS (#7074, #7107)'],
    finderFile: 'Projects/remotion-contribution.md',
    terminalCmd: 'cat remotion-contribution.md',
  },
  {
    regex: /\b(open source|oss|contribution|git|github)\b/i,
    name: 'Production Open Source (52k+ Stars Remotion)',
    category: 'core',
    weight: 1.0,
    provenIn: ['Remotion PR #7074 (preserveSilence)', 'Remotion PR #7107 (playbackRate)'],
    finderFile: 'Projects/remotion-contribution.md',
    terminalCmd: 'cat remotion-contribution.md',
  },
]

// ─── ANALYSIS FUNCTION ───────────────────────────────────────────────────────

export function analyzeJobDescription(rawJD: string): JDAnalysisResult {
  const text = rawJD.trim()
  if (!text) {
    return {
      overallScore: 0,
      fitRating: 'Moderate Match',
      summary: 'Please enter or select a job description to generate a match report.',
      breakdown: { coreSkills: 0, aiAndWorkflows: 0, systemReliability: 0, fullStackOwnership: 0 },
      matchedSkills: [],
      missingOrNuancedSkills: [],
      keyEvidence: [],
      actionPills: [],
    }
  }

  // 1. Identify matched skills from dictionary
  const matchedSkills: JDMatchedSkill[] = []
  let totalScoreWeight = 0
  let matchedScoreWeight = 0

  for (const skill of KNOWN_SKILLS) {
    totalScoreWeight += skill.weight
    if (skill.regex.test(text)) {
      matchedScoreWeight += skill.weight
      matchedSkills.push({
        name: skill.name,
        category: skill.category,
        confidence: 0.95,
        provenIn: skill.provenIn,
        finderFile: skill.finderFile,
      })
    }
  }

  // If text is rich but custom, ensure baseline matches based on general concepts
  const hasAgenticNeed = /ai|agent|llm|prompt|rag|model/i.test(text)
  const hasBackendNeed = /backend|api|server|queue|database|node|python|postgres/i.test(text)
  const hasFrontendNeed = /frontend|ui|react|next|css|web/i.test(text)
  const hasReliabilityNeed = /reliab|scale|test|production|incident|fault/i.test(text)

  // Calculate scores
  const matchRatio = matchedSkills.length > 0 ? matchedScoreWeight / (totalScoreWeight * 0.75) : 0.3
  const overallScore = Math.min(98, Math.max(68, Math.round(matchRatio * 100)))

  const aiScore = hasAgenticNeed ? Math.min(99, overallScore + 3) : 85
  const backendScore = hasBackendNeed ? Math.min(98, overallScore + 2) : 88
  const coreScore = hasFrontendNeed ? Math.min(97, overallScore) : 90
  const reliabilityScore = hasReliabilityNeed ? 96 : 91

  let fitRating: JDAnalysisResult['fitRating'] = 'Moderate Match'
  if (overallScore >= 92) fitRating = 'Exceptional Fit'
  else if (overallScore >= 85) fitRating = 'Strong Match'
  else if (overallScore >= 75) fitRating = 'Good Match'

  // 2. Select matching Project Evidence
  const keyEvidence: JDEvidence[] = [
    {
      id: 'ev-pr-agent',
      projectTitle: 'PR Review Agent (Live GitHub Marketplace App)',
      metric: '6-Node LangGraph + BullMQ/Redis Queue + pgvector',
      explanation:
        'Proven architecture handling GitHub webhooks, multi-step LLM reasoning, historical PR pattern indexing with 384d vector embeddings, and zero-loss queuing under heavy load.',
      finderFile: 'Projects/pr-review-agent.md',
      terminalCmd: 'cat pr-review-agent.md',
      tags: ['LangGraph', 'BullMQ', 'pgvector', 'FastAPI', 'Next.js'],
    },
    {
      id: 'ev-bug-reproducer',
      projectTitle: 'Bug Reproducer (Autonomous Debugging Service)',
      metric: '7-Node Conditional Graph + Isolated Container Sandbox',
      explanation:
        'Takes raw issue URLs, provisions isolated Docker containers, reproduces errors, parses failing logs to rewrite tests contextually, and produces verified pull requests.',
      finderFile: 'Projects/bug-reproducer.md',
      terminalCmd: 'cat bug-reproducer.md',
      tags: ['Autonomous Agent', 'Docker', 'Self-Healing Retry', 'Python'],
    },
    {
      id: 'ev-remotion',
      projectTitle: 'Remotion Open Source Contribution (52k+ Stars)',
      metric: 'PR #7074 (preserveSilence) & PR #7107 (playbackRate)',
      explanation:
        'Added silence preservation to renderMediaOnWeb() for accurate ASR alignment and extended playbackRate verification with comprehensive regression test coverage.',
      finderFile: 'Projects/remotion-contribution.md',
      terminalCmd: 'cat remotion-contribution.md',
      tags: ['TypeScript', 'Testing', 'Open Source', 'High Impact'],
    },
  ]

  // 3. Nuances & Honest Technical Gap Analysis
  const missingOrNuancedSkills: JDAnalysisResult['missingOrNuancedSkills'] = []

  if (/kubernetes|k8s/i.test(text)) {
    missingOrNuancedSkills.push({
      name: 'Kubernetes (K8s) vs Docker Orchestration',
      note: 'Yamin uses Docker containerization and serverless/Render/Vercel infra; readily transfers container architecture to K8s environments.',
    })
  }
  if (/\b(go|golang|rust)\b/i.test(text)) {
    missingOrNuancedSkills.push({
      name: 'Compiled Languages (Go/Rust)',
      note: 'Primary production stack is TypeScript (Node/Next) and Python (FastAPI/AI); quick learner with strong static-typing fundamentals.',
    })
  }
  if (missingOrNuancedSkills.length === 0) {
    missingOrNuancedSkills.push({
      name: 'Cloud-Agnostic Infrastructure',
      note: 'Architecture focuses on Docker containers and standard Redis/Postgres protocols, allowing deployment across AWS, GCP, Vercel, or on-prem without lock-in.',
    })
  }

  // 4. Action Pills
  const actionPills: ActionPill[] = [
    {
      id: 'open-finder-pr',
      label: 'Inspect PR Review Agent in Finder',
      icon: 'finder',
      actionType: 'open_file',
      payload: 'Projects/pr-review-agent.md',
    },
    {
      id: 'open-finder-bug',
      label: 'Inspect Bug Reproducer in Finder',
      icon: 'finder',
      actionType: 'open_file',
      payload: 'Projects/bug-reproducer.md',
    },
    {
      id: 'open-term-neofetch',
      label: 'Show Tech Stack in Terminal',
      icon: 'terminal',
      actionType: 'open_terminal',
      payload: 'neofetch',
    },
    {
      id: 'view-resume-pdf',
      label: 'Open Yamin Resume (PDF)',
      icon: 'file',
      actionType: 'open_file',
      payload: 'Resume/yamin_resume.pdf',
    },
    {
      id: 'email-yamin',
      label: 'Email Yamin Hossain',
      icon: 'email',
      actionType: 'contact',
      payload: 'yamindr@gmail.com',
    },
  ]

  const summary = `Based on your job description, Yamin Hossain is an **${fitRating} (${overallScore}%)**. His proven track record building production LangGraph multi-agent pipelines, BullMQ queue orchestrators, and 52k+ star open-source contributions directly satisfies your core requirements.`

  return {
    overallScore,
    fitRating,
    summary,
    breakdown: {
      coreSkills: coreScore,
      aiAndWorkflows: aiScore,
      systemReliability: reliabilityScore,
      fullStackOwnership: 95,
    },
    matchedSkills,
    missingOrNuancedSkills,
    keyEvidence,
    actionPills,
  }
}
