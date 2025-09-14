# Modelo de Dados

Este documento define as principais entidades de dados para a feature da Calculadora com Histórico Ramificado, conforme extraído da [especificação](./spec.md).

## Entidade 1: Usuário (`User`)

**Descrição**: Representa um usuário do sistema. As tabelas de `User`, `Account`, `Session` e `VerificationToken` serão gerenciadas automaticamente pelo **NextAuth.js**. Nossa aplicação irá apenas se relacionar com a tabela `User`.

## Entidade 2: Árvore de Histórico (`HistoryTree`)

**Descrição**: A estrutura de dados principal que encapsula o histórico de cálculos de um único usuário. Cada usuário terá exatamente uma árvore de histórico. A estrutura interna (Nós, HEAD, Branches) será armazenada como um único objeto JSON no banco de dados para simplificar a persistência.

### Atributos

| Atributo    | Tipo            | Descrição                                                                                                   | Obrigatório |
| :---------- | :-------------- | :---------------------------------------------------------------------------------------------------------- | :---------- |
| `id`        | `string` (UUID) | Identificador único global para a árvore de histórico.                                                      | Sim         |
| `userId`    | `string`        | Chave estrangeira que referencia o `id` da tabela `User` do NextAuth.                                       | Sim         |
| `data`      | `JSON`          | Um campo do tipo JSON que armazena o objeto `HistoryTree` completo (contendo `nodes`, `head` e `branches`). | Sim         |
| `updatedAt` | `DateTime`      | Data da última modificação, gerenciada automaticamente pelo ORM.                                            | Sim         |

### Relações

- Um `User` tem um `HistoryTree` (relação 1-para-1).

### Interface TypeScript (para o campo `data`)

```typescript
interface HistoryTreeData {
  nodes: Record<string, CalculationNode>;
  head: string;
  branches: Record<string, string>;
}
```

## Entidade 3: Nó de Cálculo (`CalculationNode`)

**Descrição**: Representa um único ponto imutável no histórico. Esta entidade **não é uma tabela separada** no banco de dados; ela faz parte do objeto JSON armazenado no campo `data` da `HistoryTree`.

### Atributos

| Atributo     | Tipo               | Descrição                                                                               | Obrigatório |
| :----------- | :----------------- | :-------------------------------------------------------------------------------------- | :---------- |
| `id`         | `string` (UUID)    | Identificador único global para o nó.                                                   | Sim         |
| `parentId`   | `string` \| `null` | O ID do nó pai. É `null` para o nó raiz da árvore.                                      | Não         |
| `timestamp`  | `number`           | O registro de data e hora (Unix timestamp) de quando o cálculo foi realizado.           | Sim         |
| `expression` | `string`           | A expressão completa que foi avaliada, podendo incluir parênteses (ex: "(5 + 5) \* 2"). | Sim         |
| `result`     | `number`           | O resultado numérico final do cálculo.                                                  | Sim         |

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

## Regras de Validação e Transições de Estado

- **Persistência**: O objeto `HistoryTreeData` só pode ser salvo para um `User` autenticado.
- **Nó Raiz**: A árvore sempre será inicializada com um nó raiz (`id: 'root'`), `parentId: null`, `expression: '0'`, `result: 0`.
- **Imutabilidade**: Uma vez criado, um `CalculationNode` nunca deve ser modificado. Qualquer alteração no histórico resulta na criação de um novo nó dentro do objeto JSON.
- **HEAD**: O `head` deve sempre apontar para um `id` de um nó existente na coleção `nodes`.
- **Branches**: Os nomes dos branches são únicos. Um `branch` sempre aponta para um `id` de um nó existente.
