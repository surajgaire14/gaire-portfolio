import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { prisma } from "@/lib/prisma"

const postsDirectory = path.join(process.cwd(), "content", "posts")

// Ensure the posts directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true })
}

export async function getAllPosts(): Promise<any[]> {
  try {
    // Get published posts from database
    const dbPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    })

    // Convert database posts to BlogPost format
    const posts: any[] = dbPosts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description || "",
      date: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      tags: post.tags,
      content: post.content || "",
      externalUrl: post.externalUrl || "",
      isExternal: post.isExternal,
      published: post.published,
      focusKeyword: post.focusKeyword || "",
      seoData: (post.seoData as any) || {},
    }))

    return posts
  } catch (error) {
    console.error("Error reading posts from database:", error)
    // Fallback to file system if database fails
    return getPostsFromFileSystem()
  }
}

async function getPostsFromFileSystem(): Promise<any[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((name) => {
        const fullPath = path.join(postsDirectory, name)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const { data, content } = matter(fileContents)

        return {
          id: name.replace(/\.md$/, ""),
          slug: name.replace(/\.md$/, ""),
          title: data.title || "Untitled",
          description: data.description || "",
          date: data.date || new Date().toISOString(),
          tags: data.tags || [],
          content,
          externalUrl: data.externalUrl || "",
          isExternal: data.isExternal || false,
          published: true,
          focusKeyword: data.focusKeyword || "",
          seoData: data.seoData || {},
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
  } catch (error) {
    console.error("Error reading posts from file system:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<any | null> {
  try {
    // First try to get from database
    const dbPost = await prisma.post.findUnique({
      where: { slug, published: true },
    })

    if (dbPost) {
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
    }

    // Fallback to file system
    return getPostFromFileSystem(slug)
  } catch (error) {
    console.error("Error reading post from database:", error)
    return getPostFromFileSystem(slug)
  }
}

async function getPostFromFileSystem(slug: string): Promise<any | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      id: slug,
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      content,
      externalUrl: data.externalUrl || "",
      isExternal: data.isExternal || false,
      published: true,
      focusKeyword: data.focusKeyword || "",
      seoData: data.seoData || {},
    }
  } catch (error) {
    console.error("Error reading post from file system:", error)
    return null
  }
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getAllPosts()
    const allTags = posts.flatMap((post) => post.tags)
    const uniqueTags = [...new Set(allTags)].sort()
    return uniqueTags
  } catch (error) {
    console.error("Error getting tags:", error)
    return []
  }
}

// Helper function to save post to markdown file
export async function savePostToMarkdown(post: any): Promise<void> {
  try {
    const frontmatter = `---
title: "${post.title}"
description: "${post.description}"
date: "${post.date}"
tags: [${post.tags.map((tag: string) => `"${tag}"`).join(", ")}]
isExternal: ${post.isExternal}${
      post.isExternal && post.externalUrl
        ? `
externalUrl: "${post.externalUrl}"`
        : ""
    }${
      post.focusKeyword
        ? `
focusKeyword: "${post.focusKeyword}"`
        : ""
    }${
      post.seoData && Object.keys(post.seoData).length > 0
        ? `
seoData: ${JSON.stringify(post.seoData, null, 2)}`
        : ""
    }
---

${post.content}`

    const filePath = path.join(postsDirectory, `${post.slug}.md`)
    fs.writeFileSync(filePath, frontmatter, "utf8")
  } catch (error) {
    console.error("Error saving post to markdown file:", error)
  }
}
