"use server"

import { hash } from "bcrypt"
import { db } from "@/lib/db"

export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      }
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 10)

    // Create the user
    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user", // Default role
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error: "Failed to register user. Please try again.",
    }
  }
}

