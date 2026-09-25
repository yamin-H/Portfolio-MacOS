'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'
import { FSEntry, FileTag, TAG_COLORS } from './finderData'
import { SortField } from '../Finder'
import { soundEngine } from '@/lib/sound/soundEngine'

interface FinderContextMenuProps {
  x: number
  y: number
  item: FSEntry | null
  isDark: boolean
  accentHex: string
  clipboard: { items: FSEntry[]; mode: 'copy' | 'cut' } | null
  sortField: SortField
  onClose: () => void
  onOpen: (item: FSEntry) => void
  onQuickLook: (item: FSEntry) => void
  onCopy: (item: FSEntry) => void
  onCut: (item: FSEntry) => void
  onPaste: () => void
  onDuplicate: (item: FSEntry) => void
  onRename: (item: FSEntry) => void
  onDelete: (id: string) => void
  onSetTag: (item: FSEntry, tag?: FileTag) => void
  onNewFolder: () => void
  onNewFile: () => void
  onRefresh: () => void
  onGetInfo: (item?: FSEntry) => void
  onSortBy: (field: SortField) => void
  onCleanUp: () => void
  onShowViewOptions?: () => void
}

export default function FinderContextMenu({
  x,
  y,
  item,
  isDark,
  accentHex,
  clipboard,
  sortField,
  onClose,
  onOpen,
  onQuickLook,
  onCopy,
  onCut,
  onPaste,
  onDuplicate,
  onRename,
  onDelete,
  onSetTag,
  onNewFolder,
  onNewFile,
  onRefresh,
  onGetInfo,
  onSortBy,
  onCleanUp,
  onShowViewOptions,
}: FinderContextMenuProps) {
  const [hoveredIdx, setHoveredIdx] = useState<string | null>(null)
  const [isSortSubmenuOpen, setIsSortSubmenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x, y })

  // Calculate viewport boundaries and clamp positions so menu is never cut off
  useEffect(() => {
    const MENU_WIDTH = 220
    const MENU_HEIGHT = item ? 360 : 310
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800

    let posX = x
    let posY = y

    if (posX + MENU_WIDTH > vw - 12) {
      posX = Math.max(12, vw - MENU_WIDTH - 12)
    }
    if (posY + MENU_HEIGHT > vh - 24) {
      posY = Math.max(36, vh - MENU_HEIGHT - 24)
    }

    setCoords({ x: posX, y: posY })
  }, [x, y, item])

  // Colors & visual tokens matching macOS Sequoia / Sonoma strictly
  const bg = isDark ? 'rgba(38, 38, 42, 0.88)' : 'rgba(246, 246, 246, 0.88)'
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
  const shadow = isDark
    ? '0 16px 36px rgba(0, 0, 0, 0.55), 0 0 1px rgba(255, 255, 255, 0.15)'
    : '0 12px 30px rgba(0, 0, 0, 0.22), 0 0 1px rgba(0, 0, 0, 0.25)'
  const textColor = isDark ? '#FFFFFF' : '#1D1D1F'
  const shortcutColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'
  const separatorColor = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)'

  // Truncate name cleanly for Copy "<name>"
  const displayName = item
    ? item.name.length > 16
      ? item.name.substring(0, 14) + '…'
      : item.name
    : ''

  const renderItem = ({
    id,
    label,
    shortcut,
    onClick,
    isDestructive = false,
    disabled = false,
    hasSubmenu = false,
    onMouseEnter,
    onMouseLeave,
  }: {
    id: string
    label: string
    shortcut?: string
    onClick?: () => void
    isDestructive?: boolean
    disabled?: boolean
    hasSubmenu?: boolean
    onMouseEnter?: () => void
    onMouseLeave?: () => void
  }) => {
    const isHovered = hoveredIdx === id && !disabled

    return (
      <div
        key={id}
        onMouseEnter={() => {
          if (!disabled) {
            setHoveredIdx(id)
            if (onMouseEnter) onMouseEnter()
          }
        }}
        onMouseLeave={() => {
          if (onMouseLeave) onMouseLeave()
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (disabled) return
          if (onClick) {
            onClick()
            onClose()
          }
        }}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 24,
          padding: '0 8px',
          margin: '1px 0',
          borderRadius: 5,
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.38 : 1,
          backgroundColor: isHovered
            ? isDestructive
              ? '#FF3B30'
              : accentHex || '#007AFF'
            : 'transparent',
          color: isHovered
            ? '#FFFFFF'
            : isDestructive
            ? '#FF3B30'
            : textColor,
          fontSize: 12.5,
          fontWeight: 400,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", sans-serif',
          letterSpacing: '-0.01em',
          userSelect: 'none',
          transition: 'background-color 0.06s ease, color 0.06s ease',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>

        {hasSubmenu ? (
          <ChevronRight
            size={12}
            style={{
              color: isHovered ? '#FFFFFF' : shortcutColor,
              marginLeft: 8,
              flexShrink: 0,
            }}
          />
        ) : shortcut ? (
          <span
            style={{
              fontSize: 11,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              color: isHovered ? 'rgba(255, 255, 255, 0.85)' : shortcutColor,
              marginLeft: 12,
              flexShrink: 0,
            }}
          >
            {shortcut}
          </span>
        ) : null}
      </div>
    )
  }

  const renderSeparator = (key: string) => (
    <div
      key={key}
      style={{
        height: 1,
        margin: '4px 6px',
        backgroundColor: separatorColor,
      }}
    />
  )

  // Submenu flip detection (if menu is near right edge, submenu opens on left)
  const shouldSubmenuOpenLeft = coords.x + 220 + 175 > (typeof window !== 'undefined' ? window.innerWidth : 1200)

  return (
    <>
      {/* ── Invisible Click-Away Backdrop ── */}
      <div
        onPointerDown={(e) => {
          e.stopPropagation()
          onClose()
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          cursor: 'default',
        }}
      />

      {/* ── macOS Context Menu Popup ── */}
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.94, y: -2 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          left: coords.x,
          top: coords.y,
          width: 220,
          borderRadius: 9,
          backgroundColor: bg,
          backdropFilter: 'blur(30px) saturate(200%)',
          WebkitBackdropFilter: 'blur(30px) saturate(200%)',
          boxShadow: shadow,
          border: `1px solid ${borderColor}`,
          padding: '4px',
          zIndex: 99999,
          fontSize: 12.5,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", sans-serif',
          color: textColor,
          userSelect: 'none',
          transformOrigin: 'top left',
        }}
      >
        {item ? (
          /* ───────────── ITEM CONTEXT MENU (FILE / FOLDER) ───────────── */
          <>
            {renderItem({
              id: 'open',
              label: 'Open',
              onClick: () => onOpen(item),
            })}

            {!item.isFolder &&
              renderItem({
                id: 'quicklook',
                label: 'Quick Look',
                shortcut: 'Space',
                onClick: () => onQuickLook(item),
              })}

            {renderSeparator('sep-trash')}

            {renderItem({
              id: 'trash',
              label: 'Move to Trash',
              shortcut: '⌘⌫',
              isDestructive: true,
              onClick: () => onDelete(item.id),
            })}

            {renderSeparator('sep-info')}

            {renderItem({
              id: 'getinfo',
              label: 'Get Info',
              shortcut: '⌘I',
              onClick: () => onGetInfo(item),
            })}

            {renderItem({
              id: 'rename',
              label: 'Rename',
              shortcut: 'Enter',
              onClick: () => onRename(item),
            })}

            {renderItem({
              id: 'duplicate',
              label: 'Duplicate',
              shortcut: '⌘D',
              onClick: () => onDuplicate(item),
            })}

            {renderSeparator('sep-clipboard')}

            {renderItem({
              id: 'copy',
              label: `Copy “${displayName}”`,
              shortcut: '⌘C',
              onClick: () => onCopy(item),
            })}

            {renderItem({
              id: 'cut',
              label: 'Cut',
              shortcut: '⌘X',
              onClick: () => onCut(item),
            })}

            {renderSeparator('sep-tags')}

            {/* ── macOS 7-Color Tags Palette ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 8px',
                marginTop: 2,
              }}
            >
              {(Object.entries(TAG_COLORS) as [FileTag, { name: string; hex: string }][]).map(
                ([tKey, tObj]) => {
                  const isTagActive = item.tag === tKey
                  return (
                    <button
                      key={tKey}
                      title={tObj.name}
                      onClick={(e) => {
                        e.stopPropagation()
                        soundEngine.play('click')
                        onSetTag(item, isTagActive ? undefined : tKey)
                        onClose()
                      }}
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: '50%',
                        backgroundColor: tObj.hex,
                        border: isTagActive
                          ? '2px solid #FFFFFF'
                          : '1px solid rgba(0, 0, 0, 0.15)',
                        boxShadow: isTagActive ? '0 0 0 1.5px ' + tObj.hex : 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.18)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                      }}
                    >
                      {isTagActive && (
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      )}
                    </button>
                  )
                }
              )}
            </div>
          </>
        ) : (
          /* ───────────── CANVAS CONTEXT MENU (EMPTY SPACE) ───────────── */
          <>
            {renderItem({
              id: 'newfolder',
              label: 'New Folder',
              shortcut: '⇧⌘N',
              onClick: onNewFolder,
            })}

            {renderItem({
              id: 'newfile',
              label: 'New File',
              shortcut: '⌘N',
              onClick: onNewFile,
            })}

            {renderSeparator('sep-canvas-info')}

            {renderItem({
              id: 'getinfo-canvas',
              label: 'Get Info',
              shortcut: '⌘I',
              onClick: () => onGetInfo(),
            })}

            {renderItem({
              id: 'refresh',
              label: 'Refresh',
              shortcut: '⌘R',
              onClick: onRefresh,
            })}

            {renderSeparator('sep-paste')}

            {renderItem({
              id: 'paste',
              label: clipboard && clipboard.items.length > 0
                ? `Paste (${clipboard.items.length} item${clipboard.items.length > 1 ? 's' : ''})`
                : 'Paste Item',
              shortcut: '⌘V',
              disabled: !clipboard || clipboard.items.length === 0,
              onClick: onPaste,
            })}

            {renderSeparator('sep-sort')}

            {/* Sort By item with hover submenu */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setIsSortSubmenuOpen(true)}
              onMouseLeave={() => setIsSortSubmenuOpen(false)}
            >
              {renderItem({
                id: 'sortby',
                label: 'Sort By',
                hasSubmenu: true,
              })}

              <AnimatePresence>
                {isSortSubmenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: shouldSubmenuOpenLeft ? 4 : -4 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'absolute',
                      left: shouldSubmenuOpenLeft ? undefined : '100%',
                      right: shouldSubmenuOpenLeft ? '100%' : undefined,
                      top: -4,
                      marginLeft: shouldSubmenuOpenLeft ? 0 : 4,
                      marginRight: shouldSubmenuOpenLeft ? 4 : 0,
                      width: 170,
                      padding: '4px',
                      borderRadius: 9,
                      backgroundColor: bg,
                      backdropFilter: 'blur(30px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                      boxShadow: shadow,
                      border: `1px solid ${borderColor}`,
                      zIndex: 100000,
                    }}
                  >
                    {[
                      { field: 'name' as SortField, label: 'Name' },
                      { field: 'kind' as SortField, label: 'Kind' },
                      { field: 'dateModified' as SortField, label: 'Date Modified' },
                      { field: 'size' as SortField, label: 'Size' },
                    ].map(({ field, label }) => {
                      const isSelected = sortField === field
                      const isHovered = hoveredIdx === `sort-${field}`

                      return (
                        <div
                          key={field}
                          onMouseEnter={() => setHoveredIdx(`sort-${field}`)}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSortBy(field)
                            onClose()
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 24,
                            padding: '0 8px',
                            margin: '1px 0',
                            borderRadius: 5,
                            cursor: 'pointer',
                            backgroundColor: isHovered ? accentHex || '#007AFF' : 'transparent',
                            color: isHovered ? '#FFFFFF' : textColor,
                            fontSize: 12.5,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                          }}
                        >
                          <span>{label}</span>
                          {isSelected && (
                            <Check
                              size={12}
                              style={{
                                color: isHovered ? '#FFFFFF' : accentHex || '#007AFF',
                              }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {renderItem({
              id: 'cleanup',
              label: 'Clean Up',
              onClick: onCleanUp,
            })}

            {renderSeparator('sep-view-options')}

            {renderItem({
              id: 'viewoptions',
              label: 'Show View Options',
              shortcut: '⌘J',
              onClick: onShowViewOptions || onRefresh,
            })}
          </>
        )}
      </motion.div>
    </>
  )
}
