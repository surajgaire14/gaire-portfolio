"use server"

import { put } from "@vercel/blob"
import { env } from "./env"

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    if (file.size > 1048576) {
      return { success: false, error: "File size exceeds 1MB limit" }
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`

    const blob = await put(filename, file, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
    })

    return { success: true, url: blob.url }
  } catch (error) {
    return { success: false, error: "Failed to upload file" }
  }
}

