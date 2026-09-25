'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Outdent,
  Indent,
  Quote,
} from 'lucide-react'

interface AppleFormatPopoverProps {
  isOpen: boolean
  onClose: () => void
  editor: any
  isDark: boolean
}

export default function AppleFormatPopover({
  isOpen,
  onClose,
  editor,
  isDark,
}: AppleFormatPopoverProps) {
  if (!isOpen || !editor) return null

  const isTitle = editor.isActive('heading', { level: 1 })
  const isHeading = editor.isActive('heading', { level: 2 })
  const isSubheading = editor.isActive('heading', { level: 3 })
  const isBody = !isTitle && !isHeading && !isSubheading

  const isBold = editor.isActive('bold')
  const isItalic = editor.isActive('italic')
  const isUnderline = editor.isActive('underline')
  const isStrike = editor.isActive('strike')

  const isBulletList = editor.isActive('bulletList')
  const isOrderedList = editor.isActive('orderedList')
  const isBlockquote = editor.isActive('blockquote')

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 900,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: 50,
            right: 170,
            width: 320,
            backgroundColor: isDark ? 'rgba(42, 42, 44, 0.96)' : 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(30px) saturate(190%)',
            WebkitBackdropFilter: 'blur(30px) saturate(190%)',
            borderRadius: 14,
            border: isDark ? '0.5px solid rgba(255, 255, 255, 0.15)' : '0.5px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.08)',
            padding: '12px 14px',
            userSelect: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          }}
        >
          {/* Centered Title */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: isDark ? '#A1A1A6' : '#8E8E93',
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            Format
          </div>

          {/* Row 1: Heading Style Segmented Control (Exact Match to Image 1) */}
          <div
            style={{
              display: 'flex',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#EFEFF2',
              borderRadius: 8,
              padding: 2,
              marginBottom: 12,
            }}
          >
            {[
              {
                id: 'title',
                label: 'Title',
                active: isTitle,
                action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
              },
              {
                id: 'heading',
                label: 'Heading',
                active: isHeading,
                action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
              },
              {
                id: 'subheading',
                label: 'Subheading',
                active: isSubheading,
                action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
              },
              {
                id: 'body',
                label: 'Body',
                active: isBody,
                action: () => editor.chain().focus().setParagraph().run(),
              },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={btn.action}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: btn.active ? 700 : 500,
                  backgroundColor: btn.active
                    ? (isDark ? '#E5A000' : '#E5A000')
                    : 'transparent',
                  color: btn.active ? '#FFFFFF' : isDark ? '#F5F5F5' : '#1D1D1F',
                  cursor: 'pointer',
                  boxShadow: btn.active ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                  transition: 'background-color 0.12s ease',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Row 2: Inline Styles B / I / U / S (Exact Match to Image 1) */}
          <div
            style={{
              display: 'flex',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#EFEFF2',
              borderRadius: 8,
              padding: 2,
              marginBottom: 12,
            }}
          >
            {[
              {
                id: 'bold',
                icon: <Bold size={14} />,
                active: isBold,
                action: () => editor.chain().focus().toggleBold().run(),
              },
              {
                id: 'italic',
                icon: <Italic size={14} />,
                active: isItalic,
                action: () => editor.chain().focus().toggleItalic().run(),
              },
              {
                id: 'underline',
                icon: <Underline size={14} />,
                active: isUnderline,
                action: () => editor.chain().focus().toggleUnderline().run(),
              },
              {
                id: 'strike',
                icon: <Strikethrough size={14} />,
                active: isStrike,
                action: () => editor.chain().focus().toggleStrike().run(),
              },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={btn.action}
                style={{
                  flex: 1,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: 6,
                  backgroundColor: btn.active
                    ? (isDark ? '#E5A000' : '#E5A000')
                    : 'transparent',
                  color: btn.active ? '#FFFFFF' : isDark ? '#F5F5F5' : '#1D1D1F',
                  cursor: 'pointer',
                  boxShadow: btn.active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {btn.icon}
              </button>
            ))}
          </div>

          {/* Row 3: List & Indent Controls (Exact Match to Image 1) */}
          <div
            style={{
              display: 'flex',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#EFEFF2',
              borderRadius: 8,
              padding: 2,
            }}
          >
            {[
              {
                id: 'bullet',
                icon: <List size={14} />,
                active: isBulletList,
                action: () => editor.chain().focus().toggleBulletList().run(),
              },
              {
                id: 'ordered',
                icon: <ListOrdered size={14} />,
                active: isOrderedList,
                action: () => editor.chain().focus().toggleOrderedList().run(),
              },
              {
                id: 'outdent',
                icon: <Outdent size={14} />,
                active: false,
                action: () => editor.chain().focus().liftListItem('listItem').run(),
              },
              {
                id: 'indent',
                icon: <Indent size={14} />,
                active: false,
                action: () => editor.chain().focus().sinkListItem('listItem').run(),
              },
              {
                id: 'quote',
                icon: <Quote size={14} />,
                active: isBlockquote,
                action: () => editor.chain().focus().toggleBlockquote().run(),
              },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={btn.action}
                style={{
                  flex: 1,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  borderRadius: 6,
                  backgroundColor: btn.active
                    ? (isDark ? '#E5A000' : '#E5A000')
                    : 'transparent',
                  color: btn.active ? '#FFFFFF' : isDark ? '#F5F5F5' : '#1D1D1F',
                  cursor: 'pointer',
                  boxShadow: btn.active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
