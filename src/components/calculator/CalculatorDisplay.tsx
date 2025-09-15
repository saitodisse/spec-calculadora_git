"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  onExpressionChange: (expression: string) => void;
  onCalculate: () => void;
  className?: string;
}

export function CalculatorDisplay({
  expression,
  result,
  onExpressionChange,
  onCalculate,
  className,
}: CalculatorDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Foco automático no input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onExpressionChange(value);

    if (process.env.NODE_ENV === "development") {
      console.debug("🔍 [CalculatorDisplay] Input changed:", value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCalculate();

      if (process.env.NODE_ENV === "development") {
        console.debug(
          "🔍 [CalculatorDisplay] Enter pressed, calculating:",
          expression
        );
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onExpressionChange("");

      if (process.env.NODE_ENV === "development") {
        console.debug("🔍 [CalculatorDisplay] Escape pressed, cleared input");
      }
    }
  };

  const handleFocus = () => {
    if (process.env.NODE_ENV === "development") {
      console.debug("🔍 [CalculatorDisplay] Input focused");
    }
  };

  return (
    <div className={`bg-gray-900 text-white p-4 rounded-lg ${className}`}>
      <Input
        ref={inputRef}
        value={expression}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder="Digite uma expressão matemática..."
        className="text-right text-3xl font-mono min-h-[40px] bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500"
        autoFocus
      />
    </div>
  );
}
