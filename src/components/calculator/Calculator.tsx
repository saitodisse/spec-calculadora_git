"use client";

import { useState, useEffect } from "react";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorButton } from "./CalculatorButton";
import { Calculator as CalculatorCore } from "@/core/calculator";
import { HistoryTreeData } from "@/types/calculator";
import { saveHistory } from "@/actions/history";
import { useSession } from "next-auth/react";

interface CalculatorProps {
  initialHistory?: HistoryTreeData;
  onHistoryChange?: (history: HistoryTreeData) => void;
}

export function Calculator({
  initialHistory,
  onHistoryChange,
}: CalculatorProps) {
  const { data: session } = useSession();
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localHistory, setLocalHistory] = useState<HistoryTreeData | null>(
    initialHistory || null
  );

  useEffect(() => {
    setIsAuthenticated(!!session?.user);
    setLocalHistory(initialHistory || null);

    if (process.env.NODE_ENV === "development") {
      console.log("🔍 [Calculator] Initial history loaded:", initialHistory);
    }
  }, [session, initialHistory]);

  const handleButtonClick = async (value: string) => {
    try {
      let newExpression = expression;

      switch (value) {
        case "C":
          newExpression = "";
          break;
        case "AC":
          newExpression = "";
          setResult(0);
          break;
        case "=":
          if (newExpression) {
            if (process.env.NODE_ENV === "development") {
              console.log(
                "🔍 [Calculator] Calculating expression:",
                newExpression
              );
            }

            // Usar nossa nova API de cálculo
            const calculationResult = CalculatorCore.calculate(newExpression);
            setResult(calculationResult.result);

            // Substituir expressão pelo resultado (comportamento da feature)
            setExpression(calculationResult.result.toString());

            // Adicionar ao histórico local
            const newHistoryEntry = {
              id: `calc_${Date.now()}`,
              parentId: localHistory?.head || null,
              timestamp: Date.now(),
              expression: newExpression,
              result: calculationResult.result,
            };

            const updatedHistory: HistoryTreeData = {
              nodes: {
                ...(localHistory?.nodes || {}),
                [newHistoryEntry.id]: newHistoryEntry,
              },
              head: newHistoryEntry.id,
              branches: localHistory?.branches || {},
            };

            setLocalHistory(updatedHistory);
            onHistoryChange?.(updatedHistory);

            if (process.env.NODE_ENV === "development") {
              console.log("🔍 [Calculator] Added to history:", newHistoryEntry);
              console.log(
                "🔍 [Calculator] Updated history state:",
                updatedHistory
              );
            }

            // Salvar no servidor se autenticado
            if (isAuthenticated) {
              try {
                await saveHistory(updatedHistory);
                if (process.env.NODE_ENV === "development") {
                  console.log(
                    "🔍 [Calculator] History saved to server successfully"
                  );
                }
              } catch (error) {
                console.error("🔍 [Calculator] Failed to save history:", error);
              }
            }
          }
          break;
        default:
          newExpression += value;
          break;
      }

      if (value !== "=") {
        setExpression(newExpression);
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
