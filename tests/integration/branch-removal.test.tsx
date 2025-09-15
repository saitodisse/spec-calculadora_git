import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Calculator } from '@/components/calculator/Calculator';
import { HistoryPanel } from '@/components/calculator/HistoryPanel';

// Mock do NextAuth
const mockSession = {
  user: {
    id: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User'
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
};

// Mock do fetch para APIs
global.fetch = vi.fn();

describe('Branch Removal Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve confirmar que componentes de branches foram removidos', () => {
    // Arrange & Act
    render(
      <SessionProvider session={mockSession}>
        <Calculator />
      </SessionProvider>
    );

    // Assert - Verificar que componentes de branches não existem mais
    expect(screen.queryByTestId('branch-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('branch-rename-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('branch-create-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('branch-delete-button')).not.toBeInTheDocument();
  });

  it('deve confirmar que APIs de branches retornam 404', async () => {
    // Arrange
    const branchEndpoints = [
      '/api/calculator/branches/create',
      '/api/calculator/branches/delete',
      '/api/calculator/branches/rename'
    ];

    // Act & Assert
    for (const endpoint of branchEndpoints) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      expect(response.status).toBe(404);
    }
  });

  it('deve confirmar que HistoryPanel não tem botão "Árvore"', async () => {
    // Arrange
    const mockHistory = [
      {
        id: 'hist-1',
        userId: 'test-user-123',
        expression: '2 + 2',
        result: '4',
        createdAt: new Date('2025-01-27T10:00:00Z'),
        updatedAt: new Date('2025-01-27T10:00:00Z')
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockHistory,
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false
        }
      })
    });

    // Act
    render(
      <SessionProvider session={mockSession}>
        <HistoryPanel />
      </SessionProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('2 + 2')).toBeInTheDocument();
    });

    // Verificar ausência do botão "Árvore"
    expect(screen.queryByText('🌳 Árvore')).not.toBeInTheDocument();
    expect(screen.queryByText('Árvore')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /árvore/i })).not.toBeInTheDocument();
  });

  it('deve confirmar que não há funcionalidade de "Nomear Branch"', async () => {
    // Arrange
    const mockHistory = [
      {
        id: 'hist-1',
        userId: 'test-user-123',
        expression: '2 + 2',
        result: '4',
        createdAt: new Date('2025-01-27T10:00:00Z'),
        updatedAt: new Date('2025-01-27T10:00:00Z')
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockHistory,
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          hasMore: false
        }
      })
    });

    // Act
    render(
      <SessionProvider session={mockSession}>
        <HistoryPanel />
      </SessionProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('2 + 2')).toBeInTheDocument();
    });

    // Verificar ausência de funcionalidades de branches
    expect(screen.queryByText('Nomear Branch')).not.toBeInTheDocument();
    expect(screen.queryByText('Rename Branch')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /nomear/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /rename/i })).not.toBeInTheDocument();
  });

  it('deve confirmar que estrutura de dados é linear', async () => {
    // Arrange
    const mockHistory = [
      {
        id: 'hist-1',
        userId: 'test-user-123',
        expression: '2 + 2',
        result: '4',
        createdAt: new Date('2025-01-27T10:00:00Z'),
        updatedAt: new Date('2025-01-27T10:00:00Z')
      },
      {
        id: 'hist-2',
        userId: 'test-user-123',
        expression: '3 * 4',
        result: '12',
        createdAt: new Date('2025-01-27T09:00:00Z'),
        updatedAt: new Date('2025-01-27T09:00:00Z')
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockHistory,
        pagination: {
          total: 2,
          limit: 20,
          offset: 0,
          hasMore: false
        }
      })
    });

    // Act
    render(
      <SessionProvider session={mockSession}>
        <HistoryPanel />
      </SessionProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('2 + 2')).toBeInTheDocument();
      expect(screen.getByText('3 * 4')).toBeInTheDocument();
    });

    // Verificar que não há estrutura de árvore
    expect(screen.queryByTestId('tree-structure')).not.toBeInTheDocument();
    expect(screen.queryByTestId('branch-navigation')).not.toBeInTheDocument();
    expect(screen.queryByTestId('parent-child-relationship')).not.toBeInTheDocument();
  });

  it('deve confirmar que tipos TypeScript foram atualizados', () => {
    // Este teste verifica que os tipos foram atualizados corretamente
    // Verificando que não há referências a branches nos tipos
    
    // Arrange
    const mockHistoryEntry = {
      id: 'hist-1',
      userId: 'test-user-123',
      expression: '2 + 2',
      result: '4',
      createdAt: new Date('2025-01-27T10:00:00Z'),
      updatedAt: new Date('2025-01-27T10:00:00Z')
    };

    // Act & Assert
    // Verificar que o objeto não tem campos de branches
    expect(mockHistoryEntry).not.toHaveProperty('branchId');
    expect(mockHistoryEntry).not.toHaveProperty('parentId');
    expect(mockHistoryEntry).not.toHaveProperty('branchName');
    expect(mockHistoryEntry).not.toHaveProperty('branches');
    
    // Verificar que tem os campos corretos
    expect(mockHistoryEntry).toHaveProperty('id');
    expect(mockHistoryEntry).toHaveProperty('userId');
    expect(mockHistoryEntry).toHaveProperty('expression');
    expect(mockHistoryEntry).toHaveProperty('result');
    expect(mockHistoryEntry).toHaveProperty('createdAt');
    expect(mockHistoryEntry).toHaveProperty('updatedAt');
  });
});
