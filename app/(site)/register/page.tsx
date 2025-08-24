import type { Metadata } from "next"
import { SignUpForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up - Suraj Gaire",
  description: "Create a new account",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Get started with your new account</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}