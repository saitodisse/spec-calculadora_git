"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface SignOutButtonProps {
  className?: string
}

export function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <Button
      onClick={() => signOut()}
      className={className}
      variant="outline"
    >
      Logout
    </Button>
  )
}
