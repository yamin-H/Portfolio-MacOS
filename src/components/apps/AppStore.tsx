'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Gamepad2,
  Palette,
  Briefcase,
  Dices,
  Code2,
  LayoutGrid,
  ArrowDownCircle,
  Search,
  X,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  CloudDownload,
  Shield,
  Layers,
  Laptop,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Camera,
  Sliders,
  Music,
  Users,
  GraduationCap,
  Coffee,
  Film
} from 'lucide-react'
import { useWindowContext } from '@/app/components/os/Window'
import { useWindowStore } from '@/app/store/windowStore'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'
import {
  AppItem,
  GREAT_NEW_APPS,
  PHOTO_APPS,
  DEVELOPER_APPS,
  WORK_APPS,
  ARCADE_GAMES,
  PLAY_GAMES,
  STORE_CATEGORIES,
  PENDING_UPDATES,
  UNIQUE_APPS,
  AppCategory
} from './appstore/appStoreData'

type StoreTab =
  | 'discover'
  | 'arcade'
  | 'create'
  | 'work'
  | 'play'
  | 'develop'
  | 'categories'
  | 'updates'

interface DownloadingState {
  [appId: string]: {
    progress: number
    isDone: boolean
  }
}

export default function AppStore() {
  const windowContext = useWindowContext()
  const { openWindow, windows, restoreWindow, focusWindow } = useWindowStore()

  // ─── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<StoreTab>('discover')
  const [history, setHistory] = useState<StoreTab[]>(['discover'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | null>(null)
  const [showVideoTourModal, setShowVideoTourModal] = useState(false)
  const [tourTab, setTourTab] = useState<'tiling' | 'mirroring' | 'notes' | 'ai'>('tiling')

  // Download / Install states
  const [downloads, setDownloads] = useState<DownloadingState>({
    keynote: { progress: 100, isDone: true },
    numbers: { progress: 100, isDone: true },
    pages: { progress: 100, isDone: true },
    xcode: { progress: 100, isDone: true },
  })

  // Navigation History handlers
  const navigateToTab = (tab: StoreTab) => {
    if (tab === activeTab && !selectedCategory && !selectedApp) return
    soundEngine.play('click')
    setSelectedApp(null)
    setSelectedCategory(null)
    setActiveTab(tab)
    const nextHistory = history.slice(0, historyIndex + 1)
    nextHistory.push(tab)
    setHistory(nextHistory)
    setHistoryIndex(nextHistory.length - 1)
  }

  const goBack = () => {
    if (selectedApp) {
      soundEngine.play('click')
      setSelectedApp(null)
      return
    }
    if (selectedCategory) {
      soundEngine.play('click')
      setSelectedCategory(null)
      return
    }
    if (historyIndex > 0) {
      soundEngine.play('click')
      const nextIdx = historyIndex - 1
      setHistoryIndex(nextIdx)
      setActiveTab(history[nextIdx])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      soundEngine.play('click')
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      setActiveTab(history[nextIdx])
    }
  }

  // Handle Download / Get / Open Button
  const handleAppAction = (app: AppItem, e: React.MouseEvent) => {
    e.stopPropagation()
    const current = downloads[app.id]

    if (current?.isDone) {
      // App is already installed -> OPEN it!
      soundEngine.play('pop')
      if (app.linkedOsAppId) {
        const existing = windows.find((w) => w.id === app.linkedOsAppId)
        if (existing) {
          if (existing.isMinimized) restoreWindow(existing.id)
          else focusWindow(existing.id)
        } else {
          openWindow({
            id: app.linkedOsAppId,
            title: app.name,
            isOpen: true,
            isMinimized: false,
            position: { x: 120, y: 70 },
            size: { width: 960, height: 600 },
          })
        }
      } else {
        // Show detail or open simulated app view
        setSelectedApp(app)
      }
      return
    }

    if (current && !current.isDone) {
      // Currently downloading -> cancel
      setDownloads((prev) => {
        const next = { ...prev }
        delete next[app.id]
        return next
      })
      return
    }

    // Start download simulation
    soundEngine.play('pop')
    setDownloads((prev) => ({
      ...prev,
      [app.id]: { progress: 10, isDone: false },
    }))

    let progress = 10
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 22) + 14
      if (progress >= 100) {
        clearInterval(interval)
        soundEngine.play('action')
        setDownloads((prev) => ({
          ...prev,
          [app.id]: { progress: 100, isDone: true },
        }))
      } else {
        setDownloads((prev) => ({
          ...prev,
          [app.id]: { progress, isDone: false },
        }))
      }
    }, 180)
  }

  // Update All Handler
  const handleUpdateAll = () => {
    soundEngine.play('action')
    PENDING_UPDATES.forEach((upd, idx) => {
      setTimeout(() => {
        setDownloads((prev) => ({
          ...prev,
          [upd.appId]: { progress: 15, isDone: false },
        }))
        let p = 15
        const timer = setInterval(() => {
          p += 20
          if (p >= 100) {
            clearInterval(timer)
            soundEngine.play('pop')
            setDownloads((prev) => ({
              ...prev,
              [upd.appId]: { progress: 100, isDone: true },
            }))
          } else {
            setDownloads((prev) => ({
              ...prev,
              [upd.appId]: { progress: p, isDone: false },
            }))
          }
        }, 220)
      }, idx * 300)
    })
  }

  // Search Filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return UNIQUE_APPS.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.developer.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Category Icon Resolver
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 size={20} />
      case 'Briefcase': return <Briefcase size={20} />
      case 'Palette': return <Palette size={20} />
      case 'Gamepad2': return <Gamepad2 size={20} />
      case 'Camera': return <Camera size={20} />
      case 'Sliders': return <Sliders size={20} />
      case 'TrendingUp': return <TrendingUp size={20} />
      case 'Music': return <Music size={20} />
      case 'Users': return <Users size={20} />
      case 'GraduationCap': return <GraduationCap size={20} />
      case 'Coffee': return <Coffee size={20} />
      case 'Film': return <Film size={20} />
      default: return <LayoutGrid size={20} />
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        color: '#1D1D1F',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════════
          1. LEFT SIDEBAR (APPLE LIGHT MODE FROSTED SIDEBAR)
         ════════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          width: 216,
          backgroundColor: '#F5F5F7',
          borderRight: '1px solid #E5E5E7',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Titlebar Traffic Lights with Drag Handle */}
        <div
          onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '14px 14px 10px 16px',
            cursor: 'default',
          }}
        >
          <TrafficLights />
        </div>

        {/* Sidebar Search Bar */}
        <div style={{ padding: '4px 12px 10px 12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#EAEAEF',
              borderRadius: 8,
              padding: '5px 8px',
              gap: 6,
            }}
          >
            <Search size={13} color="#8E8E93" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 12,
                color: '#1D1D1F',
                padding: 0,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={12} color="#8E8E93" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {[
            { id: 'discover', label: 'Discover', icon: Compass },
            { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
            { id: 'create', label: 'Create', icon: Palette },
            { id: 'work', label: 'Work', icon: Briefcase },
            { id: 'play', label: 'Play', icon: Dices },
            { id: 'develop', label: 'Develop', icon: Code2 },
            { id: 'categories', label: 'Categories', icon: LayoutGrid },
            { id: 'updates', label: 'Updates', icon: ArrowDownCircle, badge: '3' },
          ].map((item) => {
            const isSelected = activeTab === item.id && !searchQuery
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id as StoreTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#E3E3E8' : 'transparent',
                  color: isSelected ? '#1D1D1F' : '#3C3C43',
                  fontWeight: isSelected ? 600 : 450,
                  fontSize: 13,
                  transition: 'background-color 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <Icon
                  size={16.5}
                  color={isSelected ? '#007AFF' : '#6E6E73'}
                  strokeWidth={isSelected ? 2.2 : 1.8}
                />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      backgroundColor: isSelected ? '#007AFF' : '#C7C7CC',
                      color: '#FFFFFF',
                      borderRadius: 999,
                      padding: '1px 6px',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Sidebar Footer User Pill */}
        <div
          style={{
            padding: '10px 12px 14px 12px',
            borderTop: '1px solid #E5E5E7',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #007AFF, #5856D6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 11,
              fontWeight: 700,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            YH
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#1D1D1F',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Yamin Hossain
            </span>
            <span style={{ fontSize: 10.5, color: '#86868B' }}>Apple ID · Developer</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          2. MAIN CONTENT AREA (LIGHT MODE WHITE CANVAS)
         ════════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Unified Drag Header & Navigation Bar */}
        <div
          onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            borderBottom: '1px solid #F0F0F2',
            cursor: 'default',
            flexShrink: 0,
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Back & Forward buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={goBack}
              disabled={historyIndex === 0 && !selectedApp && !selectedCategory}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: historyIndex > 0 || selectedApp || selectedCategory ? 'pointer' : 'default',
                opacity: historyIndex > 0 || selectedApp || selectedCategory ? 1 : 0.3,
                color: '#1D1D1F',
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1 || selectedApp !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: historyIndex < history.length - 1 && !selectedApp ? 'pointer' : 'default',
                opacity: historyIndex < history.length - 1 && !selectedApp ? 1 : 0.3,
                color: '#1D1D1F',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Subtitle / Center Label */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#6E6E73',
              letterSpacing: '-0.01em',
              textTransform: 'capitalize',
            }}
          >
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedApp
              ? selectedApp.name
              : selectedCategory
              ? selectedCategory.name
              : activeTab}
          </div>

          {/* Right quick status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11.5, color: '#86868B', fontWeight: 500 }}>
              Mac App Store
            </span>
          </div>
        </div>

        {/* Scrollable Main Content Pane */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 32px 48px 32px',
          }}
        >
          {/* ──────────────────────────────────────────────────────────────────
              VIEW A: SEARCH RESULTS
             ────────────────────────────────────────────────────────────────── */}
          {searchQuery.trim() !== '' ? (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
                Search Results ({searchResults.length})
              </h2>
              {searchResults.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 0',
                    color: '#86868B',
                    gap: 8,
                  }}
                >
                  <Search size={36} color="#C7C7CC" />
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1D1D1F' }}>No Results</span>
                  <span style={{ fontSize: 13 }}>Try searching for apps, developer tools, or games.</span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 16,
                  }}
                >
                  {searchResults.map((app) => (
                    <AppCardSmall
                      key={app.id}
                      app={app}
                      downloadState={downloads[app.id]}
                      onAction={(e) => handleAppAction(app, e)}
                      onClick={() => {
                        soundEngine.play('click')
                        setSelectedApp(app)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'discover' ? (
            /* ──────────────────────────────────────────────────────────────────
                VIEW B: DISCOVER (EXACT MATCH TO REFERENCE IMAGE media_1790340163161)
               ────────────────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* 1. TOP HERO BANNER (MAJOR UPDATE - macOS Sequoia) */}
              <div
                onClick={() => setShowVideoTourModal(true)}
                style={{
                  width: '100%',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 40%, #D97706 100%)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  minHeight: 250,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Left Text Content */}
                <div
                  style={{
                    flex: '1 1 50%',
                    padding: '32px 36px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    zIndex: 2,
                    color: '#FFFFFF',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#38BDF8',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: 6,
                      }}
                    >
                      MAJOR UPDATE
                    </span>
                    <h1
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        lineHeight: 1.15,
                        margin: '0 0 10px 0',
                        letterSpacing: '-0.02em',
                        color: '#FFFFFF',
                      }}
                    >
                      What&apos;s new in macOS Sequoia
                    </h1>
                    <p
                      style={{
                        fontSize: 13.5,
                        lineHeight: 1.45,
                        color: 'rgba(255, 255, 255, 0.85)',
                        margin: 0,
                        maxWidth: 440,
                      }}
                    >
                      Experience seamless window tiling, iPhone Mirroring, enhanced Notes with math solving, and intelligent Apple Silicon workflows.
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: '#FFFFFF',
                      marginTop: 20,
                    }}
                  >
                    <span>Take a tour of the latest OS</span>
                    <ArrowRight size={14} />
                  </div>
                </div>

                {/* Right Visual Artwork Graphic with Play Button */}
                <div
                  style={{
                    flex: '1 1 50%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Abstract vibrant backdrop matching reference artwork */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at 70% 50%, rgba(245, 158, 11, 0.45), rgba(59, 130, 246, 0.2) 60%, transparent 80%)',
                    }}
                  />

                  {/* Floating Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 24,
                      right: 36,
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: 12,
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 600,
                      border: '0.5px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    <Layers size={14} color="#38BDF8" />
                    <span>Window Tiling</span>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: 24,
                      left: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: 12,
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 600,
                      border: '0.5px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    <Laptop size={14} color="#FBBF24" />
                    <span>iPhone Mirroring</span>
                  </div>

                  {/* Center Frosted Glass Play Button */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.28)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                      zIndex: 3,
                    }}
                  >
                    <Play size={22} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
                  </motion.div>
                </div>
              </div>

              {/* 2. THREE FEATURED CARDS (EXACT MATCH TO REFERENCE IMAGE) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 18,
                }}
              >
                {/* Card 1: Rated 17+ / Resident Evil Village */}
                <FeaturedCard
                  eyebrow="RATED 17+"
                  eyebrowColor="#86868B"
                  title="Resident Evil Village — Now on Mac"
                  subtitle="Mystery and monsters await in this hamlet of horrors."
                  badgeType="gothic"
                  onClick={() => {
                    soundEngine.play('click')
                    setSelectedApp(GREAT_NEW_APPS[0])
                  }}
                />

                {/* Card 2: Get Started / Standout Safari Extensions */}
                <FeaturedCard
                  eyebrow="GET STARTED"
                  eyebrowColor="#007AFF"
                  title="Standout Safari extensions"
                  subtitle="Enhance your browser with these powerful tools."
                  badgeType="safari"
                  onClick={() => {
                    soundEngine.play('click')
                    setSelectedApp(GREAT_NEW_APPS[3])
                  }}
                />

                {/* Card 3: From The Editors / Welcome to Mac App Store */}
                <FeaturedCard
                  eyebrow="FROM THE EDITORS"
                  eyebrowColor="#AF52DE"
                  title="Welcome to the Mac App Store!"
                  subtitle="Take a tour and find your next favourite app."
                  badgeType="celebration"
                  onClick={() => {
                    soundEngine.play('click')
                    setShowVideoTourModal(true)
                  }}
                />
              </div>

              {/* 3. GREAT NEW APPS AND UPDATES (12 APPS IN 4 COLUMNS × 3 ROWS) */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      margin: 0,
                      letterSpacing: '-0.02em',
                      color: '#1D1D1F',
                    }}
                  >
                    Great New Apps and Updates
                  </h2>
                  <button
                    onClick={() => navigateToTab('develop')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#007AFF',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    See All
                  </button>
                </div>

                {/* 4-column x 3-row layout exactly matching reference screenshot */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px 20px',
                  }}
                >
                  {GREAT_NEW_APPS.map((app) => (
                    <AppCardSmall
                      key={app.id}
                      app={app}
                      downloadState={downloads[app.id]}
                      onAction={(e) => handleAppAction(app, e)}
                      onClick={() => {
                        soundEngine.play('click')
                        setSelectedApp(app)
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 4. PERFECT YOUR PHOTOS WITH PIXELMATOR (REFERENCE IMAGE BOTTOM) */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        margin: '0 0 2px 0',
                        letterSpacing: '-0.02em',
                        color: '#1D1D1F',
                      }}
                    >
                      Perfect Your Photos With Pixelmator & Creative Tools
                    </h2>
                    <span style={{ fontSize: 12.5, color: '#86868B' }}>
                      Next-generation raster graphics, machine learning masking, and RAW editors.
                    </span>
                  </div>
                  <button
                    onClick={() => navigateToTab('create')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#007AFF',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    See All
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 18,
                  }}
                >
                  {PHOTO_APPS.map((app) => (
                    <AppCardMedium
                      key={app.id}
                      app={app}
                      downloadState={downloads[app.id]}
                      onAction={(e) => handleAppAction(app, e)}
                      onClick={() => {
                        soundEngine.play('click')
                        setSelectedApp(app)
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 5. ESSENTIAL DEVELOPER TOOLS & WORKFLOWS */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        margin: '0 0 2px 0',
                        letterSpacing: '-0.02em',
                        color: '#1D1D1F',
                      }}
                    >
                      Essential Developer Tools
                    </h2>
                    <span style={{ fontSize: 12.5, color: '#86868B' }}>
                      Native IDEs, intelligent terminals, containerization, and database suites.
                    </span>
                  </div>
                  <button
                    onClick={() => navigateToTab('develop')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#007AFF',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    See All
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                  }}
                >
                  {DEVELOPER_APPS.slice(0, 6).map((app) => (
                    <AppCardSmall
                      key={app.id}
                      app={app}
                      downloadState={downloads[app.id]}
                      onAction={(e) => handleAppAction(app, e)}
                      onClick={() => {
                        soundEngine.play('click')
                        setSelectedApp(app)
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'arcade' ? (
            /* ──────────────────────────────────────────────────────────────────
                VIEW C: ARCADE TAB
               ────────────────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Arcade Hero */}
              <div
                style={{
                  width: '100%',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 60%, #1E1B4B 100%)',
                  padding: '36px 40px',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 8px 30px rgba(220, 38, 38, 0.15)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Gamepad2 size={24} color="#FCA5A5" />
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#FCA5A5' }}>
                      APPLE ARCADE
                    </span>
                  </div>
                  <h1 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                    Play without limits.
                  </h1>
                  <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', margin: 0, maxWidth: 460 }}>
                    Over 200 incredibly fun games. No ads. No in-app purchases. Unlimited access for up to six family members.
                  </p>
                </div>
                <button
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#DC2626',
                    border: 'none',
                    borderRadius: 999,
                    padding: '10px 22px',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}
                >
                  Try It Free
                </button>
              </div>

              {/* Curated Games */}
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Featured Arcade Games</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {ARCADE_GAMES.map((app) => (
                  <AppCardMedium
                    key={app.id}
                    app={app}
                    downloadState={downloads[app.id]}
                    onAction={(e) => handleAppAction(app, e)}
                    onClick={() => {
                      soundEngine.play('click')
                      setSelectedApp(app)
                    }}
                  />
                ))}
              </div>
            </div>
          ) : activeTab === 'develop' ? (
            /* ──────────────────────────────────────────────────────────────────
                VIEW D: DEVELOP TAB
               ────────────────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Develop Hero */}
              <div
                style={{
                  width: '100%',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #0F172A 100%)',
                  padding: '36px 40px',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 8px 30px rgba(2, 132, 199, 0.15)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Code2 size={24} color="#7DD3FC" />
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#7DD3FC' }}>
                      DEVELOPER TOOLS
                    </span>
                  </div>
                  <h1 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                    Code at the speed of thought.
                  </h1>
                  <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', margin: 0, maxWidth: 500 }}>
                    Build apps for macOS, iOS, watchOS, and visionOS with Apple Silicon optimized toolchains and SDKs.
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Pro Development Environment</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {DEVELOPER_APPS.map((app) => (
                  <AppCardMedium
                    key={app.id}
                    app={app}
                    downloadState={downloads[app.id]}
                    onAction={(e) => handleAppAction(app, e)}
                    onClick={() => {
                      soundEngine.play('click')
                      setSelectedApp(app)
                    }}
                  />
                ))}
              </div>
            </div>
          ) : activeTab === 'work' ? (
            /* ──────────────────────────────────────────────────────────────────
                VIEW E: WORK TAB
               ────────────────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Work Hero */}
              <div
                style={{
                  width: '100%',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 60%, #1E1B4B 100%)',
                  padding: '36px 40px',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Briefcase size={24} color="#93C5FD" />
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#93C5FD' }}>
                      PRODUCTIVITY & WORK
                    </span>
                  </div>
                  <h1 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                    Focus, organize, and deliver.
                  </h1>
                  <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', margin: 0, maxWidth: 480 }}>
                    Supercharge your daily workflow with world-class task managers, launchers, and collaborative tools.
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Curated Work Apps</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {WORK_APPS.map((app) => (
                  <AppCardMedium
                    key={app.id}
                    app={app}
                    downloadState={downloads[app.id]}
                    onAction={(e) => handleAppAction(app, e)}
                    onClick={() => {
                      soundEngine.play('click')
                      setSelectedApp(app)
                    }}
                  />
                ))}
              </div>
            </div>
          ) : activeTab === 'play' ? (
            /* ──────────────────────────────────────────────────────────────────
                VIEW F: PLAY TAB
               ────────────────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div
                style={{
                  width: '100%',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #18181B 0%, #27272A 50%, #4338CA 100%)',
                  padding: '36px 40px',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Dices size={24} color="#A5B4FC" />
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#A5B4FC' }}>
                      MAC GAMING
                    </span>
                  </div>
                  <h1 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                    AAA Games on Apple Silicon.
                  </h1>
                  <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', margin: 0, maxWidth: 480 }}>
                    Powered by Metal 3, hardware ray tracing, and high refresh rate Liquid Retina displays.
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Blockbuster Titles</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {PLAY_GAMES.map((app) => (
                  <AppCardMedium
                    key={app.id}
                    app={app}
                    downloadState={downloads[app.id]}
                    onAction={(e) => handleAppAction(app, e)}
                    onClick={() => {
                      soundEngine.play('click')
                      setSelectedApp(app)
                    }}
                  />
                ))}
              </div>
            </div>
          ) : activeTab === 'create' ? (
            /* ──────────────────────────────────────────────────────────────────
                VIEW G: CREATE TAB
               ────────────────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div
                style={{
                  width: '100%',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 60%, #BE185D 100%)',
                  padding: '36px 40px',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Palette size={24} color="#DDD6FE" />
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#DDD6FE' }}>
                      CREATIVE STUDIO
                    </span>
                  </div>
                  <h1 style={{ fontSize: 30, fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                    Unleash your imagination.
                  </h1>
                  <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.85)', margin: 0, maxWidth: 480 }}>
                    Industry-defining tools for illustration, photo editing, motion graphics, and audio synthesis.
                  </p>
                </div>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Creativity Powerhouses</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {PHOTO_APPS.concat(DEVELOPER_APPS.slice(0, 2)).map((app) => (
                  <AppCardMedium
                    key={app.id}
                    app={app}
                    downloadState={downloads[app.id]}
                    onAction={(e) => handleAppAction(app, e)}
                    onClick={() => {
                      soundEngine.play('click')
                      setSelectedApp(app)
                    }}
                  />
                ))}
              </div>
            </div>
          ) : activeTab === 'categories' ? (
            /* ──────────────────────────────────────────────────────────────────
                VIEW H: CATEGORIES TAB
               ────────────────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                Categories
              </h1>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                }}
              >
                {STORE_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      soundEngine.play('click')
                      setSelectedCategory(cat)
                    }}
                    style={{
                      backgroundColor: '#F8F8FA',
                      border: '1px solid #E5E5E7',
                      borderRadius: 14,
                      padding: '20px 22px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 120,
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: `${cat.color}15`,
                          color: cat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getCategoryIcon(cat.iconName)}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#86868B' }}>
                        {cat.appCount} apps
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, margin: '10px 0 2px 0', color: '#1D1D1F' }}>
                        {cat.name}
                      </h3>
                      <p style={{ fontSize: 12, color: '#6E6E73', margin: 0, lineHeight: 1.35 }}>
                        {cat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ──────────────────────────────────────────────────────────────────
                VIEW I: UPDATES TAB
               ────────────────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 16,
                  borderBottom: '1px solid #E5E5E7',
                }}
              >
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                    Updates
                  </h1>
                  <span style={{ fontSize: 13, color: '#6E6E73' }}>
                    3 pending software updates available
                  </span>
                </div>
                <button
                  onClick={handleUpdateAll}
                  style={{
                    backgroundColor: '#007AFF',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 999,
                    padding: '8px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 122, 255, 0.25)',
                  }}
                >
                  Update All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {PENDING_UPDATES.map((upd) => {
                  const dl = downloads[upd.appId]
                  return (
                    <div
                      key={upd.id}
                      style={{
                        display: 'flex',
                        gap: 16,
                        padding: '16px 20px',
                        backgroundColor: '#F8F8FA',
                        border: '1px solid #E5E5E7',
                        borderRadius: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 12,
                          background: upd.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: 16,
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        {upd.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 2px 0', color: '#1D1D1F' }}>
                              {upd.name}
                            </h3>
                            <span style={{ fontSize: 12, color: '#86868B' }}>
                              Version {upd.version} · {upd.size} · {upd.daysAgo}
                            </span>
                          </div>

                          {/* Update Action Button */}
                          <ActionButton
                            price="UPDATE"
                            isGet={false}
                            downloadState={dl}
                            onAction={(e) => {
                              const targetApp = UNIQUE_APPS.find((a) => a.id === upd.appId)
                              if (targetApp) handleAppAction(targetApp, e)
                            }}
                          />
                        </div>

                        <p style={{ fontSize: 12.5, color: '#424245', margin: '10px 0 0 0', lineHeight: 1.45 }}>
                          {upd.notes}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            3. PRODUCT DETAIL MODAL / SHEET
           ════════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedApp && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#FFFFFF',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Product Modal Top Bar */}
              <div
                style={{
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 24px',
                  borderBottom: '1px solid #F0F0F2',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <button
                  onClick={() => setSelectedApp(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#007AFF',
                    padding: 0,
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={() => {
                      soundEngine.play('action')
                      navigator.clipboard?.writeText(window.location.href)
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#007AFF',
                    }}
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    style={{
                      border: 'none',
                      background: '#F0F0F2',
                      borderRadius: '50%',
                      width: 26,
                      height: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#6E6E73',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Product Modal Scrollable Body */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '32px 48px 64px 48px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 32,
                }}
              >
                {/* Header Summary */}
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 104,
                      height: 104,
                      borderRadius: 22,
                      background: selectedApp.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: 32,
                      fontWeight: 800,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                      flexShrink: 0,
                    }}
                  >
                    {selectedApp.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                      {selectedApp.name}
                    </h1>
                    <span style={{ fontSize: 14, color: '#6E6E73', display: 'block', marginBottom: 4 }}>
                      {selectedApp.subtitle}
                    </span>
                    <span style={{ fontSize: 13, color: '#007AFF', fontWeight: 500, display: 'block', marginBottom: 16 }}>
                      {selectedApp.developer}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <ActionButton
                        price={selectedApp.price}
                        isGet={selectedApp.isGet}
                        isCloud={selectedApp.isCloud}
                        hasInAppPurchases={selectedApp.hasInAppPurchases}
                        downloadState={downloads[selectedApp.id]}
                        onAction={(e) => handleAppAction(selectedApp, e)}
                      />
                    </div>
                  </div>
                </div>

                {/* 6 Metric Badges Bar */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    padding: '16px 0',
                    borderTop: '1px solid #E5E5E7',
                    borderBottom: '1px solid #E5E5E7',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ borderRight: '1px solid #E5E5E7' }}>
                    <span style={{ fontSize: 10.5, color: '#86868B', fontWeight: 600, textTransform: 'uppercase' }}>
                      {selectedApp.ratingCount} RATINGS
                    </span>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                      <span>{selectedApp.rating}</span>
                      <Star size={14} fill="#1D1D1F" color="#1D1D1F" />
                    </div>
                  </div>

                  <div style={{ borderRight: '1px solid #E5E5E7' }}>
                    <span style={{ fontSize: 10.5, color: '#86868B', fontWeight: 600, textTransform: 'uppercase' }}>
                      AGE
                    </span>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', marginTop: 4 }}>
                      {selectedApp.ageRating}
                    </div>
                  </div>

                  <div style={{ borderRight: '1px solid #E5E5E7' }}>
                    <span style={{ fontSize: 10.5, color: '#86868B', fontWeight: 600, textTransform: 'uppercase' }}>
                      CHART
                    </span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1D1D1F', marginTop: 6 }}>
                      {selectedApp.chartRank}
                    </div>
                  </div>

                  <div style={{ borderRight: '1px solid #E5E5E7' }}>
                    <span style={{ fontSize: 10.5, color: '#86868B', fontWeight: 600, textTransform: 'uppercase' }}>
                      DEVELOPER
                    </span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1D1D1F', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 6px' }}>
                      {selectedApp.developer.split(' ')[0]}
                    </div>
                  </div>

                  <div style={{ borderRight: '1px solid #E5E5E7' }}>
                    <span style={{ fontSize: 10.5, color: '#86868B', fontWeight: 600, textTransform: 'uppercase' }}>
                      LANGUAGE
                    </span>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', marginTop: 4 }}>
                      EN
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: 10.5, color: '#86868B', fontWeight: 600, textTransform: 'uppercase' }}>
                      SIZE
                    </span>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1D1D1F', marginTop: 4 }}>
                      {selectedApp.size}
                    </div>
                  </div>
                </div>

                {/* What's New Box */}
                {selectedApp.whatsNew && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>What&apos;s New</h2>
                      <span style={{ fontSize: 12.5, color: '#86868B' }}>
                        Version {selectedApp.whatsNew.version} · {selectedApp.whatsNew.releaseDate}
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, color: '#424245', lineHeight: 1.5, margin: 0 }}>
                      {selectedApp.whatsNew.notes}
                    </p>
                  </div>
                )}

                {/* Preview Mockup Visual */}
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 14px 0' }}>Preview</h2>
                  <div
                    style={{
                      display: 'flex',
                      gap: 16,
                      overflowX: 'auto',
                      paddingBottom: 8,
                    }}
                  >
                    {[1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        style={{
                          width: 380,
                          height: 230,
                          borderRadius: 12,
                          background: `linear-gradient(135deg, ${
                            idx === 1 ? '#0F172A' : idx === 2 ? '#1E293B' : '#334155'
                          } 0%, #0284C7 100%)`,
                          flexShrink: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: 20,
                          color: '#FFFFFF',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#27C93F' }} />
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginLeft: 8 }}>
                            {selectedApp.name} Canvas {idx}
                          </span>
                        </div>

                        <div>
                          <span style={{ fontSize: 16, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                            {selectedApp.features[idx - 1] || 'Optimized for Apple Silicon'}
                          </span>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                            Full Metal acceleration and Liquid Retina XDR support.
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px 0' }}>Description</h2>
                  <p style={{ fontSize: 14, color: '#3C3C43', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                    {selectedApp.description}
                  </p>

                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px 0', color: '#1D1D1F' }}>
                    Key Features:
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedApp.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: 13.5, color: '#424245', lineHeight: 1.4 }}>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Customer Reviews */}
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 14px 0' }}>Ratings & Reviews</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    {selectedApp.reviews.map((rev, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#F8F8FA',
                          border: '1px solid #E5E5E7',
                          borderRadius: 12,
                          padding: 16,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#1D1D1F' }}>{rev.title}</span>
                          <span style={{ fontSize: 11, color: '#86868B' }}>{rev.date}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={11} fill="#FF9500" color="#FF9500" />
                          ))}
                        </div>
                        <p style={{ fontSize: 12.5, color: '#424245', lineHeight: 1.45, margin: '0 0 8px 0' }}>
                          {rev.body}
                        </p>
                        <span style={{ fontSize: 11, color: '#86868B' }}>{rev.author}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Information Metadata Table */}
                <div style={{ borderTop: '1px solid #E5E5E7', paddingTop: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 14px 0' }}>Information</h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr',
                      gap: '10px 24px',
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: '#86868B' }}>Provider</span>
                    <span style={{ color: '#1D1D1F', fontWeight: 500 }}>{selectedApp.developer}</span>

                    <span style={{ color: '#86868B' }}>Size</span>
                    <span style={{ color: '#1D1D1F', fontWeight: 500 }}>{selectedApp.size}</span>

                    <span style={{ color: '#86868B' }}>Category</span>
                    <span style={{ color: '#007AFF', fontWeight: 500 }}>{selectedApp.category}</span>

                    <span style={{ color: '#86868B' }}>Compatibility</span>
                    <span style={{ color: '#1D1D1F', fontWeight: 500 }}>macOS Sequoia 15.0 or later</span>

                    <span style={{ color: '#86868B' }}>Languages</span>
                    <span style={{ color: '#1D1D1F', fontWeight: 500 }}>{selectedApp.languages}</span>

                    <span style={{ color: '#86868B' }}>Copyright</span>
                    <span style={{ color: '#1D1D1F', fontWeight: 500 }}>© 2026 {selectedApp.developer}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════════════════════════
            4. MACOS SEQUOIA GUIDED TOUR MODAL (Clicking Top Banner Play Button)
           ════════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showVideoTourModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(20px)',
                zIndex: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 30,
              }}
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                style={{
                  width: 680,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #E5E5E7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#007AFF', letterSpacing: '0.08em' }}>
                      FEATURE TOUR
                    </span>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: '2px 0 0 0', color: '#1D1D1F' }}>
                      What&apos;s new in macOS Sequoia
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowVideoTourModal(false)}
                    style={{
                      border: 'none',
                      background: '#F0F0F2',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={15} color="#6E6E73" />
                  </button>
                </div>

                {/* Tour Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #E5E5E7', backgroundColor: '#F8F8FA' }}>
                  {[
                    { id: 'tiling', label: 'Window Tiling' },
                    { id: 'mirroring', label: 'iPhone Mirroring' },
                    { id: 'notes', label: 'Math in Notes' },
                    { id: 'ai', label: 'Apple Intelligence' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setTourTab(tab.id as 'tiling' | 'mirroring' | 'notes' | 'ai')}
                      style={{
                        flex: 1,
                        padding: '12px 0',
                        border: 'none',
                        borderBottom: tourTab === tab.id ? '2px solid #007AFF' : '2px solid transparent',
                        backgroundColor: 'transparent',
                        fontWeight: tourTab === tab.id ? 700 : 500,
                        color: tourTab === tab.id ? '#007AFF' : '#6E6E73',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tour Tab Content */}
                <div style={{ padding: '28px 32px' }}>
                  {tourTab === 'tiling' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div
                        style={{
                          height: 180,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #0284C7, #1E1B4B)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: 18,
                          fontWeight: 700,
                          gap: 12,
                        }}
                      >
                        <Layers size={36} color="#38BDF8" />
                        <span>Seamless Window Snapping & Tiling</span>
                      </div>
                      <p style={{ fontSize: 13.5, color: '#424245', lineHeight: 1.5, margin: 0 }}>
                        Arrange windows effortlessly by dragging them to screen edges or using standard keyboard shortcuts like ⌃⌥← and ⌃⌥→. Tile two windows side-by-side or fill corners in an instant.
                      </p>
                    </div>
                  )}

                  {tourTab === 'mirroring' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div
                        style={{
                          height: 180,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #F59E0B, #DC2626)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: 18,
                          fontWeight: 700,
                          gap: 12,
                        }}
                      >
                        <Laptop size={36} color="#FEF08A" />
                        <span>Full iPhone Access from your Mac</span>
                      </div>
                      <p style={{ fontSize: 13.5, color: '#424245', lineHeight: 1.5, margin: 0 }}>
                        View and control your iPhone wirelessly from your Mac. Use iPhone apps, receive iOS notifications alongside Mac alerts, and drag and drop files seamlessly between devices.
                      </p>
                    </div>
                  )}

                  {tourTab === 'notes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div
                        style={{
                          height: 180,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #10B981, #047857)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: 18,
                          fontWeight: 700,
                          gap: 12,
                        }}
                      >
                        <Sparkles size={36} color="#A7F3D0" />
                        <span>Math Notes & Audio Transcription</span>
                      </div>
                      <p style={{ fontSize: 13.5, color: '#424245', lineHeight: 1.5, margin: 0 }}>
                        Type mathematical equations with variables and expressions, and Notes solves them instantly inline. Record audio with live synced transcriptions.
                      </p>
                    </div>
                  )}

                  {tourTab === 'ai' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div
                        style={{
                          height: 180,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #8B5CF6, #4C1D95)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: 18,
                          fontWeight: 700,
                          gap: 12,
                        }}
                      >
                        <Sparkles size={36} color="#DDD6FE" />
                        <span>On-Device Apple Intelligence</span>
                      </div>
                      <p style={{ fontSize: 13.5, color: '#424245', lineHeight: 1.5, margin: 0 }}>
                        Systemwide Writing Tools rewrite, proofread, and summarize text everywhere. Priority notifications elevate what matters most, powered securely by on-device Neural Engines.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #E5E5E7',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    onClick={() => setShowVideoTourModal(false)}
                    style={{
                      backgroundColor: '#007AFF',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 999,
                      padding: '8px 22px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS: Small App Card (4 Columns x 3 Rows Matching Reference Image)
// ══════════════════════════════════════════════════════════════════════════════
interface AppCardSmallProps {
  app: AppItem
  downloadState?: { progress: number; isDone: boolean }
  onAction: (e: React.MouseEvent) => void
  onClick: () => void
}

function AppCardSmall({ app, downloadState, onAction, onClick }: AppCardSmallProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 10px',
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F7')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {/* Squircle App Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: app.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: 13.5,
          fontWeight: 700,
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        {app.name.slice(0, 2).toUpperCase()}
      </div>

      {/* App Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#1D1D1F',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {app.name}
        </span>
        <span
          style={{
            fontSize: 11.5,
            color: '#6E6E73',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: 1,
          }}
        >
          {app.category} · {app.subtitle}
        </span>
      </div>

      {/* Action Button */}
      <div style={{ flexShrink: 0 }}>
        <ActionButton
          price={app.price}
          isGet={app.isGet}
          isCloud={app.isCloud}
          hasInAppPurchases={app.hasInAppPurchases}
          downloadState={downloadState}
          onAction={onAction}
        />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS: Medium App Card (Grid Showcase)
// ══════════════════════════════════════════════════════════════════════════════
function AppCardMedium({ app, downloadState, onAction, onClick }: AppCardSmallProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E5E7',
        borderRadius: 14,
        padding: '18px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 180,
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            background: app.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
          }}
        >
          {app.name.slice(0, 2).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              margin: '0 0 2px 0',
              color: '#1D1D1F',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {app.name}
          </h3>
          <span style={{ fontSize: 11.5, color: '#86868B', display: 'block' }}>
            {app.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
            <Star size={11} fill="#FF9500" color="#FF9500" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1D1D1F' }}>{app.rating}</span>
            <span style={{ fontSize: 10.5, color: '#86868B' }}>({app.ratingCount})</span>
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: 12,
          color: '#424245',
          margin: '10px 0',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {app.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ActionButton
          price={app.price}
          isGet={app.isGet}
          isCloud={app.isCloud}
          hasInAppPurchases={app.hasInAppPurchases}
          downloadState={downloadState}
          onAction={onAction}
        />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS: Action Button (Apple Pill / Circular Spinner / Open)
// ══════════════════════════════════════════════════════════════════════════════
interface ActionButtonProps {
  price: string
  isGet?: boolean
  isCloud?: boolean
  hasInAppPurchases?: boolean
  downloadState?: { progress: number; isDone: boolean }
  onAction: (e: React.MouseEvent) => void
}

function ActionButton({
  price,
  isGet = true,
  isCloud = false,
  hasInAppPurchases = false,
  downloadState,
  onAction,
}: ActionButtonProps) {
  // If download is in progress
  if (downloadState && !downloadState.isDone) {
    const radius = 10
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (downloadState.progress / 100) * circumference

    return (
      <div
        onClick={onAction}
        style={{
          width: 26,
          height: 26,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="26" height="26" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="13"
            cy="13"
            r={radius}
            stroke="#E5E5EA"
            strokeWidth="2.5"
            fill="transparent"
          />
          <circle
            cx="13"
            cy="13"
            r={radius}
            stroke="#007AFF"
            strokeWidth="2.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            width: 7,
            height: 7,
            backgroundColor: '#007AFF',
            borderRadius: 1.5,
          }}
        />
      </div>
    )
  }

  // If installed -> show "OPEN"
  if (downloadState?.isDone) {
    return (
      <button
        onClick={onAction}
        style={{
          height: 24,
          padding: '0 12px',
          borderRadius: 999,
          border: '1px solid #007AFF',
          backgroundColor: '#FFFFFF',
          color: '#007AFF',
          fontSize: 11.5,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#007AFF'
          e.currentTarget.style.color = '#FFFFFF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF'
          e.currentTarget.style.color = '#007AFF'
        }}
      >
        OPEN
      </button>
    )
  }

  // If cloud re-download
  if (isCloud) {
    return (
      <button
        onClick={onAction}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#007AFF',
          padding: '2px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CloudDownload size={20} strokeWidth={2} />
      </button>
    )
  }

  // Default GET or Price button
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={onAction}
        style={{
          height: 24,
          minWidth: 58,
          padding: '0 12px',
          borderRadius: 999,
          border: 'none',
          backgroundColor: '#F0F0F2',
          color: '#007AFF',
          fontSize: 11.5,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E5EA')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F0F0F2')}
      >
        {price === 'GET' || isGet ? 'GET' : price}
      </button>
      {hasInAppPurchases && (
        <span style={{ fontSize: 8.5, color: '#8E8E93', marginTop: 2, letterSpacing: '-0.02em' }}>
          In-App Purchases
        </span>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS: Featured Card (3 Columns Matching Reference Image)
// ══════════════════════════════════════════════════════════════════════════════
interface FeaturedCardProps {
  eyebrow: string
  eyebrowColor: string
  title: string
  subtitle: string
  badgeType: 'gothic' | 'safari' | 'celebration'
  onClick: () => void
}

function FeaturedCard({
  eyebrow,
  eyebrowColor,
  title,
  subtitle,
  badgeType,
  onClick,
}: FeaturedCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#F8F8FA',
        border: '1px solid #E5E5E7',
        borderRadius: 14,
        padding: '20px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ flex: 1, paddingRight: 14 }}>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: eyebrowColor,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 4,
          }}
        >
          {eyebrow}
        </span>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.25,
            margin: '0 0 6px 0',
            color: '#1D1D1F',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.4,
            color: '#6E6E73',
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Right Circular Graphic Badge Matching Reference Image */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          flexShrink: 0,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.06)',
          background:
            badgeType === 'gothic'
              ? 'radial-gradient(circle, #292524 0%, #0C0A09 100%)'
              : badgeType === 'safari'
              ? 'linear-gradient(135deg, #0284C7, #38BDF8)'
              : 'linear-gradient(135deg, #F59E0B, #EC4899, #8B5CF6)',
        }}
      >
        {badgeType === 'gothic' ? (
          <Shield size={36} color="#D6D3D1" strokeWidth={1.5} />
        ) : badgeType === 'safari' ? (
          <Compass size={36} color="#FFFFFF" strokeWidth={1.5} />
        ) : (
          <Sparkles size={36} color="#FFFFFF" strokeWidth={1.8} />
        )}
      </div>
    </div>
  )
}
