"use client";

import { useState } from "react";
import { HistoryTreeData } from "@/types/calculator";
import { Button } from "@/components/ui/button";
import { BranchList } from "./BranchList";
import { HistoryTree } from "./HistoryTree";

interface HistoryPanelProps {
  history: HistoryTreeData | null;
  onHistoryItemClick?: (expression: string) => void;
  onBranchName?: (branchName: string, nodeId: string) => void;
  onBranchSelect?: (nodeId: string) => void;
  onBranchRename?: (branchName: string, nodeId: string) => void;
  className?: string;
}

interface HistoryEntry {
  id: string;
  expression: string;
  result: number;
  timestamp: number;
}

export function HistoryPanel({
  history,
  onHistoryItemClick,
  onBranchName,
  onBranchSelect,
  onBranchRename,
  className,
}: HistoryPanelProps) {
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

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

  const handleItemClick = (expression: string, nodeId: string) => {
    setSelectedNodeId(nodeId);
    
    if (onHistoryItemClick) {
      onHistoryItemClick(expression);

      if (process.env.NODE_ENV === "development") {
        console.debug(
          "🔍 [HistoryPanel] Item clicked, setting expression:",
          expression,
          "nodeId:",
          nodeId
        );
      }
    }
  };

  const handleBranchSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    
    if (onBranchSelect) {
      onBranchSelect(nodeId);
    }
  };

  const handleBranchRename = (branchName: string, nodeId: string) => {
    if (onBranchRename) {
      onBranchRename(branchName, nodeId);
    }
  };

  const handleBranchNameSubmit = () => {
    if (branchName.trim() && onBranchName && selectedNodeId) {
      onBranchName(branchName.trim(), selectedNodeId);
      setBranchName("");
      setShowBranchModal(false);

      if (process.env.NODE_ENV === "development") {
        console.debug("🔍 [HistoryPanel] Branch named:", branchName.trim(), "for node:", selectedNodeId);
      }
    }
  };

  const handleBranchNameCancel = () => {
    setBranchName("");
    setShowBranchModal(false);
  };

  if (process.env.NODE_ENV === "development") {
    console.log("🔍 [HistoryPanel] Rendering with entries:", entries);
    console.log(
      "🔍 [HistoryPanel] Total nodes in history:",
      history ? Object.keys(history.nodes).length : 0
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📊 Histórico de Cálculos
        </h3>
        <div className="flex items-center gap-2">
          {/* Botões de visualização */}
          <div className="flex border border-gray-300 rounded">
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs rounded-r-none"
            >
              📋 Lista
            </Button>
            <Button
              onClick={() => setViewMode('tree')}
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs rounded-l-none"
            >
              🌳 Árvore
            </Button>
          </div>
          
          {history && Object.keys(history.nodes).length > 0 && selectedNodeId && (
            <Button
              onClick={() => setShowBranchModal(true)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              🌿 Nomear Branch
            </Button>
          )}
        </div>
      </div>

      {/* Branch List */}
      {history && Object.keys(history.branches).length > 0 && (
        <div className="mb-4">
          <BranchList
            history={history}
            onBranchSelect={handleBranchSelect}
            onBranchRename={handleBranchRename}
          />
        </div>
      )}

      {viewMode === 'list' ? (
        entries.length === 0 ? (
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
                  onClick={() => handleItemClick(entry.expression, entry.id)}
                  className={`
                    px-3 py-2 transition-colors flex items-center justify-between cursor-pointer
                    ${selectedNodeId === entry.id 
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
                    {selectedNodeId === entry.id && (
                      <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
                        Selecionado
                      </span>
                    )}
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
        )
      ) : (
        <HistoryTree
          history={history}
          onNodeSelect={(nodeId) => {
            const node = history?.nodes[nodeId];
            if (node) {
              handleItemClick(node.expression, nodeId);
            }
          }}
          selectedNodeId={selectedNodeId}
        />
      )}

      {history && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Total: {Object.keys(history.nodes).length} nós na árvore
          </div>
        </div>
      )}

      {/* Modal para nomear branch */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🌿 Nomear Branch
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Dê um nome para este branch do histórico de cálculos.
            </p>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="Ex: Cálculos de juros, Projeto X, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBranchNameSubmit();
                } else if (e.key === "Escape") {
                  handleBranchNameCancel();
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={handleBranchNameCancel}
                variant="outline"
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleBranchNameSubmit}
                size="sm"
                disabled={!branchName.trim()}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
