export interface HistoryEntry {
  id: string;
  userId: string;
  expression: string;
  result: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HistoryEntryRequest {
  expression: string;
  result: string;
}

export interface HistoryResponse {
  data: HistoryEntry[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
