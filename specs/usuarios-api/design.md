# Design: Autenticação e Usuários via API real

**Pasta:** `specs/usuarios-api/` · **Spec:** `specs/usuarios-api/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas usuarios-api`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Query já está no projeto
      pra chamadas assíncronas; `fetch` nativo, sem lib de HTTP nova)
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV (cliente de API em
      `src/lib`)
- [x] Cores só via tokens semânticos (Artigo V) — não há mudança visual
      nesta feature
- [x] Textos de UI em português (Artigo III)
- [x] Conforme a emenda do Artigo I: essa é a primeira feature migrada
      do mock pro backend real

## 2. Resumo da Abordagem

Um módulo cliente de API centralizado (`src/lib/api.ts`) concentra a URL
base, o cabeçalho de autenticação e o tratamento de erro. `connecta-store.tsx`
troca a lógica de login/sessão pra chamar a API real, mantendo a mesma
interface pública (`useConnecta()`) que o resto do app já usa — o
`_app.tsx` não muda a lógica de proteção de rota. A tela de Usuários troca
o CRUD local por `useQuery`/`useMutation` do TanStack Query contra a API.

## 3. Contrato da API (confirmado testando a API local)

**Base:** `http://localhost:5283`

| Ação | Método | Rota | Body |
|---|---|---|---|
| Login | POST | `/api/Auth/login` | `{ email, senha }` |
| Listar usuários | GET | `/api/Usuarios` | — |
| Criar usuário | POST | `/api/Usuarios` | `{ nome, email, role, telefone, senha }` |
| Editar usuário | PUT | `/api/Usuarios/{id}` | `{ id, nome, email, role, telefone, senha? }` |
| Remover usuário | DELETE | `/api/Usuarios/{id}` | — |

Resposta de `GET /api/Usuarios` (confirmada ao vivo):
```json
{ "id": "guid", "nome": "string", "email": "string", "role": "string", "telefone": "string", "dataCriacaoUtc": "iso-datetime" }
```
Sem `senha` (correto, nunca deveria voltar) e sem `oficina`/`autorizado`
(não existem no backend real — ver spec, RF-06 e seção 5).

Resposta de `POST /api/Auth/login` (**confirmada testando ao vivo**, não
estava documentada no Swagger):
```json
{
  "token": "jwt...",
  "expiraEmUtc": "iso-datetime",
  "usuarioId": "guid",
  "nome": "string",
  "role": "string"
}
```
Sem `email` no retorno — a sessão local usa o e-mail digitado no
formulário de login.

## 4. Componentes e Arquivos Afetados

| Arquivo | Mudança |
|---|---|
| `src/lib/api.ts` (novo) | Cliente HTTP: base URL, header `Authorization`, parsing de erro |
| `src/lib/connecta-store.tsx` | `login`/`logout`/sessão passam a usar a API; CRUD de usuários vira chamadas de API |
| `src/routes/_app.usuarios.tsx` | Lista/formulário usam `useQuery`/`useMutation`; remove campo "Autorizado" e coluna "Acesso" (RF-06); remove referência a "oficina" no formulário |
| `src/routes/auth.tsx` | `onLogin` vira assíncrono, com estado de carregamento; aba "Cadastrar oficina" fica **desabilitada/escondida** (ver decisão abaixo) |
| `src/routes/_app.tsx` | Sem mudança de lógica — `beforeLoad` continua igual |

## 5. Decisões de Design

- **Aba "Cadastrar oficina" desabilitada por enquanto**: como login agora
  só valida contra a API real, deixar essa aba ativa criaria uma conta
  "fantasma" (salva só no navegador) que nunca conseguiria logar de
  verdade. Ela fica escondida até existir um endpoint de registro de
  tenant na API (RF-07/seção 5 da spec).
- **Campo "Perfil" (role) vira texto livre, não mais um seletor fixo**: a
  API não documenta um conjunto fixo de valores pra `role` (os dados de
  teste têm "Admin", "Manager", "User", "admin" misturados) — um `Select`
  com opções fixas poderia rejeitar valores válidos. Fica um campo de
  texto simples por enquanto.
- **Token guardado em `localStorage`** (`connectasys.token`), junto com
  os dados de sessão resolvidos (`connectasys.sessao`), mesma abordagem
  que já existia — só troca a origem do dado.
- **401 da API desloga automaticamente**: qualquer chamada que volte 401
  limpa a sessão local e redireciona pra `/auth` (cobre RF-03, sessão/
  token inválido).
- **E-mail duplicado (RF-05) — correção de 2026-09-03**: a API não validava
  e-mail único (confirmado com 10 usuários duplicados no banco local),
  então esse cenário do RF-05 nunca tinha sido exercitado de verdade. A API
  agora retorna `409 Conflict` com `{ message }` ao criar/editar um usuário
  com e-mail já em uso (ver `connectasys_api/specs/specs/usuarios/design.md`).
  **Nenhuma mudança de código no hub foi necessária**: `apiFetch` já lê
  `data.message` de qualquer resposta de erro (`src/lib/api.ts`), e
  `onError: (erro) => toast.error(erro.message)` já existe nas mutations de
  criar/editar em `_app.usuarios.tsx` — a mensagem "Já existe um usuário
  cadastrado com este e-mail." vai aparecer no toast assim que a API
  aplicar a correção.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos

- Formato exato da resposta de login não documentado — mitigado testando
  ao vivo antes de implementar o parsing (tasks.md).
- API rodando só localmente (`http://localhost:5283`) — se a porta mudar
  ou a API não estiver no ar, o app perde a capacidade de logar. Nada a
  fazer aqui além de deixar isso claro pro usuário.

## 8. Estratégia de Verificação

Com a API local no ar (`http://localhost:5283`): criar um usuário via
`/swagger`, fazer login com ele no app, conferir que a tela de Usuários
lista/cria/edita/remove de verdade (dados sumindo/aparecendo também no
Swagger), e que um token inválido desloga.
