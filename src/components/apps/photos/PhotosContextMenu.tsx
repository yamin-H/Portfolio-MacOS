'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Info,
  Maximize2,
  Trash2,
  Copy,
  Download,
  RotateCcw,
} from 'lucide-react'
import { PhotoItem } from './photosData'
import { soundEngine } from '@/lib/sound/soundEngine'

interface PhotosContextMenuProps {
  x: number
  y: number
  photo: PhotoItem
  isRecentlyDeleted?: boolean
  onClose: () => void
  onOpen: (photo: PhotoItem) => void
  onGetInfo: (photo: PhotoItem) => void
  onToggleFavorite: (photo: PhotoItem) => void
  onDuplicate: (photo: PhotoItem) => void
  onDelete: (photo: PhotoItem) => void
  onRecover?: (photo: PhotoItem) => void
  onDeletePermanent?: (photo: PhotoItem) => void
}

export default function PhotosContextMenu({
  x,
  y,
  photo,
  isRecentlyDeleted = false,
  onClose,
  onOpen,
  onGetInfo,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  onRecover,
  onDeletePermanent,
}: PhotosContextMenuProps) {
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState({ x, y })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Viewport clamping
  useEffect(() => {
    const MENU_WIDTH = 210
    const MENU_HEIGHT = isRecentlyDeleted ? 200 : 250
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800

    let posX = x
    let posY = y

    if (posX + MENU_WIDTH > vw - 12) {
      posX = x - MENU_WIDTH
    }
    if (posY + MENU_HEIGHT > vh - 60) {
      posY = y - MENU_HEIGHT
    }

    posX = Math.max(10, Math.min(posX, vw - MENU_WIDTH - 10))
    posY = Math.max(32, Math.min(posY, vh - MENU_HEIGHT - 10))

    setCoords({ x: posX, y: posY })
  }, [x, y, isRecentlyDeleted])

  // Close on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('pointerdown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleDownload = () => {
    soundEngine.play('click')
    const link = document.createElement('a')
    link.href = photo.src
    link.download = `${photo.title || 'photo'}.jpg`
    link.click()
    onClose()
  }

  if (!mounted) return null

  const titlePreview =
    photo.title.length > 18 ? photo.title.substring(0, 16) + '…' : photo.title

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        style={{
          position: 'fixed',
          left: coords.x,
          top: coords.y,
          width: 210,
          backgroundColor: 'rgba(252, 252, 252, 0.92)',
          backdropFilter: 'blur(30px) saturate(180%)',
          borderRadius: 8,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22), 0 0 1px rgba(0, 0, 0, 0.25)',
          padding: '4px',
          zIndex: 99999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          fontSize: 12.5,
          userSelect: 'none',
        }}
      >
        {/* Photo Title Preview Header */}
        <div
          style={{
            padding: '5px 8px 4px 8px',
            fontSize: 11,
            color: '#8E8E93',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {titlePreview}
        </div>

        <div style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.08)', margin: '2px 4px' }} />

        {/* Action: Open Photo */}
        <button
          onClick={() => {
            soundEngine.play('pop')
            onOpen(photo)
            onClose()
          }}
          style={menuItemStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Maximize2 size={13} />
            <span>Open Photo</span>
          </div>
          <span style={shortcutStyle}>↩</span>
        </button>

        {/* Action: Get Info */}
        <button
          onClick={() => {
            soundEngine.play('click')
            onGetInfo(photo)
            onClose()
          }}
          style={menuItemStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={13} />
            <span>Get Info</span>
          </div>
          <span style={shortcutStyle}>⌘I</span>
        </button>

        {!isRecentlyDeleted ? (
          <>
            <div style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.08)', margin: '3px 4px' }} />

            {/* Favorite / Unfavorite */}
            <button
              onClick={() => {
                onToggleFavorite(photo)
                onClose()
              }}
              style={menuItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={13} fill={photo.isFavorite ? '#FF2D55' : 'none'} color={photo.isFavorite ? '#FF2D55' : 'currentColor'} />
                <span>{photo.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
              </div>
              <span style={shortcutStyle}>.</span>
            </button>

            {/* Duplicate */}
            <button
              onClick={() => {
                onDuplicate(photo)
                onClose()
              }}
              style={menuItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Copy size={13} />
                <span>Duplicate</span>
              </div>
              <span style={shortcutStyle}>⌘D</span>
            </button>

            {/* Download Image */}
            <button
              onClick={handleDownload}
              style={menuItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Download size={13} />
                <span>Download Photo</span>
              </div>
              <span style={shortcutStyle}>⌘S</span>
            </button>

            <div style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.08)', margin: '3px 4px' }} />

            {/* Delete Photo */}
            <button
              onClick={() => {
                onDelete(photo)
                onClose()
              }}
              style={{ ...menuItemStyle, color: '#FF3B30' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FF3B30'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#FF3B30'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trash2 size={13} />
                <span>Delete Photo</span>
              </div>
              <span style={shortcutStyle}>⌫</span>
            </button>
          </>
        ) : (
          <>
            <div style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.08)', margin: '3px 4px' }} />

            {/* Recover */}
            <button
              onClick={() => {
                onRecover?.(photo)
                onClose()
              }}
              style={menuItemStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RotateCcw size={13} />
                <span>Put Back to Library</span>
              </div>
            </button>

            <div style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.08)', margin: '3px 4px' }} />

            {/* Delete Permanently */}
            <button
              onClick={() => {
                onDeletePermanent?.(photo)
                onClose()
              }}
              style={{ ...menuItemStyle, color: '#FF3B30' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FF3B30'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#FF3B30'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trash2 size={13} />
                <span>Delete Immediately</span>
              </div>
              <span style={shortcutStyle}>⌥⌫</span>
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '5px 8px',
  borderRadius: 5,
  border: 'none',
  backgroundColor: 'transparent',
  color: '#1D1D1F',
  fontSize: 12.5,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 0.08s ease, color 0.08s ease',
}

const shortcutStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(0, 0, 0, 0.4)',
  marginLeft: 8,
}
