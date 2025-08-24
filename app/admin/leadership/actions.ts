"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function getLeadership() {
  try {
    const leadership = await db.leadership.findMany({
      orderBy: {
        order: "asc",
      },
    })
    return leadership
  } catch (error) {
    console.error("Failed to fetch leadership:", error)
    throw new Error("Failed to fetch leadership")
  }
}

export async function createLeadership(data: any) {
  try {
    // Get the highest order value
    const highestOrder = await db.leadership.findFirst({
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    })

    // Create the leadership entry with the next order value
    await db.leadership.create({
      data: {
        name: data.name,
        position: data.position,
        bio: data.bio,
        image: data.image,
        order: highestOrder ? highestOrder.order + 1 : 0,
      },
    })

    revalidatePath("/admin/leadership")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create leadership:", error)
    return { success: false, error: "Failed to create leadership" }
  }
}

export async function updateLeadership(id: string, data: any) {
  try {
    await db.leadership.update({
      where: { id },
      data: {
        name: data.name,
        position: data.position,
        bio: data.bio,
        image: data.image,
        order: data.order,
      },
    })

    revalidatePath("/admin/leadership")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update leadership:", error)
    return { success: false, error: "Failed to update leadership" }
  }
}

export async function deleteLeadership(id: string) {
  try {
    await db.leadership.delete({
      where: { id },
    })

    revalidatePath("/admin/leadership")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete leadership:", error)
    return { success: false, error: "Failed to delete leadership" }
  }
}

export async function updateLeadershipOrder(items: { id: string; order: number }[]) {
  try {
    // Create a transaction to update all items at once
    const updates = items.map((item) =>
      db.leadership.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    )

    await db.$transaction(updates)

    revalidatePath("/admin/leadership")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to update leadership order:", error)
    return { success: false, error: "Failed to update leadership order" }
  }
}

