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

describe("Histórico Sincronização Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock do NextAuth
    vi.mock("next-auth/react", () => ({
      useSession: () => ({ data: mockSession, status: "authenticated" }),
      SessionProvider: ({ children }: { children: React.ReactNode }) => children,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve atualizar o histórico quando uma expressão é calculada com ENTER", async () => {
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

    // Mock das chamadas de API
    vi.mocked(fetch)
      .mockResolvedValueOnce({
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
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expression: "3 * 4",
          result: "12",
          historyEntry: updatedHistory[0],
        }),
      } as Response)
      .mockResolvedValueOnce({
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
      } as Response);

    // Act
    render(
      <SessionProvider session={mockSession}>
        <div>
          <Calculator onCalculationComplete={() => {}} />
          <HistoryPanel refreshTrigger={0} />
        </div>
      </SessionProvider>
    );

    // Aguardar histórico inicial carregar
    await waitFor(() => {
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
    });

    // Inserir nova expressão
    const expressionInput = screen.getByRole("textbox");
    fireEvent.change(expressionInput, { target: { value: "3 * 4" } });

    // Pressionar ENTER para calcular
    fireEvent.keyDown(expressionInput, { key: "Enter", code: "Enter" });

    // Assert
    await waitFor(() => {
      // Verificar se o novo cálculo aparece no histórico
      expect(screen.getByText("3 * 4")).toBeInTheDocument();
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
    });

    // Verificar se o histórico foi atualizado (mais recente primeiro)
    const historyEntries = screen.getAllByText(/3 \* 4|2 \+ 2/);
    expect(historyEntries[0]).toHaveTextContent("3 * 4"); // Primeiro (mais recente)
    expect(historyEntries[1]).toHaveTextContent("2 + 2"); // Segundo (mais antigo)
  });

  it("deve atualizar o histórico quando uma expressão é calculada com botão =", async () => {
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
        expression: "5 + 5",
        result: "10",
        createdAt: new Date("2025-01-27T11:00:00Z"),
        updatedAt: new Date("2025-01-27T11:00:00Z"),
      },
      ...initialHistory,
    ];

    // Mock das chamadas de API
    vi.mocked(fetch)
      .mockResolvedValueOnce({
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
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expression: "5 + 5",
          result: "10",
          historyEntry: updatedHistory[0],
        }),
      } as Response)
      .mockResolvedValueOnce({
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
      } as Response);

    // Act
    render(
      <SessionProvider session={mockSession}>
        <div>
          <Calculator onCalculationComplete={() => {}} />
          <HistoryPanel refreshTrigger={0} />
        </div>
      </SessionProvider>
    );

    // Aguardar histórico inicial carregar
    await waitFor(() => {
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
    });

    // Inserir nova expressão
    const expressionInput = screen.getByRole("textbox");
    fireEvent.change(expressionInput, { target: { value: "5 + 5" } });

    // Clicar no botão =
    const calculateButton = screen.getByText("=");
    fireEvent.click(calculateButton);

    // Assert
    await waitFor(() => {
      // Verificar se o novo cálculo aparece no histórico
      expect(screen.getByText("5 + 5")).toBeInTheDocument();
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
    });

    // Verificar se o histórico foi atualizado (mais recente primeiro)
    const historyEntries = screen.getAllByText(/5 \+ 5|2 \+ 2/);
    expect(historyEntries[0]).toHaveTextContent("5 + 5"); // Primeiro (mais recente)
    expect(historyEntries[1]).toHaveTextContent("2 + 2"); // Segundo (mais antigo)
  });

  it("deve manter sincronização entre múltiplos cálculos consecutivos", async () => {
    // Arrange
    const initialHistory = [
      {
        id: "hist-1",
        userId: "test-user-123",
        expression: "1 + 1",
        result: "2",
        createdAt: new Date("2025-01-27T10:00:00Z"),
        updatedAt: new Date("2025-01-27T10:00:00Z"),
      },
    ];

    const afterFirstCalc = [
      {
        id: "hist-2",
        userId: "test-user-123",
        expression: "2 + 2",
        result: "4",
        createdAt: new Date("2025-01-27T11:00:00Z"),
        updatedAt: new Date("2025-01-27T11:00:00Z"),
      },
      ...initialHistory,
    ];

    const afterSecondCalc = [
      {
        id: "hist-3",
        userId: "test-user-123",
        expression: "3 + 3",
        result: "6",
        createdAt: new Date("2025-01-27T12:00:00Z"),
        updatedAt: new Date("2025-01-27T12:00:00Z"),
      },
      ...afterFirstCalc,
    ];

    // Mock das chamadas de API
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: initialHistory,
          pagination: { total: 1, limit: 20, offset: 0, hasMore: false },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expression: "2 + 2",
          result: "4",
          historyEntry: afterFirstCalc[0],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: afterFirstCalc,
          pagination: { total: 2, limit: 20, offset: 0, hasMore: false },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          expression: "3 + 3",
          result: "6",
          historyEntry: afterSecondCalc[0],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: afterSecondCalc,
          pagination: { total: 3, limit: 20, offset: 0, hasMore: false },
        }),
      } as Response);

    // Act
    render(
      <SessionProvider session={mockSession}>
        <div>
          <Calculator onCalculationComplete={() => {}} />
          <HistoryPanel refreshTrigger={0} />
        </div>
      </SessionProvider>
    );

    // Aguardar histórico inicial carregar
    await waitFor(() => {
      expect(screen.getByText("1 + 1")).toBeInTheDocument();
    });

    // Primeiro cálculo
    const expressionInput = screen.getByRole("textbox");
    fireEvent.change(expressionInput, { target: { value: "2 + 2" } });
    fireEvent.keyDown(expressionInput, { key: "Enter", code: "Enter" });

    // Aguardar primeiro cálculo aparecer
    await waitFor(() => {
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
      expect(screen.getByText("1 + 1")).toBeInTheDocument();
    });

    // Segundo cálculo
    fireEvent.change(expressionInput, { target: { value: "3 + 3" } });
    fireEvent.keyDown(expressionInput, { key: "Enter", code: "Enter" });

    // Assert
    await waitFor(() => {
      // Verificar se todos os cálculos aparecem no histórico
      expect(screen.getByText("3 + 3")).toBeInTheDocument();
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
      expect(screen.getByText("1 + 1")).toBeInTheDocument();
    });

    // Verificar ordem correta (mais recente primeiro)
    const historyEntries = screen.getAllByText(/3 \+ 3|2 \+ 2|1 \+ 1/);
    expect(historyEntries[0]).toHaveTextContent("3 + 3"); // Mais recente
    expect(historyEntries[1]).toHaveTextContent("2 + 2"); // Meio
    expect(historyEntries[2]).toHaveTextContent("1 + 1"); // Mais antigo
  });

  it("deve atualizar o histórico quando expressão é clicada no histórico", async () => {
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

    // Mock das chamadas de API
    vi.mocked(fetch).mockResolvedValueOnce({
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
    } as Response);

    // Act
    render(
      <SessionProvider session={mockSession}>
        <div>
          <Calculator onCalculationComplete={() => {}} />
          <HistoryPanel refreshTrigger={0} />
        </div>
      </SessionProvider>
    );

    // Aguardar histórico carregar
    await waitFor(() => {
      expect(screen.getByText("2 + 2")).toBeInTheDocument();
      expect(screen.getByText("3 * 4")).toBeInTheDocument();
    });

    // Clicar na expressão do histórico
    const historyEntry = screen.getByText("3 * 4");
    fireEvent.click(historyEntry);

    // Assert
    await waitFor(() => {
      // Verificar se a expressão foi carregada na calculadora
      const expressionInput = screen.getByDisplayValue("3 * 4");
      expect(expressionInput).toBeInTheDocument();
    });
  });
});
