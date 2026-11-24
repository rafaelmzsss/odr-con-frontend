# ODR-CON Frontend

Interface React + Vite conectada aos endpoints de autenticação, conversa com a Priscila e registro de relatos do backend Spring Boot.

## Executar localmente

```bash
npm ci
npm run dev
```

Copie `.env.example` para `.env.local`. Para backend local, mantenha `VITE_API_BASE_URL=http://localhost:8080`. O backend precisa aceitar `http://localhost:5173` em CORS.

## Publicar no Render

O `render.yaml` cria um Static Site. Configure a variável `VITE_API_BASE_URL` com a URL HTTPS pública do backend. No serviço do backend, configure `CORS_ALLOWED_ORIGINS` com a URL de origem HTTPS exata do frontend Render, sem barra final. Ao mudar `VITE_API_BASE_URL`, faça novo deploy do frontend.

Detalhes dos contratos e dos módulos conectados/demonstrativos estão em [`docs/INTEGRACAO_BACKEND.md`](docs/INTEGRACAO_BACKEND.md).

Nunca coloque chaves de IA, senhas ou tokens em variáveis `VITE_*`: elas são públicas no navegador.
