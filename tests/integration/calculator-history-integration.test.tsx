import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Calculator } from "@/components/calculator/Calculator";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";
import { HistoryTreeData } from "@/types/calculator";

// Mock do console.debug para evitar logs durante os testes
const mockConsoleDebug = vi.fn();
Object.defineProperty(console, 'debug', {
  value: mockConsoleDebug,
  writable: true
});

// Mock do useSession
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null }),
}));

// Mock do CalculatorCore
vi.mock("@/core/calculator", () => ({
  Calculator: {
    calculate: vi.fn((expression: string) => ({
      result: eval(expression), // Simulação simples para teste
    })),
  },
}));

// Mock do saveHistory
vi.mock("@/actions/history", () => ({
  saveHistory: vi.fn(),
}));

describe("Calculator + HistoryPanel Integration", () => {
  const mockOnHistoryChange = vi.fn();
  const mockOnExpressionChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleDebug.mockClear();
  });

  const mockHistory: HistoryTreeData = {
    nodes: {
      "node1": {
        id: "node1",
        parentId: null,
        timestamp: Date.now() - 2000,
        expression: "2 + 3",
        result: 5,
      },
    },
    head: "node1",
    branches: {},
  };

  it("deve sincronizar expressão quando item do histórico é clicado", async () => {
    render(
      <div>
        <Calculator
          initialHistory={mockHistory}
          onHistoryChange={mockOnHistoryChange}
          onExpressionChange={mockOnExpressionChange}
          externalExpression=""
        />
        <HistoryPanel
          history={mockHistory}
          onHistoryItemClick={mockOnExpressionChange}
        />
      </div>
    );

    // Clicar em um item do histórico
    const historyItem = screen.getByText("2 + 3 = 5");
    fireEvent.click(historyItem);

    // Verificar se o callback foi chamado
    expect(mockOnExpressionChange).toHaveBeenCalledWith("2 + 3");
  });

  it("deve atualizar expressão no Calculator quando externalExpression muda", async () => {
    const { rerender } = render(
      <Calculator
        initialHistory={mockHistory}
        onHistoryChange={mockOnHistoryChange}
        onExpressionChange={mockOnExpressionChange}
        externalExpression=""
      />
    );

    // Verificar que o input está vazio inicialmente
    const input = screen.getByPlaceholderText("Digite uma expressão matemática...");
    expect(input).toHaveValue("");

    // Simular mudança externa na expressão
    rerender(
      <Calculator
        initialHistory={mockHistory}
        onHistoryChange={mockOnHistoryChange}
        onExpressionChange={mockOnExpressionChange}
        externalExpression="2 + 3"
      />
    );

    // Verificar se o input foi atualizado
    await waitFor(() => {
      expect(input).toHaveValue("2 + 3");
    });
  });

  it("deve manter sincronização entre Calculator e HistoryPanel", async () => {
    let currentExpression = "";
    const setCurrentExpression = (expr: string) => {
      currentExpression = expr;
    };

    const { rerender } = render(
      <div>
        <Calculator
          initialHistory={mockHistory}
          onHistoryChange={mockOnHistoryChange}
          onExpressionChange={setCurrentExpression}
          externalExpression={currentExpression}
        />
        <HistoryPanel
          history={mockHistory}
          onHistoryItemClick={setCurrentExpression}
        />
      </div>
    );

    // Clicar em um item do histórico
    const historyItem = screen.getByText("2 + 3 = 5");
    fireEvent.click(historyItem);

    // Re-renderizar com a nova expressão
    rerender(
      <div>
        <Calculator
          initialHistory={mockHistory}
          onHistoryChange={mockOnHistoryChange}
          onExpressionChange={setCurrentExpression}
          externalExpression={currentExpression}
        />
        <HistoryPanel
          history={mockHistory}
          onHistoryItemClick={setCurrentExpression}
        />
      </div>
    );

    // Verificar se o input foi atualizado
    const input = screen.getByPlaceholderText("Digite uma expressão matemática...");
    await waitFor(() => {
      expect(input).toHaveValue("2 + 3");
    });
  });
});
