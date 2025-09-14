# Guia de Início Rápido (Quickstart)

Este documento descreve os passos para verificar manualmente a **User Story Primária** da feature da Calculadora com Histórico Ramificado.

**User Story**: _Como um analista financeiro, eu quero realizar uma série de cálculos para uma projeção. Se eu descobrir um erro em um passo intermediário, quero poder voltar àquele ponto, corrigi-lo com um novo cálculo e continuar a partir dali em uma nova "linha do tempo", sem perder minha trilha de cálculo original, para que eu possa comparar os resultados de ambos os cenários (o original e o corrigido)._

## Pré-requisitos

- Docker e Docker Compose devem estar instalados e em execução.
- O ambiente local deve ser iniciado com `pnpm install` e `docker-compose up`.
- A aplicação Next.js deve estar em execução com `pnpm dev`.

## Passos de Verificação

### 1. Acesso Não Autenticado

1.  **Abra a aplicação** em uma janela anônima.
2.  **Verifique a UI**: Um botão "Login com Google" deve estar visível. Uma mensagem deve informar que o progresso não será salvo.
3.  **Use a calculadora**: Realize um cálculo, como `5 + 5 =`. O resultado `10` deve aparecer.
4.  **Recarregue a página**:
    - **Resultado esperado**: O histórico do cálculo anterior (`5 + 5 = 10`) **não** deve ser mantido. A calculadora deve voltar ao estado inicial.

### 2. Login e Persistência

1.  **Clique no botão "Login com Google"** e complete o fluxo de autenticação.
2.  **Verifique a UI**: O botão de login deve ser substituído por um indicador de usuário logado (ex: avatar ou email).
3.  **Realize um cálculo**: `100 / 4 =`. O resultado `25` deve aparecer.
4.  **Feche a aba e abra novamente** (ou acesse de outro navegador/dispositivo e faça login).
    - **Resultado esperado**: O histórico contendo o nó `"100 / 4 = 25"` DEVE ser carregado automaticamente.

### 3. Branching e Persistência

1.  **Com o histórico do passo anterior**, clique no nó `25` para ativá-lo.
2.  **Crie um novo ramo**: A partir do `25`, calcule `* 2 =`. O resultado `50` deve aparecer.
3.  **Recarregue a página**.
    - **Resultado esperado**: A árvore de histórico completa, incluindo o novo ramo, deve ser restaurada, provando que as modificações também são persistidas.
