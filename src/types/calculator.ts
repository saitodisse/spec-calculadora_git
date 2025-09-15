// Types for the calculator data model

export interface CalculatorState {
  currentExpression: string;
  result: string;
  history: Array<{
    id: string;
    expression: string;
    result: string;
    createdAt: Date;
  }>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
