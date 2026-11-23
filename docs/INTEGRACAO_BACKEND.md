# Integração com o backend ODR-CON

O frontend usa a API Spring Boot deste workspace. Os serviços HTTP ficam em `src/services/`; o token de acesso é mantido apenas em memória e enviado como `Authorization: Bearer`.

## Endpoints conectados

| Ação | Método e rota | Autenticação |
|---|---|---|
| Criar conta | `POST /api/auth/register` | Pública |
| Entrar | `POST /api/auth/login` | Pública |
| Solicitar recuperação | `POST /api/auth/password/forgot` | Pública; backend ainda não envia e-mail |
| Conversar com Priscila | `POST /api/priscila/messages` | Pessoa autenticada |
| Confirmar e registrar relato | `POST /api/reports` | Pessoa autenticada |

Login e cadastro enviam `{ email, password, role, fullName }` (no login, sem `fullName`) e recebem `{ accessToken, user: { role, fullName, email } }`. A primeira mensagem usa `conversationId: null`; o backend cria a conversa e devolve `conversationId`, `reply`, `status` e, quando pronta para revisão, `summary`. O relato só é enviado após confirmação e a tela mostra o protocolo devolvido pelo servidor.

As rotas de conversa e registro exigem perfil `pessoa`. O frontend não oferece mais entrada anônima para esse fluxo, e não exibe a Priscila no painel de empresa, pois a API não autoriza esses casos.

## Executar localmente

1. Inicie o backend na porta 8080, com banco e variáveis de ambiente configurados conforme `Backend/README.md`.
2. Neste diretório, crie `.env.local` a partir de `.env.example`; mantenha `VITE_API_BASE_URL=http://localhost:8080`.
3. Execute `npm ci` e `npm run dev`.
4. Crie uma conta de pessoa física, entre e teste o chat. O backend precisa ter uma `GEMINI_API_KEY` válida para respostas reais da Priscila.

O backend libera `http://localhost:5173` em desenvolvimento. Em produção, configure `CORS_ALLOWED_ORIGINS` no backend com a origem HTTPS exata do Static Site Render (sem barra final) e `VITE_API_BASE_URL` no frontend com a URL pública HTTPS do backend. Faça novo deploy do frontend após mudar essa variável, pois ela é incluída no build.

## Ainda demonstrativo

- A recuperação de senha responde `not_configured`; nenhum e-mail é enviado. A interface agora informa isso sem prometer instruções.
- O perfil (`PATCH /api/me/profile`), lista de atendimentos, consulta por protocolo e painel corporativo ainda não têm contratos implementados no backend. Essas telas continuam locais/de demonstração; só o protocolo recém-criado aparece na sessão atual.
- O token fica em memória; atualizar a página encerra a sessão. Não há refresh token.

Não coloque senhas de banco, chaves de IA ou outros segredos em variáveis `VITE_*`.
