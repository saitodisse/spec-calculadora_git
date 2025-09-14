"use client";

import { useState } from "react";
import { Calculator } from "@/components/calculator/Calculator";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";
import { SignInButton, SignOutButton } from "@/components/auth";
import { HistoryTreeData } from "@/types/calculator";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<HistoryTreeData | null>(null);
  const [currentExpression, setCurrentExpression] = useState<string>("");

  const handleBranchName = (branchName: string) => {
    if (history) {
      // Criar um novo branch no histórico
      const updatedHistory = {
        ...history,
        branches: {
          ...history.branches,
          [branchName]: history.head, // Associar o nome do branch ao nó atual
        },
      };
      setHistory(updatedHistory);

      if (process.env.NODE_ENV === "development") {
        console.debug(
          "🔍 [HomePage] Branch created:",
          branchName,
          "at node:",
          history.head
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Calculadora com Histórico Ramificado
          </h1>
          <p className="text-gray-600 mb-4">
            Uma calculadora avançada que salva seu histórico como uma árvore Git
          </p>

          <div className="flex justify-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    Olá, {session.user.name || session.user.email}!
                  </span>
                </div>
                <SignOutButton />
              </div>
            ) : (
              <SignInButton />
            )}
          </div>
        </header>

        <main className="flex justify-center gap-6 max-w-6xl mx-auto">
          <Calculator
            initialHistory={history || undefined}
            onHistoryChange={setHistory}
            onExpressionChange={setCurrentExpression}
          />
          <HistoryPanel
            history={history}
            onHistoryItemClick={setCurrentExpression}
            onBranchName={handleBranchName}
            className="w-80"
          />
        </main>

        {!session?.user && (
          <div className="mt-8 max-w-md mx-auto p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              💡 Faça login para salvar seu histórico
            </h3>
            <p className="text-blue-700 text-sm">
              Quando você fizer login, todos os seus cálculos serão salvos
              automaticamente e você poderá acessá-los de qualquer dispositivo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
