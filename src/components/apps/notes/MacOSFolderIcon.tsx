'use client'

import React, { useState } from 'react'

interface MacOSFolderIconProps {
  size?: number
  style?: React.CSSProperties
  className?: string
}

export function MacOSFolderIcon({ size = 18, style, className }: MacOSFolderIconProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <MacOSFolderSvg size={size} style={style} />
  }

  return (
    <img
      src="/macos-folder.webp"
      alt="Folder"
      width={size}
      height={size}
      onError={() => setHasError(true)}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      className={className}
    />
  )
}

export function MacOSFolderSvg({ size = 18, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      <defs>
        <linearGradient id="macFolderFront" x1="0" y1="20" x2="0" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67B8FE" />
          <stop offset="50%" stopColor="#4FA6FA" />
          <stop offset="100%" stopColor="#3792F6" />
        </linearGradient>
        <linearGradient id="macFolderBack" x1="0" y1="10" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2585E8" />
          <stop offset="100%" stopColor="#1B74D8" />
        </linearGradient>
      </defs>
      {/* Back Tab */}
      <path
        d="M 12 18 C 12 13 16 10 21 10 L 38 10 C 43 10 46 13 49 16 L 53 20 C 56 22 59 23 63 23 L 88 23 C 93 23 96 26 96 31 L 96 45 L 8 45 L 8 22 C 8 20 9 18 12 18 Z"
        fill="url(#macFolderBack)"
      />
      {/* Front Flap */}
      <rect
        x="8"
        y="23"
        width="88"
        height="58"
        rx="11"
        fill="url(#macFolderFront)"
      />
    </svg>
  )
}

export default MacOSFolderIcon
