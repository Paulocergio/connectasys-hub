# Tarefas: Dashboard com Indicadores Reais

**Pasta:** `specs/dashboard-indicadores/` · **Design:** `specs/dashboard-indicadores/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

- [x] **T001** — Faturamento do mês (contas a receber recebidas no mês)
  - Arquivo(s): `src/routes/_app.dashboard.tsx`
  - Critério de pronto: soma bate com contas com `dataRecebimento` no
    mês atual

- [x] **T002** — Peças em estoque baixo
  - Arquivo(s): `src/routes/_app.dashboard.tsx`
  - Critério de pronto: conta itens com `quantidade <= estoqueMinimo`

- [x] **T003** — Clientes ativos
  - Arquivo(s): `src/routes/_app.dashboard.tsx`
  - Critério de pronto: mostra o total de clientes cadastrados

- [x] **T004** — OS em aberto / atrasadas
  - Arquivo(s): `src/routes/_app.dashboard.tsx`
  - Critério de pronto: card com dois números, atrasada só conta a
    partir do dia seguinte ao prazo

- [x] **T005** — Correção de bug: fuso horário no cálculo de "hoje"
  - Arquivo(s): `src/routes/_app.dashboard.tsx`
  - Depende de: T004
  - Critério de pronto: OS com prazo pra hoje não conta como atrasada

## Verificação Final

- [x] `npx tsc --noEmit` e `npm run build` sem erros novos
- [x] Números conferidos direto no banco de dados, batendo com o
      esperado
- [ ] Testado manualmente no navegador — pendente confirmação do
      usuário
