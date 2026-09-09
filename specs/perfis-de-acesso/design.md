# Design: Perfis de Acesso (Controle de Permissão)

**Pasta:** `specs/perfis-de-acesso/` · **Spec:** `specs/perfis-de-acesso/spec.md`
**Status:** aprovado · **Fase seguinte:** `/tarefas perfis-de-acesso`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
      (`src/lib/permissoes.ts`)
- [x] Não introduz cor nova
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Um mapa único (`src/lib/permissoes.ts`) associa cada página aos papéis
permitidos. O menu lateral filtra os itens visíveis por esse mapa, e
cada rota protegida usa `beforeLoad` do TanStack Router pra checar
permissão antes de montar a tela, redirecionando pro Dashboard se
faltar acesso. Do lado da API (fora do escopo constitucional deste
repo, mas necessário pra fechar a feature), os métodos de escrita
(criar/editar/excluir) de cada controller passam a exigir o(s) papel(is)
dono(s) daquele módulo; leitura continua aberta.

## 3. Rotas e Telas

Nenhuma rota nova. `beforeLoad` adicionado em:
`_app.contas-a-pagar.tsx`, `_app.contas-a-receber.tsx`,
`_app.clientes.tsx`, `_app.veiculos.tsx`, `_app.ordens-servico.tsx`,
`_app.estoque.tsx`, `_app.usuarios.tsx`. `_app.dashboard.tsx` fica sem
guarda (acessível a todos).

## 4. Componentes

Nenhum componente novo.

## 5. Modelo de Dados

```ts
// src/lib/permissoes.ts
export const PAPEIS_POR_PAGINA = {
  dashboard: ["Admin", "Mecânico", "Recepcionista", "Financeiro"],
  "contas-a-pagar": ["Admin", "Financeiro"],
  "contas-a-receber": ["Admin", "Financeiro"],
  clientes: ["Admin"],
  veiculos: ["Admin", "Recepcionista"],
  "ordens-servico": ["Admin", "Mecânico", "Recepcionista"],
  estoque: ["Admin"],
  usuarios: ["Admin"],
} as const;

export function podeAcessar(papel: string | undefined | null, pagina: Pagina): boolean;
```

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão consciente (ver Fora de Escopo da spec):** leitura (`GET`)
  continua aberta a qualquer autenticado na API. Se o requisito evoluir
  pra restringir leitura também, o Dashboard precisa ser redesenhado
  pra esconder cards por perfil antes disso.
- **Decisão:** `GET /api/Usuarios` continua sem restrição de papel
  (decisão de uma feature anterior) — necessário pro dropdown de
  "técnico responsável" no formulário de Ordem de Serviço funcionar
  pra qualquer perfil que possa criar OS.
- **Risco:** o mapa de permissões vive num único arquivo
  (`permissoes.ts`) — qualquer novo módulo precisa lembrar de
  cadastrar sua entrada ali, senão fica invisível pra todo mundo por
  padrão (comportamento seguro, mas silencioso).

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Testar manualmente logando com cada um dos 4 papéis e conferindo o
  menu e os redirects de URL direta.
- **Verificado nesta rodada:** todas as 8 rotas retornando 200 depois
  da implementação; typecheck/build sem erro novo. Login real com cada
  papel ainda não foi testado visualmente.
