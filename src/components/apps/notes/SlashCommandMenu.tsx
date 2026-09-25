'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  Table as TableIcon,
  Minus,
  Quote,
  Code,
  Image as ImageIcon,
} from 'lucide-react'

export interface SlashItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
}

interface SlashCommandMenuProps {
  isOpen: boolean
  coords: { x: number; y: number }
  isDark: boolean
  query: string
  onClose: () => void
  onExecute: (item: SlashItem) => void
  editor: any
  onTriggerImageUpload: () => void
}

export default function SlashCommandMenu({
  isOpen,
  coords,
  isDark,
  query,
  onClose,
  onExecute,
  editor,
  onTriggerImageUpload,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const items: SlashItem[] = [
    {
      id: 'h1',
      title: 'Title (H1)',
      description: 'Big section heading',
      icon: <Heading1 size={15} />,
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: 'h2',
      title: 'Heading (H2)',
      description: 'Medium section heading',
      icon: <Heading2 size={15} />,
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: 'h3',
      title: 'Subheading (H3)',
      description: 'Small subsection heading',
      icon: <Heading3 size={15} />,
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: 'checklist',
      title: 'Checklist',
      description: 'Interactive to-do checkbox list',
      icon: <CheckSquare size={15} />,
      action: () => editor?.chain().focus().toggleTaskList().run(),
    },
    {
      id: 'bullet-list',
      title: 'Bulleted List',
      description: 'Create an unorganized bullet list',
      icon: <List size={15} />,
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      id: 'ordered-list',
      title: 'Numbered List',
      description: 'Create a sequential numbered list',
      icon: <ListOrdered size={15} />,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      id: 'table',
      title: 'Table',
      description: 'Insert a 3x3 editable table',
      icon: <TableIcon size={15} />,
      action: () => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      id: 'quote',
      title: 'Blockquote',
      description: 'Capture a stylized quote or citation',
      icon: <Quote size={15} />,
      action: () => editor?.chain().focus().toggleBlockquote().run(),
    },
    {
      id: 'code',
      title: 'Code Block',
      description: 'Display syntax-formatted code snippet',
      icon: <Code size={15} />,
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
    {
      id: 'divider',
      title: 'Divider',
      description: 'Visual horizontal line break',
      icon: <Minus size={15} />,
      action: () => editor?.chain().focus().setHorizontalRule().run(),
    },
    {
      id: 'image',
      title: 'Image',
      description: 'Upload local image or drop asset',
      icon: <ImageIcon size={15} />,
      action: onTriggerImageUpload,
    },
  ]

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          onExecute(filteredItems[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex, onExecute, onClose])

  if (!isOpen || filteredItems.length === 0) return null

  // Ensure dropdown doesn't overflow viewport
  const left = Math.min(Math.max(coords.x, 20), window.innerWidth - 260)
  const top = Math.min(coords.y + 24, window.innerHeight - 320)

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ type: 'spring', damping: 24, stiffness: 400 }}
        style={{
          position: 'fixed',
          top,
          left,
          width: 250,
          maxHeight: 280,
          overflowY: 'auto',
          backgroundColor: isDark ? 'rgba(36, 36, 36, 0.95)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderRadius: 10,
          border: isDark ? '0.5px solid rgba(255, 255, 255, 0.14)' : '0.5px solid rgba(0, 0, 0, 0.14)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.1)',
          padding: 5,
          zIndex: 9999,
          userSelect: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: isDark ? '#8A8A8A' : '#8E8E93', padding: '4px 8px 6px' }}>
          Format &amp; Blocks
        </div>
        {filteredItems.map((item, idx) => {
          const isSelected = idx === selectedIndex
          return (
            <div
              key={item.id}
              onClick={() => onExecute(item)}
              onMouseEnter={() => setSelectedIndex(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '6px 8px',
                borderRadius: 6,
                backgroundColor: isSelected ? (isDark ? '#007AFF' : '#007AFF') : 'transparent',
                color: isSelected ? '#FFFFFF' : isDark ? '#F5F5F5' : '#1D1D1F',
                cursor: 'pointer',
                transition: 'background-color 0.08s ease',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 5,
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 600, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 10, opacity: isSelected ? 0.85 : 0.6, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.description}
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
