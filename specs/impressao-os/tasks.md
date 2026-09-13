# Tarefas — Impressão da Ordem de Serviço

## Fase 1 — Estilo de impressão

- [x] `styles.css`: bloco `@media print` sobrescrevendo os tokens de
      tema em `:root` com os mesmos valores do `.light`
- [x] `styles.css`: `@page` com margem
- [x] `_app.tsx`: `print:hidden` no `<aside>` (menu lateral)

## Fase 2 — Botão e conteúdo imprimível

- [x] Botão "Imprimir" (ícone `Printer`) na linha da tabela
- [x] Estado `imprimir` + `useEffect` disparando/limpando `window.print()`
      via evento `afterprint`
- [x] Bloco `hidden print:block` com o documento formatado da OS
- [x] Restante da tela (título, busca, tabela, diálogos) marcado
      `print:hidden`

## Fase 3 — Verificação

- [x] `npx tsc --noEmit` sem erros novos (10 erros pré-existentes em
      `api.ts`/`initials.ts`/`index.tsx`, nada em `_app.ordens-servico.tsx`)
- [x] `npm run build` sem erros
- [ ] Testado manualmente no navegador — pendente confirmação do usuário

**Status geral: implementação concluída, aguardando verificação manual
no navegador pelo usuário.**

## Fase 4 — Formatação (revisão 2026-09-13)

- [x] Reorganizar o bloco `hidden print:block` em seções com
      cabeçalhos (`<h2>` uppercase) e espaçamento/bordas (`design.md`
      — "Formatação do documento"): cliente/veículo, diagnóstico/
      solução, peças e totais, aprovação/assinatura
  - **Não verificado visualmente** — pendente revisão do documento
    impresso/pré-visualizado pelo usuário

- [x] ~~Adicionar parágrafo orientando a desmarcar "Cabeçalhos e
      rodapés"~~ — **revertido**: o usuário pediu explicitamente pra
      tirar esse texto da tela, não quer nenhum aviso sobre isso na
      interface (`design.md` — "Encaminhamento (revisado)")

- [ ] Testar manualmente: revisar o documento impresso/pré-visualizado
      com as seções novas — pendente, precisa de navegador real
      (extensão Claude in Chrome não conectada nesta sessão)
