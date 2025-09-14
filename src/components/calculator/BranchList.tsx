"use client";

import { HistoryTreeData } from "@/types/calculator";
import { Button } from "@/components/ui/button";

interface BranchListProps {
  history: HistoryTreeData | null;
  onBranchSelect: (nodeId: string) => void;
  onBranchRename: (branchName: string, nodeId: string) => void;
  className?: string;
}

interface BranchItem {
  name: string;
  nodeId: string;
  expression: string;
  result: number;
  timestamp: number;
  isCurrent: boolean;
}

export function BranchList({
  history,
  onBranchSelect,
  onBranchRename,
  className = "",
}: BranchListProps) {
  // Converter branches em lista ordenada
  const getBranchItems = (tree: HistoryTreeData): BranchItem[] => {
    const items: BranchItem[] = [];

    Object.entries(tree.branches).forEach(([branchName, nodeId]) => {
      const node = tree.nodes[nodeId];
      if (node) {
        items.push({
          name: branchName,
          nodeId,
          expression: node.expression,
          result: node.result,
          timestamp: node.timestamp,
          isCurrent: nodeId === tree.head,
        });
      }
    });

    // Ordenar por timestamp (mais recente primeiro)
    return items.sort((a, b) => b.timestamp - a.timestamp);
  };

  const branchItems = history ? getBranchItems(history) : [];

  const handleBranchClick = (nodeId: string) => {
    onBranchSelect(nodeId);
    
    if (process.env.NODE_ENV === "development") {
      console.debug("🔍 [BranchList] Branch selected:", nodeId);
    }
  };

  const handleRenameClick = (branchName: string, nodeId: string) => {
    onBranchRename(branchName, nodeId);
    
    if (process.env.NODE_ENV === "development") {
      console.debug("🔍 [BranchList] Rename requested:", branchName, nodeId);
    }
  };

  if (process.env.NODE_ENV === "development") {
    console.debug("🔍 [BranchList] Rendering with", branchItems.length, "branches");
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Branches Nomeadas
      </h3>
      
      {branchItems.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Nenhuma branch nomeada
        </p>
      ) : (
        <div className="space-y-1">
          {branchItems.map((item) => (
            <div
              key={item.name}
              data-testid="branch-item"
              className={`
                flex items-center justify-between p-2 rounded-md border
                transition-colors duration-200
                ${item.isCurrent 
                  ? "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200" 
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                }
              `}
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => handleBranchClick(item.nodeId)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{item.name}</span>
                  {item.isCurrent && (
                    <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded dark:bg-blue-800 dark:text-blue-200">
                      HEAD
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {item.expression} = {item.result}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRenameClick(item.name, item.nodeId)}
                className="ml-2 h-6 px-2 text-xs"
                aria-label={`Renomear branch ${item.name}`}
              >
                Renomear
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
