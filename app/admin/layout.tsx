import type React from "react"
import { AdminNav } from "@/components/admin-nav"
import { requireAdmin } from "@/lib/auth"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import AdminHeader from "@/components/header/admin-header"
import Link from "next/link"


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protect the admin routes
  const session = await requireAdmin()

  return (
    <div className="grid min-h-screen h-full w-full md:grid-cols-[220px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 font-semibold justify-center">
            <Link href={"/"} className="relative">
              <Image src={"/logo.png"} width={100} height={100} alt="logo" />
            </Link>
          </div>
          <AdminHeader>
            <AdminNav />
          </AdminHeader>
        </div>
      </div>
      <div className="flex flex-col max-h-screen overflow-y-scroll">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </div>
    </div>
  )
}



