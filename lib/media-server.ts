import fs from 'fs'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { MediaFile, MediaStats } from './media'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
const MEDIA_URL = '/media'

// Ensure media directory exists
export async function ensureMediaDir() {
  try {
    await mkdir(MEDIA_DIR, { recursive: true })
  } catch (error) {
    console.error('Failed to create media directory:', error)
  }
}

// Generate unique filename
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = path.extname(originalName)
  const nameWithoutExt = path.basename(originalName, extension)
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
  
  return `${sanitizedName}-${timestamp}-${random}${extension}`
}

// Save file to media directory
export async function saveMediaFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<MediaFile> {
  await ensureMediaDir()
  
  const filename = generateUniqueFilename(originalName)
  const filePath = path.join(MEDIA_DIR, filename)
  const relativePath = path.join('media', filename)
  
  await writeFile(filePath, buffer)
  
  const stats = fs.statSync(filePath)
  
  return {
    id: filename.replace(path.extname(filename), ''),
    filename,
    originalName,
    path: relativePath,
    url: `${MEDIA_URL}/${filename}`,
    size: stats.size,
    mimeType,
    uploadedAt: new Date(),
  }
}

// Get all media files
export async function getAllMediaFiles(): Promise<MediaFile[]> {
  await ensureMediaDir()
  
  try {
    const files = fs.readdirSync(MEDIA_DIR)
    const mediaFiles: MediaFile[] = []
    
    for (const file of files) {
      const filePath = path.join(MEDIA_DIR, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isFile()) {
        const relativePath = path.join('media', file)
        const mimeType = getMimeType(file)
        
        mediaFiles.push({
          id: file.replace(path.extname(file), ''),
          filename: file,
          originalName: file,
          path: relativePath,
          url: `${MEDIA_URL}/${file}`,
          size: stats.size,
          mimeType,
          uploadedAt: stats.birthtime,
        })
      }
    }
    
    return mediaFiles.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
  } catch (error) {
    console.error('Failed to read media files:', error)
    return []
  }
}

// Delete media file
export async function deleteMediaFile(filename: string): Promise<boolean> {
  try {
    const filePath = path.join(MEDIA_DIR, filename)
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Failed to delete media file:', error)
    return false
  }
}

// Get media statistics
export async function getMediaStats(): Promise<MediaStats> {
  const files = await getAllMediaFiles()
  
  const stats: MediaStats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, file) => sum + file.size, 0),
    fileTypes: {},
  }
  
  files.forEach(file => {
    const ext = path.extname(file.filename).toLowerCase()
    stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1
  })
  
  return stats
}

// Get MIME type from filename
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
  }
  
  return mimeTypes[ext] || 'application/octet-stream'
} 