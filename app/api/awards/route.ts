import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const awards = await db.award.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(awards)
  } catch (error) {
    console.error("Error fetching awards:", error)
    return NextResponse.json({ error: "Failed to fetch awards" }, { status: 500 })
  }
}

