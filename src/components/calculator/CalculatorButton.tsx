"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalculatorButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: "default" | "secondary" | "accent" | "operator"
  className?: string
}

export function CalculatorButton({ 
  children, 
  onClick, 
  variant = "default",
  className 
}: CalculatorButtonProps) {
  const variantClasses = {
    default: "bg-gray-700 hover:bg-gray-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-400 text-white",
    accent: "bg-orange-500 hover:bg-orange-400 text-white",
    operator: "bg-blue-500 hover:bg-blue-400 text-white"
  }

  return (
    <Button
      onClick={onClick}
      className={cn(
        "w-full h-16 text-xl font-semibold",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Button>
  )
}
