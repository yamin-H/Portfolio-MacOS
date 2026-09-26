'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Sparkles,
  Cloud,
  Folder as FolderIconLucide,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Sliders,
  Calculator as CalcIcon,
  Globe,
  Maximize2,
  ChevronRight,
} from 'lucide-react'
import { useWindowStore } from '@/app/store/windowStore'
import { soundEngine } from '@/lib/sound/soundEngine'
import {
  querySpotlight,
  SpotlightItem,
  SPOTLIGHT_APPLICATIONS,
} from './spotlightEngine'

// ─── Authentic macOS Blue Folder Icon Component ──────────────────────────────
function MacOSFolderIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0, 110, 230, 0.25))' }}
    >
      <defs>
        <linearGradient id="folderBackGrad" x1="24" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#25A5FF" />
          <stop offset="100%" stopColor="#0072E5" />
        </linearGradient>
        <linearGradient id="folderFrontGrad" x1="24" y1="14" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#48B8FF" />
          <stop offset="30%" stopColor="#1E9BFF" />
          <stop offset="100%" stopColor="#006CD9" />
        </linearGradient>
        <linearGradient id="folderTabGrad" x1="12" y1="7" x2="12" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#30ACFF" />
          <stop offset="100%" stopColor="#0F8BFA" />
        </linearGradient>
      </defs>
      {/* Back Plate */}
      <path
        d="M6 11C6 8.79086 7.79086 7 10 7H18.5C20.0913 7 21.6174 7.63214 22.7426 8.75736L25 11H38C40.2091 11 42 12.7909 42 15V37C42 39.2091 40.2091 41 38 41H10C7.79086 41 6 39.2091 6 37V11Z"
        fill="url(#folderBackGrad)"
      />
      {/* Tab Highlight */}
      <path
        d="M10 7H18.5C19.5609 7 20.5783 7.42143 21.3284 8.17157L23.1569 10H10C8.34315 10 7 11.3431 7 13V11C7 8.79086 8.79086 7 10 7Z"
        fill="url(#folderTabGrad)"
      />
      {/* Front Flap */}
      <path
        d="M5 16C5 14.3431 6.34315 13 8 13H40C41.6569 13 43 14.3431 43 16V36C43 38.7614 40.7614 41 38 41H10C7.23858 41 5 38.7614 5 36V16Z"
        fill="url(#folderFrontGrad)"
      />
      {/* Top Rim Sheen */}
      <path
        d="M8 13.5H40C41.3807 13.5 42.5 14.6193 42.5 16V16.5C42.5 15.1193 41.3807 14 40 14H8C6.61929 14 5.5 15.1193 5.5 16.5V16C5.5 14.6193 6.61929 13.5 8 13.5Z"
        fill="#FFFFFF"
        fillOpacity="0.45"
      />
    </svg>
  )
}

// ─── Filter Suggestion Chips (Matches User Reference Image Exact Set) ─────────
const SUGGESTION_CHIPS = [
  { id: 'keynote', label: 'Keynote' },
  { id: 'pages', label: 'Pages' },
  { id: 'folders', label: 'Folders' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'preview', label: 'Preview' },
  { id: 'screenshot', label: 'Screenshot' },
]

export default function MacSpotlightView() {
  const {
    closeAssistant,
    setAssistantMode,
    openFinderFile,
    openTerminalCmd,
    openApp,
    appearanceMode,
  } = useWindowStore()

  const isDark = appearanceMode === 'dark'

  // Search States
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState<string | null>('iCloud Drive') // Default scope matching reference screenshot!
  const [activeChip, setActiveChip] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [quickLookItem, setQuickLookItem] = useState<SpotlightItem | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Query results from engine
  const items = useMemo(() => {
    return querySpotlight({
      query,
      scope,
      filterCategory: activeChip || 'all',
    })
  }, [query, scope, activeChip])

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  // Auto-scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Execute selected item
  const handleExecuteItem = (item: SpotlightItem) => {
    if (!item) return

    soundEngine.play('pop')

    if (item.actionType === 'scope_folder') {
      // Sets folder as scope pill, matching the reference screenshot!
      setScope(item.payload.folderName)
      setQuery('')
      setSelectedIndex(0)
      inputRef.current?.focus()
      return
    }

    closeAssistant()

    switch (item.actionType) {
      case 'open_app':
        openApp(item.payload.appId)
        break
      case 'open_finder':
        openFinderFile(item.payload.path)
        break
      case 'open_photo':
        openApp('photos')
        break
      case 'open_setting':
        openApp('settings')
        break
      case 'copy_calc':
        if (navigator?.clipboard) {
          navigator.clipboard.writeText(item.payload.value)
          soundEngine.play('chime')
        }
        break
      case 'open_web':
        window.open(item.payload.url, '_blank')
        break
      case 'ask_ai':
        setAssistantMode('chat')
        break
    }
  }

  // Global & Local Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      soundEngine.play('click')
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev))
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      soundEngine.play('click')
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      const selectedItem = items[selectedIndex]
      if (selectedItem && selectedItem.iconType === 'folder') {
        soundEngine.play('pop')
        setScope(selectedItem.title)
        setQuery('')
        setSelectedIndex(0)
        return
      }
      // If not a folder, cycle suggestion chips
      const currIdx = SUGGESTION_CHIPS.findIndex((c) => c.id === activeChip)
      const nextIdx = (currIdx + 1) % SUGGESTION_CHIPS.length
      setActiveChip(SUGGESTION_CHIPS[nextIdx].id)
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      const selectedItem = items[selectedIndex]
      if (selectedItem) {
        handleExecuteItem(selectedItem)
      }
      return
    }

    if (e.key === 'Backspace' && query === '' && scope !== null) {
      e.preventDefault()
      soundEngine.play('click')
      setScope(null)
      return
    }

    if (e.key === ' ' && (e.metaKey || e.ctrlKey || query === '')) {
      const selectedItem = items[selectedIndex]
      if (selectedItem && (selectedItem.iconType === 'image' || selectedItem.iconType === 'doc')) {
        e.preventDefault()
        soundEngine.play('chime')
        setQuickLookItem((prev) => (prev ? null : selectedItem))
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      if (quickLookItem) {
        setQuickLookItem(null)
        return
      }
      if (query !== '') {
        setQuery('')
        return
      }
      closeAssistant()
    }
  }

  // Dynamic right action hint text
  const currentActionHint = useMemo(() => {
    const selectedItem = items[selectedIndex]
    if (!selectedItem) return '— Open'
    if (selectedItem.actionType === 'copy_calc') return '— Copy'
    if (selectedItem.actionType === 'scope_folder') return '— Search'
    if (selectedItem.actionType === 'ask_ai') return '— Ask AI'
    if (selectedItem.actionType === 'open_web') return '— Search Web'
    return '— Open'
  }, [items, selectedIndex])

  return (
    <div
      onClick={closeAssistant}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '14vh',
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -12 }}
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        style={{
          position: 'relative',
          width: '660px',
          maxWidth: '92vw',
          borderRadius: '22px',
          backgroundColor: isDark ? 'rgba(32, 32, 36, 0.84)' : 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(50px) saturate(190%)',
          WebkitBackdropFilter: 'blur(50px) saturate(190%)',
          boxShadow: isDark
            ? '0 28px 72px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.18)'
            : '0 24px 64px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.15)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(255, 255, 255, 0.65)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          contain: 'paint',
          isolation: 'isolate',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          userSelect: 'none',
        }}
      >
        {/* ─── 1. TOP SEARCH BAR (Exact Match to User Reference Screenshot) ──── */}
        <div
          style={{
            height: 56,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* Magnifying Glass Icon */}
          <Search size={21} color={isDark ? 'rgba(255, 255, 255, 0.6)' : '#8E8E93'} style={{ flexShrink: 0 }} />

          {/* Scope Token Pill (e.g. [ ☁️ iCloud Drive ] or [ 📁 iDownloadBlog ]) */}
          {scope && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px 3px 6px',
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.07)',
                fontSize: 13,
                fontWeight: 600,
                color: isDark ? '#FFFFFF' : '#1D1D1F',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
              }}
            >
              {scope.toLowerCase().includes('icloud') ? (
                <Cloud size={14} color="#007AFF" fill="#007AFF" />
              ) : (
                <FolderIconLucide size={14} color="#007AFF" fill="#007AFF" />
              )}
              <span>{scope}</span>
              <button
                onClick={() => {
                  soundEngine.play('click')
                  setScope(null)
                  inputRef.current?.focus()
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '0 0 0 2px',
                  cursor: 'pointer',
                  color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#8E8E93',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Search Query Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={scope ? `Search in ${scope}` : 'Spotlight Search'}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: 19,
              fontWeight: 500,
              color: isDark ? '#FFFFFF' : '#1D1D1F',
              letterSpacing: '-0.015em',
            }}
          />

          {/* Right Action Label: "— Open" / Clear Button / AI Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {query && (
              <button
                onClick={() => {
                  soundEngine.play('click')
                  setQuery('')
                  inputRef.current?.focus()
                }}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
                  border: 'none',
                  color: isDark ? '#FFFFFF' : '#4A4C52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={10} />
              </button>
            )}

            {/* Subtle "— Open" text matching reference image */}
            <span
              style={{
                fontSize: 13.5,
                color: isDark ? 'rgba(255, 255, 255, 0.45)' : '#8E8E93',
                fontWeight: 500,
              }}
            >
              {currentActionHint}
            </span>

            {/* Apple Intelligence / AI Assistant Trigger Pill */}
            <button
              onClick={() => {
                soundEngine.play('pop')
                setAssistantMode('chat')
              }}
              title="Switch to Apple Intelligence (⌘J)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 12,
                border: 'none',
                background:
                  'linear-gradient(135deg, rgba(255, 45, 85, 0.15), rgba(0, 122, 255, 0.15))',
                color: '#007AFF',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Sparkles size={11} color="#007AFF" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* ─── 2. FILTER SUGGESTION CHIPS ROW (Directly Below Input Bar) ──────── */}
        <div
          style={{
            padding: '0 16px 8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'nowrap',
          }}
        >
          {SUGGESTION_CHIPS.map((chip) => {
            const isActive = activeChip === chip.id
            return (
              <button
                key={chip.id}
                onClick={() => {
                  soundEngine.play('click')
                  setActiveChip((prev) => (prev === chip.id ? null : chip.id))
                }}
                style={{
                  height: 24,
                  padding: '0 10px',
                  borderRadius: 12,
                  border: isActive
                    ? '1px solid #007AFF'
                    : isDark
                    ? '1px solid rgba(255, 255, 255, 0.12)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  backgroundColor: isActive
                    ? '#007AFF'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.65)',
                  color: isActive
                    ? '#FFFFFF'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.75)'
                    : '#636366',
                  fontSize: 11.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.1s ease',
                  boxShadow: isActive ? '0 1px 4px rgba(0, 122, 255, 0.3)' : 'none',
                }}
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        {/* ─── 3. RESULTS / SUGGESTIONS LIST ─────────────────────────────────── */}
        <div
          ref={listRef}
          className="no-scrollbar"
          style={{
            maxHeight: 400,
            overflowY: 'auto',
            padding: '2px 10px 10px 10px',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                padding: '36px 20px',
                textAlign: 'center',
                color: isDark ? 'rgba(255, 255, 255, 0.45)' : '#8E8E93',
                fontSize: 13,
              }}
            >
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            items.map((item, index) => {
              const isSelected = selectedIndex === index

              return (
                <div
                  key={item.id}
                  onClick={() => handleExecuteItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    height: 54,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    cursor: 'pointer',
                    backgroundColor: isSelected
                      ? isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0, 0, 0, 0.055)'
                      : 'transparent',
                    transition: 'background-color 0.06s ease',
                  }}
                >
                  {/* Left: Icon & Text Metadata */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    {/* Item Icon or Image Thumbnail */}
                    <div
                      style={{
                        position: 'relative',
                        width: 36,
                        height: 36,
                        borderRadius: item.iconType === 'folder' || item.iconType === 'app' ? 0 : 7,
                        overflow: item.iconType === 'folder' ? 'visible' : 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.iconType === 'folder' ? (
                        <MacOSFolderIcon size={36} />
                      ) : item.iconType === 'image' ? (
                        <>
                          <img
                            src={item.iconSrc || '/photos.png'}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }}
                          />
                          {/* Mini macOS Preview App Badge in bottom-right corner! */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: -2,
                              right: -2,
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            <img src="/safari browser.png" alt="Preview" style={{ width: 11, height: 11 }} />
                          </div>
                        </>
                      ) : item.iconType === 'app' ? (
                        <img
                          src={item.iconSrc}
                          alt={item.title}
                          style={{ width: 34, height: 34, objectFit: 'contain' }}
                        />
                      ) : item.iconType === 'calc' ? (
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            backgroundColor: '#FF9500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          <CalcIcon size={18} />
                        </div>
                      ) : item.iconType === 'setting' ? (
                        <img src="/settings.png" alt="Settings" style={{ width: 34, height: 34 }} />
                      ) : item.iconType === 'ai' ? (
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            background:
                              'linear-gradient(135deg, #FF2D55 0%, #FF9500 25%, #34C759 50%, #007AFF 75%, #AF52DE 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          <Sparkles size={16} />
                        </div>
                      ) : item.iconType === 'web' ? (
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            backgroundColor: '#007AFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          <Globe size={18} />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 7,
                            backgroundColor: 'rgba(0, 122, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#007AFF',
                          }}
                        >
                          <FileText size={18} />
                        </div>
                      )}
                    </div>

                    {/* Metadata text */}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: isDark ? '#FFFFFF' : '#1D1D1F',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: isDark ? 'rgba(255, 255, 255, 0.5)' : '#8E8E93',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: 1,
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Right: Keyboard Shortcut & Action Badge (Shown for selected item) */}
                  {isSelected && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, paddingLeft: 12 }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: isDark ? 'rgba(255, 255, 255, 0.55)' : '#6E6E73',
                          fontWeight: 500,
                        }}
                      >
                        {item.actionLabel}
                      </span>
                      <span
                        style={{
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(0, 0, 0, 0.18)',
                          borderRadius: 4,
                          padding: '1px 5px',
                          fontSize: 10,
                          fontWeight: 600,
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#6E6E73',
                        }}
                      >
                        {item.shortcutBadge || '↩'}
                      </span>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </motion.div>

      {/* ─── 4. QUICK LOOK PREVIEW MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {quickLookItem && (
          <div
            onClick={() => setQuickLookItem(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              style={{
                width: 520,
                maxHeight: '75vh',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(30px)',
                borderRadius: 14,
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Top Bar */}
              <div
                style={{
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 14px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>{quickLookItem.title}</span>
                <button
                  onClick={() => setQuickLookItem(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#888' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Preview Body */}
              <div style={{ flex: 1, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {quickLookItem.iconType === 'image' ? (
                  <img
                    src={quickLookItem.iconSrc || '/photos.png'}
                    alt={quickLookItem.title}
                    style={{ maxWidth: '100%', maxHeight: 380, objectFit: 'contain', borderRadius: 8 }}
                  />
                ) : (
                  <div style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 13 }}>
                    <FileText size={48} color="#007AFF" style={{ margin: '0 auto 12px auto' }} />
                    <div>{quickLookItem.subtitle}</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
