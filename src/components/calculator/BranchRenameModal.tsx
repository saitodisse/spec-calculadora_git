"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BranchRenameModalProps {
  isOpen: boolean;
  branchName: string;
  nodeId: string;
  onClose: () => void;
  onRename: (oldName: string, newName: string, nodeId: string) => Promise<void>;
}

export function BranchRenameModal({
  isOpen,
  branchName,
  nodeId,
  onClose,
  onRename,
}: BranchRenameModalProps) {
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewName(branchName);
      setError("");
    }
  }, [isOpen, branchName]);

  const handleSubmit = async () => {
    if (!newName.trim()) {
      setError("Nome da branch não pode ser vazio");
      return;
    }

    if (newName.trim() === branchName) {
      onClose();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onRename(branchName, newName.trim(), nodeId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao renomear branch");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewName(branchName);
    setError("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🔄 Renomear Branch
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Renomeie a branch <strong>"{branchName}"</strong>
        </p>

        <div className="mb-4">
          <label htmlFor="branch-name" className="block text-sm font-medium text-gray-700 mb-2">
            Novo nome da branch
          </label>
          <input
            id="branch-name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite o novo nome da branch"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={!newName.trim() || isLoading}
          >
            {isLoading ? "Renomeando..." : "Renomear"}
          </Button>
        </div>
      </div>
    </div>
  );
}
