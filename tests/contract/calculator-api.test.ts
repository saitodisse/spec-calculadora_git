import { describe, it, expect } from "vitest";

// Este teste deve FALHAR inicialmente (sem implementação)
// Seguindo o princípio TDD: Red -> Green -> Refactor

describe("Calculator API Contract Tests", () => {
  const API_BASE_URL = "http://localhost:3000/api";

  describe("POST /calculator/calculate", () => {
    it("should calculate simple expression successfully", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "2 + 3 * 4",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        result: 14,
        executionTime: expect.any(Number),
        expression: "2 + 3 * 4",
      });
    });

    it("should calculate complex expression with parentheses", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "(10 + 5) * 2 / 3",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        result: 10,
        executionTime: expect.any(Number),
        expression: "(10 + 5) * 2 / 3",
      });
    });

    it("should return 400 for invalid expression", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "2 + * 4",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "INVALID_EXPRESSION",
        message: expect.any(String),
        details: expect.any(String),
      });
    });

    it("should return 400 for empty expression", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "INVALID_EXPRESSION",
        message: expect.any(String),
      });
    });

    it("should return 400 for expression with invalid characters", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "2 + x * 4",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "INVALID_EXPRESSION",
        message: expect.any(String),
        details: expect.stringContaining("x"),
      });
    });

    it("should handle division by zero", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "10 / 0",
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: "INVALID_EXPRESSION",
        message: expect.stringContaining("divisão por zero"),
      });
    });
  });

  describe("GET /calculator/history", () => {
    it("should return history entries with pagination", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/history?page=1&limit=20`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        entries: expect.any(Array),
        pagination: {
          page: 1,
          limit: 20,
          total: expect.any(Number),
          totalPages: expect.any(Number),
        },
      });
    });

    it("should return history entries for specific user", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/history?userId=user123&page=1&limit=10`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.entries).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: "user123",
          }),
        ])
      );
    });

    it("should handle pagination correctly", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/history?page=2&limit=5`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pagination).toMatchObject({
        page: 2,
        limit: 5,
      });
    });
  });

  describe("POST /calculator/history", () => {
    it("should add entry to history successfully", async () => {
      const entryData = {
        expression: "2 + 3 * 4",
        result: 14,
        executionTime: 5,
      };

      const response = await fetch(`${API_BASE_URL}/calculator/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toMatchObject({
        id: expect.any(String),
        timestamp: expect.any(String),
        expression: "2 + 3 * 4",
        result: 14,
        executionTime: 5,
      });
    });

    it("should return 400 for invalid entry data", async () => {
      const invalidData = {
        expression: "",
        result: "invalid",
        executionTime: -1,
      };

      const response = await fetch(`${API_BASE_URL}/calculator/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });
  });

  describe("POST /calculator/validate", () => {
    it("should validate correct expression", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "2 + 3 * 4",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        isValid: true,
        message: "Expressão válida",
      });
    });

    it("should reject invalid expression", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "2 + * 4",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        isValid: false,
        message: expect.any(String),
        position: expect.any(Number),
      });
    });

    it("should reject expression with invalid characters", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "2 + x * 4",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        isValid: false,
        message: expect.stringContaining("caracteres inválidos"),
      });
    });

    it("should reject empty expression", async () => {
      const response = await fetch(`${API_BASE_URL}/calculator/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toMatchObject({
        isValid: false,
        message: expect.stringContaining("vazia"),
      });
    });
  });

  describe("Performance Requirements", () => {
    it("should calculate simple expression within 100ms", async () => {
      const startTime = Date.now();

      const response = await fetch(`${API_BASE_URL}/calculator/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: "2 + 3",
        }),
      });

      const executionTime = Date.now() - startTime;
      expect(executionTime).toBeLessThan(100);
      expect(response.status).toBe(200);
    });

    it("should handle concurrent requests", async () => {
      const promises = Array.from({ length: 10 }, () =>
        fetch(`${API_BASE_URL}/calculator/calculate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expression: "2 + 3",
          }),
        })
      );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });
  });
});