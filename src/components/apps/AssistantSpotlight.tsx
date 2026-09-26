'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Check } from 'lucide-react'
import { useWindowStore } from '@/app/store/windowStore'
import { ChatMessage, ActionPill } from '@/lib/agent/types'
import { generateAgentResponse } from '@/lib/agent/engine'
import MarkdownRenderer from './assistant/MarkdownRenderer'
import JDAnalyzerView from './JDAnalyzerView'
import MacSpotlightView from './spotlight/MacSpotlightView'

// ─── Quick Suggestion Chips ───────────────────────────────────────────────────

const SUGGESTIONS = [
  "What's your approach to building reliable pipelines?",
  'Explain your PR Review Agent architecture',
  'What is your tech stack and experience?',
  'Are you open to early-stage remote teams?',
  'Open Terminal and show system info',
]

export default function AssistantSpotlight() {
  const {
    isAssistantOpen,
    closeAssistant,
    assistantInitialPrompt,
    assistantMode,
    setAssistantMode,
    openFinderFile,
    openTerminalCmd,
  } = useWindowStore()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeStreamingText, setActiveStreamingText] = useState('')
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null)
  const [providerInfo, setProviderInfo] = useState<{ hasGroqKey: boolean; model: string }>({
    hasGroqKey: false,
    model: 'Apple Intelligence RAG Engine',
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch status of Groq provider
  useEffect(() => {
    fetch('/api/chat')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.hasGroqKey === 'boolean') {
          setProviderInfo(data)
        }
      })
      .catch(() => {})
  }, [isAssistantOpen])

  const handleCopyMessage = (id: string, text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedMsgId(id)
      setTimeout(() => setCopiedMsgId((cur) => (cur === id ? null : cur)), 2000)
    }
  }

  // Auto focus input when opened
  useEffect(() => {
    if (isAssistantOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)

      // If opened with an initial prompt
      if (assistantInitialPrompt) {
        handleSendMessage(assistantInitialPrompt)
      }
    } else {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
      setIsGenerating(false)
      setActiveStreamingText('')
    }
  }, [isAssistantOpen, assistantInitialPrompt])

  // Global toggle shortcut: Cmd+Space, Ctrl+Space, or Cmd+Shift+A
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault()
        const { isAssistantOpen: open, toggleAssistant } = useWindowStore.getState()
        toggleAssistant()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        const { toggleAssistant } = useWindowStore.getState()
        toggleAssistant()
        return
      }

      if (e.key === 'Escape' && useWindowStore.getState().isAssistantOpen) {
        if (useWindowStore.getState().assistantMode === 'search') {
          return
        }
        e.preventDefault()
        useWindowStore.getState().closeAssistant()
      }
    }

    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeStreamingText])

  // ── Action Pill Executor ───────────────────────────────────────────────────
  const handleExecutePill = (pill: ActionPill) => {
    closeAssistant()
    if (pill.actionType === 'open_file') {
      openFinderFile(pill.payload)
    } else if (pill.actionType === 'open_terminal') {
      openTerminalCmd(pill.payload)
    } else if (pill.actionType === 'contact') {
      window.location.href = `mailto:${pill.payload}?subject=Portfolio%20Inquiry%20from%20Yamin%20AI`
    }
  }

  // ── Send Message ───────────────────────────────────────────────────────────
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim()
    if (!prompt || isGenerating) return

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    }

    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setIsGenerating(true)
    setActiveStreamingText('')

    try {
      // 1. Call API route (which uses Groq Cloud GPT-OSS 120B when configured, or local RAG)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: nextMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.status}`)
      }

      const data = await res.json()
      const fullText: string = data.text || ''

      // Progressive token typing (Apple Intelligence streaming effect)
      let charIndex = 0
      const chunkSize = Math.max(4, Math.floor(fullText.length / 50))
      const interval = setInterval(() => {
        charIndex += chunkSize
        if (charIndex >= fullText.length) {
          clearInterval(interval)
          setIsGenerating(false)
          setActiveStreamingText('')
          setMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              role: 'assistant',
              content: fullText,
              timestamp: Date.now(),
              actionPills: data.actionPills,
              sources: data.sources,
              model: data.model,
            },
          ])
        } else {
          setActiveStreamingText(fullText.slice(0, charIndex))
        }
      }, 16)

      streamIntervalRef.current = interval
    } catch (err) {
      console.warn('Chat API fetch failed, falling back to local semantic engine:', err)
      const localRes = generateAgentResponse(prompt)
      const fullText = localRes.text

      let charIndex = 0
      const chunkSize = Math.max(4, Math.floor(fullText.length / 45))
      const interval = setInterval(() => {
        charIndex += chunkSize
        if (charIndex >= fullText.length) {
          clearInterval(interval)
          setIsGenerating(false)
          setActiveStreamingText('')
          setMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              role: 'assistant',
              content: fullText,
              timestamp: Date.now(),
              actionPills: localRes.actionPills,
              sources: localRes.sources,
              model: 'Local RAG Engine',
            },
          ])
        } else {
          setActiveStreamingText(fullText.slice(0, charIndex))
        }
      }, 16)

      streamIntervalRef.current = interval
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isAssistantOpen) return null

  if (assistantMode === 'search') {
    return <MacSpotlightView />
  }

  return (
    <AnimatePresence>
      <div
        onClick={closeAssistant}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '8vh',
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ type: 'spring', stiffness: 460, damping: 32 }}
          style={{
            position: 'relative',
            width: '680px',
            maxWidth: '92vw',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '24px',
            overflow: 'visible',
          }}
        >
          {/* 1. Ambient Outer Luminous Halo (Apple Intelligence Aura) */}
          <div
            style={{
              position: 'absolute',
              inset: -3,
              borderRadius: '27px',
              background:
                'linear-gradient(135deg, #FF2D55 0%, #FF9500 20%, #34C759 40%, #007AFF 65%, #AF52DE 85%, #FF2D55 100%)',
              backgroundSize: '200% 200%',
              animation: isGenerating
                ? 'apple-glow-flow 3s ease infinite, apple-glow-pulse 2.2s ease-in-out infinite'
                : 'apple-glow-flow 10s ease infinite',
              opacity: isGenerating ? 0.85 : 0.28,
              filter: isGenerating ? 'blur(14px)' : 'blur(8px)',
              pointerEvents: 'none',
              transition: 'all 0.4s ease',
              zIndex: 0,
            }}
          />

          {/* 2. Sleek Hairline Gradient Border */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '24px',
              padding: '1px',
              background:
                'linear-gradient(135deg, rgba(255, 45, 85, 0.7), rgba(255, 149, 0, 0.7), rgba(52, 199, 89, 0.7), rgba(0, 122, 255, 0.8), rgba(175, 82, 222, 0.8))',
              backgroundSize: '200% 200%',
              animation: isGenerating ? 'apple-glow-flow 3s ease infinite' : undefined,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* 3. Main Glass Window Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: 'rgba(22, 22, 26, 0.90)',
              backdropFilter: 'blur(50px) saturate(220%)',
              WebkitBackdropFilter: 'blur(50px) saturate(220%)',
              boxShadow: '0 32px 80px rgba(0, 0, 0, 0.65)',
            }}
          >
            {/* ── Header: Mode Switcher & Controls ─────────────────────────── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              {/* Left: Swirl + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background:
                      'conic-gradient(from 180deg at 50% 50%, #FF2D55 0deg, #FF9500 60deg, #34C759 150deg, #007AFF 240deg, #AF52DE 330deg, #FF2D55 360deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 0 10px rgba(0, 122, 255, 0.4)',
                  }}
                >
                  <div
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: '50%',
                      backgroundColor: '#1c1c20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5">
                      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
                    </svg>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    {assistantMode === 'chat' ? 'Apple Intelligence Spotlight' : 'Role & JD Fit Analyzer'}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: assistantMode === 'chat' ? (providerInfo.hasGroqKey ? '#30d158' : '#5ac8fa') : '#30d158',
                      backgroundColor:
                        assistantMode === 'chat'
                          ? providerInfo.hasGroqKey
                            ? 'rgba(48, 209, 88, 0.16)'
                            : 'rgba(90, 200, 250, 0.14)'
                          : 'rgba(48, 209, 88, 0.14)',
                      border: providerInfo.hasGroqKey ? '0.5px solid rgba(48, 209, 88, 0.35)' : 'none',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      letterSpacing: '0.02em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {assistantMode === 'chat'
                      ? providerInfo.hasGroqKey
                        ? '🟢 Apple Intelligence (Online)'
                        : 'Apple Intelligence'
                      : 'Role Analyzer'}
                  </span>
                </div>
              </div>

              {/* Right: Mode Switcher & ESC */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    padding: '3px',
                    borderRadius: '9px',
                    gap: '2px',
                  }}
                >
                  <button
                    onClick={() => setAssistantMode('search')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '4px 10px',
                      color: 'rgba(255, 255, 255, 0.55)',
                      fontSize: '11.5px',
                      fontWeight: 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>🔍</span>
                    <span>Search</span>
                  </button>

                  <button
                    onClick={() => setAssistantMode('chat')}
                    style={{
                      background: assistantMode === 'chat' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '4px 10px',
                      color: assistantMode === 'chat' ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                      fontSize: '11.5px',
                      fontWeight: assistantMode === 'chat' ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>💬</span>
                    <span>Q&A</span>
                  </button>

                  <button
                    onClick={() => setAssistantMode('jd')}
                    style={{
                      background: assistantMode === 'jd' ? '#007AFF' : 'transparent',
                      border: 'none',
                      borderRadius: '7px',
                      padding: '4px 10px',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontWeight: assistantMode === 'jd' ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                      boxShadow: assistantMode === 'jd' ? '0 2px 8px rgba(0, 122, 255, 0.45)' : 'none',
                    }}
                  >
                    <span>⚡</span>
                    <span>JD Analyzer</span>
                  </button>
                </div>

                <span
                  onClick={closeAssistant}
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.45)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    padding: '3px 7px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  ESC
                </span>
              </div>
            </div>

            {/* ── View Content: JD Analyzer OR Q&A Chat ── */}
            {assistantMode === 'jd' ? (
              <JDAnalyzerView />
            ) : (
              <>
                {/* ── Top Bar / Search Input ───────────────────────────────────────── */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 20px',
                    gap: '14px',
                    borderBottom: messages.length > 0 ? '0.5px solid rgba(255, 255, 255, 0.1)' : 'none',
                    cursor: 'text',
                  }}
                  onClick={() => inputRef.current?.focus()}
                >
                  {/* Search prompt input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Yamin's AI about projects, pipeline reliability, tech stack..."
                    spellCheck={false}
                    autoComplete="off"
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#dedee2',
                      fontSize: '15px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                      fontWeight: 400,
                      letterSpacing: '-0.015em',
                    }}
                  />

                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isGenerating}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: input.trim() && !isGenerating ? '#007AFF' : 'rgba(255, 255, 255, 0.1)',
                      color: input.trim() && !isGenerating ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: input.trim() && !isGenerating ? 'pointer' : 'default',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  </button>
                </div>

          {/* ── Empty State: Quick Suggestion Chips ─────────────────────────── */}
          {messages.length === 0 && !isGenerating && (
            <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Suggested Inquiries
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '0.5px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      color: '#dedee2',
                      fontSize: '13px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
                      e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
                    }}
                  >
                    <span style={{ color: '#007AFF', fontSize: '14px' }}>✦</span>
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Conversation Message Feed ────────────────────────────────────── */}
          {messages.length > 0 && (
            <div
              className="no-scrollbar"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                maxHeight: '56vh',
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '6px',
                  }}
                >
                  {/* Bubble */}
                  <div
                    style={{
                      maxWidth: '90%',
                      padding: msg.role === 'user' ? '10px 16px' : '16px 20px',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      backgroundColor: msg.role === 'user' ? '#007AFF' : 'rgba(255, 255, 255, 0.07)',
                      color: msg.role === 'user' ? '#ffffff' : '#dedee2',
                      fontSize: '14px',
                      lineHeight: 1.55,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      border: msg.role === 'user' ? 'none' : '0.5px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: msg.role === 'user' ? '0 4px 12px rgba(0, 122, 255, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingBottom: '8px',
                          borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
                          marginBottom: '2px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={13} style={{ color: providerInfo.hasGroqKey ? '#30d158' : '#007AFF' }} />
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.01em' }}>
                            Apple Intelligence
                          </span>
                          <span
                            style={{
                              fontSize: '9.5px',
                              color: 'rgba(255, 255, 255, 0.45)',
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              padding: '1px 6px',
                              borderRadius: '6px',
                            }}
                          >
                            {msg.model || (providerInfo.hasGroqKey ? 'Apple Intelligence' : 'Semantic RAG')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          title="Copy response"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'transparent',
                            border: 'none',
                            color: copiedMsgId === msg.id ? '#30d158' : 'rgba(255, 255, 255, 0.45)',
                            cursor: 'pointer',
                            fontSize: '11px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#FFFFFF'
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = copiedMsgId === msg.id ? '#30d158' : 'rgba(255, 255, 255, 0.45)'
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                        >
                          {copiedMsgId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {msg.role === 'user' ? (
                      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</div>
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )}
                  </div>

                  {/* Interactive Action Pills */}
                  {msg.role === 'assistant' && msg.actionPills && msg.actionPills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                      {msg.actionPills.map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => handleExecutePill(pill)}
                          style={{
                            background: 'rgba(0, 122, 255, 0.12)',
                            border: '0.5px solid rgba(0, 122, 255, 0.35)',
                            color: '#5ac8fa',
                            fontSize: '12px',
                            fontWeight: 500,
                            padding: '6px 12px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.25)'
                            e.currentTarget.style.borderColor = '#007AFF'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.12)'
                            e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.35)'
                          }}
                        >
                          <span>
                            {pill.icon === 'finder' && '📁'}
                            {pill.icon === 'terminal' && '⚡'}
                            {pill.icon === 'file' && '📄'}
                            {pill.icon === 'email' && '✉️'}
                          </span>
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sources citation */}
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', paddingLeft: '4px' }}>
                      Sources: {msg.sources.join(', ')}
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming message indicator */}
              {isGenerating && activeStreamingText && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                  <div
                    style={{
                      maxWidth: '90%',
                      padding: '16px 20px',
                      borderRadius: '18px 18px 18px 4px',
                      backgroundColor: 'rgba(255, 255, 255, 0.07)',
                      border: '0.5px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        paddingBottom: '8px',
                        borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
                        marginBottom: '2px',
                      }}
                    >
                      <Sparkles size={13} style={{ color: providerInfo.hasGroqKey ? '#30d158' : '#007AFF' }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
                        Apple Intelligence
                      </span>
                      <span style={{ fontSize: '9.5px', color: 'rgba(255, 255, 255, 0.45)' }}>
                        {providerInfo.hasGroqKey ? 'Groq LPU streaming...' : 'generating...'}
                      </span>
                    </div>
                    <div>
                      <MarkdownRenderer content={activeStreamingText} />
                      <span
                        style={{
                          display: 'inline-block',
                          width: 7,
                          height: 14,
                          marginLeft: 3,
                          backgroundColor: '#007AFF',
                          animation: 'blink 0.8s infinite',
                          verticalAlign: 'middle',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Thinking loader */}
              {isGenerating && !activeStreamingText && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '12px 16px',
                    borderRadius: '18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    width: 'fit-content',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Yamin AI thinking</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#007AFF', animation: 'blink 1s infinite' }} />
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#5ac8fa', animation: 'blink 1s 0.2s infinite' }} />
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#af52de', animation: 'blink 1s 0.4s infinite' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
          </>
        )}

        {/* ── Footer Bar: Hints & Controls ─────────────────────────────────── */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '0.5px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.35)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>⌥ Space: Toggle</span>
            {assistantMode === 'chat' && <span>↵ Send</span>}
            <span>Esc Close</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: providerInfo.hasGroqKey ? '#30d158' : '#5ac8fa',
                boxShadow: providerInfo.hasGroqKey ? '0 0 8px rgba(48, 209, 88, 0.6)' : 'none',
              }}
            />
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {assistantMode === 'chat'
                ? providerInfo.hasGroqKey
                  ? 'Apple Intelligence Neural Engine Active'
                  : 'Apple Intelligence RAG Engine Active'
                : 'Semantic JD Matcher Active'}
            </span>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
  )
}
