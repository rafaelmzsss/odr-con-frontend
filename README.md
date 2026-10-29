# odr-con-frontend
Residência em software II backend


## Boas Práticas de Versionamento com Git

Para manter o projeto organizado e facilitar o trabalho em equipe, todos os integrantes devem seguir algumas boas práticas de versionamento utilizando Git e GitHub.

### 1. Padrão de nomenclatura das branches

Todas as branches devem seguir um padrão de nomenclatura, utilizando um prefixo que identifique o tipo de alteração seguido de uma descrição curta e objetiva.

**Prefixos recomendados:**

| Prefixo | Finalidade | Exemplo |
|---|---|---|
| `feat/` | Adicionar uma nova funcionalidade | `feat/login-usuario` |
| `fix/` | Corrigir um erro no sistema | `fix/erro-autenticacao` |
| `docs/` | Alterar ou adicionar documentação | `docs/atualizar-readme` |
| `refactor/` | Melhorar o código sem alterar seu comportamento esperado | `refactor/organizar-controllers` |
| `test/` | Adicionar ou modificar testes | `test/login-usuario` |
| `style/` | Alterar formatação ou estilo do código sem mudar sua lógica | `style/padronizar-formatacao` |
| `chore/` | Realizar tarefas de manutenção e configuração | `chore/configurar-dependencias` |

**Regras para nomear branches:**
- Utilizar letras minúsculas.
- Separar palavras com hífen (`-`).
- Utilizar nomes curtos que descrevam claramente a tarefa.
- Evitar espaços, acentos e caracteres especiais.
- Criar uma branch específica para cada funcionalidade, correção ou tarefa.

### 2. Fluxo de trabalho

Para realizar alterações no projeto, siga este fluxo:

1. Atualize a branch principal com as alterações mais recentes.
2. Crie uma nova branch a partir da branch principal.
3. Desenvolva a funcionalidade ou correção nessa branch.
4. Realize commits pequenos e objetivos.
5. Envie a branch para o GitHub.
6. Abra um Pull Request para revisão e integração das alterações.
7. Após a aprovação, faça o merge na branch principal.

### 3. Boas práticas para commits

As mensagens de commit devem ser claras, objetivas e descrever o que foi realizado.

Utilize os seguintes prefixos:

- `feat:` para novas funcionalidades.
- `fix:` para correções de erros.
- `docs:` para alterações na documentação.
- `refactor:` para melhorias na estrutura do código.
- `test:` para alterações relacionadas a testes.
- `chore:` para tarefas de manutenção.

**Exemplos de commits:**

```bash
git commit -m "feat: adiciona tela de login"
git commit -m "fix: corrige validacao de formulario"
git commit -m "docs: atualiza instrucoes do README"
```

### 4. Boas práticas gerais

- Não realizar alterações diretamente na branch principal (`main`).
- Não enviar arquivos desnecessários, temporários ou que contenham informações sensíveis.
- Nunca enviar senhas, tokens, chaves de API ou credenciais para o repositório.
- Manter o arquivo `.gitignore` atualizado.
- Antes de iniciar uma tarefa, verificar se o repositório está atualizado.
- Revisar as alterações antes de realizar o commit.
- Evitar commits com muitas alterações diferentes e sem relação entre si.
- Sempre revisar o código por meio de Pull Requests antes de integrá-lo à branch principal.
- Resolver conflitos de merge com atenção, preservando as alterações necessárias.

### 5. Exemplo de criação e envio de uma branch

```bash
# Atualizar a branch principal
git switch main
git pull origin main

# Criar e acessar uma nova branch
git switch -c feat/cadastro-usuario

# Adicionar as alterações
git add .

# Criar um commit
git commit -m "feat: implementa cadastro de usuario"

# Enviar a branch para o GitHub
git push -u origin feat/cadastro-usuario
```

### 6. Organização do repositório

A branch `main` deve conter a versão estável e integrada do projeto. Cada integrante deve desenvolver suas tarefas em branches próprias e utilizar Pull Requests para submeter suas alterações à revisão.

## Estratégia de Versionamento

O projeto utilizará um fluxo de versionamento baseado em branches, com o objetivo de manter o código organizado, facilitar o trabalho em equipe e garantir maior estabilidade.

- **`main`**: branch principal, destinada a armazenar a versão estável do projeto.
- **`develop`**: branch de desenvolvimento, onde as funcionalidades são integradas e testadas antes de serem disponibilizadas na versão principal.
- **Branches de tarefas**: cada integrante deverá criar sua própria branch a partir da `develop`, utilizando os prefixos definidos (`feat/`, `fix/`, `docs/`, entre outros).

### Fluxo de trabalho

1. Criar uma branch de tarefa a partir da `develop`.
2. Implementar as alterações e realizar os commits.
3. Abrir um Pull Request da branch de tarefa para a `develop`.
4. Integrar e testar as alterações na `develop`.
5. Após a validação, integrar a `develop` à `main`.

Esse fluxo garante que novas funcionalidades e correções sejam testadas antes de chegarem à versão estável do projeto.