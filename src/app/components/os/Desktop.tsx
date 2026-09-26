'use client'

import MenuBar from './MenuBar'
import Dock    from './Dock'
import WindowManager from './WindowManager'
import AssistantSpotlight from '@/components/apps/AssistantSpotlight'
import NotificationCenter from '@/components/os/NotificationCenter'
import ControlCenter from '@/components/os/ControlCenter'
import MissionControl from '@/components/os/MissionControl'
import StageManagerShelf from '@/components/os/StageManagerShelf'
import WindowSnapOverlay from '@/components/os/WindowSnapOverlay'
import AppSwitcher from '@/components/os/AppSwitcher'
import UrlSyncManager from '@/components/os/UrlSyncManager'
import DesktopIcons from '@/components/os/DesktopIcons'
import { useWindowStore } from '@/app/store/windowStore'
import React, { useEffect } from 'react'

export default function Desktop() {
    const {
        wallpaperUrl,
        appearanceMode,
        accentColor,
        systemBrightness,
        isNightShift,
        isTrueTone,
        hydrateSettings,
        activeWindowId,
        toggleMissionControl,
        closeMissionControl,
        isMissionControlOpen,
        toggleStageManager,
        tileWindow,
        openAppSwitcher,
        cycleAppSwitcher,
        isAppSwitcherOpen,
    } = useWindowStore()

    // ── Hydrate settings on mount & handle Auto appearance ─────────────────
    useEffect(() => {
        hydrateSettings()

        if (typeof window !== 'undefined' && window.matchMedia) {
            const mq = window.matchMedia('(prefers-color-scheme: dark)')
            const listener = () => {
                const store = useWindowStore.getState()
                if (store.appearanceMode === 'auto') {
                    store.hydrateSettings()
                }
            }
            mq.addEventListener('change', listener)
            return () => mq.removeEventListener('change', listener)
        }
    }, [hydrateSettings])

    // ── Global Multitasking Keyboard Shortcuts ─────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 1. F3 or Control + ArrowUp => Mission Control (Exposé)
            if (e.key === 'F3' || (e.ctrlKey && e.key === 'ArrowUp')) {
                e.preventDefault()
                toggleMissionControl()
                return
            }

            // 2. Option + Cmd + S or Ctrl + Alt + S => Toggle Stage Manager
            if ((e.metaKey || e.ctrlKey) && e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault()
                toggleStageManager()
                return
            }

            // 3. Window Tiling Shortcuts (macOS Sequoia)
            if (e.ctrlKey && e.altKey && activeWindowId) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault()
                    tileWindow(activeWindowId, 'left')
                    return
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault()
                    tileWindow(activeWindowId, 'right')
                    return
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    tileWindow(activeWindowId, 'maximize')
                    return
                }
                if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    tileWindow(activeWindowId, 'center')
                    return
                }
            }

            // 4. Cmd + Tab or Alt + Tab => Fast App Switcher HUD
            if ((e.metaKey || e.altKey) && e.key === 'Tab') {
                e.preventDefault()
                if (!isAppSwitcherOpen) {
                    openAppSwitcher()
                }
                cycleAppSwitcher(e.shiftKey ? -1 : 1)
                return
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [
        activeWindowId,
        toggleMissionControl,
        toggleStageManager,
        tileWindow,
        openAppSwitcher,
        cycleAppSwitcher,
        isAppSwitcherOpen,
    ])

    return (
        <div
            data-theme={appearanceMode}
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: `url(${wallpaperUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                transition: 'background-image 0.4s ease-in-out',
            }}
        >
            <UrlSyncManager />
            <MenuBar />
            <StageManagerShelf />
            <DesktopIcons />
            <WindowManager />
            <WindowSnapOverlay />
            <AssistantSpotlight />
            <ControlCenter />
            <NotificationCenter />
            <MissionControl />
            <AppSwitcher />
            <Dock />

            {/* 1. Night Shift Warm Ambient Filter */}
            {isNightShift && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(255, 140, 0, 0.16)',
                        mixBlendMode: 'multiply',
                        pointerEvents: 'none',
                        zIndex: 9993,
                        transition: 'opacity 0.3s ease',
                    }}
                />
            )}

            {/* 2. True Tone Subtle Ambient Adaptation */}
            {isTrueTone && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(255, 235, 205, 0.04)',
                        mixBlendMode: 'soft-light',
                        pointerEvents: 'none',
                        zIndex: 9993,
                    }}
                />
            )}

            {/* 3. Screen Brightness Attenuation Overlay */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: '#000000',
                    opacity: (1 - systemBrightness) * 0.75,
                    pointerEvents: 'none',
                    zIndex: 9994,
                    transition: 'opacity 0.08s ease',
                }}
            />
        </div>
    )
}