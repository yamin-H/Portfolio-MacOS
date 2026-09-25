'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  ChevronDown,
  Heading1,
  Heading2,
  Pilcrow,
} from 'lucide-react'

interface BubbleMenuToolbarProps {
  editor: any
  coords: { top: number; left: number } | null
  isDark: boolean
  onOpenLinkPopover: () => void
}

export default function BubbleMenuToolbar({
  editor,
  coords,
  isDark,
  onOpenLinkPopover,
}: BubbleMenuToolbarProps) {
  const [isHeadingPickerOpen, setIsHeadingPickerOpen] = useState(false)

  if (!editor || !coords) return null

  const isBold = editor.isActive('bold')
  const isItalic = editor.isActive('italic')
  const isUnderline = editor.isActive('underline')
  const isStrike = editor.isActive('strike')
  const isCode = editor.isActive('code')
  const isLink = editor.isActive('link')

  // Current block format label
  const currentFormatLabel = editor.isActive('heading', { level: 1 })
    ? 'Title'
    : editor.isActive('heading', { level: 2 })
    ? 'Heading'
    : 'Body'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 6 }}
      transition={{ duration: 0.12 }}
      style={{
        position: 'fixed',
        top: coords.top - 46,
        left: coords.left,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        padding: '3px 5px',
        backgroundColor: isDark ? 'rgba(36, 36, 36, 0.94)' : 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: 24,
        border: isDark ? '0.5px solid rgba(255, 255, 255, 0.16)' : '0.5px solid rgba(0, 0, 0, 0.14)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28), 0 2px 6px rgba(0,0,0,0.08)',
        zIndex: 9999,
        userSelect: 'none',
      }}
    >
      {/* Format / Heading Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsHeadingPickerOpen(!isHeadingPickerOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: '3px 8px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: isHeadingPickerOpen ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)') : 'transparent',
            color: isDark ? '#F5F5F5' : '#1D1D1F',
            fontSize: 11.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span>{currentFormatLabel}</span>
          <ChevronDown size={11} opacity={0.7} />
        </button>

        {/* Heading picker popover */}
        <AnimatePresence>
          {isHeadingPickerOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -4 }}
              style={{
                position: 'absolute',
                top: 28,
                left: 0,
                width: 120,
                backgroundColor: isDark ? 'rgba(40, 40, 40, 0.96)' : 'rgba(255, 255, 255, 0.96)',
                borderRadius: 8,
                border: isDark ? '0.5px solid rgba(255, 255, 255, 0.12)' : '0.5px solid rgba(0, 0, 0, 0.12)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                padding: 4,
                zIndex: 10000,
              }}
            >
              {[
                { label: 'Title', level: 1, icon: <Heading1 size={13} /> },
                { label: 'Heading', level: 2, icon: <Heading2 size={13} /> },
                { label: 'Body', level: 0, icon: <Pilcrow size={13} /> },
              ].map((h) => (
                <button
                  key={h.label}
                  onClick={() => {
                    if (h.level === 0) {
                      editor.chain().focus().setParagraph().run()
                    } else {
                      editor.chain().focus().toggleHeading({ level: h.level as 1 | 2 }).run()
                    }
                    setIsHeadingPickerOpen(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 6px',
                    borderRadius: 5,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: isDark ? '#F5F5F5' : '#1D1D1F',
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? '#007AFF' : '#007AFF', e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = isDark ? '#F5F5F5' : '#1D1D1F')}
                >
                  {h.icon}
                  <span>{h.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ width: 1, height: 16, backgroundColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)', margin: '0 2px' }} />

      {/* Bold */}
      <BubbleButton
        isActive={isBold}
        isDark={isDark}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (⌘B)"
      >
        <Bold size={13} />
      </BubbleButton>

      {/* Italic */}
      <BubbleButton
        isActive={isItalic}
        isDark={isDark}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (⌘I)"
      >
        <Italic size={13} />
      </BubbleButton>

      {/* Underline */}
      <BubbleButton
        isActive={isUnderline}
        isDark={isDark}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (⌘U)"
      >
        <UnderlineIcon size={13} />
      </BubbleButton>

      {/* Strikethrough */}
      <BubbleButton
        isActive={isStrike}
        isDark={isDark}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough size={13} />
      </BubbleButton>

      {/* Code */}
      <BubbleButton
        isActive={isCode}
        isDark={isDark}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Inline Code"
      >
        <Code size={13} />
      </BubbleButton>

      {/* Link */}
      <BubbleButton
        isActive={isLink}
        isDark={isDark}
        onClick={onOpenLinkPopover}
        title="Insert Link"
      >
        <LinkIcon size={13} />
      </BubbleButton>
    </motion.div>
  )
}

function BubbleButton({
  children,
  isActive,
  isDark,
  onClick,
  title,
}: {
  children: React.ReactNode
  isActive: boolean
  isDark: boolean
  onClick: () => void
  title: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isActive
          ? (isDark ? '#FFD60A' : '#E8A317')
          : 'transparent',
        color: isActive
          ? '#000000'
          : isDark
          ? '#F5F5F5'
          : '#1D1D1F',
        cursor: 'pointer',
        transition: 'all 0.1s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
        }
      }}
    >
      {children}
    </button>
  )
}
