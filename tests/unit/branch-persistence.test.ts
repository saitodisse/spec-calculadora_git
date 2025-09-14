import { describe, it, expect, beforeEach, vi } from "vitest";
import { getHistory, saveHistory } from "@/actions/history";
import { HistoryTreeData } from "@/types/calculator";

// Mock do Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    historyTree: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

// Mock do NextAuth
vi.mock("next-auth", () => ({
  default: vi.fn(() => ({
    handlers: {},
    auth: vi.fn(() => Promise.resolve({
      user: { id: "user123", email: "test@example.com" },
    })),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}));

describe("Branch Persistence Tests", () => {
  let prisma: any;
  
  beforeEach(async () => {
    vi.clearAllMocks();
    const prismaModule = await import("@/lib/prisma");
    prisma = prismaModule.prisma;
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

  describe("saveHistory with branches", () => {
    it("should save history with branches correctly", async () => {
      (prisma.historyTree.upsert as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryWithBranches,
        updatedAt: new Date(),
      });

      await saveHistory(mockHistoryWithBranches);

      expect(prisma.historyTree.upsert).toHaveBeenCalledWith({
        where: { userId: "user123" },
        update: {
          data: mockHistoryWithBranches,
        },
        create: {
          userId: "user123",
          data: mockHistoryWithBranches,
        },
      });
    });

    it("should preserve branch structure when saving", async () => {
      (prisma.historyTree.upsert as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryWithBranches,
        updatedAt: new Date(),
      });

      await saveHistory(mockHistoryWithBranches);

      const savedData = (prisma.historyTree.upsert as any).mock.calls[0][0].update.data;
      expect(savedData.branches).toEqual({
        "feature-branch": "node1",
        "main-branch": "node2",
      });
    });

    it("should handle empty branches object", async () => {
      const historyWithoutBranches: HistoryTreeData = {
        ...mockHistoryWithBranches,
        branches: {},
      };

      (prisma.historyTree.upsert as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: historyWithoutBranches,
        updatedAt: new Date(),
      });

      await saveHistory(historyWithoutBranches);

      const savedData = (prisma.historyTree.upsert as any).mock.calls[0][0].update.data;
      expect(savedData.branches).toEqual({});
    });
  });

  describe("getHistory with branches", () => {
    it("should retrieve history with branches correctly", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryWithBranches,
        updatedAt: new Date(),
      });

      const result = await getHistory();

      expect(prisma.historyTree.findUnique).toHaveBeenCalledWith({
        where: { userId: "user123" },
      });

      expect(result).toEqual(mockHistoryWithBranches);
      expect(result?.branches).toEqual({
        "feature-branch": "node1",
        "main-branch": "node2",
      });
    });

    it("should return default history when no history exists", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue(null);

      const result = await getHistory();

      expect(result).not.toBeNull();
      expect(result?.nodes).toHaveProperty("root");
      expect(result?.head).toBe("root");
      expect(result?.branches).toEqual({});
    });

    it("should handle history without branches", async () => {
      const historyWithoutBranches = {
        ...mockHistoryWithBranches,
        branches: {},
      };

      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: historyWithoutBranches,
        updatedAt: new Date(),
      });

      const result = await getHistory();

      expect(result?.branches).toEqual({});
    });
  });

  describe("branch integrity validation", () => {
    it("should maintain referential integrity between branches and nodes", async () => {
      // Teste que todas as branches referenciam nós existentes
      const validHistory: HistoryTreeData = {
        nodes: {
          "node1": {
            id: "node1",
            parentId: null,
            timestamp: Date.now(),
            expression: "1 + 1",
            result: 2,
          },
        },
        head: "node1",
        branches: {
          "valid-branch": "node1", // Referencia nó existente
        },
      };

      (prisma.historyTree.upsert as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: validHistory,
        updatedAt: new Date(),
      });

      await saveHistory(validHistory);

      const savedData = (prisma.historyTree.upsert as any).mock.calls[0][0].update.data;
      expect(savedData.branches["valid-branch"]).toBe("node1");
      expect(savedData.nodes["node1"]).toBeDefined();
    });

    it("should handle branch names with special characters", async () => {
      const historyWithSpecialBranches: HistoryTreeData = {
        ...mockHistoryWithBranches,
        branches: {
          "feature-branch": "node1",
          "main-branch": "node2",
          "experiment_123": "node1",
          "test-branch-v2": "node2",
        },
      };

      (prisma.historyTree.upsert as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: historyWithSpecialBranches,
        updatedAt: new Date(),
      });

      await saveHistory(historyWithSpecialBranches);

      const savedData = (prisma.historyTree.upsert as any).mock.calls[0][0].update.data;
      expect(savedData.branches).toEqual({
        "feature-branch": "node1",
        "main-branch": "node2",
        "experiment_123": "node1",
        "test-branch-v2": "node2",
      });
    });
  });

  describe("error handling", () => {
    it("should handle database errors gracefully", async () => {
      (prisma.historyTree.upsert as any).mockRejectedValue(new Error("Database connection failed"));

      await expect(saveHistory(mockHistoryWithBranches)).rejects.toThrow("Failed to save history");
    });

    it("should handle getHistory database errors", async () => {
      (prisma.historyTree.findUnique as any).mockRejectedValue(new Error("Database connection failed"));

      const result = await getHistory();
      expect(result).toBeNull();
    });
  });
});
