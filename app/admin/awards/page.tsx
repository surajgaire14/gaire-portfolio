import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function AwardsPage() {
  const awards = await db.award.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })


  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Awards</h1>
        <Link href="/admin/awards/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Award
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={awards} />
    </div>
  )
}

