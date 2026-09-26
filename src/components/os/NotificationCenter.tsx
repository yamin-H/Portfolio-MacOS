'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calendar,
  CloudSun,
  BatteryCharging,
  Clock,
  CheckCircle2,
  Circle,
  BarChart3,
  GitPullRequest,
  MessageCircle,
  Mail,
  FileText,
  Terminal,
  ExternalLink,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { useWindowStore, NotificationItem } from '@/app/store/windowStore'
import { soundEngine } from '@/lib/sound/soundEngine'

interface ReminderItem {
  id: string
  text: string
  completed: boolean
  tag?: string
}

const INITIAL_REMINDERS: ReminderItem[] = [
  { id: 'rem-1', text: 'Ship macOS Control Center & Widgets', completed: false, tag: 'High Priority' },
  { id: 'rem-2', text: 'Test Web Audio sound synthesizer', completed: false, tag: 'Polish' },
  { id: 'rem-3', text: 'Review PR #7074 in Remotion OSS', completed: true, tag: 'Merged' },
  { id: 'rem-4', text: 'Deploy Portfolio OS 2.0 release', completed: false, tag: 'Release' },
]

export default function NotificationCenter() {
  const {
    isNotificationCenterOpen,
    closeNotificationCenter,
    notifications,
    dismissNotification,
    clearAllNotifications,
    openFinderFile,
    openTerminalCmd,
  } = useWindowStore()

  const [time, setTime] = useState(new Date())
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS)
  const [copiedEmail, setCopiedEmail] = useState(false)

  // Keep live time ticking
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Keyboard shortcut: Escape or Cmd+N to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        useWindowStore.getState().toggleNotificationCenter()
        return
      }
      if (e.key === 'Escape' && useWindowStore.getState().isNotificationCenterOpen) {
        closeNotificationCenter()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeNotificationCenter])

  const toggleReminder = (id: string) => {
    soundEngine.play('click')
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    )
  }

  const handleCopyEmail = () => {
    soundEngine.play('action')
    navigator.clipboard.writeText('yamindr3@gmail.com')
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2400)
    window.location.href = 'mailto:yamindr3@gmail.com?subject=Engineering%20Opportunity%20from%20Portfolio'
  }

  const currentDateFormatted = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  if (!isNotificationCenterOpen) return null

  return (
    <AnimatePresence>
      <div
        onClick={closeNotificationCenter}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          backgroundColor: 'transparent',
          pointerEvents: 'auto',
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
          style={{
            position: 'fixed',
            top: 36,
            right: 12,
            bottom: 12,
            width: 380,
            maxWidth: '92vw',
            backgroundColor: 'rgba(26, 28, 36, 0.82)',
            backdropFilter: 'blur(50px) saturate(210%)',
            WebkitBackdropFilter: 'blur(50px) saturate(210%)',
            borderRadius: '24px',
            border: '0.5px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.65), 0 4px 16px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            userSelect: 'none',
            zIndex: 9991,
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {/* ─── Top Bar / Header ─────────────────────────────────────────────── */}
          <div
            style={{
              padding: '16px 20px 12px',
              borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.45)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {currentDateFormatted}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  marginTop: '1px',
                }}
              >
                Notification Center
              </div>
            </div>

            <button
              onClick={closeNotificationCenter}
              title="Close (Esc)"
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* ─── Scrollable Content: Notifications & Widgets ─────────────────── */}
          <div
            className="no-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* 1. STACKED APPLE NOTIFICATIONS SECTION                             */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {notifications.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Notifications ({notifications.length})
                  </span>
                  <button
                    onClick={clearAllNotifications}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: '2px 4px',
                    }}
                  >
                    Clear All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <AnimatePresence>
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(30px)',
                          borderRadius: '16px',
                          border: '0.5px solid rgba(255, 255, 255, 0.12)',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          position: 'relative',
                        }}
                      >
                        {/* Notification Header (App Icon + Name + Time + Dismiss) */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 4,
                                backgroundColor:
                                  notif.app === 'Calendar' ? '#FF3B30' :
                                  notif.app === 'GitHub' ? '#24292E' :
                                  notif.app === 'Messages' ? '#34C759' : '#FF9500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {notif.app === 'Calendar' && <Calendar size={11} color="#FFF" />}
                              {notif.app === 'GitHub' && <GitPullRequest size={11} color="#FFF" />}
                              {notif.app === 'Messages' && <MessageCircle size={11} color="#FFF" />}
                              {notif.app === 'Reminders' && <CheckCircle2 size={11} color="#FFF" />}
                            </div>
                            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                              {notif.app}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.4)' }}>
                              {notif.timeAgo}
                            </span>
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              title="Dismiss"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.35)',
                                cursor: 'pointer',
                                padding: 2,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Title & Body */}
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.25 }}>
                            {notif.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', marginTop: 2, lineHeight: 1.35 }}>
                            {notif.body}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {notif.actionLabel && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                            <button
                              onClick={() => {
                                soundEngine.play('action')
                                if (notif.app === 'Calendar') {
                                  window.open('https://meet.google.com', '_blank')
                                } else if (notif.app === 'GitHub') {
                                  window.open('https://github.com/remotion-dev/remotion/pull/7074', '_blank')
                                } else if (notif.app === 'Messages') {
                                  handleCopyEmail()
                                }
                                dismissNotification(notif.id)
                              }}
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                border: '0.5px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                padding: '4px 10px',
                                color: '#FFFFFF',
                                fontSize: '11px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease',
                              }}
                            >
                              {notif.actionLabel}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* 2. APPLE WIDGETKIT WIDGETS SECTION                                 */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', marginTop: 4 }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Widgets
              </span>
            </div>

            {/* ── WIDGET A: WEATHER WIDGET (Medium Apple Sky Gradient) ────────── */}
            <div
              style={{
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #2B76D9 0%, #5E9EF6 100%)',
                padding: '14px 16px',
                color: '#FFFFFF',
                boxShadow: '0 4px 18px rgba(43, 118, 217, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Cupertino</div>
                  <div style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 2 }}>
                    72°
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <CloudSun size={28} />
                  <span style={{ fontSize: '11.5px', fontWeight: 500, marginTop: 4 }}>Mostly Sunny</span>
                  <span style={{ fontSize: '10.5px', opacity: 0.85 }}>H: 78° L: 54°</span>
                </div>
              </div>

              {/* Hourly Forecast */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, borderTop: '0.5px solid rgba(255, 255, 255, 0.25)', paddingTop: 8 }}>
                {[
                  { hour: 'Now', temp: '72°', icon: '☀️' },
                  { hour: '2PM', temp: '75°', icon: '☀️' },
                  { hour: '3PM', temp: '76°', icon: '🌤️' },
                  { hour: '4PM', temp: '74°', icon: '🌤️' },
                  { hour: '5PM', temp: '70°', icon: '⛅' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: '10px', opacity: 0.85 }}>{item.hour}</span>
                    <span style={{ fontSize: '13px' }}>{item.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.temp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── WIDGET B: CALENDAR MINI-GRID WIDGET ──────────────────────────── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#FF3B30', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  September 2026
                </span>
                <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Today
                </span>
              </div>

              {/* Mini Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i} style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.4)' }}>
                    {d}
                  </span>
                ))}
                {[20, 21, 22, 23, 24, 25, 26].map((day, i) => {
                  const isToday = day === 24
                  return (
                    <div
                      key={i}
                      style={{
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor: isToday ? '#FF3B30' : 'transparent',
                        color: isToday ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                        fontSize: '11px',
                        fontWeight: isToday ? 700 : 500,
                      }}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>

              {/* Upcoming Event Card */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '0.5px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  borderLeft: '3px solid #FF3B30',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Architecture & Vision Review</span>
                  <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.55)', marginTop: 1 }}>
                    3:30 PM – 4:30 PM · Google Meet
                  </span>
                </div>
              </div>
            </div>

            {/* ── WIDGET C: BATTERY RINGS WIDGET ───────────────────────────────── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Batteries
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { name: 'MacBook', level: 94, icon: '💻' },
                  { name: 'AirPods', level: 84, icon: '🎧' },
                  { name: 'Keyboard', level: 92, icon: '⌨️' },
                  { name: 'Trackpad', level: 76, icon: '🖱️' },
                ].map((dev) => (
                  <div
                    key={dev.name}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {/* Circular Arc Ring */}
                    <div style={{ position: 'relative', width: 44, height: 44 }}>
                      <svg width="44" height="44" viewBox="0 0 44 44">
                        <circle
                          cx="22"
                          cy="22"
                          r="18"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.12)"
                          strokeWidth="3.5"
                        />
                        <circle
                          cx="22"
                          cy="22"
                          r="18"
                          fill="none"
                          stroke="#34C759"
                          strokeWidth="3.5"
                          strokeDasharray={2 * Math.PI * 18}
                          strokeDashoffset={2 * Math.PI * 18 * (1 - dev.level / 100)}
                          strokeLinecap="round"
                          transform="rotate(-90 22 22)"
                        />
                      </svg>
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '15px',
                        }}
                      >
                        {dev.icon}
                      </div>
                    </div>

                    <span style={{ fontSize: '11.5px', fontWeight: 600 }}>{dev.level}%</span>
                    <span style={{ fontSize: '9.5px', color: 'rgba(255, 255, 255, 0.5)' }}>{dev.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── WIDGET D: INTERACTIVE REMINDERS CHECKLIST ────────────────────── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#FF9500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Reminders
                </span>
                <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {reminders.filter((r) => !r.completed).length} remaining
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => toggleReminder(rem.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 0',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ color: rem.completed ? '#FF9500' : 'rgba(255, 255, 255, 0.35)', flexShrink: 0 }}>
                      {rem.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </div>
                    <span
                      style={{
                        fontSize: '11.5px',
                        color: rem.completed ? 'rgba(255, 255, 255, 0.4)' : '#FFFFFF',
                        textDecoration: rem.completed ? 'line-through' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {rem.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── WIDGET E: SCREEN TIME USAGE ─────────────────────────────────── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#AF52DE', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Screen Time
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#30D158' }}>
                  -14% vs last week
                </span>
              </div>

              <div>
                <div style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em' }}>
                  5h 42m
                </div>
                <div style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.55)', marginTop: 1 }}>
                  Daily Average · Productivity & Dev
                </div>
              </div>

              {/* Segmented Bar */}
              <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
                <div style={{ width: '48%', backgroundColor: '#007AFF', borderRadius: '4px 0 0 4px' }} title="Developer: 2h 45m" />
                <div style={{ width: '28%', backgroundColor: '#FF9500' }} title="Productivity: 1h 35m" />
                <div style={{ width: '24%', backgroundColor: '#FF2D55', borderRadius: '0 4px 4px 0' }} title="Design: 1h 22m" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                <span>🔵 Developer (48%)</span>
                <span>🟠 Productivity (28%)</span>
                <span>🔴 Design (24%)</span>
              </div>
            </div>

            {/* ── WIDGET F: RECRUITER FAST-TRACK (Integrated Elegantly) ───────── */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Recruiter Fast-Track
              </div>

              <button
                onClick={handleCopyEmail}
                style={{
                  backgroundColor: copiedEmail ? '#34C759' : '#007AFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(0, 122, 255, 0.35)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Mail size={14} />
                <span>{copiedEmail ? 'Copied yamindr3@gmail.com!' : 'Email Yamin Hossain'}</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  onClick={() => {
                    closeNotificationCenter()
                    openFinderFile('Resume/yamin_resume.pdf')
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '0.5px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <FileText size={13} color="#007AFF" />
                  <span>Resume PDF</span>
                </button>

                <button
                  onClick={() => {
                    closeNotificationCenter()
                    openTerminalCmd('sudo hire yamin')
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '0.5px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Terminal size={13} color="#34C759" />
                  <span>Terminal Cmd</span>
                </button>
              </div>
            </div>

            {/* ── Bottom: "Edit Widgets" Button ──────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 10px' }}>
              <button
                onClick={() => {
                  soundEngine.play('pop')
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '0.5px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '16px',
                  padding: '6px 16px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Plus size={12} />
                Edit Widgets
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
