"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Image as ImageIcon, File } from 'lucide-react'
import { MediaGrid } from './media-grid'
import { MediaFile, isImage } from '@/lib/media'

interface MediaPickerProps {
  onSelect: (file: MediaFile) => void
  trigger?: React.ReactNode
  title?: string
  description?: string
  showPreview?: boolean
  selectedFile?: MediaFile | null
}

export function MediaPicker({
  onSelect,
  trigger,
  title = "Select Media",
  description = "Choose a file from your media library",
  showPreview = true,
  selectedFile
}: MediaPickerProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchMedia()
    }
  }, [open])

  const handleSelect = (file: MediaFile) => {
    onSelect(file)
    setOpen(false)
  }

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const defaultTrigger = (
    <Button variant="outline" className="w-full justify-start">
      {selectedFile ? (
        <div className="flex items-center gap-2">
          {isImage(selectedFile.mimeType) ? (
            <ImageIcon className="h-4 w-4" />
          ) : (
            <File className="h-4 w-4" />
          )}
          <span className="truncate">{selectedFile.originalName}</span>
        </div>
      ) : (
        <>
          <ImageIcon className="h-4 w-4 mr-2" />
          Select media
        </>
      )}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected file preview */}
          {showPreview && selectedFile && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-2">Currently Selected:</h4>
              <div className="flex items-center gap-3">
                {isImage(selectedFile.mimeType) ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={selectedFile.url}
                      alt={selectedFile.originalName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                    <File className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.originalName}</p>
                  <p className="text-sm text-gray-500">{selectedFile.mimeType}</p>
                </div>
              </div>
            </div>
          )}

          {/* Media Grid */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p>Loading media files...</p>
                </div>
              </div>
            ) : (
              <MediaGrid
                files={filteredFiles}
                onDelete={() => {}} // Disable delete in picker mode
                onSelect={handleSelect}
                selectable={true}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 