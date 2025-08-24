import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { CategoryForm } from "../category-form"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  )
}

