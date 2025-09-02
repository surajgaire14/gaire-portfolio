"use server"

import { db } from "@/lib/db"
import { hash, compare } from "bcrypt"
import { revalidatePath } from "next/cache"
import { saveMediaFile } from "@/lib/media-server"

// Helper function to process base64 image data
async function processImageUpload(imageData: string | null | undefined): Promise<string | null> {
  // If no image data or it's already a URL, return as is
  if (!imageData || imageData.startsWith("http")) {
    return imageData || null
  }

  // Check if it's a base64 image
  if (imageData.startsWith("data:image")) {
    try {
      // Extract the mime type and base64 data
      const matches = imageData.match(/^data:(.+);base64,(.+)$/)

      if (!matches || matches.length !== 3) {
        throw new Error("Invalid image data format")
      }

      const mimeType = matches[1]
      const base64Data = matches[2]
      const buffer = Buffer.from(base64Data, "base64")

      // Generate original filename
      const fileExtension = mimeType.split("/")[1] || "jpg"
      const originalName = `profile-image.${fileExtension}`

      // Save to local media directory
      const mediaFile = await saveMediaFile(buffer, originalName, mimeType)

      return mediaFile.url
    } catch (error) {
      console.error("Failed to process image:", error)
      throw new Error("Failed to process image upload")
    }
  }

  return imageData
}

export async function updateProfile(
  userId: string,
  data: { name?: string; email: string; profile_image: string },
) {
  try {
    // Process the image if it exists
    const imageUrl = await processImageUpload(data.profile_image)
    console.log("imageUrl", imageUrl)

    if (imageUrl) {
      // Update the user profile
      await db.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          email: data.email,
          profile_image: imageUrl,
        },
      })
    }

    revalidatePath("/admin/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update profile:", error)
    // throw new Error("Failed to update profile")
  }
}

export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    const isPasswordValid = await compare(currentPassword, user.password)
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect")
    }

    const hashedPassword = await hash(newPassword, 10)

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to update password:", error)
    throw error
  }
}
