## 📄 Especificação de API - ConectaIES (V1.1 - Finalizada)

Esta especificação abrange as funcionalidades do Módulo de Feedback (EPIC-300) e Notificações em Tempo Real (EPIC-500), complementando as APIs já definidas para o Módulo de Solicitações Urgentes (EPIC-200/400).

### 1. APIs RESTful: Módulo de Gestão (Requisições HTTP)

As APIs seguem o padrão RESTful. O Administrador deve usar autenticação JWT para acessar os endpoints `/admin`.

| Objetivo | Método | Endpoint | Histórias Relacionadas | Detalhes do Payload/Response |
| :--- | :--- | :--- | :--- | :--- |
| **1. Enviar Feedback (Usuário)** | `POST` | `/api/feedback` | US-301 | **Request Body:** `{ category: string, description: string, is_anonymous: boolean }`. <br/> **Response (201 Created):** `{ message: 'Feedback enviado com sucesso.', feedback_id: string }`. |
| **2. Listar Feedback (Admin)** | `GET` | `/api/admin/feedback` | US-402 | **Query Params:** `status`, `category`, `profile_type`, `sort_by` (default: date desc). Suporta paginação. <br/> **Response (200 OK):** Lista de objetos de feedback (incluindo o status `is_anonymous` e o `user_profile_type`). |
| **3. Alterar Status (Admin)** | `PATCH` | `/api/admin/feedback/{id}` | US-402 | **Request Body:** `{ new_status: string }` (Ex: "Em Ação", "Concluído"). <br/> **Response (200 OK):** Objeto de feedback atualizado. |
| **4. Exportar Dados (Admin)** | `GET` | `/api/admin/feedback/export` | US-402 | **Query Params:** Deve aceitar os mesmos filtros de `GET /api/admin/feedback`. <br/> **Response (200 OK):** Retorna um stream de arquivo (CSV) ou link temporário para download. |
| **5. Enviar Primeira Resposta (Admin)** | `PATCH` | `/api/solicitations/{id}` | **US-401 (CRÍTICO)** | **Ação Atômica:** Este endpoint recebe a primeira resposta e é o único responsável por **atualizar o `first_response_at` no DB** e disparar o evento **WebSocket** para o usuário. |

***

### 2. APIs em Tempo Real: Comunicação (WebSockets - Socket.IO)

A comunicação em tempo real é a chave para o **KPI de TMR** (Tempo Médio de Resposta). O Back-End (Node.js/Socket.IO) gerencia os seguintes eventos.

#### A. Eventos Disparados para o Administrador (Foco na Urgência)

| Evento (Server → Admin) | Histórias Cobertas | Gatilho no Back-End | Payload de Dados |
| :--- | :--- | :--- | :--- |
| **`urgent:new-solicitation`** | US-501 (CA 501.1) | Criação de uma nova solicitação (US-201). | `{ solicitation_id, title, user_id, timestamp }` |
| **`urgent:new-comment`** | US-501 (CA 501.2) | Recebimento de um comentário/anexo em uma solicitação ativa. | `{ solicitation_id, user_id, comment_snippet }` |

#### B. Eventos Disparados para o Usuário Final (Aluno/Professor)

| Evento (Server → User) | Histórias Cobertas | Gatilho no Back-End | Payload de Dados |
| :--- | :--- | :--- | :--- |
| **`user:solicitation-update`** | US-501 (CA 501.3) | O Administrador envia a **primeira resposta** (TMR reset) ou muda o status. | `{ solicitation_id, new_status, first_response_sent: boolean }` |