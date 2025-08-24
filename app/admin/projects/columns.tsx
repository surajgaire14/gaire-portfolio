"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash, Star, Image } from "lucide-react"
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
import { deleteProject } from "./actions"
import { useToast } from "@/components/ui/use-toast"

// Update the Project type to include type field
export type Project = {
  id: string
  title: string
  categoryId: string | null
  category: {
    name: string
  } | null
  description: string
  image?: string | null
  type?: string | null
  createdAt: Date
}

const parseImages = (imageField: string | null | undefined): string[] => {
  if (!imageField) return []
  try {
    const parsed = JSON.parse(imageField)
    return Array.isArray(parsed) ? parsed : [imageField]
  } catch (e) {
    return imageField ? [imageField] : []
  }
}

// Update the columns array to display the category name
export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category
      return <div>{category?.name || "Uncategorized"}</div>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = (row.getValue("type") as string) || "regular"

      const badgeVariant = type === "featured" ? "default" : type === "notable" ? "secondary" : "outline"

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
    id: "imageCount",
    header: "Images",
    cell: ({ row }) => {
      const images = parseImages(row.original.image)
      const totalImages = images.length

      return (
        <div className="flex items-center">
          <Badge variant="outline" className="flex items-center gap-1">
            <Image className="h-3 w-3" />
            {totalImages}
          </Badge>
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
      const project = row.original
      const { toast } = useToast()

      const handleDelete = async () => {
        // if (confirm(`Are you sure you want to delete the project "${project.title}"?`)) {
        try {
          const result = await deleteProject(project.id)

          if (result.success) {
            toast({
              title: "Project deleted",
              description: `"${project.title}" has been successfully deleted.`,
            })
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to delete project. Please try again.",
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          })
          console.error("Error deleting project:", error)
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
              <Link href={`/admin/projects/${project.id}`}>
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

