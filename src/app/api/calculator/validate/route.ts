import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ExpressionValidator } from '@/core/expression-validator';

interface ValidateRequest {
  expression: string;
}

interface ValidateResponse {
  expression: string;
  isValid: boolean;
  error: string | null;
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

    const body: ValidateRequest = await request.json();
    const { expression } = body;

    if (!expression) {
      return NextResponse.json(
        { message: 'Expressão é obrigatória', code: 'INVALID_EXPRESSION' },
        { status: 400 }
      );
    }

    const validation = ExpressionValidator.validate(expression);
    
    const response: ValidateResponse = {
      expression,
      isValid: validation.isValid,
      error: validation.isValid ? null : validation.message
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/calculator/validate:', error);
    
    return NextResponse.json(
      { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
