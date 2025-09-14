// Types for the calculator data model

export interface CalculationNode {
  id: string;
  parentId: string | null;
  timestamp: number;
  expression: string;
  result: number;
}

export interface HistoryTreeData {
  nodes: Record<string, CalculationNode>;
  head: string;
  branches: Record<string, string>;
}

export interface CalculatorState {
  currentExpression: string;
  result: number;
  historyTree: HistoryTreeData;
  isAuthenticated: boolean;
  isLoading: boolean;
}
