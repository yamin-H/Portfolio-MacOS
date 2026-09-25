'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/app/store/windowStore'

export default function WindowSnapOverlay() {
  const { snapPreview } = useWindowStore()

  if (!snapPreview) return null

  return (
    <AnimatePresence>
      <motion.div
        key="snap-preview-ghost"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        style={{
          position: 'fixed',
          left: snapPreview.x,
          top: snapPreview.y,
          width: snapPreview.width,
          height: snapPreview.height,
          borderRadius: 18,
          backgroundColor: 'rgba(0, 122, 255, 0.18)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '2px solid rgba(0, 122, 255, 0.75)',
          boxShadow: '0 0 35px rgba(0, 122, 255, 0.4), inset 0 0 20px rgba(0, 122, 255, 0.2)',
          zIndex: 8990,
          pointerEvents: 'none',
        }}
      />
    </AnimatePresence>
  )
}
