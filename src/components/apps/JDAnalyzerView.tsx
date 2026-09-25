'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  analyzeJobDescription,
  JD_PRESETS,
  JDAnalysisResult,
  JDPreset,
} from '@/lib/agent/jdAnalyzer'
import { useWindowStore } from '@/app/store/windowStore'
import { ActionPill } from '@/lib/agent/types'

export default function JDAnalyzerView() {
  const { openFinderFile, openTerminalCmd, closeAssistant } = useWindowStore()

  const [rawText, setRawText] = useState('')
  const [activePresetId, setActivePresetId] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<JDAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Handle Preset Click
  const handleSelectPreset = (preset: JDPreset) => {
    setActivePresetId(preset.id)
    setRawText(preset.rawText)
    setIsAnalyzing(true)

    // Simulate snappy AI evaluation
    setTimeout(() => {
      const res = analyzeJobDescription(preset.rawText)
      setAnalysis(res)
      setIsAnalyzing(false)
    }, 280)
  }

  // Handle Custom Analysis
  const handleAnalyzeCustom = () => {
    if (!rawText.trim()) return
    setIsAnalyzing(true)

    setTimeout(() => {
      const res = analyzeJobDescription(rawText)
      setAnalysis(res)
      setIsAnalyzing(false)
    }, 320)
  }

  // Handle Pill Execution
  const handleExecutePill = (pill: ActionPill) => {
    closeAssistant()
    if (pill.actionType === 'open_file') {
      openFinderFile(pill.payload)
    } else if (pill.actionType === 'open_terminal') {
      openTerminalCmd(pill.payload)
    } else if (pill.actionType === 'contact') {
      window.location.href = `mailto:${pill.payload}?subject=Interview%20Inquiry%20from%20Portfolio%20JD%20Analyzer`
    }
  }

  // Reset / Clear
  const handleClear = () => {
    setRawText('')
    setActivePresetId(null)
    setAnalysis(null)
  }

  return (
    <div
      className="no-scrollbar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px 20px 24px',
        maxHeight: '68vh',
        overflowY: 'auto',
      }}
    >
      {/* ─── 1. PRESET BUTTONS (1-Click Demo for Recruiters) ───────────────── */}
      <div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.45)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '8px',
          }}
        >
          Quick Recruiter Presets
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {JD_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                style={{
                  background: isSelected
                    ? 'rgba(0, 122, 255, 0.22)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: isSelected
                    ? '1px solid #007AFF'
                    : '0.5px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  color: isSelected ? '#5ac8fa' : '#dedee2',
                  fontSize: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>⚡</span>
                <span>{preset.title}</span>
                <span
                  style={{
                    fontSize: '10px',
                    opacity: 0.6,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {preset.badge}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── 2. RAW JD INPUT AREA ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value)
              if (activePresetId) setActivePresetId(null)
            }}
            placeholder="Paste any Job Description, requirements list, or tech stack here..."
            rows={4}
            spellCheck={false}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              border: '0.5px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '12px',
              padding: '12px 14px',
              color: '#dedee2',
              fontSize: '13px',
              lineHeight: 1.45,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#007AFF')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)')}
          />
        </div>

        {/* Buttons Row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {rawText && (
            <button
              onClick={handleClear}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.45)',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '8px',
              }}
            >
              Clear
            </button>
          )}

          <button
            onClick={handleAnalyzeCustom}
            disabled={!rawText.trim() || isAnalyzing}
            style={{
              backgroundColor: rawText.trim() && !isAnalyzing ? '#007AFF' : 'rgba(255, 255, 255, 0.08)',
              color: rawText.trim() && !isAnalyzing ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: rawText.trim() && !isAnalyzing ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: rawText.trim() && !isAnalyzing ? '0 4px 12px rgba(0, 122, 255, 0.35)' : 'none',
            }}
          >
            {isAnalyzing ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'macos-spin 0.8s linear infinite',
                  }}
                />
                Analyzing Requirements...
              </>
            ) : (
              <>
                <span>✦</span>
                <span>Analyze Job Fit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── 3. ANALYSIS RESULTS VIEW ───────────────────────────────────────── */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginTop: '4px',
            }}
          >
            {/* Score & Verdict Card */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Circular Score Badge */}
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background:
                    analysis.overallScore >= 90
                      ? 'linear-gradient(135deg, #30d158 0%, #007AFF 100%)'
                      : 'linear-gradient(135deg, #007AFF 0%, #af52de 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 8px 24px rgba(0, 122, 255, 0.35)',
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {analysis.overallScore}%
                </span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>
                  MATCH
                </span>
              </div>

              {/* Verdict Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#ffffff',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {analysis.fitRating}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#30d158',
                      backgroundColor: 'rgba(48, 209, 88, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    Verified Experience
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    lineHeight: 1.45,
                    marginTop: '4px',
                  }}
                >
                  {analysis.summary}
                </div>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '8px',
              }}
            >
              {[
                { label: 'Core Engineering', score: analysis.breakdown.coreSkills },
                { label: 'AI & LangGraph', score: analysis.breakdown.aiAndWorkflows },
                { label: 'Async Reliability', score: analysis.breakdown.systemReliability },
                { label: 'End-to-End Ownership', score: analysis.breakdown.fullStackOwnership },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '0.5px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
                    <span>{item.label}</span>
                    <span style={{ color: '#5ac8fa', fontWeight: 600 }}>{item.score}%</span>
                  </div>
                  <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.score}%`,
                        backgroundColor: '#007AFF',
                        borderRadius: '2px',
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Matching Skills Tags */}
            {analysis.matchedSkills.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.45)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '8px',
                  }}
                >
                  Directly Matched Competencies
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {analysis.matchedSkills.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: 'rgba(48, 209, 88, 0.12)',
                        border: '0.5px solid rgba(48, 209, 88, 0.3)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '11.5px',
                        color: '#6ee7b7',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>✓</span>
                      <span>{s.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Project Evidence Cards (Clickable Finder Links) */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Verified Project Evidence</span>
                <span style={{ fontSize: '10px', color: '#5ac8fa' }}>Click to inspect in OS</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analysis.keyEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '0.5px solid rgba(255, 255, 255, 0.09)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                          {ev.projectTitle}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#5ac8fa', marginTop: '2px', fontWeight: 500 }}>
                          {ev.metric}
                        </div>
                      </div>

                      {/* OS Action Buttons */}
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => {
                            closeAssistant()
                            openFinderFile(ev.finderFile)
                          }}
                          style={{
                            background: 'rgba(0, 122, 255, 0.18)',
                            border: '0.5px solid #007AFF',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 500,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>📁</span>
                          <span>Open in Finder</span>
                        </button>

                        {ev.terminalCmd && (
                          <button
                            onClick={() => {
                              closeAssistant()
                              openTerminalCmd(ev.terminalCmd)
                            }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '0.5px solid rgba(255, 255, 255, 0.18)',
                              color: '#dedee2',
                              fontSize: '11px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>⚡</span>
                            <span>Verify in Terminal</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.45 }}>
                      {ev.explanation}
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {ev.tags.map((t, ti) => (
                        <span
                          key={ti}
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.45)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '1px 5px',
                            borderRadius: '4px',
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Honest Technical Nuance / Gaps */}
            {analysis.missingOrNuancedSkills.length > 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 149, 0, 0.08)',
                  border: '0.5px solid rgba(255, 149, 0, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#ff9500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>ℹ</span>
                  <span>Honest Nuances & Adjacent Experience</span>
                </div>
                {analysis.missingOrNuancedSkills.map((m, mi) => (
                  <div key={mi} style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.4 }}>
                    <strong style={{ color: '#dedee2' }}>{m.name}:</strong> {m.note}
                  </div>
                ))}
              </div>
            )}

            {/* Fast Action Pills Footer */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
              {analysis.actionPills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => handleExecutePill(pill)}
                  style={{
                    background: 'rgba(0, 122, 255, 0.12)',
                    border: '0.5px solid rgba(0, 122, 255, 0.35)',
                    color: '#5ac8fa',
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.25)'
                    e.currentTarget.style.borderColor = '#007AFF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.12)'
                    e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.35)'
                  }}
                >
                  <span>
                    {pill.icon === 'finder' && '📁'}
                    {pill.icon === 'terminal' && '⚡'}
                    {pill.icon === 'file' && '📄'}
                    {pill.icon === 'email' && '✉️'}
                  </span>
                  {pill.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
