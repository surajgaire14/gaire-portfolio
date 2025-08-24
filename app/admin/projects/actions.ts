"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function createProject(data: any) {
  try {
    console.log(data)
    if (!data.categoryId) {
      return {
        success: false,
        error: "Category is required. Please select a category for this project.",
      }
    }

    // Ensure slug is unique
    if (data.slug) {
      const existingProject = await db.project.findUnique({
        where: { slug: data.slug },
      })

      if (existingProject) {
        return {
          success: false,
          error: "A project with this slug already exists. Please use a different title or modify the slug.",
        }
      }
    }

    await db.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description,
        image: data.image,
        type: data.type || "notable",
        details: data.details || {},
      },
    })

    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProject(id: string, data: any) {
  try {
    // Ensure categoryId is not undefined or empty
    if (!data.categoryId) {
      return {
        success: false,
        error: "Category is required. Please select a category for this project.",
      }
    }

    // Check if slug is being changed and ensure it's unique
    if (data.slug) {
      const existingProject = await db.project.findUnique({
        where: { slug: data.slug },
      })

      if (existingProject && existingProject.id !== id) {
        return {
          success: false,
          error: "A project with this slug already exists. Please use a different title or modify the slug.",
        }
      }
    }

    await db.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description,
        image: data.image,
        type: data.type || "regular",
        details: data.details || {},
      },
    })

    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to update project:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(id: string) {
  try {
    await db.project.delete({
      where: { id },
    })

    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

