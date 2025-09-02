"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteCategory } from "@/lib/category-actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  _count: {
    posts: number
  }
}

interface CategoryDeleteDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDeleteDialog({ category, open, onOpenChange }: CategoryDeleteDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCategory(category.id)
      toast.success("Category deleted successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete category")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">Delete Category</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-900">
            Are you sure you want to delete the category "{category.name}"?
            {category._count.posts > 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This category has {category._count.posts} associated posts. Deleting it will
                  remove the category association from these posts.
                </p>
              </div>
            )}
            <p className="mt-2 text-sm">This action cannot be undone.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="text-black">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Category
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
