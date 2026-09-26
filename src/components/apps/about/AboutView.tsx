'use client'

import React, { useState } from 'react'

export default function AboutView() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const asciiArt = `██╗   ██╗ █████╗ ███╗   ███╗██╗███╗   ██╗
╚██╗ ██╔╝██╔══██╗████╗ ████║██║████╗  ██║
 ╚████╔╝ ███████║██╔████╔██║██║██╔██╗ ██║
  ╚██╔╝  ██╔══██║██║╚██╔╝██║██║██║╚██╗██║
   ██║   ██║  ██║██║ ╚═╝ ██║██║██║ ╚████║
   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝`

  const neofetchData = [
    { key: 'Name', value: 'Yamin Hossain' },
    { key: 'Role', value: 'Fullstack AI Engineer' },
    { key: 'Focus', value: 'LLM Agents · RAG · Full-Stack' },
    { key: 'Stack', value: 'TypeScript · Python · LangGraph' },
    { key: 'Runtime', value: 'Node.js · FastAPI · Next.js' },
    { key: 'Database', value: 'PostgreSQL · pgvector · Redis' },
    { key: 'Ships', value: 'End-to-end products' },
    { key: 'Status', value: 'Open to remote teams' },
  ]

  const timelineEntries = [
    {
      period: 'Jun 2026 – Present',
      title: 'PR Review Agent',
      description:
        'Marketplace-installable GitHub App. Makes 6 months of team PR history searchable. Posts inline review comments referencing specific past decisions not generic rules. 6-node LangGraph pipeline with pgvector similarity search.',
      tags: ['LangGraph', 'pgvector', 'BullMQ', 'FastAPI', 'Next.js'],
    },
    {
      period: 'Feb 2026 – Present',
      title: 'Bug Reproducer',
      description:
        'Autonomous debugging agent. Takes a GitHub issue URL, reproduces the bug, writes a failing test, generates a fix, opens a PR without human intervention. 7-node LangGraph pipeline with conditional retry logic.',
      tags: ['LangGraph', 'LangChain', 'FastAPI', 'Docker', 'PostgreSQL'],
    },
    {
      period: '2025',
      title: 'Remotion Open Source Contributor',
      description:
        'Two merged PRs into Remotion which has 52.6k GitHub stars. Fixed ASR timing misalignment with preserveSilence option. Extended playbackRate validation to match modern browser capabilities. Full test coverage included.',
      tags: ['TypeScript', 'React', 'Web Audio API', 'Bun'],
    },
    {
      period: 'Oct 2022 – Mar 2026',
      title: 'Varendra University',
      description:
        'Bachelor of Engineering in Electrical and Electronic Engineering. Built production AI systems throughout, bridging hardware foundations with modern software thinking.',
      tags: ['Engineering', 'Systems Thinking'],
    },
  ]

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        overflowY: 'auto',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        color: '#FFFFFF',
      }}
    >
      {/* ─── SECTION 1: Neofetch Terminal Card ──────────────────────────────── */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(18, 20, 26, 0.78)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '1px solid rgba(0, 122, 255, 0.25)',
          borderRadius: '14px',
          padding: '22px 24px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Terminal Header with macOS Window Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27C93F' }} />
            <span
              style={{
                fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.45)',
                marginLeft: '8px',
              }}
            >
              yamin@portfolio-os ~ neofetch
            </span>
          </div>
          <span
            style={{
              fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
              fontSize: '10.5px',
              color: '#007AFF',
              backgroundColor: 'rgba(0, 122, 255, 0.12)',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(0, 122, 255, 0.28)',
            }}
          >
            zsh · darwin
          </span>
        </div>

        {/* Two Columns Side by Side */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Column: ASCII Block Art of "YAMIN" in Blue */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              backgroundColor: 'rgba(0, 122, 255, 0.06)',
              border: '1px solid rgba(0, 122, 255, 0.18)',
              borderRadius: '10px',
            }}
          >
            <pre
              style={{
                margin: 0,
                color: '#007AFF',
                fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
                fontSize: '11.5px',
                lineHeight: 1.25,
                fontWeight: 700,
                letterSpacing: '0.04em',
                userSelect: 'none',
              }}
            >
              {asciiArt}
            </pre>
          </div>

          {/* Right Column: Key-Value Pairs in Monospace */}
          <div
            style={{
              flex: 1,
              minWidth: '260px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6.5px',
              fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
              fontSize: '12.5px',
              lineHeight: 1.45,
            }}
          >
            {neofetchData.map((item) => (
              <div key={item.key} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#007AFF', fontWeight: 600, minWidth: '82px' }}>
                  {item.key}:
                </span>
                <span style={{ color: '#FFFFFF', wordBreak: 'break-word' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Links Row Below Columns */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Email */}
          <a
            href="mailto:yamindr3@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredLink('email')}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontSize: '12px',
              color: hoveredLink === 'email' ? '#58A6FF' : 'rgba(255, 255, 255, 0.85)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 12px',
              borderRadius: '7px',
              border: hoveredLink === 'email' ? '1px solid #007AFF' : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.15s ease',
              fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#30D158',
                display: 'inline-block',
                boxShadow: '0 0 6px #30D158',
              }}
            />
            <span>Email: yamindr3@gmail.com</span>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/yamin-H"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredLink('github')}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontSize: '12px',
              color: hoveredLink === 'github' ? '#58A6FF' : 'rgba(255, 255, 255, 0.85)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 12px',
              borderRadius: '7px',
              border: hoveredLink === 'github' ? '1px solid #007AFF' : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.15s ease',
              fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#BF5AF2',
                display: 'inline-block',
                boxShadow: '0 0 6px #BF5AF2',
              }}
            />
            <span>GitHub: github.com/yamin-H</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/yamin-hossain-n/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredLink('linkedin')}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontSize: '12px',
              color: hoveredLink === 'linkedin' ? '#58A6FF' : 'rgba(255, 255, 255, 0.85)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 12px',
              borderRadius: '7px',
              border: hoveredLink === 'linkedin' ? '1px solid #007AFF' : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.15s ease',
              fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#007AFF',
                display: 'inline-block',
                boxShadow: '0 0 6px #007AFF',
              }}
            />
            <span>LinkedIn: yamin-hossain-n</span>
          </a>
        </div>
      </div>

      {/* ─── SECTION 2: Career Timeline ────────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Title Above */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>TIMELINE</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
        </div>

        {/* Vertical Timeline Container with Blue Border Line */}
        <div
          style={{
            position: 'relative',
            marginLeft: '8px',
            paddingLeft: '24px',
            borderLeft: '2px solid #007AFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
          }}
        >
          {timelineEntries.map((entry, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              {/* Dot Marker */}
              <div
                style={{
                  position: 'absolute',
                  left: '-31px',
                  top: '4px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#007AFF',
                  border: '2px solid #12141A',
                  boxShadow: '0 0 8px rgba(0, 122, 255, 0.65)',
                }}
              />

              {/* Timeline Entry Card */}
              <div
                style={{
                  backgroundColor: 'rgba(24, 26, 32, 0.65)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.22)',
                }}
              >
                {/* Header: Period & Title */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace, "SF Mono", Menlo, Consolas',
                      fontSize: '11.5px',
                      color: '#007AFF',
                      fontWeight: 600,
                    }}
                  >
                    {entry.period}
                  </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '12px' }}>—</span>
                  <span
                    style={{
                      fontSize: '14.5px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {entry.title}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    lineHeight: 1.55,
                    color: 'rgba(255, 255, 255, 0.78)',
                  }}
                >
                  {entry.description}
                </p>

                {/* Tag Pills */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '4px',
                  }}
                >
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#58A6FF',
                        backgroundColor: 'rgba(0, 122, 255, 0.12)',
                        border: '1px solid rgba(0, 122, 255, 0.35)',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        display: 'inline-block',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
