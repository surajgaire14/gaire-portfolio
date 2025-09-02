
export interface MediaFile {
  id: string
  filename: string
  originalName: string
  path: string
  url: string
  size: number
  mimeType: string
  uploadedAt: Date
  dimensions?: {
    width: number
    height: number
  }
}

export interface MediaStats {
  totalFiles: number
  totalSize: number
  fileTypes: Record<string, number>
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Check if file is image
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

// Check if file is video
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith('video/')
}

// Check if file is document
export function isDocument(mimeType: string): boolean {
  return mimeType.startsWith('application/') && 
    (mimeType.includes('pdf') || 
     mimeType.includes('word') || 
     mimeType.includes('excel') ||
     mimeType.includes('text'))
} 