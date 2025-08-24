"use client"

import type React from "react"
import type { ReactElement } from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  Edit,
  ArrowLeft,
  ExternalLink,
  FileText,
  Code,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle,
  Hash,
  Clock,
  List,
  Calendar,
  Tag,
  ImageIcon,
  ChevronUp,
  ChevronDown,
  Plus,
  X,
} from "lucide-react"
import { saveDraft, publishPost } from "@/lib/actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { RichTextEditor } from "@/components/rich-text-editor"
import { MarkdownToolbar } from "@/components/markdown-toolbar"
import { TableOfContents } from "@/components/table-of-contents"
import { htmlToMarkdown, markdownToHtml } from "@/lib/content-converter"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCategories } from "@/hooks/use-categories"
import { toast } from "react-toastify"

interface SEOData {
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  tags: string[]
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
}

interface SEOAnalysis {
  score: number
  checks: {
    title: { passed: boolean; message: string; score: number }
    metaDescription: { passed: boolean; message: string; score: number }
    content: { passed: boolean; message: string; score: number }
    keywords: { passed: boolean; message: string; score: number }
    readability: { passed: boolean; message: string; score: number }
  }
}

export default function CreatePostPage(): ReactElement {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [isExternalPost, setIsExternalPost] = useState(false)
  const [editorMode, setEditorMode] = useState<"rich" | "markdown">("rich")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [focusKeyword, setFocusKeyword] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [publishDate, setPublishDate] = useState("")
  const [readingTime, setReadingTime] = useState(0)
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft")
  const [visibility, setVisibility] = useState<"public" | "private" | "password">("public")
  const [featuredImage, setFeaturedImage] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [seoData, setSeoData] = useState<SEOData>({
    metaTitle: "",
    metaDescription: "",
    focusKeyword: "",
    tags: [],
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [draftSlug, setDraftSlug] = useState<string>("")
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)
  const [isPublishPanelOpen, setIsPublishPanelOpen] = useState(true)
  const [isCategoriesPanelOpen, setIsCategoriesPanelOpen] = useState(true)
  const [isTagsPanelOpen, setIsTagsPanelOpen] = useState(true)
  const [isFeaturedImagePanelOpen, setIsFeaturedImagePanelOpen] = useState(false)
  const [isSEOPanelOpen, setIsSEOPanelOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const { categories, isLoading, error , setCategories} = useCategories()
  const [categoryInput, setCategoryInput] = useState("")
  const [categoryError, setCategoryError] = useState("")

  const addCategory = async () => {
    if (!categoryInput.trim()) {
      setCategoryError("Category name cannot be empty");
      return;
    }
    // Check for duplicate category name (case-insensitive)
    if (categories.some(cat => cat.name.toLowerCase() === categoryInput.trim().toLowerCase())) {
      setCategoryError("Category already exists");
      return;
    }
    // make an api call to create a new category
    const response = await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name: categoryInput.trim() }),
    })
    const data = await response.json()
    setCategories(prev => [...prev, data.category])

    
    setCategoryInput("");
    setCategoryError("");
  };

  const addSelectedCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const removeSelectedCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
  };
  

  // Calculate reading time
  useEffect(() => {
    const words = content.split(/\s+/).filter((word) => word.length > 0).length
    const avgWordsPerMinute = 200
    setReadingTime(Math.ceil(words / avgWordsPerMinute))
  }, [content])

  // SEO Analysis
  useEffect(() => {
    if (title && content) {
      const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
      const keywordInTitle = focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())
      const keywordInContent = focusKeyword && content.toLowerCase().includes(focusKeyword.toLowerCase())
      const keywordInDescription = focusKeyword && description.toLowerCase().includes(focusKeyword.toLowerCase())

      const checks = {
        title: {
          passed: Boolean(title.length >= 30 && title.length <= 60 && keywordInTitle),
          message:
            title.length < 30
              ? "Title too short"
              : title.length > 60
                ? "Title too long"
                : !keywordInTitle
                  ? "Add focus keyword"
                  : "Title optimized",
          score: title.length >= 30 && title.length <= 60 ? (keywordInTitle ? 25 : 15) : 5,
        },
        metaDescription: {
          passed: Boolean(description.length >= 120 && description.length <= 160 && keywordInDescription),
          message:
            description.length < 120
              ? "Description too short"
              : description.length > 160
                ? "Description too long"
                : !keywordInDescription
                  ? "Add focus keyword"
                  : "Description optimized",
          score: description.length >= 120 && description.length <= 160 ? (keywordInDescription ? 25 : 15) : 5,
        },
        content: {
          passed: wordCount >= 300,
          message: wordCount < 300 ? `${wordCount} words (min 300)` : `${wordCount} words - good length`,
          score: wordCount >= 1000 ? 25 : wordCount >= 500 ? 20 : wordCount >= 300 ? 15 : 5,
        },
        keywords: {
          passed: Boolean(keywordInContent && focusKeyword && focusKeyword.length > 0),
          message: !focusKeyword
            ? "Set focus keyword"
            : !keywordInContent
              ? "Use keyword in content"
              : "Keyword usage good",
          score: keywordInContent && focusKeyword ? 15 : 0,
        },
        readability: {
          passed: tags.length >= 3,
          message: tags.length < 3 ? `Add ${3 - tags.length} more tags` : "Good tag coverage",
          score: tags.length >= 5 ? 10 : tags.length >= 3 ? 8 : tags.length >= 1 ? 5 : 0,
        },
      }

      const totalScore = Object.values(checks).reduce((sum, check) => sum + check.score, 0)
      setSeoAnalysis({
        score: Math.min(100, totalScore),
        checks,
      })
    }
  }, [title, description, content, focusKeyword, tags])

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handlePostTypeChange = (checked: boolean) => {
    setIsExternalPost(checked)
    if (checked) {
      setContent("")
      setHtmlContent("")
    } else {
      setExternalUrl("")
    }
  }

  const handleEditorModeChange = (mode: "rich" | "markdown") => {
    if (mode === "markdown" && htmlContent) {
      const markdown = htmlToMarkdown(htmlContent)
      setContent(markdown)
    } else if (mode === "rich" && content) {
      const html = markdownToHtml(content)
      setHtmlContent(html)
    }
    setEditorMode(mode)
  }

  const handleRichEditorChange = (html: string) => {
    setHtmlContent(html)
    const markdown = htmlToMarkdown(html)
    setContent(markdown)
  }

  const handleMarkdownChange = (markdown: string) => {
    setContent(markdown)
    const html = markdownToHtml(markdown)
    setHtmlContent(html)
  }

  const insertMarkdownText = (text: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const currentContent = content
      const newContent = currentContent.substring(0, start) + text + currentContent.substring(end)

      setContent(newContent)
      handleMarkdownChange(newContent)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + text.length, start + text.length)
      }, 0)
    }
  }

  const validateForm = () => {
    if (!title.trim()) {
      alert("Please enter a title")
      return false
    }

    if (isExternalPost) {
      if (!externalUrl.trim()) {
        alert("Please enter an external URL")
        return false
      }
      try {
        new URL(externalUrl)
      } catch {
        alert("Please enter a valid URL")
        return false
      }
    } else {
      if (!content.trim()) {
        alert("Please enter content for your post")
        return false
      }
    }

    return true
  }

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("Please enter a title to save draft")
      return
    }

    setIsSavingDraft(true)
    try {
      const result = await saveDraft({
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        externalUrl: isExternalPost ? externalUrl.trim() : "",
        isExternal: isExternalPost,
        tags: [...tags, ...seoData.tags],
        categories: selectedCategories,
        focusKeyword,
        seoData,
      })

      if (result.success) {
        setDraftSlug(result.slug!)
        alert("Draft saved successfully!")
      } else {
        alert("Failed to save draft")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      alert("Failed to save draft")
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handlePublish = async () => {
    if (!validateForm()) return

    setIsPublishing(true)
    try {
      // const result = await publishPost({
      //   title: title.trim(),
      //   description: description.trim(),
      //   content: content.trim(),
      //   externalUrl: isExternalPost ? externalUrl.trim() : "",
      //   isExternal: isExternalPost,
      //   tags: [...tags, ...seoData.tags],
      //   focusKeyword,
      //   seoData,
      // })
      const response = await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          externalUrl: isExternalPost ? externalUrl.trim() : "",
          isExternal: isExternalPost,
          tags: [...tags, ...seoData.tags],
          categories: selectedCategories,
          focusKeyword,
          seoData,
        }),
      })

      if (response.ok) {
        router.push(`/admin/blog`)
      }
    } catch (error) {
      console.error("Error publishing post:", error)
      toast.error("Failed to publish post")
    } finally {
      setIsPublishing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200"
    if (score >= 60) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/posts">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 px-2">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Posts
                  </Button>
                </Link>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-medium text-gray-900">Add New Post</h1>
                  {draftSlug && (
                    <Badge variant="secondary" className="text-xs">
                      Draft Saved
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {showPreview ? <Edit className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {showPreview ? "Edit" : "Preview"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="border-gray-300 bg-transparent"
                >
                  {isSavingDraft ? "Saving..." : "Save Draft"}
                </Button>

                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPublishing ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <Input
                  placeholder="Add title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold border-0 px-0 py-4 placeholder:text-gray-400 focus-visible:ring-0 shadow-none"
                  style={{ fontSize: "2rem", lineHeight: "2.5rem" }}
                />
                <div className="text-xs text-gray-500 mt-1">{title.length}/60 characters</div>
              </div>

              {title && (
                <div className="text-sm text-gray-600">
                  <span className="text-gray-400">Permalink:</span>{" "}
                  <span className="text-blue-600">
                    /blog/
                    {title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-+|-+$/g, "")}
                  </span>
                </div>
              )}

              {!isExternalPost && (
                <div className="flex items-center gap-2 py-2 border-b border-gray-100">
                  <Tabs
                    value={editorMode}
                    onValueChange={(value) => handleEditorModeChange(value as "rich" | "markdown")}
                  >
                    <TabsList className="h-8">
                      <TabsTrigger value="rich" className="text-xs px-3 py-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Visual
                      </TabsTrigger>
                      <TabsTrigger value="markdown" className="text-xs px-3 py-1">
                        <Code className="w-3 h-3 mr-1" />
                        Text
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}

              <div className="min-h-[500px]">
                {showPreview ? (
                  <div className="prose prose-gray max-w-none">
                    <div className="border rounded-lg p-8 bg-gray-50">
                      <h1 className="text-3xl font-bold mb-4">{title || "Untitled Post"}</h1>
                      {description && <p className="text-xl text-gray-600 mb-6">{description}</p>}

                      <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
                        {selectedCategories.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Hash className="w-4 h-4" />
                            <span className="capitalize">
                              {selectedCategories.map(catId => 
                                categories.find(cat => cat.id === catId)?.name
                              ).filter(Boolean).join(", ")}
                            </span>
                          </div>
                        )}
                        {readingTime > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{readingTime} min read</span>
                          </div>
                        )}
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 not-prose mb-8">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {isExternalPost ? (
                        <div className="border rounded-lg p-6 bg-blue-50 border-blue-200">
                          <div className="flex items-center gap-2 mb-4">
                            <ExternalLink className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-800">External Article</span>
                          </div>
                          <p className="mb-4 text-gray-700">This post links to an external article:</p>
                          {externalUrl && (
                            <a
                              href={externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              {externalUrl}
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <div>
                          {content ? (
                            <MarkdownRenderer content={content} />
                          ) : (
                            <p className="text-gray-500 italic text-center py-12">
                              Start writing your content to see the preview...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : isExternalPost ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="externalUrl" className="text-sm font-medium text-gray-700">
                        External URL *
                      </Label>
                      <Input
                        id="externalUrl"
                        type="url"
                        placeholder="https://example.com/article"
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : editorMode === "rich" ? (
                  <RichTextEditor
                    value={htmlContent}
                    onChange={handleRichEditorChange}
                    placeholder="Start writing your post..."
                  />
                ) : (
                  <div>
                    <MarkdownToolbar onInsert={insertMarkdownText} />
                    <Textarea
                      ref={textareaRef}
                      placeholder="Start writing your post in Markdown...

# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- List item 1
- List item 2

[Link example](https://example.com)"
                      value={content}
                      onChange={(e) => handleMarkdownChange(e.target.value)}
                      className="min-h-[400px] font-mono text-sm border-0 focus-visible:ring-0 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write an excerpt (optional)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">
                  Excerpts are optional hand-crafted summaries of your content that can be used in your theme.
                </p>
              </div>
            </div>
          </div>

          {/* WordPress-style Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 space-y-4 overflow-y-auto max-h-screen">
            {/* Publish Panel */}
            <Card className="shadow-sm">
              <Collapsible open={isPublishPanelOpen} onOpenChange={setIsPublishPanelOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Publish
                      </CardTitle>
                      {isPublishPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-600">Status</Label>
                      <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-600">Visibility</Label>
                      <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="password">Password Protected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publishDate" className="text-xs font-medium text-gray-600">
                        Publish Date
                      </Label>
                      <Input
                        id="publishDate"
                        type="datetime-local"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-100 rounded text-xs">
                      <span className="text-gray-600">Post Type:</span>
                      <div className="flex items-center gap-1">
                        <Switch checked={isExternalPost} onCheckedChange={handlePostTypeChange} className="scale-75" />
                        <span className="text-gray-700">{isExternalPost ? "External" : "Regular"}</span>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Categories Panel */}
            <Card className="shadow-sm">
              <Collapsible open={isCategoriesPanelOpen} onOpenChange={setIsCategoriesPanelOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Categories
                      </CardTitle>
                      {isCategoriesPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-600">Select Categories</Label>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  addSelectedCategory(category.id);
                                } else {
                                  removeSelectedCategory(category.id);
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedCategories.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-600">Selected Categories</Label>
                        <div className="flex flex-wrap gap-1">
                          {selectedCategories.map((categoryId) => {
                            const category = categories.find(cat => cat.id === categoryId);
                            return category ? (
                              <Badge
                                key={categoryId}
                                variant="secondary"
                                className="text-xs cursor-pointer hover:bg-red-100 flex items-center gap-1"
                                onClick={() => removeSelectedCategory(categoryId)}
                              >
                                {category.name}
                                <X className="w-3 h-3" />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-600">Add New Category</Label>
                      <div className="flex gap-1">
                        <Input
                          placeholder="New category name"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addCategory()
                          }}
                          className="h-8 text-sm flex-1"
                        />
                        <Button
                          onClick={addCategory}
                          size="sm"
                          className="h-8 px-3"
                          variant="outline"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      {categoryError && (
                        <p className="text-xs text-red-500">{categoryError}</p>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Tags Panel */}
            <Card className="shadow-sm">
              <Collapsible open={isTagsPanelOpen} onOpenChange={setIsTagsPanelOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </CardTitle>
                      {isTagsPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    <div className="flex gap-1">
                      <Input
                        placeholder="Add new tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="h-8 text-sm flex-1"
                      />
                      <Button onClick={addTag} size="sm" className="h-8 px-3">
                        Add
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-red-100 flex items-center gap-1"
                            onClick={() => removeTag(tag)}
                          >
                            {tag}
                            <X className="w-3 h-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">Separate tags with commas</p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Featured Image Panel */}
            <Card className="shadow-sm">
              <Collapsible open={isFeaturedImagePanelOpen} onOpenChange={setIsFeaturedImagePanelOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Featured Image
                      </CardTitle>
                      {isFeaturedImagePanelOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Image URL"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-transparent">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      Set Featured Image
                    </Button>
                    {featuredImage && (
                      <div className="aspect-video bg-gray-100 rounded border overflow-hidden">
                        <img
                          src={featuredImage || "/placeholder.svg"}
                          alt="Featured"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* SEO Panel */}
            <Card className="shadow-sm">
              <Collapsible open={isSEOPanelOpen} onOpenChange={setIsSEOPanelOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        SEO
                        {seoAnalysis && (
                          <Badge
                            variant={
                              seoAnalysis.score >= 80
                                ? "default"
                                : seoAnalysis.score >= 60
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {seoAnalysis.score}/100
                          </Badge>
                        )}
                      </CardTitle>
                      {isSEOPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription" className="text-xs font-medium text-gray-600">
                        Meta Description
                      </Label>
                      <Textarea
                        id="metaDescription"
                        placeholder="Brief description for search engines..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500">{description.length}/160 characters</div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="focusKeyword" className="text-xs font-medium text-gray-600">
                        Focus Keyword
                      </Label>
                      <Input
                        id="focusKeyword"
                        placeholder="Main SEO keyword"
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>

                    {seoAnalysis && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">SEO Score</span>
                          <span className={cn("font-medium", getScoreColor(seoAnalysis.score))}>
                            {seoAnalysis.score}/100
                          </span>
                        </div>
                        <Progress value={seoAnalysis.score} className="h-1" />
                        <div className="space-y-1">
                          {Object.entries(seoAnalysis.checks)
                            .slice(0, 3)
                            .map(([key, check]) => (
                              <div key={key} className="flex items-center gap-2 text-xs">
                                {check.passed ? (
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                ) : check.score > 5 ? (
                                  <AlertCircle className="w-3 h-3 text-yellow-600" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-red-600" />
                                )}
                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Table of Contents Panel */}
            {content && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Table of Contents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TableOfContents content={content} />
                </CardContent>
              </Card>
            )}

            {/* Content Stats */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Content Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Words</span>
                  <span className="font-medium">{content.split(/\s+/).filter((w) => w.length > 0).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Characters</span>
                  <span className="font-medium">{content.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Reading Time</span>
                  <span className="font-medium">{readingTime} min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Tags</span>
                  <span className="font-medium">{tags.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
