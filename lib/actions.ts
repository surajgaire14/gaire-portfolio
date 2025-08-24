"use server"

import { put } from "@vercel/blob"
import { env } from "@/lib/env"
import fs from "fs"
import path from "path"
import { createSlug, savePostToMarkdown } from "./blog"
import { prisma } from "./prisma"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Generate a unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, error: "Failed to upload file" }
  }
}

// Instead of re-exporting, create wrapper functions
export async function createProjectWrapper(data: any) {
  try {
    const { createProject } = await import("@/app/admin/projects/actions")
    return await createProject(data)
  } catch (error) {
    console.error("Error in createProjectWrapper:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProjectWrapper(id: string, data: any) {
  try {
    const { updateProject } = await import("@/app/admin/projects/actions")
    return await updateProject(id, data)
  } catch (error) {
    console.error("Error in updateProjectWrapper:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProjectWrapper(id: string) {
  try {
    const { deleteProject } = await import("@/app/admin/projects/actions")
    return await deleteProject(id)
  } catch (error) {
    console.error("Error in deleteProjectWrapper:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

export async function createAwardWrapper(data: any) {
  try {
    const { createAward } = await import("@/app/admin/awards/actions")
    return await createAward(data)
  } catch (error) {
    console.error("Error in createAwardWrapper:", error)
    return { success: false, error: "Failed to create award" }
  }
}

export async function updateAwardWrapper(id: string, data: any) {
  try {
    const { updateAward } = await import("@/app/admin/awards/actions")
    return await updateAward(id, data)
  } catch (error) {
    console.error("Error in updateAwardWrapper:", error)
    return { success: false, error: "Failed to update award" }
  }
}

export async function deleteAwardWrapper(id: string) {
  try {
    const { deleteAward } = await import("@/app/admin/awards/actions")
    return await deleteAward(id)
  } catch (error) {
    console.error("Error in deleteAwardWrapper:", error)
    return { success: false, error: "Failed to delete award" }
  }
}

export async function createPostWrapper(data: any) {
  try {
    const { createPost } = await import("@/app/admin/blog/actions")
    return await createPost(data)
  } catch (error) {
    console.error("Error in createPostWrapper:", error)
    return { success: false, error: "Failed to create post" }
  }
}

export async function updatePostWrapper(id: string, data: any) {
  try {
    const { updatePost } = await import("@/app/admin/blog/actions")
    return await updatePost(id, data)
  } catch (error) {
    console.error("Error in updatePostWrapper:", error)
    return { success: false, error: "Failed to update post" }
  }
}

export async function deletePostWrapper(id: string) {
  try {
    const { deletePost } = await import("@/app/admin/blog/actions")
    return await deletePost(id)
  } catch (error) {
    console.error("Error in deletePostWrapper:", error)
    return { success: false, error: "Failed to delete post" }
  }
}




interface PublishPostData {
  title: string
  description: string
  content: string
  externalUrl?: string
  isExternal: boolean
  tags: string[]
  categories?: string[]
  focusKeyword?: string
  seoData?: any
}

export async function publishPost(data: PublishPostData) {
  try {
    const { title, description, content, externalUrl, isExternal, tags, categories, focusKeyword, seoData } = data
    const slug = createSlug(title)

    // Save to database
    const dbPost = await prisma.post.create({
      data: {
        slug,
        title,
        description,
        content,
        externalUrl: isExternal ? externalUrl : null,
        isExternal,
        tags,
        focusKeyword,
        seoData: seoData as any,
        published: true,
      },
    })

    // Also save to markdown file for serving
    await savePostToMarkdown({
      id: dbPost.id,
      slug: dbPost.slug,
      title: dbPost.title,
      description: dbPost.description || "",
      date: dbPost.createdAt.toISOString(),
      updatedAt: dbPost.updatedAt.toISOString(),
      tags: dbPost.tags,
      content: dbPost.content || "",
      externalUrl: dbPost.externalUrl || "",
      isExternal: dbPost.isExternal,
      published: dbPost.published,
      focusKeyword: dbPost.focusKeyword || "",
      seoData: (dbPost.seoData as any) || {},
    })

    return { success: true, slug }
  } catch (error) {
    console.error("Error publishing post:", error)
    return { success: false, error: "Failed to publish post" }
  }
}

// export async function deletePost(slug: string) {
//   try {
//     // Delete from database
//     await prisma.post.delete({
//       where: { slug },
//     })

//     // Also delete markdown file
//     const postsDirectory = path.join(process.cwd(), "content", "posts")
//     const filePath = path.join(postsDirectory, `${slug}.md`)

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath)
//     }

//     return { success: true }
//   } catch (error) {
//     console.error("Error deleting post:", error)
//     return { success: false, error: "Failed to delete post" }
//   }
// }

// export async function updatePost(slug: string, data: PublishPostData) {
//   try {
//     const { title, description, content, externalUrl, isExternal, tags, focusKeyword, seoData } = data
//     const newSlug = createSlug(title)

//     // Update in database
//     const dbPost = await prisma.post.update({
//       where: { slug },
//       data: {
//         slug: newSlug,
//         title,
//         description,
//         content,
//         externalUrl: isExternal ? externalUrl : null,
//         isExternal,
//         tags,
//         focusKeyword,
//         seoData: seoData as any,
//       },
//     })

//     // Update markdown file
//     await savePostToMarkdown({
//       id: dbPost.id,
//       slug: dbPost.slug,
//       title: dbPost.title,
//       description: dbPost.description || "",
//       date: dbPost.createdAt.toISOString(),
//       updatedAt: dbPost.updatedAt.toISOString(),
//       tags: dbPost.tags,
//       content: dbPost.content || "",
//       externalUrl: dbPost.externalUrl || "",
//       isExternal: dbPost.isExternal,
//       published: dbPost.published,
//       focusKeyword: dbPost.focusKeyword || "",
//       seoData: (dbPost.seoData as Component.SEOData) || {},
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("Error updating post:", error)
//     return { success: false, error: "Failed to update post" }
//   }
// }

export async function saveDraft(data: PublishPostData) {
  try {
    const { title, description, content, externalUrl, isExternal, tags, categories, focusKeyword, seoData } = data
    const slug = createSlug(title)

    // Save to database
    const dbPost = await prisma.post.create({
      data: {
        slug,
        title,
        description,
        content,
        externalUrl: isExternal ? externalUrl : null,
        isExternal,
        tags,
        focusKeyword,
        seoData: seoData as any,
        published: false,
      },
    })

    return { success: true, slug }
  } catch (error) {
    console.error("Error saving draft:", error)
    return { success: false, error: "Failed to save draft" }
  }
}

export async function deletePost(slug: string) {
  try {
    await requireAdmin()

    // Delete from database
    await prisma.post.delete({
      where: { slug },
    })

    // Also delete markdown file
    const postsDirectory = path.join(process.cwd(), "content", "posts")
    const filePath = path.join(postsDirectory, `${slug}.md`)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting post:", error)
    return { success: false, error: "Failed to delete post" }
  }
}

export async function updatePost(slug: string, data: PublishPostData) {
  try {
    await requireAdmin()

    const { title, description, content, externalUrl, isExternal, tags, focusKeyword, seoData } = data
    const newSlug = createSlug(title)

    // Update in database
    const dbPost = await prisma.post.update({
      where: { slug },
      data: {
        slug: newSlug,
        title,
        description,
        content,
        externalUrl: isExternal ? externalUrl : null,
        isExternal,
        tags,
        focusKeyword,
        seoData: seoData as any,
      },
    })

    // Update markdown file
    await savePostToMarkdown({
      id: dbPost.id,
      slug: dbPost.slug,
      title: dbPost.title,
      description: dbPost.description || "",
      date: dbPost.createdAt.toISOString(),
      updatedAt: dbPost.updatedAt.toISOString(),
      tags: dbPost.tags,
      content: dbPost.content || "",
      externalUrl: dbPost.externalUrl || "",
      isExternal: dbPost.isExternal,
      published: dbPost.published,
      focusKeyword: dbPost.focusKeyword || "",
      seoData: (dbPost.seoData as any) || {},
    })

    return { success: true, slug: dbPost.slug }
  } catch (error) {
    console.error("Error updating post:", error)
    return { success: false, error: "Failed to update post" }
  }
}

export async function getPostBySlugAction(slug: string) {
  try {
    const dbPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (!dbPost) {
      return null
    }

    return {
      id: dbPost.id,
      slug: dbPost.slug,
      title: dbPost.title,
      description: dbPost.description || "",
      date: dbPost.createdAt.toISOString(),
      updatedAt: dbPost.updatedAt.toISOString(),
      tags: dbPost.tags,
      content: dbPost.content || "",
      externalUrl: dbPost.externalUrl || "",
      isExternal: dbPost.isExternal,
      published: dbPost.published,
      focusKeyword: dbPost.focusKeyword || "",
      seoData: (dbPost.seoData as any) || {},
    }
  } catch (error) {
    console.error("Error getting post:", error)
    return null
  }
}

async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/signin")
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user.role !== "admin") {
    redirect("/signin")
  }
  return session
}

export async function getSession() {
  return await getServerSession(authOptions)
}


