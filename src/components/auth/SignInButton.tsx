"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface SignInButtonProps {
  className?: string
}

export function SignInButton({ className }: SignInButtonProps) {
  return (
    <Button
      onClick={() => signIn("google")}
      className={className}
      variant="default"
    >
      Login com Google
    </Button>
  )
}
