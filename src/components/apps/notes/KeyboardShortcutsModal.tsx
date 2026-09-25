'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Command } from 'lucide-react'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
  isDark: boolean
}

interface ShortcutItem {
  keys: string[]
  description: string
  category: 'General' | 'Formatting' | 'Navigation'
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['⌘', 'N'], description: 'Create a new note', category: 'General' },
  { keys: ['⌘', '⌫'], description: 'Delete selected note', category: 'General' },
  { keys: ['⌘', 'F'], description: 'Focus search bar', category: 'General' },
  { keys: ['⌘', '/'], description: 'Toggle keyboard shortcuts', category: 'General' },

  { keys: ['⌘', 'B'], description: 'Bold text', category: 'Formatting' },
  { keys: ['⌘', 'I'], description: 'Italic text', category: 'Formatting' },
  { keys: ['⌘', 'U'], description: 'Underline text', category: 'Formatting' },
  { keys: ['⌘', '⇧', 'L'], description: 'Toggle checklist item', category: 'Formatting' },
  { keys: ['/'], description: 'Open slash commands menu (at line start)', category: 'Formatting' },
  { keys: ['⌘', 'Z'], description: 'Undo', category: 'Formatting' },
  { keys: ['⌘', '⇧', 'Z'], description: 'Redo', category: 'Formatting' },

  { keys: ['Esc'], description: 'Blur editor and return focus to list', category: 'Navigation' },
  { keys: ['↑', '↓'], description: 'Navigate search / slash menu results', category: 'Navigation' },
]

export default function KeyboardShortcutsModal({ isOpen, onClose, isDark }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: 16,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 480,
            backgroundColor: isDark ? 'rgba(36, 36, 36, 0.95)' : 'rgba(255, 255, 255, 0.96)',
            borderRadius: 14,
            border: isDark ? '0.5px solid rgba(255, 255, 255, 0.12)' : '0.5px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            color: isDark ? '#F5F5F5' : '#1D1D1F',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: isDark ? '0.5px solid rgba(255, 255, 255, 0.08)' : '0.5px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Command size={16} color={isDark ? '#FFD60A' : '#E8A317'} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Keyboard Shortcuts</span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: isDark ? '#8A8A8A' : '#636366',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '16px 18px', maxHeight: 380, overflowY: 'auto' }}>
            {(['General', 'Formatting', 'Navigation'] as const).map((cat) => {
              const items = SHORTCUTS.filter((s) => s.category === cat)
              return (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: isDark ? '#8A8A8A' : '#8E8E93',
                      marginBottom: 8,
                    }}
                  >
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {items.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 6px',
                          borderRadius: 6,
                          fontSize: 12.5,
                        }}
                      >
                        <span style={{ color: isDark ? '#D1D1D6' : '#3A3A3C' }}>{s.description}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {s.keys.map((k, kIdx) => (
                            <span
                              key={kIdx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 20,
                                height: 20,
                                padding: '0 5px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                                border: isDark ? '0.5px solid rgba(255, 255, 255, 0.15)' : '0.5px solid rgba(0, 0, 0, 0.12)',
                                color: isDark ? '#FFFFFF' : '#1D1D1F',
                                boxShadow: isDark ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.06)',
                              }}
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '10px 18px',
              borderTop: isDark ? '0.5px solid rgba(255, 255, 255, 0.08)' : '0.5px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: isDark ? 'rgba(28, 28, 28, 0.6)' : 'rgba(245, 245, 247, 0.6)',
              fontSize: 11,
              color: isDark ? '#8A8A8A' : '#8E8E93',
              textAlign: 'center',
            }}
          >
            Press <kbd style={{ padding: '1px 4px', borderRadius: 3, border: '0.5px solid #666' }}>Esc</kbd> or click anywhere to dismiss
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
