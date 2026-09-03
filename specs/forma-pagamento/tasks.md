# Tarefas: Forma de Pagamento

**Pasta:** `specs/forma-pagamento/` · **Design:** `specs/forma-pagamento/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar forma-pagamento`

> Depende do backend (`connectasys_api`, feature `forma-pagamento`
> naquele repo) estar implementado e rodando — sem o campo
> `formaPagamento` na API, a tela não tem o que popular/enviar.

- [x] **T001** — Adicionar `formaPagamento` ao tipo `ContaPagarApi` e ao
      tipo `Form` em `_app.contas-a-pagar.tsx`, com a constante
      `FORMAS_PAGAMENTO`; `Select` de forma de pagamento no formulário,
      ao lado do campo de data de pagamento (mesmo bloco
      `{editando && (...)}`); coluna "Forma de pagamento" na tabela
      (`c.formaPagamento ?? "—"`); `abrirEdicao` passa a copiar
      `formaPagamento` pro `form`
  - Arquivo(s): `src/routes/_app.contas-a-pagar.tsx`
  - Critério de pronto: editar uma conta já paga mostra a forma
    gravada selecionada no `Select`; coluna nova aparece na tabela;
    `npm run lint` limpo (0 erros)
  - Confirmado via `curl` com o payload exato que a mutation monta
    (`dataPagamento` + `formaPagamento: "Dinheiro"`) → `204`; `GET`
    confirma `status`="Paga" e `formaPagamento` gravado. Rota segue
    resolvendo `200`. Registro de teste removido depois. Renderização
    visual do `Select`/coluna não verificada (extensão do navegador
    desconectada).

- [x] **T002** — Validação no cliente (RF-03/RF-04) em
      `_app.contas-a-pagar.tsx`: em `salvar()`, se `dataPagamento`
      estiver preenchida e `formaPagamento` vazia, bloqueia o submit
      com `toast.error`, sem chamar a API; se `dataPagamento` estiver
      vazia, `formaPagamento` vai como `null` no payload
      independente do que estiver no `form`
  - Arquivo(s): `src/routes/_app.contas-a-pagar.tsx`
  - Depende de: T001
  - Critério de pronto: tentar salvar com data mas sem forma não
    dispara chamada à API; salvar sem data nunca envia forma
      preenchida
  - Guarda no início de `salvar()` (`form.dataPagamento &&
    !form.formaPagamento` → `toast.error` + `return`, antes de
    `criar.mutate`/`atualizar.mutate`); payload de `null` sem data já
    resolvido em T001. `npm run lint` limpo (0 erros). Verificado por
    leitura de código (extensão do navegador desconectada).

- [x] **T003** — Repetir T001 em `_app.contas-a-receber.tsx` (campo
      `formaPagamento`, `Select`, coluna na tabela, `abrirEdicao`)
  - Arquivo(s): `src/routes/_app.contas-a-receber.tsx`
  - Critério de pronto: mesmo critério de T001, nesta tela
  - `npm run lint` limpo (0 erros). Confirmado via `curl` com o payload
    exato da mutation (`dataRecebimento` + `formaPagamento: "Pix"`) →
    `204`; `GET` confirma `status`="Paga" e `formaPagamento`. Registro
    de teste removido depois.

- [x] **T004** — Repetir T002 em `_app.contas-a-receber.tsx` (mesma
      regra, com `dataRecebimento`)
  - Arquivo(s): `src/routes/_app.contas-a-receber.tsx`
  - Depende de: T003
  - Critério de pronto: mesmo critério de T002, nesta tela
  - Guarda em `salvar()` após a checagem de valor (`form.dataRecebimento
    && !form.formaPagamento` → `toast.error` + `return`). `npm run
    lint` limpo (0 erros). Verificado por leitura de código (extensão
    do navegador desconectada).

- [ ] **T005** — Testar manualmente os 5 cenários da `spec.md` nas duas
      telas, com a API local rodando já com a migration de
      `forma-pagamento` aplicada
  - Arquivo(s): nenhum (verificação)
  - Depende de: T001, T002, T003, T004
  - Critério de pronto: cada cenário confirmado nas duas telas

## Verificação Final

- [ ] `npm run lint` sem erros
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente em `npm run dev`
- [ ] Nenhum item da checklist constitucional do design ficou pendente
- [ ] Nenhuma cor Tailwind literal (`orange-500` etc.) foi introduzida fora dos tokens semânticos
