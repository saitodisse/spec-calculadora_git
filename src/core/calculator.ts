import { ExpressionValidator } from './expression-validator';

export interface CalculationResult {
  result: number;
  executionTime: number;
  expression: string;
}

export class Calculator {
  static calculate(expression: string): CalculationResult {
    const startTime = Date.now();

    // Validar expressão
    const validation = ExpressionValidator.validate(expression);
    if (!validation.isValid) {
      throw new Error(`Expressão inválida: ${validation.message}`);
    }

    try {
      // Substituir operadores para JavaScript
      const jsExpression = expression
        .replace(/\*/g, '*')
        .replace(/\//g, '/')
        .replace(/\+/g, '+')
        .replace(/\-/g, '-');

      // Avaliar expressão
      const result = this.evaluateExpression(jsExpression);
      
      const executionTime = Date.now() - startTime;

      return {
        result,
        executionTime,
        expression
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      if (error instanceof Error && error.message.includes('divisão por zero')) {
        throw new Error('divisão por zero não é permitida');
      }
      
      throw new Error(`Erro no cálculo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  private static evaluateExpression(expression: string): number {
    // Verificar divisão por zero
    if (expression.includes('/0') || expression.includes('/ 0')) {
      throw new Error('divisão por zero');
    }

    // Usar Function constructor para avaliar expressão de forma segura
    // Isso é mais seguro que eval() pois não tem acesso ao escopo global
    try {
      const func = new Function('return ' + expression);
      const result = func();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Resultado inválido');
      }
      
      return result;
    } catch (error) {
      throw new Error('Expressão não pode ser calculada');
    }
  }
}