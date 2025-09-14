export interface HistoryEntryDTO {
  id: string;
  timestamp: string; // ISO string
  expression: string;
  result: number;
  executionTime: number;
  userId?: string;
}

export interface HistoryEntryRequest {
  expression: string;
  result: number;
  executionTime: number;
  userId?: string;
}

export interface HistoryResponse {
  entries: HistoryEntryDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
