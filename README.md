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
- Área do consumidor: visão geral, cards de atendimentos, novo atendimento via Sophia, histórico, consulta por protocolo e perfil.
- Área corporativa: indicadores, atendimentos, equipe/colaboradores, relatórios, satisfação/WHO-5 e perfil.
- Chat flutuante da Sophia com fluxo demonstrativo de coleta, revisão, edição, rejeição e confirmação de relato.
- Layout responsivo para desktop e celular.

## Dados e integrações

Esta entrega é um protótipo navegável de frontend. Login, cadastro, permissões, persistência de dados, envio de reclamações, notificações, filtros reais, relatórios e IA da Sophia ainda usam conteúdo demonstrativo ou controles visuais. Para produção, conectar os formulários e ações aos endpoints do backend, validar os dados no servidor e implementar autenticação/autorização por perfil. O fluxo anônimo também precisa de regras de privacidade e protocolo definidas no backend.

A opção de login/cadastro diferencia os perfis de pessoa física e empresa. A equipe da empresa é gerenciada dentro da área corporativa, com perfis de administradora, gestor e atendente como exemplos visuais.
