'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowUp,
  PanelLeft,
  LayoutGrid,
  List,
  Columns,
  Image as ImageIcon,
  FolderPlus,
  Search,
  X,
  Eye,
  Info,
  SlidersHorizontal,
  Home as HomeIcon,
  Layers,
  Monitor,
  FileText,
  Download,
  Share2,
  Building2,
  Check,
  User,
  Briefcase,
  GitBranch,
  Cpu,
  Trash2,
  Copy,
  ClipboardPaste,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { useWindowContext } from '@/app/components/os/Window'
import { useWindowStore, ACCENT_COLOR_MAP } from '@/app/store/windowStore'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'
import MacOSFolderIcon from './notes/MacOSFolderIcon'
import FinderFileIcon from './finder/FinderFileIcon'
import ColumnView from './finder/ColumnView'
import FinderContextMenu from './finder/FinderContextMenu'
import LangGraphVisualizer from './LangGraphVisualizer'
import AboutView from './about/AboutView'
import PhilosophyView from './about/PhilosophyView'
import TechStackView from './about/TechStackView'
import ContactView from './about/ContactView'
import { FSEntry, FileTag, TAG_COLORS, INITIAL_FS_ENTRIES } from './finder/finderData'

export type FinderViewMode = 'icon' | 'list' | 'column' | 'gallery'
export type SortField = 'name' | 'dateModified' | 'size' | 'kind'

interface FinderTab {
  id: string
  name: string
  path: string
}

export default function Finder() {
  const windowContext = useWindowContext()
  const {
    finderPendingFile,
    clearFinderPendingFile,
    openWindow,
    restoreWindow,
    focusWindow,
    windows,
    appearanceMode,
    accentColor,
  } = useWindowStore()

  const isDark = appearanceMode === 'dark'
  const accentHex = ACCENT_COLOR_MAP[accentColor]?.hex || '#007AFF'

  // ── Filesystem State ────────────────────────────────────────────────────────
  const [fsEntries, setFsEntries] = useState<FSEntry[]>(INITIAL_FS_ENTRIES)
  const [currentPath, setCurrentPath] = useState<string>('/Users/yamin/02_Resume_&_Credentials')
  const [history, setHistory] = useState<string[]>(['/Users/yamin/02_Resume_&_Credentials'])
  const [historyIndex, setHistoryIndex] = useState(0)

  // ── Tabs State ─────────────────────────────────────────────────────────────
  const [tabs, setTabs] = useState<FinderTab[]>([
    { id: 'tab-resume', name: 'Resume', path: '/Users/yamin/02_Resume_&_Credentials' },
    { id: 'tab-projects', name: 'Projects', path: '/Users/yamin/03_Production_AI_Agents' },
    { id: 'tab-about', name: 'About Me', path: '/Users/yamin/01_About_Me' },
  ])
  const [activeTabId, setActiveTabId] = useState<string>('tab-resume')

  // ── View & Layout State ────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<FinderViewMode>('icon')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(210)
  const [isGetInfoOpen, setIsGetInfoOpen] = useState(false)
  const [isQuickLookOpen, setIsQuickLookOpen] = useState(false)
  const [quickLookTab, setQuickLookTab] = useState<'preview' | 'visualizer'>('preview')

  // ── Sorting & Search ───────────────────────────────────────────────────────
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false)

  // ── Selection, Renaming & Clipboard ────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<string[]>(['resume-main-pdf'])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNameVal, setEditNameVal] = useState('')
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FSEntry | null } | null>(null)
  const [clipboard, setClipboard] = useState<{ items: FSEntry[]; mode: 'copy' | 'cut' } | null>(null)
  const [hudToast, setHudToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setHudToast(msg)
    setTimeout(() => {
      setHudToast((cur) => (cur === msg ? null : cur))
    }, 2200)
  }

  // ── Sidebar Tree Expansion ─────────────────────────────────────────────────
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({
    '/Users/yamin': true,
    '/Users/yamin/03_Production_AI_Agents': true,
  })

  // ── Marquee / Lasso Drag State ─────────────────────────────────────────────
  const canvasRef = useRef<HTMLDivElement>(null)
  const [lassoRect, setLassoRect] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null)

  // ── Handle Pending Files from Spotlight or JD Analyzer ─────────────────────
  useEffect(() => {
    if (finderPendingFile) {
      const target = finderPendingFile.toLowerCase()
      clearFinderPendingFile()

      const found = fsEntries.find(
        (f) =>
          f.name.toLowerCase().includes(target) ||
          f.id.toLowerCase().includes(target) ||
          (f.contentKey && target.includes(f.contentKey.toLowerCase()))
      )

      if (found) {
        setCurrentPath(found.parentPath)
        setSelectedIds([found.id])
        if (target.includes('langgraph') || target.includes('pipeline') || found.id.includes('pr-review')) {
          setQuickLookTab('visualizer')
        } else {
          setQuickLookTab('preview')
        }
        setIsQuickLookOpen(true)
      }
    }
  }, [finderPendingFile, clearFinderPendingFile, fsEntries])

  // ── Navigation Functions ───────────────────────────────────────────────────
  const navigateTo = (newPath: string, addToHistory = true) => {
    soundEngine.play('pop')
    setCurrentPath(newPath)
    setSelectedIds([])
    setEditingId(null)

    if (addToHistory) {
      const next = history.slice(0, historyIndex + 1)
      next.push(newPath)
      setHistory(next)
      setHistoryIndex(next.length - 1)
    }

    // Sync active tab path and label
    const rawName = newPath.split('/').filter(Boolean).pop() || 'Home'
    const cleanName = rawName.replace(/^\d+_/, '').replace(/_/g, ' ')
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, name: cleanName, path: newPath } : t))
    )
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1
      setHistoryIndex(prevIdx)
      navigateTo(history[prevIdx], false)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      navigateTo(history[nextIdx], false)
    }
  }

  const goUp = () => {
    if (currentPath === '/' || currentPath === '/Users/yamin') return
    const parent = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/Users/yamin'
    navigateTo(parent)
  }

  // ── Tab Management ─────────────────────────────────────────────────────────
  const handleSelectTab = (tab: FinderTab) => {
    soundEngine.play('click')
    setActiveTabId(tab.id)
    navigateTo(tab.path, true)
  }

  const handleAddTab = () => {
    soundEngine.play('pop')
    const rawName = currentPath.split('/').filter(Boolean).pop() || 'Folder'
    const cleanName = rawName.replace(/^\d+_/, '').replace(/_/g, ' ')
    const newTab: FinderTab = {
      id: `tab-${Date.now()}`,
      name: cleanName,
      path: currentPath,
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newTab.id)
  }

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    soundEngine.play('close')
    if (tabs.length <= 1) return
    const remaining = tabs.filter((t) => t.id !== tabId)
    setTabs(remaining)
    if (activeTabId === tabId) {
      const nextActive = remaining[remaining.length - 1]
      setActiveTabId(nextActive.id)
      navigateTo(nextActive.path, false)
    }
  }

  // ── Current Directory Entries ──────────────────────────────────────────────
  const currentEntries = useMemo(() => {
    let items = fsEntries.filter((e) => e.parentPath === currentPath)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(
        (it) => it.name.toLowerCase().includes(q) || it.kind.toLowerCase().includes(q)
      )
    }

    // Sort items
    items.sort((a, b) => {
      // Folders first
      if (a.isFolder && !b.isFolder) return -1
      if (!a.isFolder && b.isFolder) return 1

      let diff = 0
      if (sortField === 'name') {
        diff = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      } else if (sortField === 'size') {
        diff = a.sizeBytes - b.sizeBytes
      } else if (sortField === 'dateModified') {
        diff = a.dateModified.localeCompare(b.dateModified)
      } else if (sortField === 'kind') {
        diff = a.kind.localeCompare(b.kind)
      }
      return sortAsc ? diff : -diff
    })

    return items
  }, [fsEntries, currentPath, searchQuery, sortField, sortAsc])

  // Selected item object
  const selectedItem = useMemo(() => {
    if (selectedIds.length === 0) return null
    return fsEntries.find((e) => e.id === selectedIds[0]) || null
  }, [selectedIds, fsEntries])

  // ── Opening Files: Resume.pdf Opens Dedicated Window (Image Match!) ────────
  const handleOpenFile = (item: FSEntry) => {
    if (item.isFolder) {
      navigateTo(`${item.parentPath}/${item.name}`)
      return
    }

    // Direct Link / URL Shortcut: Open in new browser tab!
    if (item.url || item.kind === 'link') {
      soundEngine.play('pop')
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer')
      }
      return
    }

    // If Resume.pdf is opened -> Open dedicated macOS Resume.pdf window!
    if (item.name === 'Resume.pdf' || item.id.includes('resume')) {
      soundEngine.play('pop')
      const existing = windows.find((w) => w.id === 'resume')
      if (existing) {
        if (existing.isMinimized) restoreWindow(existing.id)
        else focusWindow(existing.id)
      } else {
        openWindow({
          id: 'resume',
          title: 'Resume.pdf',
          isOpen: true,
          isMinimized: false,
          position: {
            x: Math.min(window.innerWidth - 750, 480),
            y: 48,
          },
          size: { width: 730, height: 760 },
        })
      }
      return
    }

    // Custom views for 01_About_Me files:
    if (
      item.id === 'about-bio' ||
      item.name.includes('Bio & Engineering Journey') ||
      item.id === 'about-philosophy' ||
      item.name.includes('Engineering Philosophy') ||
      item.id === 'about-stack' ||
      item.name.includes('Tech Stack') ||
      item.id === 'about-contact' ||
      item.name.includes('Contact & Socials') ||
      item.name.toLowerCase().includes('about')
    ) {
      soundEngine.play('chime')
      setQuickLookTab('preview')
      setIsQuickLookOpen(true)
      return
    }

    // Interactive visualizer for PR Review Agent
    if (item.id === 'pr-interactive-app' || item.contentKey === 'pr-review-agent') {
      soundEngine.play('chime')
      setQuickLookTab('visualizer')
      setIsQuickLookOpen(true)
      return
    }

    // Default Quick Look
    soundEngine.play('chime')
    setQuickLookTab('preview')
    setIsQuickLookOpen(true)
  }

  // ── macOS Copy & Paste Engine (⌘C, ⌘V, ⌥⌘V) ────────────────────────────────
  const handleCopy = (itemsToCopy: FSEntry[] = []) => {
    const targetItems = itemsToCopy.length > 0 ? itemsToCopy : currentEntries.filter((e) => selectedIds.includes(e.id))
    if (targetItems.length === 0) return
    soundEngine.play('click')
    setClipboard({ items: targetItems, mode: 'copy' })
    showToast(`Copied ${targetItems.length} item${targetItems.length > 1 ? 's' : ''}`)
  }

  const handleCut = (itemsToCut: FSEntry[] = []) => {
    const targetItems = itemsToCut.length > 0 ? itemsToCut : currentEntries.filter((e) => selectedIds.includes(e.id))
    if (targetItems.length === 0) return
    soundEngine.play('click')
    setClipboard({ items: targetItems, mode: 'cut' })
    showToast(`Cut ${targetItems.length} item${targetItems.length > 1 ? 's' : ''}`)
  }

  const handlePaste = () => {
    if (!clipboard || clipboard.items.length === 0) return
    soundEngine.play('pop')

    if (clipboard.mode === 'cut') {
      const movedIds = new Set(clipboard.items.map((it) => it.id))
      setFsEntries((prev) =>
        prev.map((entry) => {
          if (movedIds.has(entry.id)) {
            return {
              ...entry,
              parentPath: currentPath,
              dateModified: 'Just now',
            }
          }
          return entry
        })
      )
      setClipboard(null)
      setSelectedIds(clipboard.items.map((it) => it.id))
      showToast(`Moved ${clipboard.items.length} item${clipboard.items.length > 1 ? 's' : ''}`)
      return
    }

    // Copy mode: clone each item with macOS duplicate naming
    const existingNamesInFolder = new Set(fsEntries.filter((e) => e.parentPath === currentPath).map((e) => e.name))
    const newPastedEntries: FSEntry[] = []

    clipboard.items.forEach((sourceItem) => {
      let targetName = sourceItem.name
      if (sourceItem.parentPath === currentPath || existingNamesInFolder.has(targetName)) {
        const dotIdx = targetName.lastIndexOf('.')
        const base = dotIdx > 0 ? targetName.substring(0, dotIdx) : targetName
        const ext = dotIdx > 0 ? targetName.substring(dotIdx) : ''
        let copyCount = 1
        targetName = `${base} copy${ext}`
        while (existingNamesInFolder.has(targetName)) {
          copyCount++
          targetName = `${base} copy ${copyCount}${ext}`
        }
      }

      const newItem: FSEntry = {
        ...sourceItem,
        id: `${sourceItem.id}-copy-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: targetName,
        parentPath: currentPath,
        dateModified: 'Just now',
        dateCreated: 'Today at 9:41 AM',
      }
      existingNamesInFolder.add(targetName)
      newPastedEntries.push(newItem)
    })

    setFsEntries((prev) => [...prev, ...newPastedEntries])
    setSelectedIds(newPastedEntries.map((it) => it.id))
    showToast(`Pasted ${newPastedEntries.length} item${newPastedEntries.length > 1 ? 's' : ''}`)
  }

  // ── Operations: New Folder, Rename, Delete, Duplicate ──────────────────────
  const handleCreateNewFolder = () => {
    soundEngine.play('pop')
    let baseName = 'untitled folder'
    let counter = 1
    while (fsEntries.some((e) => e.parentPath === currentPath && e.name === baseName)) {
      baseName = `untitled folder ${counter}`
      counter++
    }

    const newFolder: FSEntry = {
      id: `folder-${Date.now()}`,
      name: baseName,
      isFolder: true,
      kind: 'folder',
      size: '--',
      sizeBytes: 0,
      dateModified: 'Today at 9:41 AM',
      dateCreated: 'Today at 9:41 AM',
      parentPath: currentPath,
    }

    setFsEntries((prev) => [...prev, newFolder])
    setSelectedIds([newFolder.id])
    setEditingId(newFolder.id)
    setEditNameVal(newFolder.name)
  }

  const handleCreateNewFile = () => {
    soundEngine.play('pop')
    let baseName = 'untitled.txt'
    let counter = 1
    while (fsEntries.some((e) => e.parentPath === currentPath && e.name === baseName)) {
      baseName = `untitled ${counter}.txt`
      counter++
    }

    const newFile: FSEntry = {
      id: `file-${Date.now()}`,
      name: baseName,
      isFolder: false,
      kind: 'text',
      size: '0 B',
      sizeBytes: 0,
      dateModified: 'Just now',
      dateCreated: 'Today at 9:41 AM',
      parentPath: currentPath,
      content: '',
    }

    setFsEntries((prev) => [...prev, newFile])
    setSelectedIds([newFile.id])
    setEditingId(newFile.id)
    setEditNameVal(newFile.name)
    showToast('Created new file')
  }

  const handleRefresh = () => {
    soundEngine.play('pop')
    showToast('View Refreshed')
  }

  const handleCleanUp = () => {
    soundEngine.play('pop')
    setSortField('name')
    setSortAsc(true)
    showToast('Cleaned Up by Name')
  }

  const handleStartRename = (item: FSEntry) => {
    setEditingId(item.id)
    setEditNameVal(item.name)
  }

  const handleCommitRename = () => {
    if (!editingId) return
    const trimmed = editNameVal.trim()
    if (trimmed) {
      setFsEntries((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, name: trimmed } : e))
      )
    }
    setEditingId(null)
  }

  const handleDeleteItem = (id: string) => {
    soundEngine.play('close')
    setFsEntries((prev) => prev.filter((e) => e.id !== id))
    setSelectedIds([])
    showToast('Moved to Trash')
  }

  const handleDuplicateItem = (item: FSEntry) => {
    soundEngine.play('pop')
    const dotIdx = item.name.lastIndexOf('.')
    const base = dotIdx > 0 ? item.name.substring(0, dotIdx) : item.name
    const ext = dotIdx > 0 ? item.name.substring(dotIdx) : ''
    const copyName = `${base} copy${ext}`

    const dup: FSEntry = {
      ...item,
      id: `item-${Date.now()}`,
      name: copyName,
      dateModified: 'Today at 9:41 AM',
      dateCreated: 'Today at 9:41 AM',
    }
    setFsEntries((prev) => [...prev, dup])
    setSelectedIds([dup.id])
    showToast(`Duplicated ${item.name}`)
  }

  const handleSetTag = (item: FSEntry, tag?: FileTag) => {
    soundEngine.play('click')
    setFsEntries((prev) =>
      prev.map((e) => (e.id === item.id ? { ...e, tag } : e))
    )
  }

  // ── Keyboard Shortcuts (⌘C, ⌘V, ⌥⌘V, ⌘D, Enter, Space) ─────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingId !== null || (e.target as HTMLElement).tagName === 'INPUT') return

      const isMeta = e.metaKey || e.ctrlKey

      // ⌘C: Copy
      if (isMeta && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        handleCopy()
        return
      }

      // ⌘V: Paste
      if (isMeta && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        handlePaste()
        return
      }

      // ⌘X: Cut
      if (isMeta && e.key.toLowerCase() === 'x') {
        e.preventDefault()
        handleCut()
        return
      }

      // Space: Quick Look
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        if (selectedItem) {
          handleOpenFile(selectedItem)
        }
        return
      }

      // Enter: Rename
      if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedItem) {
          handleStartRename(selectedItem)
        }
        return
      }

      // ⌘Backspace: Delete
      if (isMeta && e.key === 'Backspace') {
        e.preventDefault()
        if (selectedItem) {
          handleDeleteItem(selectedItem.id)
        }
        return
      }

      // ⌘D: Duplicate
      if (isMeta && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        if (selectedItem) {
          handleDuplicateItem(selectedItem)
        }
        return
      }

      // ⌘I: Get Info
      if (isMeta && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        setIsGetInfoOpen((prev) => !prev)
        return
      }

      // ⌘R: Refresh
      if (isMeta && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        handleRefresh()
        return
      }

      // Escape: Close context menu
      if (e.key === 'Escape') {
        setContextMenu(null)
      }

      // ⌘⇧N: New Folder
      if (isMeta && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        handleCreateNewFolder()
        return
      }

      // ⌘T: New Tab
      if (isMeta && e.key.toLowerCase() === 't') {
        e.preventDefault()
        handleAddTab()
        return
      }

      // ⌘W: Close Tab
      if (isMeta && e.key.toLowerCase() === 'w') {
        e.preventDefault()
        if (tabs.length > 1) {
          handleCloseTab(e as any, activeTabId)
        }
        return
      }

      // Arrow navigation
      if (isMeta && e.key === 'ArrowUp') {
        e.preventDefault()
        goUp()
        return
      }
      if (isMeta && e.key === 'ArrowDown') {
        e.preventDefault()
        if (selectedItem) {
          handleOpenFile(selectedItem)
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingId, selectedItem, currentPath, activeTabId, tabs, clipboard, selectedIds, currentEntries])

  // ── Drag & Lasso Selection ─────────────────────────────────────────────────
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-finder-item]')) return
    setSelectedIds([])
    setContextMenu(null)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setLassoRect({
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      currentX: e.clientX - rect.left,
      currentY: e.clientY - rect.top,
    })
  }

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!lassoRect || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    setLassoRect((prev) =>
      prev ? { ...prev, currentX: e.clientX - rect.left, currentY: e.clientY - rect.top } : null
    )
  }

  const handleCanvasPointerUp = () => {
    setLassoRect(null)
  }

  // Active folder clean label
  const rawFolderName = currentPath.split('/').filter(Boolean).pop() || 'Home'
  const currentFolderName = rawFolderName.replace(/^\d+_/, '').replace(/_/g, ' ')

  return (
    <div
      onClick={() => setContextMenu(null)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ─── 1. WINDOW TITLEBAR & UNIFIED TOOLBAR (48px) ────────────────────── */}
      <div
        onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
        style={{
          height: 48,
          backgroundColor: '#EBECEF',
          borderBottom: '1px solid #D5D7DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          flexShrink: 0,
        }}
      >
        {/* Left Side: Traffic Lights & Sidebar / View Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Traffic Lights */}
          <TrafficLights />

          {/* Sidebar Toggle & Layout Split Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 6 }}>
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title="Toggle Sidebar"
              style={{
                width: 28,
                height: 24,
                borderRadius: 5,
                border: 'none',
                backgroundColor: isSidebarOpen ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4A4C52',
                cursor: 'pointer',
              }}
            >
              <PanelLeft size={15} />
            </button>
            <button
              onClick={() => soundEngine.play('click')}
              title="Window Split Options"
              style={{
                width: 28,
                height: 24,
                borderRadius: 5,
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4A4C52',
                cursor: 'pointer',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center: Navigation Group & Directory Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Back & Forward Arrows */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: 6,
              padding: 2,
            }}
          >
            <button
              onClick={goBack}
              disabled={historyIndex <= 0}
              title="Back (⌘[)"
              style={{
                width: 26,
                height: 22,
                borderRadius: 4,
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: historyIndex > 0 ? '#1D1D1F' : '#A1A1A6',
                cursor: historyIndex > 0 ? 'pointer' : 'default',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              title="Forward (⌘])"
              style={{
                width: 26,
                height: 22,
                borderRadius: 4,
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: historyIndex < history.length - 1 ? '#1D1D1F' : '#A1A1A6',
                cursor: historyIndex < history.length - 1 ? 'pointer' : 'default',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Up (Parent Folder) Arrow */}
          <button
            onClick={goUp}
            disabled={currentPath === '/' || currentPath === '/Users/yamin'}
            title="Enclosing Folder (⌘↑)"
            style={{
              width: 26,
              height: 24,
              borderRadius: 5,
              border: 'none',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentPath !== '/Users/yamin' ? '#1D1D1F' : '#A1A1A6',
              cursor: currentPath !== '/Users/yamin' ? 'pointer' : 'default',
            }}
          >
            <ArrowUp size={15} />
          </button>

          {/* Directory Title (Bold) */}
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#1D1D1F',
              letterSpacing: '-0.015em',
            }}
          >
            {currentFolderName}
          </span>
        </div>

        {/* Right Side: Actions (New Folder, View Mode, Sort, Search) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* New Folder Button [📁+] */}
          <button
            onClick={handleCreateNewFolder}
            title="New Folder (⌘⇧N)"
            style={{
              width: 32,
              height: 26,
              borderRadius: 6,
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333336',
              cursor: 'pointer',
            }}
          >
            <FolderPlus size={15} />
          </button>

          {/* View Mode Switcher Dropdown [⊞ ∨] */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsViewMenuOpen((prev) => !prev)}
              title="Change View"
              style={{
                height: 26,
                padding: '0 8px',
                borderRadius: 6,
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: '#333336',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {viewMode === 'icon' && <LayoutGrid size={15} />}
              {viewMode === 'list' && <List size={15} />}
              {viewMode === 'column' && <Columns size={15} />}
              {viewMode === 'gallery' && <ImageIcon size={15} />}
              <ChevronDown size={12} opacity={0.6} />
            </button>

            {isViewMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 30,
                  right: 0,
                  width: 140,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  padding: '4px',
                  zIndex: 100,
                }}
              >
                {(
                  [
                    { mode: 'icon', label: 'as Icons', icon: LayoutGrid },
                    { mode: 'list', label: 'as List', icon: List },
                    { mode: 'column', label: 'as Columns', icon: Columns },
                    { mode: 'gallery', label: 'as Gallery', icon: ImageIcon },
                  ] as const
                ).map((v) => {
                  const Icon = v.icon
                  return (
                    <div
                      key={v.mode}
                      onClick={() => {
                        soundEngine.play('click')
                        setViewMode(v.mode)
                        setIsViewMenuOpen(false)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 8px',
                        borderRadius: 5,
                        fontSize: 12,
                        cursor: 'pointer',
                        color: viewMode === v.mode ? '#007AFF' : '#1D1D1F',
                        backgroundColor: viewMode === v.mode ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                      }}
                    >
                      <Icon size={14} />
                      <span style={{ flex: 1 }}>{v.label}</span>
                      {viewMode === v.mode && <Check size={12} />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sort / Grouping Dropdown [⇅ ∨] */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsSortMenuOpen((prev) => !prev)}
              title="Sort and Group By"
              style={{
                height: 26,
                padding: '0 8px',
                borderRadius: 6,
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: '#333336',
                cursor: 'pointer',
              }}
            >
              <SlidersHorizontal size={14} />
              <ChevronDown size={12} opacity={0.6} />
            </button>

            {isSortMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 30,
                  right: 0,
                  width: 150,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  padding: '4px',
                  zIndex: 100,
                }}
              >
                {(
                  [
                    { field: 'name', label: 'Name' },
                    { field: 'dateModified', label: 'Date Modified' },
                    { field: 'size', label: 'Size' },
                    { field: 'kind', label: 'Kind' },
                  ] as const
                ).map((s) => (
                  <div
                    key={s.field}
                    onClick={() => {
                      soundEngine.play('click')
                      if (sortField === s.field) {
                        setSortAsc((prev) => !prev)
                      } else {
                        setSortField(s.field)
                        setSortAsc(true)
                      }
                      setIsSortMenuOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: 5,
                      fontSize: 12,
                      cursor: 'pointer',
                      color: sortField === s.field ? '#007AFF' : '#1D1D1F',
                      backgroundColor: sortField === s.field ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                    }}
                  >
                    <span>{s.label}</span>
                    {sortField === s.field && <span>{sortAsc ? '↑' : '↓'}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Pill Input */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: 160,
              height: 26,
              borderRadius: 6,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: '0 8px',
              gap: 6,
            }}
          >
            <Search size={13} color="#8E8E93" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 12,
                color: '#1D1D1F',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#8E8E93',
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. FINDER TABS BAR (30px) ──────────────────────────────────────── */}
      <div
        style={{
          height: 30,
          backgroundColor: '#DFE1E5',
          borderBottom: '1px solid #D5D7DC',
          display: 'flex',
          alignItems: 'flex-end',
          paddingLeft: isSidebarOpen ? sidebarWidth : 0,
          transition: 'padding-left 0.15s ease',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1, overflowX: 'auto' }}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '5px 14px',
                  minWidth: 110,
                  maxWidth: 180,
                  height: 27,
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                  borderRight: isActive ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  position: 'relative',
                  fontSize: 11.5,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#1D1D1F' : '#55575E',
                  boxShadow: isActive ? '0 -1px 2px rgba(0,0,0,0.04)' : 'none',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tab.name}
                </span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(e, tab.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      color: '#8E8E93',
                      opacity: isActive ? 0.7 : 0.4,
                    }}
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Plus Button to add tab */}
        <button
          onClick={handleAddTab}
          title="New Tab (⌘T)"
          style={{
            width: 28,
            height: 26,
            borderRadius: 4,
            border: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#55575E',
            cursor: 'pointer',
            marginRight: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* ─── 3. MAIN BODY (SIDEBAR + FILE CANVAS) ───────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* ─── LEFT SIDEBAR (APPLE FAVORITES & REAL PORTFOLIO CATEGORIES) ───── */}
        {isSidebarOpen && (
          <div
            style={{
              width: sidebarWidth,
              backgroundColor: '#ECEEF1',
              borderRight: '1px solid #D5D7DC',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              overflowY: 'auto',
              padding: '10px 8px',
              fontSize: 12.5,
              color: '#333336',
              userSelect: 'none',
            }}
          >
            {/* Sidebar Root Header: [ ∨ 🏠 Home ] */}
            <div
              onClick={() => {
                setExpandedPaths((prev) => ({
                  ...prev,
                  '/Users/yamin': !prev['/Users/yamin'],
                }))
                navigateTo('/Users/yamin')
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 6px',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#1D1D1F',
                fontSize: 12.5,
                borderRadius: 5,
              }}
            >
              {expandedPaths['/Users/yamin'] ? (
                <ChevronDown size={14} color="#666" />
              ) : (
                <ChevronRight size={14} color="#666" />
              )}
              <HomeIcon size={15} color="#007AFF" />
              <span>Yamin (Home)</span>
            </div>

            {/* FAVORITES SECTION */}
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', padding: '4px 8px', letterSpacing: '0.04em' }}>
                FAVORITES
              </div>

              {/* 1. Resume (Featured Matching Reference Screenshot!) */}
              <div
                onClick={() => navigateTo('/Users/yamin/02_Resume_&_Credentials')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath === '/Users/yamin/02_Resume_&_Credentials' ? '#007AFF' : 'transparent',
                  color: currentPath === '/Users/yamin/02_Resume_&_Credentials' ? '#FFFFFF' : '#333',
                  fontWeight: currentPath === '/Users/yamin/02_Resume_&_Credentials' ? 600 : 400,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <FileText size={15} color={currentPath === '/Users/yamin/02_Resume_&_Credentials' ? '#FFFFFF' : '#BF5AF2'} />
                  <span>Resume</span>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TAG_COLORS.purple.hex }} />
              </div>

              {/* 2. About Me */}
              <div
                onClick={() => navigateTo('/Users/yamin/01_About_Me')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath === '/Users/yamin/01_About_Me' ? '#007AFF' : 'transparent',
                  color: currentPath === '/Users/yamin/01_About_Me' ? '#FFFFFF' : '#333',
                  fontWeight: currentPath === '/Users/yamin/01_About_Me' ? 600 : 400,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <User size={15} color={currentPath === '/Users/yamin/01_About_Me' ? '#FFFFFF' : '#FF453A'} />
                  <span>About Me</span>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TAG_COLORS.red.hex }} />
              </div>

              {/* 3. Production AI Agents */}
              <div
                onClick={() => navigateTo('/Users/yamin/03_Production_AI_Agents')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath === '/Users/yamin/03_Production_AI_Agents' ? '#007AFF' : 'transparent',
                  color: currentPath === '/Users/yamin/03_Production_AI_Agents' ? '#FFFFFF' : '#333',
                  fontWeight: currentPath === '/Users/yamin/03_Production_AI_Agents' ? 600 : 400,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Cpu size={15} color={currentPath === '/Users/yamin/03_Production_AI_Agents' ? '#FFFFFF' : '#0A84FF'} />
                  <span>AI Agents</span>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TAG_COLORS.blue.hex }} />
              </div>

              {/* 4. Open Source Impact */}
              <div
                onClick={() => navigateTo('/Users/yamin/04_Open_Source_Impact')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath === '/Users/yamin/04_Open_Source_Impact' ? '#007AFF' : 'transparent',
                  color: currentPath === '/Users/yamin/04_Open_Source_Impact' ? '#FFFFFF' : '#333',
                  fontWeight: currentPath === '/Users/yamin/04_Open_Source_Impact' ? 600 : 400,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <GitBranch size={15} color={currentPath === '/Users/yamin/04_Open_Source_Impact' ? '#FFFFFF' : '#30D158'} />
                  <span>Open Source</span>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TAG_COLORS.green.hex }} />
              </div>

              {/* 5. System Design */}
              <div
                onClick={() => navigateTo('/Users/yamin/05_System_Design_Case_Studies')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath === '/Users/yamin/05_System_Design_Case_Studies' ? '#007AFF' : 'transparent',
                  color: currentPath === '/Users/yamin/05_System_Design_Case_Studies' ? '#FFFFFF' : '#333',
                  fontWeight: currentPath === '/Users/yamin/05_System_Design_Case_Studies' ? 600 : 400,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Layers size={15} color={currentPath === '/Users/yamin/05_System_Design_Case_Studies' ? '#FFFFFF' : '#FFD60A'} />
                  <span>System Design</span>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TAG_COLORS.yellow.hex }} />
              </div>


              {/* 7. Downloads */}
              <div
                onClick={() => navigateTo('/Users/yamin/Downloads')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath === '/Users/yamin/Downloads' ? '#007AFF' : 'transparent',
                  color: currentPath === '/Users/yamin/Downloads' ? '#FFFFFF' : '#333',
                }}
              >
                <Download size={15} color={currentPath === '/Users/yamin/Downloads' ? '#FFFFFF' : '#007AFF'} />
                <span>Downloads</span>
              </div>
            </div>

            {/* PROJECTS SECTION */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', padding: '4px 8px', letterSpacing: '0.04em' }}>
                PROJECTS
              </div>

              <div
                onClick={() => navigateTo('/Users/yamin/03_Production_AI_Agents/PR-Review-Agent')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath.includes('PR-Review-Agent') ? '#007AFF' : 'transparent',
                  color: currentPath.includes('PR-Review-Agent') ? '#FFFFFF' : '#333',
                }}
              >
                <MacOSFolderIcon size={14} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  PR Review Agent
                </span>
              </div>

              <div
                onClick={() => navigateTo('/Users/yamin/03_Production_AI_Agents/Autonomous-Bug-Reproducer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath.includes('Autonomous-Bug-Reproducer') ? '#007AFF' : 'transparent',
                  color: currentPath.includes('Autonomous-Bug-Reproducer') ? '#FFFFFF' : '#333',
                }}
              >
                <MacOSFolderIcon size={14} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Bug Reproducer
                </span>
              </div>

              <div
                onClick={() => navigateTo('/Users/yamin/03_Production_AI_Agents/Portfolio-OS')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: currentPath.includes('Portfolio-OS') ? '#007AFF' : 'transparent',
                  color: currentPath.includes('Portfolio-OS') ? '#FFFFFF' : '#333',
                }}
              >
                <MacOSFolderIcon size={14} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Portfolio OS
                </span>
              </div>
            </div>

            {/* Sidebar Tags Section */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', padding: '4px 8px', letterSpacing: '0.04em' }}>
                TAGS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(Object.entries(TAG_COLORS) as [FileTag, { name: string; hex: string }][]).map(
                  ([tagKey, tagObj]) => (
                    <div
                      key={tagKey}
                      onClick={() => {
                        soundEngine.play('click')
                        setSearchQuery(tagKey)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '4px 8px',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: tagObj.hex,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                        }}
                      />
                      <span>{tagObj.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── MAIN FILE CANVAS ────────────────────────────────────────────── */}
        <div
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onContextMenu={(e) => {
            e.preventDefault()
            setContextMenu({ x: e.clientX, y: e.clientY, item: null })
          }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Marquee Selection Drag Ghost */}
          {lassoRect && (
            <div
              style={{
                position: 'absolute',
                left: Math.min(lassoRect.startX, lassoRect.currentX),
                top: Math.min(lassoRect.startY, lassoRect.currentY),
                width: Math.abs(lassoRect.currentX - lassoRect.startX),
                height: Math.abs(lassoRect.currentY - lassoRect.startY),
                backgroundColor: 'rgba(0, 122, 255, 0.15)',
                border: '1px solid rgba(0, 122, 255, 0.65)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
          )}

          {/* Toast Notification (Copied, Pasted, Moved) */}
          <AnimatePresence>
            {hudToast && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                style={{
                  position: 'absolute',
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '6px 14px',
                  borderRadius: 18,
                  backgroundColor: 'rgba(28, 30, 36, 0.88)',
                  backdropFilter: 'blur(20px)',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 500,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                  zIndex: 100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Sparkles size={13} color="#007AFF" />
                <span>{hudToast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas Views */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', position: 'relative' }}>
            {/* ─── A. ICON GRID VIEW ───────────────────────────────────────── */}
            {viewMode === 'icon' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '24px 18px',
                  alignItems: 'start',
                }}
              >
                {currentEntries.map((item) => {
                  const isSelected = selectedIds.includes(item.id)
                  const isEditing = editingId === item.id
                  const isCut = clipboard?.mode === 'cut' && clipboard.items.some((it) => it.id === item.id)

                  return (
                    <motion.div
                      key={item.id}
                      data-finder-item="true"
                      initial={{ scale: 0.88, opacity: 0 }}
                      animate={{ scale: 1, opacity: isCut ? 0.45 : 1 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        soundEngine.play('click')
                        if (e.metaKey || e.ctrlKey) {
                          setSelectedIds((prev) =>
                            prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                          )
                        } else {
                          setSelectedIds([item.id])
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        handleOpenFile(item)
                      }}
                      onContextMenu={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setSelectedIds([item.id])
                        setContextMenu({ x: e.clientX, y: e.clientY, item })
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'default',
                        padding: '6px',
                        borderRadius: 6,
                        backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.18)' : 'transparent',
                        outline: isSelected ? '1px solid rgba(0, 122, 255, 0.45)' : 'none',
                        transition: 'background-color 0.1s ease',
                      }}
                    >
                      {/* Icon */}
                      <div style={{ width: 68, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.isFolder ? (
                          <MacOSFolderIcon size={64} />
                        ) : (
                          <FinderFileIcon kind={item.kind} size={64} appIconSrc={item.appIconSrc} />
                        )}
                      </div>

                      {/* Name / Inline Edit */}
                      {isEditing ? (
                        <input
                          autoFocus
                          type="text"
                          value={editNameVal}
                          onChange={(e) => setEditNameVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommitRename()
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                          onBlur={handleCommitRename}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: 11.5,
                            textAlign: 'center',
                            width: 100,
                            padding: '2px 4px',
                            borderRadius: 4,
                            border: '1.5px solid #007AFF',
                            outline: 'none',
                            backgroundColor: '#FFFFFF',
                            color: '#1D1D1F',
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: 11.5,
                            lineHeight: 1.25,
                            textAlign: 'center',
                            color: isSelected ? '#007AFF' : '#1D1D1F',
                            fontWeight: isSelected ? 600 : 400,
                            wordBreak: 'break-word',
                            maxWidth: 104,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.name}
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* ─── B. LIST VIEW ────────────────────────────────────────────── */}
            {viewMode === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {/* Table Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(200px, 2fr) 140px 100px 120px',
                    padding: '4px 10px',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: '#8E8E93',
                    borderBottom: '1px solid #E5E7EB',
                  }}
                >
                  <div
                    onClick={() => {
                      setSortField('name')
                      setSortAsc(!sortAsc)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Name {sortField === 'name' ? (sortAsc ? '↑' : '↓') : ''}
                  </div>
                  <div
                    onClick={() => {
                      setSortField('dateModified')
                      setSortAsc(!sortAsc)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Date Modified {sortField === 'dateModified' ? (sortAsc ? '↑' : '↓') : ''}
                  </div>
                  <div
                    onClick={() => {
                      setSortField('size')
                      setSortAsc(!sortAsc)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Size {sortField === 'size' ? (sortAsc ? '↑' : '↓') : ''}
                  </div>
                  <div
                    onClick={() => {
                      setSortField('kind')
                      setSortAsc(!sortAsc)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Kind {sortField === 'kind' ? (sortAsc ? '↑' : '↓') : ''}
                  </div>
                </div>

                {/* Table Rows */}
                {currentEntries.map((item, idx) => {
                  const isSelected = selectedIds.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        soundEngine.play('click')
                        setSelectedIds([item.id])
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        handleOpenFile(item)
                      }}
                      onContextMenu={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setSelectedIds([item.id])
                        setContextMenu({ x: e.clientX, y: e.clientY, item })
                      }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(200px, 2fr) 140px 100px 120px',
                        padding: '6px 10px',
                        fontSize: 12,
                        backgroundColor: isSelected
                          ? '#007AFF'
                          : idx % 2 === 0
                          ? 'transparent'
                          : 'rgba(0, 0, 0, 0.02)',
                        color: isSelected ? '#FFFFFF' : '#1D1D1F',
                        cursor: 'pointer',
                        borderRadius: isSelected ? 4 : 0,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                        {item.isFolder ? (
                          <MacOSFolderIcon size={16} />
                        ) : (
                          <FinderFileIcon kind={item.kind} size={16} appIconSrc={item.appIconSrc} />
                        )}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </span>
                      </div>
                      <div style={{ color: isSelected ? '#FFFFFF' : '#6E6E73' }}>{item.dateModified}</div>
                      <div style={{ color: isSelected ? '#FFFFFF' : '#6E6E73' }}>{item.size}</div>
                      <div style={{ color: isSelected ? '#FFFFFF' : '#6E6E73' }}>
                        {item.isFolder ? 'Folder' : item.kind}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ─── C. COLUMN VIEW (Miller Columns) ─────────────────────────── */}
            {viewMode === 'column' && (
              <ColumnView
                currentPath={currentPath}
                entries={currentEntries}
                allEntries={fsEntries}
                selectedItem={selectedItem}
                onSelectItem={(item) => setSelectedIds([item.id])}
                onOpenFolder={(p) => navigateTo(p)}
                onQuickLook={(item) => handleOpenFile(item)}
                onContextMenu={(item, e) => {
                  setSelectedIds([item.id])
                  setContextMenu({ x: e.clientX, y: e.clientY, item })
                }}
                onCanvasContextMenu={(e) => {
                  setContextMenu({ x: e.clientX, y: e.clientY, item: null })
                }}
                isDark={isDark}
              />
            )}

            {/* ─── D. GALLERY VIEW ─────────────────────────────────────────── */}
            {viewMode === 'gallery' && (
              <div
                onContextMenu={(e) => {
                  if (e.target === e.currentTarget) {
                    e.preventDefault()
                    setContextMenu({ x: e.clientX, y: e.clientY, item: null })
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 0',
                }}
              >
                {/* Large Preview */}
                <div
                  onContextMenu={(e) => {
                    if (selectedItem) {
                      e.stopPropagation()
                      e.preventDefault()
                      setContextMenu({ x: e.clientX, y: e.clientY, item: selectedItem })
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
                >
                  {selectedItem?.isFolder ? (
                    <MacOSFolderIcon size={140} />
                  ) : (
                    <FinderFileIcon
                      kind={selectedItem?.kind || 'generic'}
                      size={140}
                      appIconSrc={selectedItem?.appIconSrc}
                    />
                  )}
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1D1D1F' }}>
                    {selectedItem?.name || currentFolderName}
                  </span>
                  <span style={{ fontSize: 12, color: '#8E8E93' }}>
                    {selectedItem?.size || `${currentEntries.length} items`}
                  </span>
                  {selectedItem && (
                    <button
                      onClick={() => handleOpenFile(selectedItem)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        backgroundColor: '#007AFF',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {selectedItem.name === 'Resume.pdf' ? 'Open in Resume.pdf Window' : 'Quick Look'}
                    </button>
                  )}
                </div>

                {/* Bottom Filmstrip Carousel */}
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    overflowX: 'auto',
                    width: '100%',
                    padding: '12px',
                    borderTop: '1px solid #E5E7EB',
                  }}
                >
                  {currentEntries.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedIds([item.id])}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        handleOpenFile(item)
                      }}
                      onContextMenu={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setSelectedIds([item.id])
                        setContextMenu({ x: e.clientX, y: e.clientY, item })
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 10px',
                        borderRadius: 8,
                        backgroundColor: selectedIds.includes(item.id) ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {item.isFolder ? (
                        <MacOSFolderIcon size={36} />
                      ) : (
                        <FinderFileIcon kind={item.kind} size={36} appIconSrc={item.appIconSrc} />
                      )}
                      <span style={{ fontSize: 10, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── GET INFO SLIDING PANEL ──────────────────────────────────────── */}
        {isGetInfoOpen && selectedItem && (
          <div
            style={{
              width: 250,
              backgroundColor: '#F8F9FA',
              borderLeft: '1px solid #D5D7DC',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              fontSize: 12,
              overflowY: 'auto',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1D1D1F' }}>Get Info</span>
              <button
                onClick={() => setIsGetInfoOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#888' }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '10px 0' }}>
              {selectedItem.isFolder ? (
                <MacOSFolderIcon size={64} />
              ) : (
                <FinderFileIcon kind={selectedItem.kind} size={64} appIconSrc={selectedItem.appIconSrc} />
              )}
              <span style={{ fontWeight: 600, fontSize: 13, textAlign: 'center', wordBreak: 'break-word' }}>
                {selectedItem.name}
              </span>
              <span style={{ color: '#8E8E93', fontSize: 11 }}>{selectedItem.size}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
              <div>
                <span style={{ color: '#8E8E93' }}>Kind: </span>
                <span style={{ fontWeight: 500 }}>{selectedItem.isFolder ? 'Folder' : selectedItem.kind}</span>
              </div>
              <div>
                <span style={{ color: '#8E8E93' }}>Where: </span>
                <span style={{ wordBreak: 'break-all' }}>{selectedItem.parentPath}</span>
              </div>
              <div>
                <span style={{ color: '#8E8E93' }}>Created: </span>
                <span>{selectedItem.dateCreated}</span>
              </div>
              <div>
                <span style={{ color: '#8E8E93' }}>Modified: </span>
                <span>{selectedItem.dateModified}</span>
              </div>
            </div>

            {/* Tags in Info Sheet */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 10 }}>
              <span style={{ color: '#8E8E93', display: 'block', marginBottom: 6 }}>Tags:</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {(Object.entries(TAG_COLORS) as [FileTag, { name: string; hex: string }][]).map(
                  ([tKey, tObj]) => (
                    <button
                      key={tKey}
                      onClick={() => handleSetTag(selectedItem, selectedItem.tag === tKey ? undefined : tKey)}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: tObj.hex,
                        border: selectedItem.tag === tKey ? '2px solid #000' : 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 4. BOTTOM ACTION & STATUS BAR (26px) ───────────────────────────── */}
      <div
        style={{
          height: 26,
          backgroundColor: '#EBECEF',
          borderTop: '1px solid #D5D7DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          flexShrink: 0,
          fontSize: 11.5,
          color: '#55575E',
        }}
      >
        {/* Left: Quick Look, Image View, Info Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => {
              if (selectedItem) {
                handleOpenFile(selectedItem)
              }
            }}
            title="Quick Look (Space)"
            style={{
              border: 'none',
              background: 'transparent',
              color: selectedItem ? '#1D1D1F' : '#A1A1A6',
              cursor: selectedItem ? 'pointer' : 'default',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => soundEngine.play('click')}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#1D1D1F',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ImageIcon size={14} />
          </button>
          <button
            onClick={() => setIsGetInfoOpen((prev) => !prev)}
            title="Get Info (⌘I)"
            style={{
              border: 'none',
              background: 'transparent',
              color: isGetInfoOpen ? '#007AFF' : '#1D1D1F',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Info size={14} />
          </button>
        </div>

        {/* Right: Item Count (e.g. "X items") */}
        <div>{currentEntries.length} items</div>
      </div>

      {/* ─── 5. BOTTOM PATH BAR (BREADCRUMBS) (22px) ────────────────────────── */}
      <div
        style={{
          height: 22,
          backgroundColor: '#F3F4F6',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          fontSize: 11,
          color: '#6E6E73',
          gap: 4,
          flexShrink: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", monospace',
        }}
      >
        {currentPath.split('/').filter(Boolean).map((part, idx, arr) => {
          const segPath = '/' + arr.slice(0, idx + 1).join('/')
          const isLast = idx === arr.length - 1
          const cleanPart = part.replace(/^\d+_/, '').replace(/_/g, ' ')

          return (
            <React.Fragment key={segPath}>
              <span
                onClick={() => navigateTo(segPath)}
                style={{
                  cursor: isLast ? 'default' : 'pointer',
                  color: isLast ? '#1D1D1F' : '#6E6E73',
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                {cleanPart}
              </span>
              {!isLast && <span style={{ opacity: 0.4 }}>/</span>}
            </React.Fragment>
          )
        })}
      </div>

      {/* ─── 6. RIGHT-CLICK CONTEXT MENU (STRICT MACOS SYSTEM FIDELITY) ─────── */}
      <AnimatePresence>
        {contextMenu && (
          <FinderContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            item={contextMenu.item}
            isDark={isDark}
            accentHex={accentHex}
            clipboard={clipboard}
            sortField={sortField}
            onClose={() => setContextMenu(null)}
            onOpen={handleOpenFile}
            onQuickLook={handleOpenFile}
            onCopy={(item) => handleCopy([item])}
            onCut={(item) => handleCut([item])}
            onPaste={handlePaste}
            onDuplicate={handleDuplicateItem}
            onRename={handleStartRename}
            onDelete={handleDeleteItem}
            onSetTag={handleSetTag}
            onNewFolder={handleCreateNewFolder}
            onNewFile={handleCreateNewFile}
            onRefresh={handleRefresh}
            onGetInfo={(item) => {
              if (item) setSelectedIds([item.id])
              setIsGetInfoOpen(true)
            }}
            onSortBy={(field) => {
              soundEngine.play('click')
              setSortField(field)
              setSortAsc(true)
            }}
            onCleanUp={handleCleanUp}
            onShowViewOptions={() => setIsViewMenuOpen((prev) => !prev)}
          />
        )}
      </AnimatePresence>

      {/* ─── 7. QUICK LOOK MODAL (SPACEBAR) ─────────────────────────────────── */}
      <AnimatePresence>
        {isQuickLookOpen && selectedItem && (
          <div
            onClick={() => setIsQuickLookOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              style={{
                width: (
                  selectedItem.id === 'about-bio' ||
                  selectedItem.name.includes('Bio & Engineering Journey') ||
                  selectedItem.id === 'about-philosophy' ||
                  selectedItem.name.includes('Engineering Philosophy') ||
                  selectedItem.id === 'about-stack' ||
                  selectedItem.name.includes('Tech Stack') ||
                  selectedItem.id === 'about-contact' ||
                  selectedItem.name.includes('Contact & Socials') ||
                  selectedItem.name.toLowerCase().includes('about')
                ) ? 760 : 680,
                maxWidth: '92vw',
                height: (
                  selectedItem.id === 'about-bio' ||
                  selectedItem.name.includes('Bio & Engineering Journey') ||
                  selectedItem.id === 'about-philosophy' ||
                  selectedItem.name.includes('Engineering Philosophy') ||
                  selectedItem.id === 'about-stack' ||
                  selectedItem.name.includes('Tech Stack') ||
                  selectedItem.id === 'about-contact' ||
                  selectedItem.name.includes('Contact & Socials') ||
                  selectedItem.name.toLowerCase().includes('about')
                ) ? 600 : 520,
                maxHeight: '88vh',
                backgroundColor: 'rgba(28, 30, 36, 0.94)',
                backdropFilter: 'blur(50px) saturate(210%)',
                borderRadius: 16,
                border: '1px solid rgba(255, 255, 255, 0.22)',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                color: '#FFFFFF',
              }}
            >
              {/* Quick Look Header */}
              <div
                style={{
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 14px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedItem.name}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>
                    {selectedItem.size}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {selectedItem.url && (
                    <button
                      onClick={() => {
                        window.open(selectedItem.url, '_blank', 'noopener,noreferrer')
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: 11.5,
                        backgroundColor: '#007AFF',
                        border: 'none',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Open in Browser</span>
                    </button>
                  )}
                  {selectedItem.name === 'Resume.pdf' && (
                    <button
                      onClick={() => {
                        setIsQuickLookOpen(false)
                        handleOpenFile(selectedItem)
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: 11.5,
                        backgroundColor: '#007AFF',
                        border: 'none',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Open in Window</span>
                    </button>
                  )}
                  {(
                    selectedItem.id === 'about-bio' ||
                    selectedItem.name.includes('Bio & Engineering Journey') ||
                    selectedItem.id === 'about-philosophy' ||
                    selectedItem.name.includes('Engineering Philosophy') ||
                    selectedItem.id === 'about-stack' ||
                    selectedItem.name.includes('Tech Stack') ||
                    selectedItem.id === 'about-contact' ||
                    selectedItem.name.includes('Contact & Socials') ||
                    selectedItem.name.toLowerCase().includes('about')
                  ) && (
                    <button
                      onClick={() => {
                        setIsQuickLookOpen(false)
                        const winId = selectedItem.id === 'about-philosophy' || selectedItem.name.includes('Philosophy')
                          ? 'philosophy'
                          : selectedItem.id === 'about-stack' || selectedItem.name.includes('Tech Stack')
                          ? 'techstack'
                          : selectedItem.id === 'about-contact' || selectedItem.name.includes('Contact')
                          ? 'contact'
                          : 'about'
                        openWindow({
                          id: winId,
                          title: selectedItem.name,
                          isOpen: true,
                          isMinimized: false,
                          position: { x: 180, y: 56 },
                          size: { width: 840, height: 680 },
                        })
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: 11.5,
                        backgroundColor: '#007AFF',
                        border: 'none',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Open in Window</span>
                    </button>
                  )}
                  {selectedItem.id.includes('pr-review') && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => setQuickLookTab('preview')}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          backgroundColor: quickLookTab === 'preview' ? '#007AFF' : 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        Markdown
                      </button>
                      <button
                        onClick={() => setQuickLookTab('visualizer')}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          backgroundColor: quickLookTab === 'visualizer' ? '#007AFF' : 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        LangGraph Pipeline
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setIsQuickLookOpen(false)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Look Content Area */}
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: (
                    selectedItem.id === 'about-bio' ||
                    selectedItem.name.includes('Bio & Engineering Journey') ||
                    selectedItem.id === 'about-philosophy' ||
                    selectedItem.name.includes('Engineering Philosophy') ||
                    selectedItem.id === 'about-stack' ||
                    selectedItem.name.includes('Tech Stack') ||
                    selectedItem.id === 'about-contact' ||
                    selectedItem.name.includes('Contact & Socials') ||
                    selectedItem.name.toLowerCase().includes('about')
                  ) ? 0 : 20,
                }}
              >
                {selectedItem.url ? (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      textAlign: 'center',
                      gap: 16,
                    }}
                  >
                    <FinderFileIcon kind="link" name={selectedItem.name} size={96} />
                    <div style={{ maxWidth: 480 }}>
                      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: '#FFFFFF' }}>
                        {selectedItem.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: '#0A84FF',
                          wordBreak: 'break-all',
                          fontFamily: 'monospace',
                          marginBottom: 12,
                        }}
                      >
                        {selectedItem.url}
                      </div>
                      {selectedItem.content && (
                        <div
                          style={{
                            fontSize: 12.5,
                            color: 'rgba(255, 255, 255, 0.75)',
                            lineHeight: 1.5,
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            padding: '12px 16px',
                            borderRadius: 10,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {selectedItem.content}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => window.open(selectedItem.url, '_blank', 'noopener,noreferrer')}
                      style={{
                        marginTop: 4,
                        padding: '8px 22px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        backgroundColor: '#007AFF',
                        border: 'none',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 4px 14px rgba(0, 122, 255, 0.35)',
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Open Link in Browser</span>
                    </button>
                  </div>
                ) : quickLookTab === 'visualizer' ? (
                  <div style={{ height: '100%' }}>
                    <LangGraphVisualizer />
                  </div>
                ) : (selectedItem.id === 'about-philosophy' || selectedItem.name.includes('Engineering Philosophy')) ? (
                  <PhilosophyView />
                ) : (selectedItem.id === 'about-stack' || selectedItem.name.includes('Tech Stack')) ? (
                  <TechStackView />
                ) : (selectedItem.id === 'about-contact' || selectedItem.name.includes('Contact & Socials')) ? (
                  <ContactView />
                ) : (selectedItem.id === 'about-bio' || selectedItem.name.includes('Bio & Engineering Journey') || selectedItem.name.toLowerCase().includes('about')) ? (
                  <AboutView />
                ) : selectedItem.content ? (
                  <pre
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontFamily: '-apple-system, BlinkMacSystemFont, monospace',
                      whiteSpace: 'pre-wrap',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                    }}
                  >
                    {selectedItem.content}
                  </pre>
                ) : (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 14,
                    }}
                  >
                    {selectedItem.isFolder ? (
                      <MacOSFolderIcon size={96} />
                    ) : (
                      <FinderFileIcon kind={selectedItem.kind} size={96} appIconSrc={selectedItem.appIconSrc} />
                    )}
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{selectedItem.name}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }}>
                      {selectedItem.isFolder ? 'Folder' : `${selectedItem.kind.toUpperCase()} file`} · {selectedItem.size}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
