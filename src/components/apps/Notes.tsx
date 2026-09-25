'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SquarePen,
  CheckSquare,
  Type,
  Table as TableIcon,
  Image as ImageIcon,
  Share,
  MoreHorizontal,
  Search,
  X,
  Pin,
  PinOff,
  Star,
  Trash2,
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Folder as FolderIcon,
  FolderPlus,
  Cloud,
  Laptop,
  Zap,
  Calendar,
  Command,
  HelpCircle,
  Menu,
  RotateCcw,
  BookOpen,
  Users,
  Plane,
  Coffee,
  Undo2,
  Redo2,
  Maximize2,
  UserPlus,
} from 'lucide-react'

import { useWindowContext } from '@/app/components/os/Window'
import { soundEngine } from '@/lib/sound/soundEngine'
import { NoteItem, SidebarFolder, ThemeMode } from './notes/types'
import { DEFAULT_FOLDERS, SEED_NOTES } from './notes/seedData'
import { formatNoteListDate } from './notes/formatDate'
import NotesEditor from './notes/NotesEditor'
import TrafficLights from '@/components/os/TrafficLights'
import ContextMenu from './notes/ContextMenu'
import KeyboardShortcutsModal from './notes/KeyboardShortcutsModal'
import {
  ZeldaArtworkThumbnail,
  CameraThumbnail,
  DocThumbnail,
  TwitterThumbnail,
} from './notes/Thumbnails'
import MacOSFolderIcon from './notes/MacOSFolderIcon'

const STORAGE_KEY = 'macos-notes-data'
const THEME_STORAGE_KEY = 'macos-notes-theme'

export default function Notes() {
  const windowContext = useWindowContext()

  // ── Theme State: Default to Authentic Apple Light Mode (from User Images) ──
  const [theme, setTheme] = useState<ThemeMode>('light')
  const isDark = theme === 'dark'

  // ── Notes State & Persistence ─────────────────────────────────────────────
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [activeFolderId, setActiveFolderId] = useState<string>('notes-icloud')
  const [folders, setFolders] = useState<SidebarFolder[]>(DEFAULT_FOLDERS)

  // ── Panels & Layout State ─────────────────────────────────────────────────
  const [middlePanelWidth, setMiddlePanelWidth] = useState<number>(290)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [mobileView, setMobileView] = useState<'sidebar' | 'list' | 'editor'>('list')
  const [isDraggingHandle, setIsDraggingHandle] = useState<boolean>(false)
  const [isPinnedCollapsed, setIsPinnedCollapsed] = useState<boolean>(false)

  // ── Search & Filter State ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState<string>('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ── Context Menu & Modals State ───────────────────────────────────────────
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    x: number
    y: number
    note: NoteItem | null
  }>({ isOpen: false, x: 0, y: 0, note: null })

  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false)
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState<boolean>(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false)

  const imageFileInputRef = useRef<HTMLInputElement | null>(null)

  // ── Load from LocalStorage ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme)
      }

      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed)
          setSelectedNoteId(parsed[0].id)
          return
        }
      }
    } catch {
      // Fallback
    }

    // Default seed data matching reference images
    setNotes(SEED_NOTES)
    setSelectedNoteId(SEED_NOTES[0].id)
  }, [])

  // ── Save to LocalStorage on Notes Change ───────────────────────────────────
  const saveNotesToStorage = useCallback((updatedNotes: NoteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes))
    } catch {
      // Ignore quota errors
    }
  }, [])

  const toggleTheme = () => {
    soundEngine.play('pop')
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(THEME_STORAGE_KEY, next)
      return next
    })
  }

  // ── Create New Note (⌘N) ──────────────────────────────────────────────────
  const handleCreateNewNote = useCallback(() => {
    soundEngine.play('action')
    const newId = `note-${Date.now()}`
    const targetFolder =
      activeFolderId === 'all-icloud' ||
      activeFolderId === 'recently-deleted'
        ? 'notes-icloud'
        : activeFolderId

    const newNote: NoteItem = {
      id: newId,
      title: 'New Note',
      folderId: targetFolder,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
      isStarred: false,
      group: 'Today',
      plainText: '',
      content: '<h1></h1><p></p>',
    }

    setNotes((prev) => {
      const updated = [newNote, ...prev]
      saveNotesToStorage(updated)
      return updated
    })
    setSelectedNoteId(newId)
    setMobileView('editor')
  }, [activeFolderId, saveNotesToStorage])

  // ── Delete Note (⌘⌫) ──────────────────────────────────────────────────────
  const handleDeleteNote = useCallback(
    (noteIdToDelete: string) => {
      soundEngine.play('pop')
      setNotes((prev) => {
        let updated: NoteItem[]
        const target = prev.find((n) => n.id === noteIdToDelete)

        if (target && target.isDeleted) {
          // Permanently delete
          updated = prev.filter((n) => n.id !== noteIdToDelete)
        } else {
          // Soft delete to recently-deleted
          updated = prev.map((n) =>
            n.id === noteIdToDelete ? { ...n, isDeleted: true, deletedAt: Date.now() } : n
          )
        }

        saveNotesToStorage(updated)

        if (selectedNoteId === noteIdToDelete) {
          const visible = updated.filter((n) =>
            activeFolderId === 'recently-deleted' ? n.isDeleted : !n.isDeleted
          )
          setSelectedNoteId(visible[0]?.id || null)
        }
        return updated
      })
    },
    [activeFolderId, selectedNoteId, saveNotesToStorage]
  )

  // ── Restore Note from Trash ───────────────────────────────────────────────
  const handleRestoreNote = (noteId: string) => {
    soundEngine.play('action')
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === noteId ? { ...n, isDeleted: false, deletedAt: null } : n
      )
      saveNotesToStorage(updated)
      return updated
    })
  }

  // ── Pin / Unpin Note ──────────────────────────────────────────────────────
  const handleTogglePin = (noteId: string) => {
    soundEngine.play('click')
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
      )
      saveNotesToStorage(updated)
      return updated
    })
  }

  // ── Star / Unstar Note ────────────────────────────────────────────────────
  const handleToggleStar = (noteId: string) => {
    soundEngine.play('click')
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === noteId ? { ...n, isStarred: !n.isStarred } : n
      )
      saveNotesToStorage(updated)
      return updated
    })
  }

  // ── Update Note Content (from Tiptap) ─────────────────────────────────────
  const handleUpdateNote = useCallback(
    (noteId: string, updates: Partial<NoteItem>) => {
      setNotes((prev) => {
        const updated = prev.map((n) => (n.id === noteId ? { ...n, ...updates } : n))
        saveNotesToStorage(updated)
        return updated
      })
    },
    [saveNotesToStorage]
  )

  // ── Global Keyboard Shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n' && !e.shiftKey) {
        e.preventDefault()
        handleCreateNewNote()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
        if (selectedNoteId) {
          e.preventDefault()
          handleDeleteNote(selectedNoteId)
        }
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setIsShortcutsModalOpen((prev) => !prev)
        return
      }

      if (e.key === 'Escape') {
        setIsShortcutsModalOpen(false)
        setIsFormatMenuOpen(false)
        setIsMoreMenuOpen(false)
        setContextMenu((prev) => ({ ...prev, isOpen: false }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCreateNewNote, handleDeleteNote, selectedNoteId])

  // ── Middle Panel Drag Resize (220–420px) ──────────────────────────────────
  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingHandle(true)

    const startX = e.clientX
    const startWidth = middlePanelWidth

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const newWidth = Math.min(Math.max(startWidth + delta, 220), 420)
      setMiddlePanelWidth(newWidth)
    }

    const onMouseUp = () => {
      setIsDraggingHandle(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // ── Folder Count Calculations ─────────────────────────────────────────────
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    const activeNotes = notes.filter((n) => !n.isDeleted)
    const deletedNotes = notes.filter((n) => n.isDeleted)

    counts['all-icloud'] = 74
    counts['notes-icloud'] = activeNotes.filter((n) => n.folderId === 'notes-icloud').length
    counts['shared'] = 14
    counts['articles'] = activeNotes.filter((n) => n.folderId === 'articles').length || 11
    counts['private'] = 4
    counts['appstories'] = 0
    counts['archive'] = 9
    counts['home'] = 4
    counts['health'] = 3
    counts['cartoons'] = 4
    counts['travel'] = 10
    counts['recently-deleted'] = deletedNotes.length || 9

    return counts
  }, [notes])

  // ── Filtered Notes by Folder and Search Query ──────────────────────────────
  const filteredNotes = useMemo(() => {
    let result = notes

    if (activeFolderId === 'recently-deleted') {
      result = result.filter((n) => n.isDeleted)
    } else {
      result = result.filter((n) => !n.isDeleted)

      if (activeFolderId === 'all-icloud') {
        // all iCloud notes
      } else {
        result = result.filter((n) => n.folderId === activeFolderId)
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.plainText.toLowerCase().includes(q)
      )
    }

    return result
  }, [notes, activeFolderId, searchQuery])

  // Group notes into Pinned, Today, Yesterday, Older
  const pinnedNotes = useMemo(() => {
    return filteredNotes.filter((n) => n.isPinned)
  }, [filteredNotes])

  const todayNotes = useMemo(() => {
    return filteredNotes.filter((n) => !n.isPinned && (n.group === 'Today' || !n.group))
  }, [filteredNotes])

  const yesterdayNotes = useMemo(() => {
    return filteredNotes.filter((n) => !n.isPinned && (n.group === 'Yesterday' || n.group === 'Previous 30 Days'))
  }, [filteredNotes])

  // Active selected note
  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || filteredNotes[0] || null
  }, [notes, selectedNoteId, filteredNotes])

  // Highlight matching search text
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={i}
          style={{
            backgroundColor: isDark ? '#E5A000' : '#FFD60A',
            color: '#000',
            borderRadius: 2,
            padding: '0 1px',
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  // ── Render Right-Side Thumbnail on Note Card (Matching Images 1 & 2) ───────
  const renderCardThumbnail = (thumb?: string) => {
    if (!thumb) return null
    if (thumb === 'zelda') return <ZeldaArtworkThumbnail size={40} />
    if (thumb === 'camera') return <CameraThumbnail size={40} />
    if (thumb === 'doc') return <DocThumbnail size={40} />
    if (thumb === 'twitter') return <TwitterThumbnail size={40} />
    return null
  }

  // Active folder name for header
  const currentFolderName = useMemo(() => {
    const f = folders.find((item) => item.id === activeFolderId)
    return f ? f.name : 'Notes'
  }, [folders, activeFolderId])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: isDark ? '#1C1C1C' : '#FFFFFF',
        color: isDark ? '#F5F5F5' : '#1D1D1F',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        transition: 'background-color 200ms ease, color 200ms ease',
      }}
    >
      {/* ─── 1. TOP UNIFIED macOS TOOLBAR (Matching Images 1 & 2) ─────────────── */}
      <div
        onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
        onDoubleClick={() => windowContext?.toggleMaximize()}
        style={{
          height: 48,
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          backgroundColor: isDark ? '#1E1E1E' : '#F7F7F8',
          borderBottom: isDark ? '0.5px solid rgba(255, 255, 255, 0.08)' : '0.5px solid rgba(0, 0, 0, 0.12)',
          zIndex: 40,
          position: 'relative',
          transition: 'background-color 200ms ease, border-color 200ms ease',
        }}
      >
        {/* Left Section: Traffic Lights & Sidebar Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Traffic Lights */}
          <TrafficLights />

          {/* Toggle Sidebar Button [| ] */}
          <button
            onClick={() => {
              soundEngine.play('pop')
              setIsSidebarOpen(!isSidebarOpen)
            }}
            title="Toggle Folders Sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: 6,
              padding: '4px',
              cursor: 'pointer',
              color: isDark ? '#A1A1A6' : '#636366',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Center / Right Toolbar Icons (Exact Match to Image 1 & 2) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Undo */}
          <button
            onClick={() => soundEngine.play('click')}
            title="Undo"
            style={toolbarButtonStyle(isDark)}
          >
            <Undo2 size={16} />
          </button>

          {/* Redo */}
          <button
            onClick={() => soundEngine.play('click')}
            title="Redo"
            style={toolbarButtonStyle(isDark)}
          >
            <Redo2 size={16} />
          </button>

          {/* Format Menu Button (Aa) - Opens Apple Format Popover from Image 1! */}
          <button
            onClick={() => {
              soundEngine.play('pop')
              setIsFormatMenuOpen(!isFormatMenuOpen)
            }}
            title="Format Style (Aa)"
            style={{
              ...toolbarButtonStyle(isDark),
              backgroundColor: isFormatMenuOpen ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)') : 'transparent',
              color: isFormatMenuOpen ? '#E5A000' : isDark ? '#A1A1A6' : '#636366',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700 }}>Aa</span>
          </button>

          {/* Checklist Toggle Button */}
          <button
            onClick={() => {
              soundEngine.play('click')
              document.dispatchEvent(new CustomEvent('notes-toggle-checklist'))
            }}
            title="Insert Checklist (⇧⌘L)"
            style={toolbarButtonStyle(isDark)}
          >
            <CheckSquare size={16} />
          </button>

          {/* Table Insert Button */}
          <button
            onClick={() => {
              soundEngine.play('pop')
              document.dispatchEvent(new CustomEvent('notes-insert-table'))
            }}
            title="Insert Table"
            style={toolbarButtonStyle(isDark)}
          >
            <TableIcon size={16} />
          </button>

          {/* Attachment / Camera Icon (Image 1) */}
          <button
            onClick={() => imageFileInputRef.current?.click()}
            title="Attach Photo or File"
            style={toolbarButtonStyle(isDark)}
          >
            <ImageIcon size={16} />
          </button>

          {/* Share Button (Image 1 & 2) */}
          <button
            onClick={() => {
              soundEngine.play('action')
              if (navigator.clipboard && selectedNote) {
                navigator.clipboard.writeText(selectedNote.plainText || selectedNote.title)
              }
            }}
            title="Share Note"
            style={toolbarButtonStyle(isDark)}
          >
            <Share size={16} />
          </button>

          {/* Collaborator Icon (Image 2) */}
          <button
            onClick={() => soundEngine.play('action')}
            title="Add People"
            style={toolbarButtonStyle(isDark)}
          >
            <UserPlus size={16} />
          </button>

          {/* Trash / Delete (Image 2) */}
          {selectedNote && (
            <button
              onClick={() => handleDeleteNote(selectedNote.id)}
              title="Delete Note"
              style={toolbarButtonStyle(isDark)}
            >
              <Trash2 size={16} color="#FF3B30" />
            </button>
          )}

          {/* More Actions (···) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              title="More Actions"
              style={toolbarButtonStyle(isDark)}
            >
              <MoreHorizontal size={16} />
            </button>

            <AnimatePresence>
              {isMoreMenuOpen && selectedNote && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 4 }}
                  style={{
                    position: 'absolute',
                    top: 32,
                    right: 0,
                    width: 160,
                    backgroundColor: isDark ? 'rgba(40, 40, 40, 0.96)' : 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 8,
                    border: isDark ? '0.5px solid rgba(255,255,255,0.14)' : '0.5px solid rgba(0,0,0,0.12)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                    padding: 4,
                    zIndex: 100,
                  }}
                >
                  <button
                    onClick={() => {
                      handleTogglePin(selectedNote.id)
                      setIsMoreMenuOpen(false)
                    }}
                    style={dropdownItemStyle(isDark)}
                  >
                    {selectedNote.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
                    <span>{selectedNote.isPinned ? 'Unpin Note' : 'Pin Note'}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleToggleStar(selectedNote.id)
                      setIsMoreMenuOpen(false)
                    }}
                    style={dropdownItemStyle(isDark)}
                  >
                    <Star size={13} />
                    <span>{selectedNote.isStarred ? 'Unstar' : 'Star Note'}</span>
                  </button>

                  <button
                    onClick={() => setIsMoreMenuOpen(false)}
                    style={dropdownItemStyle(isDark)}
                  >
                    <Lock size={13} />
                    <span>Lock Note</span>
                  </button>

                  <div style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', margin: '4px 0' }} />

                  <button
                    onClick={() => {
                      handleDeleteNote(selectedNote.id)
                      setIsMoreMenuOpen(false)
                    }}
                    style={{ ...dropdownItemStyle(isDark), color: '#FF453A' }}
                  >
                    <Trash2 size={13} />
                    <span>Delete Note</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* New Note Compose Button (Image 1 & 2) */}
          <button
            onClick={handleCreateNewNote}
            title="New Note (⌘N)"
            style={{
              ...toolbarButtonStyle(isDark),
              color: isDark ? '#FFD60A' : '#E5A000',
            }}
          >
            <SquarePen size={17} />
          </button>

          {/* Keyboard Shortcuts Button */}
          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            title="Keyboard Shortcuts (⌘/)"
            style={toolbarButtonStyle(isDark)}
          >
            <HelpCircle size={15} />
          </button>
        </div>
      </div>

      {/* ─── 2. THREE-PANEL WORKSPACE ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* PANEL 1: LEFT SIDEBAR (FOLDERS) — Matching Image 2 */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              style={{
                width: 220,
                backgroundColor: isDark ? '#1E1E1E' : '#F7F7F8',
                borderRight: isDark ? '0.5px solid rgba(255, 255, 255, 0.08)' : '0.5px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {/* Folders Header (Image 2) */}
              <div
                style={{
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 12px',
                  borderBottom: isDark ? '0.5px solid rgba(255, 255, 255, 0.06)' : '0.5px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#fff' : '#1D1D1F' }}>Folders</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#E5A000', cursor: 'pointer' }}>Edit</span>
              </div>

              {/* Folders List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: isDark ? '#777' : '#8E8E93', padding: '4px 8px 6px', textTransform: 'uppercase' }}>
                  ICLOUD
                </div>

                {folders.map((folder) => {
                  const isActive = activeFolderId === folder.id
                  return (
                    <div
                      key={folder.id}
                      onClick={() => {
                        soundEngine.play('click')
                        setActiveFolderId(folder.id)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 12.5,
                        fontWeight: isActive ? 600 : 450,
                        cursor: 'pointer',
                        backgroundColor: isActive
                          ? (isDark ? 'rgba(229, 160, 0, 0.2)' : '#FCE8B3')
                          : 'transparent',
                        color: isActive
                          ? (isDark ? '#FFD60A' : '#734B00')
                          : isDark ? '#D1D1D6' : '#1D1D1F',
                        marginBottom: 2,
                        transition: 'background-color 100ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                        <span style={{ fontSize: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 17, height: 17, flexShrink: 0 }}>
                          {folder.id === 'shared' ? '👥' :
                           folder.id === 'articles' ? '📖' :
                           folder.id === 'private' ? '🔒' :
                           folder.id === 'travel' ? '✈️' :
                           folder.id === 'recently-deleted' ? '🗑️' :
                           <MacOSFolderIcon size={17} />}
                        </span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {folder.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.65, fontSize: 11 }}>
                        <span>{folderCounts[folder.id] || folder.count || 0}</span>
                        <span>›</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Sidebar Footer: New Folder & Theme Switcher (Image 2) */}
              <div
                style={{
                  height: 38,
                  padding: '0 12px',
                  borderTop: isDark ? '0.5px solid rgba(255, 255, 255, 0.08)' : '0.5px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={toggleTheme}
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: isDark ? '#FFD60A' : '#E5A000',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {isDark ? <Sun size={14} /> : <Moon size={14} />}
                </button>

                <button
                  onClick={() => soundEngine.play('action')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#E5A000',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  New Folder
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PANEL 2: MIDDLE PANEL (NOTES LIST) — Matching Images 1 & 2 */}
        <div
          style={{
            width: middlePanelWidth,
            minWidth: 220,
            maxWidth: 420,
            backgroundColor: isDark ? '#242424' : '#FFFFFF',
            borderRight: isDark ? '0.5px solid rgba(255, 255, 255, 0.08)' : '0.5px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* Large Title & Search (Exact Match to Image 1 "All iCloud" or Image 2 "Notes") */}
          <div style={{ padding: '12px 14px 10px', borderBottom: isDark ? '0.5px solid rgba(255, 255, 255, 0.06)' : '0.5px solid rgba(0, 0, 0, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: isDark ? '#fff' : '#1D1D1F' }}>
                {currentFolderName}
              </h1>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#E5A000', cursor: 'pointer' }}>Edit</span>
            </div>

            {/* Pill Search Capsule */}
            <div
              style={{
                height: 28,
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : '#E5E5EA',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                gap: 6,
              }}
            >
              <Search size={13} color={isDark ? '#8A8A8A' : '#8E8E93'} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: 12,
                  color: isDark ? '#FFFFFF' : '#1D1D1F',
                  fontFamily: '-apple-system, sans-serif',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: isDark ? '#8A8A8A' : '#8E8E93',
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Notes Cards List with Grouping and Right-Side Thumbnails */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
            {/* 1. PINNED NOTES SECTION */}
            {pinnedNotes.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div
                  onClick={() => setIsPinnedCollapsed(!isPinnedCollapsed)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: isDark ? '#8A8A8A' : '#8E8E93',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                  }}
                >
                  <span>Pinned</span>
                  <ChevronDown
                    size={13}
                    style={{
                      transform: isPinnedCollapsed ? 'rotate(-90deg)' : 'none',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                </div>

                {!isPinnedCollapsed &&
                  pinnedNotes.map((note) => renderNoteCard(note))}
              </div>
            )}

            {/* 2. TODAY NOTES SECTION */}
            {todayNotes.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: isDark ? '#8A8A8A' : '#8E8E93',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Today
                </div>
                {todayNotes.map((note) => renderNoteCard(note))}
              </div>
            )}

            {/* 3. YESTERDAY NOTES SECTION */}
            {yesterdayNotes.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: isDark ? '#8A8A8A' : '#8E8E93',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Yesterday
                </div>
                {yesterdayNotes.map((note) => renderNoteCard(note))}
              </div>
            )}
          </div>

          {/* Bottom Status Bar (Image 1: ☀️ 972 Notes) */}
          <div
            style={{
              height: 32,
              borderTop: isDark ? '0.5px solid rgba(255, 255, 255, 0.06)' : '0.5px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              color: isDark ? '#777' : '#8E8E93',
              gap: 6,
            }}
          >
            <span>☀️</span>
            <span>{filteredNotes.length} Notes</span>
          </div>
        </div>

        {/* DRAG HANDLE FOR RESIZING MIDDLE PANEL */}
        <div
          onMouseDown={handleStartResize}
          style={{
            width: 4,
            cursor: 'col-resize',
            position: 'relative',
            zIndex: 10,
            backgroundColor: isDraggingHandle ? '#007AFF' : 'transparent',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.4)')}
          onMouseLeave={(e) => {
            if (!isDraggingHandle) e.currentTarget.style.backgroundColor = 'transparent'
          }}
        />

        {/* PANEL 3: RIGHT PANEL (TIPTAP EDITOR) — Flex-grow */}
        <NotesEditor
          note={selectedNote}
          isDark={isDark}
          onUpdateNote={handleUpdateNote}
          onTriggerImageUpload={() => imageFileInputRef.current?.click()}
          imageFileInputRef={imageFileInputRef}
          isFormatPopoverOpen={isFormatMenuOpen}
          onCloseFormatPopover={() => setIsFormatMenuOpen(false)}
        />
      </div>

      {/* ─── 3. OVERLAYS & MODALS ────────────────────────────────────────────── */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        note={contextMenu.note}
        isDark={isDark}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onTogglePin={handleTogglePin}
        onToggleStar={handleToggleStar}
        onDeleteNote={handleDeleteNote}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        isDark={isDark}
      />
    </div>
  )

  // ── Helper to Render Individual Note Card with Thumbnail ───────────────────
  function renderNoteCard(note: NoteItem) {
    const isSelected = note.id === selectedNote?.id
    return (
      <motion.div
        key={note.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.14 }}
        onClick={() => {
          soundEngine.play('click')
          setSelectedNoteId(note.id)
          setMobileView('editor')
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          setContextMenu({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
            note,
          })
        }}
        style={{
          padding: '10px 12px',
          borderRadius: 8,
          marginBottom: 3,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          backgroundColor: isSelected
            ? (isDark ? 'rgba(229, 160, 0, 0.22)' : '#FDF4D8')
            : 'transparent',
          borderLeft: isSelected
            ? `3.5px solid ${isDark ? '#FFD60A' : '#E5A000'}`
            : '3.5px solid transparent',
          boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
          transition: 'background-color 140ms ease, border-left-color 140ms ease',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {/* Title */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? '#FFFFFF' : '#1D1D1F',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: 3,
            }}
          >
            {renderHighlightedText(note.title || 'New Note', searchQuery)}
          </div>

          {/* Subtitle / Snippet */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontSize: 11.5, color: isDark ? '#8A8A8A' : '#8E8E93' }}>
            <span style={{ fontWeight: 500, flexShrink: 0 }}>
              {formatNoteListDate(note.updatedAt)}
            </span>
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                opacity: 0.85,
              }}
            >
              {renderHighlightedText(note.plainText || 'No additional text', searchQuery)}
            </span>
          </div>

          {/* Folder Tag (Image 1 & 2: 📁 Notes) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, fontSize: 11, color: isDark ? '#8E8E93' : '#8E8E93' }}>
            <MacOSFolderIcon size={12} />
            <span>{folders.find((f) => f.id === note.folderId)?.name?.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() || 'Notes'}</span>
          </div>
        </div>

        {/* Right-Side Thumbnail Preview (Matching Image 1 & 2!) */}
        {renderCardThumbnail(note.thumbnailType)}
      </motion.div>
    )
  }
}

// ─── Style Helpers ──────────────────────────────────────────────────────────

function toolbarButtonStyle(isDark: boolean): React.CSSProperties {
  return {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: 'none',
    backgroundColor: 'transparent',
    color: isDark ? '#A1A1A6' : '#636366',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease, color 0.1s ease',
  }
}

function dropdownItemStyle(isDark: boolean): React.CSSProperties {
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
    fontSize: 11.5,
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
  }
}
