# Modelo de Dados

## Resumo

Este documento define as entidades centrais para a Calculadora com Histórico Ramificado, com base na [especificação da feature](./spec.md). O modelo é projetado para ser simples, imutável e facilmente serializável para persistência em JSON, conforme decidido no [documento de pesquisa](./research.md).

---

### Entidade 1: `CalculationNode`

Representa um único ponto imutável no histórico de cálculos, análogo a um "commit" no Git.

#### Atributos

| Atributo     | Tipo de Dados (Python) | Descrição                                               | Regras de Validação / Constraints                |
| ------------ | ---------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| `id`         | `str` (UUID)           | Identificador único global para o nó.                   | Obrigatório, Único                               |
| `parent_id`  | `Optional[str]`        | O ID do nó pai. É `None` apenas para o nó raiz.         | Deve ser um `id` de nó válido se não for `None`. |
| `timestamp`  | `datetime`             | O timestamp ISO 8601 de quando o cálculo foi realizado. | Obrigatório                                      |
| `expression` | `str`                  | A expressão completa que foi avaliada (ex: "8 \* 2").   | Obrigatório, não vazio                           |
| `result`     | `float`                | O resultado numérico do cálculo.                        | Obrigatório, deve ser um número válido.          |

#### Exemplo (JSON)

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "parent_id": "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
  "timestamp": "2024-10-27T10:00:00Z",
  "expression": "8 * 2",
  "result": 16.0
}
```

---

### Entidade 2: `HistoryTree`

A estrutura de dados principal que encapsula todo o estado da calculadora, análoga a um "repositório" Git.

#### Atributos

| Atributo   | Tipo de Dados (Python)       | Descrição                                                                      | Regras de Validação / Constraints           |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------- |
| `nodes`    | `Dict[str, CalculationNode]` | Um dicionário de todos os nós de cálculo, indexados por seus IDs.              | Obrigatório                                 |
| `head`     | `str`                        | O ID do `CalculationNode` que representa o estado ativo atual.                 | Obrigatório, deve ser um `id` de nó válido. |
| `branches` | `Dict[str, str]`             | Um dicionário que mapeia nomes de branches para os IDs de nós correspondentes. | Obrigatório                                 |

#### Exemplo (JSON Completo do Arquivo de Persistência)

```json
{
  "nodes": {
    "root_node_id": {
      "id": "root_node_id",
      "parent_id": null,
      "timestamp": "2024-10-27T09:58:00Z",
      "expression": "AC",
      "result": 0.0
    },
    "node_id_1": {
      "id": "node_id_1",
      "parent_id": "root_node_id",
      "timestamp": "2024-10-27T09:59:00Z",
      "expression": "5 + 3",
      "result": 8.0
    },
    "node_id_2": {
      "id": "node_id_2",
      "parent_id": "node_id_1",
      "timestamp": "2024-10-27T10:00:00Z",
      "expression": "8 * 2",
      "result": 16.0
    },
    "node_id_3": {
      "id": "node_id_3",
      "parent_id": "node_id_1",
      "timestamp": "2024-10-27T10:01:00Z",
      "expression": "8 - 1",
      "result": 7.0
    }
  },
  "head": "node_id_3",
  "branches": {
    "main": "node_id_2",
    "feature/scenario-analysis": "node_id_3"
  }
}
```

---

### Relacionamentos

- A `HistoryTree` **contém** uma coleção de `CalculationNode`.
- Cada `CalculationNode` (exceto o raiz) **tem uma referência (`parent_id`)** para outro `CalculationNode`, formando uma estrutura de grafo acíclico dirigido (uma árvore com possíveis múltiplos filhos por nó).
- A `HistoryTree` usa `head` e `branches` como **ponteiros nomeados** para nós específicos dentro da coleção `nodes`.
