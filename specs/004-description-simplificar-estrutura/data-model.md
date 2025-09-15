# Modelo de Dados: Simplificação da Estrutura de Histórico

**Feature**: 004-description-simplificar-estrutura  
**Data**: 2025-01-27  
**Objetivo**: Definir estrutura de dados simplificada sem branches/ramos

## Entidades Principais

### 1. Histórico (History)

**Propósito**: Armazenar lista linear de expressões calculadas pelo usuário

**Campos**:
- `id`: string (UUID) - Identificador único
- `userId`: string - Referência ao usuário (NextAuth)
- `expression`: string - Expressão matemática original
- `result`: string - Resultado do cálculo
- `createdAt`: DateTime - Timestamp de criação
- `updatedAt`: DateTime - Timestamp de última atualização

**Relacionamentos**:
- `user`: User (Many-to-One) - Usuário proprietário do histórico

**Regras de Validação**:
- `expression` não pode ser vazio
- `result` não pode ser vazio
- `userId` deve existir na tabela de usuários
- `createdAt` deve ser anterior ou igual a `updatedAt`

**Transições de Estado**:
- Criado → Ativo (após validação)
- Ativo → Inativo (se expressão for inválida)

### 2. Expressão (Expression)

**Propósito**: Representar uma operação matemática com resultado

**Campos**:
- `expression`: string - Texto da expressão
- `result`: string - Resultado calculado
- `isValid`: boolean - Se a expressão é válida

**Regras de Validação**:
- `expression` deve ser uma expressão matemática válida
- `result` deve ser o resultado correto da expressão
- `isValid` deve refletir o status real da validação

## Estrutura Simplificada

### Antes (com branches)
```typescript
interface HistoryEntry {
  id: string;
  userId: string;
  expression: string;
  result: string;
  branchId?: string;        // REMOVIDO
  parentId?: string;        // REMOVIDO
  branchName?: string;      // REMOVIDO
  createdAt: Date;
  updatedAt: Date;
}
```

### Depois (estrutura linear)
```typescript
interface HistoryEntry {
  id: string;
  userId: string;
  expression: string;
  result: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Schema Prisma Atualizado

```prisma
model History {
  id          String   @id @default(cuid())
  userId      String
  expression  String
  result      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("histories")
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  histories History[]

  @@map("users")
}
```

## Migração de Dados

### Estratégia de Migração

1. **Reset completo do banco de dados** (POC sem dados importantes)
2. **Criar nova estrutura limpa sem campos de branches**
3. **Aplicar migração Prisma para nova estrutura**
4. **Validar estrutura criada**

### Script de Migração

```sql
-- 1. Dropar tabela existente (POC - sem dados importantes)
DROP TABLE IF EXISTS histories;

-- 2. Criar nova tabela com estrutura simplificada
CREATE TABLE histories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expression TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar índices para performance
CREATE INDEX idx_histories_user_id ON histories(user_id);
CREATE INDEX idx_histories_created_at ON histories(created_at);
CREATE INDEX idx_histories_user_created ON histories(user_id, created_at);
```

## Impactos na Aplicação

### Componentes Afetados

1. **HistoryPanel.tsx**
   - Remover lógica de branches
   - Simplificar renderização para lista linear
   - Remover botão "Árvore"

2. **HistoryTree.tsx**
   - Componente pode ser removido completamente
   - Ou simplificado para lista linear

3. **BranchList.tsx**
   - Componente deve ser removido

4. **BranchRenameModal.tsx**
   - Componente deve ser removido

### APIs Afetadas

1. **Endpoints a serem removidos**:
   - `POST /api/calculator/branches/create`
   - `DELETE /api/calculator/branches/delete`
   - `PUT /api/calculator/branches/rename`

2. **Endpoints a serem simplificados**:
   - `GET /api/calculator/history` - Remover parâmetros de branch
   - `POST /api/calculator/calculate` - Remover lógica de branches

### Tipos TypeScript

```typescript
// Remover tipos relacionados a branches
interface Branch {
  id: string;
  name: string;
  parentId?: string;
  // ... outros campos
}

// Simplificar tipos de histórico
interface HistoryEntry {
  id: string;
  userId: string;
  expression: string;
  result: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Validações e Constraints

### Validações de Negócio

1. **Expressão válida**: Deve ser uma expressão matemática válida
2. **Resultado correto**: Deve ser o resultado correto da expressão
3. **Usuário válido**: Deve existir na base de dados
4. **Timestamps consistentes**: `createdAt` ≤ `updatedAt`

### Constraints de Banco

1. **Primary Key**: `id` único
2. **Foreign Key**: `userId` referencia `users.id`
3. **Not Null**: Todos os campos obrigatórios
4. **Unique**: Não há duplicatas por design (lista linear)

## Performance e Otimizações

### Índices Recomendados

```sql
-- Índice para busca por usuário (mais comum)
CREATE INDEX idx_histories_user_id ON histories(user_id);

-- Índice para ordenação por data
CREATE INDEX idx_histories_created_at ON histories(created_at);

-- Índice composto para queries frequentes
CREATE INDEX idx_histories_user_created ON histories(user_id, created_at);
```

### Queries Otimizadas

```sql
-- Buscar histórico do usuário ordenado por data
SELECT * FROM histories 
WHERE user_id = ? 
ORDER BY created_at DESC 
LIMIT 20;

-- Buscar expressão específica
SELECT * FROM histories 
WHERE user_id = ? AND expression = ? 
LIMIT 1;
```

## Considerações de Segurança

1. **Isolamento de dados**: Usuários só acessam seu próprio histórico
2. **Validação de entrada**: Expressões são validadas antes do cálculo
3. **Sanitização**: Inputs são sanitizados antes do armazenamento
4. **Rate limiting**: Limite de operações por usuário

## Monitoramento e Observabilidade

1. **Métricas de performance**: Tempo de resposta das queries
2. **Logs de migração**: Rastreamento de dados migrados
3. **Alertas de erro**: Notificações em caso de falha na migração
4. **Dashboards**: Visualização da saúde do sistema
