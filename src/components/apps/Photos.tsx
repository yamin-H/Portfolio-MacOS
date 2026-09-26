'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PanelLeft,
  Search,
  Heart,
  Share2,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  X,
  Plus,
  Trash2,
  MapPin,
  Users,
  Clock,
  Download,
  Image as ImageIcon,
  Sparkles,
  Film,
  Upload,
  Camera,
  Maximize2,
  RotateCw,
  RotateCcw,
  Sliders,
  Check,
  Loader2,
} from 'lucide-react'
import { useWindowContext } from '@/app/components/os/Window'
import { soundEngine } from '@/lib/sound/soundEngine'
import TrafficLights from '@/components/os/TrafficLights'
import {
  PhotoItem,
  PhotosSection,
  TimeViewMode,
  FilterMode,
  INITIAL_PHOTOS,
} from './photos/photosData'
import {
  getAllPhotosFromDB,
  saveAllPhotosToDB,
  deletePhotoFromDB,
  getCleanLocalStoragePhotos,
  saveToLocalStorage,
  optimizeAndReadImageFile,
} from './photos/photosStorage'
import PhotosContextMenu from './photos/PhotosContextMenu'
import PhotosDeleteModal from './photos/PhotosDeleteModal'

export default function Photos() {
  const windowContext = useWindowContext()

  // ─── Photos State (IndexedDB + Local Storage Synchronization) ───────────────
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    return getCleanLocalStoragePhotos()
  })
  const [isImporting, setIsImporting] = useState(false)

  // On mount: Load persistent photos from IndexedDB and sync
  useEffect(() => {
    let isMounted = true
    getAllPhotosFromDB().then((dbPhotos) => {
      if (!isMounted) return
      if (dbPhotos && dbPhotos.length > 0) {
        setPhotos(dbPhotos)
        saveToLocalStorage(dbPhotos)
      } else {
        // If DB is empty, sync any clean localStorage items to DB
        const localClean = getCleanLocalStoragePhotos()
        if (localClean && localClean.length > 0) {
          saveAllPhotosToDB(localClean)
        }
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Sync to IndexedDB and LocalStorage on state changes
  const updatePhotosState = (updater: (prev: PhotoItem[]) => PhotoItem[]) => {
    setPhotos((prev) => {
      const next = updater(prev)
      saveAllPhotosToDB(next)
      saveToLocalStorage(next)
      return next
    })
  }

  // Delete Modal & Context Menu States
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    photo: PhotoItem | null
    isPermanent: boolean
    isMultiple?: boolean
    count?: number
  }>({
    isOpen: false,
    photo: null,
    isPermanent: false,
  })

  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    photo: PhotoItem
  } | null>(null)

  // ─── Navigation & Views ────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<PhotosSection>('library')
  const [timeViewMode, setTimeViewMode] = useState<TimeViewMode>('all')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // ─── Sidebar State ─────────────────────────────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMediaTypesOpen, setIsMediaTypesOpen] = useState(true)
  const [isSharedAlbumsOpen, setIsSharedAlbumsOpen] = useState(false)
  const [isMyAlbumsOpen, setIsMyAlbumsOpen] = useState(true)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  // ─── Grid & Zoom State ─────────────────────────────────────────────────────
  // Zoom slider: 1 (large cards/2 cols) to 5 (dense thumbnails/6 cols)
  const [zoomLevel, setZoomLevel] = useState<number>(3)
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false)
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)

  // ─── Lightbox / Photo Detail Mode ──────────────────────────────────────────
  const [viewingPhotoId, setViewingPhotoId] = useState<string | null>(null)

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  // Currently selected photo object
  const selectedPhoto = useMemo(() => {
    if (!selectedPhotoId) return null
    return photos.find((p) => p.id === selectedPhotoId) || null
  }, [selectedPhotoId, photos])

  // Currently viewed photo in lightbox
  const viewingPhoto = useMemo(() => {
    if (!viewingPhotoId) return null
    return photos.find((p) => p.id === viewingPhotoId) || null
  }, [viewingPhotoId, photos])

  // ─── Filtered Photos Collection ───────────────────────────────────────────
  const deletedPhotosCount = useMemo(() => photos.filter((p) => p.isDeleted).length, [photos])
  const activePhotosCount = useMemo(() => photos.filter((p) => !p.isDeleted).length, [photos])

  const displayedPhotos = useMemo(() => {
    let list = [...photos]

    // Filter between Active Library and Recently Deleted
    if (activeSection === 'recently-deleted') {
      list = list.filter((p) => p.isDeleted)
    } else {
      list = list.filter((p) => !p.isDeleted)
    }

    // Sidebar Section Filter
    if (activeSection === 'recents') {
      list.sort((a, b) => b.year - a.year)
    } else if (activeSection === 'media-portrait') {
      list = list.filter((p) => p.isPortrait || p.mediaType === 'portrait')
    } else if (activeSection === 'media-live') {
      list = list.filter((p) => p.isLive || p.mediaType === 'live')
    } else if (activeSection === 'media-videos') {
      list = list.filter((p) => p.mediaType === 'video')
    } else if (activeSection === 'media-screenshots') {
      list = list.filter((p) => p.mediaType === 'screenshot')
    } else if (activeSection === 'album-work') {
      list = list.filter((p) => p.album === 'work')
    } else if (activeSection === 'album-hackathons') {
      list = list.filter((p) => p.album === 'hackathons')
    } else if (activeSection === 'album-workspace') {
      list = list.filter((p) => p.album === 'workspace')
    } else if (activeSection === 'album-travel') {
      list = list.filter((p) => p.album === 'travel')
    } else if (activeSection === 'album-personal') {
      list = list.filter((p) => p.album === 'personal')
    }

    // Top Filter Dropdown
    if (filterMode === 'favorites') {
      list = list.filter((p) => p.isFavorite)
    } else if (filterMode === 'portrait') {
      list = list.filter((p) => p.isPortrait || p.mediaType === 'portrait')
    } else if (filterMode === 'live') {
      list = list.filter((p) => p.isLive || p.mediaType === 'live')
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.date.toLowerCase().includes(q) ||
          (p.caption && p.caption.toLowerCase().includes(q))
      )
    }

    return list
  }, [photos, activeSection, filterMode, searchQuery])

  // Compute grid columns based on zoom level (1=2 cols, 2=3 cols, 3=4 cols, 4=5 cols, 5=6 cols)
  const gridColumns = useMemo(() => {
    switch (zoomLevel) {
      case 1:
        return 'repeat(auto-fill, minmax(240px, 1fr))'
      case 2:
        return 'repeat(auto-fill, minmax(180px, 1fr))'
      case 3:
        return 'repeat(auto-fill, minmax(140px, 1fr))'
      case 4:
        return 'repeat(auto-fill, minmax(110px, 1fr))'
      case 5:
        return 'repeat(auto-fill, minmax(88px, 1fr))'
      default:
        return 'repeat(auto-fill, minmax(140px, 1fr))'
    }
  }, [zoomLevel])

  // ─── Actions: Toggle Favorite, Import, Delete, Recover ──────────────────────
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    soundEngine.play('click')
    updatePhotosState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    )
  }

  // Handle local user file upload (Drag & Drop or File Input) with Persistent Data URLs
  const handleImportFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsImporting(true)
    soundEngine.play('pop')

    const now = new Date()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateStr = `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`

    try {
      const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))
      const newItems: PhotoItem[] = []

      for (const file of validFiles) {
        const { dataUrl, width, height } = await optimizeAndReadImageFile(file)
        const baseName = file.name.replace(/\.[^/.]+$/, '')
        const isPortrait = height > width || file.name.toLowerCase().includes('portrait')

        newItems.push({
          id: `user-photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          title: baseName,
          src: dataUrl,
          date: dateStr,
          dateHeader: `${monthNames[now.getMonth()]} ${now.getFullYear()}`,
          location: 'Rajshahi, Bangladesh',
          year: now.getFullYear(),
          month: `${monthNames[now.getMonth()]} ${now.getFullYear()}`,
          day: dateStr,
          isFavorite: false,
          isPortrait,
          mediaType: isPortrait ? 'portrait' : 'photo',
          album: 'personal',
          camera: 'iPhone 15 Pro · Main Camera',
          details: `${width} × ${height} · ${(file.size / 1024 / 1024).toFixed(1)} MB`,
          caption: baseName,
          isDeleted: false,
        })
      }

      if (newItems.length > 0) {
        updatePhotosState((prev) => [...newItems, ...prev])
        setSelectedPhotoId(newItems[0].id)
        soundEngine.play('action')
      }
    } catch (err) {
      console.error('[Photos] Failed to optimize and save imported images:', err)
    } finally {
      setIsImporting(false)
    }
  }

  // Delete / Trash execution
  const executeDeletePhoto = (photoId: string, permanent: boolean) => {
    soundEngine.play('close')
    if (permanent) {
      updatePhotosState((prev) => prev.filter((p) => p.id !== photoId))
      deletePhotoFromDB(photoId)
    } else {
      updatePhotosState((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, isDeleted: true, deletedAt: Date.now() } : p
        )
      )
    }

    if (selectedPhotoId === photoId) {
      setSelectedPhotoId(null)
    }

    if (viewingPhotoId === photoId) {
      const remaining = displayedPhotos.filter((p) => p.id !== photoId)
      if (remaining.length > 0) {
        const currIdx = displayedPhotos.findIndex((p) => p.id === photoId)
        const nextPhoto = remaining[Math.min(currIdx, remaining.length - 1)]
        setViewingPhotoId(nextPhoto ? nextPhoto.id : null)
      } else {
        setViewingPhotoId(null)
      }
    }

    setDeleteModal({ isOpen: false, photo: null, isPermanent: false })
  }

  // Recover photo back to library
  const handleRecoverPhoto = (photoId: string) => {
    soundEngine.play('pop')
    updatePhotosState((prev) =>
      prev.map((p) =>
        p.id === photoId ? { ...p, isDeleted: false, deletedAt: undefined } : p
      )
    )
    if (selectedPhotoId === photoId) {
      setSelectedPhotoId(null)
    }
  }

  // Duplicate photo
  const handleDuplicatePhoto = (photo: PhotoItem) => {
    soundEngine.play('pop')
    const duplicate: PhotoItem = {
      ...photo,
      id: `user-photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: `${photo.title} copy`,
      isDeleted: false,
    }
    updatePhotosState((prev) => [duplicate, ...prev])
    setSelectedPhotoId(duplicate.id)
  }

  // Empty Trash (Permanently delete all in Recently Deleted)
  const handleEmptyTrash = () => {
    soundEngine.play('close')
    const deletedItems = photos.filter((p) => p.isDeleted)
    deletedItems.forEach((item) => deletePhotoFromDB(item.id))
    updatePhotosState((prev) => prev.filter((p) => !p.isDeleted))
    setSelectedPhotoId(null)
    setDeleteModal({ isOpen: false, photo: null, isPermanent: false })
  }

  // ─── Keyboard Shortcuts: Navigation, Lightbox & Delete ─────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Lightbox Escape
      if (viewingPhotoId && e.key === 'Escape') {
        setViewingPhotoId(null)
        return
      }

      // Delete / Backspace key shortcut
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (viewingPhoto) {
          e.preventDefault()
          if (e.metaKey || e.ctrlKey) {
            executeDeletePhoto(viewingPhoto.id, activeSection === 'recently-deleted')
          } else {
            setDeleteModal({
              isOpen: true,
              photo: viewingPhoto,
              isPermanent: activeSection === 'recently-deleted',
            })
          }
          return
        } else if (selectedPhoto) {
          e.preventDefault()
          if (e.metaKey || e.ctrlKey) {
            executeDeletePhoto(selectedPhoto.id, activeSection === 'recently-deleted')
          } else {
            setDeleteModal({
              isOpen: true,
              photo: selectedPhoto,
              isPermanent: activeSection === 'recently-deleted',
            })
          }
          return
        }
      }

      // Lightbox Arrow Navigation
      if (viewingPhotoId) {
        const idx = displayedPhotos.findIndex((p) => p.id === viewingPhotoId)
        if (idx === -1) return

        if (e.key === 'ArrowRight' && idx < displayedPhotos.length - 1) {
          soundEngine.play('click')
          setViewingPhotoId(displayedPhotos[idx + 1].id)
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          soundEngine.play('click')
          setViewingPhotoId(displayedPhotos[idx - 1].id)
        } else if (e.key === ' ') {
          e.preventDefault()
          setViewingPhotoId(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewingPhotoId, viewingPhoto, selectedPhoto, displayedPhotos, activeSection])

  // Active Section Label
  const activeHeaderTitle = useMemo(() => {
    switch (activeSection) {
      case 'library':
        return '11–24 Apr 2024'
      case 'memories':
        return 'Memories & Highlights'
      case 'people':
        return 'People & Collaborators'
      case 'places':
        return 'Places Visited'
      case 'recents':
        return 'Recently Added'
      case 'imports':
        return 'Imports'
      case 'recently-deleted':
        return 'Recently Deleted'
      case 'media-portrait':
        return 'Portraits'
      case 'media-live':
        return 'Live Photos'
      case 'media-videos':
        return 'Videos'
      case 'media-screenshots':
        return 'Screenshots'
      case 'album-work':
        return 'Engineering & AI Pipelines'
      case 'album-hackathons':
        return 'Hackathons & Competitions'
      case 'album-workspace':
        return 'Workstation & Hardware Setup'
      case 'album-travel':
        return 'Travel & Expeditions'
      case 'album-personal':
        return 'Personal Moments'
      default:
        return 'Photo Library'
    }
  }, [activeSection])

  const activeSubheader = useMemo(() => {
    switch (activeSection) {
      case 'library':
        return 'Rajshahi · Hadba Om Al Said & Tech Lab'
      case 'recently-deleted':
        return `${deletedPhotosCount} ${deletedPhotosCount === 1 ? 'photo' : 'photos'} · Items show the days remaining before permanent deletion.`
      case 'album-work':
        return 'Production Agent Architecture & Models'
      case 'album-hackathons':
        return 'Competitive Hackathons & AI Builds'
      case 'album-workspace':
        return 'Engineering Desk, Keyboards & Monorepo'
      default:
        return 'Yamin Hossain — Portfolio Photography'
    }
  }, [activeSection, deletedPhotosCount])

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDraggingOver(true)
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDraggingOver(false)
        handleImportFiles(e.dataTransfer.files)
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Hidden File Input for Image Import */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleImportFiles(e.target.files)}
      />

      {/* Drag Over Highlight Overlay */}
      {isDraggingOver && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 122, 255, 0.25)',
            border: '3px dashed #007AFF',
            borderRadius: 8,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            backdropFilter: 'blur(4px)',
            pointerEvents: 'none',
          }}
        >
          <Upload size={48} color="#007AFF" />
          <span style={{ fontSize: 18, fontWeight: 600, color: '#007AFF' }}>
            Drop Photos Here to Add to Library
          </span>
        </div>
      )}

      {/* ─── 1. INTEGRATED MACOS TOOLBAR (HEIGHT: 48px) ──────────────────────── */}
      <div
        onPointerDown={(e) => windowContext?.handleTitlePointerDown(e)}
        style={{
          height: 48,
          backgroundColor: '#EBECEF',
          borderBottom: '1px solid #D5D7DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          flexShrink: 0,
        }}
      >
        {/* Left Side: Traffic Lights & Sidebar Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Traffic Lights */}
          <TrafficLights />

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title="Toggle Sidebar"
            style={{
              width: 28,
              height: 24,
              borderRadius: 5,
              border: 'none',
              backgroundColor: isSidebarOpen ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4A4C52',
              cursor: 'pointer',
              marginLeft: 6,
            }}
          >
            <PanelLeft size={15} />
          </button>
        </div>

        {/* Center-Left: Aspect Toggle & Zoom Slider matching reference screenshot! */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Aspect Square Toggle Icon */}
          <button
            onClick={() => soundEngine.play('click')}
            title="Square Aspect Ratio Toggle"
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              border: 'none',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4A4C52',
              cursor: 'pointer',
            }}
          >
            <Maximize2 size={13} />
          </button>

          {/* Zoom Slider with min/max dots: ─●─────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#8E8E93' }} />
            <input
              type="range"
              min={1}
              max={5}
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              style={{
                width: 74,
                height: 3,
                accentColor: '#007AFF',
                cursor: 'pointer',
              }}
            />
            <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#8E8E93' }} />
          </div>
        </div>

        {/* Center: Segmented Control [ Years | Months | Days | All Photos ] */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
            borderRadius: 7,
            padding: '2px',
          }}
        >
          {(
            [
              { key: 'years', label: 'Years' },
              { key: 'months', label: 'Months' },
              { key: 'days', label: 'Days' },
              { key: 'all', label: 'All Photos' },
            ] as const
          ).map((seg) => {
            const isActive = timeViewMode === seg.key
            return (
              <button
                key={seg.key}
                onClick={() => {
                  soundEngine.play('click')
                  setTimeViewMode(seg.key)
                }}
                style={{
                  border: 'none',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#1D1D1F' : '#6E6E73',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 11.5,
                  padding: '3px 10px',
                  borderRadius: 5,
                  boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.12)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                }}
              >
                {seg.label}
              </button>
            )
          })}
        </div>

        {/* Right Side: (i) Info, Share, Favorite, Import, Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Info Inspector Toggle (i) */}
          <button
            onClick={() => {
              soundEngine.play('click')
              setIsInspectorOpen((prev) => !prev)
            }}
            title="Get Info"
            style={{
              width: 26,
              height: 26,
              borderRadius: 5,
              border: 'none',
              backgroundColor: isInspectorOpen ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
              color: isInspectorOpen ? '#007AFF' : '#4A4C52',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Info size={15} />
          </button>

          {/* Share Action */}
          <button
            onClick={() => soundEngine.play('click')}
            title="Share"
            style={{
              width: 26,
              height: 26,
              borderRadius: 5,
              border: 'none',
              backgroundColor: 'transparent',
              color: '#4A4C52',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Share2 size={15} />
          </button>

          {/* Favorite Heart */}
          <button
            onClick={() => {
              if (selectedPhotoId) {
                toggleFavorite(selectedPhotoId)
              }
            }}
            title="Favorite"
            disabled={!selectedPhotoId || activeSection === 'recently-deleted'}
            style={{
              width: 26,
              height: 26,
              borderRadius: 5,
              border: 'none',
              backgroundColor: 'transparent',
              color: selectedPhoto?.isFavorite ? '#FF2D55' : '#4A4C52',
              opacity: selectedPhotoId && activeSection !== 'recently-deleted' ? 1 : 0.35,
              cursor: selectedPhotoId && activeSection !== 'recently-deleted' ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Heart size={15} fill={selectedPhoto?.isFavorite ? '#FF2D55' : 'none'} />
          </button>

          {/* Put Back / Recover Button (when in Recently Deleted) */}
          {activeSection === 'recently-deleted' && selectedPhoto && (
            <button
              onClick={() => handleRecoverPhoto(selectedPhoto.id)}
              title="Put Back to Library"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                height: 26,
                padding: '0 8px',
                borderRadius: 5,
                border: '1px solid rgba(0, 122, 255, 0.3)',
                backgroundColor: 'rgba(0, 122, 255, 0.08)',
                color: '#007AFF',
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} />
              <span>Put Back</span>
            </button>
          )}

          {/* Delete Photo Button (Trash) */}
          <button
            onClick={() => {
              if (selectedPhoto) {
                setDeleteModal({
                  isOpen: true,
                  photo: selectedPhoto,
                  isPermanent: activeSection === 'recently-deleted',
                })
              }
            }}
            title={activeSection === 'recently-deleted' ? 'Delete Immediately' : 'Delete Photo (⌫)'}
            disabled={!selectedPhotoId}
            style={{
              width: 26,
              height: 26,
              borderRadius: 5,
              border: 'none',
              backgroundColor: 'transparent',
              color: selectedPhotoId ? '#FF3B30' : '#4A4C52',
              opacity: selectedPhotoId ? 1 : 0.35,
              cursor: selectedPhotoId ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trash2 size={15} />
          </button>

          {/* Import Photos Button [ + ] */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Photos from Computer"
            disabled={isImporting}
            style={{
              width: 26,
              height: 26,
              borderRadius: 5,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: '#1D1D1F',
              cursor: isImporting ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isImporting ? 0.6 : 1,
            }}
          >
            {isImporting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          </button>

          {/* Search Button / Input */}
          <div style={{ position: 'relative' }}>
            {isSearchOpen ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #007AFF',
                  borderRadius: 6,
                  padding: '2px 6px',
                  width: 140,
                }}
              >
                <Search size={12} color="#8E8E93" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search photos"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: 11.5,
                    width: '100%',
                    marginLeft: 4,
                  }}
                />
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setIsSearchOpen(false)
                  }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                >
                  <X size={11} color="#8E8E93" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Search"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 5,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#4A4C52',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Search size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN BODY (SIDEBAR + PHOTO GRID + INSPECTOR) ────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* ─── LEFT SIDEBAR (APPLE PHOTOS FAVORITES & ALBUMS) ────────────────── */}
        {isSidebarOpen && (
          <div
            style={{
              width: 200,
              backgroundColor: '#ECEEF1',
              borderRight: '1px solid #D5D7DC',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              overflowY: 'auto',
              padding: '12px 8px',
              fontSize: 12.5,
              color: '#333336',
              userSelect: 'none',
            }}
          >
            {/* PHOTOS SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', padding: '4px 8px', letterSpacing: '0.04em' }}>
                Photos
              </div>

              {/* Library (Default Active) */}
              <div
                onClick={() => {
                  soundEngine.play('click')
                  setActiveSection('library')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'library' ? '#007AFF' : 'transparent',
                  color: activeSection === 'library' ? '#FFFFFF' : '#1D1D1F',
                  fontWeight: activeSection === 'library' ? 600 : 400,
                }}
              >
                <ImageIcon size={15} />
                <span>Library</span>
              </div>

              {/* Memories */}
              <div
                onClick={() => {
                  soundEngine.play('click')
                  setActiveSection('memories')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'memories' ? '#007AFF' : 'transparent',
                  color: activeSection === 'memories' ? '#FFFFFF' : '#1D1D1F',
                  fontWeight: activeSection === 'memories' ? 600 : 400,
                }}
              >
                <Sparkles size={15} />
                <span>Memories</span>
              </div>

              {/* People */}
              <div
                onClick={() => {
                  soundEngine.play('click')
                  setActiveSection('people')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'people' ? '#007AFF' : 'transparent',
                  color: activeSection === 'people' ? '#FFFFFF' : '#1D1D1F',
                  fontWeight: activeSection === 'people' ? 600 : 400,
                }}
              >
                <Users size={15} />
                <span>People</span>
              </div>

              {/* Places */}
              <div
                onClick={() => {
                  soundEngine.play('click')
                  setActiveSection('places')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'places' ? '#007AFF' : 'transparent',
                  color: activeSection === 'places' ? '#FFFFFF' : '#1D1D1F',
                  fontWeight: activeSection === 'places' ? 600 : 400,
                }}
              >
                <MapPin size={15} />
                <span>Places</span>
              </div>

              {/* Recents */}
              <div
                onClick={() => {
                  soundEngine.play('click')
                  setActiveSection('recents')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'recents' ? '#007AFF' : 'transparent',
                  color: activeSection === 'recents' ? '#FFFFFF' : '#1D1D1F',
                  fontWeight: activeSection === 'recents' ? 600 : 400,
                }}
              >
                <Clock size={15} />
                <span>Recents</span>
              </div>

              {/* Imports */}
              <div
                onClick={() => {
                  soundEngine.play('click')
                  setActiveSection('imports')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'imports' ? '#007AFF' : 'transparent',
                  color: activeSection === 'imports' ? '#FFFFFF' : '#1D1D1F',
                  fontWeight: activeSection === 'imports' ? 600 : 400,
                }}
              >
                <Download size={15} />
                <span>Imports</span>
              </div>

              {/* Recently Deleted */}
              <div
                onClick={() => {
                  soundEngine.play('click')
                  setActiveSection('recently-deleted')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  backgroundColor: activeSection === 'recently-deleted' ? '#007AFF' : 'transparent',
                  color: activeSection === 'recently-deleted' ? '#FFFFFF' : '#1D1D1F',
                  fontWeight: activeSection === 'recently-deleted' ? 600 : 400,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Trash2 size={15} color={activeSection === 'recently-deleted' ? '#FFFFFF' : '#8E8E93'} />
                  <span>Recently Deleted</span>
                </div>
                {deletedPhotosCount > 0 && (
                  <span
                    style={{
                      fontSize: 10.5,
                      padding: '1px 6px',
                      borderRadius: 10,
                      backgroundColor:
                        activeSection === 'recently-deleted'
                          ? 'rgba(255, 255, 255, 0.25)'
                          : 'rgba(0, 0, 0, 0.08)',
                      color: activeSection === 'recently-deleted' ? '#FFFFFF' : '#6E6E73',
                      fontWeight: 600,
                    }}
                  >
                    {deletedPhotosCount}
                  </span>
                )}
              </div>
            </div>

            {/* ALBUMS SECTION */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', padding: '4px 8px', letterSpacing: '0.04em' }}>
                Albums
              </div>

              {/* Media Types (Collapsible) */}
              <div>
                <div
                  onClick={() => setIsMediaTypesOpen((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    borderRadius: 5,
                    cursor: 'pointer',
                    color: '#4A4C52',
                  }}
                >
                  {isMediaTypesOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  <span>Media Types</span>
                </div>

                {isMediaTypesOpen && (
                  <div style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
                    <div
                      onClick={() => setActiveSection('media-portrait')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: activeSection === 'media-portrait' ? '#007AFF' : 'transparent',
                        color: activeSection === 'media-portrait' ? '#FFFFFF' : '#333',
                        fontSize: 12,
                      }}
                    >
                      Portrait
                    </div>
                    <div
                      onClick={() => setActiveSection('media-live')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: activeSection === 'media-live' ? '#007AFF' : 'transparent',
                        color: activeSection === 'media-live' ? '#FFFFFF' : '#333',
                        fontSize: 12,
                      }}
                    >
                      Live Photos
                    </div>
                    <div
                      onClick={() => setActiveSection('media-videos')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: activeSection === 'media-videos' ? '#007AFF' : 'transparent',
                        color: activeSection === 'media-videos' ? '#FFFFFF' : '#333',
                        fontSize: 12,
                      }}
                    >
                      Videos
                    </div>
                    <div
                      onClick={() => setActiveSection('media-screenshots')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: activeSection === 'media-screenshots' ? '#007AFF' : 'transparent',
                        color: activeSection === 'media-screenshots' ? '#FFFFFF' : '#333',
                        fontSize: 12,
                      }}
                    >
                      Screenshots
                    </div>
                  </div>
                )}
              </div>

              {/* Shared Albums */}
              <div
                onClick={() => setIsSharedAlbumsOpen((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  borderRadius: 5,
                  cursor: 'pointer',
                  color: '#4A4C52',
                }}
              >
                {isSharedAlbumsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                <span>Shared Albums</span>
              </div>

              {/* My Albums (Yamin's Portfolio Categories) */}
              <div>
                <div
                  onClick={() => setIsMyAlbumsOpen((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    borderRadius: 5,
                    cursor: 'pointer',
                    color: '#4A4C52',
                  }}
                >
                  {isMyAlbumsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  <span>My Albums</span>
                </div>

                {isMyAlbumsOpen && (
                  <div style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
                    <div
                      onClick={() => setActiveSection('album-work')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: activeSection === 'album-work' ? '#007AFF' : 'transparent',
                        color: activeSection === 'album-work' ? '#FFFFFF' : '#333',
                        fontSize: 12,
                      }}
                    >
                      Work & Engineering
                    </div>
                    <div
                      onClick={() => setActiveSection('album-hackathons')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: activeSection === 'album-hackathons' ? '#007AFF' : 'transparent',
                        color: activeSection === 'album-hackathons' ? '#FFFFFF' : '#333',
                        fontSize: 12,
                      }}
                    >
                      Hackathons & Talks
                    </div>
                    <div
                      onClick={() => setActiveSection('album-workspace')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: activeSection === 'album-workspace' ? '#007AFF' : 'transparent',
                        color: activeSection === 'album-workspace' ? '#FFFFFF' : '#333',
                        fontSize: 12,
                      }}
                    >
                      Workspace & Desk
                    </div>
                    <div
                      onClick={() => setActiveSection('album-travel')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        backgroundColor: activeSection === 'album-travel' ? '#007AFF' : 'transparent',
                        color: activeSection === 'album-travel' ? '#FFFFFF' : '#333',
                        fontSize: 12,
                      }}
                    >
                      Travel & Life
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PROJECTS SECTION */}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', padding: '4px 8px', letterSpacing: '0.04em' }}>
                Projects
              </div>
              <div
                onClick={() => setIsProjectsOpen((prev) => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  borderRadius: 5,
                  cursor: 'pointer',
                  color: '#4A4C52',
                }}
              >
                {isProjectsOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                <span>My Projects</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── MAIN PHOTO CANVAS & GRID ─────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Canvas Header: Date Range, Location & Filter By */}
          <div
            style={{
              padding: '16px 24px 8px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#1D1D1F',
                  letterSpacing: '-0.02em',
                }}
              >
                {activeHeaderTitle}
              </h1>
              <div style={{ fontSize: 12.5, color: '#8E8E93', marginTop: 2 }}>
                {activeSubheader}
              </div>
            </div>

            {/* Header Right Action: Empty Recently Deleted or Filter Dropdown */}
            {activeSection === 'recently-deleted' ? (
              <div>
                {deletedPhotosCount > 0 && (
                  <button
                    onClick={() => {
                      setDeleteModal({
                        isOpen: true,
                        photo: null,
                        isPermanent: true,
                        isMultiple: true,
                        count: deletedPhotosCount,
                      })
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 12px',
                      borderRadius: 6,
                      border: '1px solid rgba(255, 59, 48, 0.3)',
                      backgroundColor: 'rgba(255, 59, 48, 0.08)',
                      color: '#FF3B30',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.15)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.08)')
                    }
                  >
                    <Trash2 size={13} />
                    <span>Empty Recently Deleted</span>
                  </button>
                )}
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsFilterMenuOpen((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: 12,
                    color: '#55575E',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: 5,
                  }}
                >
                  <span>Filter By:</span>
                  <span style={{ fontWeight: 600, color: '#1D1D1F' }}>
                    {filterMode === 'all'
                      ? 'All Items'
                      : filterMode === 'favorites'
                      ? 'Favorites'
                      : filterMode === 'portrait'
                      ? 'Portraits'
                      : 'Live Photos'}
                  </span>
                  <ChevronDown size={12} opacity={0.6} />
                </button>

                {/* Filter Dropdown Menu */}
                {isFilterMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 28,
                      right: 0,
                      width: 140,
                      borderRadius: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      padding: '4px',
                      zIndex: 200,
                    }}
                  >
                    {(
                      [
                        { key: 'all', label: 'All Items' },
                        { key: 'favorites', label: 'Favorites' },
                        { key: 'portrait', label: 'Portraits' },
                        { key: 'live', label: 'Live Photos' },
                      ] as const
                    ).map((opt) => (
                      <div
                        key={opt.key}
                        onClick={() => {
                          soundEngine.play('click')
                          setFilterMode(opt.key)
                          setIsFilterMenuOpen(false)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 8px',
                          borderRadius: 5,
                          fontSize: 12,
                          cursor: 'pointer',
                          color: filterMode === opt.key ? '#007AFF' : '#1D1D1F',
                          backgroundColor:
                            filterMode === opt.key ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                        }}
                      >
                        <span>{opt.label}</span>
                        {filterMode === opt.key && <Check size={12} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photo Grid / Empty State */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 24px',
            }}
          >
            {displayedPhotos.length === 0 ? (
              activeSection === 'recently-deleted' ? (
                /* Authentic macOS Empty Recently Deleted State */
                <div
                  style={{
                    height: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    textAlign: 'center',
                    padding: '0 20px',
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 18,
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8E8E93',
                    }}
                  >
                    <Trash2 size={36} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>
                      No Recently Deleted Photos
                    </h2>
                    <p
                      style={{
                        fontSize: 13,
                        color: '#8E8E93',
                        maxWidth: 420,
                        marginTop: 6,
                        lineHeight: 1.5,
                      }}
                    >
                      Photos and videos show the days remaining before permanent deletion. After that time, items will be permanently deleted.
                    </p>
                  </div>
                </div>
              ) : (
                /* Authentic macOS Empty Library State */
                <div
                  style={{
                    height: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    textAlign: 'center',
                    padding: '0 20px',
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 18,
                      backgroundColor: 'rgba(0, 122, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#007AFF',
                    }}
                  >
                    <Camera size={36} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', margin: 0 }}>
                      Yamin&apos;s Photo Library
                    </h2>
                    <p
                      style={{
                        fontSize: 13,
                        color: '#8E8E93',
                        maxWidth: 420,
                        marginTop: 6,
                        lineHeight: 1.5,
                      }}
                    >
                      Awaiting personal photos. Drag & drop your photos here, or click <strong>Import Photos</strong> to showcase hackathons, tech talks, workstation, and life moments.
                    </p>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 18px',
                      borderRadius: 8,
                      backgroundColor: '#007AFF',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: isImporting ? 'default' : 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 122, 255, 0.28)',
                    }}
                  >
                    {isImporting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{isImporting ? 'Importing...' : 'Import Photos'}</span>
                  </button>
                </div>
              )
            ) : (
              /* Photo Grid */
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridColumns,
                  gap: '12px',
                  alignItems: 'start',
                }}
              >
                {displayedPhotos.map((item) => {
                  const isSelected = selectedPhotoId === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        soundEngine.play('click')
                        setSelectedPhotoId(item.id)
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        soundEngine.play('pop')
                        setViewingPhotoId(item.id)
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        soundEngine.play('click')
                        setSelectedPhotoId(item.id)
                        setContextMenu({
                          x: e.clientX,
                          y: e.clientY,
                          photo: item,
                        })
                      }}
                      style={{
                        position: 'relative',
                        aspectRatio: '1 / 1',
                        borderRadius: 6,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        backgroundColor: '#F3F4F6',
                        outline: isSelected ? '3px solid #007AFF' : 'none',
                        boxShadow: isSelected
                          ? '0 4px 12px rgba(0, 122, 255, 0.35)'
                          : '0 1px 3px rgba(0, 0, 0, 0.08)',
                        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                      }}
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={item.src}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0.4'
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />

                      {/* PORTRAIT Badge in Top-Left (matching reference image!) */}
                      {item.isPortrait && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 6,
                            left: 6,
                            padding: '2px 5px',
                            borderRadius: 3,
                            backgroundColor: 'rgba(0, 0, 0, 0.55)',
                            backdropFilter: 'blur(8px)',
                            color: '#FFFFFF',
                            fontSize: 8.5,
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          PORTRAIT
                        </div>
                      )}

                      {/* LIVE Badge */}
                      {item.isLive && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 6,
                            left: 6,
                            padding: '2px 5px',
                            borderRadius: 3,
                            backgroundColor: 'rgba(0, 0, 0, 0.55)',
                            backdropFilter: 'blur(8px)',
                            color: '#FFFFFF',
                            fontSize: 8.5,
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          LIVE
                        </div>
                      )}

                      {/* Recently Deleted: Days Badge (e.g. 29d) */}
                      {item.isDeleted && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 6,
                            right: 6,
                            padding: '2px 5px',
                            borderRadius: 3,
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            backdropFilter: 'blur(8px)',
                            color: '#FFFFFF',
                            fontSize: 9.5,
                            fontWeight: 600,
                          }}
                        >
                          29d
                        </div>
                      )}

                      {/* Favorite Heart (Hover / Active) - only shown when not deleted */}
                      {!item.isDeleted && (
                        <div
                          onClick={(e) => toggleFavorite(item.id, e)}
                          style={{
                            position: 'absolute',
                            bottom: 6,
                            left: 6,
                            opacity: item.isFavorite ? 1 : 0.8,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                          }}
                        >
                          <Heart
                            size={14}
                            color="#FFFFFF"
                            fill={item.isFavorite ? '#FF2D55' : 'transparent'}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ─── 3. INSPECTOR / GET INFO PANEL (SLIDING RIGHT DRAWER) ─────────── */}
        {isInspectorOpen && selectedPhoto && (
          <div
            style={{
              width: 250,
              backgroundColor: '#F8F9FA',
              borderLeft: '1px solid #D5D7DC',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              fontSize: 12,
              overflowY: 'auto',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1D1D1F' }}>Photo Info</span>
              <button
                onClick={() => setIsInspectorOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#888' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div style={{ borderRadius: 8, overflow: 'hidden', height: 140, backgroundColor: '#000' }}>
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Title & Date */}
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#1D1D1F' }}>
                {selectedPhoto.title}
              </div>
              <div style={{ fontSize: 11.5, color: '#8E8E93', marginTop: 2 }}>
                {selectedPhoto.date}
              </div>
            </div>

            {/* EXIF Camera Details */}
            <div
              style={{
                borderTop: '1px solid #E5E7EB',
                paddingTop: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div>
                <span style={{ color: '#8E8E93' }}>Camera: </span>
                <span style={{ fontWeight: 500 }}>{selectedPhoto.camera || 'iPhone 15 Pro'}</span>
              </div>
              <div>
                <span style={{ color: '#8E8E93' }}>Details: </span>
                <span>{selectedPhoto.details || 'Original Resolution'}</span>
              </div>
              <div>
                <span style={{ color: '#8E8E93' }}>Location: </span>
                <span>{selectedPhoto.location}</span>
              </div>
              <div>
                <span style={{ color: '#8E8E93' }}>Album: </span>
                <span style={{ textTransform: 'capitalize' }}>{selectedPhoto.album}</span>
              </div>

              {/* Inspector Bottom Actions: Delete & Put Back */}
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {!selectedPhoto.isDeleted ? (
                  <button
                    onClick={() => {
                      setDeleteModal({
                        isOpen: true,
                        photo: selectedPhoto,
                        isPermanent: false,
                      })
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: '1px solid rgba(255, 59, 48, 0.25)',
                      backgroundColor: 'rgba(255, 59, 48, 0.08)',
                      color: '#FF3B30',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Delete Photo</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleRecoverPhoto(selectedPhoto.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid rgba(0, 122, 255, 0.3)',
                        backgroundColor: 'rgba(0, 122, 255, 0.08)',
                        color: '#007AFF',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Put Back to Library</span>
                    </button>
                    <button
                      onClick={() => {
                        setDeleteModal({
                          isOpen: true,
                          photo: selectedPhoto,
                          isPermanent: true,
                        })
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid rgba(255, 59, 48, 0.3)',
                        backgroundColor: '#FF3B30',
                        color: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Delete Immediately</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 4. FULL-BLEED MACOS LIGHTBOX VIEWER ─────────────────────────────── */}
      <AnimatePresence>
        {viewingPhoto && (
          <div
            onClick={() => setViewingPhotoId(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Lightbox Top Control Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                height: 48,
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#FFFFFF',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Back to Library Button */}
              <button
                onClick={() => setViewingPhotoId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <ChevronLeft size={16} />
                <span>Photos</span>
              </button>

              {/* Title & Date */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{viewingPhoto.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.6)' }}>
                  {viewingPhoto.date} · {viewingPhoto.location}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {viewingPhoto.isDeleted && (
                  <button
                    onClick={() => handleRecoverPhoto(viewingPhoto.id)}
                    title="Put Back to Library"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#007AFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Put Back</span>
                  </button>
                )}
                {!viewingPhoto.isDeleted && (
                  <button
                    onClick={() => toggleFavorite(viewingPhoto.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: viewingPhoto.isFavorite ? '#FF2D55' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <Heart size={16} fill={viewingPhoto.isFavorite ? '#FF2D55' : 'none'} />
                  </button>
                )}
                <button
                  onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      photo: viewingPhoto,
                      isPermanent: activeSection === 'recently-deleted',
                    })
                  }
                  title={activeSection === 'recently-deleted' ? 'Delete Immediately' : 'Delete Photo (⌫)'}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#FF453A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => soundEngine.play('click')}
                  style={{ border: 'none', background: 'transparent', color: '#FFFFFF', cursor: 'pointer' }}
                >
                  <RotateCw size={16} />
                </button>
                <button
                  onClick={() => setViewingPhotoId(null)}
                  style={{ border: 'none', background: 'transparent', color: '#FFFFFF', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Lightbox Main Stage (Previous, Image, Next) */}
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              {/* Previous Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const idx = displayedPhotos.findIndex((p) => p.id === viewingPhotoId)
                  if (idx > 0) setViewingPhotoId(displayedPhotos[idx - 1].id)
                }}
                style={{
                  position: 'absolute',
                  left: 20,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  zIndex: 10,
                }}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Central Full Resolution Image */}
              <motion.img
                key={viewingPhoto.id}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                src={viewingPhoto.src}
                alt={viewingPhoto.title}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '85vw',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                }}
              />

              {/* Next Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const idx = displayedPhotos.findIndex((p) => p.id === viewingPhotoId)
                  if (idx < displayedPhotos.length - 1) setViewingPhotoId(displayedPhotos[idx + 1].id)
                }}
                style={{
                  position: 'absolute',
                  right: 20,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  zIndex: 10,
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Scrubber Filmstrip */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '0 20px',
                overflowX: 'auto',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {displayedPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setViewingPhotoId(item.id)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    outline: viewingPhotoId === item.id ? '2px solid #007AFF' : 'none',
                    opacity: viewingPhotoId === item.id ? 1 : 0.5,
                    flexShrink: 0,
                    transition: 'opacity 0.15s ease',
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 5. PHOTOS CONTEXT MENU (RIGHT CLICK) ─────────────────────────── */}
      {contextMenu && (
        <PhotosContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          photo={contextMenu.photo}
          isRecentlyDeleted={contextMenu.photo.isDeleted}
          onClose={() => setContextMenu(null)}
          onOpen={(photo) => setViewingPhotoId(photo.id)}
          onGetInfo={(photo) => {
            setSelectedPhotoId(photo.id)
            setIsInspectorOpen(true)
          }}
          onToggleFavorite={(photo) => toggleFavorite(photo.id)}
          onDuplicate={(photo) => handleDuplicatePhoto(photo)}
          onDelete={(photo) =>
            setDeleteModal({
              isOpen: true,
              photo,
              isPermanent: false,
            })
          }
          onRecover={(photo) => handleRecoverPhoto(photo.id)}
          onDeletePermanent={(photo) =>
            setDeleteModal({
              isOpen: true,
              photo,
              isPermanent: true,
            })
          }
        />
      )}

      {/* ─── 6. MACOS DELETE CONFIRMATION MODAL ────────────────────────────── */}
      <PhotosDeleteModal
        isOpen={deleteModal.isOpen}
        photo={deleteModal.photo}
        isPermanent={deleteModal.isPermanent}
        isMultiple={deleteModal.isMultiple}
        count={deleteModal.count}
        onClose={() => setDeleteModal({ isOpen: false, photo: null, isPermanent: false })}
        onConfirm={() => {
          if (deleteModal.isMultiple) {
            handleEmptyTrash()
          } else if (deleteModal.photo) {
            executeDeletePhoto(deleteModal.photo.id, deleteModal.isPermanent)
          }
        }}
      />
    </div>
  )
}
