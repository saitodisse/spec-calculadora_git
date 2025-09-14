# Quickstart: Gerenciamento de Branches no Histórico

## Visão Geral

Esta feature adiciona funcionalidades de gerenciamento de branches ao sistema de histórico ramificado da calculadora, permitindo:

1. **Verificação de persistência**: Garantir que branches são salvas no banco
2. **Listagem de branches**: Visualizar todas as branches nomeadas
3. **Seleção de expressões**: Marcar expressões no histórico
4. **Renomeação de branches**: Alterar nomes de branches existentes

## Funcionalidades Principais

### 1. Verificação de Persistência
- Testes automatizados verificam se branches são salvas corretamente
- Validação de integridade referencial entre branches e nós
- Logs de auditoria para debugging

### 2. Listagem de Branches
- Exibição de todas as branches nomeadas do usuário
- Ordenação por data de criação
- Indicador visual para branch atual (HEAD)
- Busca e filtro de branches

### 3. Seleção de Expressões
- Clique em expressão no histórico para selecioná-la
- Indicador visual claro da expressão selecionada
- Estado de seleção mantido durante a sessão

### 4. Renomeação de Branches
- Modal para renomeação de branches
- Validação de nomes (únicos, não vazios)
- Feedback visual para operações
- Persistência automática no banco

## Como Usar

### Verificar Persistência de Branches
```bash
# Executar testes de persistência
pnpm test tests/unit/branch-persistence.test.ts
pnpm test tests/integration/branch-integration.test.tsx
```

### Listar Branches
1. Faça login na calculadora
2. Realize alguns cálculos
3. Crie branches nomeadas
4. Visualize a listagem no painel de histórico

### Selecionar Expressão
1. Clique em qualquer expressão no histórico
2. A expressão será destacada visualmente
3. Use a expressão selecionada para criar/renomear branches

### Renomear Branch
1. Selecione uma expressão no histórico
2. Clique no botão "Renomear Branch"
3. Digite o novo nome no modal
4. Confirme a alteração

## Estrutura de Dados

### Branches no Banco
```json
{
  "nodes": {
    "node1": { "id": "node1", "expression": "2 + 3", "result": 5 },
    "node2": { "id": "node2", "expression": "5 * 2", "result": 10 }
  },
  "head": "node2",
  "branches": {
    "feature-branch": "node1",
    "main-branch": "node2"
  }
}
```

### Estado de Seleção
```typescript
interface SelectedExpression {
  nodeId: string;
  expression: string;
  isSelected: boolean;
  canRename: boolean;
}
```

## APIs Disponíveis

### GET /api/calculator/history
Retorna histórico completo incluindo branches:
```json
{
  "nodes": { ... },
  "head": "node2",
  "branches": {
    "feature-branch": "node1"
  }
}
```

### POST /api/calculator/branches/rename
Renomeia uma branch:
```json
{
  "oldName": "feature-branch",
  "newName": "new-feature-branch",
  "nodeId": "node1"
}
```

## Testes

### Executar Todos os Testes
```bash
# Testes unitários
pnpm test tests/unit/

# Testes de integração
pnpm test tests/integration/

# Testes E2E
pnpm test:e2e
```

### Testes Específicos
```bash
# Testes de persistência
pnpm test tests/unit/branch-persistence.test.ts

# Testes de renomeação
pnpm test tests/integration/branch-rename.test.tsx

# Testes E2E de branches
pnpm test:e2e tests/e2e/branch-management.spec.ts
```

## Troubleshooting

### Branches Não Aparecem
1. Verifique se está logado
2. Confirme que há branches nomeadas no histórico
3. Verifique logs do console para erros

### Erro ao Renomear Branch
1. Verifique se o nome não está duplicado
2. Confirme que a branch existe
3. Verifique logs de erro no console

### Problemas de Persistência
1. Verifique conexão com banco de dados
2. Execute testes de persistência
3. Verifique logs de auditoria

## Próximos Passos

1. Implementar testes de persistência
2. Criar componente de listagem
3. Adicionar seleção visual
4. Implementar interface de renomeação
5. Criar testes E2E abrangentes
