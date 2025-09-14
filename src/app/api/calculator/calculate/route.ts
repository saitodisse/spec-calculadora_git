import { NextRequest, NextResponse } from "next/server";
import { Calculator } from "@/core/calculator";
import {
  CalculateRequest,
  CalculateResponse,
  ErrorResponse,
} from "@/types/expression";

export async function POST(request: NextRequest) {
  try {
    const body: CalculateRequest = await request.json();
    const { expression } = body;

    if (!expression) {
      const error: ErrorResponse = {
        error: "INVALID_EXPRESSION",
        message: "Expressão é obrigatória",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(error, { status: 400 });
    }

    const result = Calculator.calculate(expression);

    const response: CalculateResponse = {
      result: result.result,
      executionTime: result.executionTime,
      expression: result.expression,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: "INVALID_EXPRESSION",
      message: error instanceof Error ? error.message : "Erro desconhecido",
      details: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 400 });
  }
}
