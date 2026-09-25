export type MessageRole = 'user' | 'assistant' | 'system'

export interface ActionPill {
  id: string
  label: string
  icon: 'finder' | 'terminal' | 'file' | 'email' | 'code' | 'external'
  actionType: 'open_file' | 'open_terminal' | 'contact' | 'open_app'
  payload: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  isStreaming?: boolean
  actionPills?: ActionPill[]
  sources?: string[]
  model?: string
}

export interface KnowledgeChunk {
  id: string
  fileKey: string
  title: string
  category: 'about' | 'stack' | 'philosophy' | 'projects' | 'resume'
  content: string
  keywords: string[]
  recommendedActions?: ActionPill[]
}

export interface SearchResult {
  chunk: KnowledgeChunk
  score: number
  snippet: string
}
