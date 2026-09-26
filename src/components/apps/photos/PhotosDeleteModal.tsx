'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { PhotoItem } from './photosData'
import { soundEngine } from '@/lib/sound/soundEngine'

interface PhotosDeleteModalProps {
  isOpen: boolean
  photo: PhotoItem | null
  isPermanent?: boolean
  isMultiple?: boolean
  count?: number
  onClose: () => void
  onConfirm: () => void
}

export default function PhotosDeleteModal({
  isOpen,
  photo,
  isPermanent = false,
  isMultiple = false,
  count = 1,
  onClose,
  onConfirm,
}: PhotosDeleteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        onConfirm()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onConfirm])

  if (!isOpen) return null

  const title = isPermanent
    ? isMultiple
      ? `Delete ${count} Items Permanently?`
      : 'Delete Photo Permanently?'
    : isMultiple
    ? `Delete ${count} Photos?`
    : 'Delete Photo?'

  const message = isPermanent
    ? 'This item will be deleted immediately from your Mac. You cannot undo this action.'
    : 'This photo will be moved to Recently Deleted. It can be recovered anytime from the sidebar.'

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.36)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          userSelect: 'none',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 420 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 320,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(30px)',
            borderRadius: 14,
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.32), 0 0 1px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            padding: '20px 20px 16px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {/* Top Apple Icon / Preview */}
          {photo && photo.src ? (
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                marginBottom: 14,
                position: 'relative',
              }}
            >
              <img
                src={photo.src}
                alt={photo.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: '#FF3B30',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                }}
              >
                <Trash2 size={11} />
              </div>
            </div>
          ) : (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 59, 48, 0.12)',
                color: '#FF3B30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Trash2 size={24} />
            </div>
          )}

          {/* Title */}
          <h3
            style={{
              margin: '0 0 6px 0',
              fontSize: 14.5,
              fontWeight: 700,
              color: '#1D1D1F',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>

          {/* Message */}
          <p
            style={{
              margin: '0 0 18px 0',
              fontSize: 12,
              lineHeight: 1.45,
              color: '#6E6E73',
            }}
          >
            {message}
          </p>

          {/* Buttons: [ Cancel ] [ Delete Photo ] */}
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button
              onClick={() => {
                soundEngine.play('click')
                onClose()
              }}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 7,
                border: '1px solid rgba(0, 0, 0, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#1D1D1F',
                fontSize: 12.5,
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                transition: 'background-color 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)')}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onConfirm()
              }}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: 7,
                border: 'none',
                backgroundColor: '#FF3B30',
                color: '#FFFFFF',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(255, 59, 48, 0.35)',
                transition: 'filter 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.92)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              {isPermanent ? 'Delete' : 'Delete Photo'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
