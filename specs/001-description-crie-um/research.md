# Fase 0: Pesquisa e Decisões Técnicas

## Resumo

Esta pesquisa aborda as questões em aberto (`NEEDS CLARIFICATION`) identificadas no plano de implementação. As decisões a seguir definem o stack de tecnologia e a abordagem para a calculadora com histórico ramificado.

---

### 1. Linguagem e Versão

- **Questão**: Qual linguagem e versão devemos usar?
- **Decisão**: **Python 3.11**
- **Justificativa**:
  - **Simplicidade e Rapidez de Desenvolvimento**: Python é ideal para desenvolver rapidamente a lógica de negócio e a CLI.
  - **Ecossistema Robusto**: Possui bibliotecas maduras para testes (`pytest`) e CLIs (`Typer`), que atendem perfeitamente às necessidades do projeto.
  - **Portabilidade**: Funciona em todos os principais sistemas operacionais (Linux, macOS, Windows) sem modificações.
- **Alternativas Consideradas**:
  - **Rust**: Oferece maior performance e segurança de memória, mas a complexidade de desenvolvimento é maior e desnecessária para este escopo.
  - **Go**: Excelente para CLIs, mas a implementação de estruturas de grafos complexas é mais verbosa que em Python.

---

### 2. Dependências Primárias

- **Questão**: Quais são as dependências externas chave?
- **Decisão**:
  - **Core Logic (`core-lib`)**: **Nenhuma** dependência externa. A lógica do grafo será implementada com estruturas de dados nativas do Python (dicionários e classes) para manter o núcleo enxuto e portátil.
  - **CLI (`cli`)**: **Typer**.
- **Justificativa**:
  - **Isolamento**: Manter a biblioteca principal sem dependências a torna mais fácil de testar, manter e potencialmente reutilizar em outros contextos (ex: uma futura interface web).
  - **CLI Moderna**: `Typer` simplifica a criação de CLIs robustas, com validação de tipos, ajuda automática e uma sintaxe declarativa e intuitiva.
- **Alternativas Consideradas**:
  - **`argparse`**: Biblioteca padrão do Python, mas é mais verbosa e menos intuitiva que o `Typer`.
  - **`Click`**: A base do `Typer`, mas o `Typer` adiciona uma camada de conveniência com type hints.

---

### 3. Armazenamento de Persistência

- **Questão**: Como o histórico será persistido?
- **Decisão**: **Arquivo JSON único** (ex: `~/.calculator_history.json`).
- **Justificativa**:
  - **Simplicidade**: Um único arquivo JSON é a forma mais simples de persistir o estado do grafo. É legível por humanos, o que facilita a depuração.
  - **Portabilidade**: Funciona em qualquer lugar sem a necessidade de um servidor de banco de dados.
  - **Escopo**: Para o volume de dados esperado de um único usuário, o desempenho de leitura/escrita de um arquivo JSON é perfeitamente adequado.
- **Alternativas Consideradas**:
  - **SQLite**: Ofereceria transações mais robustas, mas aumenta a complexidade de implementação (schema, migrações) sem uma necessidade clara para este caso de uso.
  - **Múltiplos arquivos (formato Git-like)**: Persistir cada nó como um objeto separado seria uma analogia mais pura ao Git, mas a complexidade de gerenciar os arquivos e referências supera os benefícios para este projeto.

---

### 4. Framework de Testes

- **Questão**: Qual framework de testes será usado?
- **Decisão**: **pytest**.
- **Justificativa**:
  - **Padrão da Indústria**: `pytest` é o padrão de fato para testes em Python, com um ecossistema rico de plugins.
  - **Sintaxe Limpa**: Permite escrever testes de forma concisa e legível, sem boilerplate.
  - **Features Poderosas**: Suporte nativo a fixtures, `assert`s inteligentes e relatórios detalhados.
- **Alternativas Consideradas**:
  - **`unittest`**: Biblioteca padrão do Python, mas é mais verbosa e baseada em classes, tornando os testes menos diretos que com `pytest`.

---

### 5. Plataforma Alvo e Tipo de Projeto

- **Questão**: Onde a aplicação será executada?
- **Decisão**: **Aplicação de Linha de Comando (CLI)**.
- **Justificativa**:
  - **Foco na Lógica**: Uma CLI permite focar 100% na implementação da lógica de negócio principal (o sistema de histórico) sem a complexidade de construir uma GUI.
  - **Flexibilidade**: Uma CLI robusta pode servir como base para futuras interfaces gráficas ou web.
  - **Público Técnico**: A metáfora do Git ressoa bem com um público técnico que se sente confortável com CLIs.
- **Tipo de Projeto**: A decisão pela CLI confirma o **`single project`** como a estrutura correta.

---

## Conclusão da Fase de Pesquisa

Todas as questões em aberto foram resolvidas. O projeto será uma aplicação CLI em Python 3.11, usando `Typer` para a interface e `pytest` para os testes, com persistência de dados em um arquivo JSON. A lógica principal será autocontida e sem dependências.
