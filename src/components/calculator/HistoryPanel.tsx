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
    
    const traverse = (nodeId: string, visited = new Set<string>()) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const node = tree.nodes[nodeId];
      if (node) {
        entries.push({
          id: node.id,
          expression: node.expression,
          result: node.result,
          timestamp: node.timestamp
        });
        
        // Visitar nós filhos se existirem
        Object.values(tree.nodes).forEach(childNode => {
          if (childNode.parentId === nodeId) {
            traverse(childNode.id, visited);
          }
        });
      }
    };
    
    // Começar do nó raiz
    if (tree.head) {
      traverse(tree.head);
    }
    
    // Ordenar por timestamp (mais recente primeiro)
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  };

  const entries = history ? getHistoryEntries(history) : [];
  
  // Filtrar apenas entradas com expressões válidas (não apenas "0")
  const validEntries = entries.filter(entry => 
    entry.expression !== "0" && entry.expression.trim() !== ""
  );

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 [HistoryPanel] Rendering with entries:", validEntries);
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📊 Histórico de Cálculos
      </h3>
      
      {validEntries.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">
          <p>Nenhum cálculo realizado ainda.</p>
          <p className="mt-2 text-xs">
            Faça alguns cálculos para ver o histórico aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {validEntries.map((entry, index) => (
            <div
              key={entry.id}
              className="p-3 bg-gray-50 rounded border-l-4 border-blue-400 hover:bg-gray-100 transition-colors"
            >
              <div className="text-sm text-gray-600 mb-1">
                #{validEntries.length - index}
              </div>
              <div className="font-mono text-sm text-gray-800 mb-1">
                {entry.expression} = {entry.result}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
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
