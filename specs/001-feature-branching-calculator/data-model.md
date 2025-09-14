# Modelo de Dados

Este documento define as principais entidades de dados para a feature da Calculadora com Histórico Ramificado, conforme extraído da [especificação](./spec.md).

## Entidade 1: Nó de Cálculo (`CalculationNode`)

**Descrição**: Representa um único ponto imutável no histórico de cálculos, análogo a um `commit` no Git. Cada nó armazena um snapshot do estado da calculadora.

### Atributos

| Atributo     | Tipo               | Descrição                                                                     | Obrigatório |
| :----------- | :----------------- | :---------------------------------------------------------------------------- | :---------- |
| `id`         | `string` (UUID)    | Identificador único global para o nó.                                         | Sim         |
| `parentId`   | `string` \| `null` | O ID do nó pai. É `null` para o nó raiz da árvore.                            | Não         |
| `timestamp`  | `number`           | O registro de data e hora (Unix timestamp) de quando o cálculo foi realizado. | Sim         |
| `expression` | `string`           | A expressão completa que foi avaliada para gerar o resultado (ex: "8 \* 2").  | Sim         |
| `result`     | `number`           | O resultado numérico final do cálculo.                                        | Sim         |

### Interface TypeScript

```typescript
interface CalculationNode {
  id: string;
  parentId: string | null;
  timestamp: number;
  expression: string;
  result: number;
}
```

## Entidade 2: Árvore de Histórico (`HistoryTree`)

**Descrição**: A estrutura de dados principal que encapsula todo o estado da calculadora, análoga a um `repository` no Git.

### Atributos

| Atributo   | Tipo                              | Descrição                                                                               | Obrigatório |
| :--------- | :-------------------------------- | :-------------------------------------------------------------------------------------- | :---------- |
| `nodes`    | `Record<string, CalculationNode>` | Uma coleção de todos os objetos `CalculationNode`, indexados por seus IDs.              | Sim         |
| `head`     | `string`                          | Uma referência para o `id` do `CalculationNode` que representa o estado ativo atual.    | Sim         |
| `branches` | `Record<string, string>`          | Um dicionário que mapeia nomes de `Branches` (alias) para os IDs dos `CalculationNode`. | Sim         |

### Interface TypeScript

```typescript
interface HistoryTree {
  nodes: Record<string, CalculationNode>;
  head: string;
  branches: Record<string, string>;
}
```

## Regras de Validação e Transições de Estado

- **Nó Raiz**: A árvore sempre será inicializada com um nó raiz (`id: 'root'`), `parentId: null`, `result: 0`.
- **Imutabilidade**: Uma vez criado, um `CalculationNode` nunca deve ser modificado. Qualquer alteração no histórico resulta na criação de um novo nó.
- **Divisão por Zero**: Uma operação que resulte em um erro (como divisão por zero) não criará um novo `CalculationNode`. O estado `head` permanecerá inalterado.
- **HEAD**: O `head` deve sempre apontar para um `id` de um nó existente na coleção `nodes`.
- **Branches**: Os nomes dos branches são únicos. Um `branch` sempre aponta para um `id` de um nó existente.
