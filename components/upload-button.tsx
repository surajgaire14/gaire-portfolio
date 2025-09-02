"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadFile } from "@/lib/actions"
import { toast } from "react-toastify"

interface UploadButtonProps {
  onUploadComplete: (url: string, fileSize?: number) => void
  onMultipleUploadsComplete?: (urls: string[], fileSizes?: number[]) => void
  multiple?: boolean
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  children?: React.ReactNode
}

export function UploadButton({
  onUploadComplete,
  onMultipleUploadsComplete,
  multiple = false,
  variant = "outline",
  children,
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)

      if (multiple && files.length > 1 && onMultipleUploadsComplete) {
        const uploadPromises = Array.from(files).map((file) => {
          const formData = new FormData()
          formData.append("file", file)
          return uploadFile(formData)
        })

        const results = await Promise.all(uploadPromises)
        const successfulUrls = results
          .filter((response) => response.success && response.url)
          .map((response) => response.url as string)

        const fileSizes = Array.from(files)
          .filter((_, index) => results[index].success)
          .map((file) => file.size)

        if (successfulUrls.length > 0) {
          onMultipleUploadsComplete(successfulUrls, fileSizes)
          toast(`${successfulUrls.length} images have been uploaded successfully.`)
        }

        if (successfulUrls.length !== files.length) {
          toast.error(`${files.length - successfulUrls.length} images failed to upload.`)
        }
      } else {
        const file = files[0]
        const formData = new FormData()
        formData.append("file", file)

        const response = await uploadFile(formData)

        if (response.success && response.url) {
          onUploadComplete(response.url, file.size)
          toast.success("Your image has been uploaded successfully.")
        } else {
          throw new Error(response.error || "Failed to upload file")
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  return (
    <Button variant={variant} className="relative" disabled={isUploading}>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept="image/*"
        disabled={isUploading}
        multiple={multiple}
      />
      {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          {children || (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {multiple ? "Upload Images" : "Upload Image"}
            </>
          )}
        </>
      )}
    </Button>
  )
}

