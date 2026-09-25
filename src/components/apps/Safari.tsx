'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowContext } from '@/app/components/os/Window'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'

// ── Types ───────────────────────────────────────────────────────────────────

export type PageId =
  | 'ccmagazine'
  | 'anotherescape'
  | 'mocan'
  | 'wanderlust'
  | 'stationery'
  | 'quanta'
  | 'architecture'
  | 'blog'

export interface TabItem {
  id: string
  title: string
  url: string
  domain: string
  pageId: PageId
  favicon: string
  canGoBack: boolean
  canGoForward: boolean
}

export interface PasswordItem {
  id: string
  domain: string
  username: string
  passwordMasked: string
  passwordPlain: string
  logoText: string
  logoBg: string
  logoColor: string
  modifiedDate: string
  notes?: string
  hasSecurityIssue?: boolean
  issueReason?: string
}

export interface ExtensionItem {
  id: string
  name: string
  category: string
  icon: string
  iconBg: string
  isInstalled: boolean
  description: string
}

// ── Default Pages Metadata (Matching Reference Images 1, 2, 3) ──────────────

const PAGES_DATA: Record<PageId, { title: string; url: string; domain: string; favicon: string }> = {
  ccmagazine: {
    title: 'CC/magazine is an online magazine ab...',
    url: 'https://ccmagazine.es',
    domain: 'ccmagazine.es',
    favicon: '🎨',
  },
  anotherescape: {
    title: 'Another Escape | Inspired by nature',
    url: 'https://anotherescape.com',
    domain: 'anotherescape.com',
    favicon: '🌍',
  },
  mocan: {
    title: 'MoCAN · Museum of Contemporary Art',
    url: 'https://mocan.art',
    domain: 'mocan.art',
    favicon: '🔷',
  },
  wanderlust: {
    title: 'Wanderlust Creamery · Artisanal Flavors',
    url: 'https://wanderlustcreamery.com',
    domain: 'wanderlustcreamery.com',
    favicon: '📍',
  },
  stationery: {
    title: 'Modern Stationery | Desk Supplies &...',
    url: 'https://modernstationery.co',
    domain: 'modernstationery.co',
    favicon: '▦',
  },
  quanta: {
    title: 'Glial Brain Cells, Long in Neurons’ Shadow · Quanta Magazine',
    url: 'https://quantamagazine.org/glial-brain-cells-hidden-powers',
    domain: 'quantamagazine.org',
    favicon: '⚛️',
  },
  architecture: {
    title: 'Architecture Outlook · Structural Design & Practice',
    url: 'https://architectureoutlook.com',
    domain: 'architectureoutlook.com',
    favicon: '🏛️',
  },
  blog: {
    title: 'Building Production PR Review Agents at Scale — Yamin',
    url: 'https://yamin.dev/blog/agentic-pr-reviewers',
    domain: 'yamin.dev',
    favicon: '⚡',
  },
}

// ── Password Vault Data (Exact Match to Image 1) ───────────────────────────

const PASSWORDS_DATA: PasswordItem[] = [
  {
    id: 'arch',
    domain: 'architectureoutlook.com',
    username: 'r.notch@icloud.com',
    passwordMasked: '••••••••••••••••',
    passwordPlain: 'SequoiaArchitect#2026',
    logoText: 'arc',
    logoBg: '#FFD60A',
    logoColor: '#000000',
    modifiedDate: 'Jun 7, 2024',
    notes: 'Partner portal credentials for structural master review.',
    hasSecurityIssue: false,
  },
  {
    id: 'quanta',
    domain: 'quantamagazine.org',
    username: 'r.notch@icloud.com',
    passwordMasked: '••••••••••••••',
    passwordPlain: 'NeuroGlia!Matrix99',
    logoText: '⚛️',
    logoBg: '#FF9500',
    logoColor: '#FFFFFF',
    modifiedDate: 'May 12, 2024',
    notes: 'Institutional research subscriber access.',
    hasSecurityIssue: false,
  },
  {
    id: 'era',
    domain: 'eraceramics.com',
    username: 'r.notch@icloud.com',
    passwordMasked: '••••••••••••',
    passwordPlain: 'TerraCottaKiln#4',
    logoText: 'era',
    logoBg: '#1C1C1E',
    logoColor: '#FFFFFF',
    modifiedDate: 'Apr 30, 2024',
    hasSecurityIssue: false,
  },
  {
    id: 'welltraveled',
    domain: 'welltraveledclub.com',
    username: 'r.notch@icloud.com',
    passwordMasked: '•••••••••••••••',
    passwordPlain: 'NomadPasskey88',
    logoText: '3',
    logoBg: '#D4AF37',
    logoColor: '#FFFFFF',
    modifiedDate: 'Apr 18, 2024',
    hasSecurityIssue: false,
  },
  {
    id: 'airmail',
    domain: 'airmail.news',
    username: 'r.notch@icloud.com',
    passwordMasked: '•••••••••••••',
    passwordPlain: 'DispatchWeekly7',
    logoText: '✈️',
    logoBg: '#FF3B30',
    logoColor: '#FFFFFF',
    modifiedDate: 'Mar 24, 2024',
    hasSecurityIssue: false,
  },
  {
    id: 'american',
    domain: 'americanairlines.com',
    username: 'r.notch@icloud.com',
    passwordMasked: '••••••••••••••••',
    passwordPlain: 'AAdvantageExec#26',
    logoText: 'AA',
    logoBg: '#0078D2',
    logoColor: '#FFFFFF',
    modifiedDate: 'Feb 15, 2024',
    hasSecurityIssue: false,
  },
  {
    id: 'apple',
    domain: 'apple.com',
    username: 'r.notch@icloud.com',
    passwordMasked: '••••••••••••••••••',
    passwordPlain: 'ApplePasskeyProtected',
    logoText: '',
    logoBg: '#000000',
    logoColor: '#FFFFFF',
    modifiedDate: 'Jan 10, 2024',
    notes: 'Apple ID Primary Account with biometric passkey.',
    hasSecurityIssue: false,
  },
  {
    id: 'mint',
    domain: 'mint.com',
    username: 'r.notch@icloud.com',
    passwordMasked: '••••••••••••',
    passwordPlain: 'FinancialOverview2024',
    logoText: '🌿',
    logoBg: '#34C759',
    logoColor: '#FFFFFF',
    modifiedDate: 'Dec 02, 2023',
    hasSecurityIssue: false,
  },
  {
    id: 'netflix',
    domain: 'netflix.com',
    username: 'r.notch@icloud.com',
    passwordMasked: '••••••••••••••',
    passwordPlain: 'CinemaStreams!4K',
    logoText: 'N',
    logoBg: '#E50914',
    logoColor: '#FFFFFF',
    modifiedDate: 'Nov 14, 2023',
    hasSecurityIssue: false,
  },
  {
    id: 'rei',
    domain: 'rei.com',
    username: 'r.notch@icloud.com',
    passwordMasked: '•••••••••••••',
    passwordPlain: 'TrailHikerPeak26',
    logoText: '⛰️',
    logoBg: '#2C3E50',
    logoColor: '#FFFFFF',
    modifiedDate: 'Oct 05, 2023',
    hasSecurityIssue: false,
  },
]

// ── Extensions Store Data (Exact Match to Image 4) ─────────────────────────

const INITIAL_EXTENSIONS: ExtensionItem[] = [
  {
    id: 'grammarly',
    name: 'Grammarly: AI Writing App',
    category: 'Writing',
    icon: 'G',
    iconBg: '#15C39A',
    isInstalled: true,
    description: 'Grammarly polishes your writing and fixes grammar errors in real time.',
  },
  {
    id: 'pinterest',
    name: 'Save to Pinterest',
    category: 'Lifestyle',
    icon: 'P',
    iconBg: '#E60023',
    isInstalled: false,
    description: 'Save any creative ideas, recipes, and interior photos from Safari.',
  },
  {
    id: 'capitalone',
    name: 'Capital One Shopping',
    category: 'Shopping',
    icon: 'S',
    iconBg: '#004A97',
    isInstalled: false,
    description: 'Automatically finds coupons and applies rewards at checkout.',
  },
  {
    id: 'notion',
    name: 'Notion Web Clipper',
    category: 'Productivity',
    icon: 'N',
    iconBg: '#000000',
    isInstalled: true,
    description: 'Save articles, highlights, and web pages directly into your Notion workspace.',
  },
  {
    id: 'teleparty',
    name: 'Teleparty - Watch TV',
    category: 'TV & Movies',
    icon: 'Tp',
    iconBg: '#E02475',
    isInstalled: false,
    description: 'Synchronized video playback and group chat for Netflix, Disney+, and YouTube.',
  },
  {
    id: 'smartplay',
    name: 'SmartPlay for Safari',
    category: 'Video',
    icon: '▶',
    iconBg: '#007AFF',
    isInstalled: false,
    description: 'Picture-in-picture enhancements and custom playback speeds.',
  },
  {
    id: 'authapp',
    name: 'Authentication App',
    category: 'Security',
    icon: '🛡️',
    iconBg: '#007AFF',
    isInstalled: false,
    description: '2FA authentication and time-based one-time passcodes in Safari.',
  },
  {
    id: 'mkplayer',
    name: 'MKPlayer - MKV & Media Player',
    category: 'Video',
    icon: '▶️',
    iconBg: '#FF9500',
    isInstalled: false,
    description: 'Stream any video format directly to AirPlay devices with Safari integration.',
  },
  {
    id: 'adblock',
    name: 'AdBlock Pro for Safari',
    category: 'Privacy',
    icon: '🚫',
    iconBg: '#FF3B30',
    isInstalled: true,
    description: 'Block annoying trackers, popups, and intrusive video ads with zero slowdown.',
  },
]

export default function Safari() {
  const windowContext = useWindowContext()

  // ── Tabs State (Exact 5 tabs from Image 3) ────────────────────────────────
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'tab-cc',
      title: PAGES_DATA.ccmagazine.title,
      url: PAGES_DATA.ccmagazine.url,
      domain: PAGES_DATA.ccmagazine.domain,
      pageId: 'ccmagazine',
      favicon: PAGES_DATA.ccmagazine.favicon,
      canGoBack: false,
      canGoForward: true,
    },
    {
      id: 'tab-escape',
      title: PAGES_DATA.anotherescape.title,
      url: PAGES_DATA.anotherescape.url,
      domain: PAGES_DATA.anotherescape.domain,
      pageId: 'anotherescape',
      favicon: PAGES_DATA.anotherescape.favicon,
      canGoBack: true,
      canGoForward: false,
    },
    {
      id: 'tab-mocan',
      title: PAGES_DATA.mocan.title,
      url: PAGES_DATA.mocan.url,
      domain: PAGES_DATA.mocan.domain,
      pageId: 'mocan',
      favicon: PAGES_DATA.mocan.favicon,
      canGoBack: false,
      canGoForward: false,
    },
    {
      id: 'tab-wanderlust',
      title: PAGES_DATA.wanderlust.title,
      url: PAGES_DATA.wanderlust.url,
      domain: PAGES_DATA.wanderlust.domain,
      pageId: 'wanderlust',
      favicon: PAGES_DATA.wanderlust.favicon,
      canGoBack: false,
      canGoForward: false,
    },
    {
      id: 'tab-stationery',
      title: PAGES_DATA.stationery.title,
      url: PAGES_DATA.stationery.url,
      domain: PAGES_DATA.stationery.domain,
      pageId: 'stationery',
      favicon: PAGES_DATA.stationery.favicon,
      canGoBack: false,
      canGoForward: false,
    },
  ])

  const [activeTabId, setActiveTabId] = useState<string>('tab-cc')

  // ── Safari Left Sidebar State ─────────────────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [sidebarTab, setSidebarTab] = useState<'bookmarks' | 'reading' | 'history'>('bookmarks')

  // ── Address Bar State ─────────────────────────────────────────────────────
  const [isUrlEditing, setIsUrlEditing] = useState<boolean>(false)
  const [addressInput, setAddressInput] = useState<string>('')
  const [isStartPopoverOpen, setIsStartPopoverOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadProgress, setLoadProgress] = useState<number>(100)

  // ── Overlays & Sheets (From Reference Images) ─────────────────────────────
  const [isTabOverviewOpen, setIsTabOverviewOpen] = useState<boolean>(false)
  const [isPasswordsOpen, setIsPasswordsOpen] = useState<boolean>(false) // Image 1
  const [selectedPasswordId, setSelectedPasswordId] = useState<string>('arch')
  const [passwordSearchQuery, setPasswordSearchQuery] = useState<string>('')
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({})

  const [isQuickNoteVisible, setIsQuickNoteVisible] = useState<boolean>(true) // Image 2
  const [isExtensionsModalOpen, setIsExtensionsModalOpen] = useState<boolean>(false) // Image 4
  const [extensions, setExtensions] = useState<ExtensionItem[]>(INITIAL_EXTENSIONS)
  const [installingExtId, setInstallingExtId] = useState<string | null>(null)

  const [isReaderMode, setIsReaderMode] = useState<boolean>(false) // Reader Mode toggle
  const [isTranslatePopoverOpen, setIsTranslatePopoverOpen] = useState<boolean>(false)
  const [currentLanguage, setCurrentLanguage] = useState<'Original' | 'English' | 'Spanish'>('Original')

  const addressInputRef = useRef<HTMLInputElement>(null)

  // Active tab reference
  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0]
  }, [tabs, activeTabId])

  useEffect(() => {
    if (activeTab) {
      setAddressInput(activeTab.domain)
    }
  }, [activeTab])

  // ── Page Loading Bar Simulation ───────────────────────────────────────────
  const triggerPageTransition = useCallback(() => {
    setIsLoading(true)
    setLoadProgress(20)
    const t1 = setTimeout(() => setLoadProgress(70), 90)
    const t2 = setTimeout(() => setLoadProgress(95), 180)
    const t3 = setTimeout(() => {
      setLoadProgress(100)
      setIsLoading(false)
    }, 280)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  // ── Switch Tabs ───────────────────────────────────────────────────────────
  const handleSelectTab = useCallback(
    (tabId: string) => {
      if (tabId === activeTabId && !isTabOverviewOpen) return
      soundEngine.play('click')
      triggerPageTransition()
      setActiveTabId(tabId)
      setIsTabOverviewOpen(false)
      setIsStartPopoverOpen(false)
    },
    [activeTabId, isTabOverviewOpen, triggerPageTransition]
  )

  // ── Add Tab ───────────────────────────────────────────────────────────────
  const handleAddTab = useCallback(() => {
    soundEngine.play('pop')
    const newId = `tab-${Date.now()}`
    const newTab: TabItem = {
      id: newId,
      title: 'Quanta Magazine · Hidden Powers',
      url: PAGES_DATA.quanta.url,
      domain: PAGES_DATA.quanta.domain,
      pageId: 'quanta',
      favicon: PAGES_DATA.quanta.favicon,
      canGoBack: false,
      canGoForward: false,
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newId)
    setIsTabOverviewOpen(false)
    triggerPageTransition()
  }, [triggerPageTransition])

  // ── Close Tab ─────────────────────────────────────────────────────────────
  const handleCloseTab = useCallback(
    (tabIdToClose: string, e?: React.MouseEvent) => {
      e?.stopPropagation()
      soundEngine.play('pop')
      if (tabs.length === 1) return // Keep at least one tab
      setTabs((prev) => {
        const next = prev.filter((t) => t.id !== tabIdToClose)
        if (activeTabId === tabIdToClose) {
          const closedIdx = prev.findIndex((t) => t.id === tabIdToClose)
          const newActive = next[Math.max(0, closedIdx - 1)]
          if (newActive) setActiveTabId(newActive.id)
        }
        return next
      })
    },
    [tabs.length, activeTabId]
  )

  // ── Navigate Active Tab to a specific page ────────────────────────────────
  const navigateActiveTab = useCallback(
    (targetPage: PageId) => {
      soundEngine.play('click')
      triggerPageTransition()
      setIsStartPopoverOpen(false)
      setIsUrlEditing(false)
      const data = PAGES_DATA[targetPage]
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                title: data.title,
                url: data.url,
                domain: data.domain,
                pageId: targetPage,
                favicon: data.favicon,
              }
            : t
        )
      )
    },
    [activeTabId, triggerPageTransition]
  )

  // ── Address Bar Submit ────────────────────────────────────────────────────
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUrlEditing(false)
    setIsStartPopoverOpen(false)
    const q = addressInput.trim().toLowerCase()

    if (q.includes('quanta') || q.includes('brain') || q.includes('glial')) {
      navigateActiveTab('quanta')
    } else if (q.includes('arch') || q.includes('outlook') || q.includes('firm')) {
      navigateActiveTab('architecture')
    } else if (q.includes('blog') || q.includes('yamin') || q.includes('pr')) {
      navigateActiveTab('blog')
    } else if (q.includes('escape') || q.includes('nature')) {
      navigateActiveTab('anotherescape')
    } else if (q.includes('mocan') || q.includes('art') || q.includes('museum')) {
      navigateActiveTab('mocan')
    } else if (q.includes('ice') || q.includes('wanderlust') || q.includes('cream')) {
      navigateActiveTab('wanderlust')
    } else if (q.includes('pen') || q.includes('stationery') || q.includes('desk')) {
      navigateActiveTab('stationery')
    } else {
      navigateActiveTab('ccmagazine')
    }
  }

  // ── Install Extension Handler ─────────────────────────────────────────────
  const handleToggleInstallExtension = (extId: string) => {
    setInstallingExtId(extId)
    soundEngine.play('action')
    setTimeout(() => {
      setExtensions((prev) =>
        prev.map((ext) => (ext.id === extId ? { ...ext, isInstalled: !ext.isInstalled } : ext))
      )
      setInstallingExtId(null)
      soundEngine.play('pop')
    }, 600)
  }

  // Filter passwords
  const filteredPasswords = useMemo(() => {
    if (!passwordSearchQuery) return PASSWORDS_DATA
    const q = passwordSearchQuery.toLowerCase()
    return PASSWORDS_DATA.filter((p) => p.domain.toLowerCase().includes(q) || p.username.toLowerCase().includes(q))
  }, [passwordSearchQuery])

  const selectedPassword = useMemo(() => {
    return PASSWORDS_DATA.find((p) => p.id === selectedPasswordId) || PASSWORDS_DATA[0]
  }, [selectedPasswordId])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        color: '#1D1D1F',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* ─── 1. TOP UNIFIED macOS SEQUOIA LIGHT TOOLBAR ──────────────────────── */}
      <div
        onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
        onDoubleClick={() => windowContext?.toggleMaximize()}
        style={{
          height: 48,
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px 0 14px',
          backgroundColor: 'rgba(246, 246, 246, 0.94)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          borderBottom: '0.5px solid rgba(0, 0, 0, 0.14)',
          position: 'relative',
          zIndex: 40,
        }}
      >
        {/* Loading Progress Bar Indicator (Safari style) */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: 2.5,
              width: `${loadProgress}%`,
              backgroundColor: '#007AFF',
              transition: 'width 0.2s ease-out',
              zIndex: 100,
              boxShadow: '0 0 8px rgba(0, 122, 255, 0.6)',
            }}
          />
        )}

        {/* Left Section: Traffic Lights & Navigation Chevrons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Traffic Lights */}
          <TrafficLights />

          {/* Safari Sidebar Toggle Button (macOS Sequoia [| ] ⌄ icon) */}
          <button
            onClick={() => {
              soundEngine.play('pop')
              setIsSidebarOpen(!isSidebarOpen)
            }}
            title="Toggle Bookmarks Sidebar"
            style={{
              background: isSidebarOpen ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: 6,
              padding: '3px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
              color: isSidebarOpen ? '#007AFF' : '#48484A',
              transition: 'background-color 0.15s ease',
            }}
          >
            {/* Split Sidebar Icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
            <span style={{ fontSize: 8, opacity: 0.7 }}>▼</span>
          </button>

          {/* Navigation Chevrons (< and >) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              onClick={() => {
                if (activeTab.canGoBack) {
                  soundEngine.play('click')
                  triggerPageTransition()
                }
              }}
              disabled={!activeTab.canGoBack}
              title="Click to go back"
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab.canGoBack ? '#1D1D1F' : '#AEAEB2',
                cursor: activeTab.canGoBack ? 'pointer' : 'default',
                padding: '2px 5px',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={() => {
                if (activeTab.canGoForward) {
                  soundEngine.play('click')
                  triggerPageTransition()
                }
              }}
              disabled={!activeTab.canGoForward}
              title="Click to go forward"
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab.canGoForward ? '#1D1D1F' : '#AEAEB2',
                cursor: activeTab.canGoForward ? 'pointer' : 'default',
                padding: '2px 5px',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center: Apple Safari Floating Capsule Address Bar */}
        <div
          style={{
            flex: 1,
            maxWidth: 560,
            margin: '0 16px',
            position: 'relative',
          }}
        >
          <form
            onSubmit={handleAddressSubmit}
            onClick={() => {
              setIsUrlEditing(true)
              setIsStartPopoverOpen(true)
              setTimeout(() => addressInputRef.current?.select(), 40)
            }}
            style={{
              height: 29,
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              border: isUrlEditing ? '1px solid #007AFF' : '0.5px solid rgba(0, 0, 0, 0.15)',
              boxShadow: isUrlEditing
                ? '0 0 0 3px rgba(0, 122, 255, 0.2)'
                : '0 1px 3px rgba(0, 0, 0, 0.05), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              cursor: isUrlEditing ? 'text' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Left: Reader Mode Toggle & Privacy Lock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#636366' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  soundEngine.play('pop')
                  setIsReaderMode(!isReaderMode)
                }}
                title={isReaderMode ? 'Hide Reader' : 'Show Reader'}
                style={{
                  background: isReaderMode ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: isReaderMode ? '#007AFF' : '#636366',
                }}
              >
                {/* Reader Lines Icon */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="16" y2="12" />
                  <line x1="3" y1="18" x2="19" y2="18" />
                </svg>
              </button>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            {/* Center: Domain Name or Editable URL */}
            {isUrlEditing ? (
              <input
                ref={addressInputRef}
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsUrlEditing(false)
                    setIsStartPopoverOpen(false)
                  }, 200)
                }}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: 12.5,
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, sans-serif',
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 450,
                  color: '#1D1D1F',
                  letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, sans-serif',
                }}
              >
                {activeTab.domain}
              </span>
            )}

            {/* Right: Translate Icon & Reload Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#636366' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  soundEngine.play('pop')
                  setIsTranslatePopoverOpen(!isTranslatePopoverOpen)
                }}
                title="Translation Available"
                style={{
                  background: isTranslatePopoverOpen ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: 4,
                  fontSize: 11,
                  color: isTranslatePopoverOpen ? '#007AFF' : '#636366',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                💬
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  soundEngine.play('click')
                  triggerPageTransition()
                }}
                title="Reload this page"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#636366',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            </div>
          </form>

          {/* ── Address Bar Popover (Favorites / Frequently Visited) ──────── */}
          <AnimatePresence>
            {isStartPopoverOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  top: 36,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  borderRadius: 12,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)',
                  border: '0.5px solid rgba(0,0,0,0.15)',
                  padding: '16px',
                  zIndex: 80,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8E8E93', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Favorites
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                  {[
                    { id: 'ccmagazine', name: 'CC/magazine', icon: '🎨', bg: '#B4E391' },
                    { id: 'quanta', name: 'Quanta', icon: '⚛️', bg: '#FAF9F6' },
                    { id: 'architecture', name: 'Architecture', icon: '🏛️', bg: '#1C1C1E' },
                    { id: 'anotherescape', name: 'Another Escape', icon: '🌍', bg: '#EAE7DC' },
                    { id: 'mocan', name: 'MoCAN', icon: '🔷', bg: '#F2F2F7' },
                    { id: 'wanderlust', name: 'Wanderlust', icon: '📍', bg: '#E8F5E9' },
                    { id: 'stationery', name: 'Stationery', icon: '▦', bg: '#FFF8E7' },
                    { id: 'blog', name: 'Engineering', icon: '⚡', bg: '#EEF2FF' },
                  ].map((site) => (
                    <button
                      key={site.id}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        navigateActiveTab(site.id as PageId)
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        padding: '6px 4px',
                        borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          backgroundColor: site.bg,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08), inset 0 0.5px 0 rgba(255,255,255,0.8)',
                          border: '0.5px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                        }}
                      >
                        {site.icon}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: '#1D1D1F' }}>{site.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Translation Popover ─────────────────────────────────────────── */}
          <AnimatePresence>
            {isTranslatePopoverOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                style={{
                  position: 'absolute',
                  top: 36,
                  right: 0,
                  width: 200,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  border: '0.5px solid rgba(0,0,0,0.12)',
                  padding: 6,
                  zIndex: 85,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8E8E93', padding: '6px 8px' }}>
                  TRANSLATION
                </div>
                {(['Original', 'English', 'Spanish'] as const).map((lang) => (
                  <div
                    key={lang}
                    onClick={() => {
                      setCurrentLanguage(lang)
                      setIsTranslatePopoverOpen(false)
                      soundEngine.play('click')
                    }}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: currentLanguage === lang ? 'rgba(0,122,255,0.12)' : 'transparent',
                      color: currentLanguage === lang ? '#007AFF' : '#1D1D1F',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{lang}</span>
                    {currentLanguage === lang && <span>✓</span>}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section: Passwords, Extensions, Quick Note Toggle, Share, New Tab, Tab Overview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Apple Passwords Key Icon (Image 1 feature) */}
          <button
            onClick={() => {
              soundEngine.play('pop')
              setIsPasswordsOpen(!isPasswordsOpen)
            }}
            title="AutoFill Passwords & Passkeys (macOS)"
            style={{
              background: isPasswordsOpen ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: 6,
              padding: '4px 6px',
              cursor: 'pointer',
              color: isPasswordsOpen ? '#007AFF' : '#48484A',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7.5" cy="15.5" r="5.5" />
              <path d="m21 2-9.6 9.6" />
              <path d="m15.5 7.5 3 3L22 7l-3-3" />
            </svg>
          </button>

          {/* Safari Extensions Puzzle Icon (Image 4 feature) */}
          <button
            onClick={() => {
              soundEngine.play('pop')
              setIsExtensionsModalOpen(!isExtensionsModalOpen)
            }}
            title="Safari Extensions"
            style={{
              background: isExtensionsModalOpen ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: 6,
              padding: '4px 6px',
              cursor: 'pointer',
              color: isExtensionsModalOpen ? '#007AFF' : '#48484A',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19.439 7.85c-.049-.322.059-.648.289-.878l1.568-1.568a1.996 1.996 0 0 0-2.824-2.824L16.89 4.148c-.23.23-.556.338-.878.29-1.282-.194-2.585.176-3.551 1.142-.966.966-1.336 2.269-1.142 3.551.048.322-.06.648-.29.878l-6.568 6.568a1.996 1.996 0 0 0 2.824 2.824l6.568-6.568c.23-.23.556-.338.878-.29 1.282.194 2.585-.176 3.551-1.142.966-.966 1.336-2.269 1.142-3.551z" />
            </svg>
          </button>

          {/* Quick Note Toggle Button (Image 2 feature) */}
          <button
            onClick={() => {
              soundEngine.play('pop')
              setIsQuickNoteVisible(!isQuickNoteVisible)
            }}
            title="Toggle Quick Note"
            style={{
              background: isQuickNoteVisible ? 'rgba(52, 199, 89, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: 6,
              padding: '4px 6px',
              cursor: 'pointer',
              color: isQuickNoteVisible ? '#28CD41' : '#48484A',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 13 }}>📝</span>
          </button>

          {/* Share Button (Box with Arrow - Images 1, 2, 3) */}
          <button
            onClick={() => {
              soundEngine.play('action')
              if (navigator.clipboard) navigator.clipboard.writeText(activeTab.url)
            }}
            title="Share this page"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#48484A',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          {/* New Tab Button (+) */}
          <button
            onClick={handleAddTab}
            title="Create a new tab (⌘T)"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#48484A',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Tab Overview Button (Two Overlapping Squares - Images 1, 2, 3) */}
          <button
            onClick={() => {
              soundEngine.play('pop')
              setIsTabOverviewOpen(!isTabOverviewOpen)
            }}
            title="Show Tab Overview (⌘⇧\)"
            style={{
              background: isTabOverviewOpen ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: 6,
              padding: '4px 6px',
              cursor: 'pointer',
              color: isTabOverviewOpen ? '#007AFF' : '#48484A',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="7" y="3" width="14" height="14" rx="2" />
              <path d="M3 7v12a2 2 0 0 0 2 2h12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── 2. FULL-WIDTH macOS LIGHT TAB BAR (Exact Match to Image 3) ──────── */}
      {!isTabOverviewOpen && (
        <div
          style={{
            height: 31,
            minHeight: 31,
            display: 'flex',
            alignItems: 'stretch',
            backgroundColor: 'rgba(238, 238, 240, 0.95)',
            borderBottom: '0.5px solid rgba(0, 0, 0, 0.12)',
            boxSizing: 'border-box',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            position: 'relative',
            zIndex: 35,
          }}
        >
          {tabs.map((tab, idx) => {
            const isActive = tab.id === activeTabId
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                style={{
                  flex: 1,
                  minWidth: 140,
                  maxWidth: 240,
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 10px',
                  cursor: 'pointer',
                  borderRight: idx < tabs.length - 1 && !isActive ? '0.5px solid rgba(0, 0, 0, 0.12)' : 'none',
                  boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                  fontSize: 11.5,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? '#1D1D1F' : '#636366',
                  position: 'relative',
                  transition: 'background-color 0.12s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{tab.favicon}</span>
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.title}
                  </span>
                </div>

                {/* Close Button on Tab */}
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  title="Close Tab"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 3,
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#8E8E93',
                    opacity: isActive ? 0.8 : 0.4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* ─── 3. MAIN WORKSPACE AREA (Sidebar + Viewport) ────────────────────── */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Safari Bookmarks / History Collapsible Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 230, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{
                height: '100%',
                backgroundColor: '#F5F5F7',
                borderRight: '0.5px solid rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0,
                zIndex: 25,
              }}
            >
              {/* Segmented Controls */}
              <div style={{ padding: '10px 12px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', backgroundColor: '#E5E5EA', borderRadius: 7, padding: 2 }}>
                  <button
                    onClick={() => setSidebarTab('bookmarks')}
                    style={{
                      flex: 1,
                      border: 'none',
                      backgroundColor: sidebarTab === 'bookmarks' ? '#FFFFFF' : 'transparent',
                      borderRadius: 5,
                      padding: '4px 0',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: sidebarTab === 'bookmarks' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    Bookmarks
                  </button>
                  <button
                    onClick={() => setSidebarTab('reading')}
                    style={{
                      flex: 1,
                      border: 'none',
                      backgroundColor: sidebarTab === 'reading' ? '#FFFFFF' : 'transparent',
                      borderRadius: 5,
                      padding: '4px 0',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: sidebarTab === 'reading' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    Reading List
                  </button>
                </div>
              </div>

              {/* Sidebar List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#8E8E93', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6, paddingLeft: 6 }}>
                  Favorites
                </div>
                {[
                  { page: 'ccmagazine', label: 'CC/magazine', icon: '🎨' },
                  { page: 'quanta', label: 'Quanta Magazine', icon: '⚛️' },
                  { page: 'architecture', label: 'Architecture Outlook', icon: '🏛️' },
                  { page: 'anotherescape', label: 'Another Escape', icon: '🌍' },
                  { page: 'mocan', label: 'MoCAN Gallery', icon: '🔷' },
                  { page: 'wanderlust', label: 'Wanderlust Creamery', icon: '📍' },
                  { page: 'stationery', label: 'Modern Stationery', icon: '▦' },
                  { page: 'blog', label: 'Agentic PR Reviewers', icon: '⚡' },
                ].map((item) => (
                  <div
                    key={item.page}
                    onClick={() => navigateActiveTab(item.page as PageId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: 'pointer',
                      backgroundColor: activeTab.pageId === item.page ? '#E5E5EA' : 'transparent',
                      fontWeight: activeTab.pageId === item.page ? 600 : 400,
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 4. TAB OVERVIEW GRID (⌘⇧\ - Exact Match to Apple) ─────────────── */}
        <AnimatePresence>
          {isTabOverviewOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(235, 235, 237, 0.96)',
                backdropFilter: 'blur(30px)',
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 32px',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1D1D1F' }}>
                  {tabs.length} Tabs Open
                </div>
                <button
                  onClick={() => setIsTabOverviewOpen(false)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '0.5px solid rgba(0,0,0,0.12)',
                    borderRadius: 6,
                    padding: '4px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  Done
                </button>
              </div>

              {/* Grid of Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                {tabs.map((tab) => (
                  <motion.div
                    key={tab.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => handleSelectTab(tab.id)}
                    style={{
                      height: 160,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 10,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
                      border: tab.id === activeTabId ? '2px solid #007AFF' : '0.5px solid rgba(0,0,0,0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <div style={{ padding: '8px 10px', backgroundColor: '#F8F8F9', borderBottom: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                        <span>{tab.favicon}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#8E8E93', fontSize: 13 }}
                      >
                        ×
                      </button>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        backgroundColor:
                          tab.pageId === 'ccmagazine'
                            ? '#B4E391'
                            : tab.pageId === 'quanta'
                            ? '#FAF9F6'
                            : tab.pageId === 'architecture'
                            ? '#0D0D0D'
                            : tab.pageId === 'anotherescape'
                            ? '#EAE7DC'
                            : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tab.pageId === 'architecture' ? '#fff' : '#1D1D1F',
                        fontSize: 13,
                        fontWeight: 600,
                        padding: 12,
                        textAlign: 'center',
                      }}
                    >
                      {tab.domain}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 5. WEBPAGE CONTENT VIEWPORT ───────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            position: 'relative',
            backgroundColor: '#FFFFFF',
          }}
        >
          {activeTab.pageId === 'ccmagazine' && <CCMagazineView />}
          {activeTab.pageId === 'quanta' && <QuantaMagazineView isReaderMode={isReaderMode} />}
          {activeTab.pageId === 'architecture' && (
            <ArchitectureOutlookView onOpenPasswords={() => setIsPasswordsOpen(true)} />
          )}
          {activeTab.pageId === 'anotherescape' && <AnotherEscapeView />}
          {activeTab.pageId === 'mocan' && <MoCANView />}
          {activeTab.pageId === 'wanderlust' && <WanderlustCreameryView />}
          {activeTab.pageId === 'stationery' && <ModernStationeryView />}
          {activeTab.pageId === 'blog' && <EngineeringBlogView />}
        </div>
      </div>

      {/* ─── 6. FLOATING QUICK NOTE OVERLAY (Exact Match to Image 2) ─────────── */}
      <AnimatePresence>
        {isQuickNoteVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            drag
            dragMomentum={false}
            style={{
              position: 'absolute',
              bottom: 24,
              right: 28,
              width: 260,
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              boxShadow: '0 20px 50px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)',
              border: '0.5px solid rgba(0,0,0,0.14)',
              overflow: 'hidden',
              zIndex: 50,
              cursor: 'grab',
            }}
          >
            {/* Note Window Header */}
            <div
              style={{
                height: 32,
                backgroundColor: '#F7F7F7',
                borderBottom: '0.5px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px',
              }}
            >
              <div style={{ display: 'flex', gap: 5 }}>
                <span
                  onClick={() => setIsQuickNoteVisible(false)}
                  style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF5F56', cursor: 'pointer' }}
                />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27C93F' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#1D1D1F' }}>Summer Research</span>
              <div style={{ display: 'flex', gap: 6, fontSize: 11, color: '#636366' }}>
                <span style={{ cursor: 'pointer' }}>Aa</span>
                <span style={{ cursor: 'pointer' }}>»</span>
              </div>
            </div>

            {/* Note Content */}
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 9.5, color: '#8E8E93', marginBottom: 6 }}>
                April 1, 2026 at 9:41 AM
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1D1D1F', marginBottom: 8 }}>
                Summer Research
              </div>

              {/* Green Quanta Quote Card (as seen in Image 2!) */}
              <div
                onClick={() => {
                  if (activeTab.pageId !== 'quanta') navigateActiveTab('quanta')
                }}
                style={{
                  backgroundColor: '#007A33',
                  color: '#FFFFFF',
                  borderRadius: 10,
                  padding: '10px 12px',
                  boxShadow: '0 4px 12px rgba(0, 122, 51, 0.25)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1, marginBottom: 4 }}>“</div>
                <div style={{ fontSize: 9.5, lineHeight: 1.45, opacity: 0.95, marginBottom: 8 }}>
                  they were considered a supportive matrix within the skull. This prompted the 19th-century researcher Rudolph Virchow to dub this non-neuronal material &ldquo;neuroglia,&rdquo; drawing on the Greek word for glue.
                </div>
                <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.25)', paddingTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 600 }}>Glial Brain Cells, Long in Neurons’ Shadow</div>
                    <div style={{ fontSize: 8, opacity: 0.8 }}>quantamagazine.org</div>
                  </div>
                  <div style={{ fontSize: 14 }}>🧬</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 7. PASSWORDS & PASSKEYS 3-COLUMN SHEET (Exact Match to Image 1) ──── */}
      <AnimatePresence>
        {isPasswordsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            style={{
              position: 'absolute',
              top: 50,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '94%',
              maxWidth: 820,
              height: 480,
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.35), 0 2px 10px rgba(0, 0, 0, 0.1)',
              border: '0.5px solid rgba(0, 0, 0, 0.15)',
              display: 'flex',
              overflow: 'hidden',
              zIndex: 60,
            }}
          >
            {/* Column 1: Left Categories Sidebar */}
            <div
              style={{
                width: 180,
                backgroundColor: '#F5F5F7',
                borderRight: '0.5px solid rgba(0, 0, 0, 0.1)',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {/* Traffic lights in modal */}
              <div style={{ display: 'flex', gap: 6, padding: '4px 6px 12px' }}>
                <span onClick={() => setIsPasswordsOpen(false)} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF5F56', cursor: 'pointer' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27C93F' }} />
              </div>

              {/* 2x3 Grid Category Tiles (Matching Image 1) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                {[
                  { label: 'All', count: 219, icon: '🔑', active: true, bg: '#007AFF', color: '#fff' },
                  { label: 'Passkeys', count: 5, icon: '👤', active: false, bg: '#fff', color: '#1D1D1F' },
                  { label: 'Codes', count: 3, icon: '🔒', active: false, bg: '#fff', color: '#1D1D1F' },
                  { label: 'Wi-Fi', count: 84, icon: '📶', active: false, bg: '#fff', color: '#1D1D1F' },
                  { label: 'Security', count: 118, icon: '⚠️', active: false, bg: '#fff', color: '#1D1D1F' },
                  { label: 'Deleted', count: 0, icon: '🗑️', active: false, bg: '#fff', color: '#1D1D1F' },
                ].map((c) => (
                  <div
                    key={c.label}
                    style={{
                      backgroundColor: c.bg,
                      color: c.color,
                      borderRadius: 8,
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: 52,
                      border: c.active ? 'none' : '0.5px solid rgba(0,0,0,0.08)',
                      boxShadow: c.active ? '0 2px 6px rgba(0,122,255,0.3)' : '0 1px 2px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13 }}>{c.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700 }}>{c.count}</span>
                    </div>
                    <div style={{ fontSize: 10.5, fontWeight: 600 }}>{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Shared Groups Card (Image 1 feature) */}
              <div style={{ padding: '8px 6px 4px', fontSize: 10, fontWeight: 700, color: '#8E8E93' }}>
                Shared Groups
              </div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  padding: '10px',
                  border: '0.5px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span>👥</span>
                  <div style={{ fontSize: 10.5, fontWeight: 600 }}>Share Passwords with Family</div>
                </div>
                <div style={{ fontSize: 9.5, color: '#8E8E93', lineHeight: 1.35, marginBottom: 8 }}>
                  Share passwords and passkeys safely and securely with your family.
                </div>
                <button
                  style={{
                    backgroundColor: '#E5E5EA',
                    border: 'none',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#1D1D1F',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Column 2: Middle Items List */}
            <div
              style={{
                width: 270,
                borderRight: '0.5px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Header with Search & Controls */}
              <div style={{ padding: '10px 12px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>All</span>
                    <span style={{ fontSize: 10.5, color: '#8E8E93', marginLeft: 6 }}>{filteredPasswords.length} Items</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#007AFF', cursor: 'pointer' }}>
                    <span>⇅</span>
                    <span>+</span>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Search"
                  value={passwordSearchQuery}
                  onChange={(e) => setPasswordSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: 24,
                    borderRadius: 6,
                    border: '0.5px solid rgba(0,0,0,0.12)',
                    backgroundColor: '#F2F2F7',
                    padding: '0 8px',
                    fontSize: 11,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Items List */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredPasswords.map((item) => {
                  const isSelected = item.id === selectedPasswordId
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPasswordId(item.id)}
                      style={{
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        backgroundColor: isSelected ? '#007AFF' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#1D1D1F',
                        borderBottom: '0.5px solid rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          backgroundColor: item.logoBg,
                          color: item.logoColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        {item.logoText}
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {item.domain}
                        </div>
                        <div style={{ fontSize: 9.5, opacity: 0.8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {item.username}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Column 3: Right Details Pane (Exact Match to Image 1) */}
            <div style={{ flex: 1, padding: '24px 28px', backgroundColor: '#FAFAFC', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      backgroundColor: selectedPassword.logoBg,
                      color: selectedPassword.logoColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 19,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}
                  >
                    {selectedPassword.logoText}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>
                      {selectedPassword.domain.split('.')[0].toUpperCase()}
                    </h2>
                    <div style={{ fontSize: 11, color: '#8E8E93' }}>Saved Password &amp; Passkey</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '0.5px solid rgba(0,0,0,0.15)',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 11.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Credentials Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  border: '0.5px solid rgba(0,0,0,0.1)',
                  padding: '10px 14px',
                  marginBottom: 16,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                {/* Username */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)', fontSize: 11.5 }}>
                  <span style={{ color: '#8E8E93' }}>User Name</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 500 }}>{selectedPassword.username}</span>
                    <button
                      onClick={() => navigator.clipboard?.writeText(selectedPassword.username)}
                      title="Copy User Name"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: '#007AFF' }}
                    >
                      📋
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)', fontSize: 11.5 }}>
                  <span style={{ color: '#8E8E93' }}>Password</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ letterSpacing: revealedPasswords[selectedPassword.id] ? 'normal' : '2px', fontWeight: 600, fontFamily: 'monospace' }}>
                      {revealedPasswords[selectedPassword.id] ? selectedPassword.passwordPlain : selectedPassword.passwordMasked}
                    </span>
                    <button
                      onClick={() =>
                        setRevealedPasswords((prev) => ({ ...prev, [selectedPassword.id]: !prev[selectedPassword.id] }))
                      }
                      title={revealedPasswords[selectedPassword.id] ? 'Hide Password' : 'Show Password'}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: '#007AFF' }}
                    >
                      {revealedPasswords[selectedPassword.id] ? '🙈' : '👁️'}
                    </button>
                    <button
                      onClick={() => navigator.clipboard?.writeText(selectedPassword.passwordPlain)}
                      title="Copy Password"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: '#007AFF' }}
                    >
                      📋
                    </button>
                  </div>
                </div>

                {/* Website */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)', fontSize: 11.5 }}>
                  <span style={{ color: '#8E8E93' }}>Website</span>
                  <span
                    onClick={() => {
                      setIsPasswordsOpen(false)
                      if (selectedPassword.id === 'arch') navigateActiveTab('architecture')
                      if (selectedPassword.id === 'quanta') navigateActiveTab('quanta')
                    }}
                    style={{ color: '#007AFF', fontWeight: 500, cursor: 'pointer' }}
                  >
                    {selectedPassword.domain}
                  </span>
                </div>

                {/* Modified */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: 11.5 }}>
                  <span style={{ color: '#8E8E93' }}>Modified</span>
                  <span style={{ color: '#636366' }}>{selectedPassword.modifiedDate}</span>
                </div>
              </div>

              {/* No Issues Found Shield Card (Exact Match to Image 1) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  border: '0.5px solid rgba(0,0,0,0.1)',
                  padding: '14px 16px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ fontSize: 20 }}>🛡️</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1D1D1F', marginBottom: 3 }}>
                    No Issues Found
                  </div>
                  <div style={{ fontSize: 10.5, color: '#8E8E93', lineHeight: 1.45 }}>
                    This password doesn’t appear to contain words or patterns that may be obvious to an attacker, and you aren’t reusing it for passwords saved across multiple services in Passwords.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 8. SAFARI EXTENSIONS GALLERY MODAL (Exact Match to Image 4) ──────── */}
      <AnimatePresence>
        {isExtensionsModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: 48,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '92%',
              maxWidth: 780,
              height: 480,
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.35)',
              border: '0.5px solid rgba(0, 0, 0, 0.15)',
              display: 'flex',
              overflow: 'hidden',
              zIndex: 60,
            }}
          >
            {/* Extensions Sidebar */}
            <div style={{ width: 180, backgroundColor: '#F5F5F7', padding: '16px 10px', borderRight: '0.5px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                <span onClick={() => setIsExtensionsModalOpen(false)} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF5F56', cursor: 'pointer' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27C93F' }} />
              </div>
              <input
                type="text"
                placeholder="Search"
                style={{ height: 26, borderRadius: 6, border: '0.5px solid rgba(0,0,0,0.12)', padding: '0 8px', fontSize: 11, marginBottom: 12, outline: 'none' }}
              />
              {['Discover', 'Arcade', 'Create', 'Work', 'Play', 'Develop', 'Categories', 'Updates'].map((cat) => (
                <div
                  key={cat}
                  style={{
                    padding: '5px 8px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: cat === 'Categories' ? 600 : 400,
                    backgroundColor: cat === 'Categories' ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                    color: cat === 'Categories' ? '#007AFF' : '#1D1D1F',
                    marginBottom: 2,
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </div>
              ))}

              {/* User Profile Pill at Bottom (Image 4) */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 4px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#FF9500', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                  LI
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>Leticia Ibarra</div>
                  <div style={{ fontSize: 9.5, color: '#8E8E93' }}>$20.87</div>
                </div>
              </div>
            </div>

            {/* Extensions Content */}
            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Safari Extensions</h2>

              {/* Banners (Exact from Image 4) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ backgroundColor: '#F2F2F7', borderRadius: 10, padding: 14, border: '0.5px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 9, color: '#007AFF', fontWeight: 700, textTransform: 'uppercase' }}>GET STARTED</div>
                  <div style={{ fontSize: 13, fontWeight: 700, margin: '4px 0' }}>The Best Safari Extensions</div>
                  <div style={{ fontSize: 10.5, color: '#8E8E93' }}>Enhance your browser with these apps.</div>
                </div>
                <div style={{ backgroundColor: '#F2F2F7', borderRadius: 10, padding: 14, border: '0.5px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 9, color: '#007AFF', fontWeight: 700, textTransform: 'uppercase' }}>FEATURED APP</div>
                  <div style={{ fontSize: 13, fontWeight: 700, margin: '4px 0' }}>No More Typos!</div>
                  <div style={{ fontSize: 10.5, color: '#8E8E93' }}>Grammarly polishes your writing.</div>
                </div>
              </div>

              {/* Top Free Apps Grid */}
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Top Free Apps</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {extensions.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 8,
                      backgroundColor: '#F9F9FB',
                      border: '0.5px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          backgroundColor: app.iconBg,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {app.icon}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {app.name}
                        </div>
                        <div style={{ fontSize: 9, color: '#8E8E93' }}>{app.category}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleInstallExtension(app.id)}
                      disabled={installingExtId === app.id}
                      style={{
                        backgroundColor: app.isInstalled ? '#E5E5EA' : '#007AFF',
                        border: 'none',
                        borderRadius: 12,
                        padding: '3px 10px',
                        fontSize: 10,
                        fontWeight: 700,
                        color: app.isInstalled ? '#007AFF' : '#FFFFFF',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {installingExtId === app.id ? '...' : app.isInstalled ? 'INSTALLED' : 'GET'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE 1: CC/magazine (EXACT MATCH TO IMAGE 3)
// ─────────────────────────────────────────────────────────────────────────────

function CCMagazineView() {
  return (
    <div style={{ backgroundColor: '#B4E391', minHeight: '100%', padding: '20px 36px 60px', color: '#1D1D1F', fontFamily: 'serif' }}>
      {/* Category Nav Header (as seen in Image 3) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.15)', paddingBottom: 12, marginBottom: 24, fontSize: 11, fontFamily: '-apple-system, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>HOTSPOTS ⌄</span>
          <span>CULTURE ⌄</span>
          <span>ART ⌄</span>
          <span>INSPIRATION ⌄</span>
          <span>TRAVEL ⌄</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span>City Guides 🛍</span>
          <span>About</span>
          <span>Contact</span>
          <span>IG</span>
          <span>🔍</span>
          <span style={{ borderBottom: '1.5px solid #000' }}>EN</span>
          <span style={{ opacity: 0.6 }}>ES</span>
        </div>
      </div>

      {/* Main Magazine Title */}
      <h1 style={{ fontSize: 64, fontWeight: 400, textAlign: 'center', margin: '0 0 32px', letterSpacing: '-0.03em' }}>
        CC/magazine
      </h1>

      {/* Hero Feature Article */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 32, alignItems: 'start', maxWidth: 960, margin: '0 auto' }}>
        {/* Architectural Illustration of Beti-Jai (Image 3) */}
        <div style={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.1)' }}>
          <svg viewBox="0 0 600 400" width="100%" height="320" style={{ display: 'block', backgroundColor: '#6FA45B' }}>
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#81C4FF" />
                <stop offset="60%" stopColor="#C9E6FF" />
                <stop offset="100%" stopColor="#DFB387" />
              </linearGradient>
              <linearGradient id="canopyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C45A2C" />
                <stop offset="50%" stopColor="#D96E3B" />
                <stop offset="100%" stopColor="#A84318" />
              </linearGradient>
            </defs>
            <rect width="600" height="400" fill="url(#skyGrad)" />
            {/* Soft Clouds */}
            <ellipse cx="140" cy="80" rx="90" ry="24" fill="#FFFFFF" opacity="0.6" />
            <ellipse cx="450" cy="60" rx="120" ry="28" fill="#FFFFFF" opacity="0.5" />

            {/* Beti-Jai Stadium Curved Fronton Facade */}
            <path d="M 40,400 L 40,280 Q 300,160 560,180 L 560,400 Z" fill="#E8DED1" />

            {/* Cantilever Roof Arch */}
            <path d="M 40,280 Q 300,150 560,170 L 560,195 Q 300,175 40,305 Z" fill="url(#canopyGrad)" />

            {/* Iron Balconies & Pillars */}
            {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 0.95].map((pos, i) => {
              const x = 50 + pos * 500
              const y = 290 - (pos > 0.5 ? (1 - pos) * 120 : pos * 120)
              return (
                <g key={i}>
                  <line x1={x} y1={y + 10} x2={x} y2={400} stroke="#4A4A4A" strokeWidth="3" />
                  <rect x={x - 12} y={y + 35} width="24" height="6" fill="#A84318" rx="2" />
                  <rect x={x - 12} y={y + 70} width="24" height="6" fill="#A84318" rx="2" />
                </g>
              )
            })}

            {/* Left Brickwork Building */}
            <rect x="0" y="240" width="80" height="160" fill="#EFE5D8" />
            <rect x="15" y="270" width="22" height="36" fill="#992C1D" rx="2" />
            <rect x="45" y="270" width="22" height="36" fill="#992C1D" rx="2" />
            <rect x="15" y="330" width="22" height="50" fill="#992C1D" rx="2" />
            <rect x="45" y="330" width="22" height="50" fill="#992C1D" rx="2" />
          </svg>
        </div>

        {/* Article Headline */}
        <div>
          <div style={{ fontSize: 11, fontFamily: '-apple-system, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, opacity: 0.7 }}>
            03.06.2021
          </div>
          <h2 style={{ fontSize: 36, lineHeight: 1.15, fontWeight: 400, margin: '0 0 16px' }}>
            Beti–Jai: a beautiful historical fronton in the centre of the Chamberí district
          </h2>
          <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85, fontFamily: '-apple-system, sans-serif' }}>
            Madrid hides extraordinary historical gems. Beti-Jai is a neo-Mudejar style pelota court inaugurated in 1894, featuring intricate cast-iron cantilever balconies and elliptical tiers.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE 2: Quanta Magazine (EXACT MATCH TO IMAGE 2)
// ─────────────────────────────────────────────────────────────────────────────

function QuantaMagazineView({ isReaderMode }: { isReaderMode: boolean }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100%', padding: '24px 48px 80px', color: '#1D1D1F', maxWidth: 900, margin: '0 auto' }}>
      {/* Quanta Header */}
      {!isReaderMode && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E5EA', paddingBottom: 14, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>⚛️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Quanta Magazine
              </div>
              <div style={{ fontSize: 10, color: '#8E8E93' }}>Illuminating Science</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: '#636366' }}>
            <span>💬 2</span>
            <span>🔖</span>
            <span>↗ SHARE</span>
          </div>
        </div>
      )}

      {/* Category Accent Line (Image 2 detail) */}
      <div style={{ width: '100%', height: 3, backgroundColor: '#E5E5EA', marginBottom: 20 }}>
        <div style={{ width: 140, height: 3, backgroundColor: '#FF6B00' }} />
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
        Glial Brain Cells, Long in Neurons’ Shadow, Reveal Hidden Powers
      </h1>

      <h2 style={{ fontSize: 20, fontWeight: 600, margin: '24px 0 12px' }}>
        More Than Just ‘Glue’
      </h2>

      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#3A3A3C', marginBottom: 16 }}>
        Glia take many forms to perform their specialized functions: Some are sheathlike, while others are spindly, bushy or star-shaped. Many tangle around neurons and form a network so dense that individual cells are hard to distinguish.
      </p>

      {/* Gold Highlighted Quote (Exact Match to Image 2!) */}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.7,
          color: '#1D1D1F',
          backgroundColor: '#FFD79E',
          padding: '8px 12px',
          borderRadius: 4,
          marginBottom: 20,
        }}
      >
        To some early observers, they didn&apos;t even look like cells — they were considered a supportive matrix within the skull. This prompted the 19th-century researcher Rudolph Virchow to dub this non-neuronal material &ldquo;neuroglia,&rdquo; drawing on the Greek word for glue.
      </p>

      {/* High-res colorful microscopy visualization (Matching Image 2) */}
      <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <svg viewBox="0 0 800 360" width="100%" height="300" style={{ display: 'block', backgroundColor: '#020317' }}>
          <defs>
            <radialGradient id="microGlow1" cx="35%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0033CC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020317" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="microGlow2" cx="70%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#0044BB" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#020317" stopOpacity="1" />
            </radialGradient>
          </defs>

          <rect width="800" height="360" fill="#020317" />
          <circle cx="280" cy="180" r="180" fill="url(#microGlow1)" />
          <circle cx="560" cy="160" r="200" fill="url(#microGlow2)" />

          {/* Red Neuron Network Filaments */}
          <path d="M 120,40 Q 200,120 280,180 T 440,240 Q 600,180 720,80" stroke="#FF1744" strokeWidth="5" fill="none" opacity="0.9" />
          <path d="M 280,180 Q 240,290 180,340" stroke="#FF1744" strokeWidth="4" fill="none" opacity="0.85" />
          <path d="M 280,180 Q 380,120 520,160 T 680,300" stroke="#FF1744" strokeWidth="4.5" fill="none" opacity="0.9" />
          <path d="M 60,180 Q 180,200 280,180" stroke="#FF5252" strokeWidth="3" fill="none" opacity="0.75" />
          <path d="M 520,160 Q 560,70 660,40" stroke="#FF1744" strokeWidth="3.5" fill="none" opacity="0.85" />

          {/* Green Oligodendrocytes Branching Webs */}
          <path d="M 180,140 Q 220,170 260,150 T 320,190 Q 360,140 410,170" stroke="#00E676" strokeWidth="3" fill="none" opacity="0.95" />
          <path d="M 450,220 Q 480,260 540,240 T 620,270" stroke="#00E676" strokeWidth="2.8" fill="none" opacity="0.9" />
          <path d="M 380,110 Q 430,90 480,120 T 560,130" stroke="#00E676" strokeWidth="3" fill="none" opacity="0.9" />
          <path d="M 150,260 Q 200,240 250,270" stroke="#69F0AE" strokeWidth="2.5" fill="none" opacity="0.8" />
          <path d="M 640,160 Q 700,200 760,180" stroke="#00E676" strokeWidth="2.5" fill="none" opacity="0.8" />

          {/* Cell Soma Nodes */}
          <circle cx="280" cy="180" r="14" fill="#FF1744" opacity="0.9" />
          <circle cx="520" cy="160" r="16" fill="#FF1744" opacity="0.9" />
          <circle cx="350" cy="160" r="8" fill="#00E676" opacity="0.95" />
          <circle cx="480" cy="230" r="9" fill="#00E676" opacity="0.95" />
        </svg>
      </div>

      <div style={{ fontSize: 11, color: '#8E8E93', borderBottom: '1px solid #E5E5EA', paddingBottom: 16, marginBottom: 20 }}>
        Confocal microscopy reveals astrocytes (red) intertwined with oligodendrocytes (green). — Jonathan Cohen/NIH
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#3A3A3C' }}>
        Today, neuroscientists know that glia are equal partners to neurons: communicating through chemical waves, regulating synaptic plasticity, and guarding the blood-brain barrier.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE 3: Architecture Outlook (EXACT MATCH TO IMAGE 1)
// ─────────────────────────────────────────────────────────────────────────────

function ArchitectureOutlookView({ onOpenPasswords }: { onOpenPasswords: () => void }) {
  return (
    <div style={{ backgroundColor: '#0D0D0D', minHeight: '100%', color: '#F5F5F7', padding: '24px 44px 80px' }}>
      {/* Top Firm Navigation (Image 1 background) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 16, marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFD60A', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
            arc
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em' }}>ARCHITECTURE OUTLOOK</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.05em' }}>
          <span style={{ cursor: 'pointer', borderBottom: '1px solid #fff' }}>ABOUT OUR FIRM</span>
          <button
            onClick={onOpenPasswords}
            style={{
              backgroundColor: '#FFD60A',
              color: '#000000',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            CLIENT LOGIN
          </button>
        </div>
      </div>

      {/* Hero Typography & Blueprint (Matching Image 1 large 'STRUCTURE') */}
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ fontSize: 72, fontWeight: 300, letterSpacing: '-0.04em', margin: '0 0 16px', lineHeight: 1 }}>
          STRUCTURE
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 640, lineHeight: 1.5, marginBottom: 40 }}>
          A cross-disciplinary architectural studio based in Zurich and Madrid. We engineer structural honesty, tectonic precision, and light.
        </p>

        {/* Project Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ backgroundColor: '#1A1A1A', borderRadius: 8, padding: 20, border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <div style={{ height: 160, backgroundColor: '#262626', borderRadius: 6, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12 }}>
              Hyperbolic Timber Canopy · Basel 2025
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>The Timber Vault</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              42-meter post-tensioned laminated spruce arches creating a column-free auditorium.
            </p>
          </div>

          <div style={{ backgroundColor: '#1A1A1A', borderRadius: 8, padding: 20, border: '0.5px solid rgba(255,255,255,0.1)' }}>
            <div style={{ height: 160, backgroundColor: '#262626', borderRadius: 6, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12 }}>
              Cantilever Pavilion · Chamberí 2024
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>Cast-Iron Rebirth</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              Historical fronton restoration integrating modern acoustic baffles and seismic bracing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE 4: Another Escape (TAB 2 FROM IMAGE 3)
// ─────────────────────────────────────────────────────────────────────────────

function AnotherEscapeView() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100%', color: '#2B2B2B', padding: '32px 48px 80px', fontFamily: 'serif' }}>
      <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontFamily: '-apple-system, sans-serif', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7A7A7A', marginBottom: 12 }}>
          Vol. 14 — The Wilderness Issue
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 20px' }}>
          Another Escape
        </h1>
        <p style={{ fontSize: 16, fontStyle: 'italic', color: '#555', marginBottom: 40 }}>
          Inspired by nature, outdoor exploration, and creative stewardship.
        </p>

        <div style={{ height: 320, backgroundColor: '#2D3A2F', borderRadius: 8, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, letterSpacing: '0.04em' }}>
          🌲 Deep Pine Forest &amp; Coastal Fjords · Norway Expedition
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE 5: MoCAN (TAB 3 FROM IMAGE 3)
// ─────────────────────────────────────────────────────────────────────────────

function MoCANView() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100%', color: '#000000', padding: '32px 48px 80px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid #000', paddingBottom: 16, marginBottom: 32 }}>
          <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>
            MoCAN
          </h1>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>
            MUSEUM OF CONTEMPORARY ART
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
          <div style={{ height: 260, backgroundColor: '#E5E5EA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>
            Retrospective: Brutalist Forms &amp; Kinetic Light (1970–2026)
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#007AFF', marginBottom: 6 }}>NOW SHOWING</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px' }}>Kinetic Resonance</h2>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#636366' }}>
              Explore how architectural soundscapes and monumental steel installations reshape modern spatial perception.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE 6: Wanderlust Creamery (TAB 4 FROM IMAGE 3)
// ─────────────────────────────────────────────────────────────────────────────

function WanderlustCreameryView() {
  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100%', color: '#332724', padding: '32px 48px 80px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px', color: '#E06D53' }}>
          Wanderlust Creamery
        </h1>
        <p style={{ fontSize: 13, color: '#8C7A75', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 36 }}>
          Destination-Inspired Artisanal Ice Creams
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { name: 'Ube Malted Crunch', region: 'Manila, Philippines', color: '#8A5BA7' },
            { name: 'Abuelita Malted Milk', region: 'Mexico City, Mexico', color: '#A0634B' },
            { name: 'Sticky Rice & Mango', region: 'Bangkok, Thailand', color: '#F1A93B' },
          ].map((flavor) => (
            <div key={flavor.name} style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '0.5px solid rgba(0,0,0,0.08)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: flavor.color, margin: '0 auto 14px' }} />
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{flavor.name}</div>
              <div style={{ fontSize: 11, color: '#8E8E93' }}>{flavor.region}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE 7: Modern Stationery (TAB 5 FROM IMAGE 3)
// ─────────────────────────────────────────────────────────────────────────────

function ModernStationeryView() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100%', color: '#1D1D1F', padding: '32px 48px 80px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Modern Stationery
          </h1>
          <p style={{ fontSize: 12, color: '#8E8E93', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Curated Tools for Thought &amp; Precision Writing
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { name: 'Solid Brass Architect Ruler', price: '$28', desc: 'Precision laser-etched metric & imperial gradations.' },
            { name: 'Midori MD Cotton Notebook', price: '$18', desc: 'Japanese archival paper formulated for fountain pens.' },
            { name: 'Rotring 600 Mechanical Pencil', price: '$34', desc: 'All-metal ergonomic drafting instrument.' },
          ].map((item) => (
            <div key={item.name} style={{ border: '0.5px solid #E5E5EA', borderRadius: 8, padding: 18 }}>
              <div style={{ height: 120, backgroundColor: '#F8F8F9', borderRadius: 6, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                ✒️
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#007AFF' }}>{item.price}</span>
              </div>
              <p style={{ fontSize: 11, color: '#636366', lineHeight: 1.4, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE 8: Engineering Blog
// ─────────────────────────────────────────────────────────────────────────────

function EngineeringBlogView() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100%', padding: '36px 64px 80px', color: '#1D1D1F', maxWidth: 840, margin: '0 auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#007AFF', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
        Systems &amp; Architecture
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.03em' }}>
        Building Production PR Review Agents at Scale
      </h1>
      <p style={{ fontSize: 14, color: '#8E8E93', marginBottom: 28 }}>
        September 2026 · 12 min read · Yamin
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: '#3A3A3C', marginBottom: 20 }}>
        Autonomous pull request reviewers must balance precision with velocity. Here is how we orchestrated multi-agent LangGraph pipelines to review code with human-level accuracy.
      </p>
    </div>
  )
}
