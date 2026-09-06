# ConnectaSys — Spec de Deploy (Infraestrutura + Domínio)

Documento único com tudo que foi provisionado e configurado para colocar o
ConnectaSys (API + frontend) em produção. Serve de referência para redeploys,
troubleshooting e onboarding de quem mexer nisso depois.

Data do setup inicial: 2026-09-05.

## Arquitetura

```
Usuário
  │
  ├── https://www.connectasys.com.br  ─┐
  └── https://connectasys.com.br      ─┴─> Cloudflare Worker (frontend, TanStack Start SSR)
                                              │
                                              │ fetch (VITE_API_URL)
                                              ▼
                                     https://api.connectasys.com.br
                                              │
                                              ▼
                                  Azure Container Apps (API .NET 10)
                                              │
                                              ▼
                                  Azure PostgreSQL Flexible Server
```

## Frontend — Cloudflare Workers

- **Projeto**: `connectasys-hub` (TanStack Start, build via Nitro com preset Cloudflare)
- **Conta Cloudflare**: `juniorcergio@gmail.com` (account id `929f08c12e4df405d9b5fee21b025c61`)
- **Worker**: `paulocergio-connectasys-hub`
- **Domínios customizados vinculados ao Worker**:
  - `www.connectasys.com.br`
  - `connectasys.com.br` (raiz)
- URL `*.workers.dev` foi desativada automaticamente ao configurar domínios customizados (comportamento padrão do Wrangler quando `workers_dev` não está no config).
- **Variável de build**: `.env.production` → `VITE_API_URL=https://api.connectasys.com.br` (consumida em `src/lib/api.ts`, embutida no bundle em tempo de build — mudar a URL exige rebuild + redeploy).

### Como fazer redeploy do frontend

```bash
npm run build
npx wrangler deploy --config .output/server/wrangler.json \
  --domain www.connectasys.com.br \
  --domain connectasys.com.br
```

Login necessário uma vez por máquina: `npx wrangler login`.

## API — Azure Container Apps

- **Login Azure**: conta `connectasys.tech@outlook.com`, assinatura "Azure subscription 1".
- **Resource Group**: `rg-connectasys` (região **Brazil South**)
- **Container Apps Environment**: `env-connectasys`
- **Container App**: `connectasys-api` — .NET 10, identidade gerenciada (system-assigned) usada para autenticar no ACR (sem senha).
- **Azure Container Registry**: `acrconnectasys` (`acrconnectasys.azurecr.io`)
- **Domínio customizado**: `api.connectasys.com.br` (certificado gerenciado pelo Azure, validação via CNAME)
- URL padrão do Azure (sempre funciona, fallback): `https://connectasys-api.redocean-40570af0.brazilsouth.azurecontainerapps.io`

### Variáveis de ambiente configuradas no Container App

| Variável | Valor / Observação |
|---|---|
| `ConnectionStrings__DefaultConnection` | String de conexão do PostgreSQL (ver seção Banco) |
| `Jwt__Key` | Chave secreta gerada (256 bits, base64) — **não está em nenhum arquivo do repo** |
| `Jwt__Issuer` / `Jwt__Audience` | `ConnectaSysApi` |
| `Jwt__ExpiresMinutes` | `60` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `Cors__AllowedOrigins` | `https://www.connectasys.com.br,https://connectasys.com.br,https://paulocergio-connectasys-hub.juniorcergio.workers.dev` |
| `EnableSwagger` | `true` (⚠️ deixado ligado para testes — considerar `false` em produção estável) |

### Como fazer redeploy da API

```bash
# build local (Docker Desktop precisa estar rodando)
docker build -t acrconnectasys.azurecr.io/connectasys-api:vN .
az acr login --name acrconnectasys
docker push acrconnectasys.azurecr.io/connectasys-api:vN

# atualizar o Container App pra nova imagem
az containerapp update --name connectasys-api --resource-group rg-connectasys \
  --image acrconnectasys.azurecr.io/connectasys-api:vN
```

Build remoto via ACR Tasks (`az containerapp up --source .`) **não funciona** nessa
assinatura — está bloqueado (`TasksOperationsNotAllowed`), assim como os planos
F1/B1 do App Service (cota zero). Motivo: assinatura nova, sem histórico de uso —
precisaria de pedido de aumento de cota no suporte Azure. Por isso o deploy é via
build local + push manual pro ACR.

### Código alterado no projeto da API (`connectasys_api`)

- `Program.cs`: CORS deixou de ser fixo em `localhost` — em produção lê
  `Cors:AllowedOrigins` (lista separada por vírgula) da config/env var.
- `Program.cs`: Swagger deixou de depender só do ambiente — pode ser ligado em
  produção via `EnableSwagger=true`.
- `Dockerfile` e `.dockerignore` criados na raiz do projeto (multi-stage build,
  SDK 10.0 → runtime aspnet 10.0, porta 8080).

## Banco de dados — Azure PostgreSQL Flexible Server

- **Servidor**: `connectasys-db-server.postgres.database.azure.com`
- **Specs**: Burstable `Standard_B1ms`, PostgreSQL 16, 32GB storage (~US$12-15/mês)
- **Banco**: `ConnectaSysDb`
- **Firewall**: só libera tráfego interno do Azure (`AllowAllAzureServicesAndResourcesWithinAzureIps`) — **sem acesso externo por padrão**.
  Para rodar migrations ou acessar via `psql`/EF Core de fora, é preciso
  adicionar temporariamente uma regra de firewall com o IP público de quem vai
  conectar, e remover depois:
  ```bash
  az postgres flexible-server firewall-rule create --resource-group rg-connectasys \
    --server-name connectasys-db-server --name AllowTemp \
    --start-ip-address <SEU_IP> --end-ip-address <SEU_IP>
  # ... rodar dotnet ef database update ...
  az postgres flexible-server firewall-rule delete --resource-group rg-connectasys \
    --server-name connectasys-db-server --name AllowTemp --yes
  ```
- Migrations do EF Core já aplicadas (schema completo criado).
- Senha do admin do banco: gerada aleatoriamente, guardada **só** na variável de
  ambiente do Container App — não está em nenhum arquivo.

### Usuário admin inicial

Criado diretamente no banco (contornando o problema de "não dá pra criar usuário
sem já ter um Admin logado"):

- Email: `juniorcergio@gmail.com`
- Role: `Admin`
- Login: `POST /api/auth/login` com email + senha definida na criação

Novos usuários devem ser criados normalmente via `POST /api/usuarios`
(autenticado com token de um Admin).

## Domínio — connectasys.com.br

- **Registrador**: registro.br
- **DNS gerenciado por**: Cloudflare (nameservers `cora.ns.cloudflare.com` e
  `vern.ns.cloudflare.com`)
- Domínio **não tem e-mail configurado** (confirmado com o usuário antes de
  migrar o DNS pra Cloudflare).

### Registros DNS relevantes

| Nome | Tipo | Valor | Proxy |
|---|---|---|---|
| `www` | — (Worker Custom Domain) | Worker `paulocergio-connectasys-hub` | Gerenciado pela Cloudflare |
| `@` (raiz) | — (Worker Custom Domain) | Worker `paulocergio-connectasys-hub` | Gerenciado pela Cloudflare |
| `api` | CNAME | `connectasys-api.redocean-40570af0.brazilsouth.azurecontainerapps.io` | **DNS only** (obrigatório — proxy da Cloudflare quebra a validação/TLS do Azure) |
| `asuid.api` | TXT | ID de verificação de domínio do Container App | DNS only |

⚠️ Havia registros antigos (CNAME apontando pra um Cloudflare Tunnel
`*.cfargotunnel.com`, de um projeto anterior não identificado) tanto na raiz
quanto no `www`. Foram removidos por não estarem mais em uso.

## Pendências / próximos passos sugeridos

- [ ] Commitar `Dockerfile`, `.dockerignore` (API) e `.env.production` (frontend)
      no Git — atualmente só existem localmente.
- [ ] Desligar `EnableSwagger` em produção depois de terminar os testes
      (`az containerapp update --set-env-vars "EnableSwagger=false"`).
- [ ] Considerar CI/CD (GitHub Actions) pra automatizar os redeploys acima —
      hoje é tudo manual via CLI.
- [ ] Se precisar de mais capacidade (App Service, mais CPU/réplicas), abrir
      pedido de aumento de cota no suporte Azure — a assinatura atual tem cota
      zero para VMs de computação.
