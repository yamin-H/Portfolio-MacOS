'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Eye, Copy, Download, FolderPlus, Terminal as TerminalIcon, Sparkles, RefreshCw, X } from 'lucide-react'
import { useWindowStore, ACCENT_COLOR_MAP } from '@/app/store/windowStore'
import { soundEngine } from '@/lib/sound/soundEngine'
import { FinderFileIcon } from '@/components/apps/finder/FinderFileIcon'
import { MacOSFolderIcon } from '@/components/apps/notes/MacOSFolderIcon'

// ─── Custom Macintosh HD SVG Icon (Apple Brushed Aluminum Volume) ──────────────
function MacintoshHDIcon({ size = 54 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.38))',
      }}
    >
      <defs>
        {/* Silver Aluminum Body Gradient */}
        <linearGradient id="macHdBody" x1="10" y1="12" x2="70" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5F5F7" />
          <stop offset="35%" stopColor="#D8D8DC" />
          <stop offset="70%" stopColor="#B8B8BE" />
          <stop offset="100%" stopColor="#8E8E93" />
        </linearGradient>

        {/* Specular Edge Highlight */}
        <linearGradient id="macHdBevel" x1="40" y1="12" x2="40" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </linearGradient>

        {/* Drive Bay Horizontal Slot */}
        <linearGradient id="macHdSlot" x1="20" y1="46" x2="60" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2C2C2E" />
          <stop offset="50%" stopColor="#1C1C1E" />
          <stop offset="100%" stopColor="#2C2C2E" />
        </linearGradient>
      </defs>

      {/* Main Metal Unibody Chassis */}
      <rect x="12" y="14" width="56" height="52" rx="10" fill="url(#macHdBody)" />
      <rect x="12" y="14" width="56" height="52" rx="10" stroke="url(#macHdBevel)" strokeWidth="1" />

      {/* Internal Drive Horizontal Groove */}
      <rect x="18" y="24" width="44" height="20" rx="3" fill="rgba(0,0,0,0.06)" />
      
      {/* Apple Subtle Embossed Logo in Drive Center */}
      <path
        d="M40.7 30.5c-.3.4-.7.8-1.2.8-.5 0-.7-.3-1.3-.3-.6 0-.8.3-1.3.3-.5 0-.9-.4-1.2-.8-.7-.9-1.2-2.7-.5-3.8.4-.5 1-.9 1.6-.9.5 0 .9.3 1.2.3.3 0 .8-.3 1.4-.3.6 0 1.2.3 1.6.8-.1.1-.9.6-.9 1.6.1 1.2 1.1 1.6 1.1 1.7-.1.1-.2.5-.5.9zM38.5 24.2c.3-.3.5-.8.4-1.2-.4 0-.9.3-1.2.6-.3.3-.5.7-.4 1.2.4 0 .9-.3 1.2-.6z"
        fill="rgba(0,0,0,0.28)"
      />

      {/* Front Slot */}
      <rect x="20" y="52" width="40" height="3" rx="1.5" fill="url(#macHdSlot)" />

      {/* Activity Status LED Indicator (Apple Cyan Glow) */}
      <circle cx="56" cy="53.5" r="1.5" fill="#32D74B" />
      <circle cx="56" cy="53.5" r="2.5" fill="#30D158" opacity="0.35" />
    </svg>
  )
}

// ─── Desktop Icon Definition ──────────────────────────────────────────────────
export interface DesktopIconItem {
  id: string
  name: string
  displayName: string
  kind: 'drive' | 'folder' | 'pdf' | 'markdown' | 'code'
  defaultRow: number
  info: {
    kindLabel: string
    sizeLabel: string
    whereLabel: string
    created: string
    modified: string
    description: string
  }
}

const DESKTOP_ITEMS: DesktopIconItem[] = [
  {
    id: 'dt-mac-hd',
    name: 'Macintosh HD',
    displayName: 'Macintosh HD',
    kind: 'drive',
    defaultRow: 0,
    info: {
      kindLabel: 'Volume (APFS)',
      sizeLabel: '494.38 GB available (1 TB)',
      whereLabel: 'MacBook Pro · Internal SSD',
      created: 'Oct 01, 2024 at 10:00 AM',
      modified: 'Today at 9:41 AM',
      description: 'System startup volume hosting Portfolio OS root, user library, and agent environments.',
    },
  },
  {
    id: 'dt-projects',
    name: '03_Production_AI_Agents',
    displayName: '03_Production AI_Agents',
    kind: 'folder',
    defaultRow: 1,
    info: {
      kindLabel: 'Folder',
      sizeLabel: '14.8 MB (8 items)',
      whereLabel: '/Users/yamin',
      created: 'Jun 10, 2024 at 2:00 PM',
      modified: 'Today at 11:20 AM',
      description: 'Flagship production AI agents: PR Review Agent, Autonomous Bug Reproducer, and LangGraph pipelines.',
    },
  },
  {
    id: 'dt-resume',
    name: 'Yamin_Resume.pdf',
    displayName: 'Yamin_Resume .pdf',
    kind: 'pdf',
    defaultRow: 2,
    info: {
      kindLabel: 'Portable Document Format (PDF)',
      sizeLabel: '420 KB',
      whereLabel: '/Users/yamin/02_Resume_&_Credentials',
      created: 'Oct 01, 2024 at 10:00 AM',
      modified: 'Today at 10:15 AM',
      description: 'Full-stack & AI-Native systems engineering resume for Yamin Hossain.',
    },
  },
  {
    id: 'dt-about',
    name: 'Bio & Engineering Journey.md',
    displayName: 'Bio & Engineering Journey.md',
    kind: 'markdown',
    defaultRow: 3,
    info: {
      kindLabel: 'Markdown Document',
      sizeLabel: '4.2 KB',
      whereLabel: '/Users/yamin/01_About_Me',
      created: 'Jan 20, 2024 at 11:30 AM',
      modified: 'Today at 9:41 AM',
      description: 'Neofetch terminal card, full-stack AI skill matrix, and career timeline for Yamin Hossain.',
    },
  },
  {
    id: 'dt-pr-review',
    name: 'PR_Review_Agent.md',
    displayName: 'PR_Review_ Agent.md',
    kind: 'code',
    defaultRow: 4,
    info: {
      kindLabel: 'Interactive Architecture File',
      sizeLabel: '4.8 KB',
      whereLabel: '/Users/yamin/03_Production_AI_Agents',
      created: 'Jun 15, 2024 at 11:30 AM',
      modified: 'Today at 11:20 AM',
      description: 'Autonomous 6-node LangGraph multi-agent pipeline with pgvector semantic similarity search.',
    },
  },
]

// ─── Precision macOS Desktop Grid System Constants ───────────────────────────
const GRID_WIDTH = 96
const GRID_HEIGHT = 114
const TOP_MARGIN = 38
const RIGHT_MARGIN = 20

export default function DesktopIcons() {
  const { openFinderFile, openApp, accentColor, appearanceMode } = useWindowStore()
  const isDark = appearanceMode === 'dark'
  const accentHex = ACCENT_COLOR_MAP[accentColor]?.hex || '#007AFF'

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    item: DesktopIconItem | null
  }>({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  })
  const [getInfoItem, setGetInfoItem] = useState<DesktopIconItem | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastClickRef = useRef<{ id: string; time: number } | null>(null)

  // Drag tracking ref for fluid 120fps direct manipulation
  const dragRef = useRef<{
    id: string
    startX: number
    startY: number
    originX: number
    originY: number
    currentX: number
    currentY: number
    hasMoved: boolean
  } | null>(null)

  // ── Calculate Default Grid Position (Column 0 = Rightmost) ────────────────
  const getDefaultPos = useCallback((row: number) => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1440
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 900

    const availableHeight = Math.max(200, screenHeight - TOP_MARGIN - 80)
    const maxRowsPerCol = Math.max(3, Math.floor(availableHeight / GRID_HEIGHT))

    const colIndex = Math.floor(row / maxRowsPerCol)
    const rowIndex = row % maxRowsPerCol

    const x = screenWidth - RIGHT_MARGIN - GRID_WIDTH - colIndex * (GRID_WIDTH + 14)
    const y = TOP_MARGIN + rowIndex * GRID_HEIGHT

    return { x, y }
  }, [])

  // ── Calculate Closest Grid Cell with Collision Detection ──────────────────
  const snapToGrid = useCallback((x: number, y: number, itemId: string, currentPositions: Record<string, { x: number; y: number }>) => {
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 900

    // Nearest column index (0 = rightmost column, 1 = second from right, etc.)
    const colSpacing = GRID_WIDTH + 14
    const rawCol = Math.round((screenW - RIGHT_MARGIN - GRID_WIDTH - x) / colSpacing)
    const maxCols = Math.max(1, Math.floor((screenW - 24) / colSpacing))
    const col = Math.max(0, Math.min(maxCols - 1, rawCol))

    // Nearest row index
    const rawRow = Math.round((y - TOP_MARGIN) / GRID_HEIGHT)
    const maxRows = Math.max(1, Math.floor((screenH - TOP_MARGIN - 80) / GRID_HEIGHT))
    const row = Math.max(0, Math.min(maxRows - 1, rawRow))

    const snappedX = screenW - RIGHT_MARGIN - GRID_WIDTH - col * colSpacing
    const snappedY = TOP_MARGIN + row * GRID_HEIGHT

    // Check if cell is occupied by another icon
    const isOccupied = (tx: number, ty: number) => {
      return Object.entries(currentPositions).some(([id, pos]) => {
        if (id === itemId) return false
        return Math.abs(pos.x - tx) < 30 && Math.abs(pos.y - ty) < 30
      })
    }

    if (!isOccupied(snappedX, snappedY)) {
      return { x: snappedX, y: snappedY }
    }

    // If occupied, search neighboring slots for nearest free grid cell
    for (let offsetRow = 0; offsetRow < maxRows; offsetRow++) {
      for (let offsetCol = 0; offsetCol < maxCols; offsetCol++) {
        const testX = screenW - RIGHT_MARGIN - GRID_WIDTH - offsetCol * colSpacing
        const testY = TOP_MARGIN + offsetRow * GRID_HEIGHT
        if (!isOccupied(testX, testY)) {
          return { x: testX, y: testY }
        }
      }
    }

    return { x: snappedX, y: snappedY }
  }, [])

  // Sync positions on mount & handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(mobile)
      if (mobile) return

      setPositions((prev) => {
        const next: Record<string, { x: number; y: number }> = {}
        DESKTOP_ITEMS.forEach((it) => {
          if (prev[it.id]) {
            // Re-snap user moved icons to ensure crisp grid alignment
            next[it.id] = snapToGrid(prev[it.id].x, prev[it.id].y, it.id, next)
          } else {
            next[it.id] = getDefaultPos(it.defaultRow)
          }
        })
        return next
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getDefaultPos, snapToGrid])

  // ── Action: Open Desktop Item ────────────────────────────────────────────────
  const handleOpenItem = useCallback((item: DesktopIconItem) => {
    soundEngine.play('pop')
    setContextMenu({ visible: false, x: 0, y: 0, item: null })

    switch (item.id) {
      case 'dt-mac-hd':
        openFinderFile('/Users/yamin')
        break
      case 'dt-projects':
        openFinderFile('/Users/yamin/03_Production_AI_Agents')
        break
      case 'dt-resume':
        openApp('resume')
        break
      case 'dt-about':
        openFinderFile('Bio & Engineering Journey.md')
        break
      case 'dt-pr-review':
        openFinderFile('03_Production_AI_Agents/pr-review-agent.md')
        break
      default:
        openFinderFile(item.name)
        break
    }
  }, [openFinderFile, openApp])

  // ── Keyboard Shortcuts (Escape to deselect, Enter/Space to open, Arrows to navigate) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null)
        setContextMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev))
        setGetInfoItem(null)
        return
      }

      // Enter or Space opens the selected icon
      if ((e.key === 'Enter' || e.key === ' ') && selectedId) {
        e.preventDefault()
        const it = DESKTOP_ITEMS.find((d) => d.id === selectedId)
        if (it) handleOpenItem(it)
        return
      }

      // Arrow navigation
      if (e.key === 'ArrowDown' && selectedId) {
        e.preventDefault()
        const currIdx = DESKTOP_ITEMS.findIndex((d) => d.id === selectedId)
        if (currIdx < DESKTOP_ITEMS.length - 1) {
          soundEngine.play('click')
          setSelectedId(DESKTOP_ITEMS[currIdx + 1].id)
        }
      } else if (e.key === 'ArrowUp' && selectedId) {
        e.preventDefault()
        const currIdx = DESKTOP_ITEMS.findIndex((d) => d.id === selectedId)
        if (currIdx > 0) {
          soundEngine.play('click')
          setSelectedId(DESKTOP_ITEMS[currIdx - 1].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, handleOpenItem])

  // ── Native Pointer Drag Engine with Snap-to-Grid on Drop ──────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, item: DesktopIconItem) => {
    if (e.button !== 0) return

    e.stopPropagation()
    setSelectedId(item.id)
    setContextMenu({ visible: false, x: 0, y: 0, item: null })

    const curPos = positions[item.id] || getDefaultPos(item.defaultRow)

    dragRef.current = {
      id: item.id,
      startX: e.clientX,
      startY: e.clientY,
      originX: curPos.x,
      originY: curPos.y,
      currentX: curPos.x,
      currentY: curPos.y,
      hasMoved: false,
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, item: DesktopIconItem) => {
    if (!dragRef.current || dragRef.current.id !== item.id) return

    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY

    if (!dragRef.current.hasMoved) {
      if (Math.hypot(dx, dy) < 4) return
      dragRef.current.hasMoved = true
      setDraggingId(item.id)
    }

    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 900

    const rawX = Math.max(12, Math.min(screenW - GRID_WIDTH - 12, dragRef.current.originX + dx))
    const rawY = Math.max(TOP_MARGIN, Math.min(screenH - 110, dragRef.current.originY + dy))

    dragRef.current.currentX = rawX
    dragRef.current.currentY = rawY

    // Follow cursor smoothly during active drag
    setPositions((prev) => ({
      ...prev,
      [item.id]: { x: rawX, y: rawY },
    }))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>, item: DesktopIconItem) => {
    if (!dragRef.current || dragRef.current.id !== item.id) return

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}

    const hasMoved = dragRef.current.hasMoved
    const releaseX = dragRef.current.currentX
    const releaseY = dragRef.current.currentY

    dragRef.current = null
    setDraggingId(null)

    if (hasMoved) {
      soundEngine.play('pop')
      // Snap crisply to nearest valid desktop grid cell on drop!
      setPositions((prev) => {
        const snapped = snapToGrid(releaseX, releaseY, item.id, prev)
        return {
          ...prev,
          [item.id]: snapped,
        }
      })
    } else {
      // It's a click gesture!
      const now = Date.now()
      if (
        lastClickRef.current &&
        lastClickRef.current.id === item.id &&
        now - lastClickRef.current.time < 350
      ) {
        lastClickRef.current = null
        handleOpenItem(item)
      } else {
        soundEngine.play('click')
        setSelectedId(item.id)
        lastClickRef.current = { id: item.id, time: now }
      }
    }
  }

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>, item: DesktopIconItem) => {
    if (dragRef.current && dragRef.current.id === item.id) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {}
      dragRef.current = null
      setDraggingId(null)
    }
  }

  // ── Context Menu (Right Click) ───────────────────────────────────────────────
  const handleContextMenu = (e: React.MouseEvent, item: DesktopIconItem | null) => {
    e.preventDefault()
    e.stopPropagation()
    soundEngine.play('click')

    if (item) {
      setSelectedId(item.id)
    }

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900
    const menuW = 210
    const menuH = item ? 230 : 190

    const adjustedX = Math.min(e.clientX, vw - menuW - 12)
    const adjustedY = Math.min(e.clientY, vh - menuH - 12)

    setContextMenu({
      visible: true,
      x: adjustedX,
      y: adjustedY,
      item,
    })
  }

  // ── Clean Up By Name (Snap all icons back to pristine column 0 grid) ───────
  const handleCleanUp = () => {
    soundEngine.play('action')
    const next: Record<string, { x: number; y: number }> = {}
    DESKTOP_ITEMS.forEach((it) => {
      next[it.id] = getDefaultPos(it.defaultRow)
    })
    setPositions(next)
    setContextMenu({ visible: false, x: 0, y: 0, item: null })
  }

  if (isMobile) return null

  return (
    <>
      {/* ─── Desktop Icons Layer (Fixed Layer over wallpaper, behind windows) ─── */}
      <div
        ref={containerRef}
        onClick={(e) => {
          if (e.target === containerRef.current) {
            setSelectedId(null)
            setContextMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev))
          }
        }}
        onContextMenu={(e) => {
          if (e.target === containerRef.current) {
            handleContextMenu(e, null)
          }
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 15,
          overflow: 'hidden',
          userSelect: 'none',
          pointerEvents: 'auto',
        }}
      >
        {DESKTOP_ITEMS.map((item) => {
          const isSelected = selectedId === item.id
          const isDragging = draggingId === item.id
          const pos = positions[item.id] || getDefaultPos(item.defaultRow)

          return (
            <div
              key={item.id}
              data-desktop-icon={item.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              onPointerMove={(e) => handlePointerMove(e, item)}
              onPointerUp={(e) => handlePointerUp(e, item)}
              onPointerCancel={(e) => handlePointerCancel(e, item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                width: GRID_WIDTH,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isDragging ? 'grabbing' : 'default',
                pointerEvents: 'auto',
                touchAction: 'none',
                zIndex: isDragging ? 50 : isSelected ? 30 : 20,
                transform: isDragging ? 'scale(1.05)' : 'scale(1)',
                transition: isDragging
                  ? 'none'
                  : 'left 0.18s cubic-bezier(0.16, 1, 0.3, 1), top 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease, filter 0.15s ease',
              }}
            >
              {/* Icon Visual Container (Consistent 56x56 frame for optical alignment) */}
              <div
                style={{
                  position: 'relative',
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: isDragging
                    ? 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.45)) brightness(1.05)'
                    : isSelected
                    ? 'brightness(0.85) drop-shadow(0 2px 6px rgba(0,122,255,0.4))'
                    : 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35))',
                }}
              >
                {item.kind === 'drive' ? (
                  <MacintoshHDIcon size={54} />
                ) : item.kind === 'folder' ? (
                  <MacOSFolderIcon size={54} />
                ) : (
                  <FinderFileIcon kind={item.kind} size={50} name={item.name} />
                )}
              </div>

              {/* Text Label Pill */}
              <div
                title={item.name}
                style={{
                  marginTop: 4,
                  width: 92,
                  maxWidth: 92,
                  textAlign: 'center',
                  padding: '2px 5px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 500,
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em',
                  color: '#ffffff',
                  backgroundColor: isSelected ? accentHex : 'transparent',
                  textShadow: isSelected
                    ? 'none'
                    : '0 1px 2px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.7)',
                  boxShadow: isSelected ? '0 0 0 0.5px rgba(255,255,255,0.35)' : 'none',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  transition: 'background-color 0.12s ease',
                  userSelect: 'none',
                }}
              >
                {item.displayName}
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── macOS Right-Click Context Menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div
            data-desktop-menu
            initial={{ opacity: 0, scale: 0.94, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -2 }}
            transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              left: contextMenu.x,
              top: contextMenu.y,
              zIndex: 9999,
              width: 210,
              padding: '5px',
              borderRadius: 10,
              backgroundColor: isDark ? 'rgba(36, 36, 40, 0.88)' : 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(40px) saturate(190%)',
              WebkitBackdropFilter: 'blur(40px) saturate(190%)',
              border: isDark ? '0.5px solid rgba(255, 255, 255, 0.16)' : '0.5px solid rgba(0, 0, 0, 0.14)',
              boxShadow: '0 14px 34px rgba(0, 0, 0, 0.38), 0 2px 8px rgba(0, 0, 0, 0.18)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              fontSize: 12.5,
              userSelect: 'none',
            }}
          >
            {contextMenu.item ? (
              // ── Menu for Specific Desktop Icon ──
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <ContextMenuItem
                  label="Open"
                  bold
                  icon={<Eye size={13} />}
                  onClick={() => handleOpenItem(contextMenu.item!)}
                  accentHex={accentHex}
                  isDark={isDark}
                />
                <ContextMenuItem
                  label="Quick Look"
                  shortcut="Space"
                  icon={<Eye size={13} />}
                  onClick={() => handleOpenItem(contextMenu.item!)}
                  accentHex={accentHex}
                  isDark={isDark}
                />
                <ContextMenuItem
                  label="Get Info"
                  shortcut="⌘I"
                  icon={<Info size={13} />}
                  onClick={() => {
                    soundEngine.play('action')
                    setGetInfoItem(contextMenu.item)
                    setContextMenu({ visible: false, x: 0, y: 0, item: null })
                  }}
                  accentHex={accentHex}
                  isDark={isDark}
                />

                <MenuDivider isDark={isDark} />

                <ContextMenuItem
                  label={`Copy "${contextMenu.item.name}"`}
                  shortcut="⌘C"
                  icon={<Copy size={13} />}
                  onClick={() => {
                    soundEngine.play('click')
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(contextMenu.item!.name)
                    }
                    setContextMenu({ visible: false, x: 0, y: 0, item: null })
                  }}
                  accentHex={accentHex}
                  isDark={isDark}
                />

                {contextMenu.item.kind === 'pdf' && (
                  <ContextMenuItem
                    label="Download Resume"
                    icon={<Download size={13} />}
                    onClick={() => {
                      soundEngine.play('pop')
                      const a = document.createElement('a')
                      a.href = '/Yamin_Hossain_Resume.pdf'
                      a.download = 'Yamin_Hossain_Resume.pdf'
                      a.click()
                      setContextMenu({ visible: false, x: 0, y: 0, item: null })
                    }}
                    accentHex={accentHex}
                    isDark={isDark}
                  />
                )}
              </div>
            ) : (
              // ── Menu for Empty Desktop Wallpaper ──
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <ContextMenuItem
                  label="New Folder"
                  icon={<FolderPlus size={13} />}
                  onClick={() => {
                    soundEngine.play('pop')
                    openFinderFile('/Users/yamin')
                    setContextMenu({ visible: false, x: 0, y: 0, item: null })
                  }}
                  accentHex={accentHex}
                  isDark={isDark}
                />
                <ContextMenuItem
                  label="Clean Up By Name"
                  icon={<RefreshCw size={13} />}
                  onClick={handleCleanUp}
                  accentHex={accentHex}
                  isDark={isDark}
                />
                <ContextMenuItem
                  label="Open in Terminal"
                  icon={<TerminalIcon size={13} />}
                  onClick={() => {
                    openApp('terminal')
                    setContextMenu({ visible: false, x: 0, y: 0, item: null })
                  }}
                  accentHex={accentHex}
                  isDark={isDark}
                />

                <MenuDivider isDark={isDark} />

                <ContextMenuItem
                  label="Change Wallpaper..."
                  icon={<Sparkles size={13} />}
                  onClick={() => {
                    openApp('settings')
                    setContextMenu({ visible: false, x: 0, y: 0, item: null })
                  }}
                  accentHex={accentHex}
                  isDark={isDark}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── macOS "Get Info" Floating Inspector Modal ────────────────────────────── */}
      <AnimatePresence>
        {getInfoItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '22%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              width: 320,
              borderRadius: 14,
              backgroundColor: isDark ? 'rgba(38, 38, 42, 0.94)' : 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(50px) saturate(190%)',
              WebkitBackdropFilter: 'blur(50px) saturate(190%)',
              border: isDark ? '0.5px solid rgba(255, 255, 255, 0.18)' : '0.5px solid rgba(0, 0, 0, 0.16)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45), 0 4px 16px rgba(0, 0, 0, 0.18)',
              overflow: 'hidden',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
              userSelect: 'none',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderBottom: isDark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#fff' : '#1d1d1f' }}>
                {getInfoItem.name} Info
              </div>
              <button
                onClick={() => setGetInfoItem(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 2,
                  borderRadius: 4,
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Icon & Name */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 54, height: 54, flexShrink: 0 }}>
                  {getInfoItem.kind === 'drive' ? (
                    <MacintoshHDIcon size={54} />
                  ) : getInfoItem.kind === 'folder' ? (
                    <MacOSFolderIcon size={52} />
                  ) : (
                    <FinderFileIcon kind={getInfoItem.kind} size={50} name={getInfoItem.name} />
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isDark ? '#ffffff' : '#1d1d1f',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getInfoItem.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                    {getInfoItem.info.kindLabel}
                  </div>
                  <div style={{ fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                    {getInfoItem.info.sizeLabel}
                  </div>
                </div>
              </div>

              {/* Metadata Attributes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr',
                  gap: '6px 10px',
                  fontSize: 11.5,
                  lineHeight: 1.4,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  padding: '10px 12px',
                  borderRadius: 8,
                }}
              >
                <span style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>Where:</span>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)', wordBreak: 'break-all' }}>
                  {getInfoItem.info.whereLabel}
                </span>

                <span style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>Created:</span>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)' }}>
                  {getInfoItem.info.created}
                </span>

                <span style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)' }}>Modified:</span>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)' }}>
                  {getInfoItem.info.modified}
                </span>
              </div>

              {/* Description */}
              <div style={{ fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)', lineHeight: 1.45 }}>
                {getInfoItem.info.description}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => {
                    handleOpenItem(getInfoItem)
                    setGetInfoItem(null)
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    borderRadius: 6,
                    backgroundColor: accentHex,
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                  }}
                >
                  Open Item
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Sub-Component: Context Menu Item ─────────────────────────────────────────
function ContextMenuItem({
  label,
  shortcut,
  bold = false,
  icon,
  onClick,
  accentHex,
  isDark,
}: {
  label: string
  shortcut?: string
  bold?: boolean
  icon?: React.ReactNode
  onClick: () => void
  accentHex: string
  isDark: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 8px',
        borderRadius: 5,
        backgroundColor: hovered ? accentHex : 'transparent',
        color: hovered ? '#ffffff' : isDark ? '#ffffff' : '#1d1d1f',
        fontWeight: bold ? 600 : 400,
        cursor: 'default',
        transition: 'background-color 0.08s ease, color 0.08s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && (
          <span style={{ opacity: hovered ? 1 : 0.65, display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
        <span>{label}</span>
      </div>
      {shortcut && (
        <span
          style={{
            fontSize: 11,
            opacity: hovered ? 0.9 : 0.45,
            marginLeft: 12,
          }}
        >
          {shortcut}
        </span>
      )}
    </div>
  )
}

function MenuDivider({ isDark }: { isDark: boolean }) {
  return (
    <div
      style={{
        height: '0.5px',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        margin: '4px 6px',
      }}
    />
  )
}
