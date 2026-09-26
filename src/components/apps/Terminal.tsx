'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useWindowContext } from '@/app/components/os/Window'
import { useWindowStore } from '@/app/store/windowStore'
import { TerminalLine, TerminalTheme, TERMINAL_THEMES } from './terminal/types'
import { executeCommand, resolveNode } from './terminal/commands'
import MatrixRain from './terminal/MatrixRain'
import Screensaver from './terminal/Screensaver'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'

export default function Terminal() {
  const windowContext = useWindowContext()
  const { openWindow, terminalPendingCmd, clearTerminalPendingCmd, isAssistantOpen } = useWindowStore()

  // ── Terminal States ────────────────────────────────────────────────────────
  const [cwd, setCwd] = useState<string>('~')
  const [theme, setTheme] = useState<TerminalTheme>('apple')
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState<number>(-1)
  const [isMatrixActive, setIsMatrixActive] = useState(false)
  const [isScreensaverActive, setIsScreensaverActive] = useState(false)
  const [isFocused, setIsFocused] = useState(true)

  // ── Responsive Dimensions & Text Sizing ────────────────────────────────────
  const [terminalDimensions, setTerminalDimensions] = useState({
    cols: 80,
    rows: 24,
    fontSize: 15,
  })
  const [userZoomOffset, setUserZoomOffset] = useState<number>(0)

  const terminalRootRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastActiveRef = useRef<number>(Date.now())

  const colors = TERMINAL_THEMES[theme] || TERMINAL_THEMES.apple

  // Responsive font scaling on window resize:
  useEffect(() => {
    const el = terminalRootRef.current
    if (!el) return

    const updateSize = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return

      // Responsive font size:
      // ~450px: 13.5px
      // ~700px: 15px (comfortable macOS default)
      // ~1000px: 16.5px
      // ~1300px+: 18px
      const baseFont = 13.2 + Math.max(0, width - 400) * (5.2 / 850)
      const clampedFont = Math.min(18.5, Math.max(13, Math.round(baseFont * 10) / 10))

      const charWidth = clampedFont * 0.602
      const lineHeight = clampedFont * 1.45
      const cols = Math.max(40, Math.floor((width - 24) / charWidth))
      const rows = Math.max(12, Math.floor((height - 46) / lineHeight))

      setTerminalDimensions({
        cols,
        rows,
        fontSize: clampedFont,
      })
    }

    const rect = el.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      updateSize(rect.width, rect.height)
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        updateSize(width, height)
      }
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Welcome Banner ─────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_terminal_history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        // ignore
      }
    }

    const now = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    setLines([
      {
        id: 'boot-1',
        type: 'system',
        content: `Last login: ${now} ${time} on ttys002`,
      },
      {
        id: 'boot-2',
        type: 'system',
        content: `Type 'help' to see available commands or 'neofetch' for system details.`,
      },
    ])
  }, [])

  // ── Auto Scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }
    scrollToBottom()
    const rId = requestAnimationFrame(scrollToBottom)
    const tId = setTimeout(scrollToBottom, 40)
    return () => {
      cancelAnimationFrame(rId)
      clearTimeout(tId)
    }
  }, [lines, inputValue])

  // ── Idle Screensaver (90s) ─────────────────────────────────────────────────
  useEffect(() => {
    const checkIdle = setInterval(() => {
      if (Date.now() - lastActiveRef.current > 90000 && !isScreensaverActive && !isMatrixActive) {
        setIsScreensaverActive(true)
      }
    }, 5000)

    return () => clearInterval(checkIdle)
  }, [isScreensaverActive, isMatrixActive])

  const registerActivity = () => {
    lastActiveRef.current = Date.now()
  }

  // ── Robust Auto-Focus Management ──────────────────────────────────────────
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      setIsFocused(true)
    }
  }, [])

  // Auto-focus on mount with slight delay for window animations
  useEffect(() => {
    const timer = setTimeout(() => {
      focusInput()
    }, 120)
    return () => clearTimeout(timer)
  }, [focusInput])

  // Auto-focus whenever the window becomes active
  useEffect(() => {
    if (windowContext?.isActive) {
      focusInput()
    }
  }, [windowContext?.isActive, focusInput])

  // ── Prompt Path Formatter ──────────────────────────────────────────────────
  const formatPromptPath = (pathStr: string) => {
    if (pathStr === '~') return '~'
    if (pathStr === '/') return '/'
    return pathStr.replace(/^~\//, '')
  }

  // ── Execute Command ────────────────────────────────────────────────────────
  const handleRunCommand = (cmdText: string) => {
    registerActivity()
    const trimmed = cmdText.trim()

    // Add command line to buffer
    const cmdLineId = Math.random().toString()
    const currentPath = cwd

    if (!trimmed) {
      setLines((prev) => [
        ...prev,
        {
          id: cmdLineId,
          type: 'command',
          cwd: currentPath,
          content: cmdText,
          timestamp: Date.now(),
        },
      ])
      setInputValue('')
      return
    }

    // Save to history
    const nextHistory = [...history, trimmed]
    setHistory(nextHistory)
    setHistoryIdx(-1)
    try {
      localStorage.setItem('portfolio_terminal_history', JSON.stringify(nextHistory.slice(-100)))
    } catch {
      // ignore
    }

    // Direct fast-path for clear
    if (trimmed === 'clear') {
      setLines([])
      setInputValue('')
      return
    }

    soundEngine.play('keyclick')
    let cleared = false
    // Run interpreter
    const outputLines = executeCommand(trimmed, {
      cwd,
      setCwd,
      theme,
      setTheme,
      commandHistory: nextHistory,
      clearBuffer: () => {
        cleared = true
        setLines([])
      },
      openWindow: (appId) => {
        openWindow({
          id: appId,
          title: appId.charAt(0).toUpperCase() + appId.slice(1),
          isOpen: true,
          isMinimized: false,
          position: { x: 180, y: 90 },
          size: { width: 720, height: 480 },
        })
      },
      startMatrix: () => setIsMatrixActive(true),
      startScreensaver: () => setIsScreensaverActive(true),
    })

    if (cleared) {
      setInputValue('')
      return
    }

    setLines((prev) => [
      ...prev,
      {
        id: cmdLineId,
        type: 'command',
        cwd: currentPath,
        content: cmdText,
        timestamp: Date.now(),
      },
      ...outputLines,
    ])
    setInputValue('')
  }

  // ── Pending Command Execution (from Spotlight Action Pills) ────────────────
  useEffect(() => {
    if (terminalPendingCmd) {
      const cmd = terminalPendingCmd
      clearTerminalPendingCmd()
      setTimeout(() => {
        handleRunCommand(cmd)
      }, 150)
    }
  }, [terminalPendingCmd])

  // ── Active Window Keystroke Redirection ────────────────────────────────────
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only capture if this terminal is the active window and assistant is closed
      if (!windowContext?.isActive || isAssistantOpen) return

      // Don't intercept if user is actively focused in another input/textarea
      const target = e.target as HTMLElement | null
      if (
        target &&
        target !== inputRef.current &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      ) {
        return
      }

      // If already focused inside the terminal input, let native handling proceed
      if (document.activeElement === inputRef.current) return

      // Ignore shortcuts with meta/alt (e.g. Cmd+Space, Alt+Tab)
      if (e.metaKey || e.altKey) return

      // Focus input immediately
      focusInput()

      // If user typed a printable character or backspace or enter, capture it directly!
      if (e.key.length === 1 && !e.ctrlKey) {
        e.preventDefault()
        setInputValue((prev) => prev + e.key)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        setInputValue((prev) => prev.slice(0, -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleRunCommand(inputValue)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [windowContext?.isActive, isAssistantOpen, inputValue, focusInput])

  // ── Tab Autocompletion ─────────────────────────────────────────────────────
  const handleTabCompletion = () => {
    registerActivity()
    if (!inputValue.trim()) return

    const parts = inputValue.split(' ')
    const lastWord = parts[parts.length - 1]

    if (parts.length === 1) {
      // Complete command names
      const commands = [
        'ls',
        'cd',
        'cat',
        'pwd',
        'neofetch',
        'man',
        'git',
        'whoami',
        'help',
        'date',
        'echo',
        'contact',
        'sudo',
        'matrix',
        'screensaver',
        'cowsay',
        'theme',
        'open',
        'clear',
        'history',
      ]
      const match = commands.filter((c) => c.startsWith(lastWord.toLowerCase()))
      if (match.length === 1) {
        setInputValue(match[0] + ' ')
      }
    } else {
      // Complete directory or file names
      const { node } = resolveNode(cwd, cwd)
      if (node && node.type === 'folder') {
        const children = node.children.map((c) => c.name)
        const match = children.filter((name) => name.toLowerCase().startsWith(lastWord.toLowerCase()))
        if (match.length === 1) {
          parts[parts.length - 1] = match[0]
          setInputValue(parts.join(' ') + ' ')
        }
      }
    }
  }

  // ── Keyboard Handlers ──────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    registerActivity()

    // Tab autocomplete
    if (e.key === 'Tab') {
      e.preventDefault()
      handleTabCompletion()
      return
    }

    // History up
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(nextIdx)
      setInputValue(history[nextIdx] || '')
      return
    }

    // History down
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx === -1) return
      const nextIdx = historyIdx + 1
      if (nextIdx >= history.length) {
        setHistoryIdx(-1)
        setInputValue('')
      } else {
        setHistoryIdx(nextIdx)
        setInputValue(history[nextIdx] || '')
      }
      return
    }

    // Ctrl + C: Cancel line
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setLines((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          type: 'command',
          cwd,
          content: `${inputValue}^C`,
        },
      ])
      setInputValue('')
      setHistoryIdx(-1)
      return
    }

    // Cmd + K (macOS) or Ctrl + L / Ctrl + K: Clear buffer
    if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'l') || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault()
      setLines([])
      return
    }

    // Ctrl + U: Clear current line
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      setInputValue('')
      return
    }

    // Zoom in: Cmd + '+' or Cmd + '=' or Ctrl + '+' / '='
    if ((e.metaKey || e.ctrlKey) && (e.key === '+' || e.key === '=')) {
      e.preventDefault()
      setUserZoomOffset((prev) => Math.min(8, prev + 1))
      return
    }

    // Zoom out: Cmd + '-' or Ctrl + '-'
    if ((e.metaKey || e.ctrlKey) && e.key === '-') {
      e.preventDefault()
      setUserZoomOffset((prev) => Math.max(-4, prev - 1))
      return
    }

    // Reset zoom: Cmd + '0' or Ctrl + '0'
    if ((e.metaKey || e.ctrlKey) && e.key === '0') {
      e.preventDefault()
      setUserZoomOffset(0)
      return
    }

    // Enter
    if (e.key === 'Enter') {
      e.preventDefault()
      handleRunCommand(inputValue)
    }
  }

  const effectiveFontSize = Math.min(24, Math.max(12, terminalDimensions.fontSize + userZoomOffset))
  const cursorWidth = Math.max(8, Math.round(effectiveFontSize * 0.58))
  const cursorHeight = Math.round(effectiveFontSize * 1.15)
  const lineMinHeight = Math.round(effectiveFontSize * 1.45)

  return (
    <div
      ref={terminalRootRef}
      onClick={focusInput}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('button')) return
        focusInput()
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: '-apple-system-monospaced, "SF Mono", Monaco, Menlo, Consolas, "Cascadia Mono", monospace',
        fontSize: effectiveFontSize,
        lineHeight: 1.45,
        letterSpacing: '-0.012em',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        textShadow: theme === 'apple' ? '0 0 0.75px rgba(220, 220, 225, 0.22)' : undefined,
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'text',
      }}
    >
      {/* ─── 1. INTEGRATED MACOS TITLE BAR (1:1 with Reference Image) ──────────── */}
      <div
        onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
        onDoubleClick={() => windowContext?.toggleMaximize()}
        style={{
          height: 38,
          minHeight: 38,
          backgroundColor: colors.titleBg,
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          boxSizing: 'border-box',
          cursor: 'default',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        {/* Left: Traffic Lights */}
        <TrafficLights dimWhenInactive={true} gap={7.5} />


        {/* Center: Blue Folder Icon + Title (Exact match: yamin — -zsh — 80×24) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            pointerEvents: 'none',
          }}
        >
          {/* Blue folder icon */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#007AFF">
            <path d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" />
          </svg>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              color: windowContext?.isActive ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '-0.01em',
            }}
          >
            yamin &mdash; -zsh &mdash; {terminalDimensions.cols}&times;{terminalDimensions.rows}
          </span>
        </div>

        {/* Right: Window Split Icon (⊞ from macOS Terminal screenshot) */}
        <div style={{ display: 'flex', alignItems: 'center', opacity: 0.5, cursor: 'default' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="2" y="2" width="12" height="12" rx="1.5" />
            <line x1="8" y1="2" x2="8" y2="14" />
          </svg>
        </div>
      </div>

      {/* ─── 2. TERMINAL BODY BUFFER ─────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="no-scrollbar"
        onClick={focusInput}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return
          focusInput()
        }}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          cursor: 'text',
        }}
      >
        {/* Render History Lines */}
        {lines.map((line) => {
          if (line.type === 'command') {
            return (
              <div key={line.id} style={{ display: 'flex', alignItems: 'flex-start', wordBreak: 'break-all', minHeight: lineMinHeight, flexShrink: 0 }}>
                <span style={{ color: colors.promptUser, fontWeight: 400, whiteSpace: 'pre', flexShrink: 0, marginRight: '8px' }}>
                  yamin@Yamins-MacBook-Air {formatPromptPath(line.cwd || '~')} %
                </span>
                <span style={{ color: colors.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {typeof line.content === 'string' ? line.content : line.content}
                </span>
              </div>
            )
          }

          if (line.type === 'error') {
            return (
              <div key={line.id} style={{ color: '#ff6b6b', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: lineMinHeight, flexShrink: 0 }}>
                {typeof line.content === 'string' ? line.content : line.content}
              </div>
            )
          }

          if (line.type === 'system') {
            return (
              <div key={line.id} style={{ color: 'rgba(215, 215, 220, 0.65)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: lineMinHeight, flexShrink: 0 }}>
                {typeof line.content === 'string' ? line.content : line.content}
              </div>
            )
          }

          // Normal output
          return (
            <div key={line.id} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: colors.text, opacity: 0.92, flexShrink: 0, minHeight: 'fit-content' }}>
              {typeof line.content === 'string' ? line.content : line.content}
            </div>
          )
        })}

        {/* Active Input Line (Exact match to prompt: yamin@Yamins-MacBook-Air ~ %) */}
        <div
          onClick={focusInput}
          onPointerDown={focusInput}
          style={{ display: 'flex', alignItems: 'center', position: 'relative', minHeight: lineMinHeight, flexShrink: 0, cursor: 'text' }}
        >
          <span style={{ color: colors.promptUser, fontWeight: 400, whiteSpace: 'pre', flexShrink: 0, marginRight: '8px' }}>
            yamin@Yamins-MacBook-Air {formatPromptPath(cwd)} %
          </span>

          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              minHeight: lineMinHeight,
            }}
          >
            <span style={{ whiteSpace: 'pre', color: colors.text }}>
              {inputValue}
            </span>

            {/* Apple Terminal Cursor: Solid Blinking Block when active, Hollow Outline when inactive */}
            <span
              style={{
                display: 'inline-block',
                width: cursorWidth,
                height: cursorHeight,
                backgroundColor: isFocused && windowContext?.isActive ? colors.cursor : 'transparent',
                border: isFocused && windowContext?.isActive ? 'none' : `1px solid ${colors.cursor}`,
                boxSizing: 'border-box',
                animation: isFocused && windowContext?.isActive ? 'blink 1.05s steps(1) infinite' : 'none',
                boxShadow: theme === 'apple' && isFocused && windowContext?.isActive ? '0 0 2px rgba(220, 220, 225, 0.2)' : undefined,
                verticalAlign: 'middle',
                borderRadius: 0.5,
              }}
            />

            {/* Hidden Input Layer for native keyboard handling */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'text',
                zIndex: 2,
                fontSize: effectiveFontSize,
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── 3. EASTER EGGS OVERLAYS ─────────────────────────────────────────── */}
      {isMatrixActive && <MatrixRain onClose={() => setIsMatrixActive(false)} />}
      {isScreensaverActive && <Screensaver onDismiss={() => setIsScreensaverActive(false)} />}

      {/* Cursor Blink Style */}
      <style jsx global>{`
        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
