"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, ImageIcon, X, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProjectWrapper, updateProjectWrapper } from "@/lib/actions"
import { UploadButton } from "@/components/upload-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RichTextEditor } from "@/components/rich-text-editor"
import { toast } from "react-toastify"
import { generateSlug } from "@/utils"

type Category = {
  id: string
  name: string
}

// Update the projectSchema to include slug
const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  slug: z.string().optional(),
  categoryId: z.string().min(1, {
    message: "Category is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  image: z.string().optional(),
  type: z.string().default("notable"),
  estimatedCost: z.string().optional(),
  estimatedTime: z.string().optional(),
  clientNeed: z.string().optional(),
  solution: z.string().optional(),
  projectLink: z.string().optional(),
  demoUrl: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
  project?: any
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const parseImages = (imageField: string | null | undefined): string[] => {
    if (!imageField) return []
    try {
      const parsed = JSON.parse(imageField)
      return Array.isArray(parsed) ? parsed : [imageField]
    } catch (e) {
      return [imageField]
    }
  }

  const [allImages, setAllImages] = useState<string[]>(parseImages(project?.image))
  const [mainImageIndex, setMainImageIndex] = useState<number>(allImages.length > 0 ? 0 : -1)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        toast.error("Failed to load categories. Please refresh the page.")
      }
    }

    fetchCategories()
  }, [])

  // Update the defaultValues to include slug
  const defaultValues: Partial<ProjectFormValues> = {
    title: project?.title || "",
    slug: project?.slug || "",
    categoryId: project?.categoryId || "",
    description: project?.description || "",
    image: project?.image || "",
    type: project?.type || "notable",
    // client: project?.details?.client || "",
    estimatedCost: project?.details?.estimatedCost || "",
    estimatedTime: project?.details?.estimatedTime || "",
    clientNeed: project?.details?.clientNeed || "",
    solution: project?.details?.solution || "",
    projectLink: project?.details?.projectLink || "",
    demoUrl: project?.details?.demoUrl || "",
    difficulty: project?.difficulty || "beginner",
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  })

  // Add a watch for the title field to auto-generate slug
  // Add this inside the ProjectForm component, after form initialization but before onSubmit
  const watchTitle = form.watch("title")

  // Add useEffect to update slug when title changes
  useEffect(() => {
    // Only auto-generate slug if it's a new project or if slug is empty
    if (!project?.slug || !form.getValues("slug")) {
      const slug = generateSlug(watchTitle || "")
      form.setValue("slug", slug)
    }
  }, [watchTitle, form, project?.slug])

  async function onSubmit(data: ProjectFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const imageValue = allImages.length > 0 ? JSON.stringify(allImages) : null

      const formData = {
        ...data,
        image: imageValue,
        details: {
          estimatedCost: data.estimatedCost,
          estimatedTime: data.estimatedTime,
          clientNeed: data.clientNeed,
          solution: data.solution,
          projectLink: data.projectLink,
          demoUrl: data.demoUrl,
          difficulty: data.difficulty,
        },
      }

      const result = project ? await updateProjectWrapper(project.id, formData) : await createProjectWrapper(formData)

      if (!result.success) {
        setError(result.error || "Failed to save project")
        return
      }

      toast.success(project ? "Project updated successfully." : "Project created successfully.")

      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      console.error("Error saving project:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSingleImageUpload = (url: string, fileSize?: number) => {
    if (fileSize && fileSize > 1048576) {
      toast("Image size exceeds 1MB limit. Please upload a smaller image.")
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
      toast(`${oversizedCount} image(s) exceeded the 1MB size limit and were not added.`)

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

  return (
    <Form {...form}>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Tanahu Hydropower Project: 140 MW" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add a slug field to the form
        Add this after the title field in the form */}
        {/* <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="tanahu-hydropower-project-140-mw" {...field} />
              </FormControl>
              <FormDescription>
                URL-friendly version of the title. This is auto-generated but can be edited.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormDescription>Category is required.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="notable">Notable</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Featured projects appear on the homepage. Notable projects are highlighted in listings.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* client need */}
        <FormField
          control={form.control}
          name="clientNeed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Need</FormLabel>
              <FormControl>
              <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="A short description of the client's need for the project..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* solution */}
        <FormField
          control={form.control}
          name="solution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solution</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="A short description of the solution for the client's need..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="A storage-based project situated on the Seti River's right bank..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* demo url  */}
        <FormField
          control={form.control}
          name="demoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Demo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.google.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* project link */}
        <FormField
          control={form.control}
          name="projectLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Link</FormLabel>
              <FormControl>
                <Input placeholder="https://www.google.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Images Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Project Images</h3>
            <p className="text-sm text-muted-foreground">
              Upload images to showcase the project. The first image will be used as the main thumbnail.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* <UploadButton onUploadComplete={handleSingleImageUpload} variant="secondary">
              Upload Image
            </UploadButton> */}

            <UploadButton
              onUploadComplete={handleSingleImageUpload}
              onMultipleUploadsComplete={handleMultipleImagesUpload}
              multiple={true}
              variant="outline"
            >
              Upload Multiple
            </UploadButton>
          </div>

          {/* Gallery Preview */}
          {allImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {allImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative group border rounded-md overflow-hidden ${
                    index === 0 ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Project image ${index + 1}`}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input placeholder="Tanahu Hydropower Limited (THL)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="estimatedCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Cost</FormLabel>
                <FormControl>
                  <Input placeholder="USD 179 Million" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Time</FormLabel>
                <FormControl>
                  <Input placeholder="In Progress (Started August 2023)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {project ? "Update Project" : "Create Project"}
        </Button>
      </form>
    </Form>
  )
}

