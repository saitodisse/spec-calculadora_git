import { describe, it, expect } from "vitest";
import { CalculatorCore } from "../../src/core/calculator";

describe("CalculatorCore", () => {
  it("should create a default tree with root node", () => {
    const calculator = new CalculatorCore();
    const state = calculator.getState();

    expect(state.nodes.root).toBeDefined();
    expect(state.nodes.root.id).toBe("root");
    expect(state.nodes.root.result).toBe(0);
    expect(state.head).toBe("root");
  });

  it("should evaluate simple expressions", () => {
    const calculator = new CalculatorCore();

    const newState = calculator.evaluateExpression("5 + 3");
    expect(calculator.getCurrentResult()).toBe(8);
    expect(calculator.getCurrentExpression()).toBe("5+3");
  });

  it("should handle complex expressions with parentheses", () => {
    const calculator = new CalculatorCore();

    const newState = calculator.evaluateExpression("(5 + 3) * 2");
    expect(calculator.getCurrentResult()).toBe(16);
  });

  it("should create branches when evaluating from different nodes", () => {
    const calculator = new CalculatorCore();

    // First calculation
    calculator.evaluateExpression("5 + 3");
    const firstNodeId = calculator.getState().head;

    // Go back to root and create a branch
    calculator.checkout("root");
    calculator.evaluateExpression("10 - 2");

    const state = calculator.getState();
    expect(state.nodes[firstNodeId].result).toBe(8);
    expect(calculator.getCurrentResult()).toBe(8);
  });

  it("should throw error for invalid expressions", () => {
    const calculator = new CalculatorCore();

    expect(() => {
      calculator.evaluateExpression("5 + * 3");
    }).toThrow("Invalid expression");
  });

  it("should clear all and reset to root", () => {
    const calculator = new CalculatorCore();

    calculator.evaluateExpression("5 + 3");
    calculator.evaluateExpression("8 * 2");

    calculator.clearAll();

    const state = calculator.getState();
    expect(state.head).toBe("root");
    expect(calculator.getCurrentResult()).toBe(0);
  });
});
