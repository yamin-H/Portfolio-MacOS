'use client'

import React from 'react'

export default function TechStackView() {
  const sections = [
    {
      category: 'AI & AGENTS',
      accent: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      pills: [
        'LangGraph',
        'LangChain',
        'RAG Pipeline',
        'pgvector',
        'Prompt Engineering',
        'Tool Calling',
        'Guardrails',
        'OpenAI',
        'Anthropic',
      ],
    },
    {
      category: 'BACKEND & ORCHESTRATION',
      accent: '#34d399',
      bg: 'rgba(52, 211, 153, 0.1)',
      border: 'rgba(52, 211, 153, 0.3)',
      pills: [
        'Python',
        'FastAPI',
        'Node.js',
        'Express.js',
        'TypeScript',
        'BullMQ',
        'Redis',
        'WebSocket',
        'SSE',
        'REST APIs',
        'Pydantic',
      ],
    },
    {
      category: 'FRONTEND',
      accent: '#a78bfa',
      bg: 'rgba(167, 139, 250, 0.1)',
      border: 'rgba(167, 139, 250, 0.3)',
      pills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'shadcn/ui'],
    },
    {
      category: 'DATABASES',
      accent: '#fb923c',
      bg: 'rgba(251, 146, 60, 0.1)',
      border: 'rgba(251, 146, 60, 0.3)',
      pills: ['PostgreSQL', 'Prisma ORM', 'Redis', 'Neon', 'MySQL'],
    },
    {
      category: 'INFRASTRUCTURE',
      accent: 'rgba(255, 255, 255, 0.6)',
      bg: 'rgba(255, 255, 255, 0.06)',
      border: 'rgba(255, 255, 255, 0.18)',
      pills: ['Docker', 'Vercel', 'Render', 'Turborepo', 'Git', 'GitHub', 'CI/CD'],
    },
  ]

  return (
    <div
      style={{
        background: 'transparent',
        padding: '24px 28px',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        overflowY: 'auto',
        minHeight: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Page Heading */}
      <h1
        style={{
          margin: 0,
          marginBottom: '24px',
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.88)',
        }}
      >
        Technical Stack
      </h1>

      {/* Sections Stack */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {sections.map((sec) => (
          <div key={sec.category}>
            {/* Section Label */}
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.35)',
                marginBottom: '10px',
              }}
            >
              {sec.category}
            </div>

            {/* Pill Tags Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {sec.pills.map((pill) => (
                <span
                  key={pill}
                  style={{
                    borderRadius: '5px',
                    padding: '3px 9px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: sec.bg,
                    border: `0.5px solid ${sec.border}`,
                    color: sec.accent,
                    display: 'inline-block',
                    lineHeight: '16px',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
