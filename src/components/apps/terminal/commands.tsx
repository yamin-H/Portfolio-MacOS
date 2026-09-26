import React from 'react'
import { filesystem, FSFolder, FSFile, FSNode } from '@/data/filesystem'
import { CONTENT } from '@/data/content'
import { TerminalLine, TerminalTheme } from './types'
import { useWindowStore } from '@/app/store/windowStore'
import { generateAgentResponse } from '@/lib/agent/engine'

export interface CommandContext {
  cwd: string // e.g. '~', '~/About', '~/Projects', '~/Resume', '/'
  setCwd: (path: string) => void
  theme: TerminalTheme
  setTheme: (theme: TerminalTheme) => void
  commandHistory: string[]
  clearBuffer: () => void
  openWindow: (appId: string) => void
  startMatrix: () => void
  startScreensaver: () => void
}

// ─── HELPER: RESOLVE FS NODE ─────────────────────────────────────────────────

export function resolveNode(pathStr: string, currentCwd: string): { node: FSNode | null; resolvedPath: string; isRoot: boolean } {
  const clean = pathStr.trim()

  let fullPath = clean
  if (!fullPath || fullPath === '.') {
    fullPath = currentCwd
  } else if (fullPath === '~' || fullPath === '/Users/yamin' || fullPath === '/home/yamin') {
    fullPath = '~'
  } else if (fullPath === '..') {
    if (currentCwd === '~' || currentCwd === '/') {
      fullPath = '/'
    } else {
      fullPath = '~'
    }
  } else if (fullPath.startsWith('~/')) {
    // Already relative to home
  } else if (!fullPath.startsWith('/')) {
    if (currentCwd === '~') {
      fullPath = `~/${clean}`
    } else {
      fullPath = `${currentCwd}/${clean}`
    }
  }

  // Check root
  if (fullPath === '/' || fullPath === '/Users' || fullPath === '/home') {
    return {
      node: {
        name: 'Users',
        type: 'folder',
        children: [filesystem],
      },
      resolvedPath: fullPath,
      isRoot: true,
    }
  }

  if (fullPath === '~') {
    return { node: filesystem, resolvedPath: '~', isRoot: false }
  }

  // Path like ~/About or ~/Projects/pr-review-agent.md
  const segments = fullPath.replace(/^~\/?/, '').split('/').filter(Boolean)
  let curr: FSFolder = filesystem

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i].toLowerCase()
    const isLast = i === segments.length - 1

    const found = curr.children.find((c) => c.name.toLowerCase() === seg)
    if (!found) {
      return { node: null, resolvedPath: fullPath, isRoot: false }
    }

    if (isLast) {
      return { node: found, resolvedPath: fullPath, isRoot: false }
    }

    if (found.type === 'folder') {
      curr = found
    } else {
      return { node: null, resolvedPath: fullPath, isRoot: false }
    }
  }

  return { node: filesystem, resolvedPath: '~', isRoot: false }
}

// ─── COMMAND RUNNER ──────────────────────────────────────────────────────────

export function executeCommand(rawInput: string, ctx: CommandContext): TerminalLine[] {
  const input = rawInput.trim()
  if (!input) return []

  const parts = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || []
  const cmd = (parts[0] || '').toLowerCase()
  const args = parts.slice(1).map((a) => a.replace(/^["']|["']$/g, ''))

  switch (cmd) {
    // ── 1. pwd ─────────────────────────────────────────────────────────────
    case 'pwd': {
      const displayPath = ctx.cwd === '~' ? '/Users/yamin' : ctx.cwd.replace(/^~/, '/Users/yamin')
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: displayPath,
        },
      ]
    }

    // ── 2. cd ──────────────────────────────────────────────────────────────
    case 'cd': {
      const target = args[0]
      if (!target || target === '~') {
        ctx.setCwd('~')
        return []
      }

      if (target === '..') {
        if (ctx.cwd === '~' || ctx.cwd === '/') {
          ctx.setCwd('/')
        } else {
          ctx.setCwd('~')
        }
        return []
      }

      if (target === '/') {
        ctx.setCwd('/')
        return []
      }

      const { node, resolvedPath } = resolveNode(target, ctx.cwd)
      if (!node) {
        return [
          {
            id: Math.random().toString(),
            type: 'error',
            content: `cd: no such file or directory: ${target}`,
          },
        ]
      }

      if (node.type !== 'folder') {
        return [
          {
            id: Math.random().toString(),
            type: 'error',
            content: `cd: not a directory: ${target}`,
          },
        ]
      }

      ctx.setCwd(resolvedPath)
      return []
    }

    // ── 3. ls ──────────────────────────────────────────────────────────────
    case 'ls': {
      const isLong = args.some((a) => a.includes('l'))
      const isAll = args.some((a) => a.includes('a'))
      const pathArg = args.find((a) => !a.startsWith('-'))

      const targetPath = pathArg || ctx.cwd
      const { node } = resolveNode(targetPath, ctx.cwd)

      if (!node) {
        return [
          {
            id: Math.random().toString(),
            type: 'error',
            content: `ls: ${targetPath}: No such file or directory`,
          },
        ]
      }

      if (node.type === 'file') {
        return [
          {
            id: Math.random().toString(),
            type: 'output',
            content: node.name,
          },
        ]
      }

      const folder = node as FSFolder
      let entries = [...folder.children]

      if (isAll) {
        // Prepend simulated dotfiles
        const dotFiles: FSFile[] = [
          { name: '.zshrc', type: 'file', extension: 'txt', content: '# macOS Portfolio zsh config\nexport USER="yamin"\n' },
          { name: '.gitconfig', type: 'file', extension: 'txt', content: '[user]\n  name = Yamin Hossain\n  email = yamindr@gmail.com\n' },
        ]
        entries = [...dotFiles, ...entries]
      }

      if (isLong) {
        const lines: string[] = [`total ${entries.length * 8}`]
        entries.forEach((e) => {
          const isDir = e.type === 'folder'
          const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--'
          const size = isDir ? '  160' : ' 3420'
          const date = 'Sep 22 10:30'
          lines.push(`${perms}  3 yamin  staff ${size} ${date} ${e.name}`)
        })
        return [
          {
            id: Math.random().toString(),
            type: 'output',
            content: lines.join('\n'),
          },
        ]
      }

      // Compact grid row with macOS-style directory colors
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {entries.map((e) => {
                const isDir = e.type === 'folder'
                return (
                  <span
                    key={e.name}
                    style={{
                      color: isDir ? '#5ac8fa' : '#d4d4d8',
                      fontWeight: isDir ? 500 : 400,
                    }}
                  >
                    {e.name}
                    {isDir ? '/' : ''}
                  </span>
                )
              })}
            </div>
          ),
        },
      ]
    }

    // ── 4. cat ─────────────────────────────────────────────────────────────
    case 'cat': {
      const filename = args[0]
      if (!filename) {
        return [
          {
            id: Math.random().toString(),
            type: 'error',
            content: 'usage: cat <filename>',
          },
        ]
      }

      const { node } = resolveNode(filename, ctx.cwd)
      if (!node) {
        return [
          {
            id: Math.random().toString(),
            type: 'error',
            content: `cat: ${filename}: No such file or directory`,
          },
        ]
      }

      if (node.type === 'folder') {
        return [
          {
            id: Math.random().toString(),
            type: 'error',
            content: `cat: ${filename}: Is a directory`,
          },
        ]
      }

      const file = node as FSFile
      const fileKey = file.name
      const content = CONTENT[fileKey] || `# ${file.name}\n\nNo text content preview attached.`

      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: content,
        },
      ]
    }

    // ── 5. neofetch ────────────────────────────────────────────────────────
    case 'neofetch': {
      const uptimeMin = Math.floor((Date.now() % 86400000) / 60000)
      const uptimeHours = Math.floor(uptimeMin / 60)
      const uptimeFormatted = `${uptimeHours}h ${uptimeMin % 60}m`

      const palette1 = ['#282a36', '#ff5555', '#50fa7b', '#f1fa8c', '#bd93f9', '#ff79c6', '#8be9fd', '#f8f8f2']
      const palette2 = ['#6272a4', '#ff6e6e', '#69ff94', '#ffffa5', '#d6acff', '#ff92df', '#a4ffff', '#ffffff']

      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4, marginBottom: 4 }}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                {/* Apple ASCII Art */}
                <pre
                  style={{
                    margin: 0,
                    fontFamily: 'inherit',
                    lineHeight: 1.25,
                    fontSize: '0.88em',
                    color: '#a0a0a5',
                    userSelect: 'none',
                  }}
                >
{`                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loolloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMWd.
 .0MMMMMMMMMMMMMMMMMMMMMMMWd.
   kMMMMMMMMMMMMMMMMMMMMMMd
    ;KMMMMMMMWXXWMMMMMMMk.
      .cooc,.    .,coo:.`}
                </pre>

                {/* Specs Info Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: '0.94em', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600, color: '#dedee2' }}>
                    yamin<span style={{ color: 'rgba(220, 220, 225, 0.5)' }}>@</span>Yamins-MacBook-Air
                  </div>
                  <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)', margin: '2px 0 4px' }} />

                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>OS:</span> <span style={{ color: '#b0b0b6' }}>Portfolio OS (macOS Sonoma 14.5)</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Host:</span> <span style={{ color: '#b0b0b6' }}>MacBook Air (M2, 2023)</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Kernel:</span> <span style={{ color: '#b0b0b6' }}>Darwin 23.5.0</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Uptime:</span> <span style={{ color: '#b0b0b6' }}>{uptimeFormatted}</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Shell:</span> <span style={{ color: '#b0b0b6' }}>zsh 5.9 (arm64-apple-darwin23.0)</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Terminal:</span> <span style={{ color: '#b0b0b6' }}>Apple Terminal 2.14</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>CPU:</span> <span style={{ color: '#b0b0b6' }}>Apple M2 (8 cores: 4P + 4E)</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Memory:</span> <span style={{ color: '#b0b0b6' }}>16 GB Unified Memory</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Role:</span> <span style={{ color: '#5ac8fa' }}>AI-Native Software Engineer</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Focus:</span> <span style={{ color: '#30d158' }}>LangGraph · Production RAG · Agents</span></div>
                  <div><span style={{ color: '#dedee2', fontWeight: 500 }}>Location:</span> <span style={{ color: '#b0b0b6' }}>Rajshahi, Bangladesh</span></div>
                </div>
              </div>

              {/* Color swatches */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {palette1.map((c, i) => (
                    <span key={i} style={{ display: 'inline-block', width: 22, height: 11, backgroundColor: c, borderRadius: 1 }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {palette2.map((c, i) => (
                    <span key={i} style={{ display: 'inline-block', width: 22, height: 11, backgroundColor: c, borderRadius: 1 }} />
                  ))}
                </div>
              </div>
            </div>
          ),
        },
      ]
    }

    // ── 6. man ─────────────────────────────────────────────────────────────
    case 'man': {
      const topic = args[0]
      if (topic !== 'yamin' && topic !== 'portfolio') {
        return [
          {
            id: Math.random().toString(),
            type: 'error',
            content: `No manual entry for ${topic || 'unknown'}. Try 'man yamin'.`,
          },
        ]
      }

      const manPage = `
YAMIN(1)                    General Commands Manual                   YAMIN(1)

NAME
     yamin -- AI-native software engineer, LangGraph pipelines, RAG systems

SYNOPSIS
     yamin [--hire] [--stack] [--projects] [--contact]

DESCRIPTION
     Yamin Hossain is an AI-Native Software Engineer based in Rajshahi,
     Bangladesh. He specializes in end-to-end multi-agent pipelines, LangGraph,
     pgvector RAG systems, and observable autonomous software engineering workflows.

     Engineering practices:
       * Async queuing with exponential backoff & jitter
       * Observable multi-agent execution graphs
       * Deterministic state persistence & guardrails
       * Zero tolerance for fragile toy demos

PROJECTS
     PR Review Agent
         Autonomous multi-agent LangGraph system that analyzes pull requests,
         detects security issues, and leaves inline review comments.

     Bug Reproducer
         Agentic pipeline that ingests raw error logs, isolates failures in Docker,
         and synthesizes minimal reproduction scripts.

     Remotion Open-Source Contribution
         Programmatic video generation improvements and performance optimizations.

OPTIONS
     --hire
         Initiate hiring inquiry sequence.
     --stack
         Inspect core technical stack and architectural tooling.
     --contact
         Email: yamindr@gmail.com | GitHub: github.com/yamin

SEE ALSO
     neofetch(1), git(1), cat(1), sudo(8)

Portfolio OS 1.0.0               September 2026                        YAMIN(1)
`
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: manPage.trim(),
        },
      ]
    }

    // ── 7. git log ─────────────────────────────────────────────────────────
    case 'git': {
      const sub = args[0]
      if (sub === 'status') {
        return [
          {
            id: Math.random().toString(),
            type: 'output',
            content: `On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean`,
          },
        ]
      }

      if (sub === 'log') {
        const logOutput = `commit e5ac60d093234d1f97388ef52b5271d4 (HEAD -> main, origin/main)
Author: Yamin Hossain <yamindr@gmail.com>
Date:   Tue Sep 22 16:40:00 2026 +0600

    feat(finder): implement macOS Go to Folder & Spotlight search modal

commit 7f2a8904b12c49d28a349c0d12e45678
Author: Yamin Hossain <yamindr@gmail.com>
Date:   Mon Sep 21 14:15:22 2026 +0600

    feat(agents): build LangGraph multi-agent orchestration pipeline

commit 4a3b1c98d7e6f5021a89c4b73e210987
Author: Yamin Hossain <yamindr@gmail.com>
Date:   Sun Sep 20 11:00:10 2026 +0600

    perf(rag): optimize vector retrieval with pgvector and semantic cache

commit 1b8d234a980c5e71420f67891234abcd
Author: Yamin Hossain <yamindr@gmail.com>
Date:   Sat Sep 19 09:30:15 2026 +0600

    chore(shell): establish window manager spring physics and direct DOM drag`

        return [
          {
            id: Math.random().toString(),
            type: 'output',
            content: logOutput,
          },
        ]
      }

      return [
        {
          id: Math.random().toString(),
          type: 'error',
          content: `git: '${sub || ''}' is not a valid git command. Try 'git log' or 'git status'.`,
        },
      ]
    }

    // ── 8. whoami ──────────────────────────────────────────────────────────
    case 'whoami': {
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: 'yamin',
        },
      ]
    }

    // ── 9. history ─────────────────────────────────────────────────────────
    case 'history': {
      const lines = ctx.commandHistory.map((cmdStr, idx) => `  ${idx + 1}  ${cmdStr}`)
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: lines.join('\n') || '  1  neofetch',
        },
      ]
    }

    // ── 10. clear ──────────────────────────────────────────────────────────
    case 'clear': {
      ctx.clearBuffer()
      return []
    }

    // ── 11. date ───────────────────────────────────────────────────────────
    case 'date': {
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: new Date().toString(),
        },
      ]
    }

    // ── 12. echo ───────────────────────────────────────────────────────────
    case 'echo': {
      let text = args.join(' ')
      text = text.replace(/\$USER/g, 'yamin')
      text = text.replace(/\$SHELL/g, '/bin/zsh')
      text = text.replace(/\$HOME/g, '/Users/yamin')
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: text,
        },
      ]
    }

    // ── 13. contact ────────────────────────────────────────────────────────
    case 'contact': {
      const contactCard = `
Yamin Hossain — Contact Information
------------------------------------
Email:    yamindr3@gmail.com
GitHub:   https://github.com/yamin-H
LinkedIn: https://www.linkedin.com/in/yamin-hossain-n/
Location: Rajshahi, Bangladesh
Status:   Open to early-stage remote engineering roles
`
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: contactCard.trim(),
        },
      ]
    }

    // ── 14. sudo ───────────────────────────────────────────────────────────
    case 'sudo': {
      const targetAction = args.join(' ').toLowerCase()
      if (targetAction.includes('hire')) {
        return [
          {
            id: Math.random().toString(),
            type: 'system',
            content: `[HIRING PROTOCOL INITIATED]\nLooking to hire Yamin? Great decision.\nDirect Email: yamindr3@gmail.com\nGitHub: https://github.com/yamin-H\nLinkedIn: https://www.linkedin.com/in/yamin-hossain-n/\nCurrently available for full-time remote senior AI/agent engineering roles.`,
          },
        ]
      }
      return [
        {
          id: Math.random().toString(),
          type: 'error',
          content: `yamin is not in the sudoers file. This incident will be reported.`,
        },
      ]
    }

    // ── 15. matrix ─────────────────────────────────────────────────────────
    case 'matrix': {
      ctx.startMatrix()
      return [
        {
          id: Math.random().toString(),
          type: 'system',
          content: 'Wake up, Neo... Launching Matrix code stream (press any key to exit)...',
        },
      ]
    }

    // ── 16. screensaver ────────────────────────────────────────────────────
    case 'screensaver': {
      ctx.startScreensaver()
      return [
        {
          id: Math.random().toString(),
          type: 'system',
          content: 'Launching Starfield idle screensaver...',
        },
      ]
    }

    // ── 17. cowsay ─────────────────────────────────────────────────────────
    case 'cowsay': {
      const msg = args.join(' ') || 'Moo! Welcome to Portfolio OS!'
      const bubble = `
  < ${msg} >
  ------------------------------------
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||
`
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: bubble.trim(),
        },
      ]
    }

    // ── 18. theme ──────────────────────────────────────────────────────────
    case 'theme': {
      const chosen = (args[0] || '').toLowerCase() as TerminalTheme
      if (['apple', 'matrix', 'dracula', 'monokai', 'solarized'].includes(chosen)) {
        ctx.setTheme(chosen)
        return [
          {
            id: Math.random().toString(),
            type: 'system',
            content: `Terminal theme switched to '${chosen}'.`,
          },
        ]
      }
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: `Current theme: ${ctx.theme}\nAvailable themes: apple, matrix, dracula, monokai, solarized\nUsage: theme <name>`,
        },
      ]
    }

    // ── 19. open ───────────────────────────────────────────────────────────
    case 'open': {
      const targetApp = (args[0] || '').toLowerCase()
      if (!targetApp) {
        return [
          {
            id: Math.random().toString(),
            type: 'error',
            content: 'usage: open <app_name | file_name>\nExamples: open finder, open calculator, open notes',
          },
        ]
      }

      if (['finder', 'files', 'about', 'projects'].includes(targetApp)) {
        ctx.openWindow('finder')
        return [
          {
            id: Math.random().toString(),
            type: 'system',
            content: `Opening Finder...`,
          },
        ]
      }

      if (['calculator', 'calc'].includes(targetApp)) {
        ctx.openWindow('calculator')
        return [{ id: Math.random().toString(), type: 'system', content: 'Opening Calculator...' }]
      }

      if (['safari', 'browser', 'web'].includes(targetApp)) {
        ctx.openWindow('safari')
        return [{ id: Math.random().toString(), type: 'system', content: 'Opening Safari...' }]
      }

      if (['notes', 'note'].includes(targetApp)) {
        ctx.openWindow('notes')
        return [{ id: Math.random().toString(), type: 'system', content: 'Opening Notes...' }]
      }

      if (['ai', 'assistant', 'siri', 'copilot', 'spotlight'].includes(targetApp)) {
        useWindowStore.getState().openAssistant()
        return [
          {
            id: Math.random().toString(),
            type: 'system',
            content: 'Launching Apple Intelligence / Siri Spotlight Assistant...',
          },
        ]
      }

      if (['jd', 'analyzer', 'jd-analyzer'].includes(targetApp)) {
        useWindowStore.getState().openAssistant(undefined, 'jd')
        return [
          {
            id: Math.random().toString(),
            type: 'system',
            content: 'Opening Job Description & Role Fit Analyzer in Siri Spotlight...',
          },
        ]
      }

      return [
        {
          id: Math.random().toString(),
          type: 'error',
          content: `open: application not found: ${targetApp}`,
        },
      ]
    }

    // ── 20. clear ────────────────────────────────────────────────────────────
    case 'clear': {
      ctx.clearBuffer()
      return []
    }

    // ── 21. history ─────────────────────────────────────────────────────────
    case 'history': {
      if (ctx.commandHistory.length === 0) {
        return [
          {
            id: Math.random().toString(),
            type: 'output',
            content: 'No commands in history.',
          },
        ]
      }
      const formatted = ctx.commandHistory
        .map((cmd, i) => `  ${(i + 1).toString().padStart(4, ' ')}  ${cmd}`)
        .join('\n')
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: formatted,
        },
      ]
    }

    // ── 22. ask / ai ────────────────────────────────────────────────────────
    case 'ask':
    case 'ai': {
      const query = args.join(' ')
      if (!query) {
        useWindowStore.getState().openAssistant()
        return [
          {
            id: Math.random().toString(),
            type: 'system',
            content: 'Opening Apple Intelligence Assistant (or type: ai <your question>)...',
          },
        ]
      }
      const res = generateAgentResponse(query)
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: res.text,
        },
      ]
    }

    // ── 23. jd / analyze-jd ──────────────────────────────────────────────────
    case 'jd':
    case 'analyze-jd': {
      useWindowStore.getState().openAssistant(undefined, 'jd')
      return [
        {
          id: Math.random().toString(),
          type: 'system',
          content: 'Opening Job Description & Role Fit Analyzer in Siri Spotlight...',
        },
      ]
    }

    // ── 24. langgraph / pipeline ──────────────────────────────────────────────
    case 'langgraph':
    case 'pipeline':
    case 'pr-agent': {
      useWindowStore.getState().openFinderFile('Projects/pr-review-agent.md')
      return [
        {
          id: Math.random().toString(),
          type: 'system',
          content: '⚡ Launching Live LangGraph Pipeline Simulation in Finder QuickLook...',
        },
        {
          id: Math.random().toString(),
          type: 'output',
          content: `LANGGRAPH 6-NODE ARCHITECTURE (PR REVIEW AGENT):
  [Node 1] Webhook Ingestion    (HMAC SHA-256 verification & Redis SETNX idempotency)
  [Node 2] BullMQ Queue Buffer  (Decouples 10s GitHub webhook limit, exponential backoff)
  [Node 3] AST Diff Parser      (Tree-sitter syntactic chunking of modified scopes)
  [Node 4] pgvector Retrieval   (384d cosine query over 6 months of past team PR history)
  [Node 5] FastAPI LLM Reasoner (Strict Pydantic schema validation & zero hallucinations)
  [Node 6] GitHub Dispatch      (Contextual inline review comment referencing PR #234)

Opening interactive visualizer window...`,
        },
      ]
    }

    // ── 23. help ───────────────────────────────────────────────────────────
    case 'help': {
      const helpText = `
PORTFOLIO OS — COMMAND INTERPRETER (ZSH 5.9)
--------------------------------------------

Filesystem & Navigation:
  ls [-l] [-a]      List directory contents with color highlighting
  cd <dir>          Change directory (e.g. cd Projects, cd About, cd ~)
  pwd               Print current working directory
  cat <file>        View contents of file (e.g. cat pr-review-agent.md)

Portfolio & System Info:
  neofetch          Display ASCII system information card
  man yamin         Read UNIX manual page for Yamin Hossain
  git log           View recent git commit logs
  whoami            Print active user account
  contact           Direct contact channels (Email, GitHub, LinkedIn)
  date              Display current system date & time

System Utilities & Customization:
  open <app>        Launch an OS application (e.g. open finder, open notes)
  theme <name>      Change color scheme (apple, matrix, dracula, monokai)
  history           View session command history
  clear             Clear terminal screen (or Ctrl+L)
  help              Show this reference menu

Easter Eggs:
  sudo hire yamin   Fast-track recruiter sequence
  matrix            Start digital rain animation
  screensaver       Start 3D Starfield warp screensaver
  cowsay <text>     Talking ASCII cow

Keyboard Shortcuts:
  Tab               Auto-complete commands and filenames
  Up / Down         Cycle command history
  Ctrl + C          Cancel current input line
  Ctrl + L          Clear terminal buffer
`
      return [
        {
          id: Math.random().toString(),
          type: 'output',
          content: helpText.trim(),
        },
      ]
    }

    // ── Unknown ────────────────────────────────────────────────────────────
    default: {
      return [
        {
          id: Math.random().toString(),
          type: 'error',
          content: `zsh: command not found: ${cmd}. Type 'help' for available commands.`,
        },
      ]
    }
  }
}
