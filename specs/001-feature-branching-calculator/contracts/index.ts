// src/core/calculator.ts
export interface ICalculatorCore {
  getState(): HistoryTree;
  performOperation(operator: string, operand: number): void;
  checkout(nodeId: string): void;
  clear(): void;
  clearAll(): void;
  createBranch(nodeId: string, branchName: string): void;
  renameBranch(oldName: string, newName: string): void;
  deleteBranch(branchName: string): void;
}

// src/services/persistence.ts
export interface IPersistenceService {
  save(tree: HistoryTree): Promise<void>;
  load(): Promise<HistoryTree | null>;
}
