import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { LeadershipForm  } from "../leadership-form"

interface LeadershipPageProps {
  params: {
    id: string
  }
}

export default async function LeadershipPage({ params }: LeadershipPageProps) {
  const { id } = await params
  const leadership = await db.leadership.findUnique({
    where: {
      id: id,
    },
  })

  if (!leadership) {
    notFound()
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Edit Team Member</h1>
      <LeadershipForm leadership={leadership} />
    </div>
  )
}

