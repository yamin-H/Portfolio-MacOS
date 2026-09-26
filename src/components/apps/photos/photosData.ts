export interface PhotoItem {
  id: string
  title: string
  src: string
  date: string
  dateHeader: string
  location: string
  year: number
  month: string
  day: string
  isFavorite: boolean
  isPortrait?: boolean
  isLive?: boolean
  mediaType: 'photo' | 'portrait' | 'live' | 'video' | 'screenshot'
  album: 'work' | 'hackathons' | 'workspace' | 'travel' | 'personal'
  camera?: string
  details?: string
  caption?: string
  aspect?: 'square' | 'portrait' | 'landscape'
  isDeleted?: boolean
  deletedAt?: number
}

export type PhotosSection =
  | 'library'
  | 'memories'
  | 'people'
  | 'places'
  | 'recents'
  | 'imports'
  | 'recently-deleted'
  | 'media-videos'
  | 'media-selfies'
  | 'media-live'
  | 'media-portrait'
  | 'media-panoramas'
  | 'media-screenshots'
  | 'album-work'
  | 'album-hackathons'
  | 'album-workspace'
  | 'album-travel'
  | 'album-personal'

export type TimeViewMode = 'years' | 'months' | 'days' | 'all'
export type FilterMode = 'all' | 'favorites' | 'portrait' | 'live' | 'edited'

// Initial library state
// When Yamin provides his personal photos, they will be registered here and in public/photos/
export const INITIAL_PHOTOS: PhotoItem[] = []
