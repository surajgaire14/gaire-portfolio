"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Copy, Download, Eye, File, Image as ImageIcon, Video, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { MediaFile, formatFileSize, isImage, isVideo, isDocument } from '@/lib/media'

interface MediaGridProps {
  files: MediaFile[]
  onDelete: (filename: string) => void
  onSelect?: (file: MediaFile) => void
  selectable?: boolean
}

export function MediaGrid({ files, onDelete, onSelect, selectable = false }: MediaGridProps) {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch(`/api/media/${filename}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      onDelete(filename)
      toast.success('File deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete file')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  const handleDownload = (file: MediaFile) => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.originalName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFileIcon = (mimeType: string) => {
    if (isImage(mimeType)) return <ImageIcon className="h-6 w-6" />
    if (isVideo(mimeType)) return <Video className="h-6 w-6" />
    if (isDocument(mimeType)) return <FileText className="h-6 w-6" />
    return <File className="h-6 w-6" />
  }

  const renderPreview = (file: MediaFile) => {
    if (isImage(file.mimeType)) {
      return (
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={file.url}
            alt={file.originalName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )
    }

    if (isVideo(file.mimeType)) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          <video
            src={file.url}
            className="h-full w-full object-cover"
            controls
          />
        </div>
      )
    }

    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100">
        {getFileIcon(file.mimeType)}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">No files uploaded</p>
        <p className="text-gray-500">Upload your first file to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {files.map((file) => (
          <Card
            key={file.id}
            className={`group cursor-pointer transition-all hover:shadow-lg ${
              selectable ? 'hover:ring-2 hover:ring-blue-500' : ''
            }`}
            onClick={() => {
              if (selectable && onSelect) {
                onSelect(file)
              }
            }}
          >
            <CardContent className="p-3">
              <div className="space-y-3">
                {renderPreview(file)}
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyUrl(file.url)
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(file)
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(file.filename)
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                    
                    <span className="text-xs text-gray-400">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 