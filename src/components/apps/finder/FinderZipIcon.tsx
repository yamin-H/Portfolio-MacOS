'use client'

import React from 'react'

interface FinderZipIconProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Authentic Apple macOS ZIP Archive Icon
 * Features the signature white document sheet with folded corner,
 * realistic textured zipper running down the center, and the "ZIP" label badge.
 */
export function FinderZipIcon({ size = 64, className, style }: FinderZipIconProps) {
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
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18))',
        ...style,
      }}
    >
      <defs>
        {/* Document Body Gradient */}
        <linearGradient id="zipDocBg" x1="40" y1="0" x2="40" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F5F6F8" />
          <stop offset="100%" stopColor="#E4E6EB" />
        </linearGradient>

        {/* Fold Corner Gradient */}
        <linearGradient id="zipFoldBg" x1="56" y1="0" x2="80" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E5E8EC" />
          <stop offset="100%" stopColor="#C8CCD4" />
        </linearGradient>

        {/* Zipper Teeth Gradient */}
        <linearGradient id="zipTeeth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A92A0" />
          <stop offset="100%" stopColor="#555E6D" />
        </linearGradient>

        {/* Zipper Pull Metallic Gradient */}
        <linearGradient id="zipPull" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E6EAF0" />
          <stop offset="40%" stopColor="#B0B8C5" />
          <stop offset="70%" stopColor="#7A8494" />
          <stop offset="100%" stopColor="#525B6A" />
        </linearGradient>
      </defs>

      {/* Main Document Body with Corner Cut */}
      <path
        d="M 10 2 C 5.6 2 2 5.6 2 10 L 2 86 C 2 90.4 5.6 94 10 94 L 70 94 C 74.4 94 78 90.4 78 86 L 78 24 L 56 2 Z"
        fill="url(#zipDocBg)"
        stroke="#D2D6DE"
        strokeWidth="1.2"
      />

      {/* Folded Top-Right Corner */}
      <path
        d="M 56 2 L 78 24 L 62 24 C 58.7 24 56 21.3 56 18 Z"
        fill="url(#zipFoldBg)"
        stroke="#B4B9C4"
        strokeWidth="1"
      />
      <path
        d="M 56 2 L 56 18 C 56 21.3 58.7 24 62 24 L 78 24"
        stroke="#B4B9C4"
        strokeWidth="0.8"
        fill="none"
      />

      {/* Center Vertical Zipper Track */}
      <rect x="37" y="10" width="6" height="52" fill="#DDE1E8" rx="1" />
      <line x1="40" y1="10" x2="40" y2="62" stroke="#A6AFBD" strokeWidth="1" />

      {/* Interlocking Zipper Teeth */}
      {[14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54].map((y, i) => (
        <rect
          key={y}
          x={i % 2 === 0 ? 36.5 : 40}
          y={y}
          width="3.5"
          height="2"
          rx="0.5"
          fill="url(#zipTeeth)"
        />
      ))}

      {/* Zipper Slider Body */}
      <path
        d="M 36 28 L 44 28 C 45.2 28 46 29 45.6 30.2 L 44.2 34.5 C 43.8 35.5 44 36.5 44 37 L 36 37 C 36 36.5 36.2 35.5 35.8 34.5 L 34.4 30.2 C 34 29 34.8 28 36 28 Z"
        fill="url(#zipPull)"
        stroke="#485160"
        strokeWidth="0.6"
      />

      {/* Zipper Pull Tab */}
      <rect x="38" y="36" width="4" height="15" rx="1.5" fill="url(#zipPull)" stroke="#485160" strokeWidth="0.6" />
      <circle cx="40" cy="46" r="1.2" fill="#2C3340" />

      {/* Bottom "ZIP" Badge Label */}
      <g>
        <text
          x="40"
          y="83"
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
          fontSize="11.5"
          fontWeight="800"
          letterSpacing="0.08em"
          fill="#6E7687"
        >
          ZIP
        </text>
      </g>
    </svg>
  )
}

export default FinderZipIcon
