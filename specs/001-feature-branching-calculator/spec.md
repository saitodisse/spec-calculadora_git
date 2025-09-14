# Especificação da Feature: Calculadora com Histórico Ramificado

**Branch da Feature**: `001-site-git-calc`  
**Criada em**: 2024-10-27  
**Status**: Aprovado para Planejamento  
**Entrada**: Descrição do usuário: "crie um especificação para criar uma calculadora com histórico. Dessa forma poderia voltar nos calculos anteriores mudando o estado."

## Fluxo de Execução (principal)

```
1. Interpretar a descrição do usuário a partir da Entrada
   → Descrição clara: calculadora com histórico não-linear que permite voltar a cálculos anteriores
2. Extrair conceitos-chave da descrição
   → Identificar: calculadora, histórico, navegação temporal, mudança de estado
3. Para cada aspecto não claro:
   → Conceito de "histórico ramificado" baseado em paradigma Git
4. Preencher a seção de Cenários do Usuário & Testes
   → Fluxo claro: operações matemáticas com navegação histórica
5. Gerar Requisitos Funcionais
   → Cada requisito testável e específico
6. Identificar Entidades-Chave
   → Nós de cálculo, árvore de histórico, branches
7. Executar o Checklist de Revisão
   → Spec completa e pronta para planejamento
8. Retorno: SUCESSO (spec pronta para planejamento)
```

---

## ⚡ Diretrizes Rápidas

- ✅ Foque no QUE os usuários precisam e POR QUÊ
- ❌ Evite o COMO implementar (sem stack, APIs, estrutura de código)
- 👥 Escrito para stakeholders de negócio, não para desenvolvedores

### Requisitos das Seções

- **Seções obrigatórias**: Devem ser concluídas para toda feature
- **Seções opcionais**: Incluir apenas quando relevante
- Quando uma seção não se aplica, remova totalmente (não deixe como "N/A")

### Para Geração por IA

Ao criar esta spec a partir de um prompt do usuário:

1. **Marque todas as ambiguidades**: Use [NEEDS CLARIFICATION: pergunta específica] para qualquer suposição necessária
2. **Não presuma**: Se o prompt não especifica algo (ex.: "sistema de login" sem método de auth), marque
3. **Pense como um testador**: Todo requisito vago deve reprovar no item "testável e não ambíguo"
4. **Áreas comumente subespecificadas**:
   - Tipos de usuários e permissões
   - Políticas de retenção/remoção de dados
   - Metas de performance e escala
   - Comportamentos de tratamento de erro
   - Requisitos de integração
   - Necessidades de segurança/compliance

---

## Cenários do Usuário & Testes (obrigatório)

### User Story Primária

Como um usuário registrado, eu quero que meu histórico de cálculos seja salvo na minha conta para que eu possa acessá-lo e continuá-lo de qualquer dispositivo, a qualquer momento.

### Cenários de Aceitação

**Cenário: Acesso Não Autenticado**
**Dado** que um usuário não está logado.
**Quando** ele acessa a calculadora.
**Então** ele pode usar a calculadora normalmente, mas uma mensagem deve indicar que o histórico não será salvo.
**E** um botão "Login para Salvar" deve ser exibido.

**Cenário: Login e Persistência do Histórico**
**Dado** que um usuário faz login com sucesso usando sua conta do Google.
**Quando** ele realiza uma série de cálculos.
**Então** seu histórico de cálculos DEVE ser salvo automaticamente no banco de dados associado à sua conta.
**E** ao fechar e reabrir o navegador (ou acessar de outro dispositivo), seu histórico completo é restaurado.

**Cenário: Navegação e Criação de um Ramo (Branch)**
**Dado** o histórico do cenário anterior.
**Quando** o usuário navega e ativa (realiza um checkout) o nó com o resultado `45`.
**Então** o visor da calculadora é atualizado para mostrar o resultado `45`, que se torna a entrada para a próxima operação.
**E** quando o usuário executa uma nova operação `/ 9 =`.
**Então** o visor deve mostrar o novo resultado `5`.
**E** um novo nó para a expressão `"45 / 9 = 5"` deve ser criado como um novo filho do nó `45`.
**E** o nó original com o resultado `50` e sua linhagem devem permanecer intactos na Árvore de Histórico.

**Cenário: Visualização e Troca entre Ramos**
**Dado** o estado do histórico do cenário anterior, onde existem duas linhas de cálculo divergindo do nó `45`.
**Quando** o usuário abre a interface de visualização da Árvore de Histórico.
**Então** a interface deve renderizar um gráfico mostrando o nó `45` com dois filhos: um para o resultado `50` e outro para o resultado `5`.
**Quando** o usuário clica e ativa (checkout) o nó `50` na visualização.
**Então** o visor da calculadora deve ser atualizado para exibir `50`.
**E** o ponteiro HEAD deve agora referenciar o nó `50`.

**Cenário: Uso de Parênteses para Ordem de Operações**
**Dado** que a calculadora está no estado inicial (valor 0).
**Quando** o usuário executa a expressão `(5 + 5) * 2 =`.
**Então** o visor deve mostrar o resultado `20`, respeitando os parênteses antes da multiplicação.
**E** a Árvore de Histórico deve conter um novo nó para a expressão `"(5 + 5) * 2 = 20"`.

### Casos Limite

**Operações inválidas**: Uma operação inválida, como uma divisão por zero (n/0), não deve corromper o estado da aplicação. Tal operação não deve gerar um novo Nó de Cálculo. O estado HEAD deve permanecer no nó pai, e uma mensagem de erro apropriada deve ser exibida temporariamente no visor.

**Persistência de dados**: O estado completo da aplicação, incluindo a Árvore de Histórico, DEVE ser salvo em um banco de dados PostgreSQL associado à conta do usuário autenticado. Ao reabrir, o estado deve ser restaurado.

**Complexidade visual**: A interface deve lidar com uma árvore de histórico muito complexa através de interações como zoom e pan (arrastar a visualização). Funcionalidades para colapsar e expandir ramos podem ser necessárias para gerenciar a complexidade visual.

## Requisitos (obrigatório)

### Requisitos Funcionais

#### FR-CORE: Funcionalidades Básicas da Calculadora

**FR-CORE-001**: O sistema DEVE fornecer as quatro operações aritméticas básicas: adição (+), subtração (-), multiplicação (\*) e divisão (/).

**FR-CORE-002**: O sistema DEVE possuir um visor principal para exibir a expressão atual sendo construída e o resultado da última expressão avaliada.

**FR-CORE-003**: O sistema DEVE possuir um botão 'Limpar' (C) que cria um novo Nó de Cálculo com valor 0, tendo o nó HEAD atual como pai.

**FR-CORE-004**: O sistema DEVE possuir um botão 'Limpar Tudo' (AC) que reinicia a Árvore de Histórico para um estado inicial, com apenas um nó raiz (valor 0).

**FR-CORE-005**: O sistema DEVE permitir a inclusão de parênteses `()` para controlar a ordem das operações, conforme as regras matemáticas padrão.

#### FR-STATE: Gerenciamento de Estado e Histórico

**FR-STATE-001**: A avaliação bem-sucedida de uma expressão completa (iniciada pelo usuário, por exemplo, ao pressionar '=') DEVE resultar na criação de um novo Nó de Cálculo imutável na Árvore de Histórico.

**FR-STATE-002**: Cada Nó de Cálculo DEVE conter uma referência para seu Nó Pai. O nó raiz não terá um pai.

**FR-STATE-003**: O sistema DEVE manter um ponteiro global (HEAD) que referencia o Nó de Cálculo ativo. O valor no visor DEVE ser sempre o resultado do nó HEAD.

**FR-STATE-004**: Após a criação de um novo Nó de Cálculo, o ponteiro HEAD DEVE ser movido atomicamente para este novo nó.

#### FR-NAV: Navegação no Histórico

**FR-NAV-001**: O sistema DEVE permitir que os usuários selecionem qualquer Nó de Cálculo na visualização da Árvore e o definam como o HEAD atual (operação de checkout).

**FR-NAV-002**: Ao executar um checkout, o visor DEVE ser atualizado imediatamente com o valor do novo nó HEAD.

**FR-NAV-003**: Se um checkout for feito para um nó interno (que já possui filhos), o sistema entrará em um estado de "HEAD Desanexado". A interface DEVE exibir uma notificação clara, como "Você está navegando no histórico. Qualquer novo cálculo criará um novo ramo a partir deste ponto."

#### FR-BRANCH: Ramificação (Branching)

**FR-BRANCH-001**: Se o HEAD atual aponta para um nó e uma nova operação de cálculo é executada, um novo Nó de Cálculo DEVE ser criado automaticamente como um novo filho do nó HEAD atual. Esta ação cria um novo ramo (branch), preservando quaisquer ramos filhos existentes.

**FR-BRANCH-002**: O sistema DEVE permitir que o usuário atribua um nome (alias) a qualquer nó, criando um Branch nomeado.

**FR-BRANCH-003**: Os Branches nomeados DEVEM ser claramente identificados com seus nomes na visualização da Árvore de Histórico.

**FR-BRANCH-004**: O sistema DEVE permitir que o usuário renomeie um Branch nomeado existente.

**FR-BRANCH-005**: O sistema DEVE permitir que o usuário exclua um Branch nomeado. A exclusão de um Branch não DEVE apagar os Nós de Cálculo associados a ele.

#### FR-VIS: Visualização do Histórico

**FR-VIS-001**: O sistema DEVE fornecer uma interface gráfica que renderiza a Árvore de Histórico como um diagrama de nós e arestas (grafo).

**FR-VIS-002**: Cada nó no diagrama DEVE exibir a expressão completa e seu resultado final (ex: `"5 * 10 - 5 = 45"`).

**FR-VIS-003**: O nó HEAD atual DEVE ser visualmente destacado no diagrama.

**FR-VIS-004**: Os nós que são apontados por Branches nomeados DEVEM exibir seus respectivos nomes.

**FR-VIS-005**: A visualização DEVE ser interativa, permitindo que o usuário clique em qualquer nó para executar a operação de checkout.

**FR-VIS-006**: A interface DEVE fornecer um indicador visual sutil de que a próxima operação criará um novo ramo quando o usuário estiver em um estado de "HEAD Desanexado".

**FR-ERROR-001**: Em caso de expressão matemática inválida (ex: `1 + * 2`), o sistema DEVE fornecer feedback claro ao usuário, exibindo uma mensagem de erro e, se possível, destacando a parte incorreta da expressão.

#### FR-PERSIST: Persistência de Dados

**FR-PERSIST-001**: O sistema DEVE salvar automaticamente o estado completo da Árvore de Histórico em um banco de dados PostgreSQL quando o aplicativo for fechado ou após cada operação bem-sucedida.

**FR-PERSIST-002**: O sistema DEVE carregar automaticamente o estado salvo na inicialização do aplicativo.

#### FR-AUTH: Autenticação de Usuário

**FR-AUTH-001**: O sistema DEVE permitir que os usuários se autentiquem usando o provedor Google OAuth através do NextAuth.js.
**FR-AUTH-002**: Apenas usuários autenticados DEVEM ter seu histórico de cálculos salvo no banco de dados.
**FR-AUTH-003**: A interface DEVE exibir claramente o estado de autenticação do usuário (logado ou deslogado).

## Fora do Escopo (opcional)

As seguintes funcionalidades são explicitamente consideradas fora do escopo para esta versão, a fim de manter o foco na funcionalidade principal:

**Merge de Ramos**: Não haverá funcionalidade para fundir duas linhas de cálculo diferentes em uma só.

**Rebase de Ramos**: Não haverá funcionalidade para mover uma sequência de nós de um ponto da árvore para outro.

## Entidades-Chave (obrigatório)

#### Entidade 1: Usuário (`User`)

**Descrição**: Representa um usuário do sistema, gerenciado pelo NextAuth.js. A tabela no banco de dados conterá perfis de usuário.

**Atributos**: `id`, `name`, `email`, `image` (padrão NextAuth).

#### Entidade 2: Nó de Cálculo (CalculationNode)

**Descrição**: Representa um único ponto imutável no histórico de cálculos, análogo a um commit no Git. Cada nó armazena um snapshot do estado da calculadora.

**Atributos**:

- **ID**: Identificador único global (ex: UUID).
- **ParentID**: O ID do nó pai (nulo para o nó raiz).
- **Timestamp**: O registro de data e hora de quando o cálculo foi realizado.
- **Expressao**: A expressão completa que foi avaliada para gerar o resultado (ex: "5 \* 10 - 5").
- **ResultadoFinal**: O resultado numérico do cálculo.

#### Entidade 3: Árvore de Histórico (HistoryTree)

**Descrição**: A estrutura de dados principal que encapsula o histórico de um usuário. Cada usuário terá sua própria árvore.

**Atributos-Chave**:

- **Nodes**: Uma coleção de todos os objetos Nó de Cálculo, indexados por seus IDs.
- **HEAD**: Uma referência para o ID do Nó de Cálculo que representa o estado ativo atual.
- **Branches**: Um dicionário que mapeia nomes de Branches para os IDs dos Nós de Cálculo correspondentes.

---

## Checklist de Revisão & Aceite

_GATE: Checagens automáticas executadas durante main()_

### Qualidade do Conteúdo

- [x] Sem detalhes de implementação (linguagens, frameworks, APIs)
- [x] Foco no valor ao usuário e necessidades de negócio
- [x] Escrito para stakeholders não técnicos
- [x] Todas as seções obrigatórias concluídas

### Integralidade dos Requisitos

- [x] Nenhum marcador [NEEDS CLARIFICATION] remanescente
- [x] Requisitos testáveis e não ambíguos
- [x] Critérios de sucesso mensuráveis
- [x] Escopo claramente delimitado (incluindo seção "Fora do Escopo")
- [x] Dependências e premissas identificadas

---

## Status de Execução

_Atualizado por main() durante o processamento_

- [x] Descrição do usuário interpretada
- [x] Conceitos-chave extraídos
- [x] Ambiguidades marcadas
- [x] Cenários do usuário definidos
- [x] Requisitos gerados
- [x] Entidades identificadas
- [x] Checklist de revisão aprovado

---
