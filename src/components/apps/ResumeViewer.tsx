'use client'

import React, { useState, useRef } from 'react'
import { Download, Printer, ZoomIn, ZoomOut, Share2, ExternalLink, Mail, Phone, MapPin, Check } from 'lucide-react'
import { useWindowContext } from '@/app/components/os/Window'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'

export default function ResumeViewer() {
  const windowContext = useWindowContext()
  const [zoom, setZoom] = useState(1.0)
  const [isCopied, setIsCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const documentRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    soundEngine.play('pop')
    setIsDownloading(true)

    // Trigger printable / download view or direct download
    const link = document.createElement('a')
    link.href = '/Yamin_Hossain_Resume.pdf'
    link.download = 'Yamin_Hossain_Resume.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => setIsDownloading(false), 1200)
  }

  const handlePrint = () => {
    soundEngine.play('click')
    window.print()
  }

  const handleShare = () => {
    soundEngine.play('click')
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/?app=resume')
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#525659',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ─── macOS Titlebar (matching reference image) ────────────────────── */}
      <div
        onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
        style={{
          height: 44,
          backgroundColor: '#EBECEF',
          borderBottom: '1px solid #D5D7DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          flexShrink: 0,
        }}
      >
        {/* Left: Traffic Lights */}
        <TrafficLights />

        {/* Center: Window Title (Resume.pdf) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#1D1D1F',
              letterSpacing: '-0.01em',
            }}
          >
            Resume.pdf
          </span>
          <span style={{ fontSize: 11, color: '#8E8E93' }}>— Page 1 of 1</span>
        </div>

        {/* Right: Actions (Zoom, Print, Download) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Zoom Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: 6,
              padding: '2px 4px',
              gap: 2,
            }}
          >
            <button
              onClick={() => setZoom((prev) => Math.max(0.7, prev - 0.1))}
              title="Zoom Out"
              style={{
                border: 'none',
                background: 'transparent',
                padding: '2px 4px',
                cursor: 'pointer',
                color: '#4A4C52',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: 10.5, minWidth: 32, textAlign: 'center', color: '#4A4C52' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(1.4, prev + 0.1))}
              title="Zoom In"
              style={{
                border: 'none',
                background: 'transparent',
                padding: '2px 4px',
                cursor: 'pointer',
                color: '#4A4C52',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            title="Print Resume (⌘P)"
            style={{
              width: 28,
              height: 26,
              borderRadius: 6,
              border: 'none',
              backgroundColor: 'transparent',
              color: '#4A4C52',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Printer size={15} />
          </button>

          {/* Share Link Button */}
          <button
            onClick={handleShare}
            title="Copy Resume Link"
            style={{
              width: 28,
              height: 26,
              borderRadius: 6,
              border: 'none',
              backgroundColor: 'transparent',
              color: isCopied ? '#34C759' : '#4A4C52',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {isCopied ? <Check size={15} /> : <Share2 size={15} />}
          </button>

          {/* DOWNLOAD BUTTON (Exact match to reference image icon!) */}
          <button
            onClick={handleDownload}
            title="Download Yamin_Hossain_Resume.pdf"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid rgba(0, 122, 255, 0.4)',
              backgroundColor: '#007AFF',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 122, 255, 0.3)',
              transition: 'transform 0.1s ease, background-color 0.15s ease',
            }}
          >
            <Download size={14} strokeWidth={2.4} />
            <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
          </button>
        </div>
      </div>

      {/* ─── Document View Canvas ─────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '24px 16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <div
          ref={documentRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease',
            width: '740px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.2)',
            padding: '48px 52px',
            color: '#111827',
            fontFamily: '"Times New Roman", Times, Georgia, serif',
            userSelect: 'text',
            lineHeight: 1.42,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                margin: '0 0 4px 0',
                color: '#111827',
                fontFamily: '"Times New Roman", Times, Georgia, serif',
              }}
            >
              Yamin Hossain
            </h1>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#1F2937',
                marginBottom: 6,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              AI-Native Software Engineer | LangGraph
            </div>
            <div
              style={{
                fontSize: '12.5px',
                color: '#4B5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              <span>Rajshahi, Bangladesh</span>
              <span>•</span>
              <span>+880-01706960268</span>
              <span>•</span>
              <a
                href="mailto:contact@yamin.dev"
                style={{ color: '#0A84FF', textDecoration: 'none' }}
                onClick={() => soundEngine.play('click')}
              >
                Email
              </a>
              <span>•</span>
              <a
                href="https://linkedin.com/in/yamin"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#0A84FF', textDecoration: 'none' }}
                onClick={() => soundEngine.play('click')}
              >
                LinkedIn
              </a>
              <span>•</span>
              <a
                href="https://github.com/yamin"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#0A84FF', textDecoration: 'none' }}
                onClick={() => soundEngine.play('click')}
              >
                GitHub
              </a>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: '#D1D5DB', margin: '10px 0 12px 0' }} />

          {/* Summary */}
          <p
            style={{
              fontSize: '12.5px',
              color: '#374151',
              margin: '0 0 16px 0',
              fontStyle: 'italic',
              lineHeight: 1.5,
              fontFamily: '"Times New Roman", Times, Georgia, serif',
            }}
          >
            AI-Native Software Engineer specializing in production LLM agents, LangGraph pipelines, and RAG systems. Ships complete products end-to-end with production reliability practices async queuing, exponential backoff, and observable multi-agent pipelines. Ready to own hard problems from day one on early-stage remote teams.
          </p>

          {/* SECTION: SKILLS */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#111827',
                borderBottom: '1px solid #111827',
                paddingBottom: 2,
                marginBottom: 6,
                letterSpacing: '0.04em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              SKILLS
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.55, color: '#1F2937', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
              <div>
                <strong>AI & Agents:</strong> LangGraph · LangChain · RAG pipeline · pgvector · Prompt Engineering · Tool Calling · Guardrails
              </div>
              <div>
                <strong>Frontend:</strong> React.js • Next.js • TypeScript • Tailwind CSS • HTML • CSS • Zustand
              </div>
              <div>
                <strong>Backend:</strong> Python • FastAPI • Node.js • Express.js • TypeScript • BullMQ • REST APIs • WebSocket • SSE
              </div>
              <div>
                <strong>Databases:</strong> PostgreSQL • Prisma ORM • Redis • Neon • MySQL
              </div>
              <div>
                <strong>Infrastructure:</strong> Docker · Vercel · Render · Turborepo · Git & GitHub · CI/CD pipeline
              </div>
            </div>
          </div>

          {/* SECTION: PROJECTS */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#111827',
                borderBottom: '1px solid #111827',
                paddingBottom: 2,
                marginBottom: 8,
                letterSpacing: '0.04em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              PROJECTS
            </div>

            {/* Project 1: PR Review Agent */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                  PR REVIEW AGENT — Full Stack Web Application
                </span>
                <span style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#4B5563' }}>
                  June 2026 – Present
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#0A84FF', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                Personal Project | Live Demo | GitHub | Project Video
              </div>
              <ul style={{ margin: '0 0 6px 0', paddingLeft: '18px', fontSize: '11.5px', color: '#374151', lineHeight: 1.5 }}>
                <li>
                  Built a GitHub App (Marketplace-installable) that ingests 6 months of merged PR history and posts inline review comments referencing specific past decisions not generic rules making team knowledge searchable and persistent.
                </li>
                <li>
                  Designed a 6-node LangGraph pipeline with chunked diff processing and pgvector cosine similarity search across 384-dimensional embeddings, surfacing decisions like &ldquo;your team rejected this pattern in PR #234&rdquo; with similarity scores.
                </li>
                <li>
                  Architected webhook → BullMQ/Redis queue → FastAPI inference layer → Next.js dashboard with exponential backoff, rollback handling, and structured logging for incident traceability.
                </li>
              </ul>
              <div style={{ fontSize: '11px', color: '#4B5563', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                <strong>Tech:</strong> Next.js · TypeScript · Node.js · Express.js · Python · FastAPI · LangGraph · LangChain · pgvector · PostgreSQL · Prisma · BullMQ · Redis · Docker
              </div>
            </div>

            {/* Project 2: Bug Reproducer */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                  BUG REPRODUCER — Autonomous End-to-End Debugging API Service
                </span>
                <span style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#4B5563' }}>
                  February 2026 – Present
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#0A84FF', marginBottom: 4, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                Personal Project | Live Demo | GitHub
              </div>
              <ul style={{ margin: '0 0 6px 0', paddingLeft: '18px', fontSize: '11.5px', color: '#374151', lineHeight: 1.5 }}>
                <li>
                  Built an autonomous agent that takes a GitHub issue URL, reproduces the bug, writes a failing test, generates a fix, and opens a PR completing the full debugging cycle without human intervention.
                </li>
                <li>
                  Designed a 7-node LangGraph pipeline with conditional retry logic: when a test fails for the wrong reason, the agent parses the error output and rewrites the test using that context rather than retrying blindly.
                </li>
              </ul>
              <div style={{ fontSize: '11px', color: '#4B5563', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                <strong>Tech:</strong> Next.js · TypeScript · Node.js · Express.js · Python · FastAPI · LangChain · LangGraph · PostgreSQL · Prisma · BullMQ · Docker
              </div>
            </div>
          </div>

          {/* SECTION: CONTRIBUTION */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#111827',
                borderBottom: '1px solid #111827',
                paddingBottom: 2,
                marginBottom: 8,
                letterSpacing: '0.04em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              CONTRIBUTION
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#111827', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                Remotion — React framework for programmatic video creation (52.6k+ GitHub stars)
              </span>
              <span style={{ fontSize: '11px', color: '#0A84FF', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                remotion.dev | GitHub
              </span>
            </div>
            <ul style={{ margin: '0 0 6px 0', paddingLeft: '18px', fontSize: '11.5px', color: '#374151', lineHeight: 1.5 }}>
              <li>
                Added preserveSilence option to renderMediaOnWeb(), ensuring silent head/tail frames are retained in the output file fixing timing misalignment when feeding exports into ASR transcription pipelines. Included regression test verifying a 5s composition always produces exactly 5s output regardless of silent segments. (PR #7074).
              </li>
              <li>
                Extended playbackRate validation in @remotion/player from ±4 to ±10 to match modern browser capabilities updated validation logic, API documentation, and unit tests (18 passing). (PR #7107).
              </li>
            </ul>
            <div style={{ fontSize: '11px', color: '#4B5563', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
              <strong>Tech:</strong> TypeScript · React · Web Audio API · Bun
            </div>
          </div>

          {/* SECTION: EDUCATION */}
          <div>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#111827',
                borderBottom: '1px solid #111827',
                paddingBottom: 2,
                marginBottom: 8,
                letterSpacing: '0.04em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >
              EDUCATION
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#111827', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
                Varendra University
              </span>
              <span style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#4B5563' }}>
                Oct 2022 – Mar 2026
              </span>
            </div>
            <div style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#374151' }}>
              Bachelor of Engineering — Electrical and Electronic Engineering
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
