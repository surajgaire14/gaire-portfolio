"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function createAward(data: any) {
  try {
    await db.award.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        type: data.type,
      },
    })

    revalidatePath("/admin/awards")
    revalidatePath("/awards")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to create award:", error)
    return { success: false, error: "Failed to create award" }
  }
}

export async function updateAward(id: string, data: any) {
  try {
    await db.award.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        type: data.type,
      },
    })

    revalidatePath("/admin/awards")
    revalidatePath("/awards")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to update award:", error)
    return { success: false, error: "Failed to update award" }
  }
}

export async function deleteAward(id: string) {
  try {
    await db.award.delete({
      where: { id },
    })

    revalidatePath("/admin/awards")
    revalidatePath("/awards")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete award:", error)
    return { success: false, error: "Failed to delete award" }
  }
}

