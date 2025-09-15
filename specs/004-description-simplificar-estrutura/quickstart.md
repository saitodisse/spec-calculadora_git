# Quickstart: Simplificação da Estrutura de Histórico

**Feature**: 004-description-simplificar-estrutura  
**Data**: 2025-01-27  
**Objetivo**: Guia rápido para validar a implementação da estrutura simplificada

## Pré-requisitos

- Node.js 18+ instalado
- PNPM instalado
- Docker e Docker Compose instalados
- PostgreSQL 15 rodando via Docker

## Setup Inicial

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Banco de Dados

```bash
# Iniciar PostgreSQL via Docker
docker-compose up -d

# Aplicar migração da estrutura simplificada
pnpm db:migrate

# Gerar cliente Prisma
pnpm db:generate
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Configurar variáveis necessárias
DATABASE_URL="postgresql://postgres:password@localhost:5433/calculator"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Validação da Implementação

### 1. Iniciar Servidor de Desenvolvimento

```bash
pnpm dev
```

### 2. Acessar a Aplicação

- Abrir navegador em `http://localhost:3000`
- Fazer login com Google (se configurado) ou usar modo de desenvolvimento

### 3. Validar Interface Simplificada

#### ✅ Painel de Histórico Simplificado

1. **Verificar ausência do botão "Árvore"**

   - O painel de histórico deve mostrar apenas uma lista linear
   - Não deve haver botão "🌳 Árvore" na interface

2. **Verificar lista linear de expressões**

   - Histórico deve ser exibido como lista simples
   - Entradas ordenadas por data (mais recente primeiro)
   - Cada entrada mostra: expressão → resultado

3. **Verificar ausência de funcionalidades de branches**
   - Não deve haver opção de "Nomear Branch"
   - Não deve haver lista de branches/ramos
   - Não deve haver navegação em árvore

#### ✅ Funcionalidade de Cálculo

1. **Realizar cálculos simples**

   ```
   Teste 1: 2 + 2 = 4
   Teste 2: 3 * 4 = 12
   Teste 3: 10 / 2 = 5
   ```

2. **Verificar adição ao histórico**

   - Cada cálculo deve aparecer no topo da lista
   - Histórico deve crescer linearmente
   - Não deve haver estrutura de árvore

3. **Testar reutilização de expressões**
   - Clicar em uma expressão do histórico
   - Verificar se ela é carregada na calculadora
   - Confirmar que pode ser editada e recalculada

### 4. Validar APIs

#### ✅ Endpoint de Histórico

```bash
# Testar GET /api/calculator/history
curl -H "Authorization: Bearer valid-token" \
     http://localhost:3000/api/calculator/history

# Resposta esperada: lista linear de entradas
```

#### ✅ Endpoint de Cálculo

```bash
# Testar POST /api/calculator/calculate
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer valid-token" \
     -d '{"expression": "2 + 2"}' \
     http://localhost:3000/api/calculator/calculate

# Resposta esperada: resultado + entrada no histórico
```

#### ✅ Endpoint de Validação

```bash
# Testar POST /api/calculator/validate
curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer valid-token" \
     -d '{"expression": "2 + 2"}' \
     http://localhost:3000/api/calculator/validate

# Resposta esperada: isValid: true
```

### 5. Verificar Ausência de APIs de Branches

#### ✅ Endpoints Removidos

```bash
# Estes endpoints devem retornar 404 (não existem mais)
curl -X POST http://localhost:3000/api/calculator/branches/create
curl -X DELETE http://localhost:3000/api/calculator/branches/delete
curl -X PUT http://localhost:3000/api/calculator/branches/rename

# Resposta esperada: 404 Not Found
```

## Executar Testes

### 1. Testes Unitários

```bash
pnpm test
```

### 2. Testes de Integração

```bash
pnpm test:integration
```

### 3. Testes E2E

```bash
pnpm test:e2e
```

### 4. Testes de Contrato

```bash
pnpm test:contract
```

## Validação do Banco de Dados

### 1. Verificar Schema Simplificado

```bash
# Acessar Prisma Studio
pnpm db:studio
```

### 2. Verificar Estrutura da Tabela

```sql
-- Conectar ao PostgreSQL
psql postgresql://postgres:password@localhost:5433/calculator

-- Verificar estrutura da tabela histories
\d histories

-- Verificar ausência de campos de branches
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'histories';
```

### 3. Verificar Dados de Teste

```sql
-- Inserir dados de teste
INSERT INTO histories (id, user_id, expression, result, created_at, updated_at)
VALUES
  ('test-1', 'user-123', '2 + 2', '4', NOW(), NOW()),
  ('test-2', 'user-123', '3 * 4', '12', NOW(), NOW());

-- Verificar dados inseridos
SELECT * FROM histories ORDER BY created_at DESC;
```

## Checklist de Validação

### Interface do Usuário

- [ ] Botão "🌳 Árvore" removido
- [ ] Lista linear de histórico funcionando
- [ ] Cálculos sendo adicionados ao topo da lista
- [ ] Reutilização de expressões funcionando
- [ ] Interface responsiva mantida
- [ ] Acessibilidade preservada

### Funcionalidades

- [ ] Cálculo de expressões funcionando
- [ ] Validação de expressões funcionando
- [ ] Histórico persistindo no banco
- [ ] Autenticação funcionando
- [ ] Sessões sendo mantidas

### APIs

- [ ] GET /api/calculator/history retornando lista linear
- [ ] POST /api/calculator/calculate funcionando
- [ ] POST /api/calculator/validate funcionando
- [ ] Endpoints de branches retornando 404
- [ ] Autenticação nas APIs funcionando

### Banco de Dados

- [ ] Schema simplificado aplicado
- [ ] Campos de branches removidos
- [ ] Índices criados corretamente
- [ ] Migração executada sem erros
- [ ] Dados sendo persistidos corretamente

### Testes

- [ ] Testes unitários passando
- [ ] Testes de integração passando
- [ ] Testes E2E passando
- [ ] Testes de contrato passando
- [ ] Cobertura de testes mantida

## Troubleshooting

### Problemas Comuns

1. **Erro de migração do banco**

   ```bash
   # Reset do banco e reaplicar migração
   pnpm db:reset
   pnpm db:migrate
   ```

2. **Componentes não carregando**

   ```bash
   # Limpar cache e reinstalar
   rm -rf node_modules
   pnpm install
   pnpm dev
   ```

3. **APIs retornando erro 500**
   ```bash
   # Verificar logs do servidor
   # Verificar configuração do banco
   # Verificar variáveis de ambiente
   ```

### Logs Úteis

```bash
# Logs do servidor de desenvolvimento
pnpm dev

# Logs do banco de dados
docker-compose logs postgres

# Logs de testes
pnpm test --verbose
```

## Próximos Passos

Após validação bem-sucedida:

1. **Commit das mudanças**

   ```bash
   git add .
   git commit -m "feat: implementa estrutura simplificada sem branches"
   ```

2. **Deploy para ambiente de teste**

   ```bash
   # Configurar deploy para Vercel ou outro provedor
   ```

3. **Documentar mudanças**
   - Atualizar README.md
   - Documentar APIs no Postman/Insomnia
   - Criar guia de migração para desenvolvedores

## Suporte

Para problemas ou dúvidas:

1. Verificar logs de erro
2. Consultar documentação do projeto
3. Verificar issues no repositório
4. Contatar equipe de desenvolvimento
