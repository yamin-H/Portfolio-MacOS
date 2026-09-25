'use client'

import { useEffect, useRef } from 'react'
import { useWindowStore } from '@/app/store/windowStore'

const DOCK_APP_SIZES: Record<string, { title: string; width: number; height: number }> = {
  finder:     { title: 'Finder',     width: 1040, height: 640 },
  files:      { title: 'Files',      width: 1040, height: 640 },
  terminal:   { title: 'Terminal',   width: 700,  height: 450 },
  safari:     { title: 'Safari',     width: 1020, height: 640 },
  notes:      { title: 'Notes',      width: 940,  height: 600 },
  settings:   { title: 'Settings',   width: 840,  height: 580 },
  calculator: { title: 'Calculator', width: 380,  height: 540 },
  weather:    { title: 'Weather',    width: 880,  height: 600 },
  photos:     { title: 'Photos',     width: 940,  height: 600 },
  appstore:   { title: 'App Store',  width: 780,  height: 520 },
  resume:     { title: 'Resume.pdf', width: 730,  height: 760 },
}

export default function UrlSyncManager() {
  const {
    windows,
    activeWindowId,
    openWindow,
    openFinderFile,
    isAssistantOpen,
    assistantMode,
    openAssistant,
    isNotificationCenterOpen,
    openNotificationCenter,
    isControlCenterOpen,
    isMissionControlOpen,
  } = useWindowStore()

  const isInitialMount = useRef(true)

  // ── 1. Read URL on initial mount and restore state ─────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)

    const appParam = params.get('app')?.toLowerCase()
    const fileParam = params.get('file')?.toLowerCase()
    const pipelineParam = params.get('pipeline')
    const assistantParam = params.get('assistant')?.toLowerCase()
    const notifParam = params.get('notifications') || params.get('notification')
    const ccParam = params.get('controlcenter') || (appParam === 'controlcenter')
    const mcParam = params.get('missioncontrol') || (appParam === 'missioncontrol')

    // Handle Mission Control: /?missioncontrol=open or /?app=missioncontrol
    if (mcParam && mcParam !== 'false') {
      useWindowStore.getState().openMissionControl()
      return
    }

    // Handle Direct Pipeline Simulation link: /?pipeline=true or /?pipeline=pr-review-agent
    if (pipelineParam) {
      openFinderFile('Projects/pr-review-agent.md')
      return
    }

    // Handle Direct File QuickLook: /?file=pr-review-agent.md or /?file=resume
    if (fileParam) {
      openFinderFile(fileParam)
      return
    }

    // Handle Control Center: /?controlcenter=open or /?app=controlcenter
    if (ccParam && ccParam !== 'false') {
      useWindowStore.getState().openControlCenter()
      return
    }

    // Handle Notification Center: /?notifications=open
    if (notifParam && notifParam !== 'false') {
      openNotificationCenter()
      return
    }

    // Handle Assistant: /?assistant=jd or /?assistant=chat
    if (assistantParam) {
      openAssistant(undefined, assistantParam === 'jd' ? 'jd' : 'chat')
      return
    }

    // Handle App launch: /?app=terminal or /?app=finder
    if (appParam && DOCK_APP_SIZES[appParam]) {
      const def = DOCK_APP_SIZES[appParam]
      const x = Math.max(30, Math.round((window.innerWidth - def.width) / 2))
      const y = Math.max(48, Math.round((window.innerHeight - def.height) / 2 - 28))
      openWindow({
        id: appParam,
        title: def.title,
        isOpen: true,
        isMinimized: false,
        position: { x, y },
        size: { width: def.width, height: def.height },
      })
    }
  }, [openFinderFile, openWindow, openAssistant, openNotificationCenter])

  // ── 2. Sync State to URL Query Parameters ──────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Skip updating URL on initial render before initial URL params are processed
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const currentParams = new URLSearchParams()

    if (isMissionControlOpen) {
      currentParams.set('missioncontrol', 'open')
    } else if (isControlCenterOpen) {
      currentParams.set('controlcenter', 'open')
    } else if (isNotificationCenterOpen) {
      currentParams.set('notifications', 'open')
    } else if (isAssistantOpen) {
      currentParams.set('assistant', assistantMode || 'chat')
    } else if (activeWindowId) {
      const activeWin = windows.find((w) => w.id === activeWindowId && w.isOpen && !w.isMinimized)
      if (activeWin) {
        currentParams.set('app', activeWin.id)
      }
    }

    const newQuery = currentParams.toString()
    const newPath = newQuery ? `?${newQuery}` : window.location.pathname

    // Update URL bar cleanly without page reload
    if (window.location.search !== (newQuery ? `?${newQuery}` : '')) {
      window.history.replaceState(null, '', newPath)
    }
  }, [windows, activeWindowId, isAssistantOpen, assistantMode, isNotificationCenterOpen, isControlCenterOpen, isMissionControlOpen])

  return null
}
