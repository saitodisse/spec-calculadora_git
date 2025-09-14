import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BranchRenameModal } from "@/components/calculator/BranchRenameModal";

describe("BranchRenameModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnRename = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render when open", () => {
    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    expect(screen.getByText("🔄 Renomear Branch")).toBeInTheDocument();
    expect(screen.getByText(/Renomeie a branch/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("feature-branch")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      <BranchRenameModal
        isOpen={false}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    expect(screen.queryByText("🔄 Renomear Branch")).not.toBeInTheDocument();
  });

  it("should initialize with current branch name", () => {
    render(
      <BranchRenameModal
        isOpen={true}
        branchName="test-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    expect(screen.getByDisplayValue("test-branch")).toBeInTheDocument();
  });

  it("should call onRename when form is submitted", async () => {
    mockOnRename.mockResolvedValue(undefined);

    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const input = screen.getByDisplayValue("feature-branch");
    fireEvent.change(input, { target: { value: "new-branch-name" } });

    const submitButton = screen.getByText("Renomear");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnRename).toHaveBeenCalledWith("feature-branch", "new-branch-name", "node1");
    });
  });

  it("should call onClose after successful rename", async () => {
    mockOnRename.mockResolvedValue(undefined);

    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const input = screen.getByDisplayValue("feature-branch");
    fireEvent.change(input, { target: { value: "new-branch-name" } });

    const submitButton = screen.getByText("Renomear");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should show error when rename fails", async () => {
    const errorMessage = "Nome já existe";
    mockOnRename.mockRejectedValue(new Error(errorMessage));

    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const input = screen.getByDisplayValue("feature-branch");
    fireEvent.change(input, { target: { value: "new-branch-name" } });

    const submitButton = screen.getByText("Renomear");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should show error for empty name", () => {
    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const input = screen.getByDisplayValue("feature-branch");
    fireEvent.change(input, { target: { value: "   " } }); // Whitespace only

    const submitButton = screen.getByText("Renomear");
    fireEvent.click(submitButton);

    // Verificar que o botão está desabilitado (indica validação)
    expect(submitButton).toBeDisabled();
    expect(mockOnRename).not.toHaveBeenCalled();
  });

  it("should close when same name is entered", async () => {
    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const submitButton = screen.getByText("Renomear");
    fireEvent.click(submitButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnRename).not.toHaveBeenCalled();
  });

  it("should handle cancel button", () => {
    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should handle Enter key", async () => {
    mockOnRename.mockResolvedValue(undefined);

    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const input = screen.getByDisplayValue("feature-branch");
    fireEvent.change(input, { target: { value: "new-branch-name" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(mockOnRename).toHaveBeenCalledWith("feature-branch", "new-branch-name", "node1");
    });
  });

  it("should handle Escape key", () => {
    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const input = screen.getByDisplayValue("feature-branch");
    fireEvent.keyDown(input, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should show loading state during rename", async () => {
    let resolveRename: () => void;
    const renamePromise = new Promise<void>((resolve) => {
      resolveRename = resolve;
    });
    mockOnRename.mockReturnValue(renamePromise);

    render(
      <BranchRenameModal
        isOpen={true}
        branchName="feature-branch"
        nodeId="node1"
        onClose={mockOnClose}
        onRename={mockOnRename}
      />
    );

    const input = screen.getByDisplayValue("feature-branch");
    fireEvent.change(input, { target: { value: "new-branch-name" } });

    const submitButton = screen.getByText("Renomear");
    fireEvent.click(submitButton);

    expect(screen.getByText("Renomeando...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    resolveRename!();
    await waitFor(() => {
      expect(screen.queryByText("Renomeando...")).not.toBeInTheDocument();
    });
  });
});
