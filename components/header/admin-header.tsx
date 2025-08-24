"use client"

import { AuthProvider } from "../auth/auth-provider"

export default function AdminHeader({ children }: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>{children}</AuthProvider>
    )
}