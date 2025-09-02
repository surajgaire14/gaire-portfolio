"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  TableIcon,
} from "lucide-react"

interface MarkdownToolbarProps {
  onInsert: (text: string) => void
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  const insertMarkdown = (before: string, after = "", placeholder = "") => {
    const text = placeholder ? `${before}${placeholder}${after}` : `${before}${after}`
    onInsert(text)
  }

  return (
    <div className="border-b p-2 flex flex-wrap items-center gap-1 bg-muted/50">
      {/* Text Formatting */}
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("**", "**", "bold text")} title="Bold">
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("*", "*", "italic text")} title="Italic">
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertMarkdown("~~", "~~", "strikethrough text")}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("`", "`", "inline code")} title="Inline Code">
        <Code className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("# ", "", "Heading 1")} title="Heading 1">
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("## ", "", "Heading 2")} title="Heading 2">
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("### ", "", "Heading 3")} title="Heading 3">
        <Heading3 className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("- ", "", "List item")} title="Bullet List">
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertMarkdown("1. ", "", "Numbered item")}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertMarkdown("> ", "", "Quote")} title="Quote">
        <Quote className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Media & Links */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertMarkdown("[", "](https://example.com)", "link text")}
        title="Link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertMarkdown("![", "](https://example.com/image.jpg)", "alt text")}
        title="Image"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertMarkdown("| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |")}
        title="Table"
      >
        <TableIcon className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Code Block */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertMarkdown("```\n", "\n```", "code here")}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </Button>
    </div>
  )
}
