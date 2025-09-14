import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";
import { HistoryTreeData } from "@/types/calculator";

// Mock do console.debug para evitar logs durante os testes
const mockConsoleDebug = vi.fn();
Object.defineProperty(console, 'debug', {
  value: mockConsoleDebug,
  writable: true
});

describe("HistoryPanel Branch Integration", () => {
  const mockOnHistoryItemClick = vi.fn();
  const mockOnBranchName = vi.fn();
  const mockOnBranchSelect = vi.fn();
  const mockOnBranchRename = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleDebug.mockClear();
  });

  const mockHistoryWithBranches: HistoryTreeData = {
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
    branches: {
      "feature-branch": "node1",
      "main-branch": "node2",
    },
  };

  it("should render BranchList when branches exist", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    expect(screen.getByText("Branches Nomeadas")).toBeInTheDocument();
    expect(screen.getByText("feature-branch")).toBeInTheDocument();
    expect(screen.getByText("main-branch")).toBeInTheDocument();
  });

  it("should not render BranchList when no branches exist", () => {
    const historyWithoutBranches: HistoryTreeData = {
      ...mockHistoryWithBranches,
      branches: {},
    };

    render(
      <HistoryPanel
        history={historyWithoutBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    expect(screen.queryByText("Branches Nomeadas")).not.toBeInTheDocument();
  });

  it("should highlight selected history item", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // Click on first history item
    const historyItems = screen.getAllByText(/2 \+ 3|5 \* 2/);
    fireEvent.click(historyItems[0]);

    // Check if item is highlighted
    const selectedItem = screen.getByText("Selecionado");
    expect(selectedItem).toBeInTheDocument();
  });

  it("should call onBranchSelect when branch is selected", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // Click on a branch
    const featureBranch = screen.getByText("feature-branch");
    fireEvent.click(featureBranch);

    expect(mockOnBranchSelect).toHaveBeenCalledWith("node1");
  });

  it("should call onBranchRename when branch rename is requested", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // Click on rename button
    const renameButtons = screen.getAllByRole("button", { name: /renomear/i });
    fireEvent.click(renameButtons[0]);

    expect(mockOnBranchRename).toHaveBeenCalledWith("main-branch", "node2");
  });

  it("should update selected node when history item is clicked", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // Click on first history item (5 * 2 = 10)
    const historyItems = screen.getAllByText(/2 \+ 3|5 \* 2/);
    fireEvent.click(historyItems[0]);

    // Verificar se o item foi selecionado visualmente
    expect(screen.getByText("Selecionado")).toBeInTheDocument();
  });

  it("should show branch creation modal", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // First select a node to enable the button
    const historyItems = screen.getAllByText(/2 \+ 3|5 \* 2/);
    fireEvent.click(historyItems[0]);

    // Click on "Nomear Branch" button
    const nameBranchButton = screen.getByText("🌿 Nomear Branch");
    fireEvent.click(nameBranchButton);

    expect(screen.getByPlaceholderText("Ex: Cálculos de juros, Projeto X, etc.")).toBeInTheDocument();
  });

  it("should handle branch creation", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // First select a node
    const historyItems = screen.getAllByText(/2 \+ 3|5 \* 2/);
    fireEvent.click(historyItems[0]);

    // Open modal
    const nameBranchButton = screen.getByText("🌿 Nomear Branch");
    fireEvent.click(nameBranchButton);

    // Enter branch name
    const input = screen.getByPlaceholderText("Ex: Cálculos de juros, Projeto X, etc.");
    fireEvent.change(input, { target: { value: "test-branch" } });

    // Submit
    const saveButton = screen.getByText("Salvar");
    fireEvent.click(saveButton);

    expect(mockOnBranchName).toHaveBeenCalledWith("test-branch", "node2");
  });

  it("should cancel branch creation", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // First select a node to enable the button
    const historyItems = screen.getAllByText(/2 \+ 3|5 \* 2/);
    fireEvent.click(historyItems[0]);

    // Open modal
    const nameBranchButton = screen.getByText("🌿 Nomear Branch");
    fireEvent.click(nameBranchButton);

    // Cancel
    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    // Modal should be closed (input should not be visible)
    expect(screen.queryByPlaceholderText("Ex: Cálculos de juros, Projeto X, etc.")).not.toBeInTheDocument();
  });

  it("should switch between list and tree view", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // Should start in list view
    expect(screen.getByText("📋 Lista")).toBeInTheDocument();
    expect(screen.getByText("🌳 Árvore")).toBeInTheDocument();

    // Switch to tree view
    const treeButton = screen.getByText("🌳 Árvore");
    fireEvent.click(treeButton);

    // Should show tree structure
    expect(screen.getByText("🌳 Árvore de Histórico")).toBeInTheDocument();
  });

  it("should not show name branch button when no node is selected", () => {
    render(
      <HistoryPanel
        history={mockHistoryWithBranches}
        onHistoryItemClick={mockOnHistoryItemClick}
        onBranchName={mockOnBranchName}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    // Button should not be visible initially
    expect(screen.queryByText("🌿 Nomear Branch")).not.toBeInTheDocument();
  });
});
