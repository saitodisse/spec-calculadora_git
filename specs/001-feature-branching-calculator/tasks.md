# Plano de Tarefas: Calculadora com Histórico Ramificado (Full-Stack)

**Branch**: `001-site-git-calc`
**Plano**: [./plan.md](./plan.md)
**Spec**: [./spec.md](./spec.md)

Este documento detalha as tarefas de implementação para a versão full-stack, ordenadas por dependência.

---

## Fase 1: Setup do Ambiente e Banco de Dados

- **T001: [Setup] Configurar Docker Compose para PostgreSQL**

  - **Arquivos**: `docker-compose.yml`, `.env.example`
  - **Ação**: Criar um `docker-compose.yml` para iniciar um serviço PostgreSQL. Adicionar um `.env.example` com as variáveis de ambiente necessárias (DATABASE_URL, etc.).

- **T002: [Setup] Inicializar e configurar Prisma ORM**

  - **Arquivos**: `prisma/schema.prisma`, `package.json`
  - **Ação**: Executar `pnpm dlx prisma init`. Configurar o `schema.prisma` para usar o provider `postgresql`.

- **T003: [Setup] Definir Schema do Banco de Dados no Prisma**

  - **Arquivo**: `prisma/schema.prisma`
  - **Ação**: Definir os modelos para `User`, `Account`, `Session`, `VerificationToken` (padrão NextAuth) e o novo modelo `HistoryTree`, conforme o `data-model.md`.

- **T004: [Setup] Gerar e aplicar a migração inicial do banco de dados**
  - **Arquivos**: `prisma/migrations/`
  - **Ação**: Executar `pnpm dlx prisma migrate dev --name init` para criar a migração SQL e aplicá-la ao banco de dados Docker. Gerar o cliente Prisma.

---

## Fase 2: Autenticação

- **T005: [Auth] Configurar NextAuth.js com Google Provider**

  - **Arquivos**: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`
  - **Ação**: Configurar o NextAuth v5 com o Prisma Adapter. Adicionar o provedor Google OAuth e as variáveis de ambiente necessárias.

- **T006: [Teste] [P] Escrever testes para componentes de Login/Logout**

  - **Arquivo**: `tests/unit/AuthComponents.test.tsx`
  - **Ação**: Criar testes para um componente `SignInButton` e `SignOutButton`. Mockar a sessão do NextAuth para testar a renderização condicional.

- **T007: [UI] Implementar componentes de Login/Logout**

  - **Arquivo**: `src/components/auth/SignInButton.tsx`, `src/components/auth/SignOutButton.tsx`
  - **Ação**: Criar os componentes que utilizam os métodos `signIn` e `signOut` do NextAuth. Fazer os testes T006 passarem.

- **T008: [UI] Integrar botões de Auth no Header/Layout**
  - **Arquivo**: `src/app/layout.tsx` (ou um componente de Header)
  - **Ação**: Adicionar os componentes de autenticação à UI principal, mostrando-os condicionalmente com base no estado da sessão.

---

## Fase 3: Lógica Core e Backend (TDD)

- **T009: [Teste] Escrever testes de integração para Server Actions**

  - **Arquivo**: `tests/integration/history.actions.test.ts`
  - **Ação**: Criar testes para as Server Actions `getHistory` e `saveHistory`. Os testes devem usar um banco de dados de teste para criar um usuário, chamar a action e verificar se os dados foram lidos/escritos corretamente.

- **T010: [Core] Implementar Server Actions para persistência**

  - **Arquivo**: `src/actions/history.ts`
  - **Ação**: Implementar as Server Actions `getHistory` e `saveHistory` que usam o cliente Prisma para interagir com o banco de dados. Fazer os testes T009 passarem.

- **T011: [Core] Refatorar `PersistenceService` para usar Server Actions**
  - **Arquivo**: `src/services/persistence.ts`
  - **Ação**: Modificar o `PersistenceService` do lado do cliente. Em vez de interagir com o `localStorage`, ele agora irá chamar as Server Actions para carregar e salvar o histórico.

---

## Fase 4: Integração Frontend e E2E

- **T012: [Core] Atualizar o Contexto da Calculadora para ser ciente da autenticação**

  - **Arquivo**: `src/context/CalculatorContext.tsx`
  - **Ação**: Modificar o `CalculatorProvider` para:
    1.  Obter a sessão do usuário.
    2.  Se o usuário estiver logado, chamar `getHistory` para carregar o estado inicial.
    3.  Se não estiver logado, iniciar com um estado padrão.
    4.  Chamar `saveHistory` após cada cálculo se o usuário estiver logado.

- **T013: [UI] Implementar UI para estado não autenticado**

  - **Arquivo**: `src/app/page.tsx`
  - **Ação**: Exibir uma notificação ou um estado diferente na UI do histórico quando o usuário não estiver logado, incentivando o login para salvar o progresso.

- **T014: [Teste] Escrever testes E2E com Playwright para o fluxo completo**

  - **Arquivo**: `tests/e2e/auth-calculator.spec.ts`
  - **Ação**: Criar um teste Playwright que:
    1.  Navega para a página.
    2.  Realiza o fluxo de login com o Google (pode exigir mock).
    3.  Realiza alguns cálculos.
    4.  Recarrega a página e verifica se o histórico foi persistido.

- **T015: [UI] Finalizar a integração e passar nos testes E2E**
  - **Arquivo**: `src/app/page.tsx` e componentes filhos.
  - **Ação**: Garantir que toda a aplicação funcione conforme o esperado e que o teste E2E (T014) passe.

---

## Fase 5: Polimento

- **T016: [Docs] Adicionar JSDoc para Server Actions e hooks.**
- **T017: [Estilo] Refinar a responsividade da UI de login e do histórico.**
- **T018: [Teste] Aumentar a cobertura de testes de componentes.**
