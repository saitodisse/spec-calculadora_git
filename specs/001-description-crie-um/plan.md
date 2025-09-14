# Plano de Implementação: Calculadora com Histórico Ramificado

**Branch**: `001-feature-branching-calculator` | **Data**: 2024-10-27 | **Spec**: [spec.md](./spec.md)
**Entrada**: Especificação da feature em `/specs/001-description-crie-um/spec.md`

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

Esta feature implementa uma calculadora com um sistema de histórico não-linear, inspirado no Git. Os usuários podem navegar pelo histórico de cálculos, criar "ramos" para explorar cenários diferentes e gerenciar o estado dos cálculos como um grafo de nós imutáveis. A abordagem técnica centraliza-se na modelagem da árvore de histórico e na implementação de operações análogas ao Git, como `checkout` e `branch`, para manipulação do estado.

## Contexto Técnico

**Linguagem/Versão**: Python 3.11
**Dependências Primárias**: Typer (para CLI), Nenhuma (para core-lib)
**Armazenamento**: Arquivo JSON
**Testes**: pytest
**Plataforma Alvo**: Aplicação de Linha de Comando (CLI)
**Tipo de Projeto**: single
**Metas de Performance**: N/A para esta fase
**Restrições**: N/A para esta fase
**Escala/Escopo**: A aplicação deve lidar com milhares de nós no histórico de forma eficiente

## Verificação da Constituição

_GATE: Deve passar antes da pesquisa da Fase 0. Revalidar após o design da Fase 1._

**Simplicidade**:

- Projetos: [1] (máx. 3 - cli, core-lib, tests)
- Usando o framework diretamente? (Sim, sem wrappers desnecessários)
- Modelo de dados único? (Sim, o modelo de dados da especificação é suficiente)
- Evitando padrões? (Sim, sem padrões complexos como Repository/UoW, a menos que se prove necessário)

**Arquitetura**:

- TODA feature como biblioteca? (Sim, a lógica principal será uma biblioteca `core-lib` reutilizável)
- Bibliotecas listadas: [`core-lib`: Lógica de negócio da calculadora e gerenciamento do grafo de histórico]
- CLI por biblioteca: [`cli`: Interface de linha de comando para interagir com a `core-lib`]
- Documentação da biblioteca: formato llms.txt previsto? (Sim)

**Testes (INNEGOCIÁVEL)**:

- Ciclo RED-GREEN-Refactor aplicado? (Sim, será seguido estritamente)
- Commits mostram testes antes da implementação? (Sim)
- Ordem: Contract→Integration→E2E→Unit seguida estritamente? (Sim)
- Dependências reais usadas? (Sim, ex: sistema de arquivos real para testes de persistência)
- Testes de integração para: (Sim: nova biblioteca, mudanças de contrato)
- PROIBIDO: (Não haverá implementação antes dos testes)

**Observabilidade**:

- Logging estruturado incluído? (Sim)
- Logs do frontend → backend? (N/A para CLI)
- Contexto de erro suficiente? (Sim)

**Versionamento**:

- Número de versão atribuído? (Sim, `0.1.0` inicial)
- BUILD incrementa a cada mudança? (Sim)
- Breaking changes tratadas? (Sim)

## Estrutura do Projeto

### Documentação (esta feature)

```
specs/[###-feature]/
├── plan.md              # Este arquivo (saída do comando /plan)
├── research.md          # Saída da Fase 0 (comando /plan)
├── data-model.md        # Saída da Fase 1 (comando /plan)
├── quickstart.md        # Saída da Fase 1 (comando /plan)
├── contracts/           # Saída da Fase 1 (comando /plan)
└── tasks.md             # Saída da Fase 2 (comando /tasks - NÃO criado por /plan)
```

### Código-Fonte (raiz do repositório)

```
# Opção 1: Projeto único (DEFAULT)
src/
├── core_lib/          # Lógica principal da calculadora
├── cli/                 # Interface de linha de comando
└── models/              # Modelos de dados (CalculationNode, HistoryTree)

tests/
├── contract/
├── integration/
└── unit/

# Opção 2: Aplicação web (quando "frontend" + "backend" detectados)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Opção 3: Mobile + API (quando "iOS/Android" detectado)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Decisão de Estrutura**: [Opção 1: Projeto único] A feature é autocontida e ideal para uma estrutura de biblioteca com uma interface CLI.

## Fase 0: Esboço & Pesquisa

1. **Extrair incertezas do Contexto Técnico** acima:

   - Para cada NEEDS CLARIFICATION → tarefa de pesquisa
   - Para cada dependência → tarefa de boas práticas
   - Para cada integração → tarefa de padrões

2. **Gerar e despachar agentes de pesquisa**:

   ```
   Para cada incerteza no Contexto Técnico:
     Tarefa: "Pesquisar {incerteza} para {contexto da feature}"
   Para cada escolha de tecnologia:
     Tarefa: "Encontrar boas práticas para {tecnologia} em {domínio}"
   ```

3. **Consolidar achados** em `research.md` usando o formato:
   - Decisão: [o que foi escolhido]
   - Justificativa: [por que escolhido]
   - Alternativas consideradas: [o que mais foi avaliado]

**Saída**: research.md com todas as NEEDS CLARIFICATION resolvidas

## Fase 1: Design & Contratos

_Pré-requisito: research.md concluído_

1.  **Extrair entidades da spec da feature** → `data-model.md`:

    - Nome da entidade, campos, relacionamentos
    - Regras de validação a partir dos requisitos
    - Transições de estado se aplicável

2.  **Gerar contratos de CLI** a partir dos requisitos funcionais:

    - Para cada ação do usuário → comando CLI
    - Definir argumentos, opções e saídas esperadas
    - Salvar a definição em `/contracts/cli.md`

3.  **Gerar testes de contrato** a partir dos contratos:

    - Um arquivo de teste por comando CLI (`tests/contract/test_cli.py`)
    - Validar que a CLI responde com os códigos de saída corretos e ajuda (`--help`)
    - Testes devem falhar (sem implementação ainda)

4.  **Extrair cenários de teste** das user stories:

    - Cada story → cenário de teste de integração (`tests/integration/test_calculator.py`)
    - Teste de quickstart = passos de validação da story

5.  **Atualizar o arquivo do agente incrementalmente** (operação O(1)):

    - (Este passo é um processo interno para o assistente de IA e não gera um artefato visível para o usuário.)

**Saída**: data-model.md, /contracts/cli.md, testes falhando, quickstart.md

## Fase 2: Abordagem de Planejamento de Tarefas

_Esta seção descreve o que o comando /tasks fará - NÃO executar durante /plan_

**Estratégia de Geração de Tarefas**:

- Carregar `/templates/tasks-template.md` como base.
- **Estrutura de Código**: Criar a estrutura de diretórios (`src/core_lib`, `src/cli`, `src/models`, `tests/`).
- **Modelos de Dados**: Criar tarefas para implementar as classes `CalculationNode` and `HistoryTree` em `src/models/`.
- **Testes de Contrato**: Criar uma tarefa para implementar `tests/contract/test_cli.py` para validar a interface da CLI (deve falhar inicialmente).
- **Lógica de Negócio (Core)**: Dividir a `core-lib` em tarefas menores:
  - Gerenciamento de estado (carregar/salvar JSON).
  - Operações do grafo (adicionar nó, encontrar nó).
  - Lógica de `checkout`, `branch`, `eval`.
- **Implementação da CLI**: Criar tarefas para implementar os comandos em `src/cli/main.py` usando `Typer`, que chamarão a `core-lib`.
- **Testes de Integração**: Criar tarefas para implementar os cenários do `quickstart.md` em `tests/integration/test_calculator.py`.

**Estratégia de Ordenação**:

- **TDD Estrito**: As tarefas de teste serão sempre ordenadas antes das tarefas de implementação correspondentes.
- **Bottom-up**:
  1.  Estrutura do projeto.
  2.  Modelos de dados.
  3.  Testes de contrato da CLI.
  4.  Testes de unidade para a `core-lib`.
  5.  Implementação da `core-lib`.
  6.  Implementação da CLI.
  7.  Testes de integração.

**Saída Estimada**: 20-25 tarefas numeradas e ordenadas em `tasks.md`.

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
| [ex.: 4º projeto]        | [necessidade atual]   | [por que 3 projetos são insuficientes]       |
| [ex.: Padrão Repository] | [problema específico] | [por que acesso direto ao DB é insuficiente] |

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

_Baseado na Constituição v2.1.1 - Veja `/memory/constitution.md`_
