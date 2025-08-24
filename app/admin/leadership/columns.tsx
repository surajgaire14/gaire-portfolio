"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash, ArrowUp, ArrowDown } from "lucide-react"
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
import { deleteLeadership, updateLeadershipOrder } from "./actions"
import { toast } from "react-toastify"

export type Leadership = {
    id: string
    name: string
    position: string
    bio?: string | null
    image?: string | null
    order: number
    createdAt: Date
}

export const columns: ColumnDef<Leadership>[] = [
    {
        accessorKey: "order",
        header: "Order",
        cell: ({ row }) => {
            const order = row.getValue("order") as number
            return <div className="">{order}</div>
        },
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.getValue("image") as string | null
            return (
                <div className="h-12 w-12 relative rounded-md overflow-hidden">
                    <img
                        src={image || "/placeholder.svg?height=48&width=48"}
                        alt={row.getValue("name") as string}
                        className="h-full w-full object-cover"
                    />
                </div>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "position",
        header: "Position",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
            const leadership = row.original
            const data = table.options.data as Leadership[]

            const handleDelete = async () => {
                try {
                    const result = await deleteLeadership(leadership.id)

                    if (result.success) {
                        toast.success(`"${leadership.name}" has been successfully deleted.`)
                    } else {
                        toast.error(result.error || "Failed to delete leadership. Please try again.")
                    }
                } catch (error) {
                    toast.error("An unexpected error occurred. Please try again.")
                    console.error("Error deleting leadership:", error)
                }
            }

            const moveUp = async () => {
                if (leadership.order <= 0) return

                const itemAbove = data.find((item) => item.order === leadership.order - 1)
                if (!itemAbove) return

                try {
                    const result = await updateLeadershipOrder([
                        { id: leadership.id, order: leadership.order - 1 },
                        { id: itemAbove.id, order: itemAbove.order + 1 },
                    ])

                    if (result.success) {
                        toast.success(`"${leadership.name}" has been moved up.`)
                    }
                } catch (error) {
                    toast.error("Failed to update order.")
                }
            }

            const moveDown = async () => {
                const itemBelow = data.find((item) => item.order === leadership.order + 1)
                if (!itemBelow) return

                try {
                    const result = await updateLeadershipOrder([
                        { id: leadership.id, order: leadership.order + 1 },
                        { id: itemBelow.id, order: itemBelow.order - 1 },
                    ])

                    if (result.success) {
                        toast.success(`"${leadership.name}" has been moved down.`)
                    }
                } catch (error) {
                    toast.error("Failed to update order.")
                }
            }

            return (
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={moveUp} disabled={leadership.order <= 0} className="h-8 w-8">
                        <ArrowUp className="h-4 w-4" />
                        <span className="sr-only">Move Up</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={moveDown}
                        disabled={leadership.order >= data.length - 1}
                        className="h-8 w-8"
                    >
                        <ArrowDown className="h-4 w-4" />
                        <span className="sr-only">Move Down</span>
                    </Button>
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
                                <Link href={`/admin/leadership/${leadership.id}`}>
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
                </div>
            )
        },
    },
]
