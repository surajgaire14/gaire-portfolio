"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Star, Trash } from "lucide-react"
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
import { deleteAward } from "./actions"
import { toast } from "react-toastify"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export type Award = {
  id: string
  title: string
  description: string
  image?: string[] | null
  additionalImages?: string[] | null
  createdAt: Date
}

export const columns: ColumnDef<Award>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      const [isExpanded, setIsExpanded] = useState(false)

      const handleToggle = () => setIsExpanded((prev) => !prev)

      const shortDescription = description.split(" ").splice(0, 15).join(" ") + "..."
      const fullDescription = description

      return (
        <div>
          <span onClick={handleToggle} className="cursor-pointer">
            {isExpanded ? fullDescription : shortDescription}
          </span>
          {!isExpanded && (
            <span onClick={handleToggle} className="cursor-pointer ml-1 text-blue-500">
              {"Show More"}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = (row.getValue("type") as string) || "regular"

      const badgeVariant = type === "Featured" ? "default" : type === "Additional" ? "secondary" : "outline"

      const icon = type !== "regular" ? <Star className="h-3 w-3 mr-1" /> : null

      return (
        <Badge variant={badgeVariant} className="capitalize">
          {icon}
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageValue = row.getValue("image")
      let imageUrl = "/placeholder.svg?height=48&width=48"

      try {
        if (imageValue && typeof imageValue === "string") {
          const parsedImages = JSON.parse(imageValue) as string[]
          if (parsedImages && parsedImages.length > 0) {
            imageUrl = parsedImages[0]
          }
        } else if (Array.isArray(imageValue) && imageValue.length > 0) {
          imageUrl = imageValue[0]
        }
      } catch (error) {
        console.error("Error parsing image:", error)
      }

      return (
        <div className="h-12 w-12 relative rounded-md overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={row.getValue("title") as string}
            className="h-full w-full object-cover"
          />
        </div>
      )
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
    cell: ({ row }) => {
      const award = row.original

      const handleDelete = async () => {
        try {
          const result = await deleteAward(award.id)

          if (result.success) {
            toast.success(
              `"${award.title}" has been successfully deleted.`,
            )
          } else {
            toast.error(
              result.error || "Failed to delete award. Please try again.",
            )
          }
        } catch (error) {
          toast.error("An unexpected error occurred. Please try again.")
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
              <Link href={`/admin/awards/${award.id}`}>
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

