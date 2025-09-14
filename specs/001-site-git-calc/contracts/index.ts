import { HistoryTreeData } from "@/types/calculator";

// src/actions/history.ts (Server Actions)
export interface IHistoryActions {
  getHistory(): Promise<HistoryTreeData | null>;
  saveHistory(tree: HistoryTreeData): Promise<void>;
}

// src/core/calculator.ts
// A lógica core da calculadora permanece a mesma,
// mas agora opera sobre o objeto `HistoryTreeData`.
export interface ICalculatorCore {
  getState(): HistoryTreeData;
  evaluateExpression(expression: string): HistoryTreeData;
  checkout(nodeId: string): HistoryTreeData;
  createBranch(nodeId: string, branchName: string): HistoryTreeData;
  // ...outros métodos que manipulam o estado
}
