# Plano de Tarefas: Calculadora com Histórico Ramificado

**Branch**: `001-feature-branching-calculator`
**Plano**: [./plan.md](./plan.md)
**Spec**: [./spec.md](./spec.md)

Este documento detalha as tarefas de implementação, ordenadas por dependência e seguindo uma abordagem TDD.

---

## Fase 1: Setup do Projeto e Dependências

- **T001: [Setup] Inicializar projeto Next.js e Tailwind CSS**

  - **Arquivo**: `package.json`, `tailwind.config.ts`, `postcss.config.js`
  - **Ação**: Criar um novo projeto Next.js 15 com App Router e TypeScript. Configurar o Tailwind CSS de acordo com a documentação oficial.

- **T002: [Setup] Instalar e configurar dependências primárias**

  - **Arquivo**: `package.json`
  - **Ação**: Instalar as seguintes dependências: `math.js`, `shadcn-ui`, `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `next-themes`.

- **T003: [Setup] Configurar Shadcn UI e `next-themes`**

  - **Arquivo**: `src/app/layout.tsx`, `src/components/ui/`, `src/lib/utils.ts`
  - **Ação**: Executar `npx shadcn-ui@latest init` para configurar o `globals.css` e `utils.ts`. Envolver o layout da aplicação com o `ThemeProvider` de `next-themes`.

- **T004: [Setup] Configurar ViTest e React Testing Library**
  - **Arquivo**: `vitest.config.ts`, `tests/setup.ts`
  - **Ação**: Criar e configurar o `vitest.config.ts` para funcionar com React e Next.js (incluindo aliases de caminho). Criar um arquivo `setup.ts` para importar `@testing-library/jest-dom/vitest`.

---

## Fase 2: Lógica Core (TDD)

- **T005: [Teste] [P] Escrever teste de contrato para `PersistenceService`**

  - **Arquivo**: `tests/contract/PersistenceService.test.ts`
  - **Ação**: Criar um teste que valide a interface `IPersistenceService`. O teste deve simular salvar uma `HistoryTree` no `localStorage`, limpá-lo e depois carregar os dados, esperando que o objeto retornado seja idêntico ao original. O teste deve falhar inicialmente.

- **T006: [Core] Implementar `PersistenceService`**

  - **Arquivo**: `src/services/persistence.ts`
  - **Ação**: Implementar a classe `PersistenceService` que implementa a `IPersistenceService`. Usar `JSON.stringify` e `JSON.parse` dentro de um bloco `try-catch` para interagir com o `localStorage`. Fazer o teste T005 passar.

- **T007: [Teste] [P] Escrever testes unitários para `ExpressionEvaluatorService`**

  - **Arquivo**: `tests/unit/ExpressionEvaluatorService.test.ts`
  - **Ação**: Criar testes para o serviço que irá encapsular a `math.js`. Testar expressões válidas, expressões com parênteses e casos de erro (expressões malformadas), garantindo que os erros da `math.js` são capturados e tratados.

- **T008: [Core] Implementar `ExpressionEvaluatorService`**

  - **Arquivo**: `src/services/evaluator.ts`
  - **Ação**: Criar o serviço `ExpressionEvaluatorService` que importa `math.js` e expõe um método `evaluate`. Este método deve receber uma string de expressão e retornar o resultado ou lançar um erro customizado. Fazer o teste T007 passar.

- **T009: [Teste] [P] Escrever testes unitários para `CalculatorCore`**

  - **Arquivo**: `tests/unit/CalculatorCore.test.ts`
  - **Ação**: Criar testes para a lógica principal da calculadora (`ICalculatorCore`). Mockar o `ExpressionEvaluatorService` para focar nos testes de manipulação de estado: criação de nós, checkout, branching e gerenciamento de `HEAD`.

- **T010: [Core] Implementar `CalculatorCore`**
  - **Arquivo**: `src/core/calculator.ts`
  - **Ação**: Implementar a lógica de estado da calculadora. A classe receberá uma instância do `ExpressionEvaluatorService` (injeção de dependência) e gerenciará a `HistoryTree`. Fazer o teste T009 passar.

---

## Fase 3: UI e Integração (TDD)

- **T011: [Core] Implementar State Management com React Context e `useReducer`**

  - **Arquivo**: `src/context/CalculatorContext.tsx`
  - **Ação**: Criar um `React.Context` e um `reducer` para gerenciar o estado da `HistoryTree`. O `reducer` irá despachar ações que chamam os métodos do `CalculatorCore`. O provedor do contexto irá inicializar o estado a partir do `PersistenceService`.

- **T012: [Teste] [P] Escrever testes para o componente `Display`**

  - **Arquivo**: `tests/unit/Display.test.tsx`
  - **Ação**: Testar se o componente `Display` renderiza corretamente a expressão atual e o resultado do nó `HEAD`.

- **T013: [UI] Implementar componente `Display`**

  - **Arquivo**: `src/components/Display.tsx`
  - **Ação**: Criar o componente de visor. Usará o `useContext` para obter o estado atual e exibi-lo. Fazer o teste T012 passar.

- **T014: [Teste] [P] Escrever testes para o componente `Keypad`**

  - **Arquivo**: `tests/unit/Keypad.test.tsx`
  - **Ação**: Testar se o `Keypad` renderiza todos os botões e se o clique em cada botão despacha a ação correta para o `reducer` (via `useContext`).

- **T015: [UI] Implementar componente `Keypad`**

  - **Arquivo**: `src/components/Keypad.tsx`
  - **Ação**: Criar os botões da calculadora usando componentes da `Shadcn UI`. Fazer o teste T014 passar.

- **T016: [Teste] [P] Escrever testes para o `ErrorDisplay`**

  - **Arquivo**: `tests/unit/ErrorDisplay.test.tsx`
  - **Ação**: Testar se o componente de erro exibe a mensagem corretamente quando há um erro de expressão no estado.

- **T017: [UI] Implementar `ErrorDisplay`**

  - **Arquivo**: `src/components/ErrorDisplay.tsx`
  - **Ação**: Criar o componente que exibe feedback de erro. Fazer o teste T016 passar.

- **T018: [Teste] [P] Escrever testes de integração (E2E) para a User Story**

  - **Arquivo**: `tests/integration/Calculator.test.tsx`
  - **Ação**: Traduzir os "Cenários de Aceitação" do `spec.md` para testes de integração usando React Testing Library. Simular a interação do usuário na página principal, cobrindo criação de histórico, branching e uso de parênteses. Os testes devem falhar.

- **T019: [UI] Montar a página principal da calculadora**
  - **Arquivo**: `src/app/page.tsx`
  - **Ação**: Montar a página principal, envolvendo-a com o `CalculatorProvider` e juntando os componentes `Display`, `Keypad`, `ErrorDisplay`, e `HistoryView`. Fazer os testes de integração (T018) passarem.

---

## Fase 4: Polimento

- **T020: [Docs] Adicionar JSDoc para todo o código core e de serviços.**
- **T021: [Estilo] Refinar o estilo e garantir a responsividade em diferentes tamanhos de tela.**
- **T022: [Teste] Adicionar testes para o `HistoryView` (pode ser simplificado inicialmente).**

---

### Execução Paralela

As seguintes tarefas de teste podem ser executadas em paralelo, pois testam unidades de código independentes:

`npm test -- tests/contract/PersistenceService.test.ts tests/unit/ExpressionEvaluatorService.test.ts tests/unit/CalculatorCore.test.ts`

Da mesma forma, os testes de componentes de UI podem ser paralelizados:

`npm test -- tests/unit/Display.test.tsx tests/unit/Keypad.test.tsx tests/unit/ErrorDisplay.test.tsx`
