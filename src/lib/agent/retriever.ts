import { KNOWLEDGE_BASE } from './knowledge'
import { KnowledgeChunk, SearchResult, ActionPill } from './types'

// Stopwords to ignore in retrieval
const STOPWORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are',
  'was', 'were', 'it', 'this', 'that', 'with', 'as', 'by', 'i', 'you', 'he', 'she',
  'we', 'they', 'my', 'your', 'his', 'her', 'their', 'what', 'which', 'who', 'how',
  'can', 'tell', 'me', 'about', 'show', 'give', 'does', 'do', 'did', 'have', 'has',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
}

export function searchKnowledge(query: string, topK: number = 3): SearchResult[] {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return []

  const queryLower = query.toLowerCase()

  const results: SearchResult[] = KNOWLEDGE_BASE.map((chunk) => {
    let score = 0

    // Exact title or keyword match
    if (queryLower.includes(chunk.title.toLowerCase())) {
      score += 15
    }

    // Keyword hits
    chunk.keywords.forEach((kw) => {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 8
      }
    })

    // Token frequency in content
    const contentTokens = tokenize(chunk.content)
    const contentSet = new Set(contentTokens)

    queryTokens.forEach((qt) => {
      if (contentSet.has(qt)) {
        score += 3
      }
      // Check partial match
      if (chunk.content.toLowerCase().includes(qt)) {
        score += 1.5
      }
    })

    // Boost specific high-value queries
    if (
      (queryLower.includes('pipeline') || queryLower.includes('reliable') || queryLower.includes('reliability')) &&
      chunk.id.includes('philosophy-reliability')
    ) {
      score += 20
    }

    if (
      (queryLower.includes('pr review') || queryLower.includes('review agent')) &&
      chunk.id === 'project-pr-review-agent'
    ) {
      score += 25
    }

    if (
      (queryLower.includes('bug reproducer') || queryLower.includes('debugging')) &&
      chunk.id === 'project-bug-reproducer'
    ) {
      score += 25
    }

    if (
      (queryLower.includes('remotion') || queryLower.includes('open source') || queryLower.includes('star')) &&
      chunk.id === 'project-remotion-oss'
    ) {
      score += 25
    }

    if (
      (queryLower.includes('stack') || queryLower.includes('technologies') || queryLower.includes('langgraph')) &&
      chunk.category === 'stack'
    ) {
      score += 15
    }

    if (
      (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('hire') || queryLower.includes('reach')) &&
      chunk.id === 'about-yamin'
    ) {
      score += 20
    }

    return {
      chunk,
      score,
      snippet: chunk.content.slice(0, 160) + '...',
    }
  })

  // Sort descending
  return results.filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, topK)
}

export function collectActionPills(searchResults: SearchResult[]): ActionPill[] {
  const pillMap = new Map<string, ActionPill>()
  searchResults.forEach((res) => {
    res.chunk.recommendedActions?.forEach((action) => {
      if (!pillMap.has(action.id)) {
        pillMap.set(action.id, action)
      }
    })
  })
  return Array.from(pillMap.values()).slice(0, 3)
}
