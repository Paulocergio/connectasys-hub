# Tasks — Estoque (frontend)

## Fase 1 — Tela de Estoque

- [x] `src/routes/_app.estoque.tsx`: rota nova, CRUD completo
      (listar, criar, editar, remover, buscar por descrição)
- [x] Entrada "Estoque" no menu lateral (`_app.tsx`, ícone `Package`)

## Fase 2 — Integração com Ordens de Serviço

- [x] `ItemForm`: adicionado `estoqueId`; `itemVazio` inclui `estoqueId: ""`
- [x] `ItemOrdemServicoApi`: adicionado `estoqueId: number | null`
- [x] Query `["estoque"]` na página de Ordens de Serviço
- [x] `Select` de peça do estoque no formulário de adicionar item,
      preenchendo descrição/valor ao escolher
- [x] Payload de `adicionarItem` (e do loop de itens na criação de OS
      nova) inclui `estoqueId`
- [x] `adicionarItem`/`removerItem`/`remover` (OS)/`criar` (OS):
      invalidam `["estoque"]` também

## Fase 3 — Verificação

- [x] `npx tsc --noEmit` sem erros
- [x] `npm run build` sem erros
- [ ] Testado manualmente no navegador — pendente (sessão sem acesso a
      navegador; pedir pro usuário confirmar)

**Status geral: implementação concluída, aguardando verificação
manual no navegador pelo usuário.**

## Fase 4 — Revisão de campos (feedback do usuário)

- [x] `EstoqueApi`/`Form`: `nome`, `descricao` (opcional),
      `quantidade`, `precoCompra`, `precoVenda`, `margem` (só na UI,
      não enviada pra API), `estoqueMinimo`
- [x] Edição bidirecional: mudar preço de compra/venda recalcula a
      margem exibida; mudar a margem recalcula o preço de venda
      (mantendo o preço de compra fixo)
- [x] Tabela: colunas Nome, Quantidade (com badge "Estoque baixo" via
      `TriangleAlert` quando `quantidade <= estoqueMinimo`), Preço de
      compra, Preço de venda, Margem
- [x] `_app.ordens-servico.tsx`: `EstoqueApi` local atualizado
      (`nome`/`precoVenda`), Select e preenchimento automático usando
      os campos novos
- [x] `npx tsc --noEmit` e `npm run build` sem erros

## Fase 5 — Remover Estoque Mínimo, dividir Margem (revisão 2026-09-13)

- [x] Remover `estoqueMinimo` de `EstoqueApi`, `Form`, formulário
      (input) e coluna/badge "Estoque baixo" da tabela
  - Coluna removida na API (`specs/specs/estoque/` do
    `connectasys_api`); `npx tsc --noEmit` sem erro novo

- [x] Substituir a coluna única "Margem" por duas colunas — "Margem de
      Venda" e "Margem de Markup" — calculadas conforme `design.md` §4.1
  - `calcularMargemMarkup`/`calcularMargemVenda` implementadas; as
    duas colunas aparecem lado a lado na tabela

- [x] Formulário: campo de edição da margem passa a ser "Margem de
      Markup (%)" (recalcula preço de venda, que por sua vez recalcula
      a Margem de Venda exibida, mostrada como campo somente leitura)
  - `onMargemMarkupChange` atualiza preço de venda sem alterar o preço
    de compra; `npx eslint` sem erro novo
  - **Não verificado visualmente no navegador** (extensão Claude in
    Chrome não conectada nesta sessão) — pendente confirmação do
    usuário em `npm run dev`
