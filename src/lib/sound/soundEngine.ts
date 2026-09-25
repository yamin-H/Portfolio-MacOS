// macOS Web Audio Sound Effects Synthesizer (Zero External Audio Assets)
// Implements authentic Apple system sounds synthesized in real-time via Web Audio API.

export type SoundType = 'pop' | 'minimize' | 'close' | 'click' | 'chime' | 'keyclick' | 'action'

class MacSoundEngine {
  private ctx: AudioContext | null = null
  private isEnabled: boolean = true
  private volume: number = 0.5
  private listeners: Set<(enabled: boolean) => void> = new Set()

  constructor() {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('macos_sound_enabled')
      if (savedEnabled !== null) {
        this.isEnabled = savedEnabled === 'true'
      }

      const savedVol = localStorage.getItem('macos_sound_volume')
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol)
        if (!isNaN(parsed)) this.volume = Math.max(0, Math.min(1, parsed))
      }

      // Resume or initialize on first user gesture to satisfy browser autoplay policies
      const initAudio = () => {
        this.getAudioContext()
        window.removeEventListener('pointerdown', initAudio)
        window.removeEventListener('keydown', initAudio)
      }
      window.addEventListener('pointerdown', initAudio, { once: true })
      window.addEventListener('keydown', initAudio, { once: true })
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public isSoundOn(): boolean {
    return this.isEnabled
  }

  public getVolume(): number {
    return this.volume
  }

  public toggleSound(): boolean {
    this.isEnabled = !this.isEnabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('macos_sound_enabled', String(this.isEnabled))
    }
    if (this.isEnabled) {
      this.play('pop')
    }
    this.listeners.forEach((fn) => fn(this.isEnabled))
    return this.isEnabled
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('macos_sound_enabled', String(this.isEnabled))
    }
    this.listeners.forEach((fn) => fn(this.isEnabled))
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol))
    if (typeof window !== 'undefined') {
      localStorage.setItem('macos_sound_volume', String(this.volume))
    }
  }

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  public play(type: SoundType): void {
    if (!this.isEnabled) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(this.volume, now)
      masterGain.connect(ctx.destination)

      switch (type) {
        case 'pop':
          // macOS Window Open / QuickLook display pop (subtle upward frequency sweep)
          {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(220, now)
            osc.frequency.exponentialRampToValueAtTime(460, now + 0.07)

            gain.gain.setValueAtTime(0, now)
            gain.gain.linearRampToValueAtTime(0.35, now + 0.015)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

            osc.connect(gain)
            gain.connect(masterGain)
            osc.start(now)
            osc.stop(now + 0.09)
          }
          break

        case 'minimize':
          // macOS Window Minimize pitch drop
          {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(360, now)
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.12)

            gain.gain.setValueAtTime(0.28, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

            osc.connect(gain)
            gain.connect(masterGain)
            osc.start(now)
            osc.stop(now + 0.12)
          }
          break

        case 'close':
          // macOS Window Close snap
          {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(300, now)
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.06)

            gain.gain.setValueAtTime(0.3, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

            osc.connect(gain)
            gain.connect(masterGain)
            osc.start(now)
            osc.stop(now + 0.06)
          }
          break

        case 'click':
          // Subtle macOS tactile click (Finder selection / pill tap)
          {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(900, now)
            osc.frequency.exponentialRampToValueAtTime(280, now + 0.02)

            gain.gain.setValueAtTime(0.18, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)

            osc.connect(gain)
            gain.connect(masterGain)
            osc.start(now)
            osc.stop(now + 0.025)
          }
          break

        case 'chime':
          // Authentic Apple Glass Notification Chime (Harmonic frequencies with bell envelope)
          {
            const fundamentalFreq = 1864.66 // A#6
            const harmonicFreq = 2793.83 // F7

            const osc1 = ctx.createOscillator()
            const osc2 = ctx.createOscillator()
            const gain1 = ctx.createGain()
            const gain2 = ctx.createGain()

            osc1.type = 'sine'
            osc1.frequency.setValueAtTime(fundamentalFreq, now)
            gain1.gain.setValueAtTime(0.32, now)
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)

            osc2.type = 'sine'
            osc2.frequency.setValueAtTime(harmonicFreq, now)
            gain2.gain.setValueAtTime(0.18, now)
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

            osc1.connect(gain1)
            osc2.connect(gain2)
            gain1.connect(masterGain)
            gain2.connect(masterGain)

            osc1.start(now)
            osc2.start(now)
            osc1.stop(now + 0.45)
            osc2.stop(now + 0.45)
          }
          break

        case 'keyclick':
          // Dampened acoustic keyclick for Terminal input
          {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(320, now)
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.018)

            gain.gain.setValueAtTime(0.12, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018)

            osc.connect(gain)
            gain.connect(masterGain)
            osc.start(now)
            osc.stop(now + 0.02)
          }
          break

        case 'action':
          // Confirmation chime / recruiter hire sequence
          {
            const notes = [523.25, 659.25, 783.99] // C5 - E5 - G5
            notes.forEach((freq, idx) => {
              const noteNow = now + idx * 0.05
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.type = 'sine'
              osc.frequency.setValueAtTime(freq, noteNow)

              gain.gain.setValueAtTime(0, noteNow)
              gain.gain.linearRampToValueAtTime(0.24, noteNow + 0.01)
              gain.gain.exponentialRampToValueAtTime(0.001, noteNow + 0.18)

              osc.connect(gain)
              gain.connect(masterGain)
              osc.start(noteNow)
              osc.stop(noteNow + 0.18)
            })
          }
          break
      }
    } catch {
      // Ignore audio synthesis errors on locked environments
    }
  }
}

export const soundEngine = new MacSoundEngine()
