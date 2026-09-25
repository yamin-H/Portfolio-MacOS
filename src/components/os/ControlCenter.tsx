'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/app/store/windowStore'
import { soundEngine } from '@/lib/sound/soundEngine'

export default function ControlCenter() {
  const {
    isControlCenterOpen,
    closeControlCenter,
    systemBrightness,
    setSystemBrightness,
    systemVolume,
    setSystemVolume,
    isWifiEnabled,
    toggleWifi,
    wifiSsid,
    isBluetoothEnabled,
    toggleBluetooth,
    airDropMode,
    setAirDropMode,
    isFocusMode,
    toggleFocusMode,
    isStageManager,
    toggleStageManager,
    isScreenMirroring,
    toggleScreenMirroring,
    openWindow,
  } = useWindowStore()

  // Track appearance toggle (Dark Mode / Light Mode)
  const [isDarkMode, setIsDarkMode] = useState(true)
  // Screen recording / camera toggle
  const [isScreenCaptureActive, setIsScreenCaptureActive] = useState(false)

  // Music playback state
  const [isPlaying, setIsPlaying] = useState(false)

  // Sliders drag states
  const brightnessRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const [isDraggingBrightness, setIsDraggingBrightness] = useState(false)
  const [isDraggingVolume, setIsDraggingVolume] = useState(false)

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isControlCenterOpen) {
        closeControlCenter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isControlCenterOpen, closeControlCenter])

  // Brightness slider drag handler
  const handleBrightnessPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!brightnessRef.current) return
    const rect = brightnessRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const ratio = Math.max(0.2, Math.min(1.0, x / rect.width))
    setSystemBrightness(ratio)
  }

  // Volume slider drag handler
  const handleVolumePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return
    const rect = volumeRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const ratio = Math.max(0, Math.min(1.0, x / rect.width))
    setSystemVolume(ratio)
  }

  const handleOpenSettings = () => {
    soundEngine.play('pop')
    closeControlCenter()
    openWindow({
      id: 'settings',
      title: 'System Settings',
      isOpen: true,
      isMinimized: false,
      position: { x: 120, y: 80 },
      size: { width: 680, height: 500 },
    })
  }

  if (!isControlCenterOpen) return null

  // Glass card styles matching macOS Sequoia reference image
  const glassCardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    backdropFilter: 'blur(35px) saturate(190%)',
    WebkitBackdropFilter: 'blur(35px) saturate(190%)',
    border: '0.5px solid rgba(255, 255, 255, 0.35)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.20)',
    borderRadius: '16px',
    userSelect: 'none',
    transition: 'all 0.15s ease',
  }

  return (
    <AnimatePresence>
      <div
        onClick={closeControlCenter}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9980,
          backgroundColor: 'transparent',
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -10 }}
          transition={{ type: 'spring', stiffness: 460, damping: 32 }}
          style={{
            position: 'fixed',
            top: 34,
            right: 12,
            width: 334,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            zIndex: 9985,
            userSelect: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {/* ─── TOP BANNER: [ 🎤 System Settings ] ─────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              onClick={handleOpenSettings}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: 'rgba(15, 65, 105, 0.55)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(135, 206, 250, 0.45)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                borderRadius: '18px',
                padding: '4px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                cursor: 'pointer',
              }}
            >
              {/* Orange Circle with Microphone */}
              <div
                style={{
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  backgroundColor: '#FF9500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(255, 149, 0, 0.4)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                System Settings
              </span>
            </motion.div>
          </div>

          {/* ─── MAIN CONTROL CENTER CONTAINER CARD ──────────────────────────── */}
          <div
            style={{
              backgroundColor: 'rgba(25, 75, 125, 0.38)',
              backdropFilter: 'blur(50px) saturate(210%)',
              WebkitBackdropFilter: 'blur(50px) saturate(210%)',
              borderRadius: '24px',
              border: '0.5px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.45), 0 4px 16px rgba(0, 0, 0, 0.2)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* ─── SECTION 1: CONNECTIVITY + NOW PLAYING ─────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Left Column: Wi-Fi, Bluetooth, AirDrop */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 1. Wi-Fi Pill */}
                <div
                  onClick={() => {
                    soundEngine.play('click')
                    toggleWifi()
                  }}
                  style={{
                    ...glassCardStyle,
                    height: '52px',
                    padding: '0 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    backgroundColor: isWifiEnabled ? 'rgba(0, 122, 255, 0.35)' : 'rgba(255, 255, 255, 0.16)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isWifiEnabled ? '#FFFFFF' : 'rgba(255, 255, 255, 0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={isWifiEnabled ? '#007AFF' : '#FFFFFF'}>
                      <path d="M12 18c-.8 0-1.5.7-1.5 1.5S11.2 21 12 21s1.5-.7 1.5-1.5S12.8 18 12 18zm0-6c-2.4 0-4.6 1-6.2 2.6l1.4 1.4C8.4 14.8 10.1 14 12 14s3.6.8 4.8 2l1.4-1.4C16.6 13 14.4 12 12 12zm0-6C7.9 6 4.2 7.7 1.6 10.4l1.4 1.4C5.3 9.4 8.5 8 12 8s6.7 1.4 9 3.8l1.4-1.4C19.8 7.7 16.1 6 12 6z" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>Wi-Fi</span>
                    <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.1, marginTop: 2 }}>
                      {isWifiEnabled ? 'Tita' : 'Off'}
                    </span>
                  </div>
                </div>

                {/* 2. Bluetooth Pill */}
                <div
                  onClick={() => {
                    soundEngine.play('click')
                    toggleBluetooth()
                  }}
                  style={{
                    ...glassCardStyle,
                    height: '52px',
                    padding: '0 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    backgroundColor: isBluetoothEnabled ? 'rgba(0, 122, 255, 0.35)' : 'rgba(255, 255, 255, 0.16)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isBluetoothEnabled ? '#FFFFFF' : 'rgba(255, 255, 255, 0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={isBluetoothEnabled ? '#007AFF' : '#FFFFFF'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>Bluetooth</span>
                    <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.1, marginTop: 2 }}>
                      {isBluetoothEnabled ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>

                {/* 3. AirDrop Pill */}
                <div
                  onClick={() => {
                    soundEngine.play('click')
                    const next = airDropMode === 'everyone' ? 'contacts' : airDropMode === 'contacts' ? 'off' : 'everyone'
                    setAirDropMode(next)
                  }}
                  style={{
                    ...glassCardStyle,
                    height: '52px',
                    padding: '0 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    backgroundColor: airDropMode !== 'off' ? 'rgba(0, 122, 255, 0.35)' : 'rgba(255, 255, 255, 0.16)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: airDropMode !== 'off' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={airDropMode !== 'off' ? '#007AFF' : '#FFFFFF'} strokeWidth="2.2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="2.5" fill={airDropMode !== 'off' ? '#007AFF' : '#FFFFFF'} />
                      <path d="M7.05 16.95a7 7 0 0 1 0-9.9M16.95 7.05a7 7 0 0 1 0 9.9" />
                      <path d="M3.5 20.5a12 12 0 0 1 0-17M20.5 3.5a12 12 0 0 1 0 17" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>AirDrop</span>
                    <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.1, marginTop: 2 }}>
                      {airDropMode === 'everyone' ? 'Everyone' : airDropMode === 'contacts' ? 'Contacts' : 'Off'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Now Playing Card + (Stage Manager & Screen Mirroring) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Now Playing Big Card (Exact Match to Image!) */}
                <div
                  style={{
                    ...glassCardStyle,
                    height: '112px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Top: Rounded square placeholder art */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                      border: '0.5px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />

                  {/* Middle Text: Not Playing */}
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#FFFFFF' }}>
                    {isPlaying ? 'Starboy' : 'Not Playing'}
                  </div>

                  {/* Media Controls: ◀◀  ▶  ▶▶ */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#FFFFFF' }}>
                    <button
                      onClick={() => soundEngine.play('click')}
                      style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 5L2 12l9 7V5zm11 0l-9 7 9 7V5z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.play('pop')
                        setIsPlaying(!isPlaying)
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                    >
                      {isPlaying ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={() => soundEngine.play('click')}
                      style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 5l9 7-9 7V5zM2 5l9 7-9 7V5z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Stage Manager & Screen Mirroring Two Circular/Squircle Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', height: '52px' }}>
                  {/* Stage Manager Button */}
                  <div
                    onClick={() => {
                      soundEngine.play('pop')
                      toggleStageManager()
                    }}
                    title="Stage Manager"
                    style={{
                      ...glassCardStyle,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: isStageManager ? '#007AFF' : 'rgba(255, 255, 255, 0.22)',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="4" width="12" height="16" rx="2" fill="currentColor" fillOpacity="0.2" />
                      <rect x="3" y="5" width="2" height="3" rx="1" fill="#FFFFFF" />
                      <rect x="3" y="10.5" width="2" height="3" rx="1" fill="#FFFFFF" />
                      <rect x="3" y="16" width="2" height="3" rx="1" fill="#FFFFFF" />
                    </svg>
                  </div>

                  {/* Screen Mirroring Button */}
                  <div
                    onClick={() => {
                      soundEngine.play('pop')
                      toggleScreenMirroring()
                    }}
                    title="Screen Mirroring"
                    style={{
                      ...glassCardStyle,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: isScreenMirroring ? '#007AFF' : 'rgba(255, 255, 255, 0.22)',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="6" width="13" height="11" rx="2" />
                      <rect x="8" y="10" width="13" height="11" rx="2" fill="currentColor" fillOpacity="0.25" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── SECTION 2: ROW 3 (APPEARANCE + SCREEN CAPTURE + DO NOT DISTURB) ─── */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Appearance / Dark Mode Toggle */}
              <div
                onClick={() => {
                  soundEngine.play('click')
                  setIsDarkMode(!isDarkMode)
                }}
                title="Appearance"
                style={{
                  ...glassCardStyle,
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#007AFF',
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3a9 9 0 0 1 0 18z" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Screen Capture / Camera Viewfinder */}
              <div
                onClick={() => {
                  soundEngine.play('action')
                  setIsScreenCaptureActive(!isScreenCaptureActive)
                }}
                title="Screen Capture"
                style={{
                  ...glassCardStyle,
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: isScreenCaptureActive ? '#007AFF' : '#0A84FF',
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
                  <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Do Not Disturb Wide Pill (Exact match to Image!) */}
              <div
                onClick={() => {
                  soundEngine.play('pop')
                  toggleFocusMode()
                }}
                style={{
                  ...glassCardStyle,
                  flex: 1,
                  height: '50px',
                  borderRadius: '25px',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  backgroundColor: isFocusMode ? 'rgba(0, 122, 255, 0.45)' : 'rgba(255, 255, 255, 0.22)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#5E5CE6">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>Do Not Disturb</span>
                  <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.1, marginTop: 2 }}>
                    {isFocusMode ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── SECTION 3: DISPLAY SLIDER CARD (Exact match to Image!) ────────── */}
            <div
              style={{
                ...glassCardStyle,
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Display</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Small Sun Icon */}
                <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Slider Track */}
                <div
                  ref={brightnessRef}
                  onPointerDown={(e) => {
                    setIsDraggingBrightness(true)
                    handleBrightnessPointer(e)
                  }}
                  onPointerMove={(e) => {
                    if (isDraggingBrightness) handleBrightnessPointer(e)
                  }}
                  onPointerUp={() => setIsDraggingBrightness(false)}
                  style={{
                    flex: 1,
                    height: '7px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.32)',
                    overflow: 'hidden',
                    cursor: 'ew-resize',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${systemBrightness * 100}%`,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
                      transition: isDraggingBrightness ? 'none' : 'width 0.08s ease',
                    }}
                  />
                </div>

                {/* Large Sun Icon */}
                <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M6.34 17.66l-2.12 2.12M19.78 4.22l-2.12 2.12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ─── SECTION 4: SOUND SLIDER CARD (Exact match to Image!) ──────────── */}
            <div
              style={{
                ...glassCardStyle,
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>Sound</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Low Volume Speaker */}
                <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  </svg>
                </div>

                {/* Slider Track */}
                <div
                  ref={volumeRef}
                  onPointerDown={(e) => {
                    setIsDraggingVolume(true)
                    handleVolumePointer(e)
                  }}
                  onPointerMove={(e) => {
                    if (isDraggingVolume) handleVolumePointer(e)
                  }}
                  onPointerUp={() => setIsDraggingVolume(false)}
                  style={{
                    flex: 1,
                    height: '7px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.32)',
                    overflow: 'hidden',
                    cursor: 'ew-resize',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${systemVolume * 100}%`,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '4px',
                      boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
                      transition: isDraggingVolume ? 'none' : 'width 0.08s ease',
                    }}
                  />
                </div>

                {/* High Volume Speaker */}
                <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="#FFFFFF" />
                  </svg>
                </div>

                {/* Circular AirPlay Button */}
                <div
                  onClick={() => soundEngine.play('pop')}
                  title="AirPlay Audio"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 4 4 16 20 16 12 4" />
                    <path d="M2 19a10 10 0 0 1 20 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
