"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, ImageIcon, X, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from "@/components/upload-button"
import { createAward, updateAward } from "./actions"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const awardSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  image: z.string().optional(),
  type: z.string().default("Additional")
})

type AwardFormValues = z.infer<typeof awardSchema>

interface AwardFormProps {
  award?: any
}

export function AwardForm({ award }: AwardFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const initialAdditionalImages = Array.isArray(award?.additionalImages) ? award.additionalImages : []

  const [allImages, setAllImages] = useState<string[]>(
    award?.image ? [award.image, ...initialAdditionalImages] : initialAdditionalImages,
  )

  const [mainImageIndex, setMainImageIndex] = useState<number>(award?.image ? 0 : -1)

  const defaultValues: Partial<AwardFormValues> = {
    title: award?.title || "",
    description: award?.description || "",
    image: award?.image || "",
    type: award?.type || "Additional",
  }

  const form = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues,
  })

  async function onSubmit(data: AwardFormValues) {
    setIsLoading(true)

    try {
      // Get the main image and additional images
      const mainImage = mainImageIndex >= 0 ? allImages[mainImageIndex] : undefined
      const additionalImages = allImages.filter((_, index) => index !== mainImageIndex)

      const submissionData = {
        ...data,
        image: [mainImage, ...additionalImages],
      }

      if (award) {
        await updateAward(award.id, submissionData)
        toast({
          title: "Success",
          description: "Award updated successfully.",
        })
      } else {
        await createAward(submissionData)
        toast({
          title: "Success",
          description: "Award created successfully.",
        })
      }

      router.push("/admin/awards")
      router.refresh()
    } catch (error) {
      console.error("Error saving award:", error)
      toast({
        title: "Error",
        description: "Failed to save award. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSingleImageUpload = (url: string) => {
    const newImages = [...allImages, url]
    setAllImages(newImages)

    // If no main image is set, make this the main image
    if (mainImageIndex === -1) {
      setMainImageIndex(newImages.length - 1)
      form.setValue("image", url)
    }

    toast({
      title: "Image uploaded",
      description: "Image has been uploaded successfully.",
    })
  }

  const handleMultipleImagesUpload = (urls: string[]) => {
    const newImages = [...allImages, ...urls]
    setAllImages(newImages)
    console.log(newImages)

    // If no main image is set, make the first uploaded image the main image
    if (mainImageIndex === -1 && urls.length > 0) {
      setMainImageIndex(allImages.length) // Index of the first new image
      // form.setValue("image", urls[0])
    }

    toast({
      title: "Images uploaded",
      description: `${urls.length} images have been uploaded successfully.`,
    })
  }

  const removeImage = (index: number) => {
    const newImages = allImages.filter((_, i) => i !== index)
    setAllImages(newImages)

    // Adjust main image index if needed
    if (index === mainImageIndex) {
      // If we removed the main image, set the first image as main or -1 if no images left
      const newMainIndex = newImages.length > 0 ? 0 : -1
      setMainImageIndex(newMainIndex)
      form.setValue("image", newMainIndex >= 0 ? newImages[newMainIndex] : "")
    } else if (index < mainImageIndex) {
      // If we removed an image before the main image, decrement the main image index
      setMainImageIndex(mainImageIndex - 1)
    }
  }

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index)
    form.setValue("image", allImages[index])
    toast({
      title: "Main image set",
      description: "The selected image has been set as the main image.",
    })
  }

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
                <Input placeholder="IFAWPCA GOLD MEDAL 2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Honored with the prestigious Gold Medal for Civil Engineering Construction..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Award Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Award type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Featured">Featured</SelectItem>
                  <SelectItem value="Additional">Additional</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Featured Awards appear on the homepage. Notable awards are highlighted in listings.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Award Images</h3>
            <p className="text-sm text-muted-foreground">
              Upload images to showcase the award. The main image will be used as the thumbnail.
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
                  className={`relative group border rounded-md overflow-hidden ${index === mainImageIndex ? "ring-2 ring-primary" : ""
                    }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Award image ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />

                  {/* Main image indicator */}
                  {index === mainImageIndex && (
                    <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs rounded-md">
                      Main Image
                    </div>
                  )}

                  {/* Image actions */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    {index !== mainImageIndex && (
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
            Upload one or more images. Select one image as the main image that will be displayed as the thumbnail.
          </FormDescription>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {award ? "Update Award" : "Create Award"}
        </Button>
      </form>
    </Form>
  )
}

