"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Tags,
  Settings,
  BarChart3,
  ImageIcon,
  Search,
  Trash2,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "All Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    title: "Create Post",
    href: "/dashboard/posts/create",
    icon: PlusCircle,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Tags,
  },
  {
    title: "Media Library",
    href: "/dashboard/media",
    icon: ImageIcon,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "SEO Tools",
    href: "/dashboard/seo",
    icon: Search,
  },
  {
    title: "Trash",
    href: "/dashboard/trash",
    icon: Trash2,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-card h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Blog CMS</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-white font-bold font-xl"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
