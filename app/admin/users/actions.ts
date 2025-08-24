"use server"

import { revalidatePath } from "next/cache"
import { hash } from "bcrypt"
import { db } from "@/lib/db"

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
    return users
  } catch (error) {
    console.error("Failed to fetch users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function createUser(data: any) {
  try {
    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 10)

    // Create the user
    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "user",
      },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(id: string, data: any) {
  try {
    // Check if we're updating email and if it already exists for another user
    if (data.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: data.email,
          id: { not: id },
        },
      })

      if (existingUser) {
        return { success: false, error: "Another user with this email already exists" }
      }
    }

    // Prepare update data
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
    }

    // Only hash and update password if it's provided
    if (data.password) {
      updateData.password = await hash(data.password, 10)
    }

    // Update the user
    await db.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to update user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

