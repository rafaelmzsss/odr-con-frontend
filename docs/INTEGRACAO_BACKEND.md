# Integração da Sophia com o backend (Spring Boot)

Este documento separa o que **já está pronto no frontend** do que **ainda depende do backend**.

> **Estado atual:** o frontend está preparado para a integração, mas a Sophia **não está conectada a nenhuma IA**. Sem backend, o chat mostra uma mensagem de erro amigável e **não gera respostas, resumos nem protocolos de mentira**. A integração só estará concluída quando o backend implementar e validar os contratos abaixo.

## 1. O que está pronto no frontend

| Item | Onde |
|---|---|
| URL base configurável (`VITE_API_BASE_URL`), timeout, cabeçalhos, tratamento de status HTTP e erros amigáveis | `src/services/api.js` |
| Caminhos e métodos HTTP centralizados (`ENDPOINTS`) | `src/services/api.js` |
| Envio de mensagens, manutenção do `conversationId`, validação da resposta | `src/services/sophiaService.js` |
| Registro do relato (só com confirmação explícita), exige protocolo real na resposta | `src/services/reportService.js` |
| Estado da conversa, bloqueio de envio simultâneo, retry, histórico na sessão | `src/hooks/useSophiaChat.js` |
| Interface (visual original preservado) | `src/components/Sophia/*` |
| Ponto de extensão para autenticação (`setAuthTokenProvider`) | `src/services/api.js` |

Comportamento garantido:

- Nenhuma chave da OpenAI ou credencial no frontend; nada sensível em variáveis `VITE_`.
- O histórico vive só **na memória** (sem `localStorage`/`sessionStorage`). Fechar e reabrir a janela mantém a conversa; sair da conta ou recarregar a página a apaga.
- Nada é registrado sem o clique em **Confirmar e registrar**; o protocolo exibido é sempre o devolvido pelo backend.
- Nenhum conteúdo de conversa é escrito em `console`/logs. Erros do servidor nunca têm o corpo repassado à tela.
- Ações: editar o resumo, solicitar ajustes (vira nova mensagem à Sophia), rejeitar, confirmar, tentar novamente, editar mensagem que falhou, nova conversa (com confirmação).

## 2. Contratos PROPOSTOS (a alinhar com o backend)

Nenhum destes endpoints existe ainda. Os caminhos são sugestões e ficam em `ENDPOINTS` (`api.js`); mudar um caminho é editar uma linha.

### 2.1 Enviar mensagem — `POST /api/sophia/messages` *(proposta)*

Requisição:

```json
{ "conversationId": null, "message": "Comprei um produto e ele apresentou defeito." }
```

Resposta:

```json
{ "conversationId": "abc123", "reply": "Entendi. Qual foi o produto adquirido?", "status": "collecting" }
```

Quando houver informação suficiente:

```json
{
  "conversationId": "abc123",
  "reply": "Já tenho o suficiente. Revise o resumo.",
  "status": "ready_for_review",
  "summary": {
    "company": "Loja Horizonte",
    "category": "Produto",
    "description": "Produto apresentou defeito.",
    "requestedSolution": "Substituição do produto"
  }
}
```

Regras que o frontend aplica (resposta fora disso vira "resposta inesperada"): `reply` obrigatório e não vazio; `status` ∈ {`collecting`, `ready_for_review`}; `summary` obrigatório (com ao menos um campo preenchido) quando `ready_for_review`; campos ausentes do resumo viram vazio e aparecem como "Não informado".

### 2.2 Registrar relato — `POST /api/reports` *(proposta)*

Requisição (enviada somente após o clique de confirmação):

```json
{
  "conversationId": "abc123",
  "summary": { "company": "...", "category": "...", "description": "...", "requestedSolution": "..." }
}
```

Resposta esperada:

```json
{ "protocol": "ODR-2026-0001", "status": "registered" }
```

`protocol` é obrigatório; sem ele o frontend trata como erro e **não inventa um protocolo**. `status` é opcional.

## 3. Decisões em aberto para a equipe de backend

1. **Caminhos e métodos** de 2.1 e 2.2 (e códigos de erro: o frontend trata 401, 403, 408, 429, 4xx, 502/503/504 e 5xx).
2. **Criação do `conversationId`**: hoje a 1ª mensagem vai com `conversationId: null` e o backend cria o ID. Alternativas: o frontend gerar o ID, ou existir endpoint de "iniciar/recuperar conversa".
3. **Recuperar conversa existente** (passo 2 do fluxo desejado): hoje o histórico existe só na sessão. Se for necessário retomar uma conversa após recarregar a página, é preciso um endpoint de leitura de histórico e uma estratégia definida de armazenamento/privacidade.
4. **Lista definitiva de `status`** além de `collecting` e `ready_for_review` (ex.: conversa encerrada, bloqueada por moderação).
5. **Rejeição do resumo**: hoje é só local (o resumo é descartado na tela). O backend não é avisado, e a IA pode continuar considerando a conversa "pronta". Definir se haverá um endpoint/campo para isso.
6. **Edição pelo usuário**: o resumo editado é enviado no registro. O backend deve **revalidar tudo** e decidir o que é aceito; nada vindo do navegador é confiável.
7. **Idempotência do registro**: se o registro expirar (timeout) após o backend já ter gravado, "tentar novamente" pode duplicar. Recomenda-se uma chave de idempotência (ex.: derivada do `conversationId`) ou deduplicação por conversa no backend.
8. **Campos adicionais do resumo** (ex.: valores, datas, anexos): acrescentar em `REPORT_FIELDS` (`reportService.js`) e a tela de revisão/edição passa a exibi-los.
9. **Autenticação/autorização**: definir esquema (Bearer/JWT ou cookie de sessão). Para Bearer, chamar `setAuthTokenProvider(() => token)` uma vez após o login; para cookie, adicionar `credentials: "include"` no `fetch` de `api.js`. Também definir como fica o **relato anônimo**.
10. **CORS**: o backend precisa liberar a origem do frontend (ex.: `http://localhost:5173` em desenvolvimento), ou usar um proxy do Vite (`server.proxy`) para evitar CORS em dev.
11. **Limites e proteção**: o frontend limita a mensagem a 2000 caracteres (só conveniência); o backend deve impor limites próprios, rate limiting e moderação.
12. **Outras telas ainda demonstrativas** (fora do escopo desta refatoração): lista "Meus atendimentos", consulta de protocolo, indicadores da empresa, login/cadastro. O caso criado após o registro é inserido só na lista local do painel; a lista real depende de um endpoint de consulta.

## 4. Como conectar ao Spring Boot

1. Subir o backend (ex.: `http://localhost:8080`) com CORS liberado para o frontend.
2. `cp .env.example .env.local` e ajustar `VITE_API_BASE_URL`. **Não** colocar segredos aqui.
3. Ajustar `ENDPOINTS` em `src/services/api.js` conforme os caminhos reais.
4. Se o contrato divergir, adaptar **somente** `sophiaService.js` (`parseSophiaResponse`) e `reportService.js`; a interface e o hook não precisam mudar.
5. A chave da OpenAI fica apenas no backend (variável de ambiente do servidor).
6. Rodar `npm run dev`, abrir o painel, conversar com a Sophia e conferir o protocolo devolvido.
7. Em produção, definir `VITE_API_BASE_URL` no build (`npm run build`) e servir tudo por HTTPS.

## 5. Como foi validado

- `npm run build`: sucesso.
- `npm run lint`: nenhum erro nos arquivos criados/alterados. Restam 4 erros que já existiam em arquivos fora do escopo (`Purpose.jsx`, `CaseCard.jsx`, `Sidebar.jsx` ×2).
- Teste de ponta a ponta no navegador contra um **backend de teste descartável** (fora do repositório, só para exercitar o contrato proposto): 37 verificações cobrindo Home, modal, Dashboard, abrir/fechar, histórico, digitação, bloqueio de duplo envio, falha + retry, respostas inválidas, resumo (editar/ajustar/rejeitar/confirmar), protocolo, nova conversa, servidor offline, ambiente sem `VITE_API_BASE_URL` e layout mobile. Isso valida o **frontend**, não a integração real com IA.
