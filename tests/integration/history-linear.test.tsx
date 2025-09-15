import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import { Calculator } from "@/components/calculator/Calculator";
import { HistoryPanel } from "@/components/calculator/HistoryPanel";

// Mock do NextAuth
const mockSession = {
  user: {
    id: "test-user-123",
    email: "test@example.com",
    name: "Test User",
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

// Mock do fetch para APIs
global.fetch = vi.fn();

describe("Histórico Linear Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve exibir lista linear de histórico sem botão "Árvore"', async () => {
    // Arrange
    const mockHistory = [
      {
        id: "hist-1",
        userId: "test-user-123",
        expression: "2 + 2",
        result: "4",
        createdAt: new Date("2025-01-27T10:00:00Z"),
        updatedAt: new Date("2025-01-27T10:00:00Z"),
      },
      {
        id: "hist-2",
        userId: "test-user-123",
        expression: "3 * 4",
        result: "12",
        createdAt: new Date("2025-01-27T09:00:00Z"),
        updatedAt: new Date("2025-01-27T09:00:00Z"),
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockHistory,
        pagination: {
          total: 2,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }),
    });

    // Act
    render(
      <SessionProvider session={mockSession}>
        <HistoryPanel />
      </SessionProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
      expect(screen.getByText("3 * 4")).toBeInTheDocument();
    });

    // Verificar que não há botão "Árvore"
    expect(screen.queryByText("🌳 Árvore")).not.toBeInTheDocument();
    expect(screen.queryByText("Árvore")).not.toBeInTheDocument();
  });

  it("deve permitir clicar em expressões do histórico para reutilizá-las", async () => {
    // Arrange
    const mockHistory = [
      {
        id: "hist-1",
        userId: "test-user-123",
        expression: "2 + 2",
        result: "4",
        createdAt: new Date("2025-01-27T10:00:00Z"),
        updatedAt: new Date("2025-01-27T10:00:00Z"),
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockHistory,
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }),
    });

    // Act
    render(
      <SessionProvider session={mockSession}>
        <Calculator />
      </SessionProvider>
    );

    // Aguardar histórico carregar
    await waitFor(() => {
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
    });

    // Clicar na expressão do histórico
    const historyEntry = screen.getByText("2 + 2");
    fireEvent.click(historyEntry);

    // Assert
    await waitFor(() => {
      // Verificar se a expressão foi carregada na calculadora
      const expressionInput = screen.getByDisplayValue("2 + 2");
      expect(expressionInput).toBeInTheDocument();
    });
  });

  it("deve adicionar novos cálculos ao topo da lista de histórico", async () => {
    // Arrange
    const initialHistory = [
      {
        id: "hist-1",
        userId: "test-user-123",
        expression: "2 + 2",
        result: "4",
        createdAt: new Date("2025-01-27T10:00:00Z"),
        updatedAt: new Date("2025-01-27T10:00:00Z"),
      },
    ];

    const updatedHistory = [
      {
        id: "hist-2",
        userId: "test-user-123",
        expression: "3 * 4",
        result: "12",
        createdAt: new Date("2025-01-27T11:00:00Z"),
        updatedAt: new Date("2025-01-27T11:00:00Z"),
      },
      ...initialHistory,
    ];

    // Mock inicial do histórico
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: initialHistory,
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }),
    });

    // Mock do cálculo
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        expression: "3 * 4",
        result: "12",
        historyEntry: updatedHistory[0],
      }),
    });

    // Mock do histórico atualizado
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: updatedHistory,
        pagination: {
          total: 2,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }),
    });

    // Act
    render(
      <SessionProvider session={mockSession}>
        <Calculator />
      </SessionProvider>
    );

    // Aguardar histórico inicial carregar
    await waitFor(() => {
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
    });

    // Inserir nova expressão
    const expressionInput = screen.getByRole("textbox");
    fireEvent.change(expressionInput, { target: { value: "3 * 4" } });

    // Clicar no botão de calcular
    const calculateButton = screen.getByText("=");
    fireEvent.click(calculateButton);

    // Assert
    await waitFor(() => {
      // Verificar se o novo cálculo aparece no topo
      const historyEntries = screen.getAllByText(/3 \* 4|2 \+ 2/);
      expect(historyEntries[0]).toHaveTextContent("3 * 4"); // Primeiro (mais recente)
      expect(historyEntries[1]).toHaveTextContent("2 + 2"); // Segundo (mais antigo)
    });
  });

  it("deve exibir interface simplificada sem funcionalidades de branches", async () => {
    // Arrange
    const mockHistory = [
      {
        id: "hist-1",
        userId: "test-user-123",
        expression: "2 + 2",
        result: "4",
        createdAt: new Date("2025-01-27T10:00:00Z"),
        updatedAt: new Date("2025-01-27T10:00:00Z"),
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockHistory,
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false,
        },
      }),
    });

    // Act
    render(
      <SessionProvider session={mockSession}>
        <HistoryPanel />
      </SessionProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
    });

    // Verificar ausência de funcionalidades de branches
    expect(screen.queryByText("Nomear Branch")).not.toBeInTheDocument();
    expect(screen.queryByText("Criar Branch")).not.toBeInTheDocument();
    expect(screen.queryByText("Deletar Branch")).not.toBeInTheDocument();
    expect(screen.queryByText("Renomear Branch")).not.toBeInTheDocument();
    expect(screen.queryByText("Branches")).not.toBeInTheDocument();
  });
});
