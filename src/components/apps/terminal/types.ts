export interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'error' | 'system'
  cwd?: string
  content: string | React.ReactNode
  timestamp?: number
}

export type TerminalTheme = 'apple' | 'matrix' | 'dracula' | 'monokai' | 'solarized'

export interface ThemeColors {
  bg: string
  titleBg: string
  text: string
  promptUser: string
  promptHost: string
  promptPath: string
  promptSymbol: string
  cursor: string
  selection: string
}

export const TERMINAL_THEMES: Record<TerminalTheme, ThemeColors> = {
  apple: {
    bg: 'rgba(25, 25, 27, 0.96)',
    titleBg: 'rgba(34, 34, 36, 0.98)',
    text: '#d4d4d8',
    promptUser: '#dedee2',
    promptHost: '#dedee2',
    promptPath: '#dedee2',
    promptSymbol: '#d4d4d8',
    cursor: '#b5b5ba',
    selection: 'rgba(255, 255, 255, 0.16)',
  },
  matrix: {
    bg: 'rgba(10, 16, 12, 0.96)',
    titleBg: 'rgba(16, 26, 18, 0.98)',
    text: '#00ff66',
    promptUser: '#00ff88',
    promptHost: '#00ff88',
    promptPath: '#00cc66',
    promptSymbol: '#00ff66',
    cursor: '#00ff66',
    selection: 'rgba(0, 255, 102, 0.25)',
  },
  dracula: {
    bg: 'rgba(40, 42, 54, 0.95)',
    titleBg: 'rgba(33, 34, 44, 0.98)',
    text: '#f8f8f2',
    promptUser: '#50fa7b',
    promptHost: '#bd93f9',
    promptPath: '#8be9fd',
    promptSymbol: '#ff79c6',
    cursor: '#f8f8f2',
    selection: 'rgba(68, 71, 90, 0.5)',
  },
  monokai: {
    bg: 'rgba(39, 40, 34, 0.95)',
    titleBg: 'rgba(30, 31, 26, 0.98)',
    text: '#f8f8f2',
    promptUser: '#a6e22e',
    promptHost: '#66d9ef',
    promptPath: '#fd971f',
    promptSymbol: '#f92672',
    cursor: '#f8f8f2',
    selection: 'rgba(73, 72, 62, 0.5)',
  },
  solarized: {
    bg: 'rgba(0, 43, 54, 0.95)',
    titleBg: 'rgba(7, 54, 66, 0.98)',
    text: '#839496',
    promptUser: '#859900',
    promptHost: '#268bd2',
    promptPath: '#b58900',
    promptSymbol: '#2aa198',
    cursor: '#839496',
    selection: 'rgba(7, 54, 66, 0.6)',
  },
}
