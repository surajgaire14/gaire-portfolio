import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLeadership } from "./actions"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { db } from "@/lib/db"

export default async function LeadershipPage() {
    const leadership = await getLeadership()
    return (
        <div className="container mx-auto py-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Leadership Team</h1>
                <Link href="/admin/leadership/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Team Member
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={leadership} />
        </div>
    )
}

