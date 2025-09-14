# Guia de Início Rápido (Quickstart)

## Resumo

Este documento serve como um guia de validação e um tutorial prático, baseado nos cenários de aceitação da [especificação da feature](./spec.md). Ele demonstra o fluxo de trabalho principal da Calculadora com Histórico Ramificado através de sua interface de linha de comando (`calc`).

---

### Pré-requisitos

- A aplicação `calc` está instalada e disponível no `PATH`.
- Não há nenhum histórico anterior (ou o histórico foi limpo com `calc reset`).

---

### Cenário 1: Criação de um Histórico Linear

Este cenário valida a criação de um histórico simples e sequencial.

1.  **Reinicie o estado** para garantir um início limpo.

    ```sh
    $ calc reset
    Calculator history has been reset.
    ```

2.  **Execute o primeiro cálculo**: `5 + 3`.

    ```sh
    $ calc eval "5 + 3"
    8.0
    ```

3.  **Execute o segundo cálculo** a partir do resultado anterior: `8 * 2`.

    ```sh
    $ calc eval "8 * 2"
    16.0
    ```

4.  **Verifique o histórico**. A saída deve mostrar uma linha reta de "commits", com `HEAD` no resultado `16.0`.
    ```sh
    $ calc history
    * 16.0 (HEAD, main) [expr: 8 * 2]
    |
    o 8.0 [expr: 5 + 3]
    |
    o 0.0 [expr: AC]
    ```
    _(Nota: `main` é o nome do branch padrão criado no primeiro cálculo.)_

---

### Cenário 2: Navegação e Criação de um Ramo (Branch)

Este cenário valida a capacidade de voltar no tempo e criar uma linha de cálculo alternativa.

1.  **Navegue (checkout) para o estado anterior** onde o resultado era `8.0`. Vamos usar o ID do nó (um prefixo curto seria suficiente) ou criar um branch lá para facilitar. Para este guia, vamos supor que podemos nos referir a ele por sua expressão ou resultado de forma simplificada.

    ```sh
    # Primeiro, identifique o nó alvo
    $ calc history
    * 16.0 (HEAD, main) [expr: 8 * 2]
    |
    o 8.0 [expr: 5 + 3] # <- Este é o nosso alvo
    |
    o 0.0 [expr: AC]

    # Faça o checkout para o nó com resultado 8.0
    # (Supondo que a CLI possa resolver "resultado 8.0" para o ID do nó)
    $ calc checkout <id_do_no_8.0>
    HEAD is now in a detached state at <id_do_no_8.0>
    Current value: 8.0
    ```

2.  **Crie um novo branch** para nomear esta linha de trabalho.

    ```sh
    $ calc branch feature/alternative-scenario
    Branch 'feature/alternative-scenario' created at HEAD.
    ```

3.  **Execute uma nova operação** a partir deste ponto: `8 - 1`.

    ```sh
    $ calc eval "8 - 1"
    7.0
    ```

4.  **Verifique o histórico novamente**. A saída deve agora mostrar uma bifurcação (um "ramo") no grafo a partir do nó `8.0`.
    ```sh
    $ calc history --all
    * 7.0 (HEAD, feature/alternative-scenario) [expr: 8 - 1]
    |
    | o 16.0 (main) [expr: 8 * 2]
    |/
    o 8.0 [expr: 5 + 3]
    |
    o 0.0 [expr: AC]
    ```

---

### Cenário 3: Troca Entre Ramos

Este cenário valida a facilidade de alternar entre diferentes contextos de cálculo.

1.  **Atualmente, estamos no branch `feature/alternative-scenario`**, com o resultado `7.0`.

2.  **Mude para o branch `main`** para voltar ao contexto original.

    ```sh
    $ calc checkout main
    HEAD is now at node <id_do_no_16.0>
    Current value: 16.0
    ```

3.  **Verifique o histórico** para confirmar que o `HEAD` agora aponta para `16.0` no branch `main`.
    ```sh
    $ calc history --all
      7.0 (feature/alternative-scenario) [expr: 8 - 1]
    |
    * 16.0 (HEAD, main) [expr: 8 * 2]
    |/
    o 8.0 [expr: 5 + 3]
    |
    o 0.0 [expr: AC]
    ```

## Conclusão da Validação

Se todos os comandos acima se comportarem como descrito, a implementação principal da funcionalidade de histórico ramificado é considerada validada com sucesso.
