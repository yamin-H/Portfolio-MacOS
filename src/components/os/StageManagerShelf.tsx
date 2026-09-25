'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
}

export default function StageManagerShelf() {
  const { isStageManager, windows, activeWindowId, activateStage } = useWindowStore()
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null)

  if (!isStageManager) return null

  // Background windows that are open but not currently focused
  const backgroundStages = windows.filter((w) => w.isOpen && w.id !== activeWindowId)

  if (backgroundStages.length === 0) return null

  // Render stylized, high-fidelity micro preview inside each miniature window
  const renderMiniPreviewContent = (id: string) => {
    switch (id) {
      case 'safari':
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 6, backgroundColor: '#E5E7EB', margin: '2px 4px', borderRadius: 2 }} />
            <div style={{ flex: 1, padding: 3, display: 'flex', gap: 2 }}>
              <div style={{ width: '30%', backgroundColor: '#007AFF', borderRadius: 2, opacity: 0.8 }} />
              <div style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 2 }} />
            </div>
          </div>
        )
      case 'weather':
        return (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #1C6EA4 0%, #5BA4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FFD60A', boxShadow: '0 0 4px #FFD60A' }} />
          </div>
        )
      case 'terminal':
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B', padding: '3px 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ width: '40%', height: 2, backgroundColor: '#34C759', borderRadius: 1 }} />
            <div style={{ width: '65%', height: 2, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
          </div>
        )
      case 'notes':
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFDF5', display: 'flex' }}>
            <div style={{ width: '30%', backgroundColor: '#F9F6E8', borderRight: '0.5px solid #EAE5D2' }} />
            <div style={{ flex: 1, padding: '3px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ width: '60%', height: 3, backgroundColor: '#E5A93C', borderRadius: 1 }} />
              <div style={{ width: '80%', height: 2, backgroundColor: '#D1D5DB', borderRadius: 1 }} />
            </div>
          </div>
        )
      case 'photos':
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', padding: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <div style={{ backgroundColor: '#007AFF', borderRadius: 1, opacity: 0.7 }} />
            <div style={{ backgroundColor: '#34C759', borderRadius: 1, opacity: 0.7 }} />
            <div style={{ backgroundColor: '#FF9500', borderRadius: 1, opacity: 0.7 }} />
            <div style={{ backgroundColor: '#AF52DE', borderRadius: 1, opacity: 0.7 }} />
          </div>
        )
      default:
        return (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', display: 'flex' }}>
            <div style={{ width: '28%', backgroundColor: '#ECEEF1' }} />
            <div style={{ flex: 1, padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ width: '70%', height: 3, backgroundColor: '#007AFF', borderRadius: 1, opacity: 0.8 }} />
              <div style={{ width: '45%', height: 2, backgroundColor: '#E5E7EB', borderRadius: 1 }} />
            </div>
          </div>
        )
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 14,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        zIndex: 9000,
        pointerEvents: 'auto',
        perspective: 1200,
      }}
    >
      <AnimatePresence>
        {backgroundStages.map((win, idx) => {
          const iconSrc = APP_ICONS[win.id] || '/finder.png'
          const isHovered = hoveredStageId === win.id

          return (
            <motion.div
              key={win.id}
              layoutId={`stage-shelf-${win.id}`}
              initial={{ opacity: 0, x: -45, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -45, scale: 0.8 }}
              onMouseEnter={() => setHoveredStageId(win.id)}
              onMouseLeave={() => setHoveredStageId(null)}
              whileHover={{
                scale: 1.08,
                x: 16,
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              onClick={() => activateStage(win.id)}
              title={`Switch to ${win.title}`}
              style={{
                position: 'relative',
                width: 104,
                height: 72,
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                transform: isHovered
                  ? 'rotateY(0deg) rotateX(0deg)'
                  : 'rotateY(-18deg) rotateX(2deg)',
                transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Optional Background Stacked Window (for visual multi-window stage depth as seen in Image 1!) */}
              <div
                style={{
                  position: 'absolute',
                  top: -5,
                  left: 6,
                  width: 96,
                  height: 66,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  boxShadow: '-4px 8px 20px rgba(0, 0, 0, 0.25)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              {/* Foreground Miniature Window Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  border: isHovered ? '2px solid #007AFF' : '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: isHovered
                    ? '0 12px 30px rgba(0, 122, 255, 0.35), -6px 12px 24px rgba(0, 0, 0, 0.35)'
                    : '-6px 10px 24px rgba(0, 0, 0, 0.35)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 2,
                  transition: 'border 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                {/* Mini macOS Titlebar with Traffic Lights */}
                <div
                  style={{
                    height: 12,
                    backgroundColor: '#EBECEF',
                    borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 5px',
                    gap: 3,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                  <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                  <div style={{ width: 3.5, height: 3.5, borderRadius: '50%', backgroundColor: '#27C93F' }} />
                </div>

                {/* Stylized Miniature Application Content Preview */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  {renderMiniPreviewContent(win.id)}
                </div>
              </div>

              {/* App Icon Floating Badge pinned at Bottom-Left Corner (Exact Match to Image 1!) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  left: -6,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <img
                  src={iconSrc}
                  alt={win.title}
                  width={20}
                  height={20}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
