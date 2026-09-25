'use client'

import React, { useEffect, useRef } from 'react'

interface ScreensaverProps {
  onDismiss: () => void
}

export default function Screensaver({ onDismiss }: ScreensaverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Starfield Warp
    const numStars = 400
    const stars: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width,
      })
    }

    const speed = 4.5

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 14, 0.25)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        star.z -= speed

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width * 2
          star.y = (Math.random() - 0.5) * canvas.height * 2
          star.z = canvas.width
        }

        const k = 220 / star.z
        const px = star.x * k + cx
        const py = star.y * k + cy

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          const size = Math.max(0.8, (1 - star.z / canvas.width) * 2.8)
          const shade = Math.min(255, Math.floor((1 - star.z / canvas.width) * 255))
          ctx.fillStyle = `rgb(${shade}, ${shade}, ${Math.min(255, shade + 30)})`
          ctx.beginPath()
          ctx.arc(px, py, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleInput = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      onDismiss()
    }

    window.addEventListener('keydown', handleInput)
    window.addEventListener('mousemove', handleInput)
    window.addEventListener('pointerdown', handleInput)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleInput)
      window.removeEventListener('mousemove', handleInput)
      window.removeEventListener('pointerdown', handleInput)
      cancelAnimationFrame(animationFrameId)
    }
  }, [onDismiss])

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        backgroundColor: '#0a0a0e',
        cursor: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 12,
          fontFamily: '"SF Mono", "Menlo", monospace',
          color: 'rgba(255, 255, 255, 0.45)',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
        }}
      >
        PORTFOLIO OS — STARFIELD IDLE SCREENSAVER
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 20,
          fontSize: 11,
          fontFamily: '"SF Mono", "Menlo", monospace',
          color: 'rgba(255, 255, 255, 0.3)',
          pointerEvents: 'none',
        }}
      >
        Press any key to wake terminal
      </div>
    </div>
  )
}
