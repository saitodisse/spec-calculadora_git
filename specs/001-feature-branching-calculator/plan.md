# Plano de Implementação: Calculadora com Histórico Ramificado

**Branch**: `001-feature-branching-calculator` | **Data**: 2025-09-14 | **Spec**: [./spec.md](./spec.md)
**Entrada**: Especificação da feature em `/specs/001-feature-branching-calculator/spec.md`

## Fluxo de Execução (escopo do comando /plan)

```
1. Carregar a spec da feature a partir do caminho de Entrada
   → SUCESSO
2. Preencher o Contexto Técnico (buscar por NEEDS CLARIFICATION)
   → Detectar o Tipo de Projeto a partir do contexto (web=frontend+backend, mobile=app+api)
   → Definir a Decisão de Estrutura com base no tipo de projeto
3. Avaliar a seção de Verificação da Constituição abaixo
   → Nenhuma violação encontrada
   → Atualizar o Rastreamento de Progresso: Verificação Inicial da Constituição
4. Executar a Fase 0 → research.md
   → Nenhuma NEEDS CLARIFICATION encontrada
5. Executar a Fase 1 → contracts, data-model.md, quickstart.md
6. Reavaliar a seção de Verificação da Constituição
   → Nenhuma nova violação
   → Atualizar o Rastreamento de Progresso: Verificação Pós-Design
7. Planejar a Fase 2 → Descrever a abordagem de geração de tarefas (NÃO criar tasks.md)
8. PARAR - Pronto para o comando /tasks
```

**IMPORTANTE**: O comando /plan PARA no passo 7. As Fases 2-4 são executadas por outros comandos:

- Fase 2: comando /tasks cria o tasks.md
- Fases 3-4: Execução da implementação (manual ou via ferramentas)

## Resumo

Este plano de implementação detalha a criação de uma calculadora web avançada com um sistema de histórico ramificado, inspirado no Git. O objetivo é permitir que os usuários naveguem, revertam e criem ramos alternativos em seu histórico de cálculos. A aplicação será construída como um site single-page usando Next.js e TypeScript, com todos os dados persistidos no Local Storage do navegador. O desenvolvimento seguirá uma abordagem estrita de Test-Driven Development (TDD).

## Contexto Técnico

**Linguagem/Versão**: TypeScript com tipagem estrita
**Framework**: Next.js 15 com App Router
**Estilização**: Tailwind CSS + Shadcn UI
**Testes**: ViTest (Unit Test) + React Testing Library
**Armazenamento**: Local Storage do Navegador
**Tema**: next-themes para gerenciamento de tema
**Build**: Turbopack
**Deploy**: Vercel
**Plataforma Alvo**: Navegadores Web Modernos
**Tipo de Projeto**: web
**Metas de Performance**: Interface reativa e fluida, sem atrasos perceptíveis durante os cálculos ou navegação no histórico.
**Restrições**: A aplicação deve ser totalmente funcional no lado do cliente, sem a necessidade de um backend.
**Escala/Escopo**: Projetado para um único usuário por navegador, com um histórico de centenas de nós e dezenas de branches.

## Verificação da Constituição

_GATE: Deve passar antes da pesquisa da Fase 0. Revalidar após o design da Fase 1._

**Simplicidade**:

- Projetos: [1] (frontend)
- Usando o framework diretamente? (Sim)
- Modelo de dados único? (Sim)
- Evitando padrões? (Sim, YAGNI)

**Arquitetura**:

- TODA feature como biblioteca? (Sim, a lógica do histórico será um módulo/biblioteca separada)
- Bibliotecas listadas: `calculator-core` (contém a lógica do grafo de histórico), `ui-components` (componentes React)
- CLI por biblioteca: N/A (projeto web)
- Documentação da biblioteca: N/A

**Testes (INNEGOCIÁVEL)**:

- Ciclo RED-GREEN-Refactor aplicado? (Sim, obrigatório)
- Commits mostram testes antes da implementação? (Sim, a ser verificado nos PRs)
- Ordem: Contract→Integration→E2E→Unit seguida estritamente? (Sim)
- Dependências reais usadas? (Sim, Local Storage)
- Testes de integração para: `calculator-core` com o serviço de persistência.
- PROIBIDO: Implementar antes do teste, pular a fase RED

**Observabilidade**:

- Logging estruturado incluído? (Não especificado, será usado console.log/warn/error para depuração)
- Logs do frontend → backend? (N/A)
- Contexto de erro suficiente? (Sim, mensagens de erro claras para operações inválidas)

**Versionamento**:

- Número de versão atribuído? (0.1.0 inicial)
- BUILD incrementa a cada mudança? (Gerenciado pelo CI/CD na Vercel)
- Breaking changes tratadas? (N/A para esta fase inicial)

## Estrutura do Projeto

### Documentação (esta feature)

```
specs/001-feature-branching-calculator/
├── plan.md              # Este arquivo (saída do comando /plan)
├── research.md          # Saída da Fase 0 (comando /plan)
├── data-model.md        # Saída da Fase 1 (comando /plan)
├── quickstart.md        # Saída da Fase 1 (comando /plan)
├── contracts/           # Saída da Fase 1 (comando /plan)
└── tasks.md             # Saída da Fase 2 (comando /tasks - NÃO criado por /plan)
```

### Código-Fonte (raiz do repositório)

```
# Opção 1: Aplicação Web na Raiz
src/
├── app/                 # Next.js App Router
├── components/          # Componentes Shadcn UI e customizados
├── lib/                 # Utilitários, hooks
├── services/            # Módulos para interagir com Local Storage
└── core/                # Lógica de negócio da calculadora (calculator-core)
tests/
├── contract/
├── integration/
└── unit/
```

**Decisão de Estrutura**: Opção 1 (Aplicação Web na Raiz). A estrutura do `frontend/` será movida para a raiz do repositório para simplificar o projeto, já que não haverá um componente de backend.

## Fase 0: Esboço & Pesquisa

1.  **Extrair incertezas do Contexto Técnico**: Nenhuma incerteza fundamental foi identificada. A stack tecnológica está claramente definida.
2.  **Gerar e despachar agentes de pesquisa**: A pesquisa se concentrará em estabelecer as melhores práticas para a stack definida.
    - **Tarefa**: "Pesquisar padrões de design para gerenciar estado complexo (grafo) em React/Next.js."
    - **Tarefa**: "Verificar a melhor abordagem para persistir o estado da aplicação no Local Storage de forma robusta e eficiente."
    - **Tarefa**: "Estruturar um projeto Next.js com Tailwind e Shadcn UI seguindo as melhores práticas."
    - **Tarefa**: "Configurar ViTest e React Testing Library para um projeto Next.js App Router."
3.  **Consolidar achados** em `research.md`.

**Saída**: `research.md` com as melhores práticas e decisões de implementação detalhadas.

## Fase 1: Design & Contratos

_Pré-requisito: research.md concluído_

1.  **Extrair entidades da spec da feature** → `data-model.md`:
    - Definir as interfaces TypeScript para `CalculationNode` e `HistoryTree`.
    - Documentar as regras de validação (ex: divisão por zero).
2.  **Gerar contratos de serviço** a partir dos requisitos funcionais:
    - Definir a interface para o `PersistenceService` que irá ler e escrever a `HistoryTree` no Local Storage.
    - Definir a interface para o `CalculatorService` que irá expor a lógica do `calculator-core`.
    - Salvar as interfaces TypeScript em `/contracts/`.
3.  **Gerar testes de contrato** a partir dos contratos:
    - Criar testes (usando ViTest) para o `PersistenceService` que garantem que o serviço salva e carrega os dados corretamente. Estes testes falharão inicialmente.
4.  **Extrair cenários de teste** das user stories:
    - Converter cada "Cenário de Aceitação" da `spec.md` em um teste de integração (React Testing Library).
    - Criar um `quickstart.md` que descreve os passos manuais para verificar a User Story Primária.
5.  **Atualizar o arquivo do agente incrementalmente**: N/A.

**Saída**: `data-model.md`, `/contracts/` com interfaces de serviço, testes de contrato falhando, `quickstart.md`.

## Fase 2: Abordagem de Planejamento de Tarefas

_Esta seção descreve o que o comando /tasks fará - NÃO executar durante /plan_

**Estratégia de Geração de Tarefas**:

- Carregar `/templates/tasks-template.md` como base.
- Gerar tarefas a partir dos documentos de design da Fase 1.
- A ordem seguirá estritamente o TDD:
  1.  Testes de Contrato para `PersistenceService`.
  2.  Implementação do `PersistenceService`.
  3.  Testes unitários para a lógica do `calculator-core`.
  4.  Implementação do `calculator-core`.
  5.  Testes de integração que combinam `calculator-core` e `PersistenceService`.
  6.  Testes de componentes da UI (ex: Visor, Botões).
  7.  Implementação dos componentes da UI.
  8.  Testes E2E (nível de página) para os Cenários de Aceitação completos.
  9.  Implementação da UI da página principal.
- Marcar tarefas independentes para execução paralela [P].

**Saída Estimada**: Um `tasks.md` detalhado com 20-30 tarefas ordenadas.

**IMPORTANTE**: Esta fase é executada pelo comando /tasks, NÃO pelo /plan

## Fase 3+: Implementação Futura

_Estas fases estão além do escopo do comando /plan_

**Fase 3**: Execução das tarefas (comando /tasks cria o tasks.md)
**Fase 4**: Implementação (executar o tasks.md seguindo os princípios da constituição)
**Fase 5**: Validação (rodar testes, executar o quickstart.md, validação de performance)

## Rastreamento de Complexidade

_Preencher APENAS se a Verificação da Constituição tiver violações que precisem ser justificadas_

| Violação | Por que é necessário | Alternativa mais simples rejeitada porque |
| :------- | :------------------- | :---------------------------------------- |
| N/A      | N/A                  | N/A                                       |

## Rastreamento de Progresso

_Este checklist é atualizado durante o fluxo de execução_

**Status das Fases**:

- [x] Fase 0: Pesquisa concluída (comando /plan)
- [x] Fase 1: Design concluído (comando /plan)
- [x] Fase 2: Planejamento de tarefas concluído (comando /plan - apenas descrever abordagem)
- [ ] Fase 3: Tarefas geradas (comando /tasks)
- [ ] Fase 4: Implementação concluída
- [ ] Fase 5: Validação aprovada

**Status dos Gates**:

- [x] Verificação Inicial da Constituição: PASS
- [x] Verificação Pós-Design da Constituição: PASS
- [x] Todas as NEEDS CLARIFICATION resolvidas
- [x] Desvios de complexidade documentados

---

_Baseado na Constituição v2.1.1 - Veja `/.specify/memory/constitution.md`_
