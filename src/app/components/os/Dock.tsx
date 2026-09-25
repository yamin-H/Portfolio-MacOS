'use client'

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useWindowStore } from '@/app/store/windowStore'

// ─── Physics ──────────────────────────────────────────────────────────────────
const DIST = 80
const SPRING = { stiffness: 520, damping: 34, mass: 0.18 } as const

// ─── App Registry ─────────────────────────────────────────────────────────────
interface AppDef {
  id: string
  label: string
  src: string
  defaultWidth: number
  defaultHeight: number
}

const GROUP_1: AppDef[] = [
  { id: 'calculator', label: 'Calculator', src: '/calculator.png',    defaultWidth: 380, defaultHeight: 540 },
  { id: 'appstore',   label: 'App Store',  src: '/appstore.png',      defaultWidth: 1040, defaultHeight: 680 },
  { id: 'files',      label: 'Files',      src: '/File explorar.png', defaultWidth: 1040, defaultHeight: 640 },
  { id: 'finder',     label: 'Finder',     src: '/finder.png',        defaultWidth: 1040, defaultHeight: 640 },
  { id: 'notes',      label: 'Notes',      src: '/Notes.png',         defaultWidth: 940, defaultHeight: 600 },
  { id: 'photos',     label: 'Photos',     src: '/photos.png',        defaultWidth: 940, defaultHeight: 600 },
]

const GROUP_2: AppDef[] = [
  { id: 'safari',   label: 'Safari',   src: '/safari browser.png', defaultWidth: 1020, defaultHeight: 640 },
  { id: 'settings', label: 'Settings', src: '/settings.png',       defaultWidth: 840, defaultHeight: 580 },
  { id: 'terminal', label: 'Terminal', src: '/terminal.png',       defaultWidth: 700, defaultHeight: 450 },
  { id: 'weather',  label: 'Weather',  src: '/weather.png',        defaultWidth: 880, defaultHeight: 600 },
]

// ─── DockIcon ─────────────────────────────────────────────────────────────────
interface DockIconProps {
  id: string
  mouseCoord: MotionValue<number>
  src: string
  label: string
  isOpen: boolean
  baseSize: number
  magnification: boolean
  dockPos: 'bottom' | 'left' | 'right'
  onClick: () => void
}

function DockIcon({
  id,
  mouseCoord,
  src,
  label,
  isOpen,
  baseSize,
  magnification,
  dockPos,
  onClick,
}: DockIconProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [showLabel, setShowLabel] = useState(false)

  const maxScale = magnification ? 1.65 : 1.0
  const maxHalfGrow = ((maxScale - 1) * baseSize) / 2

  // Distance from cursor to icon center
  const distance = useTransform(mouseCoord, (mc) => {
    const el = wrapperRef.current
    if (!el || !magnification) return Infinity
    const rect = el.getBoundingClientRect()
    if (dockPos === 'bottom') {
      return mc - (rect.left + rect.width / 2)
    } else {
      return mc - (rect.top + rect.height / 2)
    }
  })

  // Scale driven by distance
  const scaleRaw = useTransform(
    distance,
    [-DIST, -DIST * 0.5, 0, DIST * 0.5, DIST],
    [1, 1.28, maxScale, 1.28, 1],
    { clamp: true }
  )
  const scale = useSpring(scaleRaw, SPRING)
  const halfGrow = useTransform(scale, [1, maxScale], [0, maxHalfGrow])

  const zIndex = useTransform(scale, (s) => Math.round(s * 10))
  const labelOffset = Math.round(baseSize * maxScale) + 8

  // Tooltip position style
  const getTooltipStyle = () => {
    if (dockPos === 'bottom') {
      return {
        bottom: labelOffset,
        left: '50%',
        translateX: '-50%',
      }
    }
    if (dockPos === 'left') {
      return {
        left: labelOffset,
        top: '50%',
        translateY: '-50%',
      }
    }
    return {
      right: labelOffset,
      top: '50%',
      translateY: '-50%',
    }
  }

  return (
    <motion.div
      ref={wrapperRef}
      data-dock-id={id}
      onClick={onClick}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
      style={{
        position: 'relative',
        width: baseSize,
        height: baseSize,
        flexShrink: 0,
        cursor: 'pointer',
        overflow: 'visible',
        marginLeft: dockPos === 'bottom' ? halfGrow : 0,
        marginRight: dockPos === 'bottom' ? halfGrow : 0,
        marginTop: dockPos !== 'bottom' ? halfGrow : 0,
        marginBottom: dockPos !== 'bottom' ? halfGrow : 0,
      }}
    >
      {/* Tooltip */}
      <motion.div
        initial={false}
        animate={{
          opacity: showLabel ? 1 : 0,
          scale: showLabel ? 1 : 0.92,
        }}
        transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute',
          ...getTooltipStyle(),
          background: 'rgba(24,24,27,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '0.5px solid rgba(255,255,255,0.18)',
          color: 'rgba(255,255,255,0.95)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          padding: '5px 10px',
          borderRadius: '7px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          WebkitFontSmoothing: 'antialiased',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
          zIndex: 20,
        } as React.CSSProperties}
      >
        {label}
      </motion.div>

      {/* Icon Image */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: dockPos === 'bottom' ? 0 : undefined,
          left: dockPos === 'bottom' ? '50%' : dockPos === 'left' ? 0 : undefined,
          right: dockPos === 'right' ? 0 : undefined,
          top: dockPos !== 'bottom' ? '50%' : undefined,
          translateX: dockPos === 'bottom' ? '-50%' : 0,
          translateY: dockPos !== 'bottom' ? '-50%' : 0,
          width: baseSize,
          height: baseSize,
          scale,
          transformOrigin:
            dockPos === 'bottom'
              ? '50% 100%'
              : dockPos === 'left'
              ? '0% 50%'
              : '100% 50%',
          zIndex,
        }}
      >
        <motion.div
          whileTap={{ scale: 0.86 }}
          transition={{ type: 'spring', stiffness: 600, damping: 28 }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '22%',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          <img
            src={src}
            alt={label}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              userSelect: 'none',
              display: 'block',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Running Dot Indicator */}
      <motion.div
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.3,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: dockPos === 'bottom' ? -6 : undefined,
          left: dockPos === 'bottom' ? '50%' : dockPos === 'right' ? -6 : undefined,
          right: dockPos === 'left' ? -6 : undefined,
          top: dockPos !== 'bottom' ? '50%' : undefined,
          translateX: dockPos === 'bottom' ? '-50%' : 0,
          translateY: dockPos !== 'bottom' ? '-50%' : 0,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 0 4px rgba(255,255,255,0.6)',
          pointerEvents: 'none',
        } as React.CSSProperties}
      />
    </motion.div>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────
function DockSeparator({ baseSize, dockPos }: { baseSize: number; dockPos: 'bottom' | 'left' | 'right' }) {
  const isHorizontal = dockPos === 'bottom'
  return (
    <div
      style={{
        width: isHorizontal ? 1 : Math.round(baseSize * 0.62),
        height: isHorizontal ? Math.round(baseSize * 0.62) : 1,
        background: 'rgba(255,255,255,0.22)',
        borderRadius: 1,
        alignSelf: 'center',
        flexShrink: 0,
        margin: isHorizontal ? '0 2px' : '2px 0',
      }}
    />
  )
}

// ─── Dock ─────────────────────────────────────────────────────────────────────
export default function Dock() {
  const mouseCoord = useMotionValue(Infinity)
  const {
    windows,
    activeWindowId,
    openWindow,
    focusWindow,
    restoreWindow,
    dockSize,
    dockMagnification,
    dockPosition,
    dockAutoHide,
  } = useWindowStore()

  const [isHovered, setIsHovered] = useState(false)
  const [isNearEdge, setIsNearEdge] = useState(false)

  // Track if mouse is near screen edge for auto-hide
  useEffect(() => {
    if (!dockAutoHide) {
      setIsNearEdge(true)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const pos = dockPosition || 'bottom'
      if (pos === 'bottom') {
        setIsNearEdge(window.innerHeight - e.clientY < 32)
      } else if (pos === 'left') {
        setIsNearEdge(e.clientX < 32)
      } else if (pos === 'right') {
        setIsNearEdge(window.innerWidth - e.clientX < 32)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [dockAutoHide, dockPosition])

  const base = dockSize || 52
  const pos = dockPosition || 'bottom'
  const isVisible = !dockAutoHide || isHovered || isNearEdge

  const handleAppClick = (app: AppDef) => {
    const existing = windows.find((w) => w.id === app.id)

    if (!existing) {
      const offset = (windows.filter((w) => w.isOpen).length % 6) * 22
      const x = Math.max(30, Math.round((window.innerWidth - app.defaultWidth) / 2 + offset))
      const y = Math.max(48, Math.round((window.innerHeight - app.defaultHeight) / 2 - 28 + offset))

      openWindow({
        id: app.id,
        title: app.label,
        isOpen: true,
        isMinimized: false,
        position: { x, y },
        size: { width: app.defaultWidth, height: app.defaultHeight },
      })
    } else if (existing.isMinimized) {
      restoreWindow(existing.id)
    } else if (activeWindowId === existing.id) {
      // already focused
    } else {
      focusWindow(existing.id)
    }
  }

  // Positioning container style
  const getContainerStyle = (): React.CSSProperties => {
    if (pos === 'left') {
      return {
        position: 'fixed',
        left: isVisible ? 10 : -120,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9998,
        transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'visible',
      }
    }
    if (pos === 'right') {
      return {
        position: 'fixed',
        right: isVisible ? 10 : -120,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9998,
        transition: 'right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'visible',
      }
    }
    return {
      position: 'fixed',
      bottom: isVisible ? 10 : -120,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9998,
      transition: 'bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      overflow: 'visible',
    }
  }

  const isRow = pos === 'bottom'

  return (
    <div style={getContainerStyle()}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          mouseCoord.set(Infinity)
        }}
        onMouseMove={(e) => {
          if (isRow) {
            mouseCoord.set(e.clientX)
          } else {
            mouseCoord.set(e.clientY)
          }
        }}
        style={{
          display: 'flex',
          flexDirection: isRow ? 'row' : 'column',
          alignItems: isRow ? 'flex-end' : 'center',
          gap: Math.max(6, Math.round(base * 0.16)),
          padding: isRow ? '10px 14px' : '14px 10px',
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(48px) saturate(180%)',
          WebkitBackdropFilter: 'blur(48px) saturate(180%)',
          borderRadius: 22,
          border: '0.5px solid rgba(255,255,255,0.26)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.18)',
          overflow: 'visible',
        }}
      >
        {GROUP_1.map((app) => {
          const isOpen = windows.some((w) => w.id === app.id && !w.isMinimized)
          return (
            <DockIcon
              key={app.id}
              id={app.id}
              mouseCoord={mouseCoord}
              src={app.src}
              label={app.label}
              isOpen={isOpen}
              baseSize={base}
              magnification={dockMagnification}
              dockPos={pos}
              onClick={() => handleAppClick(app)}
            />
          )
        })}

        <DockSeparator baseSize={base} dockPos={pos} />

        {GROUP_2.map((app) => {
          const isOpen = windows.some((w) => w.id === app.id && !w.isMinimized)
          return (
            <DockIcon
              key={app.id}
              id={app.id}
              mouseCoord={mouseCoord}
              src={app.src}
              label={app.label}
              isOpen={isOpen}
              baseSize={base}
              magnification={dockMagnification}
              dockPos={pos}
              onClick={() => handleAppClick(app)}
            />
          )
        })}
      </motion.div>
    </div>
  )
}