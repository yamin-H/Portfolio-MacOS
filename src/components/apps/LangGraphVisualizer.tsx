'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type ScenarioId = 'listener-leak' | 'unindexed-query' | 'clean-pr'

interface PipelineNode {
  id: string
  num: number
  name: string
  tech: string
  subtitle: string
  color: string
  durationMs: number
  description: string
  inputs: Record<string, any>
  outputs: Record<string, any>
  codeSnippet: string
  codeLang: string
  engineeringRationale: string
}

interface Scenario {
  id: ScenarioId
  label: string
  badge: string
  file: string
  line: number
  description: string
  diffCode: string
  matchedPr: string
  matchedPrTitle: string
  similarity: number
  decision: 'CHANGES_REQUESTED' | 'APPROVED'
  commentTitle: string
  commentBody: string
  suggestedFix?: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'listener-leak',
    label: 'Scenario A: useEffect Memory Leak (PR #234)',
    badge: 'High Impact',
    file: 'src/hooks/useMetrics.ts',
    line: 47,
    description: 'Window resize listener registered inside useEffect without cleanup return callback.',
    diffCode: `@@ -44,6 +44,10 @@ export function useMetrics(interval = 5000) {
+  useEffect(() => {
+    const handleResize = () => setWidth(window.innerWidth)
+    window.addEventListener('resize', handleResize)
+  }, [])`,
    matchedPr: '#234',
    matchedPrTitle: 'fix: unmount memory leak in Dashboard metrics listener',
    similarity: 0.918,
    decision: 'CHANGES_REQUESTED',
    commentTitle: '⚠️ Team Pattern Match (Referencing PR #234)',
    commentBody:
      'In **PR #234**, the team resolved an incident where uncleaned `window.addEventListener("resize")` callbacks caused zombie subscribers and leaked 45MB of heap on route transitions. All window listeners inside `useEffect` must return a teardown callback.',
    suggestedFix: `return () => window.removeEventListener('resize', handleResize)`,
  },
  {
    id: 'unindexed-query',
    label: 'Scenario B: Unindexed DB Filter (PR #189)',
    badge: 'Database Perf',
    file: 'server/services/analytics.py',
    line: 112,
    description: 'Query filters across organization_id, action_status, and created_at without utilizing composite index.',
    diffCode: `@@ -109,5 +109,9 @@ def get_audit_trail(db: Session, org_id: str, since: datetime):
+    return db.query(AuditLog).filter(
+        AuditLog.org_id == org_id,
+        AuditLog.action_status == "FAILED",
+        AuditLog.created_at >= since
+    ).order_by(AuditLog.created_at.desc()).limit(100).all()`,
    matchedPr: '#189',
    matchedPrTitle: 'perf: add composite index on (org_id, action_status, created_at)',
    similarity: 0.942,
    decision: 'CHANGES_REQUESTED',
    commentTitle: '⚠️ Performance Regression Hotfix (Referencing PR #189)',
    commentBody:
      'In **PR #189**, querying `AuditLog` by `(org_id, action_status, created_at)` triggered a full sequential scan lasting 3,820ms during peak load. Ensure this query uses composite index `ix_audit_org_status_date`.',
    suggestedFix: `# Ensure query planner leverages ix_audit_org_status_date\n# Hint: query using the indexed column prefix ordering`,
  },
  {
    id: 'clean-pr',
    label: 'Scenario C: Pure Memoized Component (Clean)',
    badge: 'Clean Diff',
    file: 'src/components/StatusBadge.tsx',
    line: 18,
    description: 'Clean refactor of a status badge with React.memo and strict TypeScript interface.',
    diffCode: `@@ -15,4 +15,10 @@ interface BadgeProps {
+export const StatusBadge: React.FC<BadgeProps> = React.memo(({ status, label }) => {
+  return (
+    <span className={badgeStyles[status]}>
+      {label}
+    </span>
+  )
+})`,
    matchedPr: 'None',
    matchedPrTitle: 'No violation found in 6 months team history',
    similarity: 0.312,
    decision: 'APPROVED',
    commentTitle: '✅ All Guardrails Passed — Auto-Approved',
    commentBody:
      'Zero historical regression matches found (highest cosine similarity `0.312` < threshold `0.80`). Pure memoized component following team styleguide. **LGTM!** 🚀',
  },
]

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'webhook_ingest',
    num: 1,
    name: 'Webhook Ingestion',
    tech: 'Node.js · Crypto · HMAC SHA-256',
    subtitle: 'Signature Verification & Redis Lock',
    color: '#007AFF', // macOS Blue
    durationMs: 400,
    description:
      'Receives GitHub webhook, computes HMAC SHA-256 signature with constant-time comparison, and acquires a Redis idempotency lock.',
    inputs: {
      headers: {
        'x-hub-signature-256': 'sha256=4f8b92e...',
        'x-github-event': 'pull_request.synchronize',
      },
      action: 'synchronize',
    },
    outputs: {
      is_valid: true,
      idempotency_key: 'idemp:pr:412:sha_9b1e7c',
      ttl_seconds: 600,
      status: 'VERIFIED_AND_LOCKED',
    },
    codeSnippet: `// Node 1: Webhook HMAC & Idempotency Verification
const signature = req.headers['x-hub-signature-256']
const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
const digest = 'sha256=' + hmac.update(rawBody).digest('hex')

if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
  throw new UnauthorizedError('Invalid HMAC signature')
}

// Atomic SETNX to deduplicate webhook deliveries
const acquired = await redis.set(\`idemp:pr:\${prId}:\${sha}\`, '1', 'NX', 'EX', 600)
if (!acquired) return res.status(200).json({ status: 'duplicate_delivery_ignored' })`,
    codeLang: 'typescript',
    engineeringRationale:
      'GitHub webhooks frequently retry on transient delays. Using Redis SETNX with a 10-minute TTL guarantees the heavy LLM pipeline runs exactly once per commit SHA.',
  },
  {
    id: 'queue_buffer',
    num: 2,
    name: 'BullMQ Queue Buffer',
    tech: 'BullMQ · Redis Streams',
    subtitle: 'Decoupling & Jittered Backoff',
    color: '#AF52DE', // macOS Purple
    durationMs: 380,
    description:
      'Decouples webhook ingestion from the AI pipeline to beat GitHub’s 10-second timeout, queuing execution with exponential backoff.',
    inputs: {
      queue: 'pr-review-pipeline',
      job_id: 'job_rev_412_9b1e',
      priority: 1,
      retry_attempts: 3,
    },
    outputs: {
      enqueued_at: '2026-09-22T18:24:02.180Z',
      queue_depth: 1,
      wait_ms: 18,
      worker_id: 'worker-04',
    },
    codeSnippet: `// Node 2: Decoupled BullMQ Task Queue
await prReviewQueue.add(
  'analyze-pull-request',
  { prNumber, repoOwner, repoName, commitSha, author },
  {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1500 }, // Backoff + random jitter
    removeOnComplete: true
  }
)
// Immediately respond 202 Accepted to GitHub
res.status(202).json({ status: 'accepted_for_processing' })`,
    codeLang: 'typescript',
    engineeringRationale:
      'LLM reasoning, vector search, and AST chunking take 2-4 seconds. Returning HTTP 202 immediately beats GitHub’s 10s deadline while BullMQ guarantees fault-tolerant async execution.',
  },
  {
    id: 'ast_parser',
    num: 3,
    name: 'AST Diff Parser',
    tech: 'Tree-sitter · Python AST',
    subtitle: 'Semantic Function Chunking',
    color: '#34C759', // macOS Green
    durationMs: 420,
    description:
      'Parses unified diff into semantic syntax chunks (functions, hooks, classes) rather than naive line splits, preserving complete scope.',
    inputs: {
      file_path: 'src/hooks/useMetrics.ts',
      diff_hunk_lines: 14,
      target_language: 'typescript',
    },
    outputs: {
      extracted_chunks: 2,
      primary_scope: 'useEffect_hook',
      enclosing_function: 'useMetrics',
      has_unclosed_listeners: true,
      clean_ast: true,
    },
    codeSnippet: `# Node 3: Tree-sitter AST Semantic Diff Extraction
tree = parser.parse(bytes(file_content, "utf-8"))
changed_nodes = extract_ast_nodes(tree.root_node, target_lines)

chunks: list[SemanticChunk] = []
for node in changed_nodes:
    scope = node.parent.type if node.parent else "global"
    chunks.append(
        SemanticChunk(
            node_type=node.type,
            scope=scope,
            code_text=node.text.decode("utf-8"),
            enclosing_func=get_enclosing_function_name(node)
        )
    )
return chunks`,
    codeLang: 'python',
    engineeringRationale:
      'Naive 500-token chunking cuts code mid-statement or separates a hook from its return. Tree-sitter preserves the syntactic unit so embeddings encode semantic intent, not syntax fragments.',
  },
  {
    id: 'vector_search',
    num: 4,
    name: 'pgvector Retrieval',
    tech: 'PostgreSQL · HNSW Cosine Index',
    subtitle: '384d Cosine Search over Past PRs',
    color: '#FF9500', // macOS Orange
    durationMs: 480,
    description:
      'Embeds the AST chunk into 384 dimensions and queries PostgreSQL HNSW vector index storing 6 months of historical team PR reviews.',
    inputs: {
      dimensions: 384,
      similarity_metric: 'cosine',
      hnsw_ef_search: 64,
      threshold: 0.82,
    },
    outputs: {
      query_latency_ms: 18.4,
      top_matches: 1,
      best_match_id: 'PR #234',
      best_cosine_score: 0.918,
      source_file: 'src/lib/analytics/listener.ts',
    },
    codeSnippet: `-- Node 4: HNSW Vector Search over 6 Months of Team PR Decisions
SELECT 
    pr_number,
    commit_sha,
    rejection_reason,
    recommended_pattern,
    1 - (embedding <=> $1::vector(384)) AS cosine_similarity
FROM team_pr_knowledge_base
WHERE repo_id = $2
  AND 1 - (embedding <=> $1::vector(384)) >= 0.82
ORDER BY cosine_similarity DESC
LIMIT 3;`,
    codeLang: 'sql',
    engineeringRationale:
      'Instead of generic rules ("this function is long"), the agent cites past team precedents ("your team rejected this in PR #234"). HNSW indexing enables sub-20ms search over tens of thousands of past PR chunks.',
  },
  {
    id: 'llm_guardrails',
    num: 5,
    name: 'FastAPI LLM Reasoner',
    tech: 'FastAPI · LangGraph · Pydantic v2',
    subtitle: 'Pydantic Schema & Guardrails',
    color: '#FF2D55', // macOS Pink
    durationMs: 520,
    description:
      'LangGraph node synthesizes diff and retrieved past PR rationale, validating output against strict Pydantic schemas to eliminate hallucinations.',
    inputs: {
      model: 'gemini-2.5-flash / gpt-4o-mini',
      temperature: 0.1,
      guardrail_mode: 'strict_pydantic',
    },
    outputs: {
      decision: 'CHANGES_REQUESTED',
      cites_historical_pr: 234,
      confidence_score: 0.96,
      hallucination_detected: false,
    },
    codeSnippet: `# Node 5: LangGraph Node with Strict Pydantic Schema Validation
class ReviewDecision(BaseModel):
    decision: Literal["CHANGES_REQUESTED", "APPROVED", "COMMENT"]
    confidence: float = Field(ge=0.0, le=1.0)
    cites_historical_pr: Optional[int]
    historical_pr_relevance: float
    markdown_comment: str
    suggested_fix: Optional[str]

@agent_graph.node("llm_reasoner")
async def reason_about_diff(state: AgentState) -> dict:
    prompt = build_review_prompt(state.ast_chunks, state.retrieved_prs)
    structured_llm = llm.with_structured_output(ReviewDecision)
    result: ReviewDecision = await structured_llm.ainvoke(prompt)
    
    # Hallucination guardrail: Ensure cited PR exists in retrieved set
    if result.cites_historical_pr and result.cites_historical_pr not in state.valid_pr_ids:
        raise GuardrailViolation("Cited PR not present in retrieval context")
    return {"review_decision": result}`,
    codeLang: 'python',
    engineeringRationale:
      'LLMs can hallucinate non-existent company conventions or fake PR numbers. The Pydantic guardrail guarantees that any cited PR number is verified against the actual pgvector retrieval set before dispatch.',
  },
  {
    id: 'github_comment',
    num: 6,
    name: 'GitHub Dispatch',
    tech: 'Octokit · GitHub REST API',
    subtitle: 'Contextual Inline Review Comment',
    color: '#00C7BE', // macOS Teal
    durationMs: 380,
    description:
      'Dispatches an authenticated Octokit API call to attach an inline markdown review comment directly onto the culprit line in the GitHub Pull Request diff.',
    inputs: {
      endpoint: 'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments',
      target_line: 47,
      side: 'RIGHT',
      bot_name: 'pr-review-agent[bot]',
    },
    outputs: {
      http_status: 201,
      comment_id: 19842109,
      html_url: 'https://github.com/yamindr/repo/pull/412#discussion_r19842109',
      dispatched: true,
    },
    codeSnippet: `// Node 6: Dispatches Contextual GitHub Inline Review
await octokit.rest.pulls.createReviewComment({
  owner: repoOwner,
  repo: repoName,
  pull_number: prNumber,
  commit_id: headSha,
  path: targetFilePath,
  line: culpritLineNumber,
  side: 'RIGHT',
  body: reviewDecision.markdown_comment + \`\\n\\n\` + 
    \`\`\`suggestion\\n\${reviewDecision.suggested_fix}\\n\`\`\`
})`,
    codeLang: 'typescript',
    engineeringRationale:
      'Posts directly onto the culprit line with GitHub’s 1-click "Commit suggestion" button, drastically reducing code review turnaround from hours to seconds.',
  },
]

interface LangGraphVisualizerProps {
  initialScenario?: ScenarioId
  onClose?: () => void
  accentHex?: string
}

export default function LangGraphVisualizer({
  initialScenario = 'listener-leak',
  accentHex = '#007AFF',
}: LangGraphVisualizerProps) {
  // ── State ─────────────────────────────────────────────────────────────────
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>(initialScenario)
  const [activeNodeIdx, setActiveNodeIdx] = useState<number>(-1)
  const [completedNodeIndices, setCompletedNodeIndices] = useState<number[]>([])
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [selectedInspectorNode, setSelectedInspectorNode] = useState<number>(0)
  const [activeViewTab, setActiveViewTab] = useState<'pipeline' | 'console' | 'comment'>('pipeline')
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1)
  const [logs, setLogs] = useState<Array<{ time: string; text: string; tag: string; color: string }>>([])
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0)

  const activeScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0],
    [selectedScenarioId]
  )

  const logsEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Reset when scenario changes
  useEffect(() => {
    handleReset()
  }, [selectedScenarioId])

  useEffect(() => {
    if (activeViewTab === 'console') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, activeViewTab])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    }
  }, [])

  const appendLog = (text: string, tag: string, color: string) => {
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, '0')}`
    setLogs((prev) => [...prev, { time: timeStr, text, tag, color }])
  }

  // ── Simulation Engine ─────────────────────────────────────────────────────
  const runSimulation = () => {
    if (isRunning) return
    handleReset()
    setIsRunning(true)
    setIsCompleted(false)

    appendLog(
      `[PIPELINE_INIT] Received PR #412 push event. Ingesting diff: ${activeScenario.file}`,
      'INIT',
      '#007AFF'
    )

    const startTime = Date.now()
    elapsedTimerRef.current = setInterval(() => {
      setElapsedTimeMs(Date.now() - startTime)
    }, 40)

    executeStep(0)
  }

  const executeStep = (nodeIdx: number) => {
    if (nodeIdx >= PIPELINE_NODES.length) {
      setIsRunning(false)
      setIsCompleted(true)
      setActiveNodeIdx(-1)
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
      appendLog(
        `[PIPELINE_DONE] All 6 LangGraph nodes executed cleanly. Decision: ${activeScenario.decision}`,
        'COMPLETE',
        activeScenario.decision === 'CHANGES_REQUESTED' ? '#FF9500' : '#34C759'
      )
      return
    }

    const node = PIPELINE_NODES[nodeIdx]
    setActiveNodeIdx(nodeIdx)
    setSelectedInspectorNode(nodeIdx)

    if (nodeIdx === 0) {
      appendLog(
        `[WEBHOOK] HMAC SHA-256 signature verified. Acquired Redis SETNX lock (idemp:pr:412).`,
        'NODE 1',
        node.color
      )
    } else if (nodeIdx === 1) {
      appendLog(
        `[BULLMQ] Enqueued task to review-queue with exponential backoff + jitter.`,
        'NODE 2',
        node.color
      )
    } else if (nodeIdx === 2) {
      appendLog(
        `[AST_DIFF] Tree-sitter parsed syntax tree. Detected scope: ${
          activeScenario.id === 'listener-leak'
            ? 'useEffect without cleanup return'
            : activeScenario.id === 'unindexed-query'
            ? 'filter on (org_id, status, created_at)'
            : 'pure React.memo component'
        }.`,
        'NODE 3',
        node.color
      )
    } else if (nodeIdx === 3) {
      if (activeScenario.id === 'clean-pr') {
        appendLog(
          `[PGVECTOR] 384d cosine query: Zero team regressions matched (score: ${activeScenario.similarity} < 0.82).`,
          'NODE 4',
          node.color
        )
      } else {
        appendLog(
          `[PGVECTOR] 384d cosine query: Hit past team PR ${activeScenario.matchedPr} (${Math.round(
            activeScenario.similarity * 100
          )}% similarity in 18ms).`,
          'NODE 4',
          node.color
        )
      }
    } else if (nodeIdx === 4) {
      appendLog(
        `[FASTAPI_LLM] Pydantic guardrail validated. Formulated review payload without hallucinations.`,
        'NODE 5',
        node.color
      )
    } else if (nodeIdx === 5) {
      appendLog(
        `[GITHUB] Dispatched inline comment to ${activeScenario.file}:${activeScenario.line}. HTTP 201 Created.`,
        'NODE 6',
        node.color
      )
    }

    const duration = Math.max(160, Math.round(node.durationMs / speedMultiplier))

    timerRef.current = setTimeout(() => {
      setCompletedNodeIndices((prev) => [...prev, nodeIdx])
      executeStep(nodeIdx + 1)
    }, duration)
  }

  const handleStepNext = () => {
    if (isRunning) return
    const nextIdx = activeNodeIdx === -1 ? 0 : activeNodeIdx + 1
    if (nextIdx < PIPELINE_NODES.length) {
      setActiveNodeIdx(nextIdx)
      setSelectedInspectorNode(nextIdx)
      setCompletedNodeIndices((prev) => [...new Set([...prev, activeNodeIdx])].filter((n) => n >= 0))
      appendLog(
        `[STEP] Stepped into ${PIPELINE_NODES[nextIdx].name}`,
        `STEP ${nextIdx + 1}`,
        PIPELINE_NODES[nextIdx].color
      )
    } else {
      setIsCompleted(true)
      setActiveNodeIdx(-1)
      setCompletedNodeIndices([0, 1, 2, 3, 4, 5])
    }
  }

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
    setIsRunning(false)
    setIsCompleted(false)
    setActiveNodeIdx(-1)
    setCompletedNodeIndices([])
    setLogs([])
    setElapsedTimeMs(0)
    setSelectedInspectorNode(0)
  }

  const inspectorNode = PIPELINE_NODES[selectedInspectorNode]

  // Node order in the 2-tier loop:
  // Top tier (left to right): Node 0 (Webhook) -> Node 1 (BullMQ) -> Node 2 (AST)
  // Bottom tier (right to left): Node 3 (pgvector) -> Node 4 (LLM) -> Node 5 (GitHub)
  const topTierNodes = [PIPELINE_NODES[0], PIPELINE_NODES[1], PIPELINE_NODES[2]]
  const bottomTierNodes = [PIPELINE_NODES[5], PIPELINE_NODES[4], PIPELINE_NODES[3]]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#16181d',
        color: '#f5f5f7',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ─── 1. AUTHENTIC MACOS UNIFIED TOOLBAR ─────────────────────────────────── */}
      <div
        style={{
          height: 48,
          minHeight: 48,
          backgroundColor: 'rgba(30, 32, 38, 0.88)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          gap: 12,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Left: Native macOS Segmented Control */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 7,
            padding: '2px',
            border: '0.5px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {(
            [
              { id: 'pipeline', label: 'Graph Canvas', icon: '⚡' },
              { id: 'console', label: `Live Stream (${logs.length})`, icon: '📋' },
              {
                id: 'comment',
                label: isCompleted
                  ? activeScenario.decision === 'CHANGES_REQUESTED'
                    ? 'Review (Changes)'
                    : 'Review (Approved)'
                  : 'Review Output',
                icon: '💬',
              },
            ] as const
          ).map((tab) => {
            const isSel = activeViewTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveViewTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: isSel ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                  color: isSel ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                  border: 'none',
                  borderRadius: 5,
                  padding: '3px 10px',
                  fontSize: 11.5,
                  fontWeight: isSel ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSel ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: 11 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Center: Scenario Native Pop-up Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 6,
            padding: '2px 8px',
            border: '0.5px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <span style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.45)', fontWeight: 500 }}>
            Scenario:
          </span>
          <select
            value={selectedScenarioId}
            onChange={(e) => setSelectedScenarioId(e.target.value as ScenarioId)}
            disabled={isRunning}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: 11.5,
              fontWeight: 500,
              outline: 'none',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              padding: '2px 0',
              fontFamily: 'inherit',
            }}
          >
            {SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id} style={{ backgroundColor: '#1c1e24', color: '#ffffff' }}>
                {sc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Apple Capsule Control Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Speed Toggle */}
          <button
            onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
            title="Simulation Playback Speed"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '0.5px solid rgba(255, 255, 255, 0.10)',
              borderRadius: 5,
              color: 'rgba(255, 255, 255, 0.8)',
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {speedMultiplier}x
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            title="Reset Pipeline"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '0.5px solid rgba(255, 255, 255, 0.10)',
              borderRadius: 5,
              color: 'rgba(255, 255, 255, 0.8)',
              padding: '4px 8px',
              fontSize: 11.5,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>↺</span>
            <span>Reset</span>
          </button>

          {/* Step */}
          <button
            onClick={handleStepNext}
            disabled={isRunning || isCompleted}
            title="Single Step Next"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '0.5px solid rgba(255, 255, 255, 0.10)',
              borderRadius: 5,
              color: isRunning || isCompleted ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.85)',
              padding: '4px 10px',
              fontSize: 11.5,
              fontWeight: 500,
              cursor: isRunning || isCompleted ? 'not-allowed' : 'pointer',
            }}
          >
            Step ❯
          </button>

          {/* Play / Run Button (Apple Accent Gradient) */}
          <button
            onClick={runSimulation}
            disabled={isRunning}
            style={{
              background: isRunning
                ? 'rgba(0, 122, 255, 0.35)'
                : 'linear-gradient(180deg, #007aff 0%, #0062cc 100%)',
              border: '0.5px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 5,
              color: '#ffffff',
              padding: '4px 12px',
              fontSize: 11.5,
              fontWeight: 600,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              boxShadow: isRunning ? 'none' : '0 2px 8px rgba(0, 122, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {isRunning ? (
              <>
                <svg
                  className="macos-spinner"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                  <path d="M12 3C16.97 3 21 7.03 21 12" strokeLinecap="round" />
                </svg>
                <span>Running...</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 10 }}>▶</span>
                <span>Run Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── 2. MAIN WORKSPACE AREA ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {/* VIEW 1: INTERACTIVE GRAPH CANVAS + INSPECTOR */}
        {activeViewTab === 'pipeline' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Top: macOS Interactive Pipeline Flow Diagram */}
            <div
              style={{
                flex: '0 0 290px',
                position: 'relative',
                backgroundColor: '#121417',
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxSizing: 'border-box',
                borderBottom: '0.5px solid rgba(255, 255, 255, 0.10)',
              }}
            >
              {/* SVG Connecting Flow Lines & Glowing Light Particles */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <defs>
                  <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#007AFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#AF52DE" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Cable 1: Node 1 -> Node 2 (Top tier left-to-middle) */}
                <path
                  d="M 28% 78 L 37% 78"
                  stroke={completedNodeIndices.includes(0) ? '#007AFF' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth="2"
                  strokeDasharray={activeNodeIdx === 0 ? '4 4' : 'none'}
                />

                {/* Cable 2: Node 2 -> Node 3 (Top tier middle-to-right) */}
                <path
                  d="M 63% 78 L 72% 78"
                  stroke={completedNodeIndices.includes(1) ? '#AF52DE' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth="2"
                  strokeDasharray={activeNodeIdx === 1 ? '4 4' : 'none'}
                />

                {/* Cable 3: Node 3 -> Node 4 (Curved down loop from top-right to bottom-right) */}
                <path
                  d="M 86% 115 C 86% 150, 86% 165, 86% 195"
                  fill="none"
                  stroke={completedNodeIndices.includes(2) ? '#34C759' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth="2"
                  strokeDasharray={activeNodeIdx === 2 ? '4 4' : 'none'}
                />

                {/* Cable 4: Node 4 -> Node 5 (Bottom tier right-to-middle) */}
                <path
                  d="M 72% 232 L 63% 232"
                  stroke={completedNodeIndices.includes(3) ? '#FF9500' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth="2"
                  strokeDasharray={activeNodeIdx === 3 ? '4 4' : 'none'}
                />

                {/* Cable 5: Node 5 -> Node 6 (Bottom tier middle-to-left) */}
                <path
                  d="M 37% 232 L 28% 232"
                  stroke={completedNodeIndices.includes(4) ? '#FF2D55' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth="2"
                  strokeDasharray={activeNodeIdx === 4 ? '4 4' : 'none'}
                />
              </svg>

              {/* 2-Tier Pipeline Nodes Layout */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 38,
                  position: 'relative',
                  zIndex: 2,
                  maxWidth: 900,
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                {/* Top Tier: Node 1 -> Node 2 -> Node 3 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
                  {topTierNodes.map((node, i) => {
                    const nodeIdx = i // 0, 1, 2
                    const isActive = activeNodeIdx === nodeIdx
                    const isDone = completedNodeIndices.includes(nodeIdx)
                    const isSelected = selectedInspectorNode === nodeIdx

                    return (
                      <motion.div
                        key={node.id}
                        onClick={() => setSelectedInspectorNode(nodeIdx)}
                        whileHover={{ y: -2 }}
                        style={{
                          backgroundColor: isActive
                            ? 'rgba(34, 38, 48, 0.95)'
                            : isDone
                            ? 'rgba(26, 29, 36, 0.92)'
                            : 'rgba(22, 24, 30, 0.85)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 9,
                          border: isActive
                            ? `1px solid ${node.color}`
                            : isSelected
                            ? '1px solid rgba(255, 255, 255, 0.45)'
                            : '0.5px solid rgba(255, 255, 255, 0.12)',
                          padding: '10px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          position: 'relative',
                          boxShadow: isActive
                            ? `0 0 16px ${node.color}40, 0 6px 18px rgba(0,0,0,0.4)`
                            : isSelected
                            ? '0 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 14px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.25)',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        {/* Port Pins on side */}
                        <div
                          style={{
                            position: 'absolute',
                            right: -6,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: isDone ? node.color : 'rgba(255,255,255,0.2)',
                            border: '1.5px solid #16181d',
                          }}
                        />
                        {nodeIdx > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              left: -6,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: isDone ? node.color : 'rgba(255,255,255,0.2)',
                              border: '1.5px solid #16181d',
                            }}
                          />
                        )}

                        {/* Top Line: Badge + Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: node.color,
                              backgroundColor: `${node.color}15`,
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            0{node.num}
                          </span>

                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 600,
                              color: isActive ? '#38bdf8' : isDone ? '#4ade80' : 'rgba(255, 255, 255, 0.35)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                            }}
                          >
                            {isActive ? '● RUNNING' : isDone ? '✓ DONE' : 'WAITING'}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
                            {node.name}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.55)', marginTop: 2 }}>
                            {node.subtitle}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Bottom Tier: Node 6 <- Node 5 <- Node 4 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
                  {bottomTierNodes.map((node, i) => {
                    const nodeIdx = 5 - i // Node 5 (i=0), Node 4 (i=1), Node 3 (i=2)
                    const isActive = activeNodeIdx === nodeIdx
                    const isDone = completedNodeIndices.includes(nodeIdx)
                    const isSelected = selectedInspectorNode === nodeIdx

                    return (
                      <motion.div
                        key={node.id}
                        onClick={() => setSelectedInspectorNode(nodeIdx)}
                        whileHover={{ y: -2 }}
                        style={{
                          backgroundColor: isActive
                            ? 'rgba(34, 38, 48, 0.95)'
                            : isDone
                            ? 'rgba(26, 29, 36, 0.92)'
                            : 'rgba(22, 24, 30, 0.85)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: 9,
                          border: isActive
                            ? `1px solid ${node.color}`
                            : isSelected
                            ? '1px solid rgba(255, 255, 255, 0.45)'
                            : '0.5px solid rgba(255, 255, 255, 0.12)',
                          padding: '10px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          position: 'relative',
                          boxShadow: isActive
                            ? `0 0 16px ${node.color}40, 0 6px 18px rgba(0,0,0,0.4)`
                            : isSelected
                            ? '0 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 14px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.25)',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        {/* Port Pins on side */}
                        <div
                          style={{
                            position: 'absolute',
                            left: -6,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: isDone ? node.color : 'rgba(255,255,255,0.2)',
                            border: '1.5px solid #16181d',
                          }}
                        />
                        {nodeIdx < 5 && (
                          <div
                            style={{
                              position: 'absolute',
                              right: -6,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: isDone ? node.color : 'rgba(255,255,255,0.2)',
                              border: '1.5px solid #16181d',
                            }}
                          />
                        )}

                        {/* Top Line: Badge + Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: node.color,
                              backgroundColor: `${node.color}15`,
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            0{node.num}
                          </span>

                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 600,
                              color: isActive ? '#38bdf8' : isDone ? '#4ade80' : 'rgba(255, 255, 255, 0.35)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3,
                            }}
                          >
                            {isActive ? '● RUNNING' : isDone ? '✓ DONE' : 'WAITING'}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
                            {node.name}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.55)', marginTop: 2 }}>
                            {node.subtitle}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom: macOS Developer Inspector (Split: Code & Engineering Rationale) */}
            <div
              style={{
                flex: 1,
                backgroundColor: '#16181d',
                padding: '14px 20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Node Inspector Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: inspectorNode.color,
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>
                    Node 0{inspectorNode.num}: {inspectorNode.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: inspectorNode.color,
                      backgroundColor: `${inspectorNode.color}18`,
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 500,
                    }}
                  >
                    {inspectorNode.tech}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.45)' }}>
                  Click any node above to inspect its code & rationale
                </div>
              </div>

              {/* Engineering Rationale Callout */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: 6,
                  padding: '8px 12px',
                  fontSize: 11.5,
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.45,
                  border: '0.5px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <strong style={{ color: '#ffffff' }}>Why Yamin built it this way: </strong>
                {inspectorNode.engineeringRationale}
              </div>

              {/* Code Snippet & Runtime State */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(220px, 1fr)',
                  gap: 12,
                }}
              >
                {/* Code Snippet */}
                <div
                  style={{
                    backgroundColor: '#0f1115',
                    borderRadius: 7,
                    border: '0.5px solid rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderBottom: '0.5px solid rgba(255, 255, 255, 0.06)',
                      fontSize: 10.5,
                      color: 'rgba(255, 255, 255, 0.55)',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Implementation Code</span>
                    <span style={{ textTransform: 'uppercase', color: '#38bdf8' }}>{inspectorNode.codeLang}</span>
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      padding: '10px 12px',
                      fontSize: 11,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      color: '#e2e8f0',
                      lineHeight: 1.45,
                      overflowX: 'auto',
                      maxHeight: 140,
                    }}
                  >
                    <code>{inspectorNode.codeSnippet}</code>
                  </pre>
                </div>

                {/* Runtime State */}
                <div
                  style={{
                    backgroundColor: '#0f1115',
                    borderRadius: 7,
                    border: '0.5px solid rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderBottom: '0.5px solid rgba(255, 255, 255, 0.06)',
                      fontSize: 10.5,
                      color: 'rgba(255, 255, 255, 0.55)',
                    }}
                  >
                    Node Output State (AgentState)
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      padding: '10px 12px',
                      fontSize: 11,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      color: '#34d399',
                      lineHeight: 1.4,
                      overflowY: 'auto',
                      maxHeight: 140,
                    }}
                  >
                    <code>{JSON.stringify(inspectorNode.outputs, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: REAL-TIME CONSOLE STREAM & TELEMETRY */}
        {activeViewTab === 'console' && (
          <div
            style={{
              flex: 1,
              backgroundColor: '#0e1014',
              padding: '16px 20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 11.5,
            }}
          >
            <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 11, marginBottom: 6 }}>
              // macOS Subsystem Stream · LangGraph Node Trace Session: pr_412_rev_8f2a
            </div>

            {logs.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)', fontSize: 13 }}>
                No active execution recorded. Click <strong>&ldquo;▶ Run Pipeline&rdquo;</strong> in the toolbar above.
              </div>
            ) : (
              logs.map((lg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, lineHeight: 1.5 }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: 10.5 }}>[{lg.time}]</span>
                  <span style={{ color: lg.color, fontWeight: 700, minWidth: 60, fontSize: 10.5 }}>
                    [{lg.tag}]
                  </span>
                  <span style={{ color: '#e2e8f0', flex: 1 }}>{lg.text}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        )}

        {/* VIEW 3: AUTHENTIC GITHUB DARK-MODE REVIEW CARD */}
        {activeViewTab === 'comment' && (
          <div
            style={{
              flex: 1,
              backgroundColor: '#0d1117', // GitHub dark mode
              padding: '24px 30px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ maxWidth: 740, width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Header Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>
                    GitHub Pull Request #412 Inline Review
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: isCompleted ? '#3fb950' : '#8b949e',
                    backgroundColor: isCompleted ? 'rgba(63, 185, 80, 0.15)' : 'rgba(110, 118, 129, 0.2)',
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}
                >
                  {isCompleted ? 'Dispatched via Octokit' : 'Awaiting Pipeline Run'}
                </span>
              </div>

              {/* Target File & Diff Header */}
              <div
                style={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#21262d',
                    borderBottom: '1px solid #30363d',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#c9d1d9',
                    fontFamily: 'monospace',
                  }}
                >
                  {activeScenario.file} (Line {activeScenario.line})
                </div>

                <pre
                  style={{
                    margin: 0,
                    padding: '6px 0',
                    fontSize: 11,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    lineHeight: 1.5,
                  }}
                >
                  {activeScenario.diffCode.split('\n').map((line, idx) => {
                    const isPlus = line.startsWith('+')
                    const isAt = line.startsWith('@')
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '0 14px',
                          backgroundColor: isPlus
                            ? 'rgba(46, 160, 67, 0.15)'
                            : isAt
                            ? 'rgba(56, 139, 253, 0.1)'
                            : 'transparent',
                          color: isPlus ? '#3fb950' : isAt ? '#58a6ff' : '#8b949e',
                        }}
                      >
                        {line}
                      </div>
                    )
                  })}
                </pre>
              </div>

              {/* Review Comment Box */}
              <div
                style={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: 6,
                  overflow: 'hidden',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                }}
              >
                {/* Author Bar */}
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#21262d',
                    borderBottom: '1px solid #30363d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        color: '#ffffff',
                        fontWeight: 700,
                      }}
                    >
                      🤖
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e6edf3' }}>
                      pr-review-agent
                    </span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 600,
                        color: '#8b949e',
                        border: '1px solid #30363d',
                        borderRadius: 3,
                        padding: '0 3px',
                      }}
                    >
                      BOT
                    </span>
                    <span style={{ fontSize: 11, color: '#8b949e' }}>
                      reviewed {isCompleted ? 'just now' : 'simulated'}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color:
                        activeScenario.decision === 'CHANGES_REQUESTED'
                          ? '#f85149'
                          : '#3fb950',
                    }}
                  >
                    {activeScenario.decision === 'CHANGES_REQUESTED'
                      ? '⚠️ Changes requested'
                      : '✓ Approved'}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: '14px', fontSize: 12.5, color: '#c9d1d9', lineHeight: 1.55 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 8, color: '#ffffff' }}>
                    {activeScenario.commentTitle}
                  </div>
                  <div>{activeScenario.commentBody}</div>

                  {activeScenario.suggestedFix && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4, fontWeight: 600 }}>
                        Suggested fix:
                      </div>
                      <div
                        style={{
                          backgroundColor: '#0d1117',
                          border: '1px solid #30363d',
                          borderRadius: 6,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            padding: '3px 8px',
                            backgroundColor: '#161b22',
                            borderBottom: '1px solid #30363d',
                            fontSize: 10,
                            color: '#8b949e',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>Suggestion</span>
                          <span style={{ color: '#58a6ff', cursor: 'pointer' }}>Commit suggestion ↵</span>
                        </div>
                        <pre
                          style={{
                            margin: 0,
                            padding: '8px 12px',
                            fontSize: 11.5,
                            fontFamily: 'monospace',
                            color: '#3fb950',
                            backgroundColor: 'rgba(46, 160, 67, 0.1)',
                          }}
                        >
                          <code>+ {activeScenario.suggestedFix}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Footnote */}
                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 10,
                      borderTop: '1px solid #30363d',
                      fontSize: 10.5,
                      color: '#8b949e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>Knowledge Source:</span>
                    <span style={{ color: '#58a6ff' }}>pgvector HNSW cosine query</span>
                    <span>·</span>
                    <span>Similarity: {(activeScenario.similarity * 100).toFixed(1)}%</span>
                    <span>·</span>
                    <span>Latency: 18.4ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
