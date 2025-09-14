import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BranchList } from "@/components/calculator/BranchList";
import { HistoryTreeData } from "@/types/calculator";

// Mock do console.debug para evitar logs durante os testes
const mockConsoleDebug = vi.fn();
Object.defineProperty(console, 'debug', {
  value: mockConsoleDebug,
  writable: true
});

describe("BranchList Component", () => {
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

  it("should render list of branches", () => {
    render(
      <BranchList
        history={mockHistoryWithBranches}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    expect(screen.getByText("feature-branch")).toBeInTheDocument();
    expect(screen.getByText("main-branch")).toBeInTheDocument();
  });

  it("should highlight current branch (HEAD)", () => {
    render(
      <BranchList
        history={mockHistoryWithBranches}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    const branchItems = screen.getAllByTestId("branch-item");
    const mainBranchItem = branchItems[0]; // First item is the HEAD branch
    expect(mainBranchItem).toHaveClass("bg-blue-100", "text-blue-800");
  });

  it("should call onBranchSelect when branch is clicked", () => {
    render(
      <BranchList
        history={mockHistoryWithBranches}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    const featureBranch = screen.getByText("feature-branch");
    fireEvent.click(featureBranch);

    expect(mockOnBranchSelect).toHaveBeenCalledWith("node1");
  });

  it("should show rename button for each branch", () => {
    render(
      <BranchList
        history={mockHistoryWithBranches}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    const renameButtons = screen.getAllByRole("button", { name: /renomear/i });
    expect(renameButtons).toHaveLength(2);
  });

  it("should call onBranchRename when rename button is clicked", () => {
    render(
      <BranchList
        history={mockHistoryWithBranches}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    const renameButtons = screen.getAllByRole("button", { name: /renomear/i });
    fireEvent.click(renameButtons[0]); // First button is for main-branch (HEAD)

    expect(mockOnBranchRename).toHaveBeenCalledWith("main-branch", "node2");
  });

  it("should display branch expressions", () => {
    render(
      <BranchList
        history={mockHistoryWithBranches}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    expect(screen.getByText("2 + 3 = 5")).toBeInTheDocument();
    expect(screen.getByText("5 * 2 = 10")).toBeInTheDocument();
  });

  it("should handle empty branches", () => {
    const historyWithoutBranches: HistoryTreeData = {
      ...mockHistoryWithBranches,
      branches: {},
    };

    render(
      <BranchList
        history={historyWithoutBranches}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    expect(screen.getByText("Nenhuma branch nomeada")).toBeInTheDocument();
  });

  it("should sort branches by creation time (newest first)", () => {
    const historyWithTimestamps: HistoryTreeData = {
      nodes: {
        "node1": {
          id: "node1",
          parentId: null,
          timestamp: Date.now() - 3000,
          expression: "1 + 1",
          result: 2,
        },
        "node2": {
          id: "node2",
          parentId: null,
          timestamp: Date.now() - 1000,
          expression: "2 + 2",
          result: 4,
        },
        "node3": {
          id: "node3",
          parentId: null,
          timestamp: Date.now() - 2000,
          expression: "3 + 3",
          result: 6,
        },
      },
      head: "node2",
      branches: {
        "old-branch": "node1",
        "new-branch": "node2",
        "middle-branch": "node3",
      },
    };

    render(
      <BranchList
        history={historyWithTimestamps}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    const branchItems = screen.getAllByTestId("branch-item");
    expect(branchItems[0]).toHaveTextContent("new-branch");
    expect(branchItems[1]).toHaveTextContent("middle-branch");
    expect(branchItems[2]).toHaveTextContent("old-branch");
  });

  it("should handle null history gracefully", () => {
    render(
      <BranchList
        history={null}
        onBranchSelect={mockOnBranchSelect}
        onBranchRename={mockOnBranchRename}
      />
    );

    expect(screen.getByText("Nenhuma branch nomeada")).toBeInTheDocument();
  });
});
