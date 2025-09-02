"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bold, Italic, List, ListOrdered, ImageIcon, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from "@/components/upload-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [text, setText] = useState(value)
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const [showImageUpload, setShowImageUpload] = useState(false)

  const colorOptions = [
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Yellow", value: "#eab308" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
  ]

  useEffect(() => {
    setText(value)
  }, [value])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    onChange(newText)
    setSelectionStart(e.target.selectionStart)
    setSelectionEnd(e.target.selectionEnd)
  }

  const handleTextAreaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelectionStart(target.selectionStart)
    setSelectionEnd(target.selectionEnd)
  }

  const insertAtCursor = (before: string, after = "") => {
    const newText =
      text.substring(0, selectionStart) +
      before +
      text.substring(selectionStart, selectionEnd) +
      after +
      text.substring(selectionEnd)

    setText(newText)
    onChange(newText)
  }

  const formatText = (format: string, colorValue?: string) => {
    const selectedText = text.substring(selectionStart, selectionEnd)

    switch (format) {
      case "bold":
        insertAtCursor("**", "**")
        break
      case "italic":
        insertAtCursor("_", "_")
        break
      case "unordered-list":
        insertAtCursor("- ")
        break
      case "ordered-list":
        insertAtCursor("1. ")
        break
      case "color":
        if (colorValue) {
          insertAtCursor(`<span style="color:${colorValue}">`, "</span>")
        }
        break
      default:
        break
    }
  }

  const handleImageUpload = (url: string) => {
    insertAtCursor(`![Image](${url})`)
    setShowImageUpload(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 border rounded-md p-1">
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatText("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("unordered-list")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("ordered-list")}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Palette className="h-4 w-4" />
              <span className="sr-only">Text Color</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {colorOptions.map((color) => (
              <DropdownMenuItem
                key={color.value}
                onClick={() => formatText("color", color.value)}
                className="flex items-center gap-2"
              >
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color.value }} aria-hidden="true" />
                <span>{color.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageUpload(!showImageUpload)}
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Insert Image</span>
        </Button>
      </div>

      {showImageUpload && (
        <div className="p-2 border rounded-md">
          <UploadButton onUploadComplete={handleImageUpload} />
          <p className="text-xs text-muted-foreground mt-2">
            Upload an image or paste an image URL directly in the editor using the format: ![Alt text](image-url)
          </p>
        </div>
      )}

      <Textarea
        value={text}
        onChange={handleTextChange}
        onSelect={handleTextAreaSelect}
        placeholder={placeholder}
        className="min-h-[300px] font-mono"
      />

      <div className="text-xs text-muted-foreground">
        <p>
          Formatting: <strong>**Bold**</strong>, <em>_Italic_</em>, - Bullet list, 1. Numbered list
        </p>
        <p>Images: ![Alt text](image-url)</p>
        <p>Colors: Use the color palette button to add colored text</p>
      </div>
    </div>
  )
}

