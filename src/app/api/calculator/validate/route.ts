import { NextRequest, NextResponse } from 'next/server';
import { ExpressionValidator } from '@/core/expression-validator';
import { ValidateRequest, ValidateResponse } from '@/types/expression';

export async function POST(request: NextRequest) {
  try {
    const body: ValidateRequest = await request.json();
    const { expression } = body;

    const validation = ExpressionValidator.validate(expression);
    
    const response: ValidateResponse = {
      isValid: validation.isValid,
      message: validation.message,
      position: validation.position
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ValidateResponse = {
      isValid: false,
      message: 'Erro na validação',
      position: 0
    };

    return NextResponse.json(response);
  }
}
