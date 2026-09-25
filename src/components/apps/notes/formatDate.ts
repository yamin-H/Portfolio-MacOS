import { isToday, isYesterday, format, formatDistanceToNow } from 'date-fns'

export function formatNoteListDate(timestamp: number): string {
  const date = new Date(timestamp)
  if (isToday(date)) {
    return format(date, 'h:mm a')
  }
  if (isYesterday(date)) {
    return 'Yesterday'
  }
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  if (timestamp > oneWeekAgo) {
    return format(date, 'EEEE') // e.g. "Tuesday"
  }
  return format(date, 'M/d/yy') // e.g. "6/7/24"
}

export function formatEditorHeaderDate(timestamp: number): string {
  const date = new Date(timestamp)
  return format(date, 'MMMM d, yyyy \'at\' h:mm a')
}
