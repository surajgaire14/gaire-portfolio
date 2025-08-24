"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, ImageIcon, X, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createPost } from "./actions"
import { updatePost as updatePostLib } from "@/lib/actions"
import { UploadButton } from "@/components/upload-button"
import { RichTextEditor } from "@/components/rich-text-editor"
import { toast } from "react-toastify"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

// Update the postSchema to include the featured field
const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  type: z.string().default("blog"),
  categories: z.array(z.string()).optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false), // Add featured field to schema
  slug: z.string().optional(),
  isExternal: z.boolean().default(false),
  externalUrl: z.string().optional(),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostFormProps {
  post?: any
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const parseImages = (imageField: string | null | undefined): string[] => {
    if (!imageField) return []
    try {
      const parsed = JSON.parse(imageField)
      return Array.isArray(parsed) ? parsed : [imageField]
    } catch (e) {
      return imageField ? [imageField] : []
    }
  }
  const [allImages, setAllImages] = useState<string[]>(parseImages(post?.image))
  const [mainImageIndex, setMainImageIndex] = useState<number>(allImages.length > 0 ? 0 : -1)
  const [categories, setCategories] = useState<any[]>([])

  console.log("post", post)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories?type=blog")
        console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories. Please refresh the page.")
      }
    }

    fetchCategories()
  }, [])

  // Update the defaultValues to include the featured field
  const defaultValues: Partial<PostFormValues> = {
    title: post?.title || "",
    description: post?.description || "",
    content: post?.content || "",
    image: post?.image || "",
    type: post?.type || "blog",
    categories: post?.categories || [],
    published: post?.published || false,
    featured: post?.featured || false, // Add featured to defaultValues
    isExternal: post?.isExternal || false,
    externalUrl: post?.externalUrl || "",
  }

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues,
  })

  const title = form.watch("title")
  const slug = form.watch("slug")
  const isExternal = form.watch("isExternal")

  useEffect(() => {
    if (title && !slug && !post) {
      form.setValue("slug", slugify(title))
    }
  }, [title, post, slug, form])

  const handleSingleImageUpload = (url: string, fileSize?: number) => {
    if (fileSize && fileSize > 1048576) {
      toast.error("Image size exceeds 1MB limit. Please upload a smaller image.")
      return
    }

    const newImages = [...allImages, url]
    setAllImages(newImages)

    if (mainImageIndex === -1) {
      setMainImageIndex(newImages.length - 1)
    }

    form.setValue("image", JSON.stringify(newImages))

    toast.success("Image has been uploaded successfully.")
  }

  const handleMultipleImagesUpload = (urls: string[], fileSizes?: number[]) => {
    let validUrls = urls
    let oversizedCount = 0

    if (fileSizes && fileSizes.length === urls.length) {
      const validPairs = urls.filter((_, index) => {
        if (fileSizes[index] > 1048576) {
          oversizedCount++
          return false
        }
        return true
      })
      validUrls = validPairs
    }

    if (oversizedCount > 0) {
      toast.warning(`${oversizedCount} image(s) exceeded the 1MB size limit and were not added.`)

      if (validUrls.length === 0) return
    }

    const newImages = [...allImages, ...validUrls]
    setAllImages(newImages)

    // If no main image is set, make the first uploaded image the main image
    if (mainImageIndex === -1 && validUrls.length > 0) {
      setMainImageIndex(allImages.length) // Index of the first new image
    }

    // Update the form value with the JSON string of all images
    form.setValue("image", JSON.stringify(newImages))

    toast.success(`${validUrls.length} images have been uploaded successfully.`)
  }

  const removeImage = (index: number) => {
    const newImages = allImages.filter((_, i) => i !== index)
    setAllImages(newImages)

    // Adjust main image index if needed
    if (index === mainImageIndex) {
      // If we removed the main image, set the first image as main or -1 if no images left
      const newMainIndex = newImages.length > 0 ? 0 : -1
      setMainImageIndex(newMainIndex)
    } else if (index < mainImageIndex) {
      // If we removed an image before the main image, decrement the main image index
      setMainImageIndex(mainImageIndex - 1)
    }

    // Update the form value with the JSON string of all images
    form.setValue("image", newImages.length > 0 ? JSON.stringify(newImages) : "")

    toast("The image has been removed.")
  }

  const setAsMainImage = (index: number) => {
    // For this approach, we'll just reorder the array to put the main image first
    const newImages = [...allImages]
    const mainImage = newImages.splice(index, 1)[0]
    newImages.unshift(mainImage)

    setAllImages(newImages)
    setMainImageIndex(0)

    form.setValue("image", JSON.stringify(newImages))

    toast("The selected image has been set as the main image.")
  }

  async function onSubmit(data: PostFormValues) {
    setIsLoading(true)

    try {
      // Ensure image is properly formatted as JSON string if there are images
      const imageValue = allImages.length > 0 ? JSON.stringify(allImages) : null
      const formData = {
        ...data,
        image: imageValue,
      }

      if (post) {
        await updatePostLib(post.slug, {
          title: formData.title || "",
          description: formData.description || "",
          content: formData.content || "",
          externalUrl: formData.isExternal ? (formData.externalUrl || "") : "",
          isExternal: !!formData.isExternal,
          tags: [],
        })
        toast.success("Post updated successfully.")
      } else {
        const result = await createPost(formData)
        console.log(result)
        if (result.success) {
          toast.success("Post created successfully.")
        } else {
          toast.error("Failed to create post")
        }
      }

      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error("Error saving post:", error)
      toast.error("Failed to save post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const mappedCategories = [
    { label: "Uncategorized", value: "none" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="New Construction Project Announced" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="notice">Notice</SelectItem>
                  </SelectContent>
                </Select>
                {/* <MultiSelect options={mappedCategories} onValueChange={field.onChange} placeholder="Select Post Type" /> */}
                <FormDescription>
                  Blog posts appear in the blog section. Notices are for important announcements.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <MultiSelect
                  options={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  value={field.value || []}
                  onValueChange={field.onChange}
                  placeholder="Select Categories"
                />
                <FormDescription>Choose categories for this post</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief summary of the post..." className="min-h-20" {...field} />
              </FormControl>
              <FormDescription>A short summary that appears on blog listing pages</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="isExternal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>External Post</FormLabel>
                  <FormDescription>Link to an external article instead of hosting content</FormDescription>
                </div>
              </FormItem>
            )}
          />

          {isExternal && (
            <FormField
              control={form.control}
              name="externalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/article" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Full content of the blog post..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Images</FormLabel>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <UploadButton
                    onUploadComplete={handleSingleImageUpload}
                    onMultipleUploadsComplete={handleMultipleImagesUpload}
                    multiple={true}
                    variant="outline"
                  >
                    Upload Images
                  </UploadButton>
                </div>

                {/* Gallery Preview */}
                {allImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {allImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative group border rounded-md overflow-hidden ${index === 0 ? "ring-2 ring-primary" : ""
                          }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />

                        {/* Main image indicator */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs rounded-md">
                            Main Image
                          </div>
                        )}

                        {/* Image actions */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsMainImage(index)}
                              className="text-xs flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" /> Set as Main
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-xs flex items-center gap-1 text-red-400 ml-auto"
                          >
                            <X className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <p>No images added</p>
                  </div>
                )}

                <FormDescription>
                  Upload one or more images (max 1MB per image). The first image will be used as the main thumbnail.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Published</FormLabel>
                <FormDescription>This post will be visible to the public</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured</FormLabel>
                <FormDescription>Featured posts will be highlighted on the homepage and listings</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {post ? "Update Post" : "Create Post"}
        </Button>
      </form>
    </Form>
  )
}

