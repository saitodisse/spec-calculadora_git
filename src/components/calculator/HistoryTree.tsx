"use client";

import { HistoryEntry } from "@/types/history";

interface HistoryTreeProps {
  history: HistoryEntry[];
  onNodeSelect: (expression: string) => void;
  selectedExpression?: string | null;
  className?: string;
}

export function HistoryTree({
  history,
  onNodeSelect,
  selectedExpression,
  className,
}: HistoryTreeProps) {
  const handleItemClick = (expression: string) => {
    onNodeSelect(expression);
  };

  if (history.length === 0) {
    return (
      <div className={`text-gray-500 text-sm text-center py-8 ${className}`}>
        <p>Nenhum cálculo realizado ainda.</p>
        <p className="mt-2 text-xs">
          Faça alguns cálculos para ver o histórico aqui.
        </p>
      </div>
    );
  }

  return (
    <div className={`max-h-80 overflow-y-auto border border-gray-200 rounded ${className}`}>
      <div className="divide-y divide-gray-100">
        {history.map((entry, index) => (
          <div
            key={entry.id}
            onClick={() => handleItemClick(entry.expression)}
            className={`
              px-3 py-2 transition-colors flex items-center justify-between cursor-pointer
              ${selectedExpression === entry.expression 
                ? "bg-blue-100 border-l-4 border-blue-500" 
                : "hover:bg-gray-50"
              }
            `}
          >
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm text-gray-800 truncate">
                {entry.expression} = {entry.result}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              {selectedExpression === entry.expression && (
                <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
                  Selecionado
                </span>
              )}
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
  );
}