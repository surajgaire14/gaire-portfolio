import type { Metadata } from "next"
import { SignInForm } from "@/components/auth/signin-form"
import { requireAdmin } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Sign In - Suraj Gaire",
  description: "Sign in to your account",
}

export default async function SignInPage() {    // const blob = await put(filename, file, {

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}