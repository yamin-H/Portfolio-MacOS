import { create } from 'zustand'
import { soundEngine } from '@/lib/sound/soundEngine'

export interface WindowData {
  id: string
  title: string
  isOpen: boolean
  isMinimized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

export interface NotificationItem {
  id: string
  app: 'Calendar' | 'GitHub' | 'Messages' | 'Reminders' | 'Safari'
  title: string
  subtitle?: string
  body: string
  timeAgo: string
  actionLabel?: string
  actionPayload?: string
  avatar?: string
}

export type AccentColorName = 'multicolor' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'graphite'
export type AppearanceMode = 'auto' | 'light' | 'dark'
export type LiquidGlassLook = 'clear' | 'tinted'
export type IconWidgetStyle = 'default' | 'dark' | 'clear' | 'tinted'

export const SETTINGS_STORAGE_KEY = 'macos_portfolio_settings_v3'

export interface PersistedSettings {
  appearanceMode: AppearanceMode
  accentColor: AccentColorName
  highlightColor: string
  liquidGlassLook: LiquidGlassLook
  iconWidgetStyle: IconWidgetStyle
  folderColor: string
  wallpaperUrl: string
  dockSize: number
  dockMagnification: boolean
  dockPosition: 'bottom' | 'left' | 'right'
  dockAutoHide: boolean
  isStageManager: boolean
  isWifiEnabled: boolean
  wifiSsid: string
  isBluetoothEnabled: boolean
  isSoundEnabled: boolean
  systemVolume: number
  systemBrightness: number
  isTrueTone: boolean
  isNightShift: boolean
  isFocusMode: boolean
  airDropMode: 'off' | 'contacts' | 'everyone'
}

export const ACCENT_COLOR_MAP: Record<AccentColorName, { hex: string; subtle: string; label: string }> = {
  multicolor: { hex: '#007AFF', subtle: 'rgba(0, 122, 255, 0.15)', label: 'Multicolor' },
  blue:       { hex: '#007AFF', subtle: 'rgba(0, 122, 255, 0.15)', label: 'Blue' },
  purple:     { hex: '#AF52DE', subtle: 'rgba(175, 82, 222, 0.15)', label: 'Purple' },
  pink:       { hex: '#FF2D55', subtle: 'rgba(255, 45, 85, 0.15)', label: 'Pink' },
  red:        { hex: '#FF3B30', subtle: 'rgba(255, 59, 48, 0.15)', label: 'Red' },
  orange:     { hex: '#FF9500', subtle: 'rgba(255, 149, 0, 0.15)', label: 'Orange' },
  yellow:     { hex: '#FFCC00', subtle: 'rgba(255, 204, 0, 0.15)', label: 'Yellow' },
  green:      { hex: '#34C759', subtle: 'rgba(52, 199, 89, 0.15)', label: 'Green' },
  graphite:   { hex: '#8E8E93', subtle: 'rgba(142, 142, 147, 0.15)', label: 'Graphite' },
}

export const HIGHLIGHT_COLOR_MAP: Record<string, string> = {
  automatic: 'rgba(0, 122, 255, 0.28)',
  blue: 'rgba(0, 122, 255, 0.28)',
  purple: 'rgba(175, 82, 222, 0.28)',
  pink: 'rgba(255, 45, 85, 0.28)',
  red: 'rgba(255, 59, 48, 0.28)',
  orange: 'rgba(255, 149, 0, 0.28)',
  yellow: 'rgba(255, 204, 0, 0.28)',
  green: 'rgba(52, 199, 89, 0.28)',
  graphite: 'rgba(142, 142, 147, 0.28)',
}

export function loadSettingsFromStorage(): Partial<PersistedSettings> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load settings from localStorage', e)
  }
  return {}
}

export function saveSettingToStorage<K extends keyof PersistedSettings>(key: K, value: PersistedSettings[K]) {
  if (typeof window === 'undefined') return
  try {
    const existing = loadSettingsFromStorage()
    existing[key] = value
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(existing))
  } catch (e) {
    console.error('Failed to save setting to localStorage', e)
  }
}

export function applyDomTheme(
  appearance: AppearanceMode,
  accent: AccentColorName,
  highlight: string = 'automatic',
  liquidGlass: LiquidGlassLook = 'clear'
) {
  if (typeof document === 'undefined') return
  const isDark =
    appearance === 'dark' ||
    (appearance === 'auto' && typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const root = document.documentElement
  root.setAttribute('data-theme', isDark ? 'dark' : 'light')
  root.setAttribute('data-appearance', appearance)
  root.setAttribute('data-accent', accent)
  root.setAttribute('data-glass', liquidGlass)

  const accentInfo = ACCENT_COLOR_MAP[accent] || ACCENT_COLOR_MAP.blue
  root.style.setProperty('--mac-accent', accentInfo.hex)
  root.style.setProperty('--mac-accent-subtle', accentInfo.subtle)
  root.style.setProperty('--mac-highlight', HIGHLIGHT_COLOR_MAP[highlight] || accentInfo.subtle)

  if (liquidGlass === 'tinted') {
    root.style.setProperty('--mac-glass-blur', '56px')
    root.style.setProperty('--mac-glass-bg', isDark ? 'rgba(30, 30, 36, 0.88)' : 'rgba(240, 240, 246, 0.88)')
  } else {
    root.style.setProperty('--mac-glass-blur', '40px')
    root.style.setProperty('--mac-glass-bg', isDark ? 'rgba(24, 26, 32, 0.72)' : 'rgba(255, 255, 255, 0.72)')
  }
}


export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-cal',
    app: 'Calendar',
    title: 'Staff Engineering Strategy Sync',
    subtitle: 'Calendar · In 15 minutes',
    body: 'Zoom room: https://zoom.us/j/9418291 · Portfolio OS Architecture & Vision Review',
    timeAgo: '15m ago',
    actionLabel: 'Join Meeting',
  },
  {
    id: 'notif-gh',
    app: 'GitHub',
    title: 'PR #7074 Merged into master',
    subtitle: 'remotion-dev/remotion',
    body: 'feat: preserveSilence option in renderMediaOnWeb() & playbackRate test coverage.',
    timeAgo: '42m ago',
    actionLabel: 'View PR',
  },
  {
    id: 'notif-msg',
    app: 'Messages',
    title: 'Tim Cook',
    subtitle: 'Messages',
    body: 'The Sequoia Notes and Safari UI fidelity is extraordinary. Let’s connect on next steps!',
    timeAgo: '1h ago',
    actionLabel: 'Reply',
  },
  {
    id: 'notif-rem',
    app: 'Reminders',
    title: 'Portfolio OS 2.0 Release Checklist',
    subtitle: 'Reminders',
    body: 'Verify Control Center & Widgets, test audio synthesizer, review lighthouse scores.',
    timeAgo: '2h ago',
    actionLabel: 'Complete',
  },
]

interface WindowStore {
  windows: WindowData[]
  activeWindowId: string | null
  nextZIndex: number
  openWindow: (window: Omit<WindowData, 'zIndex'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  commitPosition: (id: string, position: { x: number; y: number }) => void
  commitSize: (id: string, size: { width: number; height: number }) => void

  // ── Sound Controls ─────────────────────────────────────────────────────────
  isSoundEnabled: boolean
  toggleSound: () => boolean

  // ── Assistant / Spotlight ──────────────────────────────────────────────────
  isAssistantOpen: boolean
  assistantMode: 'search' | 'chat' | 'jd'
  assistantInitialPrompt: string | null
  terminalPendingCmd: string | null
  finderPendingFile: string | null
  clearTerminalPendingCmd: () => void
  clearFinderPendingFile: () => void
  toggleAssistant: () => void
  setAssistantMode: (mode: 'search' | 'chat' | 'jd') => void
  openAssistant: (initialPrompt?: string, mode?: 'search' | 'chat' | 'jd') => void
  closeAssistant: () => void
  openFinderFile: (filePath: string) => void
  openTerminalCmd: (cmd?: string) => void
  openApp: (appId: string) => void

  // ── Notification Center ────────────────────────────────────────────────────
  isNotificationCenterOpen: boolean
  toggleNotificationCenter: () => void
  openNotificationCenter: () => void
  closeNotificationCenter: () => void
  notifications: NotificationItem[]
  dismissNotification: (id: string) => void
  clearAllNotifications: () => void

  // ── Control Center ─────────────────────────────────────────────────────────
  isControlCenterOpen: boolean
  toggleControlCenter: () => void
  openControlCenter: () => void
  closeControlCenter: () => void

  // ── System Hardware & Quick Toggles ────────────────────────────────────────
  systemBrightness: number
  setSystemBrightness: (val: number) => void
  systemVolume: number
  setSystemVolume: (val: number) => void
  isWifiEnabled: boolean
  toggleWifi: () => void
  wifiSsid: string
  setWifiSsid: (ssid: string) => void
  isBluetoothEnabled: boolean
  toggleBluetooth: () => void
  airDropMode: 'off' | 'contacts' | 'everyone'
  setAirDropMode: (mode: 'off' | 'contacts' | 'everyone') => void
  isFocusMode: boolean
  toggleFocusMode: () => void
  isStageManager: boolean
  toggleStageManager: () => void
  isScreenMirroring: boolean
  toggleScreenMirroring: () => void
  isTrueTone: boolean
  toggleTrueTone: () => void
  isNightShift: boolean
  toggleNightShift: () => void

  // ── Appearance & Themes (macOS System Settings) ───────────────────────────
  appearanceMode: 'auto' | 'light' | 'dark'
  setAppearanceMode: (mode: 'auto' | 'light' | 'dark') => void
  accentColor: 'multicolor' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'graphite'
  setAccentColor: (color: 'multicolor' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'graphite') => void
  highlightColor: string
  setHighlightColor: (color: string) => void
  liquidGlassLook: 'clear' | 'tinted'
  setLiquidGlassLook: (look: 'clear' | 'tinted') => void
  iconWidgetStyle: 'default' | 'dark' | 'clear' | 'tinted'
  setIconWidgetStyle: (style: 'default' | 'dark' | 'clear' | 'tinted') => void
  folderColor: string
  setFolderColor: (color: string) => void

  // ── Wallpaper & Desktop ────────────────────────────────────────────────────
  wallpaperUrl: string
  setWallpaperUrl: (url: string) => void

  // ── Dock Customization ─────────────────────────────────────────────────────
  dockSize: number
  setDockSize: (size: number) => void
  dockMagnification: boolean
  toggleDockMagnification: () => void
  dockPosition: 'bottom' | 'left' | 'right'
  setDockPosition: (pos: 'bottom' | 'left' | 'right') => void
  dockAutoHide: boolean
  toggleDockAutoHide: () => void

  // ── Mission Control & Spaces ───────────────────────────────────────────────
  isMissionControlOpen: boolean
  toggleMissionControl: () => void
  openMissionControl: () => void
  closeMissionControl: () => void
  spaces: Array<{ id: string; name: string }>
  activeSpaceId: string
  setActiveSpaceId: (id: string) => void
  addSpace: () => void

  // ── Window Snapping & Tiling ───────────────────────────────────────────────
  snapPreview: {
    x: number
    y: number
    width: number
    height: number
    type: 'left' | 'right' | 'top' | 'maximize' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  } | null
  setSnapPreview: (
    preview: {
      x: number
      y: number
      width: number
      height: number
      type: 'left' | 'right' | 'top' | 'maximize' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
    } | null
  ) => void
  tileWindow: (id: string, type: 'left' | 'right' | 'top' | 'maximize' | 'restore' | 'center') => void

  // ── Stage Manager Multitasking ─────────────────────────────────────────────
  activateStage: (windowId: string) => void
  openMultitaskingShowcase: () => void
  closeAllWindows: () => void

  // ── Fast App Switcher (⌘Tab) ───────────────────────────────────────────────
  isAppSwitcherOpen: boolean
  appSwitcherIndex: number
  openAppSwitcher: () => void
  closeAppSwitcher: () => void
  cycleAppSwitcher: (direction?: 1 | -1) => void

  // ── Settings Hydration & Persistence ──────────────────────────────────────
  hydrateSettings: () => void
}

export const useWindowStore = create<WindowStore>((set, get) => ({
    windows: [],
    activeWindowId: null,
    nextZIndex: 100,

    isSoundEnabled: soundEngine.isSoundOn(),
    toggleSound: () => {
        const next = soundEngine.toggleSound()
        saveSettingToStorage('isSoundEnabled', next)
        set({ isSoundEnabled: next })
        return next
    },

    // ── Settings Hydration & Persistence ──────────────────────────────────────
    hydrateSettings: () => {
        const persisted = loadSettingsFromStorage()
        set((state) => ({
            appearanceMode: persisted.appearanceMode ?? state.appearanceMode,
            accentColor: persisted.accentColor ?? state.accentColor,
            highlightColor: persisted.highlightColor ?? state.highlightColor,
            liquidGlassLook: persisted.liquidGlassLook ?? state.liquidGlassLook,
            iconWidgetStyle: persisted.iconWidgetStyle ?? state.iconWidgetStyle,
            folderColor: persisted.folderColor ?? state.folderColor,
            wallpaperUrl: persisted.wallpaperUrl ?? state.wallpaperUrl,
            dockSize: persisted.dockSize ?? state.dockSize,
            dockMagnification: persisted.dockMagnification ?? state.dockMagnification,
            dockPosition: persisted.dockPosition ?? state.dockPosition,
            dockAutoHide: persisted.dockAutoHide ?? state.dockAutoHide,
            isStageManager: persisted.isStageManager ?? state.isStageManager,
            isWifiEnabled: persisted.isWifiEnabled ?? state.isWifiEnabled,
            wifiSsid: persisted.wifiSsid ?? state.wifiSsid,
            isBluetoothEnabled: persisted.isBluetoothEnabled ?? state.isBluetoothEnabled,
            isSoundEnabled: persisted.isSoundEnabled ?? state.isSoundEnabled,
            systemVolume: persisted.systemVolume ?? state.systemVolume,
            systemBrightness: persisted.systemBrightness ?? state.systemBrightness,
            isTrueTone: persisted.isTrueTone ?? state.isTrueTone,
            isNightShift: persisted.isNightShift ?? state.isNightShift,
            isFocusMode: persisted.isFocusMode ?? state.isFocusMode,
            airDropMode: persisted.airDropMode ?? state.airDropMode,
        }))
        const current = get()
        applyDomTheme(current.appearanceMode, current.accentColor, current.highlightColor, current.liquidGlassLook)
        if (typeof soundEngine !== 'undefined') {
            soundEngine.setVolume(current.systemVolume)
        }
    },

    isAssistantOpen: false,
    assistantMode: 'chat',
    assistantInitialPrompt: null,
    terminalPendingCmd: null,
    finderPendingFile: null,

    isNotificationCenterOpen: false,
    isControlCenterOpen: false,

    // ── Notifications ──────────────────────────────────────────────────────────
    notifications: SEED_NOTIFICATIONS,
    dismissNotification: (id: string) => {
        soundEngine.play('action')
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }))
    },
    clearAllNotifications: () => {
        soundEngine.play('action')
        set({ notifications: [] })
    },

    // ── Control Center ─────────────────────────────────────────────────────────
    toggleControlCenter: () => {
        const next = !get().isControlCenterOpen
        soundEngine.play(next ? 'pop' : 'close')
        set({
            isControlCenterOpen: next,
            isNotificationCenterOpen: false,
            isAssistantOpen: false,
        })
    },
    openControlCenter: () => {
        soundEngine.play('pop')
        set({
            isControlCenterOpen: true,
            isNotificationCenterOpen: false,
            isAssistantOpen: false,
        })
    },
    closeControlCenter: () => {
        soundEngine.play('close')
        set({ isControlCenterOpen: false })
    },

    // ── System Hardware & Quick Toggles ────────────────────────────────────────
    systemBrightness: 1.0,
    setSystemBrightness: (val: number) => {
        const clamped = Math.max(0.35, Math.min(1.0, val))
        saveSettingToStorage('systemBrightness', clamped)
        set({ systemBrightness: clamped })
    },
    systemVolume: 0.85,
    setSystemVolume: (val: number) => {
        const clamped = Math.max(0, Math.min(1.0, val))
        saveSettingToStorage('systemVolume', clamped)
        soundEngine.setVolume(clamped)
        set({ systemVolume: clamped })
    },
    isWifiEnabled: true,
    toggleWifi: () => {
        soundEngine.play('click')
        const next = !get().isWifiEnabled
        saveSettingToStorage('isWifiEnabled', next)
        set({ isWifiEnabled: next })
    },
    wifiSsid: 'Home-5G-Ultra',
    setWifiSsid: (ssid: string) => {
        saveSettingToStorage('wifiSsid', ssid)
        set({ wifiSsid: ssid })
    },
    isBluetoothEnabled: true,
    toggleBluetooth: () => {
        soundEngine.play('click')
        const next = !get().isBluetoothEnabled
        saveSettingToStorage('isBluetoothEnabled', next)
        set({ isBluetoothEnabled: next })
    },
    airDropMode: 'contacts',
    setAirDropMode: (mode: 'off' | 'contacts' | 'everyone') => {
        soundEngine.play('click')
        saveSettingToStorage('airDropMode', mode)
        set({ airDropMode: mode })
    },
    isFocusMode: false,
    toggleFocusMode: () => {
        soundEngine.play('click')
        const next = !get().isFocusMode
        saveSettingToStorage('isFocusMode', next)
        set({ isFocusMode: next })
    },
    isStageManager: false,
    toggleStageManager: () => {
        soundEngine.play('click')
        const next = !get().isStageManager
        saveSettingToStorage('isStageManager', next)
        set({ isStageManager: next })
    },
    isScreenMirroring: false,
    toggleScreenMirroring: () => {
        soundEngine.play('click')
        set((state) => ({ isScreenMirroring: !state.isScreenMirroring }))
    },
    isTrueTone: true,
    toggleTrueTone: () => {
        soundEngine.play('click')
        const next = !get().isTrueTone
        saveSettingToStorage('isTrueTone', next)
        set({ isTrueTone: next })
    },
    isNightShift: false,
    toggleNightShift: () => {
        soundEngine.play('click')
        const next = !get().isNightShift
        saveSettingToStorage('isNightShift', next)
        set({ isNightShift: next })
    },

    // ── Appearance & Themes (macOS System Settings) ───────────────────────────
    appearanceMode: 'light',
    setAppearanceMode: (mode) => {
        soundEngine.play('click')
        saveSettingToStorage('appearanceMode', mode)
        set({ appearanceMode: mode })
        applyDomTheme(mode, get().accentColor, get().highlightColor, get().liquidGlassLook)
    },
    accentColor: 'multicolor',
    setAccentColor: (color) => {
        soundEngine.play('click')
        saveSettingToStorage('accentColor', color)
        set({ accentColor: color })
        applyDomTheme(get().appearanceMode, color, get().highlightColor, get().liquidGlassLook)
    },
    highlightColor: 'automatic',
    setHighlightColor: (color) => {
        soundEngine.play('click')
        saveSettingToStorage('highlightColor', color)
        set({ highlightColor: color })
        applyDomTheme(get().appearanceMode, get().accentColor, color, get().liquidGlassLook)
    },
    liquidGlassLook: 'clear',
    setLiquidGlassLook: (look) => {
        soundEngine.play('click')
        saveSettingToStorage('liquidGlassLook', look)
        set({ liquidGlassLook: look })
        applyDomTheme(get().appearanceMode, get().accentColor, get().highlightColor, look)
    },
    iconWidgetStyle: 'default',
    setIconWidgetStyle: (style) => {
        soundEngine.play('click')
        saveSettingToStorage('iconWidgetStyle', style)
        set({ iconWidgetStyle: style })
    },
    folderColor: 'automatic',
    setFolderColor: (color) => {
        soundEngine.play('click')
        saveSettingToStorage('folderColor', color)
        set({ folderColor: color })
    },

    // ── Wallpaper & Desktop ────────────────────────────────────────────────────
    wallpaperUrl: '/macos.jpg',
    setWallpaperUrl: (url) => {
        soundEngine.play('pop')
        saveSettingToStorage('wallpaperUrl', url)
        set({ wallpaperUrl: url })
    },

    // ── Dock Customization ─────────────────────────────────────────────────────
    dockSize: 52,
    setDockSize: (size) => {
        saveSettingToStorage('dockSize', size)
        set({ dockSize: size })
    },
    dockMagnification: true,
    toggleDockMagnification: () => {
        soundEngine.play('click')
        const next = !get().dockMagnification
        saveSettingToStorage('dockMagnification', next)
        set({ dockMagnification: next })
    },
    dockPosition: 'bottom',
    setDockPosition: (pos) => {
        soundEngine.play('click')
        saveSettingToStorage('dockPosition', pos)
        set({ dockPosition: pos })
    },
    dockAutoHide: false,
    toggleDockAutoHide: () => {
        soundEngine.play('click')
        const next = !get().dockAutoHide
        saveSettingToStorage('dockAutoHide', next)
        set({ dockAutoHide: next })
    },

    // ── Mission Control & Spaces ───────────────────────────────────────────────
    isMissionControlOpen: false,
    toggleMissionControl: () => {
        const next = !get().isMissionControlOpen
        soundEngine.play(next ? 'pop' : 'close')
        set({
            isMissionControlOpen: next,
            isControlCenterOpen: false,
            isNotificationCenterOpen: false,
            isAssistantOpen: false,
        })
    },
    openMissionControl: () => {
        soundEngine.play('pop')
        set({
            isMissionControlOpen: true,
            isControlCenterOpen: false,
            isNotificationCenterOpen: false,
            isAssistantOpen: false,
        })
    },
    closeMissionControl: () => {
        soundEngine.play('close')
        set({ isMissionControlOpen: false })
    },
    spaces: [
        { id: 'space-1', name: 'Desktop 1' },
        { id: 'space-2', name: 'Desktop 2' },
    ],
    activeSpaceId: 'space-1',
    setActiveSpaceId: (id) => {
        soundEngine.play('click')
        set({ activeSpaceId: id })
    },
    addSpace: () => {
        soundEngine.play('pop')
        const current = get().spaces
        const nextNum = current.length + 1
        const newSpace = { id: `space-${nextNum}`, name: `Desktop ${nextNum}` }
        set({ spaces: [...current, newSpace], activeSpaceId: newSpace.id })
    },

    // ── Window Snapping & Tiling ───────────────────────────────────────────────
    snapPreview: null,
    setSnapPreview: (preview) => set({ snapPreview: preview }),

    tileWindow: (id, type) => {
        soundEngine.play('action')
        const { windows, commitPosition, commitSize, restoreWindow, focusWindow } = get()
        const targetWin = windows.find((w) => w.id === id)
        if (!targetWin) return

        restoreWindow(id)
        focusWindow(id)

        const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440
        const screenH = typeof window !== 'undefined' ? window.innerHeight : 900
        const topBarH = 28
        const dockH = 72
        const usableH = screenH - topBarH - dockH

        let newX = targetWin.position.x
        let newY = targetWin.position.y
        let newW = targetWin.size.width
        let newH = targetWin.size.height

        if (type === 'left') {
            newX = 8
            newY = topBarH + 6
            newW = Math.round(screenW / 2 - 12)
            newH = usableH - 12
        } else if (type === 'right') {
            newX = Math.round(screenW / 2 + 4)
            newY = topBarH + 6
            newW = Math.round(screenW / 2 - 12)
            newH = usableH - 12
        } else if (type === 'top' || type === 'maximize') {
            newX = 8
            newY = topBarH + 6
            newW = screenW - 16
            newH = usableH - 12
        } else if (type === 'center') {
            newW = Math.min(1000, Math.round(screenW * 0.7))
            newH = Math.min(640, Math.round(usableH * 0.8))
            newX = Math.round((screenW - newW) / 2)
            newY = Math.round(topBarH + (usableH - newH) / 2)
        }

        commitPosition(id, { x: newX, y: newY })
        commitSize(id, { width: newW, height: newH })
    },

    // ── Stage Manager Multitasking ─────────────────────────────────────────────
    activateStage: (windowId) => {
        soundEngine.play('pop')
        const { restoreWindow, focusWindow } = get()
        restoreWindow(windowId)
        focusWindow(windowId)
    },
    openMultitaskingShowcase: () => {
        soundEngine.play('pop')
        const showcaseWindows: WindowData[] = [
            { id: 'safari', title: 'Safari', isOpen: true, isMinimized: false, position: { x: 70, y: 50 }, size: { width: 920, height: 580 }, zIndex: 101 },
            { id: 'weather', title: 'Weather', isOpen: true, isMinimized: false, position: { x: 380, y: 70 }, size: { width: 880, height: 600 }, zIndex: 102 },
            { id: 'photos', title: 'Photos', isOpen: true, isMinimized: false, position: { x: 180, y: 110 }, size: { width: 900, height: 580 }, zIndex: 103 },
            { id: 'notes', title: 'Notes', isOpen: true, isMinimized: false, position: { x: 120, y: 160 }, size: { width: 840, height: 540 }, zIndex: 104 },
            { id: 'terminal', title: 'Terminal', isOpen: true, isMinimized: false, position: { x: 500, y: 190 }, size: { width: 700, height: 450 }, zIndex: 105 },
            { id: 'settings', title: 'System Settings', isOpen: true, isMinimized: false, position: { x: 260, y: 80 }, size: { width: 800, height: 540 }, zIndex: 106 },
            { id: 'finder', title: 'Finder', isOpen: true, isMinimized: false, position: { x: 140, y: 90 }, size: { width: 940, height: 600 }, zIndex: 107 },
            { id: 'calculator', title: 'Calculator', isOpen: true, isMinimized: false, position: { x: 860, y: 80 }, size: { width: 340, height: 500 }, zIndex: 108 },
        ]
        set({
            windows: showcaseWindows,
            activeWindowId: 'safari',
            nextZIndex: 109,
        })
    },
    closeAllWindows: () => {
        soundEngine.play('close')
        set({ windows: [], activeWindowId: null })
    },

    // ── Fast App Switcher (⌘Tab) ───────────────────────────────────────────────
    isAppSwitcherOpen: false,
    appSwitcherIndex: 0,
    openAppSwitcher: () => {
        soundEngine.play('click')
        set({ isAppSwitcherOpen: true, appSwitcherIndex: 0 })
    },
    closeAppSwitcher: () => {
        set({ isAppSwitcherOpen: false })
    },
    cycleAppSwitcher: (direction = 1) => {
        soundEngine.play('click')
        const openWins = get().windows.filter((w) => w.isOpen)
        if (openWins.length === 0) return
        const cur = get().appSwitcherIndex
        const nextIdx = (cur + direction + openWins.length) % openWins.length
        set({ appSwitcherIndex: nextIdx })
    },

    clearTerminalPendingCmd: () => set({ terminalPendingCmd: null }),
    clearFinderPendingFile: () => set({ finderPendingFile: null }),
    setAssistantMode: (mode) => set({ assistantMode: mode }),

    toggleAssistant: () => {
        const nextState = !get().isAssistantOpen
        soundEngine.play(nextState ? 'pop' : 'close')
        set(() => ({
            isAssistantOpen: nextState,
            assistantMode: 'chat',
            isNotificationCenterOpen: false,
            isControlCenterOpen: false,
        }))
    },

    openAssistant: (prompt, mode) => {
        soundEngine.play('pop')
        set({
            isAssistantOpen: true,
            assistantInitialPrompt: prompt || null,
            assistantMode: mode || 'chat',
            isNotificationCenterOpen: false,
            isControlCenterOpen: false,
        })
    },

    closeAssistant: () => {
        soundEngine.play('close')
        set({ isAssistantOpen: false, assistantInitialPrompt: null })
    },

    toggleNotificationCenter: () => {
        const nextState = !get().isNotificationCenterOpen
        soundEngine.play(nextState ? 'chime' : 'close')
        set(() => ({
            isNotificationCenterOpen: nextState,
            isAssistantOpen: false,
            isControlCenterOpen: false,
        }))
    },

    openNotificationCenter: () => {
        soundEngine.play('chime')
        set({ isNotificationCenterOpen: true, isAssistantOpen: false, isControlCenterOpen: false })
    },

    closeNotificationCenter: () => {
        soundEngine.play('close')
        set({ isNotificationCenterOpen: false })
    },

    openFinderFile: (filePath) => {
        const { openWindow, restoreWindow, focusWindow, windows } = get()
        set({ isAssistantOpen: false, isNotificationCenterOpen: false, finderPendingFile: filePath || null })
        const finderWin = windows.find((w) => w.id === 'finder' || w.id === 'files')
        if (finderWin) {
            if (finderWin.isMinimized) {
                restoreWindow(finderWin.id)
            } else {
                focusWindow(finderWin.id)
            }
        } else {
            openWindow({
                id: 'finder',
                title: 'Finder',
                isOpen: true,
                isMinimized: false,
                position: { x: 140, y: 70 },
                size: { width: 1040, height: 640 },
            })
        }
    },

    openTerminalCmd: (cmd) => {
        const { openWindow, restoreWindow, focusWindow, windows } = get()
        set({ isAssistantOpen: false, terminalPendingCmd: cmd || null })
        const termWin = windows.find((w) => w.id === 'terminal')
        if (termWin) {
            if (termWin.isMinimized) {
                restoreWindow(termWin.id)
            } else {
                focusWindow(termWin.id)
            }
        } else {
            openWindow({
                id: 'terminal',
                title: 'Terminal',
                isOpen: true,
                isMinimized: false,
                position: { x: 180, y: 100 },
                size: { width: 700, height: 450 },
            })
        }
    },

    openApp: (appId) => {
        const appConfigs: Record<string, { title: string; width: number; height: number }> = {
            calculator: { title: 'Calculator', width: 380, height: 540 },
            appstore: { title: 'App Store', width: 1040, height: 680 },
            files: { title: 'Files', width: 1040, height: 640 },
            finder: { title: 'Finder', width: 1040, height: 640 },
            notes: { title: 'Notes', width: 940, height: 600 },
            photos: { title: 'Photos', width: 940, height: 600 },
            safari: { title: 'Safari', width: 1020, height: 640 },
            settings: { title: 'System Settings', width: 840, height: 580 },
            terminal: { title: 'Terminal', width: 700, height: 450 },
            weather: { title: 'Weather', width: 880, height: 600 },
        }
        const cfg = appConfigs[appId] || {
            title: appId.charAt(0).toUpperCase() + appId.slice(1),
            width: 900,
            height: 600,
        }
        const existing = get().windows.find((w) => w.id === appId)
        if (!existing) {
            const offset = (get().windows.filter((w) => w.isOpen).length % 6) * 22
            const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440
            const screenH = typeof window !== 'undefined' ? window.innerHeight : 900
            const x = Math.max(30, Math.round((screenW - cfg.width) / 2 + offset))
            const y = Math.max(48, Math.round((screenH - cfg.height) / 2 - 28 + offset))

            get().openWindow({
                id: appId,
                title: cfg.title,
                isOpen: true,
                isMinimized: false,
                position: { x, y },
                size: { width: cfg.width, height: cfg.height },
            })
        } else if (existing.isMinimized) {
            get().restoreWindow(existing.id)
        } else {
            get().focusWindow(existing.id)
        }
    },

    openWindow: (win) => {
        soundEngine.play('pop')
        const { nextZIndex } = get()
        set((state) => ({
            windows: [...state.windows, { ...win, zIndex: nextZIndex }],
            activeWindowId: win.id,
            nextZIndex: nextZIndex + 1,
        }))
    },

    closeWindow: (id) => {
        soundEngine.play('close')
        set((state) => ({
            windows: state.windows.filter((w) => w.id !== id),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        }))
    },

    minimizeWindow: (id) => {
        soundEngine.play('minimize')
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, isMinimized: true } : w
            ),
        }))
    },

    restoreWindow: (id) => {
        soundEngine.play('pop')
        const { nextZIndex } = get()
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
            ),
            activeWindowId: id,
            nextZIndex: nextZIndex + 1,
        }))
    },

    focusWindow: (id) => {
        soundEngine.play('click')
        const { nextZIndex } = get()
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, zIndex: nextZIndex } : w
            ),
            activeWindowId: id,
            nextZIndex: nextZIndex + 1,
        }))
    },

    commitPosition: (id, position) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, position } : w
            ),
        })),

    commitSize: (id, size) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, size } : w
            ),
        })),
}));