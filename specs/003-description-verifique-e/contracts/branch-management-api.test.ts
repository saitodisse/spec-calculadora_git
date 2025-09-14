import { describe, it, expect } from "vitest";

describe("Branch Management API Contract Tests", () => {
  const API_BASE_URL = "http://localhost:3000/api";

  describe("GET /calculator/history", () => {
    it("should return history with branches for authenticated user", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/history`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toMatchObject({
        nodes: expect.any(Object),
        head: expect.any(String),
        branches: expect.any(Object),
      });

      // Verificar estrutura dos nós
      Object.values(data.nodes).forEach((node: any) => {
        expect(node).toMatchObject({
          id: expect.any(String),
          parentId: expect.any(String).or(null),
          timestamp: expect.any(Number),
          expression: expect.any(String),
          result: expect.any(Number),
        });
      });

      // Verificar que head aponta para um nó existente
      expect(data.nodes[data.head]).toBeDefined();

      // Verificar que branches apontam para nós existentes
      Object.values(data.branches).forEach((nodeId: any) => {
        expect(data.nodes[nodeId]).toBeDefined();
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "UNAUTHORIZED",
        message: expect.stringContaining("não autenticado"),
      });
    });
  });

  describe("POST /calculator/branches/rename", () => {
    it("should rename branch successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/rename`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldName: "feature-branch",
          newName: "new-feature-branch",
          nodeId: "node1",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toMatchObject({
        success: true,
        message: expect.stringContaining("renomeada"),
        branch: {
          name: "new-feature-branch",
          nodeId: "node1",
        },
      });
    });

    it("should return 400 for invalid request body", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/rename`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldName: "feature-branch",
          // newName missing
          nodeId: "node1",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "VALIDATION_ERROR",
        message: expect.any(String),
      });
    });

    it("should return 404 for non-existent branch", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/rename`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldName: "non-existent-branch",
          newName: "new-name",
          nodeId: "node1",
        }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "NOT_FOUND",
        message: expect.stringContaining("não encontrada"),
      });
    });

    it("should return 409 for duplicate branch name", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/rename`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldName: "feature-branch",
          newName: "existing-branch",
          nodeId: "node1",
        }),
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "CONFLICT",
        message: expect.stringContaining("já existe"),
      });
    });
  });

  describe("POST /calculator/branches/create", () => {
    it("should create new branch successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/create`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "experiment-branch",
          nodeId: "node1",
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      
      expect(data).toMatchObject({
        success: true,
        message: expect.stringContaining("criada"),
        branch: {
          name: "experiment-branch",
          nodeId: "node1",
        },
      });
    });

    it("should return 400 for invalid branch name", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/create`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "", // Empty name
          nodeId: "node1",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "VALIDATION_ERROR",
        message: expect.any(String),
      });
    });

    it("should return 404 for non-existent node", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/create`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "new-branch",
          nodeId: "non-existent-node",
        }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "NOT_FOUND",
        message: expect.stringContaining("não encontrado"),
      });
    });

    it("should return 409 for duplicate branch name", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/create`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "existing-branch",
          nodeId: "node1",
        }),
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "CONFLICT",
        message: expect.stringContaining("já existe"),
      });
    });
  });

  describe("DELETE /calculator/branches/delete", () => {
    it("should delete branch successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "old-branch",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toMatchObject({
        success: true,
        message: expect.stringContaining("deletada"),
      });
    });

    it("should return 404 for non-existent branch", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "non-existent-branch",
        }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "NOT_FOUND",
        message: expect.stringContaining("não encontrada"),
      });
    });

    it("should return 400 for missing branch name", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/branches/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "VALIDATION_ERROR",
        message: expect.any(String),
      });
    });
  });

  describe("Branch Persistence Tests", () => {
    it("should persist branch operations correctly", async () => {
      // 1. Criar uma branch
      const createResponse = await fetch(`${API_BASE_URL}/calculator/branches/create`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "test-branch",
          nodeId: "node1",
        }),
      });

      expect(createResponse.status).toBe(201);

      // 2. Verificar se a branch foi persistida
      const historyResponse = await fetch(`${API_BASE_URL}/calculator/history`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
      });

      expect(historyResponse.status).toBe(200);
      const historyData = await historyResponse.json();
      expect(historyData.branches["test-branch"]).toBe("node1");

      // 3. Renomear a branch
      const renameResponse = await fetch(`${API_BASE_URL}/calculator/branches/rename`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldName: "test-branch",
          newName: "renamed-branch",
          nodeId: "node1",
        }),
      });

      expect(renameResponse.status).toBe(200);

      // 4. Verificar se a renomeação foi persistida
      const updatedHistoryResponse = await fetch(`${API_BASE_URL}/calculator/history`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
      });

      expect(updatedHistoryResponse.status).toBe(200);
      const updatedHistoryData = await updatedHistoryResponse.json();
      expect(updatedHistoryData.branches["test-branch"]).toBeUndefined();
      expect(updatedHistoryData.branches["renamed-branch"]).toBe("node1");

      // 5. Deletar a branch
      const deleteResponse = await fetch(`${API_BASE_URL}/calculator/branches/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "renamed-branch",
        }),
      });

      expect(deleteResponse.status).toBe(200);

      // 6. Verificar se a deleção foi persistida
      const finalHistoryResponse = await fetch(`${API_BASE_URL}/calculator/history`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer valid-jwt-token",
          "Content-Type": "application/json",
        },
      });

      expect(finalHistoryResponse.status).toBe(200);
      const finalHistoryData = await finalHistoryResponse.json();
      expect(finalHistoryData.branches["renamed-branch"]).toBeUndefined();
    });
  });
});
