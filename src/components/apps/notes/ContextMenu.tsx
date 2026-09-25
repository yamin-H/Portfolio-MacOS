'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pin, PinOff, Star, Trash2, Lock } from 'lucide-react'
import { NoteItem } from './types'

interface ContextMenuProps {
  x: number
  y: number
  note: NoteItem | null
  isOpen: boolean
  isDark: boolean
  onClose: () => void
  onTogglePin: (noteId: string) => void
  onToggleStar: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
}

export default function ContextMenu({
  x,
  y,
  note,
  isOpen,
  isDark,
  onClose,
  onTogglePin,
  onToggleStar,
  onDeleteNote,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      window.addEventListener('mousedown', handleOutsideClick)
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !note) return null

  // Adjust positioning to stay within window bounds
  const adjustedX = Math.min(x, window.innerWidth - 180)
  const adjustedY = Math.min(y, window.innerHeight - 180)

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.12 }}
        style={{
          position: 'fixed',
          top: adjustedY,
          left: adjustedX,
          width: 175,
          backgroundColor: isDark ? 'rgba(40, 40, 40, 0.94)' : 'rgba(250, 250, 250, 0.96)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 8,
          border: isDark ? '0.5px solid rgba(255, 255, 255, 0.14)' : '0.5px solid rgba(0, 0, 0, 0.14)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.1)',
          padding: 4,
          zIndex: 9999,
          userSelect: 'none',
          color: isDark ? '#F5F5F5' : '#1D1D1F',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}
      >
        {/* Pin / Unpin */}
        <button
          onClick={() => {
            onTogglePin(note.id)
            onClose()
          }}
          style={menuItemStyle(isDark)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? '#007AFF' : '#007AFF', e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = isDark ? '#F5F5F5' : '#1D1D1F')}
        >
          {note.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
          <span>{note.isPinned ? 'Unpin Note' : 'Pin Note'}</span>
        </button>

        {/* Star / Unstar */}
        <button
          onClick={() => {
            onToggleStar(note.id)
            onClose()
          }}
          style={menuItemStyle(isDark)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF', e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = isDark ? '#F5F5F5' : '#1D1D1F')}
        >
          <Star size={13} />
          <span>{note.isStarred ? 'Remove from Starred' : 'Add to Starred'}</span>
        </button>

        {/* Lock note */}
        <button
          onClick={() => onClose()}
          style={menuItemStyle(isDark)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF', e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = isDark ? '#F5F5F5' : '#1D1D1F')}
        >
          <Lock size={13} />
          <span>Lock Note</span>
        </button>

        <div style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', margin: '4px 0' }} />

        {/* Delete */}
        <button
          onClick={() => {
            onDeleteNote(note.id)
            onClose()
          }}
          style={{ ...menuItemStyle(isDark), color: '#FF453A' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FF453A', e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = '#FF453A')}
        >
          <Trash2 size={13} />
          <span>Delete Note</span>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

function menuItemStyle(isDark: boolean): React.CSSProperties {
  return {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 8px',
    borderRadius: 5,
    border: 'none',
    backgroundColor: 'transparent',
    color: isDark ? '#F5F5F5' : '#1D1D1F',
    fontSize: 12,
    fontWeight: 450,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.08s ease, color 0.08s ease',
  }
}
