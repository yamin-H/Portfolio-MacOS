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
  | 'link'

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
  const isLink = kind === 'link' || Boolean(name && (name.endsWith('.url') || name.endsWith('.webloc')))
  const isGithub = isLink && Boolean(name && name.toLowerCase().includes('github'))
  const isDemo = isLink && !isGithub

  const accentColor = isPdf
    ? '#FF3B30'
    : isMd
    ? '#007AFF'
    : isCode
    ? '#AF52DE'
    : isImg
    ? '#34C759'
    : isGithub
    ? '#24292F'
    : isDemo
    ? '#007AFF'
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
    : isLink
    ? 'URL'
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

      {isGithub && (
        <g transform="translate(22, 50)">
          <rect width="36" height="28" rx="6" fill="#24292F" />
          <path
            d="M18 6C13.58 6 10 9.58 10 14C10 17.54 12.29 20.53 15.47 21.6C15.87 21.67 16.02 21.42 16.02 21.21C16.02 21.02 16.01 20.41 16.01 19.73C13.78 20.21 13.31 18.76 13.31 18.76C12.95 17.84 12.43 17.59 12.43 17.59C11.7 17.09 12.49 17.1 12.49 17.1C13.3 17.16 13.72 17.94 13.72 17.94C14.44 19.17 15.6 18.81 16.06 18.6C16.13 18.08 16.34 17.72 16.57 17.52C14.79 17.32 12.92 16.63 12.92 13.58C12.92 12.71 13.23 12.01 13.74 11.45C13.66 11.25 13.39 10.45 13.82 9.35C13.82 9.35 14.49 9.14 16.01 10.17C16.65 9.99 17.33 9.9 18.01 9.9C18.69 9.9 19.37 9.99 20.01 10.17C21.53 9.14 22.2 9.35 22.2 9.35C22.63 10.45 22.36 11.25 22.28 11.45C22.79 12.01 23.1 12.71 23.1 13.58C23.1 16.64 21.22 17.32 19.43 17.52C19.73 17.77 19.99 18.28 19.99 19.05C19.99 20.15 19.98 21.04 19.98 21.21C19.98 21.42 20.13 21.68 20.54 21.6C23.71 20.53 26 17.53 26 14C26 9.58 22.42 6 18 6Z"
            fill="#FFFFFF"
          />
        </g>
      )}

      {isDemo && (
        <g transform="translate(22, 50)">
          <rect width="36" height="28" rx="6" fill="#007AFF" />
          <circle cx="18" cy="14" r="8" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          <ellipse cx="18" cy="14" rx="3.8" ry="8" stroke="#FFFFFF" strokeWidth="1" fill="none" />
          <line x1="10" y1="14" x2="26" y2="14" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="24" cy="8" r="2.5" fill="#30D158" stroke="#007AFF" strokeWidth="0.8" />
        </g>
      )}

      {!isPdf && !isMd && !isCode && !isImg && !isLink && (
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
