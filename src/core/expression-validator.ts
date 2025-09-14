export interface ValidationResult {
  isValid: boolean;
  message: string;
  position?: number;
}

export class ExpressionValidator {
  private static readonly VALID_CHARS_REGEX = /^[0-9+\-*/().\s]+$/;
  private static readonly OPERATOR_REGEX = /[+\-*/]/;
  private static readonly NUMBER_REGEX = /^\d+(\.\d+)?$/;

  static validate(expression: string): ValidationResult {
    // Remove espaços para validação
    const trimmed = expression.trim();

    // Verificar se está vazia
    if (trimmed === "") {
      return {
        isValid: false,
        message: "Expressão não pode estar vazia",
        position: 0,
      };
    }

    // Verificar caracteres válidos
    if (!this.VALID_CHARS_REGEX.test(trimmed)) {
      const invalidChar = trimmed.match(/[^0-9+\-*/().\s]/)?.[0];
      const position = trimmed.indexOf(invalidChar || "");
      return {
        isValid: false,
        message: `Expressão contém caracteres inválidos: '${invalidChar}'`,
        position,
      };
    }

    // Verificar parênteses balanceados
    const parenthesesResult = this.validateParentheses(trimmed);
    if (!parenthesesResult.isValid) {
      return parenthesesResult;
    }

    // Verificar operadores consecutivos
    const operatorsResult = this.validateOperators(trimmed);
    if (!operatorsResult.isValid) {
      return operatorsResult;
    }

    // Verificar se tem pelo menos um número
    if (!this.hasNumber(trimmed)) {
      return {
        isValid: false,
        message: "Expressão deve conter pelo menos um número",
        position: 0,
      };
    }

    return {
      isValid: true,
      message: "Expressão válida",
    };
  }

  private static validateParentheses(expression: string): ValidationResult {
    let count = 0;
    for (let i = 0; i < expression.length; i++) {
      if (expression[i] === "(") {
        count++;
      } else if (expression[i] === ")") {
        count--;
        if (count < 0) {
          return {
            isValid: false,
            message: "Parênteses desbalanceados",
            position: i,
          };
        }
      }
    }

    if (count > 0) {
      return {
        isValid: false,
        message: "Parênteses não fechados",
        position: expression.length - 1,
      };
    }

    return { isValid: true, message: "Parênteses válidos" };
  }

  private static validateOperators(expression: string): ValidationResult {
    // Remover espaços para análise
    const cleanExpression = expression.replace(/\s/g, "");

    // Verificar operadores consecutivos
    for (let i = 0; i < cleanExpression.length - 1; i++) {
      const current = cleanExpression[i];
      const next = cleanExpression[i + 1];

      if (this.OPERATOR_REGEX.test(current) && this.OPERATOR_REGEX.test(next)) {
        return {
          isValid: false,
          message: "Operadores consecutivos não são permitidos",
          position: i + 1,
        };
      }
    }

    // Verificar operador sem operando à esquerda (exceto para - no início)
    for (let i = 1; i < cleanExpression.length; i++) {
      const current = cleanExpression[i];
      const previous = cleanExpression[i - 1];

      if (this.OPERATOR_REGEX.test(current) && current !== "-") {
        if (this.OPERATOR_REGEX.test(previous) || previous === "(") {
          return {
            isValid: false,
            message: `Operador '${current}' sem operando à esquerda`,
            position: i,
          };
        }
      }
    }

    // Verificar se a expressão termina com operador
    const lastChar = cleanExpression[cleanExpression.length - 1];
    if (this.OPERATOR_REGEX.test(lastChar)) {
      return {
        isValid: false,
        message: `Expressão não pode terminar com operador '${lastChar}'`,
        position: cleanExpression.length - 1,
      };
    }

    return { isValid: true, message: "Operadores válidos" };
  }

  private static hasNumber(expression: string): boolean {
    return /\d/.test(expression);
  }
}
