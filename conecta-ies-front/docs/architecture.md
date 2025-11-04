# Documento de Arquitetura Técnica - ConectaIES (Finalizado e Aprovado)

## 1. Visão Geral e Alinhamento com Requisitos

O design arquitetônico do ConectaIES visa construir uma plataforma robusta, escalável e otimizada para a **comunicação em tempo real**, suportando o principal **KPI de Resposta Rápida (TMR)** definido no PRD.

| Requisito de Negócio (KPI) | Solução Arquitetural |
| :--- | :--- |
| **Tempo Médio de Resposta (TMR < 4h)** | Uso de **WebSockets (Socket.IO)** e **Redis** para notificações instantâneas de novas solicitações. |
| **Interface Inclusiva/Acessível** | Front-End em **Angular** com **Angular Material** (suporte a Acessibilidade - A11y). |
| **Transparência e Histórico** | Modelagem de dados com a tabela `EventHistory` no **MySQL** para rastrear todas as alterações de status (US-202). |

---

## 2. Arquitetura Front-End (Angular)

O Front-End é projetado como uma **Single Page Application (SPA)** de alta performance, baseada na robustez do ecossistema Angular.

### Stack Tecnológica

| Componente | Tecnologia Selecionada | Justificativa |
| :--- | :--- | :--- |
| **Framework Base** | **Angular (Última Versão)** | Estrutura completa, forte tipagem e ideal para projetos complexos. |
| **Linguagem** | **TypeScript** | Nativo do Angular, garante segurança e manutenibilidade. |
| **Estilização** | **Angular Material** e/ou **Tailwind CSS** | Angular Material simplifica o cumprimento das diretrizes de **WCAG** e **Mobile First**. |
| **Gerenciamento de Estado** | **RxJS** (Serviços e Observables) | Essencial para lidar com os fluxos de dados assíncronos e o consumo dos eventos de WebSockets (EPIC-500). |

### Estrutura e Comunicação

| Estrutura Angular | Exemplo | Função |
| :--- | :--- | :--- |
| **Módulos de Domínio** | `AdminModule`, `StudentModule`, `SharedModule` | Isolar funcionalidades do Dashboard Administrativo e do Portal do Aluno/Professor. |
| **Serviços Críticos** | `RealTimeNotifierService` | Componente CRÍTICO que inicia a conexão **WebSocket** e expõe *Observables* para o Dashboard Admin e a tela de Acompanhamento (US-501). |
| **Comunicação** | **RESTful** para CRUD (dados persistentes); **WebSockets** para notificações e atualizações de status. | Otimização para a primeira resposta e visualização em tempo real. |

---

## 3. Arquitetura Back-End (Serviços e Dados)

O Back-End é a fonte da verdade, focado em suportar a alta concorrência de I/O e o fluxo em tempo real.

### Stack Tecnológica

| Componente | Tecnologia Selecionada | Justificativa |
| :--- | :--- | :--- |
| **Linguagem/Framework** | **Node.js com Express** | Excelente desempenho em I/O, fundamental para lidar com múltiplas conexões de **WebSockets** de forma eficiente. |
| **Banco de Dados Principal** | **MySQL (InnoDB)** | Fonte da verdade, garantindo a **integridade transacional** e a persistência do **`first_response_at`** para o cálculo do TMR. |
| **Banco de Dados Secundário** | **Redis** | Essencial para a **Resposta Rápida**. Utilizado para caching de alta velocidade, sessões e gerenciamento de estado de conexão do Socket.IO. |
| **Comunicação em Tempo Real** | **Socket.IO** | Biblioteca padrão para implementar comunicação bidirecional, garantindo a notificação imediata (US-401 e US-501). |

### Modelagem de Dados Chave (MySQL)

| Tabela Chave | Campos Relevantes para KPI/Transparência | Finalidade |
| :--- | :--- | :--- |
| **Solicitation** | `id`, `user_id`, `status`, `created_at`, **`first_response_at`** | **CRÍTICO:** O campo `first_response_at` é a chave para medir o **TMR**. |
| **Feedback** | `id`, `category`, `is_anonymous`, `user_profile_type` | Suporta a análise estratégica de melhoria (US-301 e US-402). |
| **EventHistory** | `solicitation_id`, `event_type`, `timestamp` | Cria a **Linha do Tempo** completa para cada solicitação, garantindo a transparência (US-202). |

### Estratégia de Tempo Real (KPI TMR - Detalhada)

1.  **Conexão:** O Front-End se conecta ao Back-End via Socket.IO, autenticando a sessão via JWT e armazenando a conexão no **Redis**.
2.  **Notificação Admin (US-401/US-501):** Qualquer nova solicitação é inserida no MySQL, o Back-End envia imediatamente o evento **`urgent:new-solicitation`** via Socket.IO para a sala/canal do Administrador.
3.  **TMR Reset (CA 401.5):** A ação de enviar a primeira resposta é um único *PATCH* atômico no Back-End que: a) Atualiza o `first_response_at` no MySQL; b) Dispara o evento **`user:solicitation-update`** via Socket.IO para o usuário final.

---

Este documento está finalizado e pronto para ser usado pela equipe de desenvolvimento!