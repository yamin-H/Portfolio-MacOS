import { NextResponse } from 'next/server'
import { generateAgentResponse } from '@/lib/agent/engine'
import { searchKnowledge, collectActionPills } from '@/lib/agent/retriever'

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  const hasGroqKey = Boolean(apiKey && apiKey.length > 5 && !apiKey.includes('your_'))

  return NextResponse.json({
    hasGroqKey,
    provider: hasGroqKey ? 'groq' : 'local-rag',
    model: hasGroqKey ? (process.env.GROQ_MODEL?.trim() || 'gpt-oss-120b') : 'apple-intelligence-rag',
  })
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message prompt' }, { status: 400 })
    }

    const cleanQuery = message.trim()
    const apiKey = process.env.GROQ_API_KEY?.trim()
    const hasGroqKey = Boolean(apiKey && apiKey.length > 5 && !apiKey.includes('your_'))

    // 1. Retrieve semantic knowledge & context from Yamin's verified profile
    const matches = searchKnowledge(cleanQuery, 4)
    const sources = Array.from(new Set(matches.map((m) => m.chunk.fileKey)))
    const actionPills = collectActionPills(matches)

    // 2. If Groq API Key is configured -> Query Groq Cloud (GPT-OSS 120B)
    if (hasGroqKey) {
      try {
        const retrievedContext = matches
          .map((m, i) => `[Source ${i + 1}: ${m.chunk.title} (${m.chunk.fileKey})]\n${m.chunk.content}`)
          .join('\n\n')

        const systemPrompt = `You are Apple Intelligence Spotlight, the personal AI representative for Yamin Hossain's macOS Portfolio OS.
You speak on behalf of Yamin Hossain, an AI-Native Software Engineer based in Rajshahi, Bangladesh.

CORE PROFILE & GROUND TRUTH:
- Role & Focus: AI-Native Software Engineer specializing in production LLM pipelines, LangGraph multi-agent systems, and resilient backend architectures.
- Status: Open to early-stage remote engineering teams who need someone to own hard problems end-to-end from day one.
- Contact: Email: yamindr@gmail.com | GitHub: github.com/yamin | LinkedIn: linkedin.com/in/yamin

PRIMARY TECHNICAL STACK:
- AI & Multi-Agent Frameworks: LangGraph (stateful cyclical graphs, checkpointers, conditional edge routing), LangChain, pgvector (384-dimensional cosine embeddings), prompt engineering, schema guardrails (Zod/Pydantic).
- Inference Layer: Python, FastAPI (high-throughput async LLM pipelines).
- Orchestration & Webhooks: Node.js, Express, TypeScript, BullMQ + Redis for resilient queue management.
- Frontend & macOS Experience: React 19, Next.js (App Router), TypeScript, Tailwind CSS, Zustand, Framer Motion direct DOM physics.
- Databases & Infrastructure: PostgreSQL, Prisma ORM, Redis, Neon serverless, Docker, Vercel, Turborepo, CI/CD automation.

FLAGSHIP PRODUCTION PROJECTS:
1. PR Review Agent:
   - Live Marketplace-installable GitHub App.
   - Ingests 6 months of a team's merged PR discussions and commit history into pgvector.
   - 6-node LangGraph pipeline. Posts contextual inline review comments citing actual past decisions (e.g. "team rejected this pattern in PR #234 due to DB connection pool exhaustion").
2. Bug Reproducer:
   - Autonomous end-to-end debugging API service.
   - 7-node LangGraph pipeline with conditional failure categorization edges.
   - Spins up isolated Docker containers, reproduces issues from GitHub issues, generates failing test, creates patch, and opens verified PRs.
3. Remotion Open Source Contributor:
   - Contributed feature 'preserveSilence' in renderMediaOnWeb() & playbackRate test coverage to remotion-dev/remotion.

ENGINEERING PHILOSOPHY:
- "Reliability is the primary feature, not an afterthought."
- Queue everything external: External APIs (OpenAI, GitHub, Anthropic) must pass through BullMQ + Redis with exponential backoff and jitter.
- Observability: Every agent node is logged and traced. You cannot debug what you cannot observe.
- Guardrails: LLM outputs are strictly validated before touching production databases.

VERIFIED KNOWLEDGE CHUNKS:
${retrievedContext}

STYLE & FORMATTING GUIDELINES:
- Respond in structured, clean Markdown.
- Use bold headers (### or ####) to organize distinct sections.
- Use bullet points (- ) or numbered lists (1. ) for clarity.
- Highlight important technologies, concepts, and statistics in **bold**.
- Wrap code snippets, commands, or filenames in backticks (\`code\`) or multi-line code blocks with language identifiers.
- Keep responses articulate, direct, and technically rigorous.
- Never hallucinate non-existent experience, degrees, or employers.`

        const conversationMessages = [
          { role: 'system', content: systemPrompt },
          ...(Array.isArray(history)
            ? history.slice(-6).map((h: { role: string; content: string }) => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.content,
              }))
            : []),
          { role: 'user', content: cleanQuery },
        ]

        const configuredModel = process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b'
        // Groq API uses 'openai/gpt-oss-120b' identifier
        const groqModelId = configuredModel === 'gpt-oss-120b' ? 'openai/gpt-oss-120b' : configuredModel

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: groqModelId,
            messages: conversationMessages,
            temperature: 0.35,
            max_tokens: 3000,
          }),
        })

        if (groqRes.ok) {
          const data = await groqRes.json()
          const choiceMsg = data.choices?.[0]?.message
          const fullText = (choiceMsg?.content?.trim()) || (choiceMsg?.reasoning?.trim())

          if (fullText) {
            return NextResponse.json({
              text: fullText,
              actionPills: actionPills.length > 0 ? actionPills : [
                { id: 'view-stack', label: 'Open stack.md in Finder', icon: 'finder', actionType: 'open_file', payload: 'About/stack.md' },
                { id: 'view-neofetch', label: 'View neofetch in Terminal', icon: 'terminal', actionType: 'open_terminal', payload: 'neofetch' },
              ],
              sources: sources.length > 0 ? sources : ['stack.md', 'philosophy.md'],
              provider: 'groq',
              model: 'GPT-OSS 120B (Groq LPU)',
              isLiveLLM: true,
            })
          }
        } else {
          const errBody = await groqRes.text().catch(() => '')
          console.warn('Groq API error, falling back to local semantic RAG:', groqRes.status, errBody)
        }
      } catch (groqErr) {
        console.warn('Groq connection failed, falling back to local semantic RAG:', groqErr)
      }
    }

    // 3. Fallback: Local Semantic RAG Engine
    const localRes = generateAgentResponse(cleanQuery)

    return NextResponse.json({
      text: localRes.text,
      actionPills: localRes.actionPills,
      sources: localRes.sources,
      provider: 'local-rag',
      model: 'Apple Intelligence RAG Engine',
      isLiveLLM: false,
    })
  } catch (error) {
    console.error('Chat API handler error:', error)
    return NextResponse.json({ error: 'Internal agent processing error' }, { status: 500 })
  }
}
