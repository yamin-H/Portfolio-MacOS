import { NoteItem, SidebarFolder } from './types'

export const DEFAULT_FOLDERS: SidebarFolder[] = [
  // iCloud
  { id: 'all-icloud', name: 'All iCloud', section: 'icloud', iconName: 'folder', count: 74 },
  { id: 'notes-icloud', name: 'Notes', section: 'icloud', iconName: 'notes', count: 9 },
  { id: 'shared', name: 'Shared', section: 'icloud', iconName: 'shared', count: 14 },
  { id: 'articles', name: 'Articles', section: 'icloud', iconName: 'articles', count: 11 },
  { id: 'private', name: 'Private', section: 'icloud', iconName: 'private', count: 4 },
  { id: 'appstories', name: 'AppStories', section: 'icloud', iconName: 'folder', count: 0 },
  { id: 'archive', name: 'Archive', section: 'icloud', iconName: 'archive', count: 9 },
  { id: 'home', name: 'Home', section: 'icloud', iconName: 'home', count: 4 },

  // Personal
  { id: 'personal', name: 'Personal ☕', section: 'personal', iconName: 'coffee', count: 6 },
  { id: 'health', name: 'Health', section: 'personal', iconName: 'folder', count: 3 },
  { id: 'cartoons', name: 'New Yorker Cartoons', section: 'personal', iconName: 'folder', count: 4 },
  { id: 'travel', name: 'Travel ✈️', section: 'personal', iconName: 'plane', count: 10 },
  { id: 'recently-deleted', name: 'Recently Deleted', section: 'icloud', iconName: 'trash', count: 9 },
]

export const SEED_NOTES: NoteItem[] = [
  // ── Note 1: Nintendo Switch and Zelda (Exact Match to Image 2) ────────────
  {
    id: 'nintendo-zelda',
    title: 'Nintendo Switch and Zelda thoughts',
    folderId: 'notes-icloud',
    createdAt: Date.now() - 1000 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 5,
    isPinned: true,
    isStarred: true,
    thumbnailType: 'zelda',
    group: 'Today',
    plainText: 'Switch console — In many ways this is the Nintendo console I\'ve been waiting my entire life for. The dream of a single console you take everywhere.',
    content: `
      <h1>Nintendo Switch and Zelda thoughts</h1>
      
      <div class="apple-hero-image-container" style="border-radius: 8px; overflow: hidden; margin: 16px 0 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.12);">
        <svg viewBox="0 0 700 380" width="100%" height="280" style="display: block;">
          <defs>
            <linearGradient id="zeldaHeroSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A90E2" />
              <stop offset="50%" stopColor="#87CEEB" />
              <stop offset="100%" stopColor="#E0F7FA" />
            </linearGradient>
            <linearGradient id="zeldaHeroMeadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7CB342" />
              <stop offset="100%" stopColor="#33691E" />
            </linearGradient>
          </defs>
          <rect width="700" height="380" fill="url(#zeldaHeroSky)" />
          {/* Distant Hyrule Mountains and Death Mountain */}
          <polygon points="50,240 180,120 310,240" fill="#90CAF9" opacity="0.6" />
          <polygon points="260,250 420,80 580,250" fill="#64B5F6" opacity="0.7" />
          <polygon points="400,105 420,80 440,105" fill="#FFFFFF" />
          {/* Silhouette Flocks of Birds */}
          <path d="M 120,80 Q 135,68 150,80 Q 165,68 180,80" stroke="#1A237E" stroke-width="2.5" fill="none" />
          <path d="M 210,50 Q 222,40 234,50 Q 246,40 258,50" stroke="#1A237E" stroke-width="2" fill="none" />
          <path d="M 480,70 Q 495,58 510,70 Q 525,58 540,70" stroke="#1A237E" stroke-width="2.5" fill="none" />
          {/* Lush Green Hyrule Ridge */}
          <path d="M 0,380 L 0,260 Q 250,200 480,240 L 700,210 L 700,380 Z" fill="url(#zeldaHeroMeadow)" />
          {/* Overhanging Cliff Rock */}
          <path d="M 380,380 Q 450,240 550,220 Q 640,240 700,260 L 700,380 Z" fill="#5D4037" opacity="0.9" />
          {/* Link Standing on the Edge */}
          <rect x="520" y="175" width="8" height="32" fill="#0D47A1" rx="2" />
          <circle cx="524" cy="170" r="6" fill="#FFCC80" />
          <polygon points="516,182 520,175 528,175 532,182" fill="#F57F17" />
          <rect x="515" y="180" width="5" height="18" fill="#4E342E" rx="1" />
        </svg>
      </div>

      <h2>Switch console</h2>

      {/* Polygon Rich Link Card (Matching Image 2) */}
      <div style="display: flex; align-items: center; justify-content: space-between; background-color: #F8F8F9; border: 0.5px solid rgba(0,0,0,0.12); border-radius: 8px; padding: 12px 14px; margin: 16px 0; text-decoration: none; color: inherit;">
        <div>
          <div style="font-size: 13.5px; font-weight: 600; color: #1D1D1F; margin-bottom: 2px;">
            Nintendo says the Switch outsold the...
          </div>
          <div style="font-size: 11px; color: #8E8E93; margin-bottom: 4px;">www.polygon.com</div>
          <div style="font-size: 11.5px; color: #636366;">Zelda: Breath of the Wild is the biggest stand-alone launch title</div>
        </div>
        <div style="width: 48px; height: 48px; border-radius: 6px; background-color: #8CC63F; overflow: hidden; flex-shrink: 0; margin-left: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
          🎮
        </div>
      </div>

      <p>In many ways this is the Nintendo console I've been waiting my entire life for</p>

      <ul>
        <li>The dream of a single console you take everywhere</li>
        <li>Having the same games, the same experience everywhere</li>
        <li>Obviously this would have required some shifts in how to approach a game that is both for portable and the TV</li>
        <li>And some companies have tried this before with mixed second-screen approaches, including Nintendo, with products such as Wii U, PS Vita</li>
      </ul>

      <p>The Nintendo Switch feels both obvious and completely fresh at the same time</p>
    `.trim(),
  },

  // ── Note 2: Testing for Ultimate Guide (Exact Match to Image 1) ───────────
  {
    id: 'testing-apple-notes',
    title: 'Testing for the Ultimate Guide to Apple Notes',
    folderId: 'notes-icloud',
    createdAt: Date.now() - 1000 * 60 * 30,
    updatedAt: Date.now() - 1000 * 60 * 20,
    isPinned: false,
    isStarred: true,
    thumbnailType: 'camera',
    group: 'Today',
    plainText: '9:11 AM Test Test 2 Test 3 — Testing for the Ultimate Guide to Apple Notes with tables, rich media cards, and audio recordings.',
    content: `
      <h1>Testing for the Ultimate Guide to Apple Notes</h1>

      {/* Table from Image 1 */}
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid rgba(0,0,0,0.12);">
        <thead>
          <tr style="background-color: #F8F8F9;">
            <th style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px; text-align: left;">Test</th>
            <th style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px; text-align: left;">Col 2</th>
            <th style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px; text-align: left;">Col 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px;">Test 1</td>
            <td style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px;">Value A</td>
            <td style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px;">Data X</td>
          </tr>
          <tr>
            <td style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px;">Test 2</td>
            <td style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px;">Value B</td>
            <td style="border: 1px solid rgba(0,0,0,0.1); padding: 8px 12px;">Data Y</td>
          </tr>
        </tbody>
      </table>

      <p><a href="https://thenewsprint.co/2023/08/13/the-leica-q2/" style="color: #D48800; text-decoration: underline;">https://thenewsprint.co/2023/08/13/the-leica-q2/</a></p>

      {/* Leica Q2 Rich Media Card (Exact Match to Image 1!) */}
      <div style="border-radius: 12px; overflow: hidden; border: 0.5px solid rgba(0,0,0,0.12); margin: 16px 0; max-width: 480px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <div style="height: 240px; background-color: #D4A373; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 400 240" width="100%" height="240" style="display: block;">
            <defs>
              <linearGradient id="leicaDesk" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C9935E" />
                <stop offset="100%" stopColor="#A66832" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#leicaDesk)" />
            {/* Blue Leather Strap */}
            <path d="M 60,30 Q 200,10 330,80 Q 260,180 200,190" stroke="#0077B6" stroke-width="14" stroke-linecap="round" fill="none" />
            {/* Camera Body */}
            <rect x="130" y="80" width="140" height="95" rx="10" fill="#1C1C1E" stroke="#3A3A3C" stroke-width="2" />
            <rect x="140" y="88" width="120" height="30" fill="#2C2C2E" rx="3" />
            {/* Red Leica Logo */}
            <circle cx="152" cy="100" r="6" fill="#E63946" />
            {/* Lens Barrel */}
            <circle cx="200" cy="130" r="36" fill="#2C2C2E" stroke="#555" stroke-width="3" />
            <circle cx="200" cy="130" r="26" fill="#0D1B2A" />
            <circle cx="194" cy="124" r="8" fill="#48CAE4" opacity="0.6" />
          </svg>
        </div>
        <div style="padding: 12px 16px; background-color: #F8F8F9;">
          <div style="font-size: 14px; font-weight: 700; color: #1D1D1F;">The Leica Q2</div>
          <div style="font-size: 11.5px; color: #8E8E93;">thenewsprint.co</div>
        </div>
      </div>

      <p><a href="https://ballcharts.com/teams/index.php?team=borderwestbaseball" style="color: #D48800; text-decoration: underline;">https://ballcharts.com/teams/index.php?team=borderwestbaseball</a></p>

      {/* Audio Recording Card from Image 1 */}
      <div style="display: flex; align-items: center; justify-content: space-between; background-color: #F2F2F7; border: 0.5px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 12px 16px; max-width: 380px; margin: 16px 0;">
        <div>
          <div style="font-size: 13.5px; font-weight: 600; color: #1D1D1F;">76 Fairway Dr.m4a</div>
          <div style="font-size: 11px; color: #8E8E93; margin-top: 2px;">Audio Recording &middot; 51 KB</div>
        </div>
        <div style="width: 38px; height: 38px; border-radius: 50%; background-color: #007AFF; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,122,255,0.3);">
          ▶
        </div>
      </div>
    `.trim(),
  },

  // ── Note 3: ESV Daily Bible Reading Plan (Exact Match to Image 1 Pinned) ──
  {
    id: 'esv-bible',
    title: 'ESV Daily Bible Reading Plan',
    folderId: 'notes-icloud',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 365,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 360,
    isPinned: true,
    isStarred: false,
    thumbnailType: 'doc',
    group: 'Pinned',
    plainText: '2022-09-17 #biblestudy #church — Daily reading schedule and reflection notes.',
    content: `
      <h1>ESV Daily Bible Reading Plan</h1>
      <p>2022-09-17 #biblestudy #church</p>
      
      <h2>Psalms &amp; Wisdom Literature</h2>
      <ul data-type="taskList">
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Psalm 1 — The Tree Planted by Streams of Water</p></div></li>
        <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Psalm 23 — The Lord Is My Shepherd</p></div></li>
        <li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>Proverbs 3:5-6 — Trust in the Lord with All Your Heart</p></div></li>
      </ul>
    `.trim(),
  },

  // ── Note 4: iOS 11 Review Layout (Image 2) ────────────────────────────────
  {
    id: 'ios-11-review',
    title: 'iOS 11 Review Layout',
    folderId: 'notes-icloud',
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    isPinned: false,
    isStarred: false,
    thumbnailType: 'twitter',
    group: 'Yesterday',
    plainText: '1/9/17 TL;DR section with best tips from Federico Viticci\'s comprehensive review.',
    content: `
      <h1>iOS 11 Review Layout</h1>
      <p>1/9/17 TL;DR section with best tips from MacStories review.</p>
      
      <h2>Drag and Drop Architecture</h2>
      <p>Inter-app drag and drop on iPad transformed multitasking with spring-loaded folders, asynchronous file transfers, and dock persistence.</p>
    `.trim(),
  },

  // ── Note 5: Summer Research (Synchronized with Safari Quick Note) ──────────
  {
    id: 'summer-research',
    title: 'Summer Research — Neuroglia in Synaptic Plasticity',
    folderId: 'quick-notes',
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4,
    isPinned: false,
    isStarred: true,
    thumbnailType: 'doc',
    group: 'Yesterday',
    plainText: 'they were considered a supportive matrix within the skull. This prompted the 19th-century researcher Rudolph Virchow to dub this neuroglia.',
    content: `
      <h1>Summer Research — Neuroglia in Synaptic Plasticity</h1>
      <p>April 1, 2026 at 9:41 AM &middot; Clipped from Quanta Magazine</p>

      <blockquote style="border-left: 4px solid #007A33; background-color: rgba(0, 122, 51, 0.08); padding: 10px 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
        <p>&ldquo;they were considered a supportive matrix within the skull. This prompted the 19th-century researcher Rudolph Virchow to dub this non-neuronal material &lsquo;neuroglia,&rsquo; drawing on the Greek word for glue.&rdquo;</p>
      </blockquote>

      <h2>Tripartite Synapses &amp; Astrocyte Control</h2>
      <p>Confocal microscopy reveals astrocytes (red) intertwined with oligodendrocytes (green). Astrocytes actively regulate synaptic transmission via calcium transients.</p>
    `.trim(),
  },

  // ── Note 6: The waning days of DEI (Image 1) ──────────────────────────────
  {
    id: 'waning-days',
    title: '# The waning days of DEI\'s domina...',
    folderId: 'articles',
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    isPinned: false,
    isStarred: false,
    group: 'Yesterday',
    plainText: 'Yesterday Author: David Heinemeier Hansson — Reflections on corporate culture shifts and return to mission focus.',
    content: `
      <h1>The waning days of DEI's dominance</h1>
      <p>Author: David Heinemeier Hansson &middot; Worldview &amp; Company Mission</p>
      <p>Focusing on great products, customer respect, and technical craftsmanship.</p>
    `.trim(),
  },

  // ── Note 7: Paying Attention (Image 1) ────────────────────────────────────
  {
    id: 'paying-attention',
    title: '# Paying Attention',
    folderId: 'articles',
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    updatedAt: Date.now() - 1000 * 60 * 60 * 25,
    isPinned: false,
    isStarred: false,
    group: 'Yesterday',
    plainText: 'Yesterday Author: Morgan Housel — The value of focus, patience, and recognizing non-linear compounded growth.',
    content: `
      <h1>Paying Attention</h1>
      <p>Author: Morgan Housel &middot; Collaborative Fund</p>
      <p>The best financial and intellectual investments are the ones where time does the heavy lifting.</p>
    `.trim(),
  },

  // ── Note 8: Effective > Productive (Image 1) ──────────────────────────────
  {
    id: 'effective-productive',
    title: '# Effective > Productive',
    folderId: 'articles',
    createdAt: Date.now() - 1000 * 60 * 60 * 32,
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
    isPinned: false,
    isStarred: false,
    group: 'Yesterday',
    plainText: 'Yesterday Author: Jason Fried — Output versus outcomes. Why doing fewer things with intention creates better software.',
    content: `
      <h1>Effective &gt; Productive</h1>
      <p>Author: Jason Fried &middot; 37signals</p>
      <p>Being productive is doing a lot of things. Being effective is doing the right things that truly move the needle.</p>
    `.trim(),
  },
]
