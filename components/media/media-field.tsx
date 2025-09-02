"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, File, X } from 'lucide-react'
import { MediaPicker } from './media-picker'
import { MediaFile, isImage } from '@/lib/media'

interface MediaFieldProps {
  label?: string
  value?: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  className?: string
  required?: boolean
}

export function MediaField({
  label,
  value,
  onChange,
  placeholder = "Select media file",
  className = "",
  required = false
}: MediaFieldProps) {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)

  const handleSelect = (file: MediaFile) => {
    setSelectedFile(file)
    onChange(file.url)
  }

  const handleClear = () => {
    setSelectedFile(null)
    onChange(null)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="space-y-2">
        {selectedFile ? (
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <MediaPicker
            onSelect={handleSelect}
            selectedFile={selectedFile}
            title="Select Media File"
            description="Choose a file from your media library"
          />
        )}
      </div>
    </div>
  )
} 