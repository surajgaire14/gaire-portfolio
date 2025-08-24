import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { AwardForm } from "../award-form"

interface AwardPageProps {
  params: {
    id: string
  }
}

export default async function AwardPage({ params }: AwardPageProps) {
  const award = await db.award.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!award) {
    notFound()
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Edit Award</h1>
      <AwardForm award={award} />
    </div>
  )
}

