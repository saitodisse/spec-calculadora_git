# Modelo de Dados: Expressão Editável

**Feature**: 002-description-expressão-editável  
**Data**: 2025-01-14  
**Status**: Concluído

## Entidades Principais

### 1. Expressão (Expression)

**Propósito**: Representa a entrada matemática editável do usuário

**Campos**:

- `value: string` - Expressão matemática atual
- `isValid: boolean` - Status de validação da expressão
- `cursorPosition: number` - Posição do cursor no input
- `lastValidValue: string` - Última expressão válida (para rollback)

**Regras de Validação**:

- Não pode ser vazia quando submetida
- Deve conter apenas caracteres matemáticos válidos (0-9, +, -, \*, /, (, ), ., espaço)
- Deve ter parênteses balanceados
- Deve ter pelo menos um operador ou número

**Transições de Estado**:

```
[Vazia] → [Digitando] → [Válida] → [Calculando] → [Resultado] → [Digitando]
    ↓         ↓           ↓           ↓            ↓            ↓
[Inválida] ← [Digitando] ← [Válida] ← [Calculando] ← [Resultado] ← [Digitando]
```

**Comportamento de Substituição**:

- Após cálculo (ENTER), o campo é substituído pelo resultado numérico
- O resultado vira a nova expressão inicial para cálculos subsequentes
- Histórico preserva a expressão original e o resultado

### 2. Histórico (History)

**Propósito**: Registro de operações executadas em formato JSON

**Campos**:

- `id: string` - Identificador único (UUID)
- `timestamp: Date` - Data/hora da operação
- `expression: string` - Expressão original
- `result: number` - Resultado do cálculo
- `executionTime: number` - Tempo de execução em ms
- `userId?: string` - ID do usuário (se autenticado)

**Regras de Validação**:

- ID deve ser único
- Timestamp deve ser válido
- Resultado deve ser um número válido
- Tempo de execução deve ser positivo

**Relacionamentos**:

- Muitos para um com User (opcional)
- Um para um com Expression

### 3. Debug Log (DebugLog)

**Propósito**: Mensagens de desenvolvimento para troubleshooting

**Campos**:

- `level: 'debug' | 'info' | 'warn' | 'error'` - Nível do log
- `message: string` - Mensagem do log
- `context: Record<string, any>` - Contexto adicional
- `timestamp: Date` - Data/hora do log
- `component: string` - Componente que gerou o log

**Regras de Validação**:

- Level deve ser um dos valores permitidos
- Message não pode ser vazia
- Context deve ser serializável
- Timestamp deve ser válido

**Relacionamentos**:

- Muitos para um com Expression (opcional)

## Esquema de Banco de Dados (Prisma)

```prisma
model HistoryEntry {
  id            String   @id @default(cuid())
  timestamp     DateTime @default(now())
  expression    String
  result        Float
  executionTime Int      // em milissegundos
  userId        String?
  user          User?    @relation(fields: [userId], references: [id])

  @@map("history_entries")
}

model User {
  id        String         @id @default(cuid())
  email     String         @unique
  name      String?
  histories HistoryEntry[]

  @@map("users")
}
```

## DTOs (Data Transfer Objects)

### ExpressionDTO

```typescript
interface ExpressionDTO {
  value: string;
  isValid: boolean;
  cursorPosition: number;
  lastValidValue: string;
}
```

### HistoryEntryDTO

```typescript
interface HistoryEntryDTO {
  id: string;
  timestamp: string; // ISO string
  expression: string;
  result: number;
  executionTime: number;
  userId?: string;
}
```

### DebugLogDTO

```typescript
interface DebugLogDTO {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  context: Record<string, any>;
  timestamp: string; // ISO string
  component: string;
}
```

## Validações de Negócio

### Expressão

- **Validação de Sintaxe**: Usar regex para caracteres válidos
- **Validação de Parênteses**: Algoritmo de stack para balanceamento
- **Validação de Operadores**: Não permitir operadores consecutivos
- **Validação de Números**: Formato decimal válido

### Histórico

- **Limite de Entradas**: Máximo 1000 entradas por usuário
- **Retenção**: Manter entradas por 30 dias
- **Privacidade**: Histórico é privado por usuário

### Debug Log

- **Filtro por Ambiente**: Apenas em desenvolvimento
- **Limite de Logs**: Máximo 100 logs por sessão
- **Sanitização**: Remover dados sensíveis dos logs

## Migrações de Banco

### Migration 1: Criar tabela de histórico

```sql
CREATE TABLE history_entries (
  id VARCHAR(25) PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  expression TEXT NOT NULL,
  result DECIMAL(15,6) NOT NULL,
  execution_time INTEGER NOT NULL,
  user_id VARCHAR(25),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_history_timestamp ON history_entries(timestamp);
CREATE INDEX idx_history_user_id ON history_entries(user_id);
```

## Considerações de Performance

- **Índices**: Timestamp e user_id para consultas rápidas
- **Paginação**: Histórico paginado (20 entradas por página)
- **Cache**: Cache de 5 minutos para histórico recente
- **Cleanup**: Job diário para remover entradas antigas

## Considerações de Segurança

- **Sanitização**: Input sanitizado antes do cálculo
- **Validação**: Validação server-side além da client-side
- **Rate Limiting**: Máximo 100 cálculos por minuto por usuário
- **Auditoria**: Log de todas as operações para auditoria
