'use client'

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = parseBlocks(content)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        fontSize: '13.5px',
        lineHeight: 1.6,
        color: '#DEDEE2',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", sans-serif',
        wordBreak: 'break-word',
      }}
    >
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'codeblock':
            return <CodeBlock key={idx} language={block.language} code={block.text} />
          case 'heading1':
            return (
              <h2
                key={idx}
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: '6px 0 2px',
                  letterSpacing: '-0.02em',
                }}
              >
                {renderInline(block.text)}
              </h2>
            )
          case 'heading2':
            return (
              <h3
                key={idx}
                style={{
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  margin: '4px 0 2px',
                  letterSpacing: '-0.015em',
                }}
              >
                {renderInline(block.text)}
              </h3>
            )
          case 'heading3':
            return (
              <h4
                key={idx}
                style={{
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#E5E5EA',
                  margin: '3px 0 1px',
                }}
              >
                {renderInline(block.text)}
              </h4>
            )
          case 'list':
            return (
              <ul
                key={idx}
                style={{
                  margin: '2px 0',
                  paddingLeft: '0',
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      lineHeight: 1.55,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: '#007AFF',
                        marginTop: '8px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>{renderInline(item)}</div>
                  </li>
                ))}
              </ul>
            )
          case 'ordered-list':
            return (
              <ol
                key={idx}
                style={{
                  margin: '2px 0',
                  paddingLeft: '0',
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      lineHeight: 1.55,
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 122, 255, 0.16)',
                        color: '#5ac8fa',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        flexShrink: 0,
                        marginTop: '2px',
                        border: '0.5px solid rgba(0, 122, 255, 0.3)',
                      }}
                    >
                      {itemIdx + 1}
                    </span>
                    <div style={{ flex: 1 }}>{renderInline(item)}</div>
                  </li>
                ))}
              </ol>
            )
          case 'quote':
            return (
              <blockquote
                key={idx}
                style={{
                  margin: '4px 0',
                  padding: '6px 14px',
                  borderLeft: '3px solid #007AFF',
                  backgroundColor: 'rgba(0, 122, 255, 0.08)',
                  borderRadius: '0 8px 8px 0',
                  color: '#E5E5EA',
                  fontStyle: 'italic',
                }}
              >
                {renderInline(block.text)}
              </blockquote>
            )
          case 'paragraph':
          default:
            return (
              <p
                key={idx}
                style={{
                  margin: '0',
                  lineHeight: 1.6,
                }}
              >
                {renderInline(block.text)}
              </p>
            )
        }
      })}
    </div>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      style={{
        margin: '6px 0',
        borderRadius: '8px',
        backgroundColor: 'rgba(15, 17, 23, 0.92)',
        border: '0.5px solid rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        fontSize: '12.5px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'monospace',
          textTransform: 'lowercase',
        }}
      >
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            color: copied ? '#30d158' : 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '4px',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre
        style={{
          margin: 0,
          padding: '12px 14px',
          overflowX: 'auto',
          color: '#E6EDF3',
          fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          lineHeight: 1.5,
          fontSize: '12px',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ── Markdown Block Parser ───────────────────────────────────────────────────

type Block =
  | { type: 'heading1'; text: string }
  | { type: 'heading2'; text: string }
  | { type: 'heading3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'codeblock'; language: string; text: string }
  | { type: 'quote'; text: string }
  | { type: 'paragraph'; text: string }

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split(/\r?\n/)
  const blocks: Block[] = []

  let inCodeBlock = false
  let codeLang = ''
  let codeLines: string[] = []

  let currentListItems: string[] = []
  let isCurrentListOrdered = false

  const flushList = () => {
    if (currentListItems.length > 0) {
      if (isCurrentListOrdered) {
        blocks.push({ type: 'ordered-list', items: [...currentListItems] })
      } else {
        blocks.push({ type: 'list', items: [...currentListItems] })
      }
      currentListItems = []
      isCurrentListOrdered = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    // 1. Code blocks toggle
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // end code block
        blocks.push({
          type: 'codeblock',
          language: codeLang,
          text: codeLines.join('\n'),
        })
        inCodeBlock = false
        codeLang = ''
        codeLines = []
      } else {
        flushList()
        inCodeBlock = true
        codeLang = trimmed.slice(3).trim()
        codeLines = []
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(rawLine)
      continue
    }

    // Empty line separates blocks
    if (!trimmed) {
      flushList()
      continue
    }

    // 2. Headings
    if (trimmed.startsWith('# ')) {
      flushList()
      blocks.push({ type: 'heading1', text: trimmed.slice(2).trim() })
      continue
    }
    if (trimmed.startsWith('## ')) {
      flushList()
      blocks.push({ type: 'heading2', text: trimmed.slice(3).trim() })
      continue
    }
    if (trimmed.startsWith('### ')) {
      flushList()
      blocks.push({ type: 'heading3', text: trimmed.slice(4).trim() })
      continue
    }

    // 3. Blockquotes
    if (trimmed.startsWith('> ')) {
      flushList()
      blocks.push({ type: 'quote', text: trimmed.slice(2).trim() })
      continue
    }

    // 4. Bullet lists: `- ` or `* `
    const bulletMatch = rawLine.match(/^(\s*)([-*])\s+(.+)$/)
    if (bulletMatch) {
      if (isCurrentListOrdered) flushList()
      isCurrentListOrdered = false
      currentListItems.push(bulletMatch[3].trim())
      continue
    }

    // 5. Ordered lists: `1. `, `2. `
    const numMatch = rawLine.match(/^(\s*)(\d+)\.\s+(.+)$/)
    if (numMatch) {
      if (!isCurrentListOrdered && currentListItems.length > 0) flushList()
      isCurrentListOrdered = true
      currentListItems.push(numMatch[3].trim())
      continue
    }

    // Regular text (or paragraph continuation)
    flushList()
    blocks.push({ type: 'paragraph', text: trimmed })
  }

  // Flush any open blocks
  if (inCodeBlock) {
    blocks.push({
      type: 'codeblock',
      language: codeLang,
      text: codeLines.join('\n'),
    })
  }
  flushList()

  return blocks
}

// ── Inline Markdown Renderer (Bold, Italic, Code, Links) ────────────────────

function renderInline(text: string): React.ReactNode {
  // Regex to match inline patterns: `code`, **bold**, *italic*, [text](url)
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g

  const parts = text.split(regex)
  if (parts.length === 1) return text

  return parts.map((part, index) => {
    if (!part) return null

    // Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          style={{
            fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#5ac8fa',
            padding: '1px 5px',
            borderRadius: '4px',
            border: '0.5px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong
          key={index}
          style={{
            fontWeight: 600,
            color: '#FFFFFF',
          }}
        >
          {part.slice(2, -2)}
        </strong>
      )
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em
          key={index}
          style={{
            fontStyle: 'italic',
            color: '#E5E5EA',
          }}
        >
          {part.slice(1, -1)}
        </em>
      )
    }

    // Markdown link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#5ac8fa',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          {linkMatch[1]}
        </a>
      )
    }

    return part
  })
}
