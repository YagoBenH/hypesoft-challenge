# Frontend - Hypesoft Challenge

Aplicação frontend em Next.js com autenticação via Keycloak e consumo de API protegida por Bearer token.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Keycloak JS

## Pré-requisitos
- npm 
- Keycloak acessível
- API backend acessível

## Configuração de ambiente

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```
No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

2. Preencha as variáveis no `.env`.

### Variáveis obrigatórias

- `NEXT_PUBLIC_KEYCLOAK_URL`: URL base do Keycloak (ex.: `http://localhost:8080`)
- `NEXT_PUBLIC_KEYCLOAK_REALM`: realm usado pela aplicação
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`: client id da SPA no Keycloak
- `NEXT_PUBLIC_API_URL`: URL base da API (ex.: `http://localhost:5000`)

## Rodando o projeto (modo desenvolvimento)

```bash
npm install
npm run dev
```

Abra: `http://localhost:3000`

## Docker:

### Docker para dependências

Este repositório **não possui `docker-compose.yml`** atualmente. Então você pode:

- subir Keycloak/API em containers manualmente e apontar as URLs no `.env.local`.

### Subindo Keycloak com Docker (manual)

Execute:

```bash
docker run --name keycloak -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.1.0 start-dev
```

Depois acesse:

- `http://localhost:8080` se precisar `/admin`
- Clique em **Administration Console**
- Login admin:
	- usuário: `admin`
	- senha: `admin`

Comandos úteis:

```bash
docker logs -f keycloak
docker stop keycloak
docker rm -f keycloak
```

> Ajuste o `.env.local` do frontend para apontar para esse Keycloak (`NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080`).

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
