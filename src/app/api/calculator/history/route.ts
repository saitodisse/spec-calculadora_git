import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getHistory, saveHistory } from '@/actions/history';
import { HistoryEntryRequest, HistoryResponse } from '@/types/history';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Usuário não autenticado', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const history = await getHistory(limit, offset);
    
    if (!history) {
      return NextResponse.json(
        { message: 'Erro ao buscar histórico', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error in GET /api/calculator/history:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Usuário não autenticado', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body: HistoryEntryRequest = await request.json();
    const { expression, result } = body;

    if (!expression || !result) {
      return NextResponse.json(
        { message: 'Expressão e resultado são obrigatórios', code: 'INVALID_DATA' },
        { status: 400 }
      );
    }

    const historyEntry = await saveHistory(expression, result);
    
    if (!historyEntry) {
      return NextResponse.json(
        { message: 'Erro ao salvar histórico', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json(historyEntry, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/calculator/history:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
