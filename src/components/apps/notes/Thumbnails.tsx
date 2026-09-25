'use client'

import React from 'react'

export function ZeldaArtworkThumbnail({ size = 42 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="zeldaSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4FA4F4" />
            <stop offset="60%" stopColor="#A2D2FF" />
            <stop offset="100%" stopColor="#EAF6FF" />
          </linearGradient>
          <linearGradient id="zeldaGrass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8CC63F" />
            <stop offset="100%" stopColor="#3F7A18" />
          </linearGradient>
        </defs>
        {/* Sky */}
        <rect width="100" height="100" fill="url(#zeldaSky)" />
        {/* Distant Mountains */}
        <polygon points="10,65 35,35 60,65" fill="#7FA9D1" opacity="0.8" />
        <polygon points="45,70 70,30 95,70" fill="#6992BA" opacity="0.85" />
        <polygon points="65,40 70,30 75,40" fill="#FFFFFF" />
        {/* Birds */}
        <path d="M 20,25 Q 24,20 28,25 Q 32,20 36,25" stroke="#1D3557" strokeWidth="1.5" fill="none" />
        <path d="M 38,18 Q 41,14 44,18 Q 47,14 50,18" stroke="#1D3557" strokeWidth="1.2" fill="none" />
        {/* Foreground Mountain Ridge */}
        <path d="M 0,85 Q 40,65 75,72 L 100,100 L 0,100 Z" fill="url(#zeldaGrass)" />
        {/* Rock */}
        <path d="M 55,80 Q 62,68 70,78 Z" fill="#6C757D" />
        {/* Link Silhouette */}
        <rect x="68" y="58" width="4" height="15" fill="#0A369D" rx="1" />
        <circle cx="70" cy="56" r="3" fill="#F4A261" />
        <rect x="66" y="60" width="3" height="8" fill="#784018" rx="1" />
      </svg>
    </div>
  )
}

export function CameraThumbnail({ size = 42 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="woodDesk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4A373" />
            <stop offset="100%" stopColor="#BC6C25" />
          </linearGradient>
        </defs>
        {/* Wooden Surface */}
        <rect width="100" height="100" fill="url(#woodDesk)" />
        {/* Blue Leather Strap */}
        <path d="M 15,10 Q 50,5 85,25 Q 60,60 52,65" stroke="#0077B6" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Black Leica Camera Body */}
        <rect x="25" y="45" width="50" height="34" rx="4" fill="#1C1C1E" stroke="#3A3A3C" strokeWidth="1" />
        {/* Lens */}
        <circle cx="50" cy="62" r="13" fill="#2C2C2E" stroke="#555" strokeWidth="1.5" />
        <circle cx="50" cy="62" r="9" fill="#0D1B2A" />
        <circle cx="48" cy="60" r="3" fill="#48CAE4" opacity="0.6" />
        {/* Red Leica Dot */}
        <circle cx="34" cy="52" r="2.5" fill="#E63946" />
      </svg>
    </div>
  )
}

export function DocThumbnail({ size = 42 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: '0.5px solid rgba(0,0,0,0.12)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: 5,
        gap: 3,
        flexShrink: 0,
      }}
    >
      <div style={{ height: 3, backgroundColor: '#333', borderRadius: 1, width: '70%' }} />
      <div style={{ height: 2, backgroundColor: '#999', borderRadius: 1, width: '90%' }} />
      <div style={{ height: 2, backgroundColor: '#999', borderRadius: 1, width: '85%' }} />
      <div style={{ height: 2, backgroundColor: '#999', borderRadius: 1, width: '95%' }} />
      <div style={{ height: 2, backgroundColor: '#999', borderRadius: 1, width: '60%' }} />
      <div style={{ height: 2, backgroundColor: '#999', borderRadius: 1, width: '80%' }} />
    </div>
  )
}

export function TwitterThumbnail({ size = 42 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        backgroundColor: '#1DA1F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(29, 161, 242, 0.3)',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
      </svg>
    </div>
  )
}
