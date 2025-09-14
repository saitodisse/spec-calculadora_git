"use client";

import { HistoryTreeData, CalculationNode } from "@/types/calculator";
import { useState } from "react";

interface HistoryTreeProps {
  history: HistoryTreeData | null;
  onNodeSelect: (nodeId: string) => void;
  selectedNodeId?: string | null;
  className?: string;
}

interface TreeNodeProps {
  node: CalculationNode;
  history: HistoryTreeData;
  onNodeSelect: (nodeId: string) => void;
  selectedNodeId?: string | null;
  level: number;
  isLast: boolean;
  isBranch: boolean;
}

function TreeNode({ 
  node, 
  history, 
  onNodeSelect, 
  selectedNodeId, 
  level, 
  isLast, 
  isBranch 
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Encontrar nós filhos
  const children = Object.values(history.nodes).filter(n => n.parentId === node.id);
  
  // Verificar se este nó tem uma branch nomeada
  const branchName = Object.entries(history.branches).find(([_, nodeId]) => nodeId === node.id)?.[0];
  
  // Verificar se é o HEAD
  const isHead = node.id === history.head;
  
  const handleClick = () => {
    onNodeSelect(node.id);
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      {/* Linha conectora vertical */}
      {level > 0 && (
        <div 
          className="absolute left-0 top-0 w-px bg-gray-300"
          style={{ 
            height: isLast ? '20px' : '100%',
            left: `${level * 20 - 10}px`
          }}
        />
      )}
      
      {/* Nó */}
      <div 
        className={`
          flex items-center py-1 cursor-pointer hover:bg-gray-50 rounded
          ${selectedNodeId === node.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}
        `}
        onClick={handleClick}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {/* Botão de expansão */}
        {children.length > 0 && (
          <button
            onClick={toggleExpanded}
            className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 mr-2"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        
        {/* Ícone do nó */}
        <div className="flex items-center mr-2">
          {isHead && (
            <span className="text-xs bg-green-200 text-green-800 px-1.5 py-0.5 rounded mr-1">
              HEAD
            </span>
          )}
          {branchName && (
            <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded mr-1">
              {branchName}
            </span>
          )}
          {isBranch && (
            <span className="text-xs bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded mr-1">
              BRANCH
            </span>
          )}
        </div>
        
        {/* Conteúdo do nó */}
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-gray-800 truncate">
            {node.expression} = {node.result}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(node.timestamp).toLocaleString()}
          </div>
        </div>
        
        {/* Indicador de seleção */}
        {selectedNodeId === node.id && (
          <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">
            Selecionado
          </span>
        )}
      </div>
      
      {/* Nós filhos */}
      {isExpanded && children.length > 0 && (
        <div className="relative">
          {children.map((child, index) => (
            <TreeNode
              key={child.id}
              node={child}
              history={history}
              onNodeSelect={onNodeSelect}
              selectedNodeId={selectedNodeId}
              level={level + 1}
              isLast={index === children.length - 1}
              isBranch={index > 0} // Nós após o primeiro são considerados branches
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HistoryTree({ 
  history, 
  onNodeSelect, 
  selectedNodeId, 
  className = "" 
}: HistoryTreeProps) {
  if (!history) {
    return (
      <div className={`text-gray-500 text-sm text-center py-8 ${className}`}>
        <p>Nenhum histórico disponível.</p>
      </div>
    );
  }

  // Encontrar nós raiz (sem parentId ou parentId null)
  const rootNodes = Object.values(history.nodes).filter(node => 
    !node.parentId || node.parentId === null
  );

  if (rootNodes.length === 0) {
    return (
      <div className={`text-gray-500 text-sm text-center py-8 ${className}`}>
        <p>Nenhum nó raiz encontrado.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        🌳 Árvore de Histórico
      </h4>
      
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded p-2">
        {rootNodes.map((rootNode, index) => (
          <TreeNode
            key={rootNode.id}
            node={rootNode}
            history={history}
            onNodeSelect={onNodeSelect}
            selectedNodeId={selectedNodeId}
            level={0}
            isLast={index === rootNodes.length - 1}
            isBranch={false}
          />
        ))}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-200 rounded"></span>
            HEAD
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-200 rounded"></span>
            Branch Nomeada
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-200 rounded"></span>
            Nova Branch
          </span>
        </div>
      </div>
    </div>
  );
}
