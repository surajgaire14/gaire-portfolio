import { useSession } from "next-auth/react"
import { ProfileForm } from "./profile-form"
// import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function ProfilePage() {
    const session = await getSession()

    if (!session) {
        redirect("/login")
    }

    if (!session.user) {
        redirect("/login")
    }

    return (
        <div className="container py-10">
            <div className="max-w-8xl ">
                <h1 className="text-3xl font-bold mb-6">Profile</h1>
                <div className="grid gap-6">
                    <ProfileForm user={session.user} />
                </div>
            </div>
        </div>
    )
}

