import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HistoryTree } from "@/components/calculator/HistoryTree";
import { HistoryTreeData } from "@/types/calculator";

describe("HistoryTree Component", () => {
  const mockOnNodeSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockHistoryWithTree: HistoryTreeData = {
    nodes: {
      "root": {
        id: "root",
        parentId: null,
        timestamp: Date.now() - 3000,
        expression: "0",
        result: 0,
      },
      "node1": {
        id: "node1",
        parentId: "root",
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
      "node3": {
        id: "node3",
        parentId: "node1",
        timestamp: Date.now() - 500,
        expression: "5 + 1",
        result: 6,
      },
    },
    head: "node2",
    branches: {
      "feature-branch": "node1",
      "experiment": "node3",
    },
  };

  it("should render tree structure", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    expect(screen.getByText("🌳 Árvore de Histórico")).toBeInTheDocument();
    expect(screen.getByText("0 = 0")).toBeInTheDocument();
    expect(screen.getByText("2 + 3 = 5")).toBeInTheDocument();
    expect(screen.getByText("5 * 2 = 10")).toBeInTheDocument();
    expect(screen.getByText("5 + 1 = 6")).toBeInTheDocument();
  });

  it("should highlight HEAD node", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    const headElements = screen.getAllByText("HEAD");
    expect(headElements.length).toBeGreaterThan(0);
  });

  it("should show branch names", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    expect(screen.getByText("feature-branch")).toBeInTheDocument();
    expect(screen.getByText("experiment")).toBeInTheDocument();
  });

  it("should call onNodeSelect when node is clicked", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    const nodeElement = screen.getByText("2 + 3 = 5");
    fireEvent.click(nodeElement);

    expect(mockOnNodeSelect).toHaveBeenCalledWith("node1");
  });

  it("should highlight selected node", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
        selectedNodeId="node1"
      />
    );

    expect(screen.getByText("Selecionado")).toBeInTheDocument();
  });

  it("should show expand/collapse buttons for nodes with children", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    // O nó root deve ter botão de expansão
    const expandButtons = screen.getAllByText("▼");
    expect(expandButtons.length).toBeGreaterThan(0);
  });

  it("should toggle expansion when expand button is clicked", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    const expandButton = screen.getAllByText("▼")[0];
    fireEvent.click(expandButton);

    // Deve mostrar o ícone de colapso
    expect(screen.getByText("▶")).toBeInTheDocument();
  });

  it("should show legend", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    expect(screen.getByText("Branch Nomeada")).toBeInTheDocument();
    expect(screen.getByText("Nova Branch")).toBeInTheDocument();
  });

  it("should handle null history", () => {
    render(
      <HistoryTree
        history={null}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    expect(screen.getByText("Nenhum histórico disponível.")).toBeInTheDocument();
  });

  it("should handle history with no root nodes", () => {
    const emptyHistory: HistoryTreeData = {
      nodes: {},
      head: "",
      branches: {},
    };

    render(
      <HistoryTree
        history={emptyHistory}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    expect(screen.getByText("Nenhum nó raiz encontrado.")).toBeInTheDocument();
  });

  it("should show BRANCH indicator for nodes that create new branches", () => {
    render(
      <HistoryTree
        history={mockHistoryWithTree}
        onNodeSelect={mockOnNodeSelect}
      />
    );

    // node3 é uma nova branch (filho do node1, mas não o primeiro)
    expect(screen.getByText("BRANCH")).toBeInTheDocument();
  });
});
