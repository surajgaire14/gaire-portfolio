"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Building, Award, FileText, Home, Settings, Users, FolderTree, ChevronDown, LogOut, Users2, BookOpen } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  console.log("session", session)
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: Home,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: Building,
    },
    {
      title: "Awards",
      href: "/admin/awards",
      icon: Award,
    },

    {
      title: "Leadership",
      href: "/admin/leadership",
      icon: Users2,
    },
    {
      title: "Blog",
      href: "/admin/blog",
      icon: FileText,
    },
    {
      title: "Tutorials",
      href: "/admin/tutorials",
      icon: BookOpen,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Complains and Feedback",
      href: "/admin/complain-feedback",
      icon: Settings,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: "/login" })
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    // return the profile image if it exists
    // if (session?.user?.profile_image) return <Image src={session.user.profile_image} alt="User" width={32} height={32} />
    if (!session?.user?.name) return "U"
    return session.user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <nav className="grid gap-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* User menu footer */}
      <div className="mt-auto p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2">
              <div className="flex items-center gap-2 h-10 w-10 relative">
              <Avatar className="h-10 w-10">
                              <AvatarImage src={(session?.user as any)?.profile_image || undefined} />
                              <AvatarFallback className="text-lg">
                                {session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium truncate max-w-[120px]">{session?.user?.name || "User"}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">{session?.user?.email}</span>
                </div>
                <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

