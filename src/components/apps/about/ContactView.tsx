'use client'

import React, { useState } from 'react'

export default function ContactView() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)

  const handleCopy = (key: string, value: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value)
    }
    setCopiedKey(key)
    setTimeout(() => {
      setCopiedKey(null)
    }, 2000)
  }

  const rows = [
    {
      id: 'email',
      dotColor: '#f87171',
      label: 'EMAIL',
      value: 'yamindr3@gmail.com',
      isLink: false,
    },
    {
      id: 'github',
      dotColor: '#34d399',
      label: 'GITHUB',
      value: 'github.com/yamin-H',
      href: 'https://github.com/yamin-H',
      isLink: true,
    },
    {
      id: 'linkedin',
      dotColor: '#3b82f6',
      label: 'LINKEDIN',
      value: 'linkedin.com/in/yamin-hossain-n',
      href: 'https://www.linkedin.com/in/yamin-hossain-n/',
      isLink: true,
    },
    {
      id: 'whatsapp',
      dotColor: '#34d399',
      label: 'WHATSAPP',
      value: '+880-01706960268',
      isLink: false,
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
      <style>{`
        @keyframes pulseDot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Page Heading */}
      <h1
        style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.88)',
        }}
      >
        Get in Touch
      </h1>

      {/* Subtitle */}
      <div
        style={{
          marginTop: '4px',
          marginBottom: '20px',
          fontSize: '13px',
          lineHeight: 1.65,
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        Open to fullstack and AI engineering roles — remote, worldwide.
      </div>

      {/* Single Card Containing Stacked Contact Rows */}
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: 0,
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {rows.map((row, idx) => {
          const isLast = idx === rows.length - 1
          const isRowHovered = hoveredRow === row.id
          const isCopied = copiedKey === row.id
          const isBtnHovered = hoveredBtn === row.id

          return (
            <div
              key={row.id}
              onMouseEnter={() => setHoveredRow(row.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                height: '48px',
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isRowHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                borderBottom: isLast ? 'none' : '0.5px solid rgba(255,255,255,0.06)',
                transition: 'background-color 0.12s ease',
                boxSizing: 'border-box',
              }}
            >
              {/* Colored Dot */}
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: row.dotColor,
                  marginRight: '14px',
                  flexShrink: 0,
                }}
              />

              {/* Contact Type Label */}
              <div
                style={{
                  width: '80px',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.35)',
                  flexShrink: 0,
                }}
              >
                {row.label}
              </div>

              {/* Contact Value */}
              <div
                style={{
                  flex: 1,
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.88)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {row.value}
              </div>

              {/* Action Button: Copy or Open ↗ */}
              {row.isLink ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredBtn(row.id)}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{
                    background: isBtnHovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    borderRadius: '5px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'background-color 0.12s ease, color 0.12s ease',
                    flexShrink: 0,
                  }}
                >
                  Open ↗
                </a>
              ) : (
                <button
                  onClick={() => handleCopy(row.id, row.value)}
                  onMouseEnter={() => setHoveredBtn(row.id)}
                  onMouseLeave={() => setHoveredBtn(null)}
                  style={{
                    background: isBtnHovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    borderRadius: '5px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    color: isCopied ? '#34d399' : 'rgba(255,255,255,0.65)',
                    cursor: 'pointer',
                    transition: 'background-color 0.12s ease, color 0.12s ease',
                    outline: 'none',
                    flexShrink: 0,
                  }}
                >
                  {isCopied ? 'Copied ✓' : 'Copy'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Availability Badge Centered Below */}
      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#34d399',
            animation: 'pulseDot 2s infinite ease-in-out',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          Available for remote roles worldwide
        </span>
      </div>
    </div>
  )
}
