'use client'

import React from 'react'
import { FSEntry, TAG_COLORS } from './finderData'
import FinderFileIcon from './FinderFileIcon'
import MacOSFolderIcon from '../notes/MacOSFolderIcon'
import { ChevronRight } from 'lucide-react'

interface ColumnViewProps {
  currentPath: string
  entries: FSEntry[]
  allEntries: FSEntry[]
  selectedItem: FSEntry | null
  onSelectItem: (item: FSEntry) => void
  onOpenFolder: (path: string) => void
  onQuickLook: (item: FSEntry) => void
  onContextMenu?: (item: FSEntry, e: React.MouseEvent) => void
  onCanvasContextMenu?: (e: React.MouseEvent) => void
  isDark?: boolean
}

export function ColumnView({
  currentPath,
  entries,
  allEntries,
  selectedItem,
  onSelectItem,
  onOpenFolder,
  onQuickLook,
  onContextMenu,
  onCanvasContextMenu,
  isDark = false,
}: ColumnViewProps) {
  // Break current path into hierarchy segments
  const pathParts = currentPath.split('/').filter(Boolean)
  // Reconstruct column paths: e.g. ["/Users/conxt", "/Users/conxt/Documents", "/Users/conxt/Documents/Assets"]
  const columns: Array<{ path: string; items: FSEntry[] }> = []

  let buildPath = ''
  for (let i = 0; i < pathParts.length; i++) {
    buildPath += '/' + pathParts[i]
    if (i >= 1) { // Skip root '/'
      const parent = buildPath.substring(0, buildPath.lastIndexOf('/')) || '/'
      const colItems = allEntries.filter((e) => e.parentPath === parent)
      if (colItems.length > 0) {
        columns.push({ path: parent, items: colItems })
      }
    }
  }

  // Add the active current folder's contents as the current column
  columns.push({ path: currentPath, items: entries })

  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.10)'
  const textColor = isDark ? '#FFFFFF' : '#1D1D1F'
  const subtextColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)'

  return (
    <div
      onContextMenu={(e) => {
        if (e.target === e.currentTarget && onCanvasContextMenu) {
          e.preventDefault()
          onCanvasContextMenu(e)
        }
      }}
      style={{
        display: 'flex',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        backgroundColor: isDark ? '#1C1D22' : '#FFFFFF',
      }}
    >
      {/* Dynamic Columns */}
      {columns.map((col, cIdx) => (
        <div
          key={col.path + cIdx}
          onContextMenu={(e) => {
            if (e.target === e.currentTarget && onCanvasContextMenu) {
              e.preventDefault()
              onCanvasContextMenu(e)
            }
          }}
          style={{
            width: 220,
            minWidth: 200,
            height: '100%',
            borderRight: `1px solid ${borderColor}`,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: isDark ? '#1C1D22' : '#FFFFFF',
          }}
        >
          {col.items.map((item) => {
            const isSelected = selectedItem?.id === item.id
            const tagColor = item.tag ? TAG_COLORS[item.tag]?.hex : null

            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item)
                  if (item.isFolder) {
                    onOpenFolder(`${item.parentPath}/${item.name}`)
                  }
                }}
                onDoubleClick={() => {
                  if (item.isFolder) {
                    onOpenFolder(`${item.parentPath}/${item.name}`)
                  } else {
                    onQuickLook(item)
                  }
                }}
                onContextMenu={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  if (onContextMenu) {
                    onContextMenu(item, e)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '5px 10px',
                  gap: 8,
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#007AFF' : 'transparent',
                  color: isSelected ? '#FFFFFF' : textColor,
                  fontSize: 12.5,
                  userSelect: 'none',
                }}
              >
                {item.isFolder ? (
                  <MacOSFolderIcon size={16} />
                ) : (
                  <FinderFileIcon kind={item.kind} size={16} appIconSrc={item.appIconSrc} />
                )}

                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: isSelected ? 500 : 400,
                  }}
                >
                  {item.name}
                </span>

                {/* Colored Tag Dot */}
                {tagColor && (
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: tagColor,
                      flexShrink: 0,
                    }}
                  />
                )}

                {item.isFolder && (
                  <ChevronRight
                    size={13}
                    style={{
                      opacity: isSelected ? 1 : 0.4,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      ))}

      {/* Preview Column (when an item is selected) */}
      {selectedItem && (
        <div
          onContextMenu={(e) => {
            e.stopPropagation()
            e.preventDefault()
            if (onContextMenu) {
              onContextMenu(selectedItem, e)
            }
          }}
          style={{
            width: 270,
            minWidth: 260,
            height: '100%',
            overflowY: 'auto',
            padding: '24px 18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: isDark ? '#181A1F' : '#F9FAFC',
            borderRight: `1px solid ${borderColor}`,
          }}
        >
          {/* Big Centered Icon */}
          <div style={{ marginTop: 12, marginBottom: 16 }}>
            {selectedItem.isFolder ? (
              <MacOSFolderIcon size={76} />
            ) : (
              <FinderFileIcon
                kind={selectedItem.kind}
                size={76}
                appIconSrc={selectedItem.appIconSrc}
              />
            )}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: textColor,
              textAlign: 'center',
              wordBreak: 'break-word',
              marginBottom: 4,
            }}
          >
            {selectedItem.name}
          </div>

          {/* Subtext */}
          <div
            style={{
              fontSize: 11.5,
              color: subtextColor,
              marginBottom: 20,
            }}
          >
            {selectedItem.isFolder ? 'Folder' : `${selectedItem.kind.toUpperCase()} document`} — {selectedItem.size}
          </div>

          {/* Quick Look Action Button */}
          {!selectedItem.isFolder && (
            <button
              onClick={() => onQuickLook(selectedItem)}
              style={{
                width: '100%',
                padding: '6px 12px',
                borderRadius: 6,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB',
                border: 'none',
                color: textColor,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                marginBottom: 24,
              }}
            >
              Quick Look
            </button>
          )}

          {/* Metadata Section */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: 11.5,
              borderTop: `1px solid ${borderColor}`,
              paddingTop: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: subtextColor }}>Kind</span>
              <span style={{ color: textColor, fontWeight: 500 }}>
                {selectedItem.isFolder ? 'Folder' : selectedItem.kind}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: subtextColor }}>Size</span>
              <span style={{ color: textColor, fontWeight: 500 }}>{selectedItem.size}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: subtextColor }}>Created</span>
              <span style={{ color: textColor }}>{selectedItem.dateCreated}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: subtextColor }}>Modified</span>
              <span style={{ color: textColor }}>{selectedItem.dateModified}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColumnView
