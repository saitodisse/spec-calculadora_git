# Tarefas: Simplificação da Estrutura de Histórico

**Entrada**: Documentos de design em `/specs/004-description-simplificar-estrutura/`
**Pré-requisitos**: plan.md (obrigatório), research.md, data-model.md, contracts/

## Fluxo de Execução (principal)

```
1. Carregar plan.md do diretório da feature
   → Extrair: stack Next.js + Prisma, estrutura web
2. Carregar documentos de design:
   → data-model.md: Entidades History e Expression → tarefas de modelo
   → contracts/history-api.yaml: Endpoints → tarefas de teste de contrato
   → research.md: Migração completa imediata → tarefas de setup
3. Gerar tarefas por categoria:
   → Setup: migração de banco, remoção de componentes
   → Testes: testes de contrato, testes de integração
   → Core: modelos, serviços, APIs
   → Integração: refatoração de componentes
   → Polimento: testes unitários, validação
4. Aplicar regras de tarefas:
   → Arquivos diferentes = marcar [P] para paralelo
   → Testes antes da implementação (TDD)
5. Numerar tarefas sequencialmente (T001, T002...)
6. Gerar grafo de dependências
7. Validar completude das tarefas
```

## Formato: `[ID] [P?] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- Incluir caminhos exatos de arquivo nas descrições

## Fase 3.1: Setup e Migração

- [ ] T001 Criar migração Prisma para remover campos de branches
- [ ] T002 [P] Remover componentes relacionados a branches (BranchList, BranchRenameModal)
- [ ] T003 [P] Remover APIs de branches (/api/calculator/branches/*)
- [ ] T004 [P] Atualizar tipos TypeScript removendo interfaces de branches

## Fase 3.2: Testes Primeiro (TDD) ⚠️ DEVE CONCLUIR ANTES da 3.3

**CRÍTICO: Esses testes DEVEM ser escritos e DEVEM FALHAR antes de QUALQUER implementação**

- [ ] T005 [P] Teste de contrato GET /api/calculator/history em tests/contract/history-api.test.ts
- [ ] T006 [P] Teste de contrato POST /api/calculator/calculate em tests/contract/history-api.test.ts
- [ ] T007 [P] Teste de contrato POST /api/calculator/validate em tests/contract/history-api.test.ts
- [ ] T008 [P] Teste de integração histórico linear em tests/integration/history-linear.test.tsx
- [ ] T009 [P] Teste de integração remoção de branches em tests/integration/branch-removal.test.tsx

## Fase 3.3: Implementação Core (APENAS após os testes falharem)

- [ ] T010 [P] Atualizar schema Prisma em prisma/schema.prisma
- [ ] T011 [P] Atualizar tipos History em src/types/history.ts
- [ ] T012 [P] Simplificar HistoryService em src/actions/history.ts
- [ ] T013 Endpoint GET /api/calculator/history (estrutura linear)
- [ ] T014 Endpoint POST /api/calculator/calculate (sem lógica de branches)
- [ ] T015 Endpoint POST /api/calculator/validate (simplificado)
- [ ] T016 [P] Atualizar core/calculator.ts removendo lógica de branches

## Fase 3.4: Refatoração de Componentes

- [ ] T017 [P] Refatorar HistoryPanel.tsx removendo botão "Árvore"
- [ ] T018 [P] Simplificar HistoryTree.tsx para lista linear
- [ ] T019 [P] Atualizar Calculator.tsx removendo props de branches
- [ ] T020 [P] Remover BranchList.tsx completamente
- [ ] T021 [P] Remover BranchRenameModal.tsx completamente
- [ ] T022 [P] Atualizar CalculatorDisplay.tsx para estrutura linear

## Fase 3.5: Integração e Testes

- [ ] T023 [P] Testes unitários para HistoryService em tests/unit/history-service.test.ts
- [ ] T024 [P] Testes unitários para componentes simplificados em tests/unit/components.test.tsx
- [ ] T025 [P] Testes E2E para fluxo simplificado em tests/e2e/calculator-simplified.spec.ts
- [ ] T026 [P] Atualizar testes de integração existentes em tests/integration/
- [ ] T027 Validar migração de banco de dados
- [ ] T028 [P] Atualizar documentação em README.md

## Fase 3.6: Polimento e Validação

- [ ] T029 [P] Executar quickstart.md para validação completa
- [ ] T030 [P] Verificar performance (<200ms para operações de histórico)
- [ ] T031 [P] Validar acessibilidade da interface simplificada
- [ ] T032 [P] Limpar código morto e imports não utilizados
- [ ] T033 [P] Atualizar general.mdc com estrutura final
- [ ] T034 [P] Executar todos os testes e validar cobertura

## Dependências

- Testes (T005-T009) antes da implementação (T010-T016)
- T010 (schema) bloqueia T011, T012, T013
- T013 bloqueia T017, T018
- T017 bloqueia T019, T020, T021
- Implementação antes do polimento (T029-T034)

## Exemplo de Paralelismo

```
# Rodar T005-T009 juntos (testes de contrato e integração):
Task: "Teste de contrato GET /api/calculator/history"
Task: "Teste de contrato POST /api/calculator/calculate" 
Task: "Teste de contrato POST /api/calculator/validate"
Task: "Teste de integração histórico linear"
Task: "Teste de integração remoção de branches"

# Rodar T010-T012 juntos (modelos e serviços):
Task: "Atualizar schema Prisma"
Task: "Atualizar tipos History"
Task: "Simplificar HistoryService"

# Rodar T017-T021 juntos (componentes):
Task: "Refatorar HistoryPanel.tsx"
Task: "Simplificar HistoryTree.tsx"
Task: "Atualizar Calculator.tsx"
Task: "Remover BranchList.tsx"
Task: "Remover BranchRenameModal.tsx"
```

## Notas

- Tarefas [P] = arquivos diferentes, sem dependências
- Verifique que os testes falham antes de implementar
- Faça commit após cada tarefa
- Migração completa imediata (POC sem dados para preservar)
- Foco na simplificação e remoção de complexidade

## Regras de Geração de Tarefas

_Aplicadas durante a execução do main()_

1. **A partir dos Contratos**:
   - history-api.yaml → tarefas de teste de contrato [P]
   - Endpoints GET/POST → tarefas de implementação
2. **A partir do Data Model**:
   - Entidade History → tarefa de atualização de modelo [P]
   - Schema simplificado → tarefa de migração
3. **A partir das User Stories**:
   - Interface simplificada → teste de integração [P]
   - Remoção de branches → tarefas de refatoração

4. **Ordenação**:
   - Setup → Testes → Modelos → Serviços → Componentes → Polimento
   - Dependências bloqueiam execução paralela

## Checklist de Validação

_GATE: Checado por main() antes de retornar_

- [x] Todos os contratos têm testes correspondentes
- [x] Todas as entidades têm tarefas de modelo
- [x] Todos os testes vêm antes da implementação
- [x] Tarefas paralelas realmente independentes
- [x] Cada tarefa especifica o caminho exato do arquivo
- [x] Nenhuma tarefa modifica o mesmo arquivo que outra tarefa [P]
