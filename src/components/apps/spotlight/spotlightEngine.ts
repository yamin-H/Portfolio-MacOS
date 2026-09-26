import { INITIAL_FS_ENTRIES, FSEntry } from '../finder/finderData'
import { getCleanLocalStoragePhotos } from '../photos/photosStorage'

export type SpotlightCategory =
  | 'all'
  | 'applications'
  | 'folders'
  | 'documents'
  | 'images'
  | 'projects'
  | 'settings'
  | 'calculations'

export interface SpotlightItem {
  id: string
  title: string
  subtitle: string
  category: SpotlightCategory
  iconType: 'app' | 'folder' | 'image' | 'doc' | 'setting' | 'calc' | 'web' | 'ai'
  iconSrc?: string
  badgeIconSrc?: string
  badgeLabel?: string
  parentPath?: string
  date?: string
  size?: string
  actionLabel?: string
  shortcutBadge?: string
  actionType:
    | 'open_app'
    | 'open_finder'
    | 'open_photo'
    | 'open_setting'
    | 'copy_calc'
    | 'open_web'
    | 'ask_ai'
    | 'scope_folder'
  payload: any
  score?: number
}

// ─── Registered Applications ──────────────────────────────────────────────────
export const SPOTLIGHT_APPLICATIONS: Array<{
  id: string
  name: string
  subtitle: string
  icon: string
  aliases: string[]
}> = [
  { id: 'finder', name: 'Finder', subtitle: 'Application · System File Manager', icon: '/finder.png', aliases: ['files', 'directory', 'folders', 'documents'] },
  { id: 'safari', name: 'Safari', subtitle: 'Application · Web Browser', icon: '/safari browser.png', aliases: ['browser', 'web', 'internet', 'chrome'] },
  { id: 'photos', name: 'Photos', subtitle: 'Application · Photo & Video Library', icon: '/photos.png', aliases: ['gallery', 'images', 'pictures', 'camera'] },
  { id: 'terminal', name: 'Terminal', subtitle: 'Application · Developer Shell (zsh)', icon: '/terminal.png', aliases: ['bash', 'cli', 'console', 'shell', 'cmd'] },
  { id: 'notes', name: 'Notes', subtitle: 'Application · Notes & AI Transcripts', icon: '/Notes.png', aliases: ['notepad', 'memo', 'write', 'editor'] },
  { id: 'calculator', name: 'Calculator', subtitle: 'Application · Basic & Scientific', icon: '/calculator.png', aliases: ['math', 'calc', 'numbers'] },
  { id: 'settings', name: 'System Settings', subtitle: 'Application · System Preferences', icon: '/settings.png', aliases: ['preferences', 'config', 'control', 'dark mode', 'wallpaper'] },
  { id: 'appstore', name: 'App Store', subtitle: 'Application · Software & Developer Tools', icon: '/appstore.png', aliases: ['install', 'software', 'download', 'market'] },
  { id: 'weather', name: 'Weather', subtitle: 'Application · Forecasts & Conditions', icon: '/weather.png', aliases: ['rain', 'temperature', 'climate', 'sun'] },
  { id: 'resume', name: 'Resume & Credentials', subtitle: 'Application · PDF Viewer', icon: '/file.svg', aliases: ['cv', 'experience', 'bio', 'yamin'] },
]

// ─── Registered System Settings ──────────────────────────────────────────────
export const SPOTLIGHT_SETTINGS: Array<{
  id: string
  title: string
  subtitle: string
  settingKey: string
  icon: string
  keywords: string[]
}> = [
  { id: 'setting-appearance', title: 'Appearance (Dark Mode / Light Mode)', subtitle: 'System Setting · Theme & Accent Color', settingKey: 'appearance', icon: '/settings.png', keywords: ['dark', 'light', 'theme', 'color', 'accent', 'mode'] },
  { id: 'setting-wallpaper', title: 'Wallpaper & Desktop', subtitle: 'System Setting · Desktop Background', settingKey: 'wallpaper', icon: '/settings.png', keywords: ['wallpaper', 'background', 'desktop', 'screen'] },
  { id: 'setting-sound', title: 'Sound & Volume', subtitle: 'System Setting · Output Volume & Sound Effects', settingKey: 'sound', icon: '/settings.png', keywords: ['sound', 'volume', 'audio', 'mute', 'effects'] },
  { id: 'setting-displays', title: 'Displays & Brightness', subtitle: 'System Setting · Night Shift & Resolution', settingKey: 'displays', icon: '/settings.png', keywords: ['display', 'brightness', 'screen', 'night shift', 'true tone'] },
  { id: 'setting-wifi', title: 'Wi-Fi Networks', subtitle: 'System Setting · Wireless Connections', settingKey: 'wifi', icon: '/settings.png', keywords: ['wifi', 'network', 'internet', 'wireless'] },
  { id: 'setting-bluetooth', title: 'Bluetooth Devices', subtitle: 'System Setting · Wireless Peripherals', settingKey: 'bluetooth', icon: '/settings.png', keywords: ['bluetooth', 'devices', 'airpods', 'keyboard'] },
  { id: 'setting-battery', title: 'Battery & Energy Saver', subtitle: 'System Setting · Power Management', settingKey: 'battery', icon: '/settings.png', keywords: ['battery', 'power', 'energy', 'charge'] },
  { id: 'setting-about', title: 'About This Mac', subtitle: 'System Setting · macOS Sequoia 15.3 & Specs', settingKey: 'about', icon: '/settings.png', keywords: ['about', 'mac', 'specs', 'hardware', 'chip', 'apple silicon'] },
]

// ─── Math Calculation Engine ─────────────────────────────────────────────────
export function evaluateMathExpression(expr: string): string | null {
  const trimmed = expr.trim().toLowerCase()
  if (!trimmed) return null

  // Check for "X% of Y" pattern: e.g. "15% of 800"
  const percentMatch = trimmed.match(/^([\d.]+)\s*%\s*(?:of)?\s*([\d.]+)$/)
  if (percentMatch) {
    const p = parseFloat(percentMatch[1])
    const total = parseFloat(percentMatch[2])
    if (!isNaN(p) && !isNaN(total)) {
      const result = (p / 100) * total
      return Number.isInteger(result) ? result.toLocaleString() : result.toFixed(2)
    }
  }

  // Must contain at least one math operator or function
  if (!/[+\-*/^%]|sqrt|sin|cos|tan|log|pi|e/.test(trimmed)) {
    return null
  }

  // Only allow valid safe math characters
  if (!/^[\d\s+\-*/^().%sqrt|sin|cos|tan|log|pi|e,]+$/.test(trimmed)) {
    return null
  }

  try {
    const sanitized = trimmed
      .replace(/pi/g, String(Math.PI))
      .replace(/\be\b/g, String(Math.E))
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
      .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
      .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
      .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
      .replace(/\^/g, '**')
      .replace(/,/g, '')

    // Guard against dangerous functions
    if (/[a-zA-Z]/.test(sanitized.replace(/Math\.(sqrt|sin|cos|tan|log10)/g, ''))) {
      return null
    }

    // Evaluate in safe isolated scope
    const fn = new Function(`"use strict"; return (${sanitized});`)
    const val = fn()

    if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      const rounded = Math.round(val * 1000000) / 1000000
      return rounded.toLocaleString('en-US', { maximumFractionDigits: 6 })
    }
  } catch {
    return null
  }
  return null
}

// ─── Main Spotlight Search Engine ────────────────────────────────────────────
export function querySpotlight({
  query,
  scope,
  filterCategory = 'all',
}: {
  query: string
  scope?: string | null
  filterCategory?: string
}): SpotlightItem[] {
  const q = query.trim().toLowerCase()
  const results: SpotlightItem[] = []

  // 1. Check for Math Calculation
  if (q && filterCategory === 'all') {
    const calcResult = evaluateMathExpression(q)
    if (calcResult !== null) {
      results.push({
        id: 'calc-result',
        title: `= ${calcResult}`,
        subtitle: `Calculation · ${query}`,
        category: 'calculations',
        iconType: 'calc',
        actionLabel: 'Copy',
        shortcutBadge: '↩',
        actionType: 'copy_calc',
        payload: { value: calcResult },
        score: 1000,
      })
    }
  }

  // 2. Search Applications
  if (filterCategory === 'all' || filterCategory === 'applications') {
    SPOTLIGHT_APPLICATIONS.forEach((app) => {
      let score = 0
      const appNameLower = app.name.toLowerCase()
      if (!q) {
        score = 50
      } else if (appNameLower === q) {
        score = 500
      } else if (appNameLower.startsWith(q)) {
        score = 300
      } else if (appNameLower.includes(q)) {
        score = 150
      } else if (app.aliases.some((a) => a.includes(q))) {
        score = 100
      }

      if (score > 0) {
        results.push({
          id: `app-${app.id}`,
          title: app.name,
          subtitle: app.subtitle,
          category: 'applications',
          iconType: 'app',
          iconSrc: app.icon,
          actionLabel: 'Open',
          shortcutBadge: '↩',
          actionType: 'open_app',
          payload: { appId: app.id },
          score,
        })
      }
    })
  }

  // 3. Search File System (Folders, Documents, Code, Images, Screenshots, Keynote, Pages)
  const allFsEntries: FSEntry[] = [...INITIAL_FS_ENTRIES]

  allFsEntries.forEach((entry) => {
    // If scope is active, only match within that scope's parentPath or name
    if (scope && scope.trim()) {
      const scopeLower = scope.toLowerCase()
      const inScope =
        entry.parentPath.toLowerCase().includes(scopeLower) ||
        entry.name.toLowerCase().includes(scopeLower)
      if (!inScope) return
    }

    // Filter category matching
    if (filterCategory === 'folders' && !entry.isFolder) return
    if (filterCategory === 'documents' && (entry.isFolder || entry.kind === 'image')) return
    if (filterCategory === 'images' && entry.kind !== 'image') return
    if (filterCategory === 'preview' && entry.kind !== 'image' && entry.kind !== 'pdf') return
    if (filterCategory === 'screenshot' && !entry.name.toLowerCase().includes('screenshot')) return
    if (filterCategory === 'keynote' && !entry.name.toLowerCase().endsWith('.key')) return
    if (filterCategory === 'pages' && !entry.name.toLowerCase().endsWith('.pages')) return
    if (filterCategory === 'numbers' && !entry.name.toLowerCase().endsWith('.numbers')) return

    let score = 0
    const nameLower = entry.name.toLowerCase()

    if (!q) {
      // Default top suggestions when query is empty
      if (entry.name.includes('iDownloadBlog') || entry.name.includes('03_') || entry.name.includes('Resume')) {
        score = 40
      }
    } else if (nameLower === q) {
      score = 400
    } else if (nameLower.startsWith(q)) {
      score = 250
    } else if (nameLower.includes(q)) {
      score = 120
    } else if (entry.parentPath.toLowerCase().includes(q)) {
      score = 60
    } else if (entry.content && entry.content.toLowerCase().includes(q)) {
      score = 40
    }

    if (score > 0) {
      const parentFolderName = entry.parentPath.split('/').filter(Boolean).pop() || 'iCloud Drive'

      if (entry.isFolder) {
        results.push({
          id: `fs-${entry.id}`,
          title: entry.name,
          subtitle: `${entry.dateModified} · 📁 ${parentFolderName}`,
          category: 'folders',
          iconType: 'folder',
          actionLabel: `Search ${entry.name}`,
          shortcutBadge: 'tab',
          actionType: 'scope_folder',
          payload: { folderName: entry.name, path: `${entry.parentPath}/${entry.name}` },
          score: score + 20, // Prioritize folders for scope navigation matching screenshot
        })
      } else {
        const isImage = entry.kind === 'image'
        const isPdf = entry.kind === 'pdf'

        const kindLabel = isImage ? 'JPEG image' : isPdf ? 'PDF document' : 'Document'
        const sizeLabel = entry.size || '1.2 MB'
        const subtitle = `${kindLabel} · ${sizeLabel} · ${entry.dateModified} · 📁 ${parentFolderName}`

        results.push({
          id: `fs-${entry.id}`,
          title: entry.name,
          subtitle,
          category: isImage ? 'images' : 'documents',
          iconType: isImage ? 'image' : 'doc',
          iconSrc: isImage ? '/photos.png' : isPdf ? '/file.svg' : undefined,
          badgeIconSrc: isImage ? '/safari browser.png' : undefined,
          actionLabel: 'Open',
          shortcutBadge: '↩',
          actionType: 'open_finder',
          payload: { path: `${entry.parentPath}/${entry.name}`, entry },
          score,
        })
      }
    }
  })

  // 4. Search Photos from Photos Library (IndexedDB/LocalStorage)
  if (filterCategory === 'all' || filterCategory === 'images' || filterCategory === 'preview') {
    const localPhotos = getCleanLocalStoragePhotos()
    localPhotos.forEach((photo) => {
      let score = 0
      const titleLower = photo.title.toLowerCase()

      if (!q) {
        score = 25
      } else if (titleLower === q) {
        score = 350
      } else if (titleLower.startsWith(q)) {
        score = 220
      } else if (titleLower.includes(q)) {
        score = 110
      } else if (photo.location.toLowerCase().includes(q)) {
        score = 80
      }

      if (score > 0) {
        results.push({
          id: `photo-${photo.id}`,
          title: `${photo.title}.jpg`,
          subtitle: `Photo · ${photo.details || 'Original Quality'} · ${photo.date} · 📁 Photos`,
          category: 'images',
          iconType: 'image',
          iconSrc: photo.src,
          actionLabel: 'Open in Photos',
          shortcutBadge: '↩',
          actionType: 'open_photo',
          payload: { photoId: photo.id },
          score,
        })
      }
    })
  }

  // 5. Search System Settings
  if (filterCategory === 'all' || filterCategory === 'settings') {
    SPOTLIGHT_SETTINGS.forEach((s) => {
      let score = 0
      const titleLower = s.title.toLowerCase()

      if (q) {
        if (titleLower.includes(q)) {
          score = 180
        } else if (s.keywords.some((k) => k.includes(q))) {
          score = 90
        }
      }

      if (score > 0) {
        results.push({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          category: 'settings',
          iconType: 'setting',
          iconSrc: s.icon,
          actionLabel: 'Open Settings',
          shortcutBadge: '↩',
          actionType: 'open_setting',
          payload: { section: s.settingKey },
          score,
        })
      }
    })
  }

  // 6. Sort results descending by score
  results.sort((a, b) => (b.score || 0) - (a.score || 0))

  // 7. If query has at least 2 characters, append Apple Intelligence & Web Search actions at the bottom
  if (q.length >= 2 && filterCategory === 'all') {
    results.push({
      id: 'ai-prompt-action',
      title: `Ask Apple Intelligence: "${query}"`,
      subtitle: 'Apple Intelligence · Autonomous AI Agent',
      category: 'all',
      iconType: 'ai',
      actionLabel: 'Ask AI',
      shortcutBadge: '↩',
      actionType: 'ask_ai',
      payload: { prompt: query },
      score: 10,
    })

    results.push({
      id: 'web-search-action',
      title: `Search Google for "${query}"`,
      subtitle: 'Safari Web Search',
      category: 'all',
      iconType: 'web',
      actionLabel: 'Search Web',
      shortcutBadge: '↩',
      actionType: 'open_web',
      payload: { url: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
      score: 5,
    })
  }

  return results
}
