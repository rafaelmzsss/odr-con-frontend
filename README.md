# ODR-CON Frontend

Interface React + Vite da plataforma ODR-CON.

## Executar localmente

```bash
npm install
npm run dev
```

## O que está implementado nesta versão

- Landing page institucional existente, preservada.
- Modal de acesso com alternância entre pessoa física e empresa.
- Formulários de login, cadastro e recuperação (interface).
- Entrada demonstrativa para relato sem identificação.
- Área do consumidor: visão geral, cards de atendimentos, novo atendimento via Priscila, histórico, consulta por protocolo e perfil.
- Área corporativa: indicadores, atendimentos, equipe/colaboradores, relatórios, satisfação/WHO-5 e perfil.
- Chat flutuante da Priscila preparado para integração HTTP com o backend (conversa dinâmica, revisão/edição/rejeição/confirmação do relato, estados de carregamento e erro). **A IA ainda não está conectada**: veja `docs/INTEGRACAO_BACKEND.md`.
- Layout responsivo para desktop e celular.

## Configuração

Copie `.env.example` para `.env.local` e defina `VITE_API_BASE_URL` (URL do backend). Nunca coloque chaves ou segredos em variáveis `VITE_*`.

## Publicar no Render

O `render.yaml` configura um Static Site com build `npm ci && npm run build`, publicação de `dist` e fallback SPA para `index.html`. Configure `VITE_API_BASE_URL` no Render com a URL HTTPS pública do backend. Essa variável é incorporada no build, então alterá-la exige um novo deploy.

O backend Spring Boot precisa liberar CORS para a origem exata do site Render, aceitar HTTPS e implementar os endpoints descritos em `docs/INTEGRACAO_BACKEND.md`. O Render hospeda somente este frontend; não cria o backend nem as tabelas do banco.

## Dados e integrações

Login, cadastro e recuperação de senha chamam endpoints propostos em `docs/INTEGRACAO_BACKEND.md`; a sessão usa token em memória e o envia em chamadas autenticadas. O backend precisa implementar esses contratos e armazenar senhas somente como hashes fortes. Equipe/colaboradores e outros módulos ainda são demonstrativos até terem endpoints alinhados. A IA da Priscila só funciona quando o endpoint de mensagens chama o provedor de IA no servidor; nenhuma chave de IA deve ir para o frontend.

A opção de login/cadastro diferencia os perfis de pessoa física e empresa. A equipe da empresa é gerenciada dentro da área corporativa, com perfis de administradora, gestor e atendente como exemplos visuais.
