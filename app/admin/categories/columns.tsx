"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteCategory } from "./actions"
import { toast } from "react-toastify"

export type Category = {
  id: string
  name: string
  description: string | null
  _count: {
    projects: number
  }
  createdAt: Date
}

// Extracted Actions Component
const CategoryActions = ({ category }: { category: Category }) => {

  const handleDelete = async () => {
    const result = await deleteCategory(category.id)
    if (result.success) {
      toast.success(`${category.name} has been successfully deleted.`)
    } else {
      toast.error(result.error || "Failed to delete category. Please try again.")
    }

  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/admin/categories/${category.id}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={handleDelete}
          disabled={category._count.projects > 0}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
          {category._count.projects > 0 && " (Has Projects)"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null
      return <div>{description || "-"}</div>
    },
  },
  {
    accessorKey: "_count.projects",
    header: "Projects",
    cell: ({ row }) => {
      const count = row.original._count.projects
      return <div>{count}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoryActions category={row.original} />,
  },
]
