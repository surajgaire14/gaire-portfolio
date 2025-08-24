"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function createCategory(data: any) {
  try {
    await db.category.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type || "uncategorized",
      },
    })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/projects")
    revalidatePath("/admin/blog")
    revalidatePath("/projects")
    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to create category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

export async function updateCategory(id: string, data: any) {
  try {
    await db.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type || "blog",
      },
    })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/projects")
    revalidatePath("/admin/blog")
    revalidatePath("/projects")
    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to update category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if there are any projects or posts using this category
    const projectCount = await db.project.count({
      where: { categoryId: id },
    })

    const postCount = await db.post.count({
      where: { categoryId: id },
    })

    if (projectCount > 0 || postCount > 0) {
      return {
        success: false,
        error: "Cannot delete category that is in use. Reassign items first.",
      }
    }

    await db.category.delete({
      where: { id },
    })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/projects")
    revalidatePath("/admin/blog")
    revalidatePath("/projects")
    revalidatePath("/blog")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

