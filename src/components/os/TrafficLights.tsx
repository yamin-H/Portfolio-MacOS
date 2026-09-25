'use client'

import React, { useState } from 'react'
import { useWindowContext } from '@/app/components/os/Window'

interface TrafficLightsProps {
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  gap?: number
  style?: React.CSSProperties
  className?: string
  dimWhenInactive?: boolean
}

export default function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
  gap = 7,
  style,
  className,
  dimWhenInactive = false,
}: TrafficLightsProps) {
  const windowContext = useWindowContext()
  const [trafficHovered, setTrafficHovered] = useState(false)
  const isDimmed = dimWhenInactive && windowContext?.isActive === false && !trafficHovered

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onClose) {
      onClose()
    } else {
      windowContext?.closeWindow()
    }
  }

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMinimize) {
      onMinimize()
    } else {
      windowContext?.minimizeWindow()
    }
  }

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMaximize) {
      onMaximize()
    } else {
      windowContext?.toggleMaximize()
    }
  }

  return (
    <div
      onMouseEnter={() => setTrafficHovered(true)}
      onMouseLeave={() => setTrafficHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap,
        zIndex: 3,
        ...style,
      }}
    >
      {/* Close */}
      <button
        onClick={handleClose}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: 'none',
          outline: 'none',
          backgroundColor: isDimmed ? 'rgba(120, 120, 128, 0.4)' : '#FF5F56',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'background-color 0.15s ease',
        }}
      >
        {trafficHovered && (
          <svg viewBox="0 0 8 8" style={{ width: 6, height: 6 }}>
            <path d="M1 1L7 7M7 1L1 7" stroke="#4D0000" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Minimize */}
      <button
        onClick={handleMinimize}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: 'none',
          outline: 'none',
          backgroundColor: isDimmed ? 'rgba(120, 120, 128, 0.4)' : '#FFBD2E',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'background-color 0.15s ease',
        }}
      >
        {trafficHovered && (
          <svg viewBox="0 0 8 8" style={{ width: 6, height: 6 }}>
            <path d="M1 4H7" stroke="#5C3B00" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Maximize */}
      <button
        onClick={handleMaximize}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: 'none',
          outline: 'none',
          backgroundColor: isDimmed ? 'rgba(120, 120, 128, 0.4)' : '#27C93F',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'background-color 0.15s ease',
        }}
      >
        {trafficHovered && (
          <svg viewBox="0 0 8 8" style={{ width: 6, height: 6 }}>
            <path
              d="M1 3.2V1H3.2M7 4.8V7H4.8"
              stroke="#004D00"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
