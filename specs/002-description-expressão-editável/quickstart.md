# Quickstart: Expressão Editável

**Feature**: 002-description-expressão-editável  
**Data**: 2025-01-14  
**Status**: Concluído

## Cenários de Validação

### Cenário 1: Edição de Expressão via Input

**Objetivo**: Validar que o usuário pode editar expressões diretamente no campo de entrada

**Passos**:

1. Acessar a calculadora
2. Clicar no campo de expressão atual
3. Digitar "2 + 3 \* 4"
4. Verificar que a expressão aparece em tempo real
5. Pressionar Enter ou clicar no botão "="
6. Verificar que o resultado "14" é exibido

**Resultado Esperado**:

- Campo de entrada focado e editável
- Expressão digitada aparece em tempo real
- Cálculo executado corretamente
- Resultado exibido no campo

### Cenário 2: Sincronização com Botões da UI

**Objetivo**: Validar que o input manual sincroniza com os botões da calculadora

**Passos**:

1. Acessar a calculadora
2. Digitar "2 + 3" no campo de entrada
3. Clicar no botão "\*" da UI
4. Clicar no botão "4" da UI
5. Verificar que o campo mostra "2 + 3 \* 4"
6. Pressionar Enter
7. Verificar que o resultado "14" é exibido

**Resultado Esperado**:

- Input manual sincroniza com botões da UI
- Expressão final correta
- Cálculo executado corretamente

### Cenário 3: Histórico em Formato JSON

**Objetivo**: Validar que operações são salvas no histórico em formato JSON

**Passos**:

1. Acessar a calculadora
2. Executar cálculo "2 + 3" (resultado: 5)
3. Executar cálculo "5 \* 2" (resultado: 10)
4. Verificar o histórico à direita
5. Verificar que cada entrada está em formato JSON

**Resultado Esperado**:

- Histórico exibido à direita da calculadora
- Cada entrada em formato JSON com:
  - id, timestamp, expression, result, executionTime
- Entradas ordenadas por timestamp (mais recente primeiro)

### Cenário 4: Continuidade de Cálculos

**Objetivo**: Validar que o resultado substitui completamente a expressão no campo de entrada, permitindo continuidade de cálculos

**Passos**:

1. Acessar a calculadora
2. Digitar "2 + 3" no campo de entrada editável
3. Pressionar Enter para calcular
4. **Verificar que o campo de entrada agora mostra apenas "5" (resultado) no lugar da expressão "2 + 3"**
5. Digitar " _ 2" (campo deve mostrar "5 _ 2")
6. Pressionar Enter para calcular
7. **Verificar que o campo de entrada agora mostra apenas "10" (resultado) no lugar da expressão "5 \* 2"**
8. Verificar que o histórico contém ambas as operações em formato JSON

**Resultado Esperado**:

- **Após cada cálculo (ENTER), o campo de entrada é completamente substituído pelo resultado numérico**
- O resultado vira a nova expressão inicial para cálculos subsequentes
- Usuário pode continuar calculando usando o resultado anterior como base
- Histórico mantém todas as operações com expressões originais e resultados
- Comportamento consistente: sempre que ENTER é pressionado, expressão → resultado no campo

### Cenário 5: Debug em Modo Desenvolvimento

**Objetivo**: Validar que mensagens de debug aparecem no console

**Passos**:

1. Abrir DevTools (F12)
2. Ir para a aba Console
3. Acessar a calculadora
4. Digitar "2 + 3" no campo
5. Pressionar Enter
6. Verificar mensagens de debug no console

**Resultado Esperado**:

- Mensagens de debug detalhadas no console
- Informações sobre:
  - Validação da expressão
  - Execução do cálculo
  - Adição ao histórico
  - Tempo de execução

### Cenário 6: Validação de Expressões

**Objetivo**: Validar que expressões inválidas são rejeitadas

**Passos**:

1. Acessar a calculadora
2. Digitar "2 + \* 4" (expressão inválida)
3. Pressionar Enter
4. Verificar que erro é exibido
5. Digitar "2 + 3 \* 4" (expressão válida)
6. Pressionar Enter
7. Verificar que cálculo é executado

**Resultado Esperado**:

- Expressões inválidas rejeitadas
- Mensagem de erro clara
- Expressões válidas executadas normalmente

## Validação de Performance

### Tempo de Resposta

- Cálculos simples (< 100ms)
- Cálculos complexos (< 500ms)
- Carregamento do histórico (< 200ms)

### Responsividade

- Interface responsiva em mobile
- Foco automático no campo de entrada
- Navegação por teclado funcional

## Validação de Acessibilidade

### Leitores de Tela

- Campo de entrada com label apropriado
- Validação anunciada via aria-live
- Histórico navegável por teclado

### Navegação por Teclado

- Tab para navegar entre elementos
- Enter para executar cálculo
- Escape para limpar campo

## Validação de Segurança

### Sanitização de Input

- Caracteres especiais removidos
- Expressões maliciosas bloqueadas
- Rate limiting funcionando

### Validação Server-side

- Validação além da client-side
- Logs de auditoria funcionando
- Dados sensíveis não expostos

## Checklist de Validação

- [ ] Campo de entrada editável e focado
- [ ] Sincronização com botões da UI
- [ ] Histórico em formato JSON
- [ ] Continuidade de cálculos
- [ ] Debug em modo desenvolvimento
- [ ] Validação de expressões
- [ ] Performance dentro dos limites
- [ ] Acessibilidade WCAG 2.1
- [ ] Segurança e sanitização
- [ ] Responsividade mobile

## Comandos de Teste

```bash
# Executar testes unitários
pnpm test

# Executar testes de integração
pnpm test:integration

# Executar testes E2E
pnpm test:e2e

# Executar todos os testes
pnpm test:all

# Verificar acessibilidade
pnpm test:a11y

# Verificar performance
pnpm test:performance
```

## Dados de Teste

### Expressões Válidas

- "2 + 3"
- "10 / 2"
- "(5 + 3) \* 2"
- "2.5 + 3.7"
- "100 \* 0.1"

### Expressões Inválidas

- "2 + \* 4"
- "2 + x \* 4"
- "2 + 3 \*"
- "(2 + 3"
- "2 + 3)"
- ""

### Casos Especiais

- "10 / 0" (divisão por zero)
- "2 + 3 \* 4" (precedência de operadores)
- "0.1 + 0.2" (precisão decimal)
- "999999999 \* 999999999" (números grandes)
