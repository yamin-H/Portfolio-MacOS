import { PhotoItem, INITIAL_PHOTOS } from './photosData'

const DB_NAME = 'macos_photos_store_v1'
const STORE_NAME = 'photos'
const LOCAL_STORAGE_KEY = 'macos_photos_library'

// ─── IndexedDB Helper ────────────────────────────────────────────────────────
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllPhotosFromDB(): Promise<PhotoItem[]> {
  try {
    const db = await openDB()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result as PhotoItem[]
        // Filter out any stale/broken blob: URLs from previous sessions
        const cleanItems = (items || []).filter((p) => p && p.src && !p.src.startsWith('blob:'))
        resolve(cleanItems)
      }

      request.onerror = () => {
        resolve([])
      }
    })
  } catch (err) {
    console.warn('[PhotosDB] Failed to get items from IndexedDB, falling back to localStorage:', err)
    return []
  }
}

export async function savePhotoToDB(item: PhotoItem): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.put(item)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn('[PhotosDB] Failed to save photo to IndexedDB:', err)
  }
}

export async function saveAllPhotosToDB(items: PhotoItem[]): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.clear()
      items.forEach((item) => store.put(item))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (err) {
    console.warn('[PhotosDB] Failed to save all photos to IndexedDB:', err)
  }
}

export async function deletePhotoFromDB(id: string): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.warn('[PhotosDB] Failed to delete photo from IndexedDB:', err)
  }
}

// ─── LocalStorage Synchronization & Stale Blob Sanitization ───────────────────
export function getCleanLocalStoragePhotos(): PhotoItem[] {
  if (typeof window === 'undefined') return INITIAL_PHOTOS
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        // Discard any broken blob URLs (e.g. from previous sessions where createObjectURL was used)
        const clean = parsed.filter((p: PhotoItem) => p && p.src && !p.src.startsWith('blob:'))
        if (clean.length !== parsed.length) {
          // Resave sanitized list immediately to eradicate broken image references
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clean))
        }
        return clean
      }
    }
  } catch (e) {
    console.warn('[PhotosStorage] Error reading localStorage:', e)
  }
  return INITIAL_PHOTOS
}

export function saveToLocalStorage(items: PhotoItem[]): void {
  if (typeof window === 'undefined') return
  try {
    // Only save items that are not broken blob URLs
    const clean = items.filter((p) => p && p.src && !p.src.startsWith('blob:'))
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clean))
  } catch (e) {
    // localStorage has a strict 5MB quota; if base64 images exceed it, IndexedDB will still hold them safely
    console.warn('[PhotosStorage] localStorage quota reached or disabled, IndexedDB will be used as source of truth:', e)
  }
}

// ─── Client-Side Image Optimizer (Converts File to Persistent Base64 Data URL) ─
export function optimizeAndReadImageFile(file: File): Promise<{
  dataUrl: string
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string
      if (!rawDataUrl) {
        reject(new Error('Failed to read file'))
        return
      }

      // If file is SVG or GIF, preserve directly
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve({
          dataUrl: rawDataUrl,
          width: 800,
          height: 600,
        })
        return
      }

      const img = new Image()
      img.onload = () => {
        const origWidth = img.naturalWidth || img.width
        const origHeight = img.naturalHeight || img.height

        // Downscale very large images (e.g., 4000x3000) so they load instantly and take minimal space
        const MAX_DIMENSION = 1920
        let targetWidth = origWidth
        let targetHeight = origHeight

        if (origWidth > MAX_DIMENSION || origHeight > MAX_DIMENSION) {
          if (origWidth > origHeight) {
            targetWidth = MAX_DIMENSION
            targetHeight = Math.round((origHeight * MAX_DIMENSION) / origWidth)
          } else {
            targetHeight = MAX_DIMENSION
            targetWidth = Math.round((origWidth * MAX_DIMENSION) / origHeight)
          }
        }

        // If no resize is needed and file size is small (< 1MB), use original data URL
        if (targetWidth === origWidth && targetHeight === origHeight && file.size < 1024 * 1024) {
          resolve({
            dataUrl: rawDataUrl,
            width: origWidth,
            height: origHeight,
          })
          return
        }

        try {
          const canvas = document.createElement('canvas')
          canvas.width = targetWidth
          canvas.height = targetHeight
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve({ dataUrl: rawDataUrl, width: origWidth, height: origHeight })
            return
          }

          // Render with smooth bicubic interpolation
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
          const quality = 0.88
          const optimizedDataUrl = canvas.toDataURL(mimeType, quality)

          resolve({
            dataUrl: optimizedDataUrl,
            width: targetWidth,
            height: targetHeight,
          })
        } catch {
          // Fallback to raw data URL if canvas fails
          resolve({ dataUrl: rawDataUrl, width: origWidth, height: origHeight })
        }
      }

      img.onerror = () => {
        // Fallback to raw data URL
        resolve({ dataUrl: rawDataUrl, width: 800, height: 600 })
      }

      img.src = rawDataUrl
    }

    reader.onerror = () => reject(new Error('FileReader error'))
    reader.readAsDataURL(file)
  })
}
