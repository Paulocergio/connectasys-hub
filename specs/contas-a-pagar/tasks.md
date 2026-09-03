# Tarefas: Contas a Pagar

**Pasta:** `specs/contas-a-pagar/` · **Design:** `specs/contas-a-pagar/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar contas-a-pagar`

- [x] **T001** — Criar `src/routes/_app.contas-a-pagar.tsx`: listagem
      (tabela com descrição, fornecedor, valor formatado em R$,
      vencimento, badge de status) + busca por descrição/fornecedor,
      via `useQuery` em `/api/ContasPagar`
  - Arquivo(s): `src/routes/_app.contas-a-pagar.tsx`
  - Critério de pronto: lista carrega da API real; `npm run lint` limpo
    (confirmado, 0 erros)

- [x] **T002** — Adicionar modal de criar/editar (`Dialog` +
      `useMutation` para `POST`/`PUT`), com campos descrição, fornecedor,
      valor, vencimento e (só na edição) data de pagamento
  - Arquivo(s): `src/routes/_app.contas-a-pagar.tsx`
  - Depende de: T001
  - Critério de pronto: criar e editar refletem na lista e no Swagger
    (`GET /api/ContasPagar`)

- [x] **T003** — Adicionar remoção (`AlertDialog` de confirmação +
      `useMutation` para `DELETE`)
  - Arquivo(s): `src/routes/_app.contas-a-pagar.tsx`
  - Depende de: T001
  - Critério de pronto: remover reflete na lista e no Swagger

- [x] **T004** — Registrar a rota no menu lateral (`_app.tsx`, array
      `itens`), com ícone (`lucide-react`, `Wallet`)
  - Arquivo(s): `src/routes/_app.tsx`
  - Depende de: T001
  - Critério de pronto: item aparece no menu, navega pra tela

- [ ] **T005 (parcial)** — Testar manualmente os 6 cenários da `spec.md`
      com a API local rodando (HTTPS, conforme `seguranca-quantica`)
  - Arquivo(s): nenhum (verificação)
  - Depende de: T001, T002, T003, T004
  - Confirmado por fora do navegador: rota resolve sem erro (`GET
    http://localhost:8080/contas-a-pagar` → `200`, match
    `_app/contas-a-pagar`, sem exceção de SSR); `GET
    https://localhost:7074/api/ContasPagar` com `Origin:
    http://localhost:8080` → `200`, CORS ok, lista vazia (banco sem
    contas ainda)
  - **Não verificado**: os 6 cenários de uso reais na tela (criar,
    editar, marcar como paga, filtrar, remover, erro de API) — extensão
    Claude in Chrome não conectada nesta sessão. Precisa de teste manual
    do usuário ou reconexão da extensão.

## Verificação Final

- [x] `npm run lint` sem erros
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente em
      `npm run dev` — pendente, ver T005
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal foi introduzida fora dos tokens
      semânticos
