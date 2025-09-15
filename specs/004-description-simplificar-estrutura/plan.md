# Plano de Implementação: Simplificação da Estrutura de Histórico

**Branch**: `004-description-simplificar-estrutura` | **Data**: 2025-01-27 | **Spec**: [link]
**Entrada**: Especificação da feature em `/specs/004-description-simplificar-estrutura/spec.md`

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

Simplificar a estrutura da calculadora removendo toda funcionalidade de branches/ramos similar ao Git, mantendo apenas uma lista linear simples de expressões passadas. A abordagem técnica envolve refatoração de componentes React, simplificação do schema do banco de dados e remoção de APIs relacionadas a branches.

## Contexto Técnico

**Linguagem/Versão**: TypeScript 5.x (modo strict)  
**Dependências Primárias**: Next.js 15, React 18, Prisma ORM, PostgreSQL 15  
**Armazenamento**: PostgreSQL via Prisma ORM  
**Testes**: ViTest + React Testing Library + Playwright  
**Plataforma Alvo**: Web (Next.js App Router)  
**Tipo de Projeto**: web (frontend + backend)  
**Metas de Performance**: <200ms para operações de histórico, interface responsiva  
**Restrições**: Manter compatibilidade com dados existentes, migração segura  
**Escala/Escopo**: Histórico linear simples, sem estrutura de árvore

## Verificação da Constituição

_GATE: Deve passar antes da pesquisa da Fase 0. Revalidar após o design da Fase 1._

**Simplicidade**:

- Projetos: [2] (frontend + backend)
- Usando o framework diretamente? (Next.js App Router sem wrappers desnecessários)
- Modelo de dados único? (schema Prisma simplificado sem campos de branches)
- Evitando padrões? (remoção de complexidade desnecessária de branches)

**Arquitetura**:

- TODA feature como biblioteca? (lógica core desacoplada em src/core/)
- Bibliotecas listadas: [calculator-core, expression-validator]
- CLI por biblioteca: [N/A - aplicação web]
- Documentação da biblioteca: [N/A - aplicação web]

**Testes (INNEGOCIÁVEL)**:

- Ciclo RED-GREEN-Refactor aplicado? (testes de remoção escritos primeiro)
- Commits mostram testes antes da implementação?
- Ordem: Contract→Integration→E2E→Unit seguida estritamente?
- Dependências reais usadas? (PostgreSQL real, sem mocks)
- Testes de integração para: mudanças de schema, remoção de APIs
- PROIBIDO: Implementar antes do teste, pular a fase RED

**Observabilidade**:

- Logging estruturado incluído?
- Logs do frontend → backend? (fluxo unificado)
- Contexto de erro suficiente?

**Versionamento**:

- Número de versão atribuído? (MAJOR.MINOR.BUILD)
- BUILD incrementa a cada mudança?
- Breaking changes tratadas? (migração de dados, testes paralelos)

## Estrutura do Projeto

### Documentação (esta feature)

```
specs/004-description-simplificar-estrutura/
├── plan.md              # Este arquivo (saída do comando /plan)
├── research.md          # Saída da Fase 0 (comando /plan)
├── data-model.md        # Saída da Fase 1 (comando /plan)
├── quickstart.md        # Saída da Fase 1 (comando /plan)
├── contracts/           # Saída da Fase 1 (comando /plan)
└── tasks.md             # Saída da Fase 2 (comando /tasks - NÃO criado por /plan)
```

### Código-Fonte (raiz do repositório)

```
# Opção 2: Aplicação web (frontend + backend detectados)
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   └── page.tsx        # Página principal
├── components/         # React Components
│   ├── calculator/     # Componentes da calculadora
│   ├── auth/          # Componentes de autenticação
│   └── ui/            # Shadcn UI components
├── core/              # Lógica de negócio (calculator-core)
├── lib/               # Utilities (auth, prisma, utils)
├── types/             # TypeScript type definitions
└── actions/           # Server Actions

tests/
├── e2e/               # Playwright E2E tests
├── integration/       # Integration tests
├── unit/              # Unit tests
└── contract/          # Contract tests

prisma/
├── schema.prisma      # Database schema
└── migrations/        # Database migrations
```

**Decisão de Estrutura**: Aplicação web (Opção 2) - frontend + backend integrados no Next.js

## Fase 0: Esboço & Pesquisa

1. **Extrair incertezas do Contexto Técnico** acima:

   - Migração de dados existentes com branches para estrutura linear
   - Impacto na performance com remoção de índices de branches
   - Compatibilidade com APIs existentes que referenciam branches

2. **Gerar e despachar agentes de pesquisa**:

   ```
   Tarefa: "Pesquisar estratégias de migração de dados para remoção de campos de branches"
   Tarefa: "Encontrar boas práticas para refatoração de componentes React com remoção de funcionalidades"
   Tarefa: "Avaliar impacto de performance na remoção de índices de banco de dados"
   ```

3. **Consolidar achados** em `research.md` usando o formato:
   - Decisão: [o que foi escolhido]
   - Justificativa: [por que escolhido]
   - Alternativas consideradas: [o que mais foi avaliado]

**Saída**: research.md com todas as NEEDS CLARIFICATION resolvidas

## Fase 1: Design & Contratos

_Pré-requisito: research.md concluído_

1. **Extrair entidades da spec da feature** → `data-model.md`:

   - Histórico: lista linear de expressões sem campos de branches
   - Expressão: operação matemática com resultado, sem referência a branches
   - Regras de validação para estrutura simplificada

2. **Gerar contratos de API** a partir dos requisitos funcionais:

   - Remoção de endpoints de branches (/api/calculator/branches/\*)
   - Simplificação de endpoint de histórico (/api/calculator/history)
   - Manutenção de endpoints de cálculo e validação

3. **Gerar testes de contrato** a partir dos contratos:

   - Testes para verificar remoção de funcionalidades de branches
   - Validação de estrutura linear do histórico
   - Testes devem falhar (sem implementação ainda)

4. **Extrair cenários de teste** das user stories:

   - Interface simplificada sem botão "Árvore"
   - Lista linear de histórico
   - Reutilização de expressões do histórico

5. **Atualizar o arquivo do agente incrementalmente** (operação O(1)):
   - Adicionar tecnologias de refatoração e migração de dados
   - Preservar adições manuais entre marcadores
   - Manter abaixo de 150 linhas para eficiência de tokens

**Saída**: data-model.md, /contracts/\*, testes falhando, quickstart.md, arquivo específico do agente

## Fase 2: Abordagem de Planejamento de Tarefas

_Esta seção descreve o que o comando /tasks fará - NÃO executar durante /plan_

**Estratégia de Geração de Tarefas**:

- Carregar `/templates/tasks-template.md` como base
- Gerar tarefas a partir dos documentos de design da Fase 1 (contratos, data model, quickstart)
- Cada contrato removido → tarefa de remoção de teste de contrato [P]
- Cada entidade simplificada → tarefa de refatoração de modelo [P]
- Cada user story → tarefa de teste de integração
- Tarefas de implementação para fazer os testes passarem

**Estratégia de Ordenação**:

- Ordem TDD: Testes de remoção antes da implementação
- Ordem de dependências: Migração de dados antes de refatoração de componentes
- Marcar [P] para execução paralela (arquivos independentes)

**Saída Estimada**: 20-25 tarefas numeradas e ordenadas em tasks.md

**IMPORTANTE**: Esta fase é executada pelo comando /tasks, NÃO pelo /plan

## Fase 3+: Implementação Futura

_Estas fases estão além do escopo do comando /plan_

**Fase 3**: Execução das tarefas (comando /tasks cria o tasks.md)  
**Fase 4**: Implementação (executar o tasks.md seguindo os princípios da constituição)  
**Fase 5**: Validação (rodar testes, executar o quickstart.md, validação de performance)

## Rastreamento de Complexidade

_Preencher APENAS se a Verificação da Constituição tiver violações que precisem ser justificadas_

| Violação                     | Por que é necessário | Alternativa mais simples rejeitada porque |
| ---------------------------- | -------------------- | ----------------------------------------- |
| [Nenhuma violação detectada] | [N/A]                | [N/A]                                     |

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
