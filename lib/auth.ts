import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

// A helper to get the user session on the server
export async function getSession() {
  return await getServerSession(authOptions)
}

// Protect routes that require authentication
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

// Protect routes that require admin role
export async function requireAdmin() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "admin") {
    redirect("/")
  }

  return session
}

