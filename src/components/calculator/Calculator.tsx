"use client";

import { useState, useEffect } from "react";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorButton } from "./CalculatorButton";
import { Calculator as CalculatorCore } from "@/core/calculator";
import { useSession } from "next-auth/react";

interface CalculatorProps {
  onExpressionChange?: (expression: string) => void;
  externalExpression?: string;
  onCalculationComplete?: () => void; // Callback para notificar que um cálculo foi concluído
}

export function Calculator({
  onExpressionChange,
  externalExpression,
  onCalculationComplete,
}: CalculatorProps) {
  const { data: session } = useSession();
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!session?.user);

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 [Calculator] Session updated:", session?.user?.email);
    }
  }, [session]);

  // Sincronizar com mudanças externas na expressão (ex: clique no histórico)
  useEffect(() => {
    if (externalExpression !== undefined && externalExpression !== expression) {
      setExpression(externalExpression);

      if (process.env.NODE_ENV === "development") {
        console.debug(
          "🔍 [Calculator] External expression changed:",
          externalExpression
        );
      }
    }
  }, [externalExpression]); // Removido 'expression' das dependências para evitar loop

  const handleExpressionChange = (newExpression: string) => {
    setExpression(newExpression);
    onExpressionChange?.(newExpression);

    if (process.env.NODE_ENV === "development") {
      console.debug("🔍 [Calculator] Expression changed:", newExpression);
    }
  };

  const handleCalculate = async () => {
    if (!expression) return;

    try {
      if (process.env.NODE_ENV === "development") {
        console.debug("🔍 [Calculator] Calculating expression:", expression);
      }

      // Usar nossa nova API de cálculo
      const calculationResult = CalculatorCore.calculate(expression);
      const resultString = calculationResult.result.toString();
      setResult(resultString);

      // Substituir expressão pelo resultado (comportamento da feature)
      setExpression(resultString);

      // Salvar no servidor se autenticado
      if (isAuthenticated) {
        try {
          const response = await fetch('/api/calculator/calculate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              expression: expression,
            }),
          });

          if (!response.ok) {
            throw new Error('Erro ao salvar cálculo');
          }

          if (process.env.NODE_ENV === "development") {
            console.debug("🔍 [Calculator] Calculation saved to server successfully");
          }
        } catch (error) {
          console.error("🔍 [Calculator] Failed to save calculation:", error);
        }
      }

      // Notificar que o cálculo foi concluído
      onCalculationComplete?.();
    } catch (error) {
      console.error("Calculator error:", error);
      // TODO: Mostrar erro para o usuário
    }
  };

  const handleButtonClick = async (value: string) => {
    try {
      let newExpression = expression;

      switch (value) {
        case "C":
          newExpression = "";
          break;
        case "AC":
          newExpression = "";
          setResult("");
          break;
        case "=":
          await handleCalculate();
          return; // Não atualizar expression aqui, handleCalculate já faz isso
        default:
          newExpression += value;
          break;
      }

      setExpression(newExpression);

      if (process.env.NODE_ENV === "development") {
        console.debug(
          "🔍 [Calculator] Button clicked:",
          value,
          "New expression:",
          newExpression
        );
      }
    } catch (error) {
      console.error("Calculator error:", error);
      // TODO: Mostrar erro para o usuário
    }
  };

  const buttonRows = [
    ["AC", "C", "(", ")"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="w-full max-w-sm mx-auto bg-gray-800 p-4 rounded-lg shadow-lg">
      <CalculatorDisplay
        expression={expression}
        result={result}
        onExpressionChange={handleExpressionChange}
        onCalculate={handleCalculate}
        className="mb-4"
      />

      <div className="grid grid-cols-4 gap-2">
        {buttonRows.flat().map((button, index) => (
          <CalculatorButton
            key={index}
            onClick={() => handleButtonClick(button)}
            variant={
              button === "="
                ? "accent"
                : ["+", "-", "*", "/", "(", ")"].includes(button)
                ? "operator"
                : ["AC", "C"].includes(button)
                ? "secondary"
                : "default"
            }
          >
            {button}
          </CalculatorButton>
        ))}
      </div>

      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-sm">
          <p>⚠️ Você não está logado. Seu histórico não será salvo.</p>
        </div>
      )}
    </div>
  );
}
