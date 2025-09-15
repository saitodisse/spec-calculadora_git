"use client";

import { useState, useEffect } from "react";
import { HistoryEntry } from "@/types/history";
import { Button } from "@/components/ui/button";

interface HistoryPanelProps {
  onHistoryItemClick?: (expression: string) => void;
  className?: string;
  refreshTrigger?: number; // Trigger para forçar refresh do histórico
}

export function HistoryPanel({
  onHistoryItemClick,
  className,
  refreshTrigger,
}: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar histórico do servidor
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/calculator/history");

        if (!response.ok) {
          throw new Error("Erro ao carregar histórico");
        }

        const data = await response.json();
        setHistory(data.data || []);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [refreshTrigger]); // Adicionar refreshTrigger como dependência

  const handleItemClick = (expression: string) => {
    if (onHistoryItemClick) {
      onHistoryItemClick(expression);

      if (process.env.NODE_ENV === "development") {
        console.debug(
          "🔍 [HistoryPanel] Item clicked, setting expression:",
          expression
        );
      }
    }
  };

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 [HistoryPanel] Rendering with entries:", history);
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📊 Histórico de Cálculos
        </h3>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm text-center py-8">
          <p>Carregando histórico...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm text-center py-8">
          <p>Erro ao carregar histórico: {error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">
          <p>Nenhum cálculo realizado ainda.</p>
          <p className="mt-2 text-xs">
            Faça alguns cálculos para ver o histórico aqui.
          </p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto border border-gray-200 rounded">
          <div className="divide-y divide-gray-100">
            {history.map((entry, index) => (
              <div
                key={entry.id}
                onClick={() => handleItemClick(entry.expression)}
                className="px-3 py-2 transition-colors flex items-center justify-between cursor-pointer hover:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-gray-800 truncate">
                    {entry.expression} = {entry.result}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    #{history.length - index}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Total: {history.length} cálculos
          </div>
        </div>
      )}
    </div>
  );
}
