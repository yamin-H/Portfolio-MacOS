'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Wifi,
  Bluetooth,
  Bell,
  Volume2,
  Moon,
  Clock,
  Settings as SettingsIcon,
  Accessibility,
  Sliders,
  Sparkles,
  Monitor,
  Battery,
  Shield,
  HardDrive,
  Lock,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Laptop,
  Radio,
  Share2,
  RefreshCw,
  Folder,
} from 'lucide-react'
import { useWindowContext } from '@/app/components/os/Window'
import {
  useWindowStore,
  AccentColorName,
  ACCENT_COLOR_MAP,
} from '@/app/store/windowStore'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'

type SettingsSection =
  | 'apple-account'
  | 'wifi'
  | 'bluetooth'
  | 'network'
  | 'notifications'
  | 'sound'
  | 'focus'
  | 'screentime'
  | 'general'
  | 'appearance'
  | 'accessibility'
  | 'control-center'
  | 'siri'
  | 'desktop-dock'
  | 'displays'
  | 'wallpaper'
  | 'battery'
  | 'privacy'

type GeneralSubpage =
  | 'about'
  | 'software-update'
  | 'storage'
  | 'airdrop'
  | 'login-items'
  | 'language'
  | 'datetime'
  | 'sharing'
  | 'timemachine'
  | 'transfer'
  | 'startup-disk'

// ── macOS Ultra-Smooth Animated Toggle Switch ──────────────────────────────
function AppleSwitch({
  checked,
  onChange,
  accent = '#007AFF',
}: {
  checked: boolean
  onChange: () => void
  accent?: string
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      style={{
        width: 38,
        height: 22,
        borderRadius: 12,
        backgroundColor: checked ? accent : 'rgba(120, 120, 128, 0.32)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
          position: 'absolute',
          top: 2,
          left: checked ? 18 : 2,
          transition: 'left 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </div>
  )
}

// Suggested Searches
const SEARCH_SUGGESTIONS = [
  { label: 'Displays', icon: Monitor, color: '#007AFF', section: 'displays' as SettingsSection },
  { label: 'Battery', icon: Battery, color: '#34C759', section: 'battery' as SettingsSection },
  { label: 'Privacy & Security', icon: Shield, color: '#007AFF', section: 'privacy' as SettingsSection },
  { label: 'Bluetooth', icon: Bluetooth, color: '#007AFF', section: 'bluetooth' as SettingsSection },
  { label: 'Desktop & Dock', icon: HardDrive, color: '#1D1D1F', section: 'desktop-dock' as SettingsSection },
  { label: 'Appearance', icon: Sliders, color: '#AF52DE', section: 'appearance' as SettingsSection },
  { label: 'Sound', icon: Volume2, color: '#FF2D55', section: 'sound' as SettingsSection },
  { label: 'Wallpaper', icon: Folder, color: '#34C759', section: 'wallpaper' as SettingsSection },
  { label: 'Wi-Fi', icon: Wifi, color: '#007AFF', section: 'wifi' as SettingsSection },
]

// Wallpaper collection
const WALLPAPERS = [
  { id: '/macos.jpg', name: 'macOS Sequoia Day' },
  { id: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80', name: 'Sequoia Sunset' },
  { id: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80', name: 'Liquid Obsidian' },
  { id: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80', name: 'Yosemite Dawn' },
  { id: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80', name: 'Solar Chroma' },
  { id: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80', name: 'Deep Space Nebula' },
]

// Available Wi-Fi networks
const WIFI_NETWORKS = [
  { ssid: 'Home-5G-Ultra', signal: 'full', secured: true },
  { ssid: 'Studio-Private', signal: 'full', secured: true },
  { ssid: 'Apple-Guest', signal: 'medium', secured: false },
  { ssid: 'iPhone-16-Pro-Hotspot', signal: 'strong', secured: true },
]

export default function Settings() {
  const windowContext = useWindowContext()

  // ── Global System Store Bindings (REAL ACTIONS THAT APPLY GLOBALLY) ─────────
  const {
    appearanceMode,
    setAppearanceMode,
    accentColor,
    setAccentColor,
    highlightColor,
    setHighlightColor,
    liquidGlassLook,
    setLiquidGlassLook,
    iconWidgetStyle,
    setIconWidgetStyle,
    folderColor,
    setFolderColor,
    wallpaperUrl,
    setWallpaperUrl,
    dockSize,
    setDockSize,
    dockMagnification,
    toggleDockMagnification,
    dockPosition,
    setDockPosition,
    dockAutoHide,
    toggleDockAutoHide,
    isStageManager,
    toggleStageManager,
    isWifiEnabled,
    toggleWifi,
    wifiSsid,
    setWifiSsid,
    isBluetoothEnabled,
    toggleBluetooth,
    isSoundEnabled,
    toggleSound,
    systemVolume,
    setSystemVolume,
    systemBrightness,
    setSystemBrightness,
    isTrueTone,
    toggleTrueTone,
    isNightShift,
    toggleNightShift,
    isFocusMode,
    toggleFocusMode,
    airDropMode,
    setAirDropMode,
  } = useWindowStore()

  // ── Local Navigation & Search State ────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance')
  const [generalSubpage, setGeneralSubpage] = useState<GeneralSubpage>('about')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [history, setHistory] = useState<SettingsSection[]>(['appearance'])
  const [historyIdx, setHistoryIdx] = useState(0)

  // Local feature toggles for secondary settings
  const [lowPowerMode, setLowPowerMode] = useState(false)
  const [optimizedCharging, setOptimizedCharging] = useState(true)
  const [appleIntelligenceEnabled, setAppleIntelligenceEnabled] = useState(true)
  const [heySiriEnabled, setHeySiriEnabled] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [is24Hour, setIs24Hour] = useState(false)
  const [autoTime, setAutoTime] = useState(true)
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 'kbd', name: 'Magic Keyboard with Touch ID', type: 'keyboard', connected: true },
    { id: 'pad', name: 'Magic Trackpad', type: 'trackpad', connected: true },
    { id: 'pods', name: 'AirPods Pro (2nd generation)', type: 'audio', connected: true },
  ])

  // Navigate section with history
  const navigateToSection = (sec: SettingsSection) => {
    soundEngine.play('click')
    setActiveSection(sec)
    const next = history.slice(0, historyIdx + 1)
    next.push(sec)
    setHistory(next)
    setHistoryIdx(next.length - 1)
    setIsSearchFocused(false)
  }

  const goBack = () => {
    if (historyIdx > 0) {
      soundEngine.play('click')
      const prevIdx = historyIdx - 1
      setHistoryIdx(prevIdx)
      setActiveSection(history[prevIdx])
    }
  }

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      soundEngine.play('click')
      const nextIdx = historyIdx + 1
      setHistoryIdx(nextIdx)
      setActiveSection(history[nextIdx])
    }
  }

  // Determine dynamic Dark Mode state:
  const isDark =
    appearanceMode === 'dark' ||
    (appearanceMode === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  // Accent Color values:
  const accentHex = ACCENT_COLOR_MAP[accentColor]?.hex || '#007AFF'
  const accentSubtle = ACCENT_COLOR_MAP[accentColor]?.subtle || 'rgba(0, 122, 255, 0.15)'

  // Dynamic Theme Palette:
  const t = {
    bg: isDark ? '#1E1E22' : '#FFFFFF',
    sidebarBg: isDark ? '#18181B' : '#F2F2F7',
    sidebarBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#D5D7DC',
    contentBg: isDark ? '#1E1E22' : '#FFFFFF',
    cardBg: isDark ? '#26262B' : '#F9FAFB',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.09)' : '#E5E7EB',
    text: isDark ? '#F5F5F7' : '#1D1D1F',
    textSecondary: isDark ? 'rgba(235, 235, 245, 0.6)' : '#8E8E93',
    divider: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
    selectBg: isDark ? '#2A2A30' : '#FFFFFF',
    rowHover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
  }

  // Accent Swatches
  const ACCENT_SWATCHES: Array<{ id: AccentColorName; label: string; hex: string }> = [
    { id: 'multicolor', label: 'Multicolor', hex: 'linear-gradient(135deg, #FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE)' },
    { id: 'blue',       label: 'Blue',       hex: '#007AFF' },
    { id: 'purple',     label: 'Purple',     hex: '#AF52DE' },
    { id: 'pink',       label: 'Pink',       hex: '#FF2D55' },
    { id: 'red',        label: 'Red',        hex: '#FF3B30' },
    { id: 'orange',     label: 'Orange',     hex: '#FF9500' },
    { id: 'yellow',     label: 'Yellow',     hex: '#FFCC00' },
    { id: 'green',      label: 'Green',      hex: '#34C759' },
    { id: 'graphite',   label: 'Graphite',   hex: '#8E8E93' },
  ]

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_SUGGESTIONS
    const q = searchQuery.toLowerCase()
    return SEARCH_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q))
  }, [searchQuery])

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: t.bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        color: t.text,
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      {/* ─── 1. LEFT SIDEBAR (APPLE SYSTEM SETTINGS SIDEBAR) ────────────────── */}
      <div
        style={{
          width: 230,
          backgroundColor: t.sidebarBg,
          borderRight: `1px solid ${t.sidebarBorder}`,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflowY: 'auto',
          padding: '12px 10px',
          fontSize: 12.5,
          position: 'relative',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}
      >
        {/* Titlebar Traffic Lights */}
        <div
          onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '2px 4px 10px 4px',
            cursor: 'default',
          }}
        >
          <TrafficLights />
        </div>

        {/* Search Pill Input */}
        <div style={{ position: 'relative', margin: '4px 2px 10px 2px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: t.inputBg,
              borderRadius: 8,
              border: isSearchFocused ? `2px solid ${accentHex}` : `1px solid ${t.inputBorder}`,
              padding: '4px 8px',
              gap: 6,
              boxShadow: isSearchFocused ? `0 0 0 2px ${accentSubtle}` : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Search size={13} color={t.textSecondary} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 12,
                color: t.text,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: t.textSecondary }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Floating Apple Suggestions Dropdown */}
          {isSearchFocused && (
            <div
              style={{
                position: 'absolute',
                top: 34,
                left: 0,
                right: 0,
                backgroundColor: isDark ? 'rgba(38, 38, 43, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: 10,
                boxShadow: isDark ? '0 12px 32px rgba(0, 0, 0, 0.6)' : '0 10px 28px rgba(0, 0, 0, 0.22)',
                border: `1px solid ${t.cardBorder}`,
                padding: '6px 4px',
                zIndex: 100,
              }}
            >
              <div style={{ fontSize: 10.5, fontWeight: 700, color: t.textSecondary, padding: '4px 8px' }}>
                Suggestions
              </div>
              {filteredSuggestions.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    onClick={() => navigateToSection(item.section)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 12,
                      color: t.text,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.rowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        backgroundColor: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                      }}
                    >
                      <Icon size={11} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Apple Account Profile Card */}
        <div
          onClick={() => navigateToSection('apple-account')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 8px',
            borderRadius: 8,
            cursor: 'pointer',
            backgroundColor: activeSection === 'apple-account' ? accentHex : 'transparent',
            color: activeSection === 'apple-account' ? '#FFFFFF' : t.text,
            marginBottom: 8,
            transition: 'background-color 0.15s ease',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: accentHex,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 14,
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              flexShrink: 0,
            }}
          >
            YH
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: 13, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Yamin Hossain
            </div>
            <div
              style={{
                fontSize: 11,
                color: activeSection === 'apple-account' ? 'rgba(255,255,255,0.8)' : t.textSecondary,
              }}
            >
              Apple Account
            </div>
          </div>
        </div>

        {/* Section: RECENT */}
        <div style={{ fontSize: 10, fontWeight: 700, color: t.textSecondary, padding: '6px 8px 2px 8px', letterSpacing: '0.04em' }}>
          RECENT
        </div>
        <div
          onClick={() => {
            soundEngine.play('click')
            setActiveSection('general')
            setGeneralSubpage('startup-disk')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 8px',
            borderRadius: 6,
            cursor: 'pointer',
            color: t.text,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.rowHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <HardDrive size={14} color={t.textSecondary} />
          <span>Startup Disk</span>
        </div>
        <div
          onClick={() => {
            soundEngine.play('click')
            setActiveSection('desktop-dock')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 8px',
            borderRadius: 6,
            cursor: 'pointer',
            color: t.text,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.rowHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Lock size={14} color={t.textSecondary} />
          <span>Lock Screen</span>
        </div>

        {/* Section: SETTINGS (Full List matching Apple System Settings) */}
        <div style={{ fontSize: 10, fontWeight: 700, color: t.textSecondary, padding: '10px 8px 2px 8px', letterSpacing: '0.04em' }}>
          SETTINGS
        </div>

        {[
          { id: 'wifi', label: 'Wi-Fi', icon: Wifi, color: '#007AFF' },
          { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, color: '#007AFF' },
          { id: 'notifications', label: 'Notifications', icon: Bell, color: '#FF3B30' },
          { id: 'sound', label: 'Sound', icon: Volume2, color: '#FF2D55' },
          { id: 'focus', label: 'Focus', icon: Moon, color: '#5856D6' },
          { id: 'general', label: 'General', icon: SettingsIcon, color: '#8E8E93' },
          { id: 'appearance', label: 'Appearance', icon: Sliders, color: '#1D1D1F' },
          { id: 'accessibility', label: 'Accessibility', icon: Accessibility, color: '#007AFF' },
          { id: 'siri', label: 'Apple Intelligence & Siri', icon: Sparkles, color: '#AF52DE' },
          { id: 'desktop-dock', label: 'Desktop & Dock', icon: HardDrive, color: '#1D1D1F' },
          { id: 'displays', label: 'Displays', icon: Monitor, color: '#007AFF' },
          { id: 'wallpaper', label: 'Wallpaper', icon: Folder, color: '#34C759' },
          { id: 'battery', label: 'Battery', icon: Battery, color: '#34C759' },
        ].map((item) => {
          const isSelected = activeSection === item.id
          const Icon = item.icon
          return (
            <div
              key={item.id}
              onClick={() => navigateToSection(item.id as SettingsSection)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 8px',
                borderRadius: 6,
                cursor: 'pointer',
                backgroundColor: isSelected ? accentHex : 'transparent',
                color: isSelected ? '#FFFFFF' : t.text,
                fontWeight: isSelected ? 600 : 400,
                transition: 'background-color 0.12s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = t.rowHover
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: isSelected ? '#FFFFFF' : item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? accentHex : '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                <Icon size={11} />
              </div>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* ─── 2. MAIN CONTENT AREA (DYNAMIC PANES WITH SMOOTH TRANSITIONS) ──── */}
      <div
        onClick={() => setIsSearchFocused(false)}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: t.contentBg,
          overflow: 'hidden',
          position: 'relative',
          transition: 'background-color 0.2s ease',
        }}
      >
        {/* Navigation Toolbar */}
        <div
          onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 20px',
            borderBottom: `1px solid ${t.divider}`,
            flexShrink: 0,
          }}
        >
          {/* Back & Forward Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={goBack}
              disabled={historyIdx <= 0}
              style={{
                width: 24,
                height: 24,
                borderRadius: 5,
                border: 'none',
                backgroundColor: 'transparent',
                color: historyIdx > 0 ? t.text : t.textSecondary,
                cursor: historyIdx > 0 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goForward}
              disabled={historyIdx >= history.length - 1}
              style={{
                width: 24,
                height: 24,
                borderRadius: 5,
                border: 'none',
                backgroundColor: 'transparent',
                color: historyIdx < history.length - 1 ? t.text : t.textSecondary,
                cursor: historyIdx < history.length - 1 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Pane Title */}
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', textTransform: 'capitalize' }}>
            {activeSection === 'general' ? `General` : activeSection.replace('-', ' ')}
          </span>
        </div>

        {/* ─── PANE BODY WITH SMOOTH TRANSITIONS ────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {/* ═════════════════════════════════════════════════════════════════════
              PANE 1: APPEARANCE
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}
            >
              {/* 1. Appearance Row (Auto | Light | Dark cards) */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 10 }}>
                  Appearance
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {(
                    [
                      { id: 'auto', label: 'Auto' },
                      { id: 'light', label: 'Light' },
                      { id: 'dark', label: 'Dark' },
                    ] as const
                  ).map((app) => {
                    const isSelected = appearanceMode === app.id
                    return (
                      <div
                        key={app.id}
                        onClick={() => setAppearanceMode(app.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                        }}
                      >
                        {/* Miniature Preview Card */}
                        <div
                          style={{
                            width: 86,
                            height: 54,
                            borderRadius: 8,
                            padding: '4px 6px',
                            border: isSelected ? `2px solid ${accentHex}` : `1px solid ${t.cardBorder}`,
                            boxShadow: isSelected ? `0 0 0 2px ${accentSubtle}` : '0 2px 6px rgba(0,0,0,0.06)',
                            backgroundColor: app.id === 'dark' ? '#1E1E24' : app.id === 'light' ? '#EAEBED' : '#D1D5DB',
                            background:
                              app.id === 'auto'
                                ? 'linear-gradient(90deg, #EAEBED 50%, #1E1E24 50%)'
                                : undefined,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ display: 'flex', gap: 3 }}>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#27C93F' }} />
                          </div>
                          <div
                            style={{
                              flex: 1,
                              borderRadius: 4,
                              backgroundColor: app.id === 'dark' ? '#2A2A32' : app.id === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: isSelected ? 700 : 500, color: t.text }}>
                          {app.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 2. Liquid Glass Row (Clear | Tinted) */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
                  Liquid Glass
                </div>
                <div style={{ fontSize: 11.5, color: t.textSecondary, marginBottom: 10 }}>
                  Choose your preferred look for Liquid Glass.
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {(
                    [
                      { id: 'clear', label: 'Clear' },
                      { id: 'tinted', label: 'Tinted' },
                    ] as const
                  ).map((glass) => {
                    const isSelected = liquidGlassLook === glass.id
                    return (
                      <div
                        key={glass.id}
                        onClick={() => setLiquidGlassLook(glass.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: 86,
                            height: 52,
                            borderRadius: 8,
                            border: isSelected ? `2px solid ${accentHex}` : `1px solid ${t.cardBorder}`,
                            boxShadow: isSelected ? `0 0 0 2px ${accentSubtle}` : 'none',
                            background:
                              glass.id === 'clear'
                                ? 'linear-gradient(135deg, rgba(160, 210, 255, 0.65), rgba(255, 255, 255, 0.95))'
                                : 'linear-gradient(135deg, rgba(220, 220, 230, 0.7), rgba(200, 205, 220, 0.9))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: 58,
                              height: 28,
                              borderRadius: 14,
                              backgroundColor: 'rgba(255, 255, 255, 0.85)',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: isSelected ? 700 : 500, color: t.text }}>
                          {glass.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 3. Theme Section */}
              <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>
                  Theme
                </div>

                {/* Accent Color Row with 9 Swatches */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: t.text }}>Color</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {ACCENT_SWATCHES.map((swatch) => {
                      const isSelected = accentColor === swatch.id
                      return (
                        <div
                          key={swatch.id}
                          onClick={() => setAccentColor(swatch.id)}
                          title={swatch.label}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: swatch.hex,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            outline: isSelected ? `2px solid ${accentHex}` : 'none',
                            outlineOffset: 2,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.12s ease',
                          }}
                        />
                      )
                    })}
                  </div>
                </div>

                {/* Text highlight color */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: t.text }}>Text highlight color</span>
                  <select
                    value={highlightColor}
                    onChange={(e) => setHighlightColor(e.target.value)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: `1px solid ${t.inputBorder}`,
                      backgroundColor: t.selectBg,
                      color: t.text,
                      fontSize: 12,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="automatic">Automatic</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="pink">Pink</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                    <option value="graphite">Graphite</option>
                  </select>
                </div>

                {/* Icon & widget style */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 8, color: t.text }}>
                    Icon & widget style
                  </div>
                  <div style={{ display: 'flex', gap: 14 }}>
                    {(
                      [
                        { id: 'default', label: 'Default', bg: '#007AFF' },
                        { id: 'dark', label: 'Dark', bg: '#1D1D1F' },
                        { id: 'clear', label: 'Clear', bg: '#8E8E93' },
                        { id: 'tinted', label: 'Tinted', bg: accentHex },
                      ] as const
                    ).map((styleOpt) => {
                      const isSelected = iconWidgetStyle === styleOpt.id
                      return (
                        <div
                          key={styleOpt.id}
                          onClick={() => setIconWidgetStyle(styleOpt.id)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              backgroundColor: styleOpt.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              border: isSelected ? `2px solid ${accentHex}` : `1px solid ${t.cardBorder}`,
                              boxShadow: isSelected ? `0 0 0 2px ${accentSubtle}` : 'none',
                            }}
                          >
                            <Sparkles size={20} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: isSelected ? 700 : 500, color: t.text }}>
                            {styleOpt.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Folder color */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: t.text }}>Folder color</span>
                  <select
                    value={folderColor}
                    onChange={(e) => setFolderColor(e.target.value)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: `1px solid ${t.inputBorder}`,
                      backgroundColor: t.selectBg,
                      color: t.text,
                      fontSize: 12,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="automatic">Automatic</option>
                    <option value="classic-blue">Classic macOS Blue</option>
                    <option value="graphite">Graphite Gray</option>
                    <option value="sunset-orange">Sunset Orange</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 2: GENERAL & ABOUT
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'general' && (
            <div style={{ display: 'flex', height: '100%', gap: 24, margin: '-24px -28px', padding: '16px' }}>
              {/* General Submenu Column */}
              <div
                style={{
                  width: 210,
                  borderRight: `1px solid ${t.divider}`,
                  paddingRight: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  overflowY: 'auto',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, padding: '4px 8px 8px 8px', color: t.text }}>
                  General
                </div>

                {[
                  { id: 'about', label: 'About', icon: Laptop },
                  { id: 'software-update', label: 'Software Update', icon: RefreshCw },
                  { id: 'storage', label: 'Storage', icon: HardDrive },
                  { id: 'airdrop', label: 'AirDrop & Handoff', icon: Radio },
                  { id: 'datetime', label: 'Date & Time', icon: Clock },
                  { id: 'sharing', label: 'Sharing', icon: Share2 },
                  { id: 'startup-disk', label: 'Startup Disk', icon: HardDrive },
                ].map((item) => {
                  const isSelected = generalSubpage === item.id
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        soundEngine.play('click')
                        setGeneralSubpage(item.id as GeneralSubpage)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        backgroundColor: isSelected ? accentHex : 'transparent',
                        color: isSelected ? '#FFFFFF' : t.text,
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: 12,
                        transition: 'background-color 0.12s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = t.rowHover
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon size={14} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={12} opacity={isSelected ? 1 : 0.4} />
                    </div>
                  )
                })}
              </div>

              {/* General Detail View */}
              <div style={{ flex: 1, overflowY: 'auto', paddingLeft: 8 }}>
                {generalSubpage === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 520 }}
                  >
                    {/* Mac Studio Hero Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4 }}>
                      <div
                        style={{
                          width: 140,
                          height: 70,
                          borderRadius: 14,
                          background: isDark
                            ? 'linear-gradient(180deg, #374151 0%, #1F2937 100%)'
                            : 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)',
                          border: isDark ? '1px solid #4B5563' : '1px solid #9CA3AF',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                        }}
                      >
                        <div style={{ width: 10, height: 4, backgroundColor: isDark ? '#9CA3AF' : '#4B5563', borderRadius: 2 }} />
                        <div style={{ width: 10, height: 4, backgroundColor: isDark ? '#9CA3AF' : '#4B5563', borderRadius: 2 }} />
                        <div style={{ width: 18, height: 2, backgroundColor: isDark ? '#9CA3AF' : '#4B5563' }} />
                      </div>
                      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 0 0', color: t.text }}>Mac Studio</h2>
                      <div style={{ fontSize: 12, color: t.textSecondary }}>2024 · Apple Silicon</div>
                    </div>

                    {/* Hardware Specs Card */}
                    <div
                      style={{
                        backgroundColor: t.cardBg,
                        borderRadius: 10,
                        border: `1px solid ${t.cardBorder}`,
                        padding: '12px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        fontSize: 12,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: t.textSecondary }}>Chip</span>
                        <span style={{ fontWeight: 600 }}>Apple M3 Max (16-core CPU, 40-core GPU)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: t.textSecondary }}>Memory</span>
                        <span style={{ fontWeight: 600 }}>36 GB Unified Memory</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: t.textSecondary }}>Serial Number</span>
                        <span style={{ fontFamily: 'monospace' }}>C02GY941MD6T</span>
                      </div>
                    </div>

                    {/* macOS Card */}
                    <div
                      style={{
                        backgroundColor: t.cardBg,
                        borderRadius: 10,
                        border: `1px solid ${t.cardBorder}`,
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, #FF9500 0%, #FF2D55 100%)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>macOS Sequoia</div>
                          <div style={{ fontSize: 11, color: t.textSecondary }}>Version 15.1 (24B83)</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setGeneralSubpage('software-update')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: `1px solid ${t.cardBorder}`,
                          backgroundColor: t.inputBg,
                          color: t.text,
                          fontSize: 11.5,
                          cursor: 'pointer',
                        }}
                      >
                        Software Update...
                      </button>
                    </div>

                    {/* Displays Card */}
                    <div
                      style={{
                        backgroundColor: t.cardBg,
                        borderRadius: 10,
                        border: `1px solid ${t.cardBorder}`,
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Monitor size={28} color={accentHex} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>Apple Studio Display</div>
                          <div style={{ fontSize: 11, color: t.textSecondary }}>27-inch 5K (5120 × 2880) Retina</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Storage Subpage */}
                {generalSubpage === 'storage' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 520 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Macintosh HD</h3>
                      <div style={{ fontSize: 12, color: t.textSecondary }}>1 TB SSD · 428 GB Available</div>
                    </div>

                    <div
                      style={{
                        height: 16,
                        borderRadius: 8,
                        overflow: 'hidden',
                        display: 'flex',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div style={{ width: '18%', backgroundColor: '#FF3B30' }} title="macOS (18 GB)" />
                      <div style={{ width: '28%', backgroundColor: '#007AFF' }} title="Developer & AI Models (140 GB)" />
                      <div style={{ width: '16%', backgroundColor: '#FF9500' }} title="Apps (80 GB)" />
                      <div style={{ width: '10%', backgroundColor: '#FFCC00' }} title="System Data (50 GB)" />
                      <div style={{ width: '28%', backgroundColor: isDark ? '#374151' : '#E5E7EB' }} title="Available (428 GB)" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#FF3B30' }} />
                        <span>macOS (18 GB)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#007AFF' }} />
                        <span>Developer & AI Models (140 GB)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#FF9500' }} />
                        <span>Apps (80 GB)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#FFCC00' }} />
                        <span>System Data (50 GB)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Software Update Subpage */}
                {generalSubpage === 'software-update' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 10,
                        backgroundColor: t.cardBg,
                        border: `1px solid ${t.cardBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                      }}
                    >
                      <Check size={28} color="#34C759" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: t.text }}>Your Mac is up to date</div>
                        <div style={{ fontSize: 12, color: t.textSecondary }}>macOS Sequoia 15.1 · Automatic updates on</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AirDrop Subpage */}
                {generalSubpage === 'airdrop' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>AirDrop & Handoff</h3>
                    <div style={{ fontSize: 12, color: t.textSecondary }}>
                      AirDrop lets you share instantly with people nearby.
                    </div>
                    <div
                      style={{
                        backgroundColor: t.cardBg,
                        borderRadius: 10,
                        border: `1px solid ${t.cardBorder}`,
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      }}
                    >
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>Allow me to be discovered by:</div>
                      {(
                        [
                          { id: 'off', label: 'No One' },
                          { id: 'contacts', label: 'Contacts Only' },
                          { id: 'everyone', label: 'Everyone for 10 Minutes' },
                        ] as const
                      ).map((opt) => (
                        <label
                          key={opt.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 12.5 }}
                        >
                          <input
                            type="radio"
                            name="airdrop"
                            checked={airDropMode === opt.id}
                            onChange={() => setAirDropMode(opt.id)}
                            style={{ accentColor: accentHex }}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date & Time Subpage */}
                {generalSubpage === 'datetime' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>Date & Time</h3>
                    <div
                      style={{
                        backgroundColor: t.cardBg,
                        borderRadius: 10,
                        border: `1px solid ${t.cardBorder}`,
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>Set time automatically</div>
                          <div style={{ fontSize: 11.5, color: t.textSecondary }}>time.apple.com</div>
                        </div>
                        <AppleSwitch checked={autoTime} onChange={() => setAutoTime(!autoTime)} accent={accentHex} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 12 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>24-Hour Time</div>
                          <div style={{ fontSize: 11.5, color: t.textSecondary }}>Display time in 24-hour format</div>
                        </div>
                        <AppleSwitch checked={is24Hour} onChange={() => setIs24Hour(!is24Hour)} accent={accentHex} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 3: DESKTOP & DOCK (REAL CONTROLS BOUND TO DOCK PHYSICS)
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'desktop-dock' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 540 }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Desktop & Dock</h2>

              {/* Dock Size Slider */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Size: {dockSize}px</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Adjust the default height of Dock icons</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: t.textSecondary }}>Small</span>
                  <input
                    type="range"
                    min={38}
                    max={72}
                    value={dockSize}
                    onChange={(e) => setDockSize(parseInt(e.target.value))}
                    style={{ width: 130, accentColor: accentHex }}
                  />
                  <span style={{ fontSize: 11, color: t.textSecondary }}>Large</span>
                </div>
              </div>

              {/* Dock Magnification Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Magnification</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Icons enlarge when you move cursor over them</div>
                </div>
                <AppleSwitch checked={dockMagnification} onChange={toggleDockMagnification} accent={accentHex} />
              </div>

              {/* Position on screen */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Position on screen</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Dock placement along the display edge</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['left', 'bottom', 'right'] as const).map((p) => {
                    const isSelected = dockPosition === p
                    return (
                      <button
                        key={p}
                        onClick={() => setDockPosition(p)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 6,
                          border: `1px solid ${isSelected ? accentHex : t.cardBorder}`,
                          backgroundColor: isSelected ? accentHex : t.inputBg,
                          color: isSelected ? '#FFFFFF' : t.text,
                          fontSize: 12,
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Auto Hide Dock Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Automatically hide and show the Dock</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Dock slides offscreen until mouse touches edge</div>
                </div>
                <AppleSwitch checked={dockAutoHide} onChange={toggleDockAutoHide} accent={accentHex} />
              </div>

              {/* Stage Manager Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Stage Manager</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Organize apps and windows on the left shelf</div>
                </div>
                <AppleSwitch checked={isStageManager} onChange={toggleStageManager} accent={accentHex} />
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 4: WALLPAPER (REAL DESKTOP WALLPAPER CHANGER)
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'wallpaper' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 580 }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Wallpaper</h2>
              <div style={{ fontSize: 12, color: t.textSecondary }}>
                Select a wallpaper to immediately update the desktop appearance.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {WALLPAPERS.map((wp) => {
                  const isSelected = wallpaperUrl === wp.id
                  return (
                    <div
                      key={wp.id}
                      onClick={() => setWallpaperUrl(wp.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          height: 90,
                          borderRadius: 8,
                          backgroundImage: `url(${wp.id})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: isSelected ? `3px solid ${accentHex}` : `1px solid ${t.cardBorder}`,
                          boxShadow: isSelected ? `0 0 0 2px ${accentSubtle}` : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      />
                      <span style={{ fontSize: 11.5, fontWeight: isSelected ? 700 : 500, textAlign: 'center', color: t.text }}>
                        {wp.name}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Custom Image URL */}
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>Custom Wallpaper URL:</span>
                <input
                  type="text"
                  placeholder="https://example.com/wallpaper.jpg"
                  defaultValue={wallpaperUrl.startsWith('http') ? wallpaperUrl : ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setWallpaperUrl(e.currentTarget.value)
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: `1px solid ${t.inputBorder}`,
                    backgroundColor: t.inputBg,
                    color: t.text,
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 5: SOUND
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'sound' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Sound</h2>

              {/* Master Volume */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
                    Alert volume: {Math.round(systemVolume * 100)}%
                  </div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Volume for pops, chimes, and actions</div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={systemVolume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    setSystemVolume(v)
                    soundEngine.setVolume(v)
                    soundEngine.play('pop')
                  }}
                  style={{ width: 140, accentColor: accentHex }}
                />
              </div>

              {/* Sound Effects Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Play user interface sound effects</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Play audio when dragging, clicking, and snapping</div>
                </div>
                <AppleSwitch checked={isSoundEnabled} onChange={toggleSound} accent={accentHex} />
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 6: DISPLAYS (BOUND TO SCREEN BRIGHTNESS & NIGHT SHIFT)
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'displays' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Displays</h2>

              {/* Brightness Slider */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
                    Brightness: {Math.round(systemBrightness * 100)}%
                  </div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Adjust screen luminescence</div>
                </div>
                <input
                  type="range"
                  min={0.35}
                  max={1.0}
                  step={0.05}
                  value={systemBrightness}
                  onChange={(e) => setSystemBrightness(parseFloat(e.target.value))}
                  style={{ width: 140, accentColor: accentHex }}
                />
              </div>

              {/* True Tone Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>True Tone</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Automatically adapt display to ambient lighting</div>
                </div>
                <AppleSwitch checked={isTrueTone} onChange={toggleTrueTone} accent={accentHex} />
              </div>

              {/* Night Shift Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Night Shift</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Shift colors to warmer amber spectrum to reduce eye strain</div>
                </div>
                <AppleSwitch checked={isNightShift} onChange={toggleNightShift} accent={accentHex} />
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 7: WI-FI
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'wifi' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Wi-Fi</h2>
                  <div style={{ fontSize: 12, color: t.textSecondary }}>
                    {isWifiEnabled ? `Connected to ${wifiSsid}` : 'Wi-Fi is turned off'}
                  </div>
                </div>
                <AppleSwitch checked={isWifiEnabled} onChange={toggleWifi} accent={accentHex} />
              </div>

              {isWifiEnabled && (
                <div
                  style={{
                    backgroundColor: t.cardBg,
                    borderRadius: 10,
                    border: `1px solid ${t.cardBorder}`,
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary }}>KNOWN NETWORKS</div>
                  {WIFI_NETWORKS.map((net) => {
                    const isCurrent = wifiSsid === net.ssid
                    return (
                      <div
                        key={net.ssid}
                        onClick={() => {
                          soundEngine.play('click')
                          setWifiSsid(net.ssid)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          backgroundColor: isCurrent ? accentSubtle : 'transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Wifi size={16} color={isCurrent ? accentHex : t.textSecondary} />
                          <span style={{ fontSize: 12.5, fontWeight: isCurrent ? 600 : 400, color: t.text }}>
                            {net.ssid}
                          </span>
                        </div>
                        {isCurrent && <Check size={16} color={accentHex} />}
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 8: BLUETOOTH
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'bluetooth' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Bluetooth</h2>
                  <div style={{ fontSize: 12, color: t.textSecondary }}>
                    {isBluetoothEnabled ? 'Discoverable as "Yamin\'s Mac Studio"' : 'Bluetooth is turned off'}
                  </div>
                </div>
                <AppleSwitch checked={isBluetoothEnabled} onChange={toggleBluetooth} accent={accentHex} />
              </div>

              {isBluetoothEnabled && (
                <div
                  style={{
                    backgroundColor: t.cardBg,
                    borderRadius: 10,
                    border: `1px solid ${t.cardBorder}`,
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.textSecondary }}>MY DEVICES</div>
                  {connectedDevices.map((dev) => (
                    <div
                      key={dev.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Bluetooth size={16} color={dev.connected ? accentHex : t.textSecondary} />
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.text }}>{dev.name}</div>
                          <div style={{ fontSize: 11, color: dev.connected ? '#34C759' : t.textSecondary }}>
                            {dev.connected ? 'Connected' : 'Not Connected'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          soundEngine.play('click')
                          setConnectedDevices((prev) =>
                            prev.map((d) => (d.id === dev.id ? { ...d, connected: !d.connected } : d))
                          )
                        }}
                        style={{
                          padding: '3px 10px',
                          borderRadius: 5,
                          border: `1px solid ${t.cardBorder}`,
                          backgroundColor: t.inputBg,
                          color: t.text,
                          fontSize: 11,
                          cursor: 'pointer',
                        }}
                      >
                        {dev.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 9: BATTERY
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'battery' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Battery</h2>
              <div
                style={{
                  backgroundColor: t.cardBg,
                  borderRadius: 10,
                  border: `1px solid ${t.cardBorder}`,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <Battery size={32} color="#34C759" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Battery Health: Normal</div>
                  <div style={{ fontSize: 12, color: t.textSecondary }}>Maximum Capacity 100% · AC Power Attached</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Low Power Mode</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Reduces energy usage and extends battery life</div>
                </div>
                <AppleSwitch checked={lowPowerMode} onChange={() => setLowPowerMode(!lowPowerMode)} accent={accentHex} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Optimized Battery Charging</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Reduces battery aging by learning your daily routine</div>
                </div>
                <AppleSwitch checked={optimizedCharging} onChange={() => setOptimizedCharging(!optimizedCharging)} accent={accentHex} />
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 10: APPLE INTELLIGENCE & SIRI
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'siri' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Apple Intelligence & Siri</h2>

              <div
                style={{
                  backgroundColor: t.cardBg,
                  borderRadius: 10,
                  border: `1px solid ${t.cardBorder}`,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #AF52DE 0%, #007AFF 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                    }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Apple Intelligence</div>
                    <div style={{ fontSize: 12, color: t.textSecondary }}>On-device generative models and writing tools active</div>
                  </div>
                </div>
                <AppleSwitch
                  checked={appleIntelligenceEnabled}
                  onChange={() => setAppleIntelligenceEnabled(!appleIntelligenceEnabled)}
                  accent={accentHex}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${t.divider}`, paddingTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Listen for &quot;Hey Siri&quot;</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Wake up Siri by saying &quot;Hey Siri&quot; or &quot;Siri&quot;</div>
                </div>
                <AppleSwitch checked={heySiriEnabled} onChange={() => setHeySiriEnabled(!heySiriEnabled)} accent={accentHex} />
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 11: FOCUS
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'focus' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Do Not Disturb</h2>
                  <div style={{ fontSize: 12, color: t.textSecondary }}>Silence all notifications and incoming alerts</div>
                </div>
                <AppleSwitch checked={isFocusMode} onChange={toggleFocusMode} accent={accentHex} />
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 12: ACCESSIBILITY
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'accessibility' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 540 }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Accessibility</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Reduce motion</div>
                  <div style={{ fontSize: 11.5, color: t.textSecondary }}>Subtly soften system transitions and window animations</div>
                </div>
                <AppleSwitch checked={reduceMotion} onChange={() => setReduceMotion(!reduceMotion)} accent={accentHex} />
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════
              PANE 13: APPLE ACCOUNT
             ═════════════════════════════════════════════════════════════════════ */}
          {activeSection === 'apple-account' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 540 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: accentHex,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  YH
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: t.text }}>Yamin Hossain</h2>
                  <div style={{ fontSize: 12, color: t.textSecondary }}>contact@yamin.dev · AI-Native Software Engineer</div>
                  <div style={{ fontSize: 11.5, color: accentHex, marginTop: 2 }}>Rajshahi, Bangladesh · Available Worldwide</div>
                </div>
              </div>

              <div style={{ backgroundColor: t.cardBg, borderRadius: 10, border: `1px solid ${t.cardBorder}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: t.textSecondary }}>iCloud+ Storage</span>
                  <span style={{ fontWeight: 600 }}>2 TB Plan (482 GB Used)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: t.textSecondary }}>GitHub Profile</span>
                  <a href="https://github.com/yamin" target="_blank" rel="noreferrer" style={{ color: accentHex, textDecoration: 'none', fontWeight: 600 }}>github.com/yamin</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: t.textSecondary }}>Specialization</span>
                  <span style={{ fontWeight: 600 }}>LangGraph Agents & Production RAG</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
