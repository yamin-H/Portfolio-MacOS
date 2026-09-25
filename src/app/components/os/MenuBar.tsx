'use client'

import { useEffect, useState } from 'react'

// ─── Icons ────────────────────────────────────────────────────────────────────
// All icons sized to look correct inside a 28px menu bar.
// macOS menu bar icon spec: ~16px tall, proportional width.

function AppleLogo() {
    return (
        <svg width="17" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0 }}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
    )
}

function WifiIcon() {
    return (
        <svg width="19" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0 }}>
            <path d="M1 9l2 2c5-5 13-5 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
        </svg>
    )
}

function VolumeIcon({ muted = false }: { muted?: boolean }) {
    if (muted) {
        return (
            <svg width="19" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0, opacity: 0.55 }}>
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
        )
    }
    return (
        <svg width="19" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0 }}>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
    )
}

function BluetoothIcon() {
    return (
        <svg width="13" height="19" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0 }}>
            <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
        </svg>
    )
}

function ControlCenterIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
            {/* Top Slider Pill */}
            <rect x="2" y="4" width="20" height="6" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="7" cy="7" r="1.8" fill="currentColor" />
            {/* Bottom Slider Pill */}
            <rect x="2" y="14" width="20" height="6" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17" cy="17" r="1.8" fill="currentColor" />
        </svg>
    )
}

function MissionControlIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
            <rect x="2" y="3" width="9" height="7" rx="1.5" />
            <rect x="13" y="3" width="9" height="7" rx="1.5" />
            <rect x="7" y="14" width="10" height="7" rx="1.5" />
        </svg>
    )
}

function BatteryIcon({ level }: { level: number }) {
    const maxFill = 16
    const fillWidth = Math.max(1, Math.round(maxFill * level))
    const fillColor = level <= 0.2 ? '#ff3b30' : 'rgba(255,255,255,0.92)'
    return (
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none" style={{ display: 'block', flexShrink: 0 }}>
            {/* outer shell */}
            <rect x="0.5" y="0.5" width="24" height="13" rx="3"
                stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            {/* nub */}
            <rect x="25.5" y="4" width="2" height="6" rx="1"
                fill="rgba(255,255,255,0.4)" />
            {/* level fill */}
            <rect x="2" y="2.5" width={fillWidth} height="9" rx="1.5"
                fill={fillColor} />
        </svg>
    )
}

// ─── Base typography — applied to every item in the bar ───────────────────────
// Critical: WebkitFontSmoothing antialiased is what makes web fonts look
// like macOS. Without it, text looks thick and muddy on all browsers.

const baseText: React.CSSProperties = {
    fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    fontSize: '13px',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.92)',
    letterSpacing: '-0.01em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
} as React.CSSProperties

// ─── MenuItem (left-side app menu) ───────────────────────────────────────────

function MenuItem({
    children,
    bold = false,
    active = false,
    onClick,
}: {
    children: React.ReactNode
    bold?: boolean
    active?: boolean
    onClick?: () => void
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                ...baseText,
                fontWeight: bold ? 600 : 400,
                background: active || hovered ? 'rgba(255,255,255,0.18)' : 'transparent',
                border: 'none',
                padding: '0 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                height: '22px',
                outline: 'none',
                transition: 'background 0.08s ease',
            } as React.CSSProperties}
        >
            {children}
        </button>
    )
}

// ─── TrayItem (right-side system tray) ───────────────────────────────────────

function TrayItem({ children }: { children: React.ReactNode }) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                ...baseText,
                background: hovered ? 'rgba(255,255,255,0.12)' : 'transparent',
                padding: '0 6px',
                borderRadius: '4px',
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                height: '22px',
                gap: '5px',
                transition: 'background 0.08s ease',
            }}
        >
            {children}
        </div>
    )
}

// ─── Clock hook ───────────────────────────────────────────────────────────────

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function useMacClock() {
    const [display, setDisplay] = useState('')

    useEffect(() => {
        const tick = () => {
            const now   = new Date()
            const day   = DAYS[now.getDay()]
            const month = MONTHS[now.getMonth()]
            const date  = now.getDate()
            let hours   = now.getHours()
            const ampm  = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12 || 12
            const m     = String(now.getMinutes()).padStart(2, '0')
            // macOS format matching reference image: "Tue Apr 1 9:41 AM"
            setDisplay(`${day} ${month} ${date} ${hours}:${m} ${ampm}`)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    return display
}

// ─── Battery hook ─────────────────────────────────────────────────────────────

type BatteryManager = {
    level: number
    addEventListener: (event: string, cb: () => void) => void
}

function useBattery() {
    const [level, setLevel] = useState(1)

    useEffect(() => {
        if (!('getBattery' in navigator)) return

        ;(navigator as unknown as { getBattery: () => Promise<BatteryManager> })
            .getBattery()
            .then((battery) => {
                setLevel(battery.level)
                battery.addEventListener('levelchange', () => setLevel(battery.level))
            })
            .catch(() => { /* API unavailable — stay at 100% fallback */ })
    }, [])

    return level
}

// ─── Left menu items ──────────────────────────────────────────────────────────

const APP_MENU = ['File', 'Edit', 'View', 'Go', 'Window', 'Help']

import { useWindowStore } from '@/app/store/windowStore'

function AppleIntelligencePill({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title="Apple Intelligence / Yamin AI (⌘Space)"
            style={{
                border: 'none',
                outline: 'none',
                background: isOpen
                    ? 'rgba(0, 122, 255, 0.28)'
                    : hovered
                    ? 'rgba(255, 255, 255, 0.14)'
                    : 'rgba(255, 255, 255, 0.06)',
                borderWidth: '0.5px',
                borderStyle: 'solid',
                borderColor: isOpen
                    ? 'rgba(0, 122, 255, 0.5)'
                    : hovered
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                marginRight: '6px',
            }}
        >
            <div
                style={{
                    width: 13,
                    height: 13,
                    borderRadius: '50%',
                    background:
                        'conic-gradient(from 180deg at 50% 50%, #FF2D55 0deg, #FF9500 60deg, #34C759 150deg, #007AFF 240deg, #AF52DE 330deg, #FF2D55 360deg)',
                    boxShadow: isOpen || hovered ? '0 0 8px rgba(0, 122, 255, 0.8)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#1c1c20' }} />
            </div>
            <span
                style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    color: isOpen ? '#5ac8fa' : 'rgba(255, 255, 255, 0.92)',
                    letterSpacing: '-0.01em',
                }}
            >
                AI
            </span>
        </button>
    )
}

// ─── MenuBar ──────────────────────────────────────────────────────────────────

export default function MenuBar() {
    const clock        = useMacClock()
    const batteryLevel = useBattery()
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const {
        isAssistantOpen,
        toggleAssistant,
        assistantMode,
        openAssistant,
        isNotificationCenterOpen,
        toggleNotificationCenter,
        isControlCenterOpen,
        toggleControlCenter,
        isSoundEnabled,
        toggleSound,
        isWifiEnabled,
        isBluetoothEnabled,
        isMissionControlOpen,
        toggleMissionControl,
        isStageManager,
        toggleStageManager,
        activeWindowId,
        tileWindow,
        openMultitaskingShowcase,
        closeAllWindows,
    } = useWindowStore()

    // Click outside to close open menus
    useEffect(() => {
        if (!openMenu) return
        const handleClickOutside = () => setOpenMenu(null)
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [openMenu])

    const dropdownRowStyle: React.CSSProperties = {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        borderRadius: '6px',
        padding: '5px 10px',
        color: '#FFFFFF',
        fontSize: '12.5px',
        fontWeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'background-color 0.1s ease',
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '28px',
                backgroundColor: 'rgba(0, 0, 0, 0.18)',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '8px',
                paddingRight: '8px',
                zIndex: 9999,
                userSelect: 'none',
            }}
        >
            {/* ── Left: Apple logo + app menu ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', position: 'relative' }}>
                <MenuItem>
                    <AppleLogo />
                </MenuItem>

                <div style={{ width: '4px' }} />

                <MenuItem bold>Finder</MenuItem>

                {APP_MENU.map((item) => (
                    <MenuItem
                        key={item}
                        active={openMenu === item}
                        onClick={() => {
                            if (item === 'Window') {
                                setOpenMenu(openMenu === 'Window' ? null : 'Window')
                            } else {
                                setOpenMenu(null)
                            }
                        }}
                    >
                        {item}
                    </MenuItem>
                ))}

                {/* ── macOS Window Multitasking Dropdown ── */}
                {openMenu === 'Window' && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: '30px',
                            left: '190px',
                            minWidth: '260px',
                            backgroundColor: 'rgba(28, 30, 36, 0.94)',
                            backdropFilter: 'blur(35px) saturate(190%)',
                            WebkitBackdropFilter: 'blur(35px) saturate(190%)',
                            border: '0.5px solid rgba(255, 255, 255, 0.25)',
                            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                            borderRadius: '10px',
                            padding: '6px',
                            zIndex: 10000,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                        }}
                    >
                        <button
                            onClick={() => {
                                setOpenMenu(null)
                                toggleMissionControl()
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={dropdownRowStyle}
                        >
                            <span>Mission Control (Exposé)</span>
                            <span style={{ opacity: 0.6, fontSize: '11px' }}>F3</span>
                        </button>
                        <button
                            onClick={() => {
                                setOpenMenu(null)
                                toggleStageManager()
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={dropdownRowStyle}
                        >
                            <span>Stage Manager {isStageManager ? '✓' : ''}</span>
                            <span style={{ opacity: 0.6, fontSize: '11px' }}>⌥⌘S</span>
                        </button>
                        <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '4px 6px' }} />
                        <button
                            onClick={() => {
                                setOpenMenu(null)
                                if (activeWindowId) tileWindow(activeWindowId, 'left')
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={dropdownRowStyle}
                        >
                            <span>Tile Window to Left</span>
                            <span style={{ opacity: 0.6, fontSize: '11px' }}>⌃⌥←</span>
                        </button>
                        <button
                            onClick={() => {
                                setOpenMenu(null)
                                if (activeWindowId) tileWindow(activeWindowId, 'right')
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={dropdownRowStyle}
                        >
                            <span>Tile Window to Right</span>
                            <span style={{ opacity: 0.6, fontSize: '11px' }}>⌃⌥→</span>
                        </button>
                        <button
                            onClick={() => {
                                setOpenMenu(null)
                                if (activeWindowId) tileWindow(activeWindowId, 'maximize')
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={dropdownRowStyle}
                        >
                            <span>Zoom Full Screen</span>
                            <span style={{ opacity: 0.6, fontSize: '11px' }}>⌃⌥↑</span>
                        </button>
                        <button
                            onClick={() => {
                                setOpenMenu(null)
                                if (activeWindowId) tileWindow(activeWindowId, 'center')
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007AFF')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={dropdownRowStyle}
                        >
                            <span>Center Window</span>
                            <span style={{ opacity: 0.6, fontSize: '11px' }}>⌃⌥↓</span>
                        </button>
                        <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '4px 6px' }} />
                        <button
                            onClick={() => {
                                setOpenMenu(null)
                                openMultitaskingShowcase()
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.35)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={{ ...dropdownRowStyle, color: '#60A5FA', fontWeight: 600 }}
                        >
                            <span>⚡ Multitasking Showcase (8 Apps)</span>
                        </button>
                        <button
                            onClick={() => {
                                setOpenMenu(null)
                                closeAllWindows()
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.35)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            style={{ ...dropdownRowStyle, color: '#F87171' }}
                        >
                            <span>Close All Windows</span>
                        </button>
                    </div>
                )}
            </div>

            {/* ── Right: system tray — macOS order ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                <button
                    onClick={() => openAssistant(undefined, 'jd')}
                    title="Role & JD Fit Analyzer (The Killer Feature)"
                    style={{
                        border: 'none',
                        outline: 'none',
                        background: isAssistantOpen && assistantMode === 'jd' ? 'rgba(48, 209, 88, 0.28)' : 'rgba(48, 209, 88, 0.12)',
                        borderWidth: '0.5px',
                        borderStyle: 'solid',
                        borderColor: isAssistantOpen && assistantMode === 'jd' ? '#30d158' : 'rgba(48, 209, 88, 0.35)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        marginRight: '6px',
                        color: isAssistantOpen && assistantMode === 'jd' ? '#ffffff' : '#6ee7b7',
                        fontSize: '11px',
                        fontWeight: 600,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    }}
                >
                    <span>⚡</span>
                    <span>JD Fit</span>
                </button>
                <AppleIntelligencePill onClick={toggleAssistant} isOpen={isAssistantOpen && assistantMode === 'chat'} />

                {/* Interactive macOS Sound Effects Mute / Unmute Toggle */}
                <button
                    onClick={toggleSound}
                    title={isSoundEnabled ? 'macOS Sound Effects: Enabled (Click to Mute)' : 'macOS Sound Effects: Muted (Click to Enable)'}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        padding: '0 4px',
                        display: 'flex',
                        alignItems: 'center',
                        height: '22px',
                        borderRadius: '4px',
                        color: '#ffffff',
                        transition: 'background-color 0.12s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                    <VolumeIcon muted={!isSoundEnabled} />
                </button>

                {/* Orange Microphone In-Use Pill (Exact match to reference image) */}
                <div
                    title="Microphone in use by System Settings"
                    style={{
                        backgroundColor: '#FF9500',
                        borderRadius: '10px',
                        padding: '1px 7px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '20px',
                        marginRight: '6px',
                        cursor: 'default',
                        boxShadow: '0 1px 4px rgba(255, 149, 0, 0.4)',
                    }}
                >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                </div>

                {/* Battery */}
                <TrayItem>
                    <BatteryIcon level={batteryLevel} />
                </TrayItem>

                {/* Wi-Fi */}
                <div
                    onClick={toggleControlCenter}
                    style={{ cursor: 'pointer', opacity: isWifiEnabled ? 1 : 0.45 }}
                    title={`Wi-Fi: ${isWifiEnabled ? 'Connected' : 'Off'}`}
                >
                    <TrayItem><WifiIcon /></TrayItem>
                </div>

                {/* Spotlight Search Icon (Exact match to reference image) */}
                <button
                    onClick={toggleAssistant}
                    title="Spotlight Search (⌘Space)"
                    style={{
                        background: isAssistantOpen ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                        border: 'none',
                        outline: 'none',
                        borderRadius: '4px',
                        padding: '0 4px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '22px',
                        transition: 'background-color 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                        if (!isAssistantOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
                    }}
                    onMouseLeave={(e) => {
                        if (!isAssistantOpen) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7.5" />
                        <line x1="21" y1="21" x2="16.5" y2="16.5" />
                    </svg>
                </button>

                {/* Mission Control (Exposé) Button */}
                <button
                    onClick={toggleMissionControl}
                    title="Mission Control (F3)"
                    style={{
                        background: isMissionControlOpen ? 'rgba(255, 255, 255, 0.28)' : 'transparent',
                        border: 'none',
                        outline: 'none',
                        borderRadius: '4px',
                        padding: '0 5px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '22px',
                        transition: 'background-color 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                        if (!isMissionControlOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
                    }}
                    onMouseLeave={(e) => {
                        if (!isMissionControlOpen) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                >
                    <MissionControlIcon />
                </button>

                {/* Control Center Pill with Two Slider Switches + Orange Mic Dot (Exact match to image!) */}
                <button
                    onClick={toggleControlCenter}
                    title="Control Center"
                    style={{
                        background: isControlCenterOpen ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(20px)',
                        border: '0.5px solid rgba(255, 255, 255, 0.35)',
                        outline: 'none',
                        borderRadius: '12px',
                        padding: '0 8px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '22px',
                        margin: '0 4px',
                        transition: 'background-color 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                        if (!isControlCenterOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.30)'
                    }}
                    onMouseLeave={(e) => {
                        if (!isControlCenterOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)'
                    }}
                >
                    <ControlCenterIcon />
                    {/* Orange microphone in-use dot indicator */}
                    <div
                        style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor: '#FF9500',
                            boxShadow: '0 0 4px #FF9500',
                        }}
                    />
                </button>

                {/* Notification Center Trigger: macOS Clock */}
                <button
                    onClick={toggleNotificationCenter}
                    title="Notification Center (⌘N)"
                    style={{
                        background: isNotificationCenterOpen ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                        border: 'none',
                        outline: 'none',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        letterSpacing: '-0.01em',
                        transition: 'background-color 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    onMouseEnter={(e) => {
                        if (!isNotificationCenterOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
                    }}
                    onMouseLeave={(e) => {
                        if (!isNotificationCenterOpen) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                >
                    {clock}
                </button>
            </div>
        </div>
    )
}
