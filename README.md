# Calculadora com Histórico Ramificado

Uma calculadora avançada que salva o histórico de cálculos em uma estrutura de árvore ramificada, similar ao Git. Os usuários podem navegar pelo histórico, criar ramos de cálculos e salvar seu progresso na nuvem.

## 🚀 Funcionalidades

- **Calculadora Completa**: Suporte a operações básicas (+, -, \*, /) e parênteses
- **Histórico Ramificado**: Navegue pelo histórico como uma árvore Git
- **Autenticação Google**: Login com Google para salvar histórico na nuvem
- **Persistência**: Histórico salvo automaticamente no banco de dados
- **Interface Moderna**: UI responsiva com Tailwind CSS

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js v5 com Google Provider
- **Estilização**: Tailwind CSS + Shadcn UI
- **Testes**: Vitest (Unit), Playwright (E2E)
- **Containerização**: Docker Compose

## 📋 Pré-requisitos

- Node.js 18+
- pnpm
- Docker e Docker Compose
- Conta Google (para OAuth)

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone <repository-url>
cd spec-calculadora_git
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/calculator"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (obtenha em https://console.developers.google.com)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Inicie o banco de dados

```bash
docker-compose up -d
```

### 5. Execute as migrações

```bash
pnpm db:migrate
```

### 6. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

## 🧪 Testes

### Testes Unitários

```bash
pnpm test
```

### Testes E2E

```bash
pnpm test:e2e
```

## 📁 Estrutura do Projeto

```
├── prisma/                  # Schema e migrações do Prisma
├── src/
│   ├── app/                 # Rotas e páginas (App Router)
│   ├── components/          # Componentes React
│   │   ├── auth/           # Componentes de autenticação
│   │   ├── calculator/     # Componentes da calculadora
│   │   └── ui/             # Componentes de UI base
│   ├── core/               # Lógica de negócio da calculadora
│   ├── actions/            # Server Actions
│   ├── lib/                # Configurações (Prisma, Auth)
│   └── types/              # Definições TypeScript
└── tests/
    ├── unit/               # Testes unitários
    ├── integration/        # Testes de integração
    └── e2e/                # Testes E2E com Playwright
```

## 🎯 Como Usar

### Usuário Não Autenticado

1. Acesse a calculadora
2. Realize cálculos normalmente
3. Uma mensagem indica que o histórico não será salvo
4. Clique em "Login com Google" para autenticar

### Usuário Autenticado

1. Faça login com sua conta Google
2. Realize cálculos - eles são salvos automaticamente
3. Recarregue a página - seu histórico é restaurado
4. Acesse de outros dispositivos - histórico sincronizado

### Navegação no Histórico

- Cada cálculo cria um novo nó na árvore
- Navegue clicando nos nós do histórico
- Crie ramos a partir de qualquer ponto
- Compare diferentes cenários de cálculo

## 🔧 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Constrói a aplicação para produção
- `pnpm start` - Inicia o servidor de produção
- `pnpm test` - Executa testes unitários
- `pnpm test:e2e` - Executa testes E2E
- `pnpm db:migrate` - Executa migrações do banco
- `pnpm db:studio` - Abre o Prisma Studio
- `pnpm db:reset` - Reseta o banco de dados

## 📝 Especificação

Este projeto foi desenvolvido seguindo a especificação detalhada em `/specs/001-site-git-calc/`:

- [Especificação](./specs/001-site-git-calc/spec.md)
- [Modelo de Dados](./specs/001-site-git-calc/data-model.md)
- [Plano de Implementação](./specs/001-site-git-calc/plan.md)
- [Guia de Início Rápido](./specs/001-site-git-calc/quickstart.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
