import { NextRequest, NextResponse } from 'next/server';
import { HistoryEntryRequest, HistoryEntryDTO, HistoryResponse } from '@/types/history';

// Mock data para desenvolvimento
let mockHistory: HistoryEntryDTO[] = [
  {
    id: 'entry_1',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    expression: '2 + 3',
    result: 5,
    executionTime: 2,
    userId: 'user123'
  },
  {
    id: 'entry_2',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    expression: '5 * 2',
    result: 10,
    executionTime: 1,
    userId: 'user456'
  },
  {
    id: 'entry_3',
    timestamp: new Date().toISOString(),
    expression: '10 / 2',
    result: 5,
    executionTime: 3,
    userId: 'user123'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');

    // Filtrar por usuário se especificado
    let filteredHistory = mockHistory;
    if (userId) {
      filteredHistory = mockHistory.filter(entry => entry.userId === userId);
    }

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

    const response: HistoryResponse = {
      entries: paginatedHistory,
      pagination: {
        page,
        limit,
        total: filteredHistory.length,
        totalPages: Math.ceil(filteredHistory.length / limit)
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: HistoryEntryRequest = await request.json();
    const { expression, result, executionTime, userId } = body;

    if (!expression || typeof result !== 'number' || typeof executionTime !== 'number') {
      return NextResponse.json(
        { error: 'INVALID_DATA', message: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const newEntry: HistoryEntryDTO = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      expression,
      result,
      executionTime,
      userId
    };

    mockHistory.unshift(newEntry); // Adicionar no início

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
