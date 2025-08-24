import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { prisma } from "@/lib/prisma"

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const type = searchParams.get("type") ?? undefined

//     const categories = await db.category.findMany({
//       where: type ? { type } : {},
//       orderBy: {
//         name: "asc",
//       },
//     })

//     return NextResponse.json(categories)
//   } catch (error) {
//     console.error("Error fetching categories:", error)
//     return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
//   }
// }

export async function GET() {
  const categories = await prisma.category.findMany()
  return NextResponse.json({ success: true, categories })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, type } = body

    // Validate required field
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    // Check if category already exists (case-insensitive)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive'
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      )
    }

    // Create new category with optional fields
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        type: type || "uncategorized"
      }
    })

    return NextResponse.json(
      { success: true, category },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}


