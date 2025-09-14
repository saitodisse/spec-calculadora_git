import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";
import { HistoryTreeData } from "@/types/calculator";

// Mock do console.debug para evitar logs durante os testes
const mockConsoleDebug = vi.fn();
Object.defineProperty(console, 'debug', {
  value: mockConsoleDebug,
  writable: true
});

describe("HistoryPanel - Clique em Itens", () => {
  const mockOnHistoryItemClick = vi.fn();
  const mockOnBranchName = vi.fn();

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
      "node2": {
        id: "node2",
        parentId: "node1",
        timestamp: Date.now() - 1000,
        expression: "5 * 2",
        result: 10,
      },
    },
    head: "node2",
    branches: {},
  };

  it("deve chamar onHistoryItemClick quando um item do histórico é clicado", async () => {
    render(
      <HistoryPanel
        history={mockHistory}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
      />
    );

    // Verificar se os itens do histórico estão sendo exibidos
    const historyItems = screen.getAllByText(/2 \+ 3|5 \* 2/);
    expect(historyItems).toHaveLength(2);

    // Clicar no primeiro item
    const firstItem = screen.getByText("2 + 3 = 5");
    fireEvent.click(firstItem);

    // Verificar se o callback foi chamado com a expressão correta
    expect(mockOnHistoryItemClick).toHaveBeenCalledWith("2 + 3");
    expect(mockOnHistoryItemClick).toHaveBeenCalledTimes(1);
  });

  it("deve chamar onHistoryItemClick com a expressão correta para cada item", async () => {
    render(
      <HistoryPanel
        history={mockHistory}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
      />
    );

    // Clicar no segundo item
    const secondItem = screen.getByText("5 * 2 = 10");
    fireEvent.click(secondItem);

    // Verificar se o callback foi chamado com a expressão correta
    expect(mockOnHistoryItemClick).toHaveBeenCalledWith("5 * 2");
    expect(mockOnHistoryItemClick).toHaveBeenCalledTimes(1);
  });

  it("deve exibir cursor pointer nos itens clicáveis", () => {
    render(
      <HistoryPanel
        history={mockHistory}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
      />
    );

    // Verificar se os itens têm a classe cursor-pointer
    const clickableItems = screen.getAllByRole("generic");
    const historyItems = clickableItems.filter(item => 
      item.className.includes("cursor-pointer")
    );
    
    expect(historyItems.length).toBeGreaterThan(0);
  });

  it("não deve chamar onHistoryItemClick quando o callback não é fornecido", () => {
    render(
      <HistoryPanel
        history={mockHistory}
        onBranchName={mockOnBranchName}
      />
    );

    const firstItem = screen.getByText("2 + 3 = 5");
    fireEvent.click(firstItem);

    // Não deve haver erro, mas o callback não deve ser chamado
    expect(mockOnHistoryItemClick).not.toHaveBeenCalled();
  });

  it("deve exibir mensagem quando não há histórico", () => {
    render(
      <HistoryPanel
        history={null}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
      />
    );

    expect(screen.getByText("Nenhum cálculo realizado ainda.")).toBeInTheDocument();
    expect(screen.getByText("Faça alguns cálculos para ver o histórico aqui.")).toBeInTheDocument();
  });
});
