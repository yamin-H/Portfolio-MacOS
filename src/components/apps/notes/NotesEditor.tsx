'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import { NoteItem } from './types'
import { formatEditorHeaderDate } from './formatDate'
import BubbleMenuToolbar from './BubbleMenuToolbar'
import SlashCommandMenu, { SlashItem } from './SlashCommandMenu'
import LinkPopover from './LinkPopover'
import AppleFormatPopover from './AppleFormatPopover'
import { soundEngine } from '@/lib/sound/soundEngine'

interface NotesEditorProps {
  note: NoteItem | null
  isDark: boolean
  onUpdateNote: (noteId: string, updates: Partial<NoteItem>) => void
  onTriggerImageUpload: () => void
  imageFileInputRef: React.RefObject<HTMLInputElement | null>
  isFormatPopoverOpen?: boolean
  onCloseFormatPopover?: () => void
}

export default function NotesEditor({
  note,
  isDark,
  onUpdateNote,
  onTriggerImageUpload,
  imageFileInputRef,
  isFormatPopoverOpen = false,
  onCloseFormatPopover = () => {},
}: NotesEditorProps) {
  const [bubbleCoords, setBubbleCoords] = useState<{ top: number; left: number } | null>(null)
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false)
  const [slashCoords, setSlashCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [slashQuery, setSlashQuery] = useState('')
  const [slashStartPos, setSlashStartPos] = useState<number | null>(null)

  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)
  const [linkPopoverCoords, setLinkPopoverCoords] = useState<{ top: number; left: number } | null>(null)
  const [initialLinkUrl, setInitialLinkUrl] = useState('')

  const isSavingRef = useRef(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const activeNoteIdRef = useRef<string | null>(null)

  activeNoteIdRef.current = note?.id || null

  // ── Configure Tiptap ───────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
        onReadOnlyChecked: () => false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'apple-note-link',
        },
      }),
      Placeholder.configure({
        placeholder: 'Title or type / for commands...',
      }),
    ],
    content: note?.content || '',
    editorProps: {
      attributes: {
        class: 'apple-notes-prosemirror',
        style: 'outline: none; min-height: 100%;',
      },
      handleDOMEvents: {
        // Drag and drop image handler
        drop: (view, event) => {
          const files = event.dataTransfer?.files
          if (files && files.length > 0 && files[0].type.startsWith('image/')) {
            event.preventDefault()
            const file = files[0]
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              if (src) {
                const { schema } = view.state
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                if (coordinates) {
                  const node = schema.nodes.image.create({ src })
                  const transaction = view.state.tr.insert(coordinates.pos, node)
                  view.dispatch(transaction)
                  soundEngine.play('pop')
                }
              }
            }
            reader.readAsDataURL(file)
            return true
          }
          return false
        },
      },
    },
    onSelectionUpdate: ({ editor: ed }) => {
      // Calculate BubbleMenu position if text is selected
      const { from, to } = ed.state.selection
      if (from !== to) {
        const domSelection = window.getSelection()
        if (domSelection && domSelection.rangeCount > 0) {
          const range = domSelection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          setBubbleCoords({
            top: rect.top,
            left: rect.left + rect.width / 2,
          })
          return
        }
      }
      setBubbleCoords(null)
    },
    onUpdate: ({ editor: ed }) => {
      if (!note || !activeNoteIdRef.current) return

      const html = ed.getHTML()
      const text = ed.getText()

      // Extract title from first line / heading or fallback
      let title = 'New Note'
      const firstLine = text.trim().split('\n')[0]
      if (firstLine) {
        title = firstLine.slice(0, 48)
      }

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        isSavingRef.current = true
        onUpdateNote(activeNoteIdRef.current!, {
          content: html,
          plainText: text,
          title,
          updatedAt: Date.now(),
        })
        isSavingRef.current = false
      }, 600) // debounced auto-save
    },
  })

  // ── Switch note content when selectedNote changes ─────────────────────────
  useEffect(() => {
    if (!editor || !note) return
    const currentHtml = editor.getHTML()
    // Only update if it's actually different (prevents resetting cursor on auto-save)
    if (note.id !== activeNoteIdRef.current || (!isSavingRef.current && currentHtml !== note.content)) {
      editor.commands.setContent(note.content, { emitUpdate: false })
      activeNoteIdRef.current = note.id
      setBubbleCoords(null)
      setIsSlashMenuOpen(false)
      setIsLinkPopoverOpen(false)
    }
  }, [note?.id, editor])

  // ── Keyboard handler for Slash Commands ("/") ─────────────────────────────
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        // Check if cursor is at the start of a block
        const { $from } = editor.state.selection
        const isStartOfBlock = $from.parentOffset === 0

        if (isStartOfBlock) {
          const domSelection = window.getSelection()
          if (domSelection && domSelection.rangeCount > 0) {
            const rect = domSelection.getRangeAt(0).getBoundingClientRect()
            setSlashCoords({ x: rect.left, y: rect.bottom })
            setSlashStartPos($from.pos)
            setSlashQuery('')
            setIsSlashMenuOpen(true)
          }
        }
      } else if (isSlashMenuOpen) {
        if (e.key === 'Backspace') {
          if (slashQuery.length > 0) {
            setSlashQuery((prev) => prev.slice(0, -1))
          } else {
            setIsSlashMenuOpen(false)
          }
        } else if (e.key === 'Escape') {
          setIsSlashMenuOpen(false)
        } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Enter') {
          setSlashQuery((prev) => prev + e.key)
        }
      }
    }

    const editorEl = editor.view.dom
    editorEl.addEventListener('keydown', handleKeyDown)
    return () => editorEl.removeEventListener('keydown', handleKeyDown)
  }, [editor, isSlashMenuOpen, slashQuery])

  // ── Checkbox Click Sound & Scale Bounce & Audio Card Click ───────────────
  useEffect(() => {
    if (!editor) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target && target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
        soundEngine.play('click')
      }
      if (target && (target.innerText === '▶' || target.closest('[data-audio-play]'))) {
        soundEngine.play('chime')
      }
    }
    const dom = editor.view.dom
    dom.addEventListener('click', handleClick)
    return () => dom.removeEventListener('click', handleClick)
  }, [editor])

  // ── Listen for Toolbar Actions (Insert Table & Toggle Checklist) ──────────
  useEffect(() => {
    if (!editor) return
    const handleInsertTable = () => {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
      soundEngine.play('action')
    }
    const handleToggleChecklist = () => {
      editor.chain().focus().toggleTaskList().run()
      soundEngine.play('click')
    }

    document.addEventListener('notes-insert-table', handleInsertTable)
    document.addEventListener('notes-toggle-checklist', handleToggleChecklist)
    return () => {
      document.removeEventListener('notes-insert-table', handleInsertTable)
      document.removeEventListener('notes-toggle-checklist', handleToggleChecklist)
    }
  }, [editor])

  // ── Execute Slash Item ────────────────────────────────────────────────────
  const handleExecuteSlashItem = useCallback(
    (item: SlashItem) => {
      if (!editor) return
      // Delete the slash character typed
      if (slashStartPos !== null) {
        const currentPos = editor.state.selection.from
        editor.commands.deleteRange({ from: slashStartPos, to: currentPos })
      }
      setIsSlashMenuOpen(false)
      soundEngine.play('action')
      item.action()
    },
    [editor, slashStartPos]
  )

  // ── Open Link Popover ─────────────────────────────────────────────────────
  const handleOpenLinkPopover = () => {
    if (!editor) return
    const prevUrl = editor.getAttributes('link').href || ''
    setInitialLinkUrl(prevUrl)
    if (bubbleCoords) {
      setLinkPopoverCoords(bubbleCoords)
    }
    setBubbleCoords(null)
    setIsLinkPopoverOpen(true)
  }

  const handleSaveLink = (url: string) => {
    if (!editor) return
    soundEngine.play('click')
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    setIsLinkPopoverOpen(false)
  }

  const handleRemoveLink = () => {
    if (!editor) return
    soundEngine.play('pop')
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setIsLinkPopoverOpen(false)
  }

  // ── Local Image Upload Handler via FileReader ─────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editor) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        const src = uploadEvent.target?.result as string
        if (src) {
          editor.chain().focus().setImage({ src }).run()
          soundEngine.play('pop')
        }
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  if (!note) {
    return (
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#666' : '#999',
          fontSize: 14,
          fontFamily: '-apple-system, sans-serif',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>📝</span>
        <span>No Note Selected</span>
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDark ? '#1C1C1C' : '#FFFFFF',
        color: isDark ? '#F5F5F5' : '#1D1D1F',
        overflow: 'hidden',
        position: 'relative',
        transition: 'background-color 200ms ease, color 200ms ease',
      }}
    >
      {/* Hidden File Input for Image Attachments */}
      <input
        ref={imageFileInputRef as any}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Editor Header: Timestamp */}
      <div
        style={{
          padding: '14px 36px 4px',
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 500,
          color: isDark ? '#777777' : '#8E8E93',
          userSelect: 'none',
          letterSpacing: '-0.01em',
        }}
      >
        {formatEditorHeaderDate(note.updatedAt)}
      </div>

      {/* Editor Canvas Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 42px 60px',
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Floating Format Bubble Menu */}
      <BubbleMenuToolbar
        editor={editor}
        coords={bubbleCoords}
        isDark={isDark}
        onOpenLinkPopover={handleOpenLinkPopover}
      />

      {/* Slash Command Dropdown */}
      <SlashCommandMenu
        isOpen={isSlashMenuOpen}
        coords={slashCoords}
        isDark={isDark}
        query={slashQuery}
        onClose={() => setIsSlashMenuOpen(false)}
        onExecute={handleExecuteSlashItem}
        editor={editor}
        onTriggerImageUpload={onTriggerImageUpload}
      />

      {/* Link Popover */}
      <LinkPopover
        isOpen={isLinkPopoverOpen}
        coords={linkPopoverCoords}
        isDark={isDark}
        initialUrl={initialLinkUrl}
        onClose={() => setIsLinkPopoverOpen(false)}
        onSave={handleSaveLink}
        onRemove={handleRemoveLink}
      />

      {/* Apple Format Popover (Matching Image 1) */}
      <AppleFormatPopover
        isOpen={isFormatPopoverOpen}
        onClose={onCloseFormatPopover}
        editor={editor}
        isDark={isDark}
      />

      {/* Inline Scoped Styles for macOS Notes typography, checklists, tables & quotes */}
      <style jsx global>{`
        /* Apple Notes ProseMirror Root */
        .apple-notes-prosemirror {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", -apple-system, sans-serif;
          color: ${isDark ? '#F5F5F5' : '#1D1D1F'};
          font-size: 15px;
          line-height: 1.6;
        }

        .apple-notes-prosemirror p {
          margin: 0 0 10px 0;
        }

        /* Title (H1) */
        .apple-notes-prosemirror h1 {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.025em;
          margin: 0 0 14px 0;
          color: ${isDark ? '#FFFFFF' : '#000000'};
          line-height: 1.25;
        }

        /* Heading (H2) */
        .apple-notes-prosemirror h2 {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.015em;
          margin: 22px 0 8px 0;
          color: ${isDark ? '#F0F0F0' : '#1C1C1E'};
          line-height: 1.35;
        }

        /* Subheading (H3) */
        .apple-notes-prosemirror h3 {
          font-size: 17px;
          font-weight: 600;
          margin: 18px 0 6px 0;
          color: ${isDark ? '#E5E5EA' : '#2C2C2E'};
        }

        /* Interactive Checklist with Scale Bounce & Strikethrough */
        ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
          margin: 8px 0 14px 0;
        }

        ul[data-type="taskList"] li[data-type="taskItem"] {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 6px;
        }

        ul[data-type="taskList"] li[data-type="taskItem"] > label {
          user-select: none;
          display: flex;
          align-items: center;
          margin-top: 3px;
          cursor: pointer;
        }

        ul[data-type="taskList"] li[data-type="taskItem"] input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          border: 1.5px solid ${isDark ? '#8A8A8A' : '#C7C7CC'};
          background-color: transparent;
          cursor: pointer;
          outline: none;
          transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.15s ease, border-color 0.15s ease;
          position: relative;
        }

        ul[data-type="taskList"] li[data-type="taskItem"] input[type="checkbox"]:hover {
          border-color: ${isDark ? '#FFD60A' : '#E8A317'};
        }

        ul[data-type="taskList"] li[data-type="taskItem"] input[type="checkbox"]:checked {
          background-color: ${isDark ? '#FFD60A' : '#E8A317'};
          border-color: ${isDark ? '#FFD60A' : '#E8A317'};
          transform: scale(1.1);
        }

        ul[data-type="taskList"] li[data-type="taskItem"] input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 5px;
          width: 4px;
          height: 8px;
          border: solid #000;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        ul[data-type="taskList"] li[data-type="taskItem"][data-checked="true"] > div > p {
          text-decoration: line-through;
          opacity: 0.55;
          transition: opacity 0.2s ease, text-decoration 0.2s ease;
        }

        /* Bullet & Numbered Lists */
        .apple-notes-prosemirror ul:not([data-type="taskList"]) {
          list-style-type: disc;
          padding-left: 24px;
          margin: 8px 0 12px 0;
        }

        .apple-notes-prosemirror ol {
          list-style-type: decimal;
          padding-left: 24px;
          margin: 8px 0 12px 0;
        }

        .apple-notes-prosemirror li {
          margin-bottom: 4px;
        }

        /* Blockquotes with Apple Yellow/Amber Accent */
        .apple-notes-prosemirror blockquote {
          margin: 14px 0;
          padding: 8px 16px;
          border-left: 3.5px solid ${isDark ? '#FFD60A' : '#E8A317'};
          background-color: ${isDark ? 'rgba(255, 214, 10, 0.06)' : 'rgba(232, 163, 23, 0.06)'};
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: ${isDark ? '#E5E5EA' : '#333333'};
        }

        /* Code Blocks */
        .apple-notes-prosemirror pre {
          background-color: ${isDark ? '#141414' : '#F6F6F6'};
          border: 0.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border-radius: 8px;
          padding: 12px 14px;
          font-family: "SF Mono", Menlo, Consolas, Monaco, monospace;
          font-size: 13px;
          line-height: 1.5;
          overflow-x: auto;
          margin: 14px 0;
        }

        .apple-notes-prosemirror code {
          background-color: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
          padding: 2px 5px;
          border-radius: 4px;
          font-family: "SF Mono", Menlo, Consolas, monospace;
          font-size: 13px;
        }

        .apple-notes-prosemirror pre code {
          background-color: transparent;
          padding: 0;
        }

        /* Tables */
        .apple-notes-prosemirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'};
        }

        .apple-notes-prosemirror th,
        .apple-notes-prosemirror td {
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          padding: 8px 12px;
          font-size: 13.5px;
        }

        .apple-notes-prosemirror th {
          background-color: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
          font-weight: 600;
        }

        /* Horizontal Divider */
        .apple-notes-prosemirror hr {
          border: none;
          border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'};
          margin: 20px 0;
        }

        /* Links */
        .apple-notes-prosemirror .apple-note-link {
          color: ${isDark ? '#64D2FF' : '#007AFF'};
          text-decoration: underline;
          cursor: pointer;
        }

        /* Images */
        .apple-notes-prosemirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 14px 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  )
}
