export interface NoteAttachment {
  type: 'image' | 'audio' | 'link'
  title: string
  subtitle?: string
  url?: string
  imageSrc?: string
  fileSize?: string
}

export interface NoteItem {
  id: string
  title: string
  content: string // Tiptap HTML content
  plainText: string // Extracted for search & snippet
  folderId: string // 'notes-icloud' | 'shared' | 'articles' | 'private' | 'travel' | 'quick-notes'
  createdAt: number // epoch ms
  updatedAt: number // epoch ms
  isPinned?: boolean
  isDeleted?: boolean
  deletedAt?: number | null
  isLocked?: boolean
  isStarred?: boolean
  thumbnailType?: 'zelda' | 'camera' | 'doc' | 'twitter' | 'audio'
  group?: 'Pinned' | 'Today' | 'Yesterday' | 'Previous 30 Days'
}

export interface SidebarFolder {
  id: string
  name: string
  section: 'icloud' | 'personal'
  iconName: 'folder' | 'notes' | 'shared' | 'articles' | 'private' | 'archive' | 'home' | 'coffee' | 'plane' | 'trash'
  count?: number
  isEditable?: boolean
}

export type ThemeMode = 'light' | 'dark'
