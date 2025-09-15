import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import { Calculator } from "@/core/calculator";
import { saveHistory } from '@/actions/history';

interface CalculateRequest {
  expression: string;
}

interface CalculateResponse {
  expression: string;
  result: string;
  historyEntry: {
    id: string;
    userId: string;
    expression: string;
    result: string;
    createdAt: Date;
    updatedAt: Date;
  };
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

    const body: CalculateRequest = await request.json();
    const { expression } = body;

    if (!expression) {
      return NextResponse.json(
        { message: 'Expressão é obrigatória', code: 'INVALID_EXPRESSION' },
        { status: 400 }
      );
    }

    const result = Calculator.calculate(expression);
    const resultString = result.result.toString();

    // Salvar no histórico
    const historyEntry = await saveHistory(expression, resultString);
    
    if (!historyEntry) {
      return NextResponse.json(
        { message: 'Erro ao salvar histórico', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }

    const response: CalculateResponse = {
      expression,
      result: resultString,
      historyEntry,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/calculator/calculate:', error);
    
    if (error instanceof Error && error.message.includes('Invalid expression')) {
      return NextResponse.json(
        { message: 'Expressão inválida', code: 'INVALID_EXPRESSION' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
