# Research: Gerenciamento de Branches no Histórico

## Análise do Estado Atual

### Sistema de Branches Existente
- **Implementação**: Branches são armazenadas como `Record<string, string>` no `HistoryTreeData`
- **Persistência**: Salvas no campo `data` (JSON) da tabela `HistoryTree` no PostgreSQL
- **Funcionalidade**: Sistema básico de branches já implementado na spec 001

### Componentes Relevantes
- **HistoryPanel**: Exibe histórico linear, não mostra branches nomeadas
- **Calculator**: Gerencia estado do histórico e branches
- **Actions**: `getHistory()` e `saveHistory()` já implementados

## Decisões Técnicas

### 1. Reutilização do Schema Existente
**Decisão**: Manter o schema atual do `HistoryTreeData.branches`
**Justificativa**: 
- Já funcional e testado
- Compatível com sistema existente
- Não requer migração de dados

### 2. Extensão da UI Existente
**Decisão**: Estender `HistoryPanel` em vez de criar componente separado
**Justificativa**:
- Mantém consistência visual
- Reutiliza lógica de exibição
- Facilita integração com seleção de expressões

### 3. Estado de Seleção
**Decisão**: Manter estado de seleção apenas na UI (não persistir)
**Justificativa**:
- Estado temporário de navegação
- Não precisa sobreviver a reloads
- Simplifica implementação

## Padrões de Design Identificados

### 1. Padrão de Validação
- Validação client-side para UX imediata
- Validação server-side para segurança
- Feedback visual claro para erros

### 2. Padrão de Persistência
- Operações atômicas (tudo ou nada)
- Rollback em caso de erro
- Logs de auditoria para debugging

### 3. Padrão de UI
- Modal para operações de edição
- Confirmação para operações destrutivas
- Loading states para operações assíncronas

## Considerações de Performance

### 1. Carregamento de Branches
- Branches são carregadas junto com o histórico
- Não requer requisições adicionais
- Cache automático via Next.js

### 2. Validação de Nomes
- Validação local para feedback imediato
- Validação server-side para consistência
- Debounce para evitar validações excessivas

## Riscos Identificados

### 1. Conflitos de Nomes
- **Risco**: Usuário tenta criar branch com nome existente
- **Mitigação**: Validação e feedback claro

### 2. Perda de Dados
- **Risco**: Erro durante renomeação pode corromper dados
- **Mitigação**: Operações atômicas e rollback

### 3. Performance com Muitas Branches
- **Risco**: UI pode ficar lenta com centenas de branches
- **Mitigação**: Paginação ou virtualização se necessário

## Alternativas Consideradas

### 1. Componente Separado para Branches
**Rejeitado**: Criaria fragmentação na UI e duplicação de lógica

### 2. Persistir Estado de Seleção
**Rejeitado**: Adiciona complexidade desnecessária para estado temporário

### 3. Validação Apenas Server-side
**Rejeitado**: UX ruim sem feedback imediato

## Próximos Passos

1. Implementar testes de persistência existente
2. Estender `HistoryPanel` com listagem de branches
3. Adicionar estado de seleção visual
4. Implementar interface de renomeação
5. Criar testes abrangentes para todas as funcionalidades
