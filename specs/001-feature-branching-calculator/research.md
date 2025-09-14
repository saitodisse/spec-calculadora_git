# Fase 0: Pesquisa de Tecnologia e Padrões

## 1. Padrões de Gerenciamento de Estado de Grafo em React/Next.js

### Decisão

Utilizaremos uma combinação de **React Context** com o hook `useReducer` para gerenciar o estado do grafo da calculadora. Para otimizar a performance e evitar re-renderizações desnecessárias em componentes que não precisam do estado completo, faremos uso de seletores (selectors) simples.

### Justificativa

- **Simplicidade**: `useReducer` é nativo do React e suficiente para a complexidade do nosso estado, evitando a necessidade de bibliotecas de terceiros como Redux ou Zustand, o que está alinhado com o princípio YAGNI.
- **Performance**: O uso de `React.memo` em componentes e a implementação de seletores para consumir apenas partes específicas do estado (ex: apenas o resultado atual do HEAD) minimizarão o impacto nas re-renderizações.
- **Imutabilidade**: A natureza do `useReducer` incentiva a imutabilidade, o que é crucial para a nossa estrutura de dados de "commits" (Nós de Cálculo), garantindo que o histórico nunca seja modificado diretamente.

### Alternativas Consideradas

- **Redux Toolkit**: Poderoso, mas excessivo para a escala deste projeto. A configuração e o boilerplate adicionais introduziriam complexidade desnecessária.
- **Zustand**: Mais leve que Redux, mas ainda assim uma dependência externa. A combinação de `useContext` e `useReducer` atinge o mesmo objetivo com ferramentas já disponíveis no ecossistema React.

## 2. Abordagem de Persistência no Local Storage

### Decisão

Criaremos um `PersistenceService` dedicado que encapsula toda a lógica de interação com o Local Storage. O estado da `HistoryTree` será serializado para JSON usando `JSON.stringify` antes de ser salvo e desserializado com `JSON.parse` ao ser carregado. A persistência ocorrerá de forma assíncrona após cada mudança de estado bem-sucedida para não bloquear a thread principal.

### Justificativa

- **Encapsulamento**: Isolar a lógica de persistência em um serviço desacopla o core da calculadora do mecanismo de armazenamento, facilitando testes e futuras mudanças (ex: migrar para IndexedDB).
- **Segurança**: Envolver a desserialização em um bloco `try-catch` garantirá que a aplicação não quebre caso os dados no Local Storage estejam corrompidos ou em um formato inesperado.
- **Performance**: A escrita assíncrona (ex: usando `setTimeout(..., 0)`) garante que a UI permaneça responsiva mesmo durante a operação de salvamento.

### Alternativas Consideradas

- **IndexedDB**: Mais robusto e adequado para grandes volumes de dados, mas o Local Storage é mais simples e perfeitamente adequado para o tamanho esperado do nosso estado (alguns kilobytes a megabytes, no máximo).
- **Bibliotecas (ex: `localForage`)**: Adicionam uma camada de abstração útil, mas para uma simples operação de `getItem`/`setItem`, o custo de uma dependência adicional não se justifica.

## 3. Estrutura de Projeto e Configuração da Stack

### Decisão

- **Estrutura**: Seguiremos a estrutura de diretórios proposta no `plan.md`, com o `App Router` do Next.js. A lógica de negócio (`calculator-core`) será separada da UI e dos serviços.
- **Estilização**: Utilizaremos a CLI da Shadcn UI para adicionar componentes conforme necessário, mantendo o `tailwind.config.js` e `globals.css` como a base da estilização.
- **Testes**: Configuraremos `vitest.config.ts` na raiz do projeto, integrando-o com o `tsconfig.json` do Next.js para suporte a aliases de caminho. O `React Testing Library` será usado para testes de componentes e integração.

### Justificativa

- **Boas Práticas**: A estrutura escolhida promove a separação de responsabilidades (SoC), tornando o código mais manutenível e testável.
- **Eficiência**: A CLI da Shadcn UI acelera o desenvolvimento ao fornecer componentes acessíveis e customizáveis, baseados em Radix UI.
- **Padrão da Indústria**: ViTest oferece uma alternativa rápida e compatível com a API do Jest, sendo uma escolha moderna e popular para projetos React.

## 4. Conclusão da Pesquisa

A pesquisa confirma que a stack tecnológica escolhida é adequada e que existem padrões bem estabelecidos para sua implementação. Nenhuma barreira técnica foi identificada. Estamos prontos para prosseguir com a Fase 1: Design & Contratos.
