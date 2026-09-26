'use client'

import React, { useState } from 'react'

export default function PhilosophyView() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const principles = [
    {
      num: '1',
      title: 'Reliability is the Feature',
      desc: 'A demo that works once on a golden prompt is not an engineering achievement. Every system I build has exponential backoff, structured error recovery, rollback handling, and retry limits before shipping.',
    },
    {
      num: '2',
      title: 'Agents Need Observability',
      desc: 'A multi-agent pipeline that fails silently is worse than a crashed server. Traceability via LangSmith, structured logging, latency profiling, and token accounting are day-one requirements.',
    },
    {
      num: '3',
      title: 'Code You Can Read at 3 AM',
      desc: 'Clever one-liners cause 3 AM incidents. I write explicit, readable, well-typed code with clear domain boundaries, exhaustive error handling, and zero magic.',
    },
    {
      num: '4',
      title: 'Ship Small, Ship Often',
      desc: 'Long branches breed merge hell and hidden regressions. I prefer trunk-based development, feature flags, atomic commits, and continuous deployment over quarterly big bangs.',
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
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.88)',
        }}
      >
        Engineering Philosophy
      </h1>

      {/* Cards Stack */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {principles.map((item, idx) => {
          const isHovered = hoveredIdx === idx

          return (
            <div
              key={item.num}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                backgroundColor: isHovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderLeft: '3px solid #3b82f6',
                borderRadius: '10px',
                padding: '16px 20px',
                transition: 'background-color 0.12s ease',
                boxSizing: 'border-box',
              }}
            >
              {/* First Line: Number in Blue Monospace & Title in White Bold */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#3b82f6',
                  }}
                >
                  {item.num} ·
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  {item.title}
                </span>
              </div>

              {/* Second Line: Description */}
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '13px',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                {item.desc}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
