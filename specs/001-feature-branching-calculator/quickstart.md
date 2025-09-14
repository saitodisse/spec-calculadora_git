# Guia de Início Rápido (Quickstart)

Este documento descreve os passos para verificar manualmente a **User Story Primária** da feature da Calculadora com Histórico Ramificado.

**User Story**: _Como um analista financeiro, eu quero realizar uma série de cálculos para uma projeção. Se eu descobrir um erro em um passo intermediário, quero poder voltar àquele ponto, corrigi-lo com um novo cálculo e continuar a partir dali em uma nova "linha do tempo", sem perder minha trilha de cálculo original, para que eu possa comparar os resultados de ambos os cenários (o original e o corrigido)._

## Pré-requisitos

- A aplicação deve estar em execução no ambiente de desenvolvimento (`npm run dev`).
- O estado da calculadora deve estar zerado (sem histórico prévio).

## Passos de Verificação

### 1. Criar um Histórico Linear (Cenário Original)

1.  **Abra a aplicação** no navegador. O visor deve mostrar "0".
2.  **Execute a sequência de operações**: `5`, `+`, `3`, `=`.
    - **Resultado esperado**: O visor deve mostrar "8".
3.  **Continue a sequência**: `*`, `2`, `=`.
    - **Resultado esperado**: O visor deve mostrar "16".
4.  **Abra a visualização do histórico**.
    - **Resultado esperado**: Você deve ver um grafo linear: `(0) -> (8) -> (16)`. O nó `(16)` deve estar destacado como `HEAD`.

### 2. Navegar e Criar um Ramo (Cenário Corrigido)

1.  **Na visualização do histórico**, clique no nó que contém o resultado "8".
    - **Resultado esperado**: O visor da calculadora deve ser atualizado para "8". O nó `(8)` agora deve estar destacado como `HEAD`. A interface deve indicar um estado de "HEAD Desanexado".
2.  **Execute a operação de correção**: `-`, `1`, `=`.
    - **Resultado esperado**: O visor deve mostrar "7".
3.  **Verifique a visualização do histórico novamente**.

    - **Resultado esperado**: A árvore de histórico agora deve mostrar um ramo. O nó `(8)` deve ter dois filhos: `(16)` e `(7)`. O novo nó `(7)` deve estar destacado como o `HEAD` atual.

    ```
      (0) -> (8) -> (16)
             \
              -> (7)  <-- HEAD
    ```

### 3. Comparar os Cenários

1.  **Na visualização do histórico**, clique no nó com o resultado "16".
    - **Resultado esperado**: O visor deve ser atualizado para "16". O `HEAD` agora aponta para o nó `(16)`.
2.  **Clique novamente no nó** com o resultado "7".
    - **Resultado esperado**: O visor deve ser atualizado para "7". O `HEAD` agora aponta para o nó `(7)`.

## Conclusão

Ao final destes passos, você terá validado com sucesso a principal funcionalidade da calculadora: a capacidade de navegar no histórico, criar um novo ramo a partir de um ponto anterior e alternar facilmente entre as diferentes linhas de tempo para comparar resultados, cumprindo assim a User Story Primária.
