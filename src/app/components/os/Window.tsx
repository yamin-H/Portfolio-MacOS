'use client'

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { animate } from 'framer-motion'
import { useWindowStore } from '@/app/store/windowStore'
import TrafficLights from '@/components/os/TrafficLights'

export interface WindowContextValue {
  id: string
  isActive: boolean
  closeWindow: () => void
  minimizeWindow: () => void
  toggleMaximize: () => void
  handleTitlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
  windowBlur: number
  setWindowBlur: (blur: number) => void
  resizeWindow?: (width: number, height: number) => void
}

export const WindowContext = React.createContext<WindowContextValue | null>(null)

export function useWindowContext() {
  return React.useContext(WindowContext)
}

interface WindowProps {
  id: string
  title: string
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
  isMinimized: boolean
  zIndex: number
  hideTitleBar?: boolean
  children?: React.ReactNode
}

const MIN_WIDTH = 250
const MIN_HEIGHT = 220
const MENU_BAR_HEIGHT = 28
const DOCK_CLEARANCE = 86

// macOS spring — snappy but not aggressive
const SPRING = { stiffness: 380, damping: 28, mass: 0.8 }
const SPRING_SLOW = { stiffness: 280, damping: 26, mass: 0.9 }

function getDockIconPosition(id: string): { x: number; y: number } {
  const el = document.querySelector(`[data-dock-id="${id}"]`)
  if (el) {
    const rect = el.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: window.innerWidth / 2, y: window.innerHeight - 40 }
}

export default function Window({
  id,
  title,
  initialPosition,
  initialSize,
  isMinimized,
  zIndex,
  hideTitleBar = false,
  children,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: initialPosition.x, y: initialPosition.y })
  const sizeRef = useRef({ width: initialSize.width, height: initialSize.height })
  const isMaximized = useRef(false)
  const preMaxState = useRef({ ...initialPosition, ...initialSize })
  const hasAnimatedIn = useRef(false)
  const isAnimating = useRef(false)

  const [visible, setVisible] = useState(false)
  const [windowBlur, setWindowBlur] = useState<number>(36)

  const {
    activeWindowId,
    isStageManager,
    focusWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    commitPosition,
    commitSize,
    setSnapPreview,
    tileWindow,
  } = useWindowStore()

  const isActive = activeWindowId === id
  const isStagedOut = isStageManager && activeWindowId !== null && activeWindowId !== id

  // ── Animate In on Mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (hasAnimatedIn.current || !windowRef.current) return
    hasAnimatedIn.current = true

    const el = windowRef.current
    const dock = getDockIconPosition(id)

    // Start from dock icon position, scaled down
    el.style.transformOrigin = `${dock.x - posRef.current.x}px ${dock.y - posRef.current.y}px`
    el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(0.05)`
    el.style.opacity = '0'
    setVisible(true)

    isAnimating.current = true

    animate(0, 1, {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (!el) return
        const scale = 0.05 + 0.95 * v
        el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(${scale})`
        el.style.opacity = String(Math.min(1, v * 1.8))
      },
      onComplete: () => {
        if (!el) return
        el.style.transformOrigin = 'center center'
        el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
        el.style.opacity = '1'
        isAnimating.current = false
      },
    })
  }, [id])

  // ── Sync Position & Size on Tile / Snap ─────────────────────────────────
  useEffect(() => {
    const el = windowRef.current
    if (!el || isAnimating.current || !hasAnimatedIn.current) return
    posRef.current = { x: initialPosition.x, y: initialPosition.y }
    sizeRef.current = { width: initialSize.width, height: initialSize.height }
    el.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.transform = `translate3d(${initialPosition.x}px, ${initialPosition.y}px, 0)`
    el.style.width = `${initialSize.width}px`
    el.style.height = `${initialSize.height}px`
    const timer = setTimeout(() => {
      if (el) el.style.transition = 'box-shadow 0.2s ease'
    }, 300)
    return () => clearTimeout(timer)
  }, [initialPosition.x, initialPosition.y, initialSize.width, initialSize.height])

  // ── Stage Manager Transition ────────────────────────────────────────────
  useEffect(() => {
    const el = windowRef.current
    if (!el || !hasAnimatedIn.current || isAnimating.current) return

    if (isStagedOut) {
      el.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease'
      el.style.transform = `translate3d(-120px, ${posRef.current.y}px, 0) scale(0.88)`
      el.style.opacity = '0'
      el.style.pointerEvents = 'none'
    } else if (!isMinimized) {
      el.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease'
      el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(1)`
      el.style.opacity = '1'
      el.style.pointerEvents = 'auto'
    }
  }, [isStagedOut, isMinimized])

  // ── Minimize ────────────────────────────────────────────────────────────
  const handleMinimize = useCallback(() => {
    if (isAnimating.current || !windowRef.current) return
    const el = windowRef.current
    const dock = getDockIconPosition(id)
    isAnimating.current = true

    // Origin points toward dock icon
    const originX = dock.x - posRef.current.x
    const originY = dock.y - posRef.current.y
    el.style.transformOrigin = `${originX}px ${originY}px`

    animate(1, 0, {
      ...SPRING_SLOW,
      onUpdate: (v) => {
        if (!el) return
        const scale = 0.05 + 0.95 * v
        el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(${scale})`
        el.style.opacity = String(v * 1.2)
      },
      onComplete: () => {
        if (!el) return
        el.style.transformOrigin = 'center center'
        el.style.opacity = '0'
        isAnimating.current = false
        minimizeWindow(id)
      },
    })
  }, [id, minimizeWindow])

  // ── Restore from Minimized ──────────────────────────────────────────────
  useEffect(() => {
    if (!isMinimized && hasAnimatedIn.current && windowRef.current) {
      // This fires when restoreWindow is called from dock
      const el = windowRef.current
      const dock = getDockIconPosition(id)

      const originX = dock.x - posRef.current.x
      const originY = dock.y - posRef.current.y
      el.style.transformOrigin = `${originX}px ${originY}px`
      el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(0.05)`
      el.style.opacity = '0'

      isAnimating.current = true

      animate(0, 1, {
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => {
          if (!el) return
          const scale = 0.05 + 0.95 * v
          el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(${scale})`
          el.style.opacity = String(Math.min(1, v * 1.8))
        },
        onComplete: () => {
          if (!el) return
          el.style.transformOrigin = 'center center'
          el.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
          el.style.opacity = '1'
          isAnimating.current = false
        },
      })
    }
  }, [isMinimized, id])

  // ── Drag ────────────────────────────────────────────────────────────────
  const handleTitlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('button')) return
      if (isMaximized.current || isAnimating.current || !windowRef.current) return
      e.preventDefault()
      focusWindow(id)

      const el = windowRef.current
      const target = e.currentTarget
      const startX = e.clientX
      const startY = e.clientY
      const startPosX = posRef.current.x
      const startPosY = posRef.current.y
      let currentX = startPosX
      let currentY = startPosY
      let rafId: number | null = null
      let pendingSnap: 'left' | 'right' | 'top' | null = null

      el.style.transition = 'none'
      el.style.willChange = 'transform'
      target.setPointerCapture(e.pointerId)

      const onMove = (ev: PointerEvent) => {
        currentX = startPosX + ev.clientX - startX
        currentY = Math.max(MENU_BAR_HEIGHT, startPosY + ev.clientY - startY)
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            if (el) el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
            rafId = null
          })
        }

        // Edge detection for window snapping ghost preview
        const screenW = window.innerWidth
        const screenH = window.innerHeight
        const topH = MENU_BAR_HEIGHT
        const dockH = 72
        const usableH = screenH - topH - dockH

        if (ev.clientX <= 25) {
          pendingSnap = 'left'
          setSnapPreview({
            x: 8,
            y: topH + 6,
            width: Math.round(screenW / 2 - 12),
            height: usableH - 12,
            type: 'left',
          })
        } else if (ev.clientX >= screenW - 25) {
          pendingSnap = 'right'
          setSnapPreview({
            x: Math.round(screenW / 2 + 4),
            y: topH + 6,
            width: Math.round(screenW / 2 - 12),
            height: usableH - 12,
            type: 'right',
          })
        } else if (ev.clientY <= topH + 20) {
          pendingSnap = 'top'
          setSnapPreview({
            x: 8,
            y: topH + 6,
            width: screenW - 16,
            height: usableH - 12,
            type: 'top',
          })
        } else {
          if (pendingSnap !== null) {
            pendingSnap = null
            setSnapPreview(null)
          }
        }
      }

      const onUp = (ev: PointerEvent) => {
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
        try { target.releasePointerCapture(ev.pointerId) } catch {}
        target.removeEventListener('pointermove', onMove)
        target.removeEventListener('pointerup', onUp)
        target.removeEventListener('pointercancel', onUp)

        if (pendingSnap) {
          tileWindow(id, pendingSnap)
          setSnapPreview(null)
        } else {
          posRef.current = { x: currentX, y: currentY }
          if (el) {
            el.style.willChange = 'auto'
            el.style.transition = 'box-shadow 0.2s ease'
          }
          commitPosition(id, posRef.current)
        }
      }

      target.addEventListener('pointermove', onMove)
      target.addEventListener('pointerup', onUp)
      target.addEventListener('pointercancel', onUp)
    },
    [id, focusWindow, commitPosition, setSnapPreview, tileWindow]
  )

  // ── Resize ──────────────────────────────────────────────────────────────
  const startResize = useCallback(
    (direction: string, e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation()
      e.preventDefault()
      if (isMaximized.current || isAnimating.current || !windowRef.current) return
      focusWindow(id)

      const el = windowRef.current
      const target = e.currentTarget
      const startX = e.clientX
      const startY = e.clientY
      const startW = sizeRef.current.width
      const startH = sizeRef.current.height
      const startPX = posRef.current.x
      const startPY = posRef.current.y
      let cW = startW, cH = startH, cX = startPX, cY = startPY
      let rafId: number | null = null

      el.style.transition = 'none'
      el.style.willChange = 'transform, width, height'
      target.setPointerCapture(e.pointerId)

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX
        const dy = ev.clientY - startY
        let nW = startW, nH = startH, nX = startPX, nY = startPY

        if (direction.includes('e')) nW = Math.max(MIN_WIDTH, startW + dx)
        else if (direction.includes('w')) {
          nW = Math.max(MIN_WIDTH, startW - dx)
          nX = nW > MIN_WIDTH ? startPX + dx : startPX + startW - MIN_WIDTH
        }
        if (direction.includes('s')) nH = Math.max(MIN_HEIGHT, startH + dy)
        else if (direction.includes('n')) {
          const ph = startH - dy
          const py = startPY + dy
          if (ph >= MIN_HEIGHT && py >= MENU_BAR_HEIGHT) { nH = ph; nY = py }
          else if (ph < MIN_HEIGHT) { nH = MIN_HEIGHT; nY = startPY + startH - MIN_HEIGHT }
        }

        cW = nW; cH = nH; cX = nX; cY = nY
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            if (el) {
              el.style.width = `${cW}px`
              el.style.height = `${cH}px`
              el.style.transform = `translate3d(${cX}px, ${cY}px, 0)`
            }
            rafId = null
          })
        }
      }

      const onUp = (ev: PointerEvent) => {
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
        try { target.releasePointerCapture(ev.pointerId) } catch {}
        target.removeEventListener('pointermove', onMove)
        target.removeEventListener('pointerup', onUp)
        target.removeEventListener('pointercancel', onUp)
        sizeRef.current = { width: cW, height: cH }
        posRef.current = { x: cX, y: cY }
        if (el) {
          el.style.willChange = 'auto'
          el.style.transition = 'box-shadow 0.2s ease'
        }
        commitSize(id, sizeRef.current)
        commitPosition(id, posRef.current)
      }

      target.addEventListener('pointermove', onMove)
      target.addEventListener('pointerup', onUp)
      target.addEventListener('pointercancel', onUp)
    },
    [id, focusWindow, commitSize, commitPosition]
  )

  // ── Maximize ────────────────────────────────────────────────────────────
  const toggleMaximize = useCallback(() => {
    if (isAnimating.current || !windowRef.current) return
    const el = windowRef.current

    if (!isMaximized.current) {
      preMaxState.current = {
        x: posRef.current.x,
        y: posRef.current.y,
        width: sizeRef.current.width,
        height: sizeRef.current.height,
      }
      const tX = 0, tY = MENU_BAR_HEIGHT
      const tW = window.innerWidth
      const tH = window.innerHeight - MENU_BAR_HEIGHT - DOCK_CLEARANCE

      el.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1), width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1)'
      el.style.transform = `translate3d(${tX}px, ${tY}px, 0)`
      el.style.width = `${tW}px`
      el.style.height = `${tH}px`
      el.style.borderRadius = '0px'
      posRef.current = { x: tX, y: tY }
      sizeRef.current = { width: tW, height: tH }
      isMaximized.current = true
    } else {
      const { x, y, width, height } = preMaxState.current
      el.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1), width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1)'
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      el.style.width = `${width}px`
      el.style.height = `${height}px`
      el.style.borderRadius = '12px'
      posRef.current = { x, y }
      sizeRef.current = { width, height }
      isMaximized.current = false
    }
  }, [])

  const resizeWindow = useCallback(
    (width: number, height: number) => {
      const el = windowRef.current
      if (!el || isMaximized.current) return
      sizeRef.current = { width, height }
      el.style.transition = 'width 0.26s cubic-bezier(0.16, 1, 0.3, 1), height 0.26s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.width = `${width}px`
      el.style.height = `${height}px`
      setTimeout(() => {
        if (el) el.style.transition = 'box-shadow 0.2s ease'
      }, 280)
      commitSize(id, { width, height })
    },
    [id, commitSize]
  )

  const handleClose = useCallback(() => {
    closeWindow(id)
  }, [closeWindow, id])

  const contextValue = useMemo<WindowContextValue>(
    () => ({
      id,
      isActive,
      closeWindow: handleClose,
      minimizeWindow: handleMinimize,
      toggleMaximize,
      handleTitlePointerDown,
      windowBlur,
      setWindowBlur,
      resizeWindow,
    }),
    [id, isActive, handleClose, handleMinimize, toggleMaximize, handleTitlePointerDown, windowBlur, resizeWindow]
  )

  if (isMinimized && !visible) return null

  return (
    <div
      ref={windowRef}
      onPointerDown={() => focusWindow(id)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate3d(${initialPosition.x}px, ${initialPosition.y}px, 0)`,
        width: initialSize.width,
        height: initialSize.height,
        zIndex,
        opacity: 0,
        display: isMinimized ? 'none' : 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor:
          windowBlur > 0
            ? `rgba(24, 26, 32, ${(0.80 - (windowBlur / 60) * 0.38).toFixed(2)})`
            : 'rgba(26, 26, 30, 1)',
        backdropFilter: windowBlur > 0 ? `blur(${windowBlur}px) saturate(190%)` : 'none',
        WebkitBackdropFilter: windowBlur > 0 ? `blur(${windowBlur}px) saturate(190%)` : 'none',
        border: '0.5px solid rgba(255,255,255,0.18)',
        boxShadow: isActive
          ? '0 24px 60px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
          : '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        transition: 'box-shadow 0.2s ease',
        userSelect: 'none',
        willChange: 'transform',
      }}
    >
      <WindowContext.Provider value={contextValue}>
        {/* Title Bar */}
        {!hideTitleBar && (
          <div
            onPointerDown={handleTitlePointerDown}
            onDoubleClick={toggleMaximize}
            style={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              cursor: 'default',
              borderBottom: '0.5px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Traffic Lights */}
            <TrafficLights />

            {/* Title */}
            <div style={{
              position: 'absolute', left: 0, right: 0, textAlign: 'center',
              fontSize: 13, fontWeight: 600, letterSpacing: '-0.012em',
              color: isActive ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.38)',
              transition: 'color 0.2s ease', pointerEvents: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            }}>
              {title}
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: hideTitleBar ? 'hidden' : 'auto',
          position: 'relative',
          display: hideTitleBar ? 'flex' : undefined,
          color: 'rgba(255,255,255,0.92)',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          {children}
        </div>
      </WindowContext.Provider>

      {/* Resize Handles */}
      <div onPointerDown={(e) => startResize('n', e)} style={{ position: 'absolute', top: -3, left: 14, right: 14, height: 6, cursor: 'ns-resize', zIndex: 10 }} />
      <div onPointerDown={(e) => startResize('s', e)} style={{ position: 'absolute', bottom: -3, left: 14, right: 14, height: 6, cursor: 'ns-resize', zIndex: 10 }} />
      <div onPointerDown={(e) => startResize('w', e)} style={{ position: 'absolute', top: 14, bottom: 14, left: -3, width: 6, cursor: 'ew-resize', zIndex: 10 }} />
      <div onPointerDown={(e) => startResize('e', e)} style={{ position: 'absolute', top: 14, bottom: 14, right: -3, width: 6, cursor: 'ew-resize', zIndex: 10 }} />
      <div onPointerDown={(e) => startResize('nw', e)} style={{ position: 'absolute', top: -3, left: -3, width: 16, height: 16, cursor: 'nwse-resize', zIndex: 11 }} />
      <div onPointerDown={(e) => startResize('ne', e)} style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, cursor: 'nesw-resize', zIndex: 11 }} />
      <div onPointerDown={(e) => startResize('sw', e)} style={{ position: 'absolute', bottom: -3, left: -3, width: 16, height: 16, cursor: 'nesw-resize', zIndex: 11 }} />
      <div onPointerDown={(e) => startResize('se', e)} style={{ position: 'absolute', bottom: -3, right: -3, width: 16, height: 16, cursor: 'nwse-resize', zIndex: 11 }} />
    </div>
  )
}