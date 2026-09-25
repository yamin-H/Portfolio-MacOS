'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowContext } from '@/app/components/os/Window'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'

export type CalcMode = 'programmer' | 'scientific' | 'basic'
export type NumberBase = 8 | 10 | 16
export type TextEncoding = 'ascii' | 'unicode'

export default function Calculator() {
  const windowContext = useWindowContext()

  // ── States ─────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<CalcMode>('programmer')
  const [base, setBase] = useState<NumberBase>(16) // Default 16 as in reference image
  const [encoding, setEncoding] = useState<TextEncoding>('unicode')
  const [showBinary, setShowBinary] = useState<boolean>(true)
  const [isRad, setIsRad] = useState<boolean>(false) // Deg vs Rad for scientific
  const [is2nd, setIs2nd] = useState<boolean>(false) // 2nd function toggle for scientific
  const [isModeMenuOpen, setIsModeMenuOpen] = useState<boolean>(false)
  const [memory, setMemory] = useState<number>(0)

  // Core Calculator Engine State
  const [displayValue, setDisplayValue] = useState<string>('0')
  const [pendingValue, setPendingValue] = useState<number | bigint | null>(null)
  const [pendingOperator, setPendingOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false)

  // ── BigInt Value Representation for Programmer Mode ────────────────────────
  const currentBigInt = useMemo(() => {
    try {
      if (mode === 'programmer') {
        if (base === 16) {
          const clean = displayValue.replace(/[^0-9a-fA-F-]/g, '')
          const hex = clean.replace('-', '')
          if (!hex) return BigInt(0)
          return BigInt((clean.startsWith('-') ? '-' : '') + '0x' + hex)
        } else if (base === 8) {
          const clean = displayValue.replace(/[^0-7-]/g, '')
          const oct = clean.replace('-', '')
          if (!oct) return BigInt(0)
          return BigInt((clean.startsWith('-') ? '-' : '') + '0o' + oct)
        } else {
          const clean = displayValue.replace(/[^0-9-]/g, '')
          const dec = clean.replace('-', '')
          if (!dec) return BigInt(0)
          return BigInt((clean.startsWith('-') ? '-' : '') + dec)
        }
      }
      const parsed = Math.floor(parseFloat(displayValue) || 0)
      if (!isFinite(parsed)) return BigInt(0)
      return BigInt(parsed)
    } catch {
      return BigInt(0)
    }
  }, [displayValue, base, mode])

  // ── 64-bit Binary Representation (Two 32-bit rows of 8 nibbles) ───────────
  const binary64Bits = useMemo(() => {
    // Treat as unsigned 64-bit BigInt
    const u64 = BigInt.asUintN(64, currentBigInt)
    let binStr = u64.toString(2).padStart(64, '0')
    if (binStr.length > 64) binStr = binStr.slice(-64)

    // Split into 16 nibbles (4 bits each)
    const nibbles: string[] = []
    for (let i = 0; i < 64; i += 4) {
      nibbles.push(binStr.slice(i, i + 4))
    }
    // Row 1: Bits 63 to 32 (nibbles 0 to 7)
    // Row 2: Bits 31 to 0 (nibbles 8 to 15)
    return {
      row1: nibbles.slice(0, 8),
      row2: nibbles.slice(8, 16),
      raw: binStr,
    }
  }, [currentBigInt])

  // ── Character Encoding Preview (ASCII / Unicode) ───────────────────────────
  const characterPreview = useMemo(() => {
    try {
      const code = Number(BigInt.asUintN(32, currentBigInt))
      if (code <= 0) return ''
      if (encoding === 'ascii') {
        if (code >= 32 && code <= 126) return String.fromCharCode(code)
        return `\\x${code.toString(16).padStart(2, '0')}`
      } else {
        if (code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)) {
          return String.fromCodePoint(code)
        }
        return ''
      }
    } catch {
      return ''
    }
  }, [currentBigInt, encoding])

  // ── Helper: Format Output For Current Base ─────────────────────────────────
  const formatValueForBase = (val: bigint, targetBase: NumberBase): string => {
    try {
      if (targetBase === 16) {
        const isNeg = val < BigInt(0)
        const absVal = isNeg ? -val : val
        return (isNeg ? '-' : '') + absVal.toString(16).toUpperCase()
      } else if (targetBase === 8) {
        return val.toString(8)
      } else {
        return val.toString(10)
      }
    } catch {
      return '0'
    }
  }

  // ── Base Change Handler ────────────────────────────────────────────────────
  const handleBaseChange = (newBase: NumberBase) => {
    soundEngine.play('click')
    if (newBase === base) return
    const formatted = formatValueForBase(currentBigInt, newBase)
    setDisplayValue(formatted)
    setBase(newBase)
  }

  // ── Digit Input ────────────────────────────────────────────────────────────
  const inputDigit = (digit: string) => {
    soundEngine.play('click')
    if (waitingForOperand) {
      setDisplayValue(digit)
      setWaitingForOperand(false)
    } else {
      if (displayValue === '0' || displayValue === 'Error') {
        setDisplayValue(digit)
      } else {
        // Enforce max length
        if (displayValue.length < 18) {
          setDisplayValue(displayValue + digit)
        }
      }
    }
  }

  // ── Operator Execution ─────────────────────────────────────────────────────
  const performOperation = (nextOperator: string) => {
    soundEngine.play('click')
    const inputValue =
      mode === 'programmer'
        ? currentBigInt
        : parseFloat(displayValue) || 0

    if (pendingValue === null) {
      setPendingValue(inputValue)
    } else if (pendingOperator) {
      const currentValue = pendingValue
      let result: number | bigint = 0

      try {
        if (mode === 'programmer') {
          const a = BigInt(currentValue)
          const b = BigInt(inputValue)
          switch (pendingOperator) {
            case '+':
              result = a + b
              break
            case '−':
            case '-':
              result = a - b
              break
            case '×':
            case '*':
              result = a * b
              break
            case '÷':
            case '/':
              result = b !== BigInt(0) ? a / b : BigInt(0)
              break
            case 'mod':
              result = b !== BigInt(0) ? a % b : BigInt(0)
              break
            case 'AND':
              result = a & b
              break
            case 'OR':
              result = a | b
              break
            case 'XOR':
              result = a ^ b
              break
            case 'NOR':
              result = ~(a | b)
              break
            case '<<':
              result = a << (b & BigInt(63))
              break
            case '>>':
              result = a >> (b & BigInt(63))
              break
            case 'X<<Y':
              result = a << (b & BigInt(63))
              break
            case 'X>>Y':
              result = a >> (b & BigInt(63))
              break
            default:
              result = b
          }
          result = BigInt.asIntN(64, result)
          setDisplayValue(formatValueForBase(result, base))
        } else {
          const a = Number(currentValue)
          const b = Number(inputValue)
          switch (pendingOperator) {
            case '+':
              result = a + b
              break
            case '−':
            case '-':
              result = a - b
              break
            case '×':
            case '*':
              result = a * b
              break
            case '÷':
            case '/':
              result = b !== 0 ? a / b : NaN
              break
            case 'y^x':
            case 'xʸ':
              result = Math.pow(a, b)
              break
            case 'ʸ√x':
              result = Math.pow(a, 1 / b)
              break
            case 'EE':
              result = a * Math.pow(10, b)
              break
            default:
              result = b
          }
          if (isNaN(result) || !isFinite(result)) {
            setDisplayValue('Error')
          } else {
            // Trim precision nicely
            const strRes = String(Math.round(result * 1e12) / 1e12)
            setDisplayValue(strRes)
          }
        }
      } catch {
        setDisplayValue('Error')
      }

      setPendingValue(result)
    }

    setWaitingForOperand(true)
    setPendingOperator(nextOperator === '=' ? null : nextOperator)
  }

  // ── Immediate Unary Operations ─────────────────────────────────────────────
  const performUnary = (op: string) => {
    soundEngine.play('click')
    try {
      if (mode === 'programmer') {
        const val = currentBigInt
        let res = val
        switch (op) {
          case 'NOT':
            res = BigInt.asIntN(64, ~val)
            break
          case 'NEG':
            res = BigInt.asIntN(64, -val)
            break
          case 'RoL': // Rotate Left 1 bit
            {
              const u = BigInt.asUintN(64, val)
              const msb = (u >> BigInt(63)) & BigInt(1)
              res = BigInt.asIntN(64, (u << BigInt(1)) | msb)
            }
            break
          case 'RoR': // Rotate Right 1 bit
            {
              const u = BigInt.asUintN(64, val)
              const lsb = u & BigInt(1)
              res = BigInt.asIntN(64, (u >> BigInt(1)) | (lsb << BigInt(63)))
            }
            break
          case 'flip16':
            res = BigInt.asIntN(64, val ^ BigInt('0xFFFF'))
            break
          case 'flip64':
            res = BigInt.asIntN(64, val ^ BigInt('0xFFFFFFFFFFFFFFFF'))
            break
          case 'FF':
            if (displayValue === '0' || waitingForOperand) {
              setDisplayValue('FF')
              setWaitingForOperand(false)
            } else if (displayValue.length < 16) {
              setDisplayValue(displayValue + 'FF')
            }
            return
          case '00':
            inputDigit('0')
            inputDigit('0')
            return
        }
        setDisplayValue(formatValueForBase(res, base))
      } else {
        const num = parseFloat(displayValue) || 0
        let res = num
        switch (op) {
          case '±':
            res = -num
            break
          case '%':
            res = num / 100
            break
          case 'x²':
            res = num * num
            break
          case 'x³':
            res = num * num * num
            break
          case '1/x':
            res = 1 / num
            break
          case '²√x':
          case '√':
            res = Math.sqrt(num)
            break
          case '³√x':
            res = Math.cbrt(num)
            break
          case 'ln':
            res = Math.log(num)
            break
          case 'log₁₀':
            res = Math.log10(num)
            break
          case 'eˣ':
            res = Math.exp(num)
            break
          case '10ˣ':
            res = Math.pow(10, num)
            break
          case 'sin':
            res = Math.sin(isRad ? num : (num * Math.PI) / 180)
            break
          case 'cos':
            res = Math.cos(isRad ? num : (num * Math.PI) / 180)
            break
          case 'tan':
            res = Math.tan(isRad ? num : (num * Math.PI) / 180)
            break
          case 'sinh':
            res = Math.sinh(num)
            break
          case 'cosh':
            res = Math.cosh(num)
            break
          case 'tanh':
            res = Math.tanh(num)
            break
          case 'x!':
            {
              let f = 1
              for (let i = 2; i <= Math.min(120, Math.floor(num)); i++) f *= i
              res = f
            }
            break
          case 'π':
            res = Math.PI
            break
          case 'e':
            res = Math.E
            break
          case 'Rand':
            res = Math.random()
            break
        }
        if (isNaN(res) || !isFinite(res)) {
          setDisplayValue('Error')
        } else {
          setDisplayValue(String(Math.round(res * 1e12) / 1e12))
        }
      }
    } catch {
      setDisplayValue('Error')
    }
  }

  // ── Clear / All Clear ──────────────────────────────────────────────────────
  const handleClear = () => {
    soundEngine.play('pop')
    setDisplayValue('0')
    setPendingValue(null)
    setPendingOperator(null)
    setWaitingForOperand(false)
  }

  // ── Direct Bit Toggle on the 64-bit Binary Grid ───────────────────────────
  const handleToggleBit = (bitIndex: number) => {
    soundEngine.play('click')
    const bitPos = BigInt(63 - bitIndex)
    const mask = BigInt(1) << bitPos
    const nextVal = BigInt.asIntN(64, currentBigInt ^ mask)
    setDisplayValue(formatValueForBase(nextVal, base))
  }

  // ── Mode Switcher Function (Explicit User Action Only — No Infinite Loop) ──
  const handleSwitchMode = useCallback((newMode: CalcMode) => {
    if (newMode === mode) return
    soundEngine.play('pop')
    setMode(newMode)
    if (newMode === 'basic') {
      windowContext?.resizeWindow?.(280, 400)
    } else if (newMode === 'scientific') {
      windowContext?.resizeWindow?.(580, 420)
    } else if (newMode === 'programmer') {
      windowContext?.resizeWindow?.(380, 540)
    }
  }, [mode, windowContext])

  // ── Physical Keyboard Input Listener ───────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is active elsewhere
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return
      }

      // Mode Switch Shortcuts: ⌘1 (Basic), ⌘2 (Scientific), ⌘3 (Programmer)
      if ((e.metaKey || e.ctrlKey) && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault()
        if (e.key === '1') handleSwitchMode('basic')
        else if (e.key === '2') handleSwitchMode('scientific')
        else if (e.key === '3') handleSwitchMode('programmer')
        return
      }

      const key = e.key.toUpperCase()

      // Hex keys A-F (allowed in programmer mode when base 16)
      if (mode === 'programmer' && base === 16 && ['A', 'B', 'C', 'D', 'E', 'F'].includes(key)) {
        e.preventDefault()
        inputDigit(key)
        return
      }

      // Digits 0-9
      if (/^[0-9]$/.test(key)) {
        if (mode === 'programmer' && base === 8 && (key === '8' || key === '9')) return
        e.preventDefault()
        inputDigit(key)
        return
      }

      if (key === '+' || key === '-') {
        e.preventDefault()
        performOperation(key === '-' ? '−' : '+')
      } else if (key === '*') {
        e.preventDefault()
        performOperation('×')
      } else if (key === '/') {
        e.preventDefault()
        performOperation('÷')
      } else if (key === 'ENTER' || key === '=') {
        e.preventDefault()
        performOperation('=')
      } else if (key === 'ESCAPE' || key === 'C') {
        e.preventDefault()
        handleClear()
      } else if (key === 'BACKSPACE') {
        e.preventDefault()
        if (displayValue.length > 1) {
          setDisplayValue(displayValue.slice(0, -1))
        } else {
          setDisplayValue('0')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [displayValue, base, mode, waitingForOperand, pendingValue, pendingOperator, handleSwitchMode])

  // ── Responsive Dimensions Based on Mode ────────────────────────────────────
  const isProgrammer = mode === 'programmer'
  const isScientific = mode === 'scientific'

  return (
    <div
      onClick={() => setIsModeMenuOpen(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(32, 34, 38, 0.96)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* ─── 1. TOP WINDOW BAR WITH TRAFFIC LIGHTS & DRAG HANDLE ─────────────── */}
      <div
        onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
        onDoubleClick={() => windowContext?.toggleMaximize()}
        style={{
          height: 38,
          minHeight: 38,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'default',
          flexShrink: 0,
        }}
      >
        {/* macOS Traffic Lights */}
        <TrafficLights />

        {/* Character Encoding or Scientific Mode Pill */}
        {isProgrammer && characterPreview && (
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255, 255, 255, 0.65)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: 5,
              fontWeight: 500,
            }}
          >
            char: <strong style={{ color: '#38bdf8' }}>{characterPreview}</strong>
          </div>
        )}

        {isScientific && (
          <div
            onClick={() => setIsRad(!isRad)}
            style={{
              fontSize: 11,
              color: isRad ? '#38bdf8' : 'rgba(255, 255, 255, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: 5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isRad ? 'Rad' : 'Deg'}
          </div>
        )}
      </div>

      {/* ─── 2. MAIN DISPLAY (Large Right-Aligned Number with Base Subscript) ─── */}
      <div
        style={{
          padding: '0 18px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 52,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Subtle vertical text cursor matching reference screenshot */}
        <div
          style={{
            width: 1.5,
            height: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.35)',
            borderRadius: 1,
            marginLeft: 2,
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-end',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: displayValue.length > 14 ? 26 : displayValue.length > 10 ? 32 : displayValue.length > 6 ? 38 : 46,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {displayValue}
          </div>

          {/* Base Subscript (e.g. 16, 10, 8, exactly like reference image) */}
          {isProgrammer && (
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.72)',
                marginLeft: 4,
                position: 'relative',
                bottom: -2,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {base}
            </span>
          )}
        </div>
      </div>

      {/* ─── 3. PROGRAMMER CONTROLS STRIP (Exact match to reference screenshot) ─ */}
      {isProgrammer && (
        <div
          style={{
            padding: '4px 16px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexShrink: 0,
          }}
        >
          {/* Segment 1: [ASCII | Unicode] (User circled Unicode in image!) */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 6,
              padding: 2,
              border: '0.5px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <button
              onClick={() => {
                soundEngine.play('click')
                setEncoding('ascii')
              }}
              style={{
                backgroundColor: encoding === 'ascii' ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                color: encoding === 'ascii' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderRadius: 4,
                padding: '2px 7px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ASCII
            </button>
            <button
              onClick={() => {
                soundEngine.play('click')
                setEncoding('unicode')
              }}
              style={{
                backgroundColor: encoding === 'unicode' ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                color: encoding === 'unicode' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderRadius: 4,
                padding: '2px 7px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Unicode
            </button>
          </div>

          {/* Button 2: [Hide Binary / Show Binary] */}
          <button
            onClick={() => {
              soundEngine.play('click')
              setShowBinary(!showBinary)
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.10)',
              border: '0.5px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 6,
              padding: '3px 10px',
              fontSize: 11,
              fontWeight: 500,
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            {showBinary ? 'Hide Binary' : 'Show Binary'}
          </button>

          {/* Segment 3: [ 8 | 10 | 16 ] Base Selector */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 6,
              padding: 2,
              border: '0.5px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {([8, 10, 16] as const).map((b) => {
              const isSel = base === b
              return (
                <button
                  key={b}
                  onClick={() => handleBaseChange(b)}
                  style={{
                    backgroundColor: isSel ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                    color: isSel ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                    border: 'none',
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: isSel ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {b}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── 4. INTERACTIVE 64-BIT BINARY BREAKDOWN GRID ─────────────────────── */}
      {isProgrammer && showBinary && (
        <div
          style={{
            padding: '2px 16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 11,
            color: 'rgba(255, 255, 255, 0.7)',
            flexShrink: 0,
          }}
        >
          {/* Row 1: Bits 63 to 32 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', letterSpacing: '0.04em' }}>
              {binary64Bits.row1.map((nibble, nibbleIdx) => (
                <div key={`n1-${nibbleIdx}`} style={{ display: 'flex', gap: 1.5, marginRight: nibbleIdx === 3 ? 8 : 0 }}>
                  {nibble.split('').map((bit, bitIdx) => {
                    const globalIdx = nibbleIdx * 4 + bitIdx
                    const isOne = bit === '1'
                    return (
                      <span
                        key={bitIdx}
                        onClick={() => handleToggleBit(globalIdx)}
                        style={{
                          cursor: 'pointer',
                          color: isOne ? '#ffffff' : 'rgba(255, 255, 255, 0.32)',
                          fontWeight: isOne ? 700 : 400,
                        }}
                      >
                        {bit}
                      </span>
                    )
                  })}
                </div>
              ))}
            </div>
            {/* Markers: 63, 47, 32 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 9,
                color: 'rgba(255, 255, 255, 0.4)',
                padding: '0 1px',
              }}
            >
              <span>63</span>
              <span style={{ marginRight: 18 }}>47</span>
              <span>32</span>
            </div>
          </div>

          {/* Row 2: Bits 31 to 0 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', letterSpacing: '0.04em' }}>
              {binary64Bits.row2.map((nibble, nibbleIdx) => (
                <div key={`n2-${nibbleIdx}`} style={{ display: 'flex', gap: 1.5, marginRight: nibbleIdx === 3 ? 8 : 0 }}>
                  {nibble.split('').map((bit, bitIdx) => {
                    const globalIdx = 32 + nibbleIdx * 4 + bitIdx
                    const isOne = bit === '1'
                    return (
                      <span
                        key={bitIdx}
                        onClick={() => handleToggleBit(globalIdx)}
                        style={{
                          cursor: 'pointer',
                          color: isOne ? '#ffffff' : 'rgba(255, 255, 255, 0.32)',
                          fontWeight: isOne ? 700 : 400,
                        }}
                      >
                        {bit}
                      </span>
                    )
                  })}
                </div>
              ))}
            </div>
            {/* Markers: 31, 15, 0 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 9,
                color: 'rgba(255, 255, 255, 0.4)',
                padding: '0 1px',
              }}
            >
              <span>31</span>
              <span style={{ marginRight: 18 }}>15</span>
              <span>0</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. KEYPAD GRID ─────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: '8px 14px 14px',
          display: 'grid',
          gridTemplateColumns: isProgrammer
            ? 'repeat(7, 1fr)'
            : isScientific
            ? 'repeat(10, 1fr)'
            : 'repeat(4, 1fr)',
          gap: 6,
          boxSizing: 'border-box',
          minHeight: 0,
        }}
      >
        {/* PROGRAMMER MODE (7 Columns x 6 Rows - 100% Match to Reference Image) */}
        {isProgrammer && (
          <>
            {/* Row 1 */}
            <CalcButton label="(" onClick={() => performOperation('(')} type="fn" />
            <CalcButton label=")" onClick={() => performOperation(')')} type="fn" />
            <CalcButton label="XOR" onClick={() => performOperation('XOR')} type="fn" />
            <CalcButton label="D" onClick={() => inputDigit('D')} type="num" disabled={base < 16} />
            <CalcButton label="E" onClick={() => inputDigit('E')} type="num" disabled={base < 16} />
            <CalcButton label="F" onClick={() => inputDigit('F')} type="num" disabled={base < 16} />
            <CalcButton label={displayValue !== '0' ? 'C' : 'AC'} onClick={handleClear} type="action" />

            {/* Row 2 */}
            <CalcButton label="AND" onClick={() => performOperation('AND')} type="fn" />
            <CalcButton label="OR" onClick={() => performOperation('OR')} type="fn" />
            <CalcButton label="NOR" onClick={() => performOperation('NOR')} type="fn" />
            <CalcButton label="A" onClick={() => inputDigit('A')} type="num" disabled={base < 16} />
            <CalcButton label="B" onClick={() => inputDigit('B')} type="num" disabled={base < 16} />
            <CalcButton label="C" onClick={() => inputDigit('C')} type="num" disabled={base < 16} />
            <CalcButton label="÷" onClick={() => performOperation('÷')} type="op" active={pendingOperator === '÷'} />

            {/* Row 3 */}
            <CalcButton label="NOT" onClick={() => performUnary('NOT')} type="fn" />
            <CalcButton label="<<" onClick={() => performOperation('<<')} type="fn" />
            <CalcButton label=">>" onClick={() => performOperation('>>')} type="fn" />
            <CalcButton label="7" onClick={() => inputDigit('7')} type="num" />
            <CalcButton label="8" onClick={() => inputDigit('8')} type="num" disabled={base < 10} />
            <CalcButton label="9" onClick={() => inputDigit('9')} type="num" disabled={base < 10} />
            <CalcButton label="×" onClick={() => performOperation('×')} type="op" active={pendingOperator === '×'} />

            {/* Row 4 */}
            <CalcButton label="NEG" onClick={() => performUnary('NEG')} type="fn" />
            <CalcButton label="X<<Y" onClick={() => performOperation('X<<Y')} type="fn" />
            <CalcButton label="X>>Y" onClick={() => performOperation('X>>Y')} type="fn" />
            <CalcButton label="4" onClick={() => inputDigit('4')} type="num" />
            <CalcButton label="5" onClick={() => inputDigit('5')} type="num" />
            <CalcButton label="6" onClick={() => inputDigit('6')} type="num" />
            <CalcButton label="−" onClick={() => performOperation('−')} type="op" active={pendingOperator === '−'} />

            {/* Row 5 */}
            <CalcButton label="mod" onClick={() => performOperation('mod')} type="fn" />
            <CalcButton label="RoL" onClick={() => performUnary('RoL')} type="fn" />
            <CalcButton label="RoR" onClick={() => performUnary('RoR')} type="fn" />
            <CalcButton label="1" onClick={() => inputDigit('1')} type="num" />
            <CalcButton label="2" onClick={() => inputDigit('2')} type="num" />
            <CalcButton label="3" onClick={() => inputDigit('3')} type="num" />
            <CalcButton label="+" onClick={() => performOperation('+')} type="op" active={pendingOperator === '+'} />

            {/* Row 6 */}
            <CalcButton
              label={<CalcModeIcon />}
              onClick={(e) => {
                e.stopPropagation()
                soundEngine.play('pop')
                setIsModeMenuOpen(!isModeMenuOpen)
              }}
              type="fn"
              title="Change Calculator Mode (⌘1, ⌘2, ⌘3)"
            />
            <CalcButton
              label={<>flip<sub style={{ fontSize: 9, position: 'relative', bottom: -2 }}>16</sub></>}
              onClick={() => performUnary('flip16')}
              type="fn"
            />
            <CalcButton
              label={<>flip<sub style={{ fontSize: 9, position: 'relative', bottom: -2 }}>64</sub></>}
              onClick={() => performUnary('flip64')}
              type="fn"
            />
            <CalcButton label="FF" onClick={() => performUnary('FF')} type="fn" disabled={base < 16} />
            <CalcButton label="0" onClick={() => inputDigit('0')} type="num" />
            <CalcButton label="00" onClick={() => performUnary('00')} type="num" />
            <CalcButton label="=" onClick={() => performOperation('=')} type="op" />
          </>
        )}

        {/* SCIENTIFIC MODE (10 Columns x 5 Rows) */}
        {isScientific && (
          <>
            {/* Row 1 */}
            <CalcButton label="(" onClick={() => performOperation('(')} type="fn" />
            <CalcButton label=")" onClick={() => performOperation(')')} type="fn" />
            <CalcButton label="mc" onClick={() => setMemory(0)} type="fn" />
            <CalcButton label="m+" onClick={() => setMemory((prev) => prev + (parseFloat(displayValue) || 0))} type="fn" />
            <CalcButton label="m-" onClick={() => setMemory((prev) => prev - (parseFloat(displayValue) || 0))} type="fn" />
            <CalcButton label="mr" onClick={() => setDisplayValue(String(memory))} type="fn" />
            <CalcButton label={displayValue !== '0' ? 'C' : 'AC'} onClick={handleClear} type="action" />
            <CalcButton label="±" onClick={() => performUnary('±')} type="action" />
            <CalcButton label="%" onClick={() => performUnary('%')} type="action" />
            <CalcButton label="÷" onClick={() => performOperation('÷')} type="op" active={pendingOperator === '÷'} />

            {/* Row 2 */}
            <CalcButton label="2nd" onClick={() => setIs2nd(!is2nd)} type="fn" active={is2nd} />
            <CalcButton label="x²" onClick={() => performUnary('x²')} type="fn" />
            <CalcButton label="x³" onClick={() => performUnary('x³')} type="fn" />
            <CalcButton label="xʸ" onClick={() => performOperation('xʸ')} type="fn" />
            <CalcButton label="eˣ" onClick={() => performUnary('eˣ')} type="fn" />
            <CalcButton label="10ˣ" onClick={() => performUnary('10ˣ')} type="fn" />
            <CalcButton label="7" onClick={() => inputDigit('7')} type="num" />
            <CalcButton label="8" onClick={() => inputDigit('8')} type="num" />
            <CalcButton label="9" onClick={() => inputDigit('9')} type="num" />
            <CalcButton label="×" onClick={() => performOperation('×')} type="op" active={pendingOperator === '×'} />

            {/* Row 3 */}
            <CalcButton label="1/x" onClick={() => performUnary('1/x')} type="fn" />
            <CalcButton label="²√x" onClick={() => performUnary('²√x')} type="fn" />
            <CalcButton label="³√x" onClick={() => performUnary('³√x')} type="fn" />
            <CalcButton label="ʸ√x" onClick={() => performOperation('ʸ√x')} type="fn" />
            <CalcButton label="ln" onClick={() => performUnary('ln')} type="fn" />
            <CalcButton label="log₁₀" onClick={() => performUnary('log₁₀')} type="fn" />
            <CalcButton label="4" onClick={() => inputDigit('4')} type="num" />
            <CalcButton label="5" onClick={() => inputDigit('5')} type="num" />
            <CalcButton label="6" onClick={() => inputDigit('6')} type="num" />
            <CalcButton label="−" onClick={() => performOperation('−')} type="op" active={pendingOperator === '−'} />

            {/* Row 4 */}
            <CalcButton label="x!" onClick={() => performUnary('x!')} type="fn" />
            <CalcButton label="sin" onClick={() => performUnary('sin')} type="fn" />
            <CalcButton label="cos" onClick={() => performUnary('cos')} type="fn" />
            <CalcButton label="tan" onClick={() => performUnary('tan')} type="fn" />
            <CalcButton label="e" onClick={() => performUnary('e')} type="fn" />
            <CalcButton label="EE" onClick={() => performOperation('EE')} type="fn" />
            <CalcButton label="1" onClick={() => inputDigit('1')} type="num" />
            <CalcButton label="2" onClick={() => inputDigit('2')} type="num" />
            <CalcButton label="3" onClick={() => inputDigit('3')} type="num" />
            <CalcButton label="+" onClick={() => performOperation('+')} type="op" active={pendingOperator === '+'} />

            {/* Row 5 */}
            <CalcButton
              label={<CalcModeIcon />}
              onClick={(e) => {
                e.stopPropagation()
                soundEngine.play('pop')
                setIsModeMenuOpen(!isModeMenuOpen)
              }}
              type="fn"
              title="Change Calculator Mode (⌘1, ⌘2, ⌘3)"
            />
            <CalcButton label="sinh" onClick={() => performUnary('sinh')} type="fn" />
            <CalcButton label="cosh" onClick={() => performUnary('cosh')} type="fn" />
            <CalcButton label="tanh" onClick={() => performUnary('tanh')} type="fn" />
            <CalcButton label="π" onClick={() => performUnary('π')} type="fn" />
            <CalcButton label="Rand" onClick={() => performUnary('Rand')} type="fn" />
            <CalcButton label="0" onClick={() => inputDigit('0')} type="num" />
            <CalcButton
              label="."
              onClick={() => {
                if (!displayValue.includes('.')) inputDigit('.')
              }}
              type="num"
            />
            <CalcButton label="±" onClick={() => performUnary('±')} type="num" />
            <CalcButton label="=" onClick={() => performOperation('=')} type="op" />
          </>
        )}

        {/* BASIC MODE (4 Columns x 5 Rows) */}
        {mode === 'basic' && (
          <>
            <CalcButton label={displayValue !== '0' ? 'C' : 'AC'} onClick={handleClear} type="action" />
            <CalcButton label="±" onClick={() => performUnary('±')} type="action" />
            <CalcButton label="%" onClick={() => performUnary('%')} type="action" />
            <CalcButton label="÷" onClick={() => performOperation('÷')} type="op" active={pendingOperator === '÷'} />

            <CalcButton label="7" onClick={() => inputDigit('7')} type="num" />
            <CalcButton label="8" onClick={() => inputDigit('8')} type="num" />
            <CalcButton label="9" onClick={() => inputDigit('9')} type="num" />
            <CalcButton label="×" onClick={() => performOperation('×')} type="op" active={pendingOperator === '×'} />

            <CalcButton label="4" onClick={() => inputDigit('4')} type="num" />
            <CalcButton label="5" onClick={() => inputDigit('5')} type="num" />
            <CalcButton label="6" onClick={() => inputDigit('6')} type="num" />
            <CalcButton label="−" onClick={() => performOperation('−')} type="op" active={pendingOperator === '−'} />

            <CalcButton label="1" onClick={() => inputDigit('1')} type="num" />
            <CalcButton label="2" onClick={() => inputDigit('2')} type="num" />
            <CalcButton label="3" onClick={() => inputDigit('3')} type="num" />
            <CalcButton label="+" onClick={() => performOperation('+')} type="op" active={pendingOperator === '+'} />

            <CalcButton
              label={<CalcModeIcon />}
              onClick={(e) => {
                e.stopPropagation()
                soundEngine.play('pop')
                setIsModeMenuOpen(!isModeMenuOpen)
              }}
              type="fn"
              title="Change Calculator Mode (⌘1, ⌘2, ⌘3)"
            />
            <CalcButton label="0" onClick={() => inputDigit('0')} type="num" />
            <CalcButton
              label="."
              onClick={() => {
                if (!displayValue.includes('.')) inputDigit('.')
              }}
              type="num"
            />
            <CalcButton label="=" onClick={() => performOperation('=')} type="op" />
          </>
        )}
      </div>

      {/* ─── 6. APPLE MODE SWITCHER POPOVER MENU ─────────────────────────────── */}
      <AnimatePresence>
        {isModeMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: 56,
              left: 14,
              backgroundColor: 'rgba(38, 40, 46, 0.96)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              border: '0.5px solid rgba(255, 255, 255, 0.16)',
              borderRadius: 10,
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), 0 0 0 0.5px rgba(255, 255, 255, 0.1)',
              padding: '5px',
              display: 'flex',
              flexDirection: 'column',
              width: 175,
              zIndex: 999,
            }}
          >
            {[
              { id: 'basic', label: 'Basic', shortcut: '⌘1' },
              { id: 'scientific', label: 'Scientific', shortcut: '⌘2' },
              { id: 'programmer', label: 'Programmer', shortcut: '⌘3' },
            ].map((item) => {
              const isSelected = mode === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    handleSwitchMode(item.id as CalcMode)
                    setIsModeMenuOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: isSelected ? 600 : 400,
                    color: '#ffffff',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#007AFF' : 'transparent',
                    transition: 'background-color 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 14, fontSize: 11, textAlign: 'center' }}>
                      {isSelected ? '✓' : ''}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 10.5, color: isSelected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>
                    {item.shortcut}
                  </span>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── APPLE CALCULATOR BUTTON & ICONS ─────────────────────────────────────────

export function CalcModeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="3" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <circle cx="8" cy="11" r="0.9" fill="currentColor" />
      <circle cx="12" cy="11" r="0.9" fill="currentColor" />
      <circle cx="16" cy="11" r="0.9" fill="currentColor" />
      <circle cx="8" cy="15" r="0.9" fill="currentColor" />
      <circle cx="12" cy="15" r="0.9" fill="currentColor" />
      <circle cx="16" cy="15" r="0.9" fill="currentColor" />
      <circle cx="8" cy="19" r="0.9" fill="currentColor" />
      <circle cx="12" cy="19" r="0.9" fill="currentColor" />
      <circle cx="16" cy="19" r="0.9" fill="currentColor" />
    </svg>
  )
}

interface CalcButtonProps {
  label: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  type: 'num' | 'op' | 'fn' | 'action'
  active?: boolean
  disabled?: boolean
  title?: string
}

function CalcButton({
  label,
  onClick,
  type,
  active = false,
  disabled = false,
  title,
}: CalcButtonProps) {
  // macOS Sonoma / Sequoia authentic colors:
  // - Operators: Apple Vibrant Orange (#FF9F0A)
  // - Numbers & Hex: Slate dark gray (#505054)
  // - Functions: Medium dark gray (#3A3A3C)
  // - Clear / Actions: Medium light gray (#636366)
  let bg = '#505054'
  let color = '#ffffff'
  let fontSize: number | string = 14
  let fontWeight = 500

  if (type === 'op') {
    bg = active ? '#ffffff' : '#FF9F0A'
    color = active ? '#FF9F0A' : '#ffffff'
    fontSize = 18
    fontWeight = 600
  } else if (type === 'fn') {
    bg = '#3A3A3C'
    color = '#E5E5EA'
    fontSize = typeof label === 'string' && label.length > 3 ? 10.5 : 12
    fontWeight = 500
  } else if (type === 'action') {
    bg = '#636366'
    color = '#ffffff'
    fontSize = 13.5
    fontWeight = 600
  }

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.94 }}
      whileHover={{ filter: disabled ? 'none' : 'brightness(1.15)' }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 34,
        borderRadius: 9999,
        border: active ? '1.5px solid #ffffff' : 'none',
        backgroundColor: bg,
        color: color,
        fontSize,
        fontWeight,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.32 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        boxShadow: active ? '0 0 12px rgba(255, 159, 10, 0.45)' : 'none',
        transition: 'background-color 0.12s ease, opacity 0.12s ease, filter 0.12s ease',
        boxSizing: 'border-box',
      }}
    >
      {label}
    </motion.button>
  )
}
