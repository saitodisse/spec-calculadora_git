# Tarefas: Expressão Editável

**Entrada**: Documentos de design em `/specs/002-description-expressão-editável/`
**Pré-requisitos**: plan.md (obrigatório), research.md, data-model.md, contracts/

## Fluxo de Execução (principal)

```
1. Carregar plan.md do diretório da feature
   → Se não encontrar: ERRO "Nenhum plano de implementação encontrado"
   → Extrair: stack, bibliotecas, estrutura
2. Carregar documentos de design opcionais:
   → data-model.md: Extrair entidades → tarefas de modelo
   → contracts/: Cada arquivo → tarefa de teste de contrato
   → research.md: Extrair decisões → tarefas de setup
3. Gerar tarefas por categoria:
   → Setup: init do projeto, dependências, linting
   → Testes: testes de contrato, testes de integração
   → Core: modelos, serviços, comandos CLI
   → Integração: DB, middleware, logging
   → Polimento: testes unitários, performance, docs
4. Aplicar regras de tarefas:
   → Arquivos diferentes = marcar [P] para paralelo
   → Mesmo arquivo = sequencial (sem [P])
   → Testes antes da implementação (TDD)
5. Numerar tarefas sequencialmente (T001, T002...)
6. Gerar grafo de dependências
7. Criar exemplos de execução paralela
8. Validar completude das tarefas:
   → Todos os contratos têm testes?
   → Todas as entidades têm modelos?
   → Todos os endpoints implementados?
9. Retorno: SUCESSO (tarefas prontas para execução)
```

## Formato: `[ID] [P?] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- Incluir caminhos exatos de arquivo nas descrições

## Convenções de Caminho

- **App web**: `src/`, `tests/` na raiz do repositório (Next.js App Router)
- Estrutura: `src/app/`, `src/components/`, `src/core/`, `src/lib/`, `src/types/`
- Testes: `tests/e2e/`, `tests/integration/`, `tests/unit/`

## Fase 3.1: Setup

- [ ] T001 Atualizar dependências do projeto (Next.js, React, Tailwind, Shadcn UI)
- [ ] T002 Configurar TypeScript strict mode e ESLint para a feature
- [ ] T003 [P] Configurar ViTest e React Testing Library para testes
- [ ] T004 [P] Configurar Playwright para testes E2E

## Fase 3.2: Testes Primeiro (TDD) ⚠️ DEVE CONCLUIR ANTES da 3.3

**CRÍTICO: Esses testes DEVEM ser escritos e DEVEM FALHAR antes de QUALQUER implementação**

- [ ] T005 [P] Teste de contrato Calculator API em tests/contract/calculator-api.test.ts
- [ ] T006 [P] Teste de integração edição de expressão em tests/integration/expression-edit.test.ts
- [ ] T007 [P] Teste de integração sincronização input/UI em tests/integration/input-sync.test.ts
- [ ] T008 [P] Teste de integração histórico em formato texto em tests/integration/history-text.test.ts
- [ ] T009 [P] Teste de integração continuidade de cálculos em tests/integration/calculation-continuity.test.ts
- [ ] T010 [P] Teste de integração debug logging em tests/integration/debug-logging.test.ts
- [ ] T011 [P] Teste E2E cenário completo em tests/e2e/editable-expression.spec.ts

## Fase 3.3: Implementação Core (APENAS após os testes falharem)

- [ ] T012 [P] Modelo Expression em src/types/expression.ts
- [ ] T013 [P] Modelo HistoryEntry em src/types/history.ts
- [ ] T014 [P] Modelo DebugLog em src/types/debug.ts
- [ ] T015 [P] Validação de expressão em src/core/expression-validator.ts
- [ ] T016 [P] Calculator core com substituição por resultado em src/core/calculator.ts
- [ ] T017 [P] Context para estado compartilhado em src/context/CalculatorContext.tsx
- [ ] T018 [P] Componente Input editável em src/components/calculator/EditableExpression.tsx
- [ ] T019 [P] Componente Histórico em texto em src/components/calculator/HistoryDisplay.tsx
- [ ] T020 [P] Hook de debug logging em src/lib/debug-logger.ts
- [ ] T021 Endpoint POST /api/calculator/calculate em src/app/api/calculator/calculate/route.ts
- [ ] T022 Endpoint GET /api/calculator/history em src/app/api/calculator/history/route.ts
- [ ] T023 Endpoint POST /api/calculator/history em src/app/api/calculator/history/route.ts
- [ ] T024 Endpoint POST /api/calculator/validate em src/app/api/calculator/validate/route.ts

## Fase 3.4: Integração

- [ ] T025 Conectar Calculator core ao Context
- [ ] T026 Sincronizar Input editável com botões existentes
- [ ] T027 Integrar histórico com banco PostgreSQL via Prisma
- [ ] T028 Implementar substituição de expressão por resultado
- [ ] T029 Middleware de debug logging condicional
- [ ] T030 Validação server-side de expressões
- [ ] T031 Rate limiting para cálculos
- [ ] T032 CORS e headers de segurança

## Fase 3.5: Polimento

- [ ] T033 [P] Testes unitários de validação em tests/unit/expression-validator.test.ts
- [ ] T034 [P] Testes unitários do calculator core em tests/unit/calculator.test.ts
- [ ] T035 [P] Testes unitários do Context em tests/unit/calculator-context.test.ts
- [ ] T036 [P] Testes unitários do debug logger em tests/unit/debug-logger.test.ts
- [ ] T037 Testes de performance (<200ms resposta)
- [ ] T038 [P] Atualizar documentação da API
- [ ] T039 [P] Atualizar README com nova funcionalidade
- [ ] T040 Remover duplicação de código
- [ ] T041 Rodar quickstart.md para validação manual
- [ ] T042 Verificar acessibilidade WCAG 2.1

## Dependências

- Testes (T005-T011) antes da implementação (T012-T024)
- T012-T014 bloqueiam T015-T016
- T015-T016 bloqueiam T017-T020
- T017-T020 bloqueiam T021-T024
- T021-T024 bloqueiam T025-T032
- Implementação antes do polimento (T033-T042)

## Exemplo de Paralelismo

```
# Rodar T005-T011 juntos (testes de contrato e integração):
Task: "Teste de contrato Calculator API em tests/contract/calculator-api.test.ts"
Task: "Teste de integração edição de expressão em tests/integration/expression-edit.test.ts"
Task: "Teste de integração sincronização input/UI em tests/integration/input-sync.test.ts"
Task: "Teste de integração histórico em formato texto em tests/integration/history-text.test.ts"
Task: "Teste de integração continuidade de cálculos em tests/integration/calculation-continuity.test.ts"
Task: "Teste de integração debug logging em tests/integration/debug-logging.test.ts"
Task: "Teste E2E cenário completo em tests/e2e/editable-expression.spec.ts"

# Rodar T012-T020 juntos (modelos e componentes core):
Task: "Modelo Expression em src/types/expression.ts"
Task: "Modelo HistoryEntry em src/types/history.ts"
Task: "Modelo DebugLog em src/types/debug.ts"
Task: "Validação de expressão em src/core/expression-validator.ts"
Task: "Calculator core com substituição por resultado em src/core/calculator.ts"
Task: "Context para estado compartilhado em src/context/CalculatorContext.tsx"
Task: "Componente Input editável em src/components/calculator/EditableExpression.tsx"
Task: "Componente Histórico em texto em src/components/calculator/HistoryDisplay.tsx"
Task: "Hook de debug logging em src/lib/debug-logger.ts"
```

## Notas

- Tarefas [P] = arquivos diferentes, sem dependências
- Verifique que os testes falham antes de implementar
- Faça commit após cada tarefa
- Evite: tarefas vagas, conflitos no mesmo arquivo
- Seguir TDD: Red → Green → Refactor

## Regras de Geração de Tarefas

_Aplicadas durante a execução do main()_

1. **A partir dos Contratos**:
   - calculator-api.yaml → T005 (teste de contrato)
   - 4 endpoints → T021-T024 (implementação de endpoints)

2. **A partir do Data Model**:
   - 3 entidades → T012-T014 (modelos TypeScript)
   - Validações → T015 (validador de expressão)

3. **A partir das User Stories**:
   - 6 cenários de quickstart → T006-T011 (testes de integração)
   - Cenários de debug → T010, T036

4. **Ordenação**:
   - Setup → Testes → Modelos → Serviços → Endpoints → Polimento
   - Dependências bloqueiam execução paralela

## Checklist de Validação

_GATE: Checado por main() antes de retornar_

- [x] Todos os contratos têm testes correspondentes
- [x] Todas as entidades têm tarefas de modelo
- [x] Todos os testes vêm antes da implementação
- [x] Tarefas paralelas realmente independentes
- [x] Cada tarefa especifica o caminho exato do arquivo
- [x] Nenhuma tarefa modifica o mesmo arquivo que outra tarefa [P]
