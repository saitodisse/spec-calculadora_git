# Data Model: Gerenciamento de Branches no Histórico

## Entidades Existentes (Reutilizadas)

### HistoryTree
```typescript
interface HistoryTreeData {
  nodes: Record<string, CalculationNode>;
  head: string;
  branches: Record<string, string>; // nome da branch -> id do nó
}
```

### CalculationNode
```typescript
interface CalculationNode {
  id: string;
  parentId: string | null;
  timestamp: number;
  expression: string;
  result: number;
}
```

## Novas Entidades/Extensões

### BranchMetadata (Nova)
```typescript
interface BranchMetadata {
  name: string;
  nodeId: string;
  createdAt: number;
  lastModified: number;
  description?: string; // Opcional para futuras extensões
}
```

### SelectedExpression (Estado da UI)
```typescript
interface SelectedExpression {
  nodeId: string;
  expression: string;
  isSelected: boolean;
  canRename: boolean;
}
```

## Relacionamentos

- **HistoryTree.branches**: Mapeia nome da branch → ID do nó
- **BranchMetadata**: Metadados adicionais para branches (criado em, modificado em)
- **SelectedExpression**: Estado temporário da UI para expressão selecionada

## Persistência

- **Branches**: Persistidas no campo `branches` do `HistoryTreeData` (JSON no PostgreSQL)
- **Metadados**: Podem ser estendidos no futuro sem quebrar compatibilidade
- **Estado de Seleção**: Mantido apenas na UI (não persistido)

## Validações

- Nomes de branches devem ser únicos por usuário
- Nomes de branches não podem ser vazios
- Nomes de branches devem ser válidos (sem caracteres especiais)
- Branches devem referenciar nós existentes
