'use client'

import React from 'react'
import FinderZipIcon from './FinderZipIcon'
import MacOSFolderIcon from '../notes/MacOSFolderIcon'

export type FileKind =
  | 'folder'
  | 'zip'
  | 'image'
  | 'pdf'
  | 'markdown'
  | 'code'
  | 'audio'
  | 'video'
  | 'app'
  | 'text'
  | 'generic'

interface FinderFileIconProps {
  kind: FileKind
  size?: number
  name?: string
  style?: React.CSSProperties
  className?: string
  appIconSrc?: string
}

export function FinderFileIcon({
  kind,
  size = 64,
  name,
  style,
  className,
  appIconSrc,
}: FinderFileIconProps) {
  if (kind === 'folder') {
    return <MacOSFolderIcon size={size} style={style} className={className} />
  }

  if (kind === 'zip') {
    return <FinderZipIcon size={size} style={style} className={className} />
  }

  if (kind === 'app' && appIconSrc) {
    return (
      <img
        src={appIconSrc}
        alt={name || 'App'}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.22))',
          ...style,
        }}
        className={className}
      />
    )
  }

  // Base document sheet metrics
  const isPdf = kind === 'pdf'
  const isMd = kind === 'markdown'
  const isCode = kind === 'code'
  const isImg = kind === 'image'
  const isTxt = kind === 'text'

  const accentColor = isPdf
    ? '#FF3B30'
    : isMd
    ? '#007AFF'
    : isCode
    ? '#AF52DE'
    : isImg
    ? '#34C759'
    : '#8E8E93'

  const extensionLabel = isPdf
    ? 'PDF'
    : isMd
    ? 'MD'
    : isCode
    ? 'CODE'
    : isImg
    ? 'IMG'
    : isTxt
    ? 'TXT'
    : 'DOC'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.16))',
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`docBg-${kind}`} x1="40" y1="0" x2="40" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F8F9FA" />
          <stop offset="100%" stopColor="#E9EBEF" />
        </linearGradient>
        <linearGradient id={`docFold-${kind}`} x1="56" y1="0" x2="80" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E5E8EC" />
          <stop offset="100%" stopColor="#C8CCD4" />
        </linearGradient>
      </defs>

      {/* Sheet Body */}
      <path
        d="M 10 2 C 5.6 2 2 5.6 2 10 L 2 86 C 2 90.4 5.6 94 10 94 L 70 94 C 74.4 94 78 90.4 78 86 L 78 24 L 56 2 Z"
        fill={`url(#docBg-${kind})`}
        stroke="#D2D6DE"
        strokeWidth="1.2"
      />

      {/* Folded Corner */}
      <path
        d="M 56 2 L 78 24 L 62 24 C 58.7 24 56 21.3 56 18 Z"
        fill={`url(#docFold-${kind})`}
        stroke="#B4B9C4"
        strokeWidth="1"
      />

      {/* Horizontal Document Texture Lines */}
      <rect x="14" y="24" width="32" height="3" rx="1.5" fill="#DCE0E8" />
      <rect x="14" y="32" width="52" height="2.5" rx="1.2" fill="#E8ECF2" />
      <rect x="14" y="39" width="46" height="2.5" rx="1.2" fill="#E8ECF2" />
      <rect x="14" y="46" width="52" height="2.5" rx="1.2" fill="#E8ECF2" />

      {/* Icon Badge Graphic */}
      {isPdf && (
        <g transform="translate(24, 54)">
          <rect width="32" height="24" rx="4" fill="#FF3B30" fillOpacity="0.12" />
          <rect x="2" y="2" width="28" height="20" rx="3" stroke="#FF3B30" strokeWidth="1.2" fill="none" />
          <text x="16" y="16" textAnchor="middle" fill="#FF3B30" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            PDF
          </text>
        </g>
      )}

      {isMd && (
        <g transform="translate(24, 54)">
          <rect width="32" height="24" rx="4" fill="#007AFF" fillOpacity="0.12" />
          <text x="16" y="16" textAnchor="middle" fill="#007AFF" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            M↓
          </text>
        </g>
      )}

      {isCode && (
        <g transform="translate(24, 54)">
          <rect width="32" height="24" rx="4" fill="#AF52DE" fillOpacity="0.12" />
          <text x="16" y="16" textAnchor="middle" fill="#AF52DE" fontSize="12" fontWeight="800" fontFamily="monospace">
            &lt;/&gt;
          </text>
        </g>
      )}

      {isImg && (
        <g transform="translate(24, 54)">
          <rect width="32" height="24" rx="4" fill="#34C759" fillOpacity="0.12" />
          <circle cx="12" cy="9" r="2.5" fill="#34C759" />
          <path d="M 6 20 L 14 13 L 20 18 L 26 11 L 30 20 Z" fill="#34C759" opacity="0.8" />
        </g>
      )}

      {!isPdf && !isMd && !isCode && !isImg && (
        <g transform="translate(24, 54)">
          <text x="16" y="16" textAnchor="middle" fill="#8E8E93" fontSize="9" fontWeight="700" fontFamily="sans-serif">
            {extensionLabel}
          </text>
        </g>
      )}
    </svg>
  )
}

export default FinderFileIcon
