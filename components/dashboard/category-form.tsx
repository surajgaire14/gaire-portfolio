"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createCategory, updateCategory } from "@/lib/category-actions"
import { toast } from "sonner"
import { Loader2, FileText, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
    isActive: boolean
  }
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    isActive: category?.isActive ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required"
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required"
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens"
    }



    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    startTransition(async () => {
      try {
        if (category) {
          await updateCategory(category.id, formData)
          toast.success("Category updated successfully!")
        } else {
          await createCategory(formData)
          toast.success("Category created successfully!")
        }
        router.push("/dashboard/categories")
        router.refresh()
      } catch (error) {
        toast.error(category ? "Failed to update category" : "Failed to create category")
        console.error(error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#000]">
            <FileText className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription className="text-muted-foreground text-gray-900">Essential details for your category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground text-gray-900">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Technology"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-muted-foreground text-gray-900">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="technology"
                className={errors.slug ? "border-red-500" : ""}
              />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
              <p className="text-xs text-muted-foreground">URL: /category/{formData.slug || "your-slug"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground text-gray-900">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this category..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#000]">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription className="text-muted-foreground text-gray-900">Customize how your category looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-gray-900">Category Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? "border-gray-900" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge style={{ backgroundColor: formData.color, color: "white" }}>
                {formData.name || "Category Name"}
              </Badge>
              <span className="text-sm text-muted-foreground">Preview</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-gray-900">Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`p-2 border rounded ${
                    formData.icon === icon ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* SEO Settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#000]">
            <Hash className="w-5 h-5" />
            SEO Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground text-gray-900">Optimize your category for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle" className="text-muted-foreground text-gray-900">SEO Title</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
              placeholder="Optimized title for search engines"
              className={errors.seoTitle ? "border-red-500" : ""}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{errors.seoTitle || "Recommended: 50-60 characters"}</span>
              <span>{formData.seoTitle.length}/60</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription" className="text-muted-foreground text-gray-900">SEO Description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
              placeholder="Brief description for search engine results"
              rows={3}
              className={errors.seoDescription ? "border-red-500" : ""}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{errors.seoDescription || "Recommended: 150-160 characters"}</span>
              <span>{formData.seoDescription.length}/160</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#000]">
            <Settings className="w-5 h-5" />
            Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground text-gray-900">Configure category behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-muted-foreground text-gray-900">Active Status</Label>
              <p className="text-sm text-muted-foreground">Inactive categories won't be shown on the public site</p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 data-[state=checked]:border-primary data-[state=unchecked]:border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isPending} className="bg-primary text-white hover:bg-primary/90">
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {category ? "Update Category" : "Create Category"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/categories")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
