import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const feedbacks = await db.feedback.findMany()
    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    console.log(req);
    const { firstName, lastName, email, phone, subject, message } = await req.json()

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const feedback = await db.feedback.create({
      data: { firstName, lastName, email, phone, subject, message },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("POST error:", error)
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const updatedFeedback = await db.feedback.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedFeedback)
  } catch (error) {
    console.error("PATCH error:", error)
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await db.feedback.delete({ where: { id } })
    return NextResponse.json({ message: "Feedback deleted" })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 })
  }
}

