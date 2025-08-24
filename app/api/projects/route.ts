import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: {
        title: "asc",
      },
      
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

