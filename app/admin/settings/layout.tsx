"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const currentTab = pathname.includes("/profile")
    ? "profile"
    : pathname.includes("/notifications")
      ? "notifications"
      : pathname.includes("/smtp")
        ? "smtp"
        : "profile"

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs value={currentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-6">
          {/* <TabsTrigger value="profile" asChild>
            <Link href="/settings/profile">Profile</Link>
          </TabsTrigger>
          <TabsTrigger value="notifications" asChild>
            <Link href="/settings/notifications">Notifications</Link>
          </TabsTrigger> */}
          <TabsTrigger value="smtp" asChild>
            <Link href="/settings/smtp">SMTP</Link>
          </TabsTrigger>
        </TabsList>

        {children}
      </Tabs>
    </div>
  )
}

