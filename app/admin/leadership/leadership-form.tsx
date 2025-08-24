"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UploadButton } from "@/components/upload-button"
import { createLeadership, updateLeadership } from "./actions"
import { useToast } from "@/components/ui/use-toast"

const leadershipSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
})

type LeadershipFormValues = z.infer<typeof leadershipSchema>

interface LeadershipFormProps {
  leadership?: any
}

export function LeadershipForm({ leadership }: LeadershipFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(leadership?.image || null)
  const { toast } = useToast()

  const defaultValues: Partial<LeadershipFormValues> = {
    name: leadership?.name || "",
    position: leadership?.position || "",
    bio: leadership?.bio || "",
    image: leadership?.image || "",
    order: leadership?.order || 0,
  }

  const form = useForm<LeadershipFormValues>({
    resolver: zodResolver(leadershipSchema),
    defaultValues,
  })

  async function onSubmit(data: LeadershipFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const result = leadership ? await updateLeadership(leadership.id, data) : await createLeadership(data)

      if (!result.success) {
        setError(result.error || "Failed to save leadership")
        return
      }

      toast({
        title: "Success",
        description: leadership ? "Leadership updated successfully." : "Leadership created successfully.",
      })

      router.push("/admin/leadership")
      router.refresh()
    } catch (error) {
      console.error("Error saving leadership:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (url: string) => {
    form.setValue("image", url)
    setPreviewImage(url)
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully.",
    })
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Chief Executive Officer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="With over 30 years of experience in the construction industry..."
                  className="min-h-32"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>A brief biography of the team member</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <div className="space-y-4">
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input placeholder="/leadership/john-smith.jpg" {...field} />
                    <UploadButton onUploadComplete={handleImageUpload} />
                  </div>
                </FormControl>

                {previewImage && (
                  <div className="border rounded-md overflow-hidden w-full max-w-md">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {!previewImage && (
                  <div className="border rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground w-full max-w-md">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <p>No image selected</p>
                  </div>
                )}

                <FormDescription>Enter an image URL or upload an image</FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {leadership ? "Update Leadership" : "Create Leadership"}
        </Button>
      </form>
    </Form>
  )
}

