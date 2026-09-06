# Tasks — Conclusão de OS gera Conta a Receber (frontend)

## Versão 1 — endpoint dedicado de aprovação (revertida)

- [x] Botão "Aprovar OS" + `AlertDialog` + mutation `aprovar`
      implementados e testados (build/tsc limpos)
- [x] Removido `aprovacaoClienteNome`/`aprovacaoClienteEm` do
      formulário de edição

**Revertida a pedido do usuário** — ver Versão 2.

## Versão 2 — gatilho por status "Concluído" (final)

- [x] Restaurados `aprovacaoClienteNome`/`aprovacaoClienteEm` em
      `Form`, `vazio`, `montarPayload`, `abrirEdicao`
- [x] Restaurados os dois `Input` manuais de aprovação no formulário
- [x] Removido estado `aprovando`/`nomeAprovador`, mutation `aprovar`
      e o `AlertDialog` de confirmação
- [x] Mutation `atualizar`: invalida `["contas-a-receber"]` além de
      `["ordens-servico"]`
- [x] Mutation `remover`: mesma invalidação extra (cobre exclusão em
      cascata no backend)
- [x] Mensagem informativa quando `osAtual.status === "Concluído"`
- [x] `_app.contas-a-receber.tsx`: `ordemServicoId` no tipo,
      referência "OS #N" na tabela, aviso de origem no modal (mantido
      da primeira versão, sem mudança)
- [x] `npx tsc --noEmit` sem erros novos
- [x] `npm run build` sem erros
- [ ] Testado manualmente no navegador — **pendente**, sessão sem
      acesso a navegador; pedir pro usuário confirmar

## Versão 3 — sincronização de valor + fechar modal (feedback do usuário)

- [x] Mutation `atualizar`: fecha o modal (`setAberto(false)`) no
      `onSuccess` — antes só "criar" fechava, "editar" nunca fechava
      (bug pré-existente, não introduzido por esta feature, mas
      corrigido a pedido do usuário)
- [x] Mutations `adicionarItem` e `removerItem`: invalidam
      `["contas-a-receber"]` também (cobre a sincronização de valor
      feita no backend quando um item muda o total da OS)
- [x] `npx tsc --noEmit` e `npm run build` sem erros

## Versão 4 — link pra OS + cancelamento remove conta (feedback do usuário)

- [x] `_app.ordens-servico.tsx`: `validateSearch` (`z.object({ os:
      z.coerce.number().optional() })`) na rota
- [x] `_app.ordens-servico.tsx`: `useEffect` abre o modal de edição
      automaticamente quando `?os=N` está na URL e limpa o parâmetro
      depois
- [x] `_app.contas-a-receber.tsx`: referência "OS #N" na tabela e no
      modal viram `Link` pra `/ordens-servico?os=N`
- [x] Cancelamento de OS remove a conta a receber — nenhuma mudança de
      código no frontend necessária (a invalidação de
      `["contas-a-receber"]` já existente cobre o caso)
- [x] `npx tsc --noEmit` e `npm run build` sem erros

**Status geral: implementação concluída, aguardando verificação
manual no navegador pelo usuário.**
