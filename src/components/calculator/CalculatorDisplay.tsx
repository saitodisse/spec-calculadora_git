"use client"

interface CalculatorDisplayProps {
  expression: string
  result: number
  className?: string
}

export function CalculatorDisplay({ expression, result, className }: CalculatorDisplayProps) {
  return (
    <div className={`bg-gray-900 text-white p-4 rounded-lg ${className}`}>
      <div className="text-right text-sm text-gray-400 mb-2 min-h-[20px]">
        {expression}
      </div>
      <div className="text-right text-3xl font-mono min-h-[40px]">
        {result}
      </div>
    </div>
  )
}
