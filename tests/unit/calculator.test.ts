import { describe, it, expect } from "vitest";
import { Calculator } from "../../src/core/calculator";

describe("Calculator", () => {
  it("should calculate simple expressions correctly", () => {
    const result = Calculator.calculate("5 + 3");
    
    expect(result.result).toBe(8);
    expect(result.expression).toBe("5 + 3");
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
  });

  it("should handle complex expressions with parentheses", () => {
    const result = Calculator.calculate("(5 + 3) * 2");
    
    expect(result.result).toBe(16);
    expect(result.expression).toBe("(5 + 3) * 2");
  });

  it("should handle division correctly", () => {
    const result = Calculator.calculate("10 / 2");
    
    expect(result.result).toBe(5);
    expect(result.expression).toBe("10 / 2");
  });

  it("should throw error for invalid expressions", () => {
    expect(() => {
      Calculator.calculate("5 + * 3");
    }).toThrow("Expressão inválida");
  });

  it("should throw error for division by zero", () => {
    expect(() => {
      Calculator.calculate("5 / 0");
    }).toThrow("divisão por zero não é permitida");
  });

  it("should handle decimal operations", () => {
    const result = Calculator.calculate("1.5 + 2.5");
    
    expect(result.result).toBe(4);
    expect(result.expression).toBe("1.5 + 2.5");
  });
});
