"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { List, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  text: string
  level: number
  children?: TOCItem[]
}

interface TableOfContentsProps {
  content: string
  className?: string
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const generateTOC = () => {
      // Extract headings from markdown content
      const headingRegex = /^(#{1,6})\s+(.+)$/gm
      const headings: { level: number; text: string; id: string }[] = []
      let match

      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()

        headings.push({ level, text, id })
      }

      // Build hierarchical structure
      const buildHierarchy = (items: typeof headings): TOCItem[] => {
        const result: TOCItem[] = []
        const stack: TOCItem[] = []

        for (const item of items) {
          const tocItem: TOCItem = {
            id: item.id,
            text: item.text,
            level: item.level,
            children: [],
          }

          // Find the correct parent
          while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
            stack.pop()
          }

          if (stack.length === 0) {
            result.push(tocItem)
          } else {
            const parent = stack[stack.length - 1]
            if (!parent.children) parent.children = []
            parent.children.push(tocItem)
          }

          stack.push(tocItem)
        }

        return result
      }

      setTocItems(buildHierarchy(headings))
    }

    if (content) {
      generateTOC()
    } else {
      setTocItems([])
    }
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const renderTOCItems = (items: TOCItem[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id} className={cn("", depth > 0 && "ml-4")}>
        <button
          onClick={() => scrollToHeading(item.id)}
          className={cn(
            "flex items-start gap-2 w-full text-left py-1.5 px-2 rounded-md text-sm transition-colors",
            "hover:bg-gray-100 hover:text-gray-900",
            "text-gray-600",
            item.level === 1 && "font-medium text-gray-900",
            item.level === 2 && "font-medium text-gray-800",
            item.level >= 3 && "text-gray-600",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
              item.level === 1 && "bg-blue-600",
              item.level === 2 && "bg-blue-400",
              item.level >= 3 && "bg-gray-400",
            )}
          />
          <span className="line-clamp-2">{item.text}</span>
        </button>
        {item.children && item.children.length > 0 && (
          <div className="mt-1">{renderTOCItems(item.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  if (tocItems.length === 0) {
    return (
      <Card className={cn("border-0 shadow-sm", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <List className="w-5 h-5 text-gray-400" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 italic">Add headings to your content to generate a table of contents</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <List className="w-5 h-5 text-blue-600" />
            Table of Contents
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="pt-0">
          <div className="space-y-1 max-h-64 overflow-y-auto">{renderTOCItems(tocItems)}</div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {tocItems.length} section{tocItems.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
