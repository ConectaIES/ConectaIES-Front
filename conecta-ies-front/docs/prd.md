# Documento de Requisitos de Produto (PRD) - ConectaIES

## 1. Detalhes do Documento

| Campo | Detalhe |
| :--- | :--- |
| **Nome do Produto/Funcionalidade** | ConectaIES - Plataforma de Gestão Inclusiva e Participativa |
| **Data da Conclusão** | (Data Atual) |
| **Status** | Finalizado e Assinado (PM/PO) |
| **Agente PM Responsável** | BMad Product Manager |
| **Próximo Passo** | Início do Desenvolvimento (IDE) |

## 2. Visão, Objetivos e Motivação

| Campo | Detalhe |
| :--- | :--- |
| **Visão do Produto** | Ser a plataforma essencial para Instituições de Ensino Superior (IES) que buscam um ambiente acadêmico mais inclusivo, participativo e eficiente. |
| **Problema Resolvido** | Falta de canais estruturados e em tempo real para o registro de feedback e a solicitação de assistência, resultando em lentidão na identificação de problemas e baixa participação da comunidade. |
| **Objetivo de Negócio** | Promover a melhoria contínua da qualidade educacional através da transparência na gestão e do fortalecimento da comunicação e tomada de decisões estratégicas. |
| **Público-Alvo Primário** | Instituições de Ensino Superior (IES). |
| **Usuários Finais** | Alunos, Professores e Administradores da IES. |

## 3. Metas de Sucesso (KPIs)

O sucesso será medido pela eficácia da IES em responder e resolver as necessidades da comunidade.

| KPI (Métrica) | Descrição | Meta Inicial |
| :--- | :--- | :--- |
| **Tempo Médio de Resposta (TMR)** | Média de tempo entre a criação de uma solicitação e a primeira resposta do administrador/responsável. | **TMR abaixo de 4 horas** para 90% das solicitações. |
| **Tempo Médio de Resolução (TMRs)** | Média de tempo entre a criação de uma solicitação e a marcação como 'Resolvida'. | **TMRs abaixo de 48 horas** para solicitações críticas. |
| **Taxa de Engajamento** | % de Alunos e Professores ativos (registrando solicitações/feedback) mensalmente. | 50% de Engajamento Mensal após 3 meses de lançamento. |

---

## 4. Funcionalidades Chave (Épicos)

| ID do Épico | Título | Descrição |
| :--- | :--- | :--- |
| **EPIC-100** | Gestão de Usuários e Perfis (Geral) | Implementar a estrutura de autenticação e perfis, garantindo que Alunos, Professores e Administradores tenham acesso e permissões adequadas. |
| **EPIC-200** | Módulo de Solicitação e Assistência (Alunos/Professores) | Permitir que os usuários finais criem solicitações de assistência sem limites de categoria, como apoio à locomoção, intérprete de libras, questões acadêmicas, etc. Inclui acompanhamento do status. |
| **EPIC-300** | Módulo de Feedback Estruturado (Alunos/Professores) | Permitir que os usuários forneçam feedback contínuo sobre didática, infraestrutura, serviços e outros pontos de melhoria, com opções de categorização e anonimato. |
| **EPIC-400** | Dashboard e Gestão Administrativa (Administrador) | Criar a interface para os Administradores receberem, visualizarem, analisarem, atribuírem e gerenciarem o ciclo de vida completo de todas as solicitações e feedbacks. **Foco em atingir o KPI de resposta rápida.** |
| **EPIC-500** | Comunicação e Notificações (Geral) | Implementar um sistema de notificação em tempo real para manter os usuários informados sobre o status de suas requisições e para avisos gerais da IES. |

---

## 5. Backlog Refinado (Histórias de Usuário - MVP e Próxima Etapa)

### US-201: Criação de Nova Solicitação de Assistência

| Campo | Detalhe |
| :--- | :--- |
| **Épico Pai** | EPIC-200 |
| **Prioridade (MoSCoW)** | MUST HAVE |
| **Descrição** | **Como um Aluno** ou **Professor**, **eu quero** uma tela simples e intuitiva para **criar e enviar uma nova solicitação de assistência**, **para que eu possa** rapidamente comunicar minhas necessidades específicas à IES e garantir que o processo de **resposta rápida** seja iniciado imediatamente. |

#### Critérios de Aceitação (CAs)

| ID do CA | Critério de Aceitação |
| :--- | :--- |
| **CA 201.1** | O sistema deve apresentar um formulário de criação com campos obrigatórios: **Título**, **Descrição** e uma seleção do **Tipo de Solicitação**. |
| **CA 201.2** | O formulário deve permitir que o usuário adicione **anexos** (limite de 3). |
| **CA 201.3** | O campo **Descrição** deve permitir texto livre para cobrir qualquer tipo de necessidade não listada. |
| **CA 201.4** | Após o envio, o usuário deve receber uma **notificação de confirmação** que inclua um número de protocolo único e o TMR esperado. |
| **CA 201.5** | Imediatamente após o envio, a solicitação deve ser visível no Dashboard Administrativo e o administrador responsável deve ser **notificado em tempo real**. |

### US-202: Acompanhamento e Interação em Solicitações Ativas

| Campo | Detalhe |
| :--- | :--- |
| **Épico Pai** | EPIC-200 |
| **Prioridade (MoSCoW)** | MUST HAVE |
| **Descrição** | **Como um Aluno** ou **Professor**, **eu quero** visualizar uma lista de todas as minhas solicitações ativas e a capacidade de interagir com cada uma delas, **para que eu possa** monitorar o progresso (status) e responder a dúvidas. |

#### Critérios de Aceitação (CAs)

| ID do CA | Critério de Aceitação |
| :--- | :--- |
| **CA 202.1** | Deve existir uma tela ("Minhas Solicitações") que exiba uma lista cronológica de todas as solicitações. |
| **CA 202.2** | Cada item da lista deve mostrar o **Título**, o **Status Atual** e a **data/hora da última atualização**. |
| **CA 202.3** | Ao selecionar uma solicitação, o usuário deve visualizar uma **linha do tempo de eventos** (histórico) que registre todas as mudanças de status e comunicações. |
| **CA 202.4** | O usuário deve poder **adicionar comentários/mensagens** e novos **anexos** a uma solicitação ativa. |
| **CA 202.5** | O usuário deve ser capaz de **marcar uma solicitação como resolvida** por conta própria ou solicitar a **reabertura**. |

### US-401: Visualização e Atribuição de Novas Solicitações

| Campo | Detalhe |
| :--- | :--- |
| **Épico Pai** | EPIC-400 |
| **Prioridade (MoSCoW)** | MUST HAVE |
| **Descrição** | **Como um Administrador**, **eu quero** um **dashboard claro e atualizado em tempo real** que me alerte imediatamente sobre novas solicitações e me permita **atribuir e iniciar a análise** rapidamente, **para que eu possa** garantir que o Tempo Médio de Resposta (TMR) da IES seja atingido. |

#### Critérios de Aceitação (CAs) e Refinamentos (Versão Final)

| ID do CA | Critério de Aceitação |
| :--- | :--- |
| **CA 401.1** | O dashboard deve ter um filtro "Novas Solicitações" que exiba apenas pedidos no status **"Aberto"** ou **"Não Visto"** e que tenha um contador de urgência destacado. |
| **CA 401.2** | A lista de solicitações deve ser ordenável e filtrável por **Tempo Restante para Resposta**. **O Back-End deve fornecer um campo calculado** (`time_to_tmm_breach`) para permitir a ordenação precisa. |
| **CA 401.3** | Ao clicar em uma nova solicitação, o Administrador deve ver todos os detalhes e o status deve ser alterado automaticamente para **"Em Análise"**. |
| **CA 401.4** | O Administrador deve ter um campo de ação imediata para **Atribuir** a solicitação a outro membro da equipe de gestão. |
| **CA 401.5** | O Administrador deve conseguir enviar uma **primeira resposta**. Esta ação **deve, de forma atômica, atualizar o campo `first_response_at` no banco de dados e disparar uma notificação em tempo real** (via WebSocket) para o usuário, zerando o contador do TMR. |

### US-301: Registro e Categorização de Novo Feedback

| Campo | Detalhe |
| :--- | :--- |
| **Épico Pai** | EPIC-300 |
| **Prioridade (MoSCoW)** | SHOULD HAVE |
| **Descrição** | **Como um Aluno** ou **Professor**, **eu quero** uma tela dedicada para registrar **feedback não urgente** com a opção de categorizar o tópico e manter o anonimato, **para que eu possa** contribuir para pontos de melhoria sem precisar abrir uma solicitação formal. |

#### Critérios de Aceitação (CAs)

| ID do CA | Critério de Aceitação |
| :--- | :--- |
| **CA 301.1** | O formulário deve ter um campo de **Descrição** obrigatório. |
| **CA 301.2** | O usuário deve ser obrigado a selecionar uma **Categoria** pré-definida de Feedback (Ex: Didática, Infraestrutura). |
| **CA 301.3** | O formulário deve apresentar uma chave de seleção (*toggle*) com a opção **"Enviar Anonimamente"**. |
| **CA 301.4** | Se a opção **"Enviar Anonimamente"** for selecionada, o registro no Back-End deve ocultar/anonimizar qualquer identificação pessoal do usuário, mas **manter o tipo de perfil**. |
| **CA 301.5** | Após o envio, o feedback deve ser direcionado para uma área de **Análise no Dashboard Administrativo**, separada das Solicitações URGENTES, e **não** deve disparar uma notificação de urgência. |

### US-501: Notificação em Tempo Real sobre Status Crítico

| Campo | Detalhe |
| :--- | :--- |
| **Épico Pai** | EPIC-500 |
| **Prioridade (MoSCoW)** | MUST HAVE |
| **Descrição** | **Como um Administrador**, **eu quero** receber notificações instantâneas de novas solicitações e, **como um Usuário**, **eu quero** ser notificado imediatamente sobre a primeira resposta ou atualização de status, **para que** o **TMR não seja violado**. |

#### Critérios de Aceitação (CAs)

| ID do CA | Critério de Aceitação |
| :--- | :--- |
| **CA 501.1** | O Administrador deve receber uma notificação **sonora e visual (via WebSocket)** na interface Web sempre que uma **nova solicitação (US-201)** for criada. |
| **CA 501.2** | O Administrador deve receber uma notificação **imediata** sempre que um usuário final adicionar um **novo comentário/anexo** a uma solicitação já existente. |
| **CA 501.3** | O usuário final deve receber uma notificação **imediata** na interface Web quando o Administrador enviar a **primeira resposta** (CA 401.5). |
| **CA 501.4** | O usuário final deve ter um **ícone de sino/notificação** que exiba um contador de notificações não lidas. |
| **CA 501.5** | As notificações críticas devem persistir no **Dashboard Administrativo** até que o Admin clique na solicitação ou as marque como lidas. |