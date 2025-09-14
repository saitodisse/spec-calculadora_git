# Fase 0: Pesquisa de Tecnologia e Arquitetura Full-Stack

## 1. Estratégia de Banco de Dados e ORM

### Decisão

Utilizaremos **PostgreSQL** como nosso banco de dados, orquestrado via **Docker Compose** para o ambiente de desenvolvimento local. A interação com o banco de dados será gerenciada pelo ORM **Prisma**.

### Justificativa

- **Robustez e Escalabilidade**: PostgreSQL é um banco de dados relacional poderoso e confiável, adequado para aplicações que podem crescer no futuro.
- **Ambiente Consistente**: Docker Compose garante um ambiente de desenvolvimento local consistente e facilmente replicável, eliminando problemas de configuração entre diferentes máquinas.
- **Segurança de Tipos e Produtividade**: Prisma oferece um cliente de banco de dados totalmente tipado, o que se alinha perfeitamente com nossa abordagem TypeScript-first. Ele simplifica as migrações de esquema e as consultas ao banco de dados.

### Alternativas Consideradas

- **Drizzle ORM**: Uma alternativa mais leve e "closer-to-SQL", mas Prisma oferece um ecossistema mais maduro e ferramentas de desenvolvimento (como o Prisma Studio) que aceleram o trabalho.
- **SQLite**: Ótimo para prototipagem rápida, mas menos robusto para uma aplicação com autenticação de usuários e potencial crescimento.

## 2. Estratégia de Autenticação

### Decisão

Utilizaremos **NextAuth.js (v5)** para gerenciar a autenticação, configurada com o provedor **Google OAuth**.

### Justificativa

- **Padrão da Indústria**: NextAuth.js é a solução de autenticação de fato para aplicações Next.js, oferecendo segurança, simplicidade e excelente integração com o framework.
- **Experiência do Usuário**: O login social com o Google é conveniente e amplamente adotado, reduzindo a fricção para novos usuários.
- **Gerenciamento de Sessão**: A biblioteca lida com todo o gerenciamento de sessões, tokens e segurança de forma automática.

## 3. Estratégia de Renderização e Fetching de Dados

### Decisão

Priorizaremos **Server Components** do Next.js 15 sempre que possível, especialmente para carregar o histórico inicial do usuário. As interações do lado do cliente (como realizar um novo cálculo) serão tratadas com **Client Components** e **Server Actions** para persistir as mudanças no banco de dados.

### Justificativa

- **Performance**: O uso de Server Components reduz a quantidade de JavaScript enviado ao cliente, melhorando o tempo de carregamento inicial. O histórico do usuário é carregado no servidor e renderizado diretamente no HTML inicial.
- **Segurança e Simplicidade**: Server Actions fornecem uma maneira segura e direta de executar código do lado do servidor a partir de componentes do cliente, eliminando a necessidade de criar endpoints de API manuais para cada operação de escrita.

### Alternativas Consideradas

- **SPA (Single Page Application) com API REST**: A abordagem tradicional exigiria a criação e manutenção de uma API separada e um gerenciamento de estado do lado do cliente mais complexo (como React Query/SWR), o que o App Router do Next.js torna desnecessário.

## 4. Conclusão da Pesquisa

A pesquisa define uma arquitetura full-stack robusta e moderna, utilizando ferramentas padrão da indústria que se integram perfeitamente com o ecossistema Next.js. A abordagem prioriza a segurança, a produtividade do desenvolvedor e a performance.
