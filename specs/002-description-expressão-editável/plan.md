# Plano de Implementação: Expressão Editável

**Branch**: `002-description-expressão-editável` | **Data**: 2025-01-14 | **Spec**: [link]
**Entrada**: Especificação da feature em `/specs/002-description-expressão-editável/spec.md`

## Fluxo de Execução (escopo do comando /plan)

```
1. Carregar a spec da feature a partir do caminho de Entrada
   → Se não encontrar: ERRO "Nenhuma spec de feature em {path}"
2. Preencher o Contexto Técnico (buscar por NEEDS CLARIFICATION)
   → Detectar o Tipo de Projeto a partir do contexto (web=frontend+backend, mobile=app+api)
   → Definir a Decisão de Estrutura com base no tipo de projeto
3. Avaliar a seção de Verificação da Constituição abaixo
   → Se houver violações: Documentar em Rastreamento de Complexidade
   → Se não houver justificativa possível: ERRO "Simplifique a abordagem primeiro"
   → Atualizar o Rastreamento de Progresso: Verificação Inicial da Constituição
4. Executar a Fase 0 → research.md
   → Se permanecerem NEEDS CLARIFICATION: ERRO "Resolver incertezas"
5. Executar a Fase 1 → contracts, data-model.md, quickstart.md, arquivo de template específico do agente (ex.: `CLAUDE.md` para Claude Code, `.github/copilot-instructions.md` para GitHub Copilot, ou `GEMINI.md` para Gemini CLI).
6. Reavaliar a seção de Verificação da Constituição
   → Se surgirem novas violações: Refatorar o design, retornar à Fase 1
   → Atualizar o Rastreamento de Progresso: Verificação Pós-Design
7. Planejar a Fase 2 → Descrever a abordagem de geração de tarefas (NÃO criar tasks.md)
8. PARAR - Pronto para o comando /tasks
```

**IMPORTANTE**: O comando /plan PARA no passo 7. As Fases 2-4 são executadas por outros comandos:

- Fase 2: comando /tasks cria o tasks.md
- Fases 3-4: Execução da implementação (manual ou via ferramentas)

## Resumo

Implementar campo de entrada editável para expressões matemáticas na calculadora, substituindo a exibição atual da expressão. O campo deve manter foco automático, permitir edição direta, sincronizar com botões existentes, e adicionar operações ao histórico em formato JSON. Incluir mensagens de debug detalhadas para modo desenvolvimento.

## Contexto Técnico

**Linguagem/Versão**: TypeScript (modo strict)  
**Dependências Primárias**: Next.js (App Router), React, Tailwind CSS, Shadcn UI  
**Armazenamento**: PostgreSQL via Prisma (histórico de operações)  
**Testes**: ViTest (Unitários/Integração) + React Testing Library (Componentes) + Playwright (E2E)  
**Plataforma Alvo**: Web (Linux deployment)  
**Tipo de Projeto**: web (frontend + backend)  
**Metas de Performance**: <200ms resposta de cálculo, interface responsiva mobile-first  
**Restrições**: Acessibilidade WCAG 2.1, modo desenvolvimento com debug detalhado  
**Escala/Escopo**: Calculadora individual com histórico persistente  

## Verificação da Constituição

_GATE: Deve passar antes da pesquisa da Fase 0. Revalidar após o design da Fase 1._

**Simplicidade**:

- Projetos: [2] (frontend, backend)
- Usando o framework diretamente? (Next.js App Router, sem wrappers desnecessários)
- Modelo de dados único? (Prisma schema para histórico)
- Evitando padrões? (sem Repository/UoW, acesso direto via Prisma)

**Arquitetura**:

- TODA feature como biblioteca? (calculator-core como biblioteca independente)
- Bibliotecas listadas: [calculator-core: lógica de cálculo independente da UI]
- CLI por biblioteca: [calculator-core: --help, --version, --format json]
- Documentação da biblioteca: formato llms.txt previsto?

**Testes (INNEGOCIÁVEL)**:

- Ciclo RED-GREEN-Refactor aplicado? (teste DEVE falhar primeiro)
- Commits mostram testes antes da implementação?
- Ordem: Contract→Integration→E2E→Unit seguida estritamente?
- Dependências reais usadas? (PostgreSQL real, sem mocks)
- Testes de integração para: novas bibliotecas, mudanças de contrato, esquemas compartilhados?
- PROIBIDO: Implementar antes do teste, pular a fase RED

**Observabilidade**:

- Logging estruturado incluído?
- Logs do frontend → backend? (fluxo unificado via console.debug em modo dev)
- Contexto de erro suficiente?

**Versionamento**:

- Número de versão atribuído? (MAJOR.MINOR.BUILD)
- BUILD incrementa a cada mudança?
- Breaking changes tratadas? (testes paralelos, plano de migração)

## Estrutura do Projeto

### Documentação (esta feature)

```
specs/002-description-expressão-editável/
├── plan.md              # Este arquivo (saída do comando /plan)
├── research.md          # Saída da Fase 0 (comando /plan)
├── data-model.md        # Saída da Fase 1 (comando /plan)
├── quickstart.md        # Saída da Fase 1 (comando /plan)
├── contracts/           # Saída da Fase 1 (comando /plan)
└── tasks.md             # Saída da Fase 2 (comando /tasks - NÃO criado por /plan)
```

### Código-Fonte (raiz do repositório)

```
# Opção 2: Aplicação web (quando "frontend" + "backend" detectados)
src/
├── app/                 # Next.js App Router
│   ├── api/            # Backend API routes
│   └── page.tsx        # Frontend pages
├── components/         # React components
│   ├── calculator/     # Calculator UI components
│   └── ui/            # Shadcn UI components
├── core/              # calculator-core library
│   └── calculator.ts  # Core calculation logic
├── lib/               # Utilities and configurations
└── types/             # TypeScript type definitions

tests/
├── e2e/               # Playwright E2E tests
├── integration/       # Integration tests
└── unit/              # Unit tests

prisma/
├── schema.prisma      # Database schema
└── migrations/        # Database migrations
```

**Decisão de Estrutura**: Opção 2 - Aplicação web (frontend + backend detectados)

## Fase 0: Esboço & Pesquisa

1. **Extrair incertezas do Contexto Técnico** acima:

   - Pesquisar padrões de input editável em calculadoras web
   - Pesquisar sincronização entre input manual e botões de UI
   - Pesquisar formato JSON para histórico de operações
   - Pesquisar debug logging em modo desenvolvimento

2. **Gerar e despachar agentes de pesquisa**:

   ```
   Tarefa: "Pesquisar padrões de input editável para calculadoras web"
   Tarefa: "Encontrar boas práticas para sincronização input/UI em React"
   Tarefa: "Pesquisar formato JSON para histórico de operações matemáticas"
   Tarefa: "Encontrar padrões de debug logging em modo desenvolvimento"
   ```

3. **Consolidar achados** em `research.md` usando o formato:
   - Decisão: [o que foi escolhido]
   - Justificativa: [por que escolhido]
   - Alternativas consideradas: [o que mais foi avaliado]

**Saída**: research.md com todas as NEEDS CLARIFICATION resolvidas

## Fase 1: Design & Contratos

_Pré-requisito: research.md concluído_

1. **Extrair entidades da spec da feature** → `data-model.md`:

   - Expressão: entrada matemática editável
   - Histórico: registro de operações em formato JSON
   - Debug Log: mensagens de desenvolvimento

2. **Gerar contratos de API** a partir dos requisitos funcionais:

   - POST /api/calculator/calculate - executar cálculo
   - GET /api/calculator/history - obter histórico
   - POST /api/calculator/history - adicionar ao histórico

3. **Gerar testes de contrato** a partir dos contratos:

   - Testes para cada endpoint
   - Validação de schemas JSON
   - Testes devem falhar (sem implementação ainda)

4. **Extrair cenários de teste** das user stories:

   - Edição de expressão via input
   - Sincronização com botões
   - Histórico em formato JSON
   - Debug em modo desenvolvimento

5. **Atualizar o arquivo do agente incrementalmente** (operação O(1)):
   - Adicionar tecnologias do plano atual
   - Preservar adições manuais entre marcadores
   - Manter abaixo de 150 linhas para eficiência de tokens

**Saída**: data-model.md, /contracts/*, testes falhando, quickstart.md, arquivo específico do agente

## Fase 2: Abordagem de Planejamento de Tarefas

_Esta seção descreve o que o comando /tasks fará - NÃO executar durante /plan_

**Estratégia de Geração de Tarefas**:

- Carregar `/templates/tasks-template.md` como base
- Gerar tarefas a partir dos documentos de design da Fase 1 (contratos, data model, quickstart)
- Cada contrato → tarefa de teste de contrato [P]
- Cada entidade → tarefa de criação de modelo [P]
- Cada user story → tarefa de teste de integração
- Tarefas de implementação para fazer os testes passarem

**Estratégia de Ordenação**:

- Ordem TDD: Testes antes da implementação
- Ordem de dependências: Core logic antes de UI antes de integração
- Marcar [P] para execução paralela (arquivos independentes)

**Saída Estimada**: 25-30 tarefas numeradas e ordenadas em tasks.md

**IMPORTANTE**: Esta fase é executada pelo comando /tasks, NÃO pelo /plan

## Fase 3+: Implementação Futura

_Estas fases estão além do escopo do comando /plan_

**Fase 3**: Execução das tarefas (comando /tasks cria o tasks.md)  
**Fase 4**: Implementação (executar o tasks.md seguindo os princípios da constituição)  
**Fase 5**: Validação (rodar testes, executar o quickstart.md, validação de performance)

## Rastreamento de Complexidade

_Preencher APENAS se a Verificação da Constituição tiver violações que precisem ser justificadas_

| Violação                 | Por que é necessário  | Alternativa mais simples rejeitada porque    |
| ------------------------ | --------------------- | -------------------------------------------- |
| 2 projetos (frontend/backend) | Separação clara de responsabilidades | Projeto único seria acoplado demais |
| Biblioteca calculator-core | Lógica independente da UI | Código direto no componente seria menos testável |

## Rastreamento de Progresso

_Este checklist é atualizado durante o fluxo de execução_

**Status das Fases**:

- [x] Fase 0: Pesquisa concluída (comando /plan)
- [x] Fase 1: Design concluído (comando /plan)
- [ ] Fase 2: Planejamento de tarefas concluído (comando /plan - apenas descrever abordagem)
- [ ] Fase 3: Tarefas geradas (comando /tasks)
- [ ] Fase 4: Implementação concluída
- [ ] Fase 5: Validação aprovada

**Status dos Gates**:

- [x] Verificação Inicial da Constituição: PASS
- [x] Verificação Pós-Design da Constituição: PASS
- [x] Todas as NEEDS CLARIFICATION resolvidas
- [x] Desvios de complexidade documentados

---

_Baseado na Constituição v2.1.1 - Veja `/memory/constitution.md`_