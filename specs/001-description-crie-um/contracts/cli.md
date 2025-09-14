# Contratos da CLI

## Resumo

Este documento define a interface de linha de comando (CLI) para interagir com a biblioteca `core-lib` da calculadora. A CLI é o "contrato" primário entre o usuário e a aplicação. Os comandos são projetados para serem análogos às operações do Git.

A aplicação será invocada através de um único ponto de entrada, que chamaremos de `calc`.

---

### Comando 1: `calc eval`

Realiza um cálculo e cria um novo nó no histórico.

- **Uso**: `calc eval "<expression>"`
- **Argumentos**:
  - `expression` (str, obrigatório): A expressão matemática a ser avaliada, entre aspas. Ex: "5 + 3", "8 \* 2".
- **Comportamento**:
  - Avalia a expressão matemática.
  - Cria um novo `CalculationNode` com o resultado.
  - O `parent_id` do novo nó será o `HEAD` atual.
  - Atualiza o `HEAD` para o ID do novo nó.
  - Imprime o resultado final no `stdout`.
- **Exemplo**:
  ```sh
  $ calc eval "5 + 3"
  8.0
  ```

---

### Comando 2: `calc history`

Exibe o histórico de cálculos como uma árvore.

- **Uso**: `calc history [--all]`
- **Opções**:
  - `--all` (flag, opcional): Mostra todos os branches. Por padrão, mostra apenas o branch atual.
- **Comportamento**:
  - Renderiza a `HistoryTree` como uma representação textual de um grafo no `stdout`.
  - Destaca o nó `HEAD` atual (ex: `*`).
  - Mostra os nomes dos branches apontando para seus respectivos nós.
- **Exemplo de Saída**:
  ```sh
  * 7.0 (HEAD, feature/scenario-analysis) [expr: 8 - 1]
  |
  o 16.0 (main) [expr: 8 * 2]
  |/
  o 8.0 [expr: 5 + 3]
  |
  o 0.0 [expr: AC]
  ```

---

### Comando 3: `calc checkout`

Muda o estado ativo (`HEAD`) para um nó ou branch existente.

- **Uso**: `calc checkout <target>`
- **Argumentos**:
  - `target` (str, obrigatório): O nome de um branch ou o ID (ou um prefixo único do ID) de um nó.
- **Comportamento**:
  - Atualiza o `HEAD` na `HistoryTree` para apontar para o ID do nó correspondente ao `target`.
  - Imprime o novo estado (resultado) no `stdout`.
- **Exemplo**:
  ```sh
  $ calc checkout main
  HEAD is now at node <node_id_2>
  Current value: 16.0
  ```

---

### Comando 4: `calc branch`

Gerencia os branches nomeados.

- **Uso**:
  - `calc branch <name>`: Cria um novo branch no `HEAD` atual.
  - `calc branch`: Lista todos os branches.
  - `calc branch -d <name>`: Deleta um branch.
  - `calc branch -m <old_name> <new_name>`: Renomeia um branch.
- **Comportamento**:
  - **Criar**: Adiciona uma nova entrada no dicionário `branches` da `HistoryTree`.
  - **Listar**: Imprime a lista de branches.
  - **Deletar**: Remove a entrada do dicionário `branches`. Não deleta os nós.
  - **Renomear**: Atualiza a chave no dicionário `branches`.
- **Exemplo**:
  ```sh
  $ calc branch feature/new-idea
  Branch 'feature/new-idea' created at HEAD.
  ```

---

### Comando 5: `calc reset`

Reinicia o estado da calculadora.

- **Uso**: `calc reset`
- **Comportamento**:
  - Corresponde ao requisito `FR-CORE-004` (Limpar Tudo / AC).
  - Apaga todo o histórico e o recria com um único nó raiz com valor 0.
- **Exemplo**:
  ```sh
  $ calc reset
  Calculator history has been reset.
  ```
