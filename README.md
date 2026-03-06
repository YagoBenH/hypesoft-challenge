# Frontend - Hypesoft Challenge

Aplicação frontend em Next.js com autenticação via Keycloak e consumo de API protegida por Bearer token.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Keycloak JS

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker (para subir o Keycloak local)

> Este frontend já inclui um mock de dashboard via Next API em `/api/metrics/dashboard`.

## Configuração de ambiente

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```
No Windows (PowerShell):

```powershell
Copy-Item .env.example .env.local
```

2. Preencha as variáveis no `.env.local`.

### Variáveis obrigatórias

- `NEXT_PUBLIC_KEYCLOAK_URL`: URL base do Keycloak (ex.: `http://localhost:8080`)
- `NEXT_PUBLIC_KEYCLOAK_REALM`: realm usado pela aplicação
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`: client id da SPA no Keycloak

### Variáveis para a API do dashboard

1) **Mock local (para testar)**

- `API_URL=http://localhost:3000/api`

Isso faz o dashboard chamar `http://localhost:3000/api/metrics/dashboard` (mock do Next).

2) **Backend real (se tivesse uma API rodando)**

- `NEXT_PUBLIC_API_URL=http://localhost:5000` (exemplo)

## Mock do endpoint do Dashboard

Para testes sem backend, este projeto tem um endpoint mock:

- `GET http://localhost:3000/api/metrics/dashboard`

Ele retorna uma lista de produtos (`Product[]`) e é implementado em:

- `src/app/api/metrics/dashboard/route.ts`

### Autenticação (mock)

O mock valida apenas se existe o header:

- `Authorization: Bearer <token>`

(Ele não valida a assinatura do token; serve apenas para simular uma API protegida.)

### Como testar

No Postman:

1. Faça um `GET` para `http://localhost:3000/api/metrics/dashboard`
2. Aba **Authorization** → **Bearer Token** → cole o token
3. Envie e valide se a resposta é um array de produtos

## Rodando o projeto (modo desenvolvimento)

1) Instale dependências:

```bash
npm install
```

2) Suba o Keycloak via Docker (na pasta `frontend/`):

```bash
docker compose up -d
```

3) Rode o frontend:

```bash
npm run dev
```

Abra: `http://localhost:3000`

## Docker:

### Docker para dependências

O Keycloak pode ser iniciado via `docker compose` (arquivo `docker-compose.yml` dentro de `frontend/`).

#### Subindo Keycloak com Docker Compose

O arquivo `docker-compose.yml` (dentro de `frontend/`) sobe um Keycloak local na porta `8080`.

Depois acesse Clique para cadastrar novo usuário no login do Keycloak:

Vai levar para:
- `http://localhost:8080/admin`
- Login admin:
	- usuário: `admin`
	- senha: `admin`


## Primeiro acesso (cadastrar usuário no Keycloak)

O login do app usa o Keycloak (OpenID Connect) no realm configurado no frontend (ex.: `myrealm`).
O usuário `admin/admin` é do **Admin Console**, e serve para você cadastrar o realm/client/usuários.

### 1) Criar/selecionar realm

1. Abra `http://localhost:8080/admin` e faça login com `admin/admin`.
2. No seletor de realm (canto superior esquerdo), crie ou selecione o realm `myrealm`.

### 2) Criar/configurar o client da SPA

No realm `myrealm`:

1. Vá em **Clients** → **Create client**.
2. `Client type`: **OpenID Connect**
3. `Client ID`: `frontend-spa` (precisa bater com `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`).
4. Configure como SPA/public client:
	- `Client authentication`: **OFF**
	- `Standard flow`: **ON**
5. Ajuste:
	- **Valid redirect URIs**: `http://localhost:3000/*`
	- **Web origins**: `http://localhost:3000`

### 3) Cadastrar um usuário e senha

No realm `myrealm`:

1. Vá em **Users** → **Create user**.
2. Preencha `Username` (ex.: `admin`) e mantenha `Enabled` ligado.
3. Após criar, abra o usuário e vá em **Credentials**.
4. Defina a senha (ex.: `admin`) e deixe `Temporary` como **OFF**.

### 4) Voltar para o frontend e entrar

1. Abra `http://localhost:3000/login`.
2. Se você acabou de cadastrar o usuário no Keycloak, dê um **reload** na página de login.
3. Clique em **Continuar** e faça login no Keycloak com o usuário que você criou.

## Fluxo de autenticação esperado

- A aplicação inicia em `/dashboard` (com proteção de rota)
- Usuário não autenticado vai para `/login`
- Login redireciona para o Keycloak
- Após autenticação, volta para o frontend com token válido

## Troubleshooting

Preencher no client do Keycloak:

- Valid Redirect URIs (incluindo `http://localhost:3000/*`)
- Web Origins (incluindo `http://localhost:3000`)
- Client type/configuração de SPA pública

## Estrutura principal

- `src/app` — rotas da aplicação
- `src/providers/AuthProvider.tsx` — estado de autenticação
- `src/services/auth/keycloakClient.ts` — bootstrap do Keycloak
- `src/services/http/apiClient.ts` — cliente HTTP autenticado

---
