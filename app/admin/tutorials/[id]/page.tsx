"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"

interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: string
  duration: string
  image: string
  featured: boolean
  category: string
  tags: string[]
  authorId: string
  author: {
    id: string
    name: string
    avatar: string
  }
}

export default function EditTutorialPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    duration: "",
    image: "",
    featured: false,
    category: "",
    tags: [] as string[],
    authorId: "",
  })
  const [newTag, setNewTag] = useState("")

  const [authors, setAuthors] = useState<Array<{ id: string; name: string; avatar: string }>>([])

  // Fetch authors on component mount
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/api/authors')
        const result = await response.json()
        
        if (result.success) {
          setAuthors(result.data)
        } else {
          console.error('Failed to fetch authors:', result.message)
        }
      } catch (error) {
        console.error('Error fetching authors:', error)
      }
    }

    fetchAuthors()
  }, [])

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const response = await fetch(`/api/tutorials/${params.id}`)
        const result = await response.json()

        if (result.success) {
          setTutorial(result.data)
          setFormData({
            title: result.data.title,
            description: result.data.description,
            difficulty: result.data.difficulty,
            duration: result.data.duration,
            image: result.data.image,
            featured: result.data.featured,
            category: result.data.category,
            tags: result.data.tags,
            authorId: result.data.authorId,
          })
        } else {
          toast.error('Failed to load tutorial')
          router.push('/admin/tutorials')
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error)
        toast.error('Failed to load tutorial')
        router.push('/admin/tutorials')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTutorial()
  }, [params.id, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/tutorials/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Tutorial updated successfully!')
        router.push('/admin/tutorials')
      } else {
        toast.error(result.message || 'Failed to update tutorial')
        if (result.errors) {
          result.errors.forEach((error: any) => {
            toast.error(`${error.path.join('.')}: ${error.message}`)
          })
        }
      }
    } catch (error) {
      console.error('Error updating tutorial:', error)
      toast.error('Failed to update tutorial')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading tutorial...</span>
        </div>
      </div>
    )
  }

  if (!tutorial) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Tutorial not found</h2>
          <p className="text-muted-foreground">The tutorial you're looking for doesn't exist.</p>
          <Link href="/admin/tutorials">
            <Button className="mt-4">Back to Tutorials</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/tutorials">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tutorials
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Edit Tutorial</h1>
          <p className="text-muted-foreground text-gray-900">Update tutorial information and settings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the tutorial.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter tutorial title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter tutorial description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., JavaScript, React, Python"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Details */}
          <Card>
            <CardHeader>
              <CardTitle>Tutorial Details</CardTitle>
              <CardDescription>Technical specifications and metadata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 2 hours, 30 minutes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Select value={formData.authorId} onValueChange={(value) => handleInputChange('authorId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add relevant tags to help users find this tutorial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure tutorial visibility and features.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Featured Tutorial</Label>
                <p className="text-sm text-muted-foreground">
                  Feature this tutorial on the homepage and in featured sections.
                </p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/tutorials">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Tutorial'}
          </Button>
        </div>
      </form>
    </div>
  )
} 