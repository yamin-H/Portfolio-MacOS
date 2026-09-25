'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/app/store/windowStore'
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
}

export default function AppSwitcher() {
  const {
    isAppSwitcherOpen,
    closeAppSwitcher,
    appSwitcherIndex,
    windows,
    focusWindow,
    restoreWindow,
  } = useWindowStore()

  const openWindows = windows.filter((w) => w.isOpen)

  // Listen for keyup of Meta or Alt to commit window selection
  useEffect(() => {
    if (!isAppSwitcherOpen) return

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Alt') {
        const target = openWindows[appSwitcherIndex]
        if (target) {
          soundEngine.play('pop')
          restoreWindow(target.id)
          focusWindow(target.id)
        }
        closeAppSwitcher()
      }
    }

    window.addEventListener('keyup', handleKeyUp)
    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [isAppSwitcherOpen, appSwitcherIndex, openWindows, restoreWindow, focusWindow, closeAppSwitcher])

  if (!isAppSwitcherOpen || openWindows.length === 0) return null

  const selectedWin = openWindows[appSwitcherIndex] || openWindows[0]

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          style={{
            backgroundColor: 'rgba(28, 30, 38, 0.88)',
            backdropFilter: 'blur(50px) saturate(210%)',
            WebkitBackdropFilter: 'blur(50px) saturate(210%)',
            borderRadius: 22,
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.65)',
            padding: '16px 20px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            pointerEvents: 'auto',
          }}
        >
          {/* Icons Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {openWindows.map((win, idx) => {
              const isSelected = idx === appSwitcherIndex
              const iconSrc = APP_ICONS[win.id] || '/finder.png'

              return (
                <div
                  key={win.id}
                  onClick={() => {
                    soundEngine.play('pop')
                    restoreWindow(win.id)
                    focusWindow(win.id)
                    closeAppSwitcher()
                  }}
                  style={{
                    position: 'relative',
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                    border: isSelected ? '2px solid #007AFF' : '2px solid transparent',
                    boxShadow: isSelected ? '0 0 16px rgba(0, 122, 255, 0.5)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <img
                    src={iconSrc}
                    alt={win.title}
                    width={48}
                    height={48}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )
            })}
          </div>

          {/* Selected App Name Label */}
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {selectedWin?.title}
          </span>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
