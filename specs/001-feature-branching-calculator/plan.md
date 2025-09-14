# Plano de Implementação: Calculadora com Histórico Ramificado (Full-Stack)

**Branch**: `001-feature-branching-calculator` | **Data**: 2025-09-14 | **Spec**: [./spec.md](./spec.md)
**Entrada**: Especificação da feature em `/specs/001-feature-branching-calculator/spec.md`

## Resumo

Este plano de implementação detalha a criação de uma **aplicação web full-stack** que oferece uma calculadora avançada com histórico ramificado. Usuários poderão se autenticar via Google, salvar seu histórico de cálculos em um banco de dados PostgreSQL e acessar seus dados de qualquer dispositivo. O projeto será construído com Next.js 15 (App Router), priorizando Server Components, com um backend gerenciado por Server Actions e um banco de dados orquestrado via Docker Compose e Prisma.

## Contexto Técnico

**Linguagem/Versão**: TypeScript com tipagem estrita
**Framework**: Next.js 15 com App Router
**Banco de Dados**: PostgreSQL
**ORM**: Prisma
**Autenticação**: NextAuth.js v5 com Google Provider
**Ambiente Local**: Docker Compose
**Estilização**: Tailwind CSS + Shadcn UI
**Testes**: ViTest (Unit/Integration), Playwright (E2E), React Testing Library (Componentes)
**Deploy**: Vercel
**Tipo de Projeto**: Full-Stack Web App

## Estrutura do Projeto

```
.
├── prisma/                  # Schema e migrações do Prisma
│   └── schema.prisma
├── src/
│   ├── app/                 # Rotas, páginas e Server Components
│   ├── components/          # Client Components (UI)
│   ├── lib/                 # Auth, Prisma Client, utils
│   ├── core/                # Lógica de negócio da calculadora (client-side)
│   └── actions/             # Server Actions para mutações de dados
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/                 # Testes Playwright
```

**Decisão de Estrutura**: Monorepo full-stack contido dentro do Next.js App Router.

## Fase 0: Esboço & Pesquisa

**Saída**: `research.md` com as decisões de arquitetura para a stack full-stack. (Já concluído)

## Fase 1: Design & Contratos

1.  **Modelo de Dados (`data-model.md`)**: Definir o schema do Prisma para `User` (gerenciado por NextAuth) e `HistoryTree`.
2.  **Contratos (`contracts/`)**: Definir as assinaturas das Server Actions (ex: `saveHistory(userId, historyData)`).
3.  **Testes de Integração (Stub)**: Escrever testes de integração (ViTest) para as Server Actions. Estes testes interagirão com um banco de dados de teste e falharão inicialmente.
4.  **Quickstart (`quickstart.md`)**: Atualizar o guia de início rápido para incluir os passos de login e verificação da persistência entre sessões.

**Saída**: `data-model.md` (com schema Prisma), `contracts/` (com assinaturas de Server Actions), testes de integração falhando, `quickstart.md` atualizado.

## Fase 2: Abordagem de Planejamento de Tarefas

**Estratégia de Geração de Tarefas**:

- **Setup**: Configuração do Docker Compose, `.env`, Prisma e NextAuth.
- **Backend (TDD)**:
  1.  Testes de integração para Server Actions (salvar/carregar histórico).
  2.  Implementação das Server Actions para fazer os testes passarem.
- **Autenticação**:
  1.  Implementação da rota `[...nextauth]`.
  2.  Criação dos componentes de UI para Login/Logout.
- **Frontend**:
  1.  Refatoração do `PersistenceService` para chamar as Server Actions.
  2.  Integração do estado de autenticação na UI.
- **E2E**:
  1.  Testes E2E com Playwright cobrindo o fluxo de login e persistência.
  2.  Implementação final para fazer os testes E2E passarem.

**Saída Estimada**: Um `tasks.md` detalhado com ~25-30 tarefas.
