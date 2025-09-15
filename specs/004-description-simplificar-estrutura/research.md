# Pesquisa: Simplificação da Estrutura de Histórico

**Feature**: 004-description-simplificar-estrutura  
**Data**: 2025-01-27  
**Objetivo**: Resolver incertezas técnicas para remoção de funcionalidades de branches/ramos

## Decisões de Pesquisa

### 1. Estratégia de Migração de Dados

**Decisão**: Migração completa imediata

**Justificativa**:

- Projeto é um POC sem usuários reais ou dados importantes para preservar
- Simplifica drasticamente o processo de implementação
- Elimina complexidade desnecessária de migração gradual
- Permite refatoração completa da estrutura sem preocupações de compatibilidade

**Alternativas consideradas**:

- Migração gradual com preservação: Rejeitada por complexidade desnecessária em POC
- Manter ambas as estruturas: Rejeitada por complexidade desnecessária
- Migração por usuário: Rejeitada por inconsistência na experiência

**Implementação**:

- Criar nova migração Prisma que remove campos de branches completamente
- Reset do banco de dados para estrutura limpa
- Implementação direta da nova estrutura sem preservação de dados antigos

### 2. Refatoração de Componentes React

**Decisão**: Remoção incremental com testes de regressão

**Justificativa**:

- Componentes complexos como HistoryPanel precisam de refatoração cuidadosa
- Testes existentes devem ser adaptados para nova estrutura
- Interface deve permanecer funcional durante a transição

**Alternativas consideradas**:

- Reescrever componentes do zero: Rejeitada por risco de introduzir bugs
- Manter componentes com flags de feature: Rejeitada por complexidade
- Refatoração completa de uma vez: Rejeitada por dificuldade de debug

**Implementação**:

- Remover props e estados relacionados a branches
- Simplificar lógica de renderização
- Atualizar testes para nova estrutura linear

### 3. Impacto de Performance

**Decisão**: Otimização de queries com remoção de índices desnecessários

**Justificativa**:

- Estrutura linear é mais simples e performática
- Menos joins e consultas complexas
- Índices de branches podem ser removidos

**Alternativas consideradas**:

- Manter índices para compatibilidade: Rejeitada por overhead desnecessário
- Criar novos índices para estrutura linear: Considerada, mas não necessária inicialmente
- Otimização prematura: Rejeitada por princípio YAGNI

**Implementação**:

- Remover índices relacionados a branches do schema Prisma
- Simplificar queries de histórico para busca linear
- Monitorar performance após migração

### 4. Compatibilidade com APIs Existentes

**Decisão**: Remoção imediata de APIs de branches

**Justificativa**:

- POC não tem clientes externos que dependam das APIs
- Simplifica implementação removendo endpoints desnecessários
- Elimina complexidade de versionamento e deprecação
- Permite implementação limpa da nova estrutura

**Alternativas consideradas**:

- Deprecação gradual com versionamento: Rejeitada por complexidade desnecessária em POC
- Manter APIs indefinidamente: Rejeitada por complexidade
- Criação de novas APIs paralelas: Rejeitada por duplicação

**Implementação**:

- Remover completamente endpoints de branches
- Implementar apenas APIs necessárias para estrutura linear
- Documentar mudanças na API

### 5. Estrutura de Dados Simplificada

**Decisão**: Schema Prisma linear sem campos de branches

**Justificativa**:

- Estrutura mais simples e fácil de manter
- Menos campos para validar e processar
- Alinhado com princípio de simplicidade

**Alternativas consideradas**:

- Manter campos como nullable: Rejeitada por confusão
- Criar nova tabela para histórico linear: Rejeitada por complexidade
- Estrutura híbrida: Rejeitada por inconsistência

**Implementação**:

- Remover campos `branchId`, `parentId`, `branchName` do schema
- Simplificar relacionamentos entre entidades
- Atualizar tipos TypeScript correspondentes

## Riscos Identificados

### Alto Risco

- **Quebra de funcionalidade existente**: Mitigado com testes abrangentes
- **Perda de dados de desenvolvimento**: Mitigado com documentação de mudanças

### Médio Risco

- **Performance degradada**: Mitigado com monitoramento
- **Bugs em componentes refatorados**: Mitigado com testes de regressão

### Baixo Risco

- **Tempo de desenvolvimento**: Mitigado com implementação direta
- **Complexidade de rollback**: Não aplicável em POC

## Próximos Passos

1. Criar nova migração Prisma removendo campos de branches
2. Refatorar componentes React com testes de regressão
3. Atualizar schema Prisma e tipos TypeScript
4. Remover APIs de branches completamente
5. Executar testes de integração e E2E

## Referências

- [Prisma Migration Guide](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate)
- [React Component Refactoring Best Practices](https://react.dev/learn/thinking-in-react)
- [API Versioning Strategies](https://restfulapi.net/versioning/)
- [Database Migration Patterns](https://martinfowler.com/articles/evodb.html)
