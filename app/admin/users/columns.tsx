"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash, Shield, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteUser } from "./actions"
import { toast } from "react-toastify"

export type UserData = {
  id: string
  name: string | null
  email: string
  role: string | null
  createdAt: Date | null
}

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string | null
      return <div>{name || "N/A"}</div>
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string | null
      return (
        <Badge variant={role === "admin" ? "default" : "outline"}>
          {role === "admin" ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
          {role || "user"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date | null
      return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      const handleDelete = async () => {
        // if (confirm(`Are you sure you want to delete the user "${user.email}"?`)) {
        try {
          const result = await deleteUser(user.id)

          if (result.success) {
            toast.success(
              `${user.email} has been successfully deleted.`,
            )
          } else {
            toast.error(
              "Failed to delete user. Please try again.",
            )
          }
        } catch (error) {
          toast.error(
            "Failed to delete user. Please try again.",
          )
          console.error("Error deleting user:", error)
        }
        // }
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
              <Link href={`/admin/users/${user.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

