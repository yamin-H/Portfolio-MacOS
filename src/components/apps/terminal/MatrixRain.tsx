'use client'

import React, { useEffect, useRef } from 'react'

interface MatrixRainProps {
  onClose: () => void
}

export default function MatrixRain({ onClose }: MatrixRainProps) {
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

    const characters =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{};:[]*+=!?'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50)
    }

    const draw = () => {
      // Translucent black overlay for trail effect
      ctx.fillStyle = 'rgba(10, 16, 12, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px "SF Mono", "Menlo", monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Head character is bright white-green, body is matrix green
        if (Math.random() > 0.88) {
          ctx.fillStyle = '#ffffff'
        } else {
          ctx.fillStyle = '#00ff66'
        }

        ctx.fillText(text, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(animationFrameId)
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        backgroundColor: '#0a100c',
        cursor: 'pointer',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 16,
          fontSize: 11,
          fontFamily: '"SF Mono", monospace',
          color: 'rgba(0, 255, 102, 0.5)',
          pointerEvents: 'none',
        }}
      >
        Press any key to exit Matrix mode
      </div>
    </div>
  )
}
