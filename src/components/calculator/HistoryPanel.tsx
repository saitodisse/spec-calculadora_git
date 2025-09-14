"use client";

import { HistoryTreeData } from "@/types/calculator";

interface HistoryPanelProps {
  history: HistoryTreeData | null;
  className?: string;
}

interface HistoryEntry {
  id: string;
  expression: string;
  result: number;
  timestamp: number;
}

export function HistoryPanel({ history, className }: HistoryPanelProps) {
  // Converter o histórico em árvore para uma lista linear para exibição
  const getHistoryEntries = (tree: HistoryTreeData): HistoryEntry[] => {
    const entries: HistoryEntry[] = [];

    // Coletar todos os nós válidos (exceto o root se for apenas "0")
    Object.values(tree.nodes).forEach((node) => {
      // Incluir todos os nós que não são apenas "0" ou estão vazios
      if (node.expression !== "0" && node.expression.trim() !== "") {
        entries.push({
          id: node.id,
          expression: node.expression,
          result: node.result,
          timestamp: node.timestamp,
        });
      }
    });

    // Ordenar por timestamp (mais recente primeiro)
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  };

  const entries = history ? getHistoryEntries(history) : [];

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 [HistoryPanel] Rendering with entries:", entries);
    console.log("🔍 [HistoryPanel] Total nodes in history:", history ? Object.keys(history.nodes).length : 0);
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📊 Histórico de Cálculos
      </h3>

      {entries.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">
          <p>Nenhum cálculo realizado ainda.</p>
          <p className="mt-2 text-xs">
            Faça alguns cálculos para ver o histórico aqui.
          </p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto border border-gray-200 rounded">
          <div className="divide-y divide-gray-100">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-gray-800 truncate">
                    {entry.expression} = {entry.result}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    #{entries.length - index}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {history && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Total: {Object.keys(history.nodes).length} nós na árvore
          </div>
        </div>
      )}
    </div>
  );
}
