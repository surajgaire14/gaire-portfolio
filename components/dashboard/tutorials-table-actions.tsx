"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Copy, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { toast } from "react-toastify"

interface TutorialsTableActionsProps {
  tutorial: any
}

export function TutorialsTableActions({ tutorial }: TutorialsTableActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tutorials/${tutorial.id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Tutorial deleted successfully')
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to delete tutorial')
      }
    } catch (error) {
      console.error("Error deleting tutorial:", error)
      toast.error("Failed to delete tutorial")
    }
  }

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    toast.info("Duplicate functionality coming soon!")
  }

  const handleToggleFeatured = async () => {
    try {
      const response = await fetch(`/api/tutorials/${tutorial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !tutorial.featured,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success(`Tutorial ${tutorial.featured ? 'unfeatured' : 'featured'} successfully`)
        router.refresh()
      } else {
        toast.error(result.message || 'Failed to update tutorial')
      }
    } catch (error) {
      console.error("Error updating tutorial:", error)
      toast.error("Failed to update tutorial")
    }
  }

  return (
    <>
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
          <Link href={`/tutorial/${tutorial.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Tutorial
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/admin/tutorials/${tutorial.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Tutorial
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleFeatured}>
          <Star className="mr-2 h-4 w-4" />
          {tutorial.featured ? 'Unfeature' : 'Feature'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsDeleting(true)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure? This action cannot be undone.</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-500 text-white" onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
} 