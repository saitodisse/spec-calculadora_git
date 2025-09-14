export interface ExpressionDTO {
  value: string;
  isValid: boolean;
  cursorPosition: number;
  lastValidValue: string;
}

export interface CalculateRequest {
  expression: string;
  userId?: string;
}

export interface CalculateResponse {
  result: number;
  executionTime: number;
  expression: string;
}

export interface ValidateRequest {
  expression: string;
}

export interface ValidateResponse {
  isValid: boolean;
  message: string;
  position?: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: string;
  timestamp: string;
}
