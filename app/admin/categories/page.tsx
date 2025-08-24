import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          projects: true,
        },
      },
    },
  })

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={categories} />
    </div>
  )
}

