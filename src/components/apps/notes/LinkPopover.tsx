'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Unlink, Check, X } from 'lucide-react'

interface LinkPopoverProps {
  isOpen: boolean
  coords: { top: number; left: number } | null
  isDark: boolean
  initialUrl?: string
  onClose: () => void
  onSave: (url: string) => void
  onRemove: () => void
}

export default function LinkPopover({
  isOpen,
  coords,
  isDark,
  initialUrl = '',
  onClose,
  onSave,
  onRemove,
}: LinkPopoverProps) {
  const [url, setUrl] = useState(initialUrl)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUrl(initialUrl)
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen, initialUrl])

  if (!isOpen || !coords) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let cleanUrl = url.trim()
    if (!cleanUrl) {
      onRemove()
      return
    }
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`
    }
    onSave(cleanUrl)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 4 }}
        style={{
          position: 'fixed',
          top: coords.top - 48,
          left: coords.left,
          transform: 'translateX(-50%)',
          backgroundColor: isDark ? 'rgba(36, 36, 36, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 10,
          border: isDark ? '0.5px solid rgba(255, 255, 255, 0.16)' : '0.5px solid rgba(0, 0, 0, 0.14)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0,0,0,0.08)',
          padding: '6px 8px',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter web link..."
            style={{
              width: 180,
              height: 26,
              borderRadius: 6,
              border: isDark ? '0.5px solid rgba(255,255,255,0.18)' : '0.5px solid rgba(0,0,0,0.18)',
              backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : '#F2F2F7',
              color: isDark ? '#FFFFFF' : '#1D1D1F',
              fontSize: 12,
              padding: '0 8px',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            title="Save Link"
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#007AFF',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Check size={13} />
          </button>

          {initialUrl && (
            <>
              <button
                type="button"
                onClick={() => window.open(initialUrl, '_blank')}
                title="Open Link"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  color: isDark ? '#fff' : '#1D1D1F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ExternalLink size={13} />
              </button>

              <button
                type="button"
                onClick={onRemove}
                title="Remove Link"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: 'rgba(255, 69, 58, 0.15)',
                  color: '#FF453A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Unlink size={13} />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            title="Cancel"
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              border: 'none',
              backgroundColor: 'transparent',
              color: isDark ? '#8A8A8A' : '#8E8E93',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={13} />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}
