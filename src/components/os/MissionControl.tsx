'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Monitor, Sparkles, Layers, Trash2 } from 'lucide-react'
import { useWindowStore, WindowData } from '@/app/store/windowStore'
import { soundEngine } from '@/lib/sound/soundEngine'

const APP_ICONS: Record<string, string> = {
  calculator: '/calculator.png',
  appstore: '/appstore.png',
  files: '/File explorar.png',
  finder: '/finder.png',
  notes: '/Notes.png',
  photos: '/photos.png',
  safari: '/safari browser.png',
  settings: '/settings.png',
  terminal: '/terminal.png',
  weather: '/weather.png',
  resume: '/photos.png',
  'pdf-viewer': '/photos.png',
}

export default function MissionControl() {
  const {
    isMissionControlOpen,
    closeMissionControl,
    windows,
    focusWindow,
    restoreWindow,
    closeWindow,
    spaces,
    activeSpaceId,
    setActiveSpaceId,
    addSpace,
    openMultitaskingShowcase,
    closeAllWindows,
    isStageManager,
    toggleStageManager,
  } = useWindowStore()

  const [hoveredWindowId, setHoveredWindowId] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openWindows = useMemo(() => {
    return windows.filter((w) => w.isOpen)
  }, [windows])

  const handleSelectWindow = (id: string) => {
    soundEngine.play('pop')
    restoreWindow(id)
    focusWindow(id)
    closeMissionControl()
  }

  // Keyboard navigation inside Mission Control
  useEffect(() => {
    if (!isMissionControlOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMissionControl()
      } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, openWindows.length))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + openWindows.length) % Math.max(1, openWindows.length))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(openWindows.length - 1, prev + 2))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(0, prev - 2))
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const selected = openWindows[selectedIndex]
        if (selected) {
          handleSelectWindow(selected.id)
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        const selected = openWindows[selectedIndex]
        if (selected) {
          soundEngine.play('close')
          closeWindow(selected.id)
          setSelectedIndex((prev) => Math.max(0, prev - 1))
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMissionControlOpen, openWindows, selectedIndex, closeMissionControl, closeWindow])

  if (!isMissionControlOpen) return null

  // Calculate dynamic responsive layout grid based on window count
  const count = openWindows.length
  const cols = count <= 1 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4
  const cardHeight = count <= 1 ? 420 : count <= 2 ? 340 : count <= 6 ? 260 : 210

  // ── Render Ultra-Realistic Application Preview Cards (Matching media_1790255131092.png) ──
  const renderAppPreviewContent = (win: WindowData) => {
    switch (win.id) {
      case 'weather':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, #2563EB 0%, #38BDF8 100%)',
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 16px',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top row: City and Large Temp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>Cupertino</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>Partly Cloudy</div>
              </div>
              <div style={{ fontSize: '38px', fontWeight: 300, lineHeight: 0.9, letterSpacing: '-0.03em' }}>
                64°
              </div>
            </div>

            {/* Weather Radar preview tile on right */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 70,
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '0.5px solid rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              ⛅
            </div>

            {/* 10-day Forecast Bars matching reference screenshot! */}
            <div
              style={{
                marginTop: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 600 }}>
                <span>Today</span>
                <span>☀️ 54°</span>
                <div
                  style={{
                    width: '60px',
                    height: '4px',
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #38BDF8 0%, #FBBF24 100%)',
                    alignSelf: 'center',
                  }}
                />
                <span>72°</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 600 }}>
                <span>Tomorrow</span>
                <span>⛅ 50°</span>
                <div
                  style={{
                    width: '60px',
                    height: '4px',
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #38BDF8 0%, #34D399 100%)',
                    alignSelf: 'center',
                  }}
                />
                <span>68°</span>
              </div>
            </div>
          </div>
        )

      case 'safari':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#0F172A',
              display: 'flex',
              flexDirection: 'column',
              color: '#FFFFFF',
              overflow: 'hidden',
            }}
          >
            {/* Safari Top Search / Address Pill */}
            <div
              style={{
                height: '24px',
                backgroundColor: '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 10px',
                borderBottom: '0.5px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                style={{
                  width: '60%',
                  height: '16px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                🔒 apple.com/keynote
              </div>
            </div>

            {/* Safari Content Banner (WWDC Stage Presentation matching screenshot) */}
            <div
              style={{
                flex: 1,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                background: 'radial-gradient(ellipse at bottom, #1E1B4B 0%, #0F172A 100%)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(90deg, #60A5FA 0%, #C084FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                WWDC 2024
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                Introducing Apple Intelligence & Portfolio OS
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: 'flex',
                  gap: 6,
                }}
              >
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#A855F7' }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#EC4899' }} />
              </div>
            </div>
          </div>
        )

      case 'calculator':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1C1C1E',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            {/* Display */}
            <div style={{ textAlign: 'right', fontSize: '28px', fontWeight: 300, letterSpacing: '-0.02em', padding: '4px 0' }}>
              42,109
            </div>
            {/* 4x4 Keypad matching Apple Calculator in screenshot */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {['AC', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+'].map((btn, i) => (
                <div
                  key={i}
                  style={{
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: [3, 7, 11, 15].includes(i)
                      ? '#FF9F0A'
                      : i < 3
                      ? '#A5A5A5'
                      : '#333333',
                    color: i < 3 ? '#000000' : '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {btn}
                </div>
              ))}
            </div>
          </div>
        )

      case 'photos':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#18181B',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 6, fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              <span style={{ color: '#FFFFFF' }}>Library</span>
              <span>•</span>
              <span>Memories</span>
              <span>•</span>
              <span>Favorites</span>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {[
                'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
                'linear-gradient(135deg, #831843 0%, #F43F5E 100%)',
                'linear-gradient(135deg, #78350F 0%, #F59E0B 100%)',
                'linear-gradient(135deg, #4C1D95 0%, #8B5CF6 100%)',
                'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
              ].map((grad, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 6,
                    background: grad,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
          </div>
        )

      case 'notes':
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#FCFBF7', display: 'flex', color: '#1F2937' }}>
            {/* Sidebar */}
            <div style={{ width: '32%', backgroundColor: '#F5F2E9', borderRight: '0.5px solid #E5E1D5', padding: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#D97706', marginBottom: 6 }}>Notes</div>
              <div style={{ fontSize: '9px', fontWeight: 600, color: '#1F2937' }}>Portfolio 2.0</div>
              <div style={{ fontSize: '8px', color: '#9CA3AF' }}>Checklist & Specs</div>
            </div>
            {/* Note Canvas */}
            <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>🚀 Launch Architecture</div>
              <div style={{ fontSize: '9px', color: '#4B5563' }}>✓ macOS Stage Manager 3D Shelf</div>
              <div style={{ fontSize: '9px', color: '#4B5563' }}>✓ Mission Control (Exposé) Spring Grid</div>
              <div style={{ fontSize: '9px', color: '#4B5563' }}>✓ Keyboard HUD Switching</div>
            </div>
          </div>
        )

      case 'terminal':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#09090B',
              padding: '10px 12px',
              fontFamily: 'SF Mono, Menlo, monospace',
              fontSize: '9.5px',
              color: '#34D399',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div>
              <span style={{ color: '#60A5FA' }}>guest@macbook</span>:<span style={{ color: '#F472B6' }}>~</span>$ neofetch
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '8.5px', lineHeight: 1.3 }}>
              OS: macOS Sequoia 15.1<br />
              Host: Apple M3 Max (16 Cores)<br />
              Memory: 14.2 GB / 36 GB<br />
              Uptime: 42 days, 8 hours
            </div>
            <div style={{ color: '#34D399', marginTop: 'auto' }}>➜ portfolio-os git:(main) █</div>
          </div>
        )

      case 'settings':
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#1C1C1E', display: 'flex', color: '#FFFFFF' }}>
            <div style={{ width: '32%', backgroundColor: '#2C2C2E', padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#007AFF' }}>Appearance</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>General</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>Displays</div>
            </div>
            <div style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>MacBook Pro 16″</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Apple M3 Max • 36 GB RAM</div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', backgroundColor: '#34D399' }} />
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              color: '#1F2937',
            }}
          >
            <div style={{ width: '28%', backgroundColor: '#F3F4F6', borderRight: '0.5px solid #E5E7EB', padding: '8px' }}>
              <div style={{ fontSize: '9px', fontWeight: 600, color: '#6B7280' }}>Favorites</div>
              <div style={{ fontSize: '9px', color: '#111827', marginTop: 4 }}>Applications</div>
              <div style={{ fontSize: '9px', color: '#111827' }}>Documents</div>
            </div>
            <div style={{ flex: 1, padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, alignItems: 'center' }}>
              {['About', 'Projects', 'Resume', 'Skills', 'Photos', 'Terminal'].map((folder, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 22, height: 18, borderRadius: 3, backgroundColor: '#60A5FA', opacity: 0.85 }} />
                  <span style={{ fontSize: '8px', color: '#374151' }}>{folder}</span>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={closeMissionControl}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9995,
          backgroundColor: 'rgba(10, 15, 25, 0.65)',
          backdropFilter: 'blur(36px) saturate(190%)',
          WebkitBackdropFilter: 'blur(36px) saturate(190%)',
          display: 'flex',
          flexDirection: 'column',
          userSelect: 'none',
          cursor: 'default',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        {/* ─── TOP: DESKTOP SPACES BAR (Exact match to media_1790255131092.png) ─── */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            height: '96px',
            marginTop: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            padding: '0 24px',
            position: 'relative',
          }}
        >
          {/* Action Quick Demo Pills on Left */}
          <div style={{ position: 'absolute', left: 32, display: 'flex', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openMultitaskingShowcase()}
              title="Instantly open 8 macOS windows to view full Exposé layout"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: '16px',
                backgroundColor: 'rgba(0, 122, 255, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 122, 255, 0.4)',
              }}
            >
              <Sparkles size={13} />
              <span>⚡ Multitasking Showcase (8 Apps)</span>
            </motion.button>

            {openWindows.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => closeAllWindows()}
                title="Close all open windows"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={12} />
                <span>Close All</span>
              </motion.button>
            )}
          </div>

          {/* Desktop Spaces Miniatures */}
          {spaces.map((space) => {
            const isActive = space.id === activeSpaceId
            return (
              <motion.div
                key={space.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSpaceId(space.id)}
                style={{
                  width: '136px',
                  height: '76px',
                  borderRadius: '12px',
                  border: isActive
                    ? '2.5px solid #007AFF'
                    : '1px solid rgba(255, 255, 255, 0.25)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive
                    ? '0 0 20px rgba(0, 122, 255, 0.45), 0 6px 18px rgba(0,0,0,0.35)'
                    : '0 4px 12px rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  backgroundImage: 'url(/macos.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: isActive ? 'rgba(0, 122, 255, 0.18)' : 'rgba(0, 0, 0, 0.25)',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  {space.name}
                </span>
              </motion.div>
            )
          })}

          {/* Add Space Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={addSpace}
            title="Add Desktop Space"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Plus size={16} />
          </motion.button>

          {/* Stage Manager Toggle on Right */}
          <div style={{ position: 'absolute', right: 32 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleStageManager()}
              title="Toggle macOS Stage Manager (⌥⌘S)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: '16px',
                backgroundColor: isStageManager ? '#007AFF' : 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: isStageManager ? '0 4px 16px rgba(0, 122, 255, 0.4)' : 'none',
              }}
            >
              <Layers size={13} />
              <span>Stage Manager: {isStageManager ? 'On' : 'Off'}</span>
            </motion.button>
          </div>
        </div>

        {/* ─── CENTER: TILED EXPOSÉ OF OPEN WINDOWS ───────────────────────── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 48px 60px',
            overflowY: 'auto',
          }}
        >
          {openWindows.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                maxWidth: 420,
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Monitor size={36} strokeWidth={1.5} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>Mission Control</span>
              <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.65)' }}>
                No active windows open on this Space. Click the showcase button below to populate 8 macOS windows instantly.
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  openMultitaskingShowcase()
                }}
                style={{
                  marginTop: 6,
                  padding: '9px 20px',
                  borderRadius: '20px',
                  backgroundColor: '#007AFF',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0, 122, 255, 0.5)',
                }}
              >
                ⚡ Launch Multitasking Demo (8 Apps)
              </motion.button>
            </motion.div>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gap: count <= 4 ? '32px' : '22px',
                maxWidth: count <= 2 ? '960px' : count <= 6 ? '1200px' : '1400px',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {openWindows.map((win, idx) => {
                const isHovered = hoveredWindowId === win.id || selectedIndex === idx
                const iconSrc = APP_ICONS[win.id] || '/finder.png'

                return (
                  <motion.div
                    key={win.id}
                    layoutId={`mission-window-${win.id}`}
                    initial={{ opacity: 0, scale: 0.82, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.82, y: 30 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    whileHover={{ scale: 1.035, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => {
                      setHoveredWindowId(win.id)
                      setSelectedIndex(idx)
                    }}
                    onMouseLeave={() => setHoveredWindowId(null)}
                    onClick={() => handleSelectWindow(win.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    {/* Floating App Badge Header (Icon + Title with Glass Capsule) */}
                    <motion.div
                      animate={{
                        opacity: isHovered ? 1 : 0.85,
                        scale: isHovered ? 1.05 : 1,
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '4px 14px',
                        borderRadius: '16px',
                        backgroundColor: isHovered ? 'rgba(0, 122, 255, 0.45)' : 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(20px)',
                        border: isHovered ? '0.5px solid rgba(0, 122, 255, 0.6)' : '0.5px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <img
                        src={iconSrc}
                        alt={win.title}
                        width={18}
                        height={18}
                        style={{ objectFit: 'contain' }}
                      />
                      <span
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {win.title}
                      </span>
                    </motion.div>

                    {/* Window Thumbnail Card with Native Frame */}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '440px',
                        height: `${cardHeight}px`,
                        borderRadius: '12px',
                        backgroundColor: '#1E1E22',
                        border: isHovered
                          ? '2.5px solid #007AFF'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: isHovered
                          ? '0 24px 60px rgba(0, 122, 255, 0.4), 0 8px 24px rgba(0,0,0,0.6)'
                          : '0 12px 36px rgba(0, 0, 0, 0.45)',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'border 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      {/* Top-Left Hover Quick Close (X) Button (macOS style) */}
                      {isHovered && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            soundEngine.play('close')
                            closeWindow(win.id)
                          }}
                          style={{
                            position: 'absolute',
                            top: 6,
                            left: 6,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: '#FF5F56',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
                            zIndex: 20,
                          }}
                          title={`Close ${win.title}`}
                        >
                          <X size={10} strokeWidth={3} />
                        </motion.button>
                      )}

                      {/* Native macOS Window Titlebar with Traffic Lights */}
                      <div
                        style={{
                          height: '24px',
                          backgroundColor: '#2A2A2E',
                          borderBottom: '0.5px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 10px',
                          gap: 5,
                          flexShrink: 0,
                        }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#27C93F' }} />
                        <span
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontWeight: 500,
                          }}
                        >
                          {win.title}
                        </span>
                      </div>

                      {/* Rich Application Content Preview */}
                      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        {renderAppPreviewContent(win)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
