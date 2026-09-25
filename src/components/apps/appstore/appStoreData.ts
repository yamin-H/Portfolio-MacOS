export interface AppItem {
  id: string
  name: string
  subtitle: string
  category: string
  developer: string
  price: string
  isGet?: boolean
  hasInAppPurchases?: boolean
  isCloud?: boolean
  iconUrl?: string
  iconColor: string
  iconBadge?: string
  rating: number
  ratingCount: string
  ageRating: string
  chartRank: string
  size: string
  languages: string
  description: string
  whatsNew?: {
    version: string
    releaseDate: string
    notes: string
  }
  features: string[]
  reviews: Array<{
    author: string
    date: string
    rating: number
    title: string
    body: string
  }>
  linkedOsAppId?: string
}

export interface FeaturedStory {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  badgeText?: string
  badgeImage?: string
  badgeColor: string
  badgeType: 'circle' | 'card'
  appId?: string
}

export interface AppCategory {
  id: string
  name: string
  iconName: string
  color: string
  appCount: number
  description: string
}

export interface AppUpdateItem {
  id: string
  appId: string
  name: string
  version: string
  size: string
  daysAgo: string
  notes: string
  developer: string
  iconColor: string
}

// ─── Reference Image Exact Match Apps (Great New Apps and Updates) ───────────
export const GREAT_NEW_APPS: AppItem[] = [
  {
    id: 'resident-evil-village',
    name: 'Resident Evil Village',
    subtitle: 'Mystery and monsters await in horror.',
    category: 'Action',
    developer: 'CAPCOM Co., Ltd.',
    price: '$39.99',
    isGet: false,
    rating: 4.8,
    ratingCount: '14.2K',
    ageRating: '17+',
    chartRank: '#1 in Action',
    size: '27.4 GB',
    languages: 'English, French, German, Italian, Japanese + 8 more',
    iconColor: 'linear-gradient(135deg, #1C1917, #44403C)',
    description: 'Experience survival horror like never before in Resident Evil Village. Set a few years after the horrifying events in the critically acclaimed Resident Evil 7 biohazard, the all-new storyline begins with Ethan Winters and his wife Mia living peacefully in a new location, free from their past nightmares. Just as they are building their new life together, tragedy befalls them once again.',
    features: [
      'Stunning Apple Silicon MetalFX Upscaling',
      'HDR support with Spatial Audio for Mac',
      'Native Game Controller & keyboard support',
      'Ultra-fast load times on unified memory'
    ],
    whatsNew: {
      version: '1.2.0',
      releaseDate: '1 week ago',
      notes: 'Added support for macOS Sequoia Game Mode, Metal 3 performance optimizations, and controller rumble enhancements.'
    },
    reviews: [
      { author: 'GamerX_Mac', date: 'Yesterday', rating: 5, title: 'Console quality on Mac!', body: 'Running at a locked 60fps with MetalFX on my M-series Mac. Beautiful lighting and terrifying atmosphere.' },
      { author: 'HorrorFanatic', date: '3 days ago', rating: 5, title: 'Incredible port', body: 'Capcom did a fantastic job with this native port. Smooth gameplay and quick loading.' }
    ]
  },
  {
    id: 'just-press-record',
    name: 'Just Press Record',
    subtitle: 'Record, Transcribe, and Sync.',
    category: 'Utilities',
    developer: 'Open Planet Software',
    price: '$4.99',
    isGet: false,
    rating: 4.7,
    ratingCount: '8.4K',
    ageRating: '4+',
    chartRank: '#4 in Utilities',
    size: '18.2 MB',
    languages: 'English, German, French, Spanish, Japanese',
    iconColor: 'linear-gradient(135deg, #EF4444, #DC2626)',
    description: 'Just Press Record is the ultimate audio recording app bringing one-tap recording, transcription and iCloud syncing to all your Apple devices. Ideal for musicians, journalists, students, and professionals.',
    features: [
      'Speech-to-text transcription with over 30 languages',
      'Waveform visualization and non-destructive editing',
      'Instant iCloud sync between iPhone, iPad, and Mac',
      'Menu bar quick recording shortcut'
    ],
    whatsNew: {
      version: '4.8.1',
      releaseDate: '4 days ago',
      notes: 'Enhanced background audio transcription speed and added keyboard shortcut support in Menu Bar.'
    },
    reviews: [
      { author: 'AudioJourno', date: '5 days ago', rating: 5, title: 'Essential for interviews', body: 'The transcription is remarkably accurate and iCloud sync makes transferring to Mac effortless.' }
    ]
  },
  {
    id: 'yarnbuddy',
    name: 'YarnBuddy – Knit & Row',
    subtitle: 'Knit and row counter with yarn stash.',
    category: 'Lifestyle',
    developer: 'Rebecca Swanson',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 4.9,
    ratingCount: '3.1K',
    ageRating: '4+',
    chartRank: '#8 in Lifestyle',
    size: '34.8 MB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    description: 'YarnBuddy is a companion app for knitters and crocheters. Track your projects with customizable row counters, link PDFs, take notes, and keep an inventory of your yarn stash and needles.',
    features: [
      'Multi-counter support for complex patterns',
      'PDF pattern viewer with highlight ruler',
      'Yarn stash catalog with photos and yardage',
      'Sync across iOS and Mac with iCloud'
    ],
    whatsNew: {
      version: '2.5.0',
      releaseDate: '2 weeks ago',
      notes: 'Added interactive desktop widgets for row counting directly from macOS Sequoia.'
    },
    reviews: [
      { author: 'CraftyCoder', date: '1 week ago', rating: 5, title: 'Best knitting app on macOS', body: 'Clean Apple-like interface, no clutter, and widget support is top tier.' }
    ]
  },
  {
    id: 'ocr-text-recognition',
    name: 'OCR Text Recognition',
    subtitle: 'Image to TXT & PDF scanner.',
    category: 'Utilities',
    developer: 'AppTower Inc.',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 4.6,
    ratingCount: '6.7K',
    ageRating: '4+',
    chartRank: '#6 in Utilities',
    size: '42.1 MB',
    languages: 'English, Chinese, Japanese, Korean, Spanish, German',
    iconColor: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    description: 'Extract text from any image, PDF, or screenshot with lightning speed. Powered by Apple Neural Engine for 100% on-device privacy and instant offline recognition.',
    features: [
      'On-device neural OCR with zero data collection',
      'Batch processing for multi-page PDF documents',
      'Extract tabular data directly to CSV or Excel',
      'Global hotkey for quick screenshot capture & OCR'
    ],
    whatsNew: {
      version: '3.1.2',
      releaseDate: '3 days ago',
      notes: 'Optimized Neural Engine performance on M3 and M4 Macs with 40% faster document scanning.'
    },
    reviews: [
      { author: 'DocMaster', date: '2 weeks ago', rating: 5, title: 'Incredible speed', body: 'Reads receipts and invoices perfectly. Super handy shortcut.' }
    ]
  },
  {
    id: 'switchglass',
    name: 'SwitchGlass',
    subtitle: 'Customizable App Switcher.',
    category: 'Utilities',
    developer: 'John Siracusa',
    price: '$4.99',
    isGet: false,
    rating: 4.9,
    ratingCount: '5.2K',
    ageRating: '4+',
    chartRank: '#12 in Utilities',
    size: '8.4 MB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #475569, #1E293B)',
    description: 'SwitchGlass adds a dedicated, customizable app switcher to your Mac. Configure per-display docks, adjust icon sizes, orientations, and margins to elevate multi-monitor productivity.',
    features: [
      'Per-display app switchers for multi-monitor setups',
      'Horizontal or vertical icon orientation',
      'Custom exclusions and hidden app filters',
      'Supports Stage Manager and Mission Control workspaces'
    ],
    whatsNew: {
      version: '2.0.4',
      releaseDate: '1 month ago',
      notes: 'Added native window tiling integration and dark/light mode accent matching.'
    },
    reviews: [
      { author: 'SiracusaFan', date: '3 weeks ago', rating: 5, title: 'Must-have Mac utility', body: 'If you have more than one monitor, this is simply indispensable.' }
    ]
  },
  {
    id: 'swift-playgrounds',
    name: 'Swift Playgrounds',
    subtitle: 'Learn real code. Build apps.',
    category: 'Developer Tools',
    developer: 'Apple Inc.',
    price: 'GET',
    isGet: true,
    rating: 4.8,
    ratingCount: '45.1K',
    ageRating: '4+',
    chartRank: '#2 in Developer Tools',
    size: '640 MB',
    languages: 'English, Simplified Chinese, Japanese, German, French',
    iconColor: 'linear-gradient(135deg, #F97316, #EA580C)',
    description: 'Swift Playgrounds is a revolutionary app for Mac and iPad that makes learning and experimenting with code interactive and fun. Solve puzzles to master the basics using Swift — a powerful programming language created by Apple.',
    features: [
      'Interactive visual code lessons and guided tutorials',
      'Build real SwiftUI apps directly on your Mac',
      'Publish your completed apps directly to App Store Connect',
      'Live previews with instant hot reloading'
    ],
    whatsNew: {
      version: '4.5',
      releaseDate: '2 weeks ago',
      notes: 'Support for Swift 6 language features, new AI agent tutorials, and revamped SwiftUI template galleries.'
    },
    reviews: [
      { author: 'CodeLearner', date: '1 month ago', rating: 5, title: 'Hands down the best way to learn Swift', body: 'The interactive feedback makes coding feel like solving a puzzle. Highly recommended!' }
    ]
  },
  {
    id: 'keynote',
    name: 'Keynote',
    subtitle: 'Build stunning presentations.',
    category: 'Productivity',
    developer: 'Apple Inc.',
    price: 'GET',
    isGet: true,
    isCloud: true,
    rating: 4.8,
    ratingCount: '98.3K',
    ageRating: '4+',
    chartRank: '#3 in Productivity',
    size: '482 MB',
    languages: 'English, Spanish, French, German, Italian + 25 more',
    iconColor: 'linear-gradient(135deg, #38BDF8, #0284C7)',
    linkedOsAppId: 'notes',
    description: 'Keynote makes it easy to create gorgeous, memorable presentations. Powerful tools and dazzling effects bring your ideas to life. Collaborate in real time with colleagues on Mac, iPad, iPhone, or PC.',
    features: [
      'Magic Move transitions that animate graphics smoothly',
      'Interactive charts, 3D object models, and live video feeds',
      'Seamless real-time collaboration with iCloud',
      'Export to PowerPoint, PDF, HTML, or ProRes movie'
    ],
    whatsNew: {
      version: '14.2',
      releaseDate: '3 weeks ago',
      notes: 'New dynamic slide themes, Apple Pencil hover annotations, and enhanced presenter display layouts.'
    },
    reviews: [
      { author: 'KeynotePro', date: '2 weeks ago', rating: 5, title: 'Unmatched elegance', body: 'Nothing comes close to Keynote animations and typographic polish. Beautiful.' }
    ]
  },
  {
    id: 'numbers',
    name: 'Numbers',
    subtitle: 'Create impressive spreadsheets.',
    category: 'Productivity',
    developer: 'Apple Inc.',
    price: 'GET',
    isGet: true,
    isCloud: true,
    rating: 4.7,
    ratingCount: '62.4K',
    ageRating: '4+',
    chartRank: '#5 in Productivity',
    size: '275 MB',
    languages: 'English, Spanish, French, German + 25 more',
    iconColor: 'linear-gradient(135deg, #22C55E, #16A34A)',
    linkedOsAppId: 'calculator',
    description: 'Numbers puts your data on an infinite canvas with tables and charts that look gorgeous on Apple displays. Over 250 powerful mathematical and financial functions.',
    features: [
      'Freeform canvas for tables, charts, images, and text',
      'Interactive radar charts and pivot tables',
      'Formula assistance with real-time error checking',
      'Excel file format import and export compatibility'
    ],
    whatsNew: {
      version: '14.2',
      releaseDate: '3 weeks ago',
      notes: 'Streamlined pivot table controls and faster calculations on multi-core Apple Silicon.'
    },
    reviews: [
      { author: 'FinanceGeek', date: '3 weeks ago', rating: 5, title: 'Spreadsheets done right', body: 'The canvas-based layout is so much more flexible than rigid grid-only tools.' }
    ]
  },
  {
    id: 'pages',
    name: 'Pages',
    subtitle: 'Documents that stand apart.',
    category: 'Productivity',
    developer: 'Apple Inc.',
    price: 'GET',
    isGet: true,
    isCloud: true,
    rating: 4.8,
    ratingCount: '78.9K',
    ageRating: '4+',
    chartRank: '#4 in Productivity',
    size: '315 MB',
    languages: 'English, Spanish, French, German + 25 more',
    iconColor: 'linear-gradient(135deg, #FB923C, #F97316)',
    linkedOsAppId: 'notes',
    description: 'Pages is a powerful word processor that lets you create stunning documents. Choose from over 90 Apple-designed templates or start with a blank page and add gorgeous typography, tables, and images.',
    features: [
      'Over 90 Apple-designed designer templates',
      'Change tracking, comments, and real-time collaboration',
      'Export directly to EPUB eBook, PDF, or Microsoft Word',
      'Advanced typography with OpenType features'
    ],
    whatsNew: {
      version: '14.2',
      releaseDate: '3 weeks ago',
      notes: 'Added new minimalist writing mode, improved EPUB formatting, and markdown quick-paste.'
    },
    reviews: [
      { author: 'AuthorMac', date: '1 month ago', rating: 5, title: 'Delightful writing experience', body: 'Distraction-free, responsive, and produces publication-ready documents.' }
    ]
  },
  {
    id: 'grocery-smart',
    name: 'Grocery - Smart Shopping',
    subtitle: 'Plan, shop, cook, and track pantry.',
    category: 'Food & Drink',
    developer: 'Conrad Kramer',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 4.9,
    ratingCount: '19.5K',
    ageRating: '4+',
    chartRank: '#1 in Food & Drink',
    size: '29.3 MB',
    languages: 'English, Spanish, German, French',
    iconColor: 'linear-gradient(135deg, #FACC15, #EAB308)',
    description: 'Grocery is a fast and smart grocery list and recipe manager. It sorts items in order of your store aisle automatically as you shop, tracks inventory, and syncs with Apple Reminders.',
    features: [
      'Smart store sorting that learns your grocery aisles',
      'Recipe clipper from Safari websites',
      'Pantry tracking with expiration reminders',
      'Apple Reminders two-way synchronization'
    ],
    whatsNew: {
      version: '3.8.0',
      releaseDate: '1 week ago',
      notes: 'New Safari web clipper extension and interactive desktop pantry widgets.'
    },
    reviews: [
      { author: 'HomeChef', date: '4 days ago', rating: 5, title: 'Saves so much shopping time', body: 'The automatic aisle sorting is genius. Never have to backtrack through the grocery store again!' }
    ]
  },
  {
    id: 'deliveries',
    name: 'Deliveries',
    subtitle: 'Track your packages worldwide.',
    category: 'Utilities',
    developer: 'Junecloud LLC',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 4.7,
    ratingCount: '23.8K',
    ageRating: '4+',
    chartRank: '#7 in Utilities',
    size: '22.6 MB',
    languages: 'English, German, French, Italian, Japanese',
    iconColor: 'linear-gradient(135deg, #D97706, #B45309)',
    description: 'Deliveries helps you keep track of all your incoming shipments. View the delivery status on a map, get countdown notifications for delivery day, and sync across your Apple devices with iCloud.',
    features: [
      'Supports UPS, FedEx, USPS, DHL, Amazon, Apple, and 40+ carriers',
      'Interactive shipment delivery route map',
      'Notification alerts when package is out for delivery',
      'Menu bar status widget for quick glance'
    ],
    whatsNew: {
      version: '9.4.1',
      releaseDate: '5 days ago',
      notes: 'Carrier tracking improvements for international shipments and macOS Sequoia menu bar optimizations.'
    },
    reviews: [
      { author: 'PackageTracker', date: '1 week ago', rating: 5, title: 'Cleanest package tracker', body: 'No ads, no spam, beautiful interface that respects privacy.' }
    ]
  },
  {
    id: 'kaleidoscope',
    name: 'Kaleidoscope 3',
    subtitle: 'Spot and merge text and folder diffs.',
    category: 'Developer Tools',
    developer: 'Kaleidoscope Apps GmbH',
    price: '$149.99',
    isGet: false,
    rating: 4.9,
    ratingCount: '4.2K',
    ageRating: '4+',
    chartRank: '#9 in Developer Tools',
    size: '56.7 MB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #6366F1, #4338CA)',
    description: 'Kaleidoscope is the most powerful diff and merge tool for Mac. Compare text files, images, documents, and entire folder directories. Deeply integrated with Git, Subversion, and terminal tools.',
    features: [
      'Three-way file comparison and conflict resolution',
      'Image diffing with split, strobe, and difference blend modes',
      'Folder comparison with recursive filtering',
      'Git merge tool integration with custom CLI ksdiff'
    ],
    whatsNew: {
      version: '3.9.0',
      releaseDate: '2 weeks ago',
      notes: 'Added syntax highlighting for Swift 6, TypeScript 5.5, Rust, and faster multi-gigabyte folder indexing.'
    },
    reviews: [
      { author: 'StaffDev', date: '3 weeks ago', rating: 5, title: 'Indispensable diffing tool', body: 'The image diffing and three-way git merge UI saved me hours on complex pull requests.' }
    ]
  }
]

// ─── Perfect Your Photos with Pixelmator Section (Reference Image Bottom) ─────
export const PHOTO_APPS: AppItem[] = [
  {
    id: 'pixelmator-pro',
    name: 'Pixelmator Pro',
    subtitle: 'Professional image editor for Mac.',
    category: 'Graphics & Design',
    developer: 'Pixelmator Team',
    price: '$49.99',
    isGet: false,
    rating: 4.9,
    ratingCount: '48.9K',
    ageRating: '4+',
    chartRank: '#1 in Graphics & Design',
    size: '584 MB',
    languages: 'English, German, French, Japanese, Spanish + 6 more',
    iconColor: 'linear-gradient(135deg, #F43F5E, #BE185D)',
    description: 'Pixelmator Pro is an incredibly powerful, beautiful, and easy to use image editor designed exclusively for Mac. With a complete collection of professional photo editing tools, full RAW support, and machine learning powered enhancements.',
    features: [
      'AI Super Resolution upscaling without loss of sharpness',
      'Core ML automatic background removal & subject selection',
      'Full RAW photo editing with 16-bit color depth',
      'Vector drawing and non-destructive graphic design layers'
    ],
    whatsNew: {
      version: '3.6.4',
      releaseDate: '1 week ago',
      notes: 'Archipelago update: revolutionary web mockup export, modern SVG generator, and faster Apple Silicon rendering.'
    },
    reviews: [
      { author: 'PhotographerDan', date: '4 days ago', rating: 5, title: 'Goodbye Photoshop subscriptions', body: 'One-time purchase, blazing speed on Apple Silicon, and an interface that feels truly native to Mac.' }
    ]
  },
  {
    id: 'adobe-lightroom',
    name: 'Adobe Lightroom',
    subtitle: 'Edit, manage, and share photos.',
    category: 'Photo & Video',
    developer: 'Adobe Inc.',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 4.8,
    ratingCount: '34.2K',
    ageRating: '4+',
    chartRank: '#2 in Photo & Video',
    size: '1.2 GB',
    languages: 'English, French, German, Spanish + 12 more',
    iconColor: 'linear-gradient(135deg, #0284C7, #0369A1)',
    description: 'Adobe Lightroom is the cloud-based photo service that gives you everything you need to edit, organize, store, and share your photos across desktop, mobile, and web.',
    features: [
      'AI Generative Remove for seamless object removal',
      'Lens Blur for realistic optical depth of field',
      'Cloud synchronization of full-resolution RAW files',
      'Community presets and interactive tutorials'
    ],
    whatsNew: {
      version: '7.4',
      releaseDate: '2 weeks ago',
      notes: 'Point Color controls and improved HDR editing on Liquid Retina XDR displays.'
    },
    reviews: [
      { author: 'StudioShots', date: '2 weeks ago', rating: 5, title: 'Gold standard for catalog management', body: 'The cloud sync and RAW color profiles are top tier.' }
    ]
  },
  {
    id: 'photomator',
    name: 'Photomator',
    subtitle: 'Photo editor with machine learning.',
    category: 'Photo & Video',
    developer: 'Pixelmator Team',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 4.9,
    ratingCount: '21.5K',
    ageRating: '4+',
    chartRank: '#3 in Photo & Video',
    size: '240 MB',
    languages: 'English, German, French, Spanish, Japanese',
    iconColor: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    description: 'Photomator is the ultimate photo editor for Mac, iPad, and iPhone. Packed with incredible features like AI subject masking, automatic color adjustments, and seamless Apple Photos library integration.',
    features: [
      'Direct edits to macOS Photos library with zero duplicates',
      'AI Subject, Sky, and Background automatic masking',
      'AI De-noise and Super Resolution algorithms',
      'Batch editing for thousands of photos in seconds'
    ],
    whatsNew: {
      version: '3.3.6',
      releaseDate: '5 days ago',
      notes: 'Added LUT color grading support and improved Apple Photos album sync speed.'
    },
    reviews: [
      { author: 'NatureLens', date: '1 week ago', rating: 5, title: 'Pairs perfectly with Apple Photos', body: 'Non-destructive edits saved directly to Photos library without re-exporting. Fantastic!' }
    ]
  },
  {
    id: 'affinity-photo',
    name: 'Affinity Photo 2',
    subtitle: 'Professional raster graphics editor.',
    category: 'Graphics & Design',
    developer: 'Serif Labs',
    price: '$69.99',
    isGet: false,
    rating: 4.8,
    ratingCount: '16.7K',
    ageRating: '4+',
    chartRank: '#4 in Graphics & Design',
    size: '890 MB',
    languages: 'English, German, French, Spanish, Japanese, Chinese',
    iconColor: 'linear-gradient(135deg, #059669, #047857)',
    description: 'Affinity Photo 2 has become the first choice for photography and creative professionals across the world. Engineered to handle enormous images and massive multi-layer compositions with real-time responsiveness.',
    features: [
      'Unlimited layers, layer groups, adjustment layers, and masks',
      'Live non-destructive filters that render in real-time',
      'Advanced tone mapping and HDR merging',
      'Support for Photoshop PSD, PSB, and smart objects'
    ],
    whatsNew: {
      version: '2.5.3',
      releaseDate: '3 weeks ago',
      notes: 'Performance boost for Metal compute shaders and expanded RAW camera profile library.'
    },
    reviews: [
      { author: 'PixelArtist', date: '2 weeks ago', rating: 5, title: 'Pure performance powerhouse', body: 'Zero subscription, lightning fast pan and zoom, handling 100MP composites with ease.' }
    ]
  }
]

// ─── Developer Tools (Develop Tab & Discover Section) ─────────────────────────
export const DEVELOPER_APPS: AppItem[] = [
  {
    id: 'xcode',
    name: 'Xcode 16',
    subtitle: 'Build apps for Apple platforms.',
    category: 'Developer Tools',
    developer: 'Apple Inc.',
    price: 'GET',
    isGet: true,
    rating: 4.6,
    ratingCount: '89.4K',
    ageRating: '4+',
    chartRank: '#1 in Developer Tools',
    size: '3.4 GB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
    description: 'Xcode includes everything developers need to build applications for Mac, iPhone, iPad, Apple Watch, and Apple Vision Pro. Features predictive code completion, interactive SwiftUI previews, and unified Instruments profiling.',
    features: [
      'Predictive Code Completion powered by Apple Intelligence',
      'Swift 6 data-race safety and language support',
      'Interactive SwiftUI canvas with dynamic device switching',
      'Integrated Git source control and pull request reviews'
    ],
    whatsNew: {
      version: '16.1',
      releaseDate: '5 days ago',
      notes: 'Enhanced Canvas previews, Swift 6 compiler updates, and visionOS 2.0 SDK simulator.'
    },
    reviews: [
      { author: 'iOSArch', date: '3 days ago', rating: 5, title: 'Sequoia update is great', body: 'The on-device predictive completion is shockingly fast and privacy safe.' }
    ]
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    subtitle: 'Code editing. Redefined.',
    category: 'Developer Tools',
    developer: 'Microsoft Corporation',
    price: 'GET',
    isGet: true,
    rating: 4.9,
    ratingCount: '120.5K',
    ageRating: '4+',
    chartRank: '#3 in Developer Tools',
    size: '142 MB',
    languages: 'English, French, German, Japanese, Simplified Chinese + 10 more',
    iconColor: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
    description: 'Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop. It comes with built-in support for JavaScript, TypeScript, and Node.js and has a rich ecosystem of extensions.',
    features: [
      'IntelliSense smart completions based on variable types',
      'Built-in Git commands and repository visualization',
      'Integrated debugging directly in the editor',
      'Thousands of extensions, themes, and AI copilot tools'
    ],
    whatsNew: {
      version: '1.93.1',
      releaseDate: '4 days ago',
      notes: 'Profiles synchronization speedup, improved terminal multiplexing, and enhanced multi-cursor editing.'
    },
    reviews: [
      { author: 'FullstackDev', date: '1 week ago', rating: 5, title: 'The universal editor', body: 'Unbeatable extension ecosystem and rock-solid performance on Apple Silicon.' }
    ]
  },
  {
    id: 'warp-terminal',
    name: 'Warp Terminal',
    subtitle: 'The intelligent terminal for developers.',
    category: 'Developer Tools',
    developer: 'Warp Technologies',
    price: 'GET',
    isGet: true,
    rating: 4.9,
    ratingCount: '28.3K',
    ageRating: '4+',
    chartRank: '#5 in Developer Tools',
    size: '64 MB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    linkedOsAppId: 'terminal',
    description: 'Warp is a blazingly fast, Rust-based modern terminal built from the ground up for modern developers. It turns terminal output into interactive blocks and provides AI-powered command completions.',
    features: [
      'Interactive output blocks that can be copied, shared, and searched',
      'Built-in Warp AI command generator and error debugger',
      'Natural text editing with mouse selection and cursor positioning',
      'Shared team workflows and parameterizable terminal playbooks'
    ],
    whatsNew: {
      version: '0.2024.09',
      releaseDate: '3 days ago',
      notes: 'Added interactive session tabs, enhanced zsh/fish completion plugins, and memory efficiency boosts.'
    },
    reviews: [
      { author: 'TerminalJunkie', date: '4 days ago', rating: 5, title: 'Terminal revolution', body: 'Treating commands as blocks makes working with long logs so much easier. Never going back.' }
    ]
  },
  {
    id: 'docker-desktop',
    name: 'Docker Desktop',
    subtitle: 'Develop, ship, and run anywhere.',
    category: 'Developer Tools',
    developer: 'Docker Inc.',
    price: 'GET',
    isGet: true,
    rating: 4.7,
    ratingCount: '54.1K',
    ageRating: '4+',
    chartRank: '#4 in Developer Tools',
    size: '620 MB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #0284C7, #0369A1)',
    description: 'Docker Desktop provides an integrated container management environment on macOS. Run microservices, Kubernetes clusters, and build multi-architecture container images effortlessly.',
    features: [
      'Rosetta 2 emulation for x86_64 container images on Apple Silicon',
      'Built-in one-click local Kubernetes cluster',
      'Docker Compose file visual inspection and container metrics',
      'Docker Scout automated security vulnerability scanning'
    ],
    whatsNew: {
      version: '4.34.0',
      releaseDate: '1 week ago',
      notes: 'Optimized VirtioFS file system sharing for 30% faster build times and lower CPU overhead.'
    },
    reviews: [
      { author: 'CloudArchitect', date: '2 weeks ago', rating: 5, title: 'Smooth on Apple Silicon', body: 'VirtioFS has made npm and composer installs inside containers blazing fast.' }
    ]
  },
  {
    id: 'tableplus',
    name: 'TablePlus',
    subtitle: 'Modern, native database management.',
    category: 'Developer Tools',
    developer: 'TablePlus Inc.',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 4.9,
    ratingCount: '18.4K',
    ageRating: '4+',
    chartRank: '#7 in Developer Tools',
    size: '72 MB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #F59E0B, #D97706)',
    description: 'TablePlus is a native, fast, and secure database client for relational and NoSQL databases. Supports PostgreSQL, MySQL, SQLite, Microsoft SQL Server, Redis, ClickHouse, and more.',
    features: [
      'Native Swift codebase delivering lightning-fast query execution',
      'Multi-tab and multi-window workspace management',
      'Inline cell editing with undo/redo history before committing',
      'End-to-end SSH tunneling and SSL database encryption'
    ],
    whatsNew: {
      version: '5.9.8',
      releaseDate: '2 weeks ago',
      notes: 'Added native PostgreSQL 17 features, JSON editor enhancements, and dark theme polish.'
    },
    reviews: [
      { author: 'BackendLead', date: '1 week ago', rating: 5, title: 'Fastest DB tool on Mac', body: 'Native Swift UI with zero Electron bloat. Opens immediately and handles 1M+ rows smoothly.' }
    ]
  },
  {
    id: 'postman',
    name: 'Postman',
    subtitle: 'API development and testing platform.',
    category: 'Developer Tools',
    developer: 'Postman Inc.',
    price: 'GET',
    isGet: true,
    rating: 4.7,
    ratingCount: '41.9K',
    ageRating: '4+',
    chartRank: '#6 in Developer Tools',
    size: '180 MB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #F97316, #C2410C)',
    description: 'Postman simplifies each step of the API lifecycle and streamlines collaboration so you can create better APIs faster. Design, test, document, and mock REST, GraphQL, and gRPC endpoints.',
    features: [
      'Comprehensive REST, GraphQL, WebSocket, and gRPC support',
      'Automated test suites with JavaScript assertions',
      'Mock servers and auto-generated API documentation',
      'Team workspaces with environment variable synchronization'
    ],
    whatsNew: {
      version: '11.12.0',
      releaseDate: '1 week ago',
      notes: 'New Postman AI assistant for test generation and upgraded collection runner diagnostics.'
    },
    reviews: [
      { author: 'APIEngineer', date: '3 weeks ago', rating: 5, title: 'Essential for testing', body: 'The collection variables and automated tests save our QA team countless hours.' }
    ]
  }
]

// ─── Productivity & Work Apps ────────────────────────────────────────────────
export const WORK_APPS: AppItem[] = [
  {
    id: 'things-3',
    name: 'Things 3',
    subtitle: 'Get things done with elegance.',
    category: 'Productivity',
    developer: 'Cultured Code GmbH & Co. KG',
    price: '$49.99',
    isGet: false,
    rating: 4.9,
    ratingCount: '41.2K',
    ageRating: '4+',
    chartRank: '#1 in Productivity',
    size: '34 MB',
    languages: 'English, German, French, Spanish, Japanese + 4 more',
    iconColor: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    description: 'Things is the award-winning personal task manager that helps you achieve your goals. From your daily routine to your biggest life projects, Things is built to turn chaos into clarity.',
    features: [
      'Magical Magic Plus button to drop to-dos exactly where needed',
      'Headings to structure long complex project checklists',
      'Quick Find universal search to jump anywhere in milliseconds',
      'Seamless calendar event integration right in your Today view'
    ],
    whatsNew: {
      version: '3.21.2',
      releaseDate: '1 week ago',
      notes: 'Added interactive desktop widgets and enhanced macOS Sequoia window snapping.'
    },
    reviews: [
      { author: 'GTD_Master', date: '5 days ago', rating: 5, title: 'The pinnacle of Mac software', body: 'Every interaction feels considered, smooth, and respectful of your focus. Worth every penny.' }
    ]
  },
  {
    id: 'raycast',
    name: 'Raycast',
    subtitle: 'Supercharged productivity launcher.',
    category: 'Productivity',
    developer: 'Raycast Technologies',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 5.0,
    ratingCount: '38.6K',
    ageRating: '4+',
    chartRank: '#2 in Productivity',
    size: '68 MB',
    languages: 'English',
    iconColor: 'linear-gradient(135deg, #EF4444, #B91C1C)',
    description: 'Raycast is a blazingly fast, totally extendable launcher. It lets you complete tasks, calculate equations, share common links, search docs, manage windows, and much more.',
    features: [
      'Floating AI assistant with Claude 3.5 Sonnet and GPT-4o',
      'Clipboard history manager with image and formatted code search',
      'Window management shortcuts for instant side-by-side tiling',
      'Community extension store with over 1,500 integrations'
    ],
    whatsNew: {
      version: '1.83.0',
      releaseDate: '3 days ago',
      notes: 'Floating Scratchpad notes, improved file search indexing, and enhanced quick AI snippets.'
    },
    reviews: [
      { author: 'ProductivePower', date: 'Yesterday', rating: 5, title: 'Replaced 10 different apps', body: 'The clipboard manager, snippets, and AI integration make this the first app I install on any new Mac.' }
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    subtitle: 'Connected workspace for wiki & docs.',
    category: 'Productivity',
    developer: 'Notion Labs, Inc.',
    price: 'GET',
    isGet: true,
    hasInAppPurchases: true,
    rating: 4.8,
    ratingCount: '62.8K',
    ageRating: '4+',
    chartRank: '#6 in Productivity',
    size: '124 MB',
    languages: 'English, French, German, Spanish, Japanese, Korean',
    iconColor: 'linear-gradient(135deg, #18181B, #27272A)',
    linkedOsAppId: 'notes',
    description: 'Notion is the all-in-one workspace for your notes, tasks, wikis, and databases. Build bespoke productivity workflows for individuals, small teams, and fast-growing enterprises.',
    features: [
      'Infinite flexibility with relational database tables and boards',
      'Notion AI to draft, summarize, and query all your workspace documents',
      'Real-time multi-user collaborative editing with instant sync',
      'Offline caching and export to Markdown, HTML, and PDF'
    ],
    whatsNew: {
      version: '3.12.0',
      releaseDate: '1 week ago',
      notes: 'New offline sync engine, database chart widgets, and improved macOS keyboard navigation.'
    },
    reviews: [
      { author: 'KnowledgeWorker', date: '1 week ago', rating: 5, title: 'Our entire company runs on this', body: 'From project roadmaps to meeting notes, Notion connects everything seamlessly.' }
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    subtitle: 'Team communication and channels.',
    category: 'Business',
    developer: 'Slack Technologies LLC',
    price: 'GET',
    isGet: true,
    rating: 4.6,
    ratingCount: '115.3K',
    ageRating: '4+',
    chartRank: '#1 in Business',
    size: '148 MB',
    languages: 'English, Spanish, French, German, Japanese + 5 more',
    iconColor: 'linear-gradient(135deg, #4A154B, #611f69)',
    description: 'Slack brings team communication and collaboration into one place so you can get more work done, whether you belong to a large enterprise or a small business.',
    features: [
      'Organized channel conversations by project, topic, or team',
      'Audio & video Huddles with screen sharing and interactive drawing',
      'Workflow Builder to automate routine tasks and notifications',
      'Direct file sharing and integrations with GitHub, Jira, and Google Drive'
    ],
    whatsNew: {
      version: '4.39.2',
      releaseDate: '4 days ago',
      notes: 'Huddle noise cancellation improvements, faster channel switching, and memory usage reductions.'
    },
    reviews: [
      { author: 'RemoteLead', date: '5 days ago', rating: 5, title: 'Essential for remote teams', body: 'The huddles feature has completely eliminated unnecessary meetings for quick syncs.' }
    ]
  }
]

// ─── Arcade Games (Arcade Tab) ────────────────────────────────────────────────
export const ARCADE_GAMES: AppItem[] = [
  {
    id: 'balatro-plus',
    name: 'Balatro+',
    subtitle: 'The hypnotically addictive poker roguelike.',
    category: 'Games',
    developer: 'Playstack Ltd',
    price: 'GET',
    isGet: true,
    rating: 5.0,
    ratingCount: '32.1K',
    ageRating: '12+',
    chartRank: '#1 in Apple Arcade',
    size: '180 MB',
    languages: 'English, French, German, Italian, Japanese, Spanish + 5 more',
    iconColor: 'linear-gradient(135deg, #EF4444, #1E1B4B)',
    description: 'Balatro is a poker-inspired roguelike deck builder all about creating powerful synergies and winning big. Combine valid poker hands with unique Joker cards to trigger wild combos and build outrageous multipliers.',
    features: [
      '150 unique Jokers each with distinct game-changing abilities',
      '15 distinct Decks with different modifiers to master',
      'Vibrant psychedelic retro CRT aesthetic and dynamic soundtrack',
      'No ads, no in-app purchases — 100% pure gaming'
    ],
    whatsNew: {
      version: '1.0.8',
      releaseDate: '2 days ago',
      notes: 'Added cloud sync with Apple Game Center and optimized Metal graphics for M-series chips.'
    },
    reviews: [
      { author: 'PokerMind', date: 'Yesterday', rating: 5, title: 'Game of the Year contender', body: 'I sat down for 10 minutes and looked up 4 hours later. Pure gameplay perfection.' }
    ]
  },
  {
    id: 'nba-2k24-arcade',
    name: 'NBA 2K24 Arcade Edition',
    subtitle: 'Experience authentic NBA basketball on Mac.',
    category: 'Games',
    developer: '2K Sports',
    price: 'GET',
    isGet: true,
    rating: 4.8,
    ratingCount: '46.7K',
    ageRating: '4+',
    chartRank: '#2 in Apple Arcade',
    size: '12.8 GB',
    languages: 'English, French, German, Spanish, Japanese + 4 more',
    iconColor: 'linear-gradient(135deg, #EA580C, #9A3412)',
    description: 'Achieve your NBA dreams in NBA 2K24 Arcade Edition. Customize your MyPLAYER, choose your position, select your jersey number, and become an NBA superstar on your journey to championship glory.',
    features: [
      'MyCAREER mode with authentic NBA storylines and draft night',
      'The Greatest mode: build fantasy rosters with NBA legends',
      'Cross-play with iPhone, iPad, and Apple TV via Game Center',
      'Full DualSense and Xbox Wireless Controller support'
    ],
    whatsNew: {
      version: '2.4.0',
      releaseDate: '1 week ago',
      notes: 'Roster updates for 2024-2025 season, new signature jump shots, and performance polish.'
    },
    reviews: [
      { author: 'HoopsMac', date: '1 week ago', rating: 5, title: 'Flawless 60fps on Mac', body: 'Full controller support and console-grade graphics on my MacBook Pro. Looks incredible.' }
    ]
  },
  {
    id: 'sneaky-sasquatch',
    name: 'Sneaky Sasquatch',
    subtitle: 'Live the life of a playful Sasquatch.',
    category: 'Games',
    developer: 'RAC7 Games',
    price: 'GET',
    isGet: true,
    rating: 4.9,
    ratingCount: '84.3K',
    ageRating: '4+',
    chartRank: '#3 in Apple Arcade',
    size: '490 MB',
    languages: 'English, French, German, Japanese, Spanish + 10 more',
    iconColor: 'linear-gradient(135deg, #15803D, #166534)',
    description: 'Live the life of a Sasquatch and do everyday sasquatch stuff like sneak around campsites, disguise yourself in human clothes, eat food from coolers, play golf, drive cars, go skiing, and run for mayor!',
    features: [
      'Huge open world with hundreds of secrets to discover',
      'Drive customized cars, speedboats, and motorcycles',
      'Go fishing, play 9 holes of golf, or fight forest fires',
      'Hilarious physics-based disguise and stealth gameplay'
    ],
    whatsNew: {
      version: '1.9.12',
      releaseDate: '2 weeks ago',
      notes: 'Added deep sea submarine exploration and new marine biology photography quests.'
    },
    reviews: [
      { author: 'SasquatchKing', date: '2 weeks ago', rating: 5, title: 'The heart of Apple Arcade', body: 'Charming, hilarious, and packed with endless content. Fun for all ages.' }
    ]
  }
]

// ─── Play Tab (High End Mac Gaming) ───────────────────────────────────────────
export const PLAY_GAMES: AppItem[] = [
  ...ARCADE_GAMES,
  {
    id: 'death-stranding',
    name: 'Death Stranding Director\'s Cut',
    subtitle: 'Tomorrow is in your hands.',
    category: 'Games',
    developer: '505 Games',
    price: '$39.99',
    isGet: false,
    rating: 4.9,
    ratingCount: '18.9K',
    ageRating: '17+',
    chartRank: '#2 in Action',
    size: '54.2 GB',
    languages: 'English, French, German, Italian, Japanese + 12 more',
    iconColor: 'linear-gradient(135deg, #18181B, #3F3F46)',
    description: 'From legendary game creator Hideo Kojima comes a genre-defying experience. In the future, a mysterious event known as the Death Stranding has opened a doorway between the living and the dead.',
    features: [
      'MetalFX spatial and temporal upscaling for stunning fidelity',
      'Expanded storyline, new stealth missions, and firing range',
      'Dynamic weather and revolutionary asynchronous multiplayer',
      'Spatial Audio integration for ultra-immersive atmospheric sound'
    ],
    whatsNew: {
      version: '1.1.0',
      releaseDate: '3 weeks ago',
      notes: 'macOS Sequoia Game Mode optimizations and ultrawide display resolution support.'
    },
    reviews: [
      { author: 'KojimaFan', date: '2 weeks ago', rating: 5, title: 'Masterpiece on Mac', body: 'Breathtaking landscape rendering and silky smooth frame rates with MetalFX.' }
    ]
  },
  {
    id: 'frostpunk-2',
    name: 'Frostpunk 2',
    subtitle: 'Survive the relentless whiteout blizzard.',
    category: 'Games',
    developer: '11 bit studios s.a.',
    price: '$44.99',
    isGet: false,
    rating: 4.8,
    ratingCount: '9.4K',
    ageRating: '17+',
    chartRank: '#4 in Strategy',
    size: '28.1 GB',
    languages: 'English, Polish, German, French, Japanese, Chinese + 6 more',
    iconColor: 'linear-gradient(135deg, #0EA5E9, #1E293B)',
    description: 'Discover a city-survival game set 30 years after an apocalyptic blizzard ravaged Earth. In Frostpunk 2, you must face a new deadly threat that appears on the horizon — human nature and its unquenchable thirst for power.',
    features: [
      'Build your City on a massive scale by creating entire Districts',
      'Navigate the Council Hall and pass laws between divided factions',
      'Explore the treacherous Frostland for precious resources',
      'Full Metal 3 hardware accelerated ray tracing on M3 and M4 Macs'
    ],
    whatsNew: {
      version: '1.0.4',
      releaseDate: '4 days ago',
      notes: 'Stability patch for high-population late-game cities and improved memory allocation.'
    },
    reviews: [
      { author: 'CityBuilder', date: '1 week ago', rating: 5, title: 'Incredible atmosphere and tension', body: 'The political choices and visual blizzard effects are phenomenal on Mac.' }
    ]
  }
]

// ─── Categories ───────────────────────────────────────────────────────────────
export const STORE_CATEGORIES: AppCategory[] = [
  { id: 'developer-tools', name: 'Developer Tools', iconName: 'Code2', color: '#007AFF', appCount: 840, description: 'Code editors, compilers, terminals, and debugging tools.' },
  { id: 'productivity', name: 'Productivity', iconName: 'Briefcase', color: '#FF9500', appCount: 1250, description: 'Task managers, calendars, document editors, and notes.' },
  { id: 'graphics-design', name: 'Graphics & Design', iconName: 'Palette', color: '#AF52DE', appCount: 720, description: 'Vector drawing, 3D modeling, UI design, and typography.' },
  { id: 'games', name: 'Games', iconName: 'Gamepad2', color: '#FF2D55', appCount: 2400, description: 'Action, RPG, puzzle, strategy, and Apple Arcade exclusives.' },
  { id: 'photo-video', name: 'Photo & Video', iconName: 'Camera', color: '#5856D6', appCount: 960, description: 'RAW photo processing, video editing, and motion graphics.' },
  { id: 'utilities', name: 'Utilities', iconName: 'Sliders', color: '#34C759', appCount: 1580, description: 'System tools, window managers, file compressors, and shortcuts.' },
  { id: 'business', name: 'Business', iconName: 'TrendingUp', color: '#007AFF', appCount: 890, description: 'Team collaboration, CRM, analytics, and accounting software.' },
  { id: 'music', name: 'Music & Audio', iconName: 'Music', color: '#FF3B30', appCount: 510, description: 'DAWs, synthesizers, podcast studios, and audio editing.' },
  { id: 'social-networking', name: 'Social Networking', iconName: 'Users', color: '#30B0C7', appCount: 430, description: 'Messengers, social feeds, community hubs, and live streaming.' },
  { id: 'education', name: 'Education', iconName: 'GraduationCap', color: '#FF9500', appCount: 680, description: 'Learning languages, coding tutorials, science, and math.' },
  { id: 'lifestyle', name: 'Lifestyle', iconName: 'Coffee', color: '#FF2D55', appCount: 790, description: 'Cooking, fitness, personal hobbies, and home organization.' },
  { id: 'entertainment', name: 'Entertainment', iconName: 'Film', color: '#AF52DE', appCount: 1120, description: 'Streaming players, media libraries, and digital comics.' },
]

// ─── Pending Updates (Updates Tab) ────────────────────────────────────────────
export const PENDING_UPDATES: AppUpdateItem[] = [
  {
    id: 'upd-xcode',
    appId: 'xcode',
    name: 'Xcode',
    version: '16.1',
    size: '3.4 GB',
    daysAgo: '3 days ago',
    developer: 'Apple Inc.',
    iconColor: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
    notes: 'Swift 6 language mode support with compile-time data race safety. Enhanced SwiftUI interactive Canvas previews, Metal 3 debugger improvements, and simulator stability enhancements.'
  },
  {
    id: 'upd-pixelmator',
    appId: 'pixelmator-pro',
    name: 'Pixelmator Pro',
    version: '3.6.4',
    size: '584 MB',
    daysAgo: '5 days ago',
    developer: 'Pixelmator Team',
    iconColor: 'linear-gradient(135deg, #F43F5E, #BE185D)',
    notes: 'Archipelago update: revolutionary web mockup export with live CSS styles, modernized SVG parser, and Apple Silicon Neural Engine rendering boosts.'
  },
  {
    id: 'upd-raycast',
    appId: 'raycast',
    name: 'Raycast',
    version: '1.83.0',
    size: '68 MB',
    daysAgo: '6 days ago',
    developer: 'Raycast Technologies',
    iconColor: 'linear-gradient(135deg, #EF4444, #B91C1C)',
    notes: 'Floating Scratchpad notes for quick capture, Claude 3.5 Sonnet AI prompt speedups, clipboard history search optimizations, and macOS Sequoia tiling tweaks.'
  }
]

// ─── Master Apps Registry ─────────────────────────────────────────────────────
export const ALL_APPS: AppItem[] = [
  ...GREAT_NEW_APPS,
  ...PHOTO_APPS,
  ...DEVELOPER_APPS,
  ...WORK_APPS,
  ...ARCADE_GAMES,
  ...PLAY_GAMES,
]

// De-duplicate master registry
export const UNIQUE_APPS = Array.from(
  new Map(ALL_APPS.map((item) => [item.id, item])).values()
)
