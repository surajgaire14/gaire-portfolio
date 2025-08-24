import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUsers } from "./actions"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  )
}

