import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as renameBranch } from "@/app/api/calculator/branches/rename/route";
import { POST as createBranch } from "@/app/api/calculator/branches/create/route";
import { DELETE as deleteBranch } from "@/app/api/calculator/branches/delete/route";

// Mock do Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    historyTree: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock do NextAuth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve({
    user: { id: "user123", email: "test@example.com" },
  })),
}));

describe("Branch API Tests", () => {
  let prisma: any;
  
  beforeEach(async () => {
    vi.clearAllMocks();
    const prismaModule = await import("@/lib/prisma");
    prisma = prismaModule.prisma;
  });

  const mockHistoryData = {
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

  describe("POST /api/calculator/branches/rename", () => {
    it("should rename branch successfully", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      (prisma.historyTree.update as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/calculator/branches/rename", {
        method: "POST",
        body: JSON.stringify({
          oldName: "feature-branch",
          newName: "new-feature-branch",
          nodeId: "node1",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await renameBranch(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        message: "Branch renomeada com sucesso",
        branch: {
          name: "new-feature-branch",
          nodeId: "node1",
        },
      });
    });

    it("should return 400 for missing fields", async () => {
      const request = new NextRequest("http://localhost:3000/api/calculator/branches/rename", {
        method: "POST",
        body: JSON.stringify({
          oldName: "feature-branch",
          // newName missing
          nodeId: "node1",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await renameBranch(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toMatchObject({
        error: "VALIDATION_ERROR",
        message: "Campos obrigatórios: oldName, newName, nodeId",
      });
    });

    it("should return 404 for non-existent branch", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/calculator/branches/rename", {
        method: "POST",
        body: JSON.stringify({
          oldName: "non-existent-branch",
          newName: "new-name",
          nodeId: "node1",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await renameBranch(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toMatchObject({
        error: "NOT_FOUND",
        message: "Branch não encontrada",
      });
    });

    it("should return 409 for duplicate branch name", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/calculator/branches/rename", {
        method: "POST",
        body: JSON.stringify({
          oldName: "feature-branch",
          newName: "main-branch", // Already exists
          nodeId: "node1",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await renameBranch(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data).toMatchObject({
        error: "CONFLICT",
        message: "Nome de branch já existe",
      });
    });
  });

  describe("POST /api/calculator/branches/create", () => {
    it("should create branch successfully", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      (prisma.historyTree.update as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/calculator/branches/create", {
        method: "POST",
        body: JSON.stringify({
          name: "experiment-branch",
          nodeId: "node1",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await createBranch(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        success: true,
        message: "Branch criada com sucesso",
        branch: {
          name: "experiment-branch",
          nodeId: "node1",
        },
      });
    });

    it("should return 400 for empty branch name", async () => {
      const request = new NextRequest("http://localhost:3000/api/calculator/branches/create", {
        method: "POST",
        body: JSON.stringify({
          name: "   ", // Whitespace only
          nodeId: "node1",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await createBranch(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toMatchObject({
        error: "VALIDATION_ERROR",
        message: "Nome da branch não pode ser vazio",
      });
    });

    it("should return 404 for non-existent node", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/calculator/branches/create", {
        method: "POST",
        body: JSON.stringify({
          name: "new-branch",
          nodeId: "non-existent-node",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await createBranch(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toMatchObject({
        error: "NOT_FOUND",
        message: "Nó não encontrado",
      });
    });

    it("should return 409 for duplicate branch name", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/calculator/branches/create", {
        method: "POST",
        body: JSON.stringify({
          name: "feature-branch", // Already exists
          nodeId: "node1",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await createBranch(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data).toMatchObject({
        error: "CONFLICT",
        message: "Nome de branch já existe",
      });
    });
  });

  describe("DELETE /api/calculator/branches/delete", () => {
    it("should delete branch successfully", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      (prisma.historyTree.update as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/calculator/branches/delete", {
        method: "DELETE",
        body: JSON.stringify({
          name: "feature-branch",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await deleteBranch(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        success: true,
        message: "Branch deletada com sucesso",
      });
    });

    it("should return 400 for missing branch name", async () => {
      const request = new NextRequest("http://localhost:3000/api/calculator/branches/delete", {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await deleteBranch(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toMatchObject({
        error: "VALIDATION_ERROR",
        message: "Campo obrigatório: name",
      });
    });

    it("should return 404 for non-existent branch", async () => {
      (prisma.historyTree.findUnique as any).mockResolvedValue({
        id: "tree123",
        userId: "user123",
        data: mockHistoryData,
        updatedAt: new Date(),
      });

      const request = new NextRequest("http://localhost:3000/api/calculator/branches/delete", {
        method: "DELETE",
        body: JSON.stringify({
          name: "non-existent-branch",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await deleteBranch(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toMatchObject({
        error: "NOT_FOUND",
        message: "Branch não encontrada",
      });
    });
  });
});
