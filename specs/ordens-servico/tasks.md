# Tarefas: Ordens de Serviço

**Pasta:** `specs/ordens-servico/` · **Design:** `specs/ordens-servico/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar ordens-servico`

- [x] **T001** — Criar `src/components/status-ordem-servico-badge.tsx`
      (5 status, tokens semânticos)
  - Critério de pronto: `npm run lint` limpo (confirmado)

- [x] **T002** — Criar `src/routes/_app.ordens-servico.tsx`: listagem
      (tabela com cliente, veículo, status, data abertura, valor
      total) + busca, via `useQuery` em `/api/OrdensServico`,
      `/api/Clientes`, `/api/Veiculos`
  - Critério de pronto: lista carrega da API real; `npm run lint`
    limpo (confirmado)

- [x] **T003** — Modal de criar OS: cliente → veículo em cascata,
      descrição do problema, mão de obra, desconto, previsão de
      término
  - Critério de pronto: criar reflete na lista e no Swagger
    (testado — payload idêntico ao enviado pelo front confirmado via
    curl, `201`)

- [x] **T004** — Modal de editar OS: todos os campos de T003 +
      status, diagnóstico, solução, data de conclusão, técnico
      (com fallback gracioso se `/api/Usuarios` der `403`), aprovação
      do cliente
  - Critério de pronto: editar reflete na lista; status inválido
    tratado com toast de erro (mensagem de erro já vem da API via
    `apiFetch`, sem tratamento especial necessário)

- [x] **T005** — Seção de itens (peças) dentro do modal de edição:
      listar, adicionar, remover — valor total exibido reflete a API
  - Critério de pronto: adicionar/remover item reflete no valor
    total mostrado (via `osAtual` derivado da query `ordens-servico`
    já invalidada, sem estado duplicado)

- [x] **T006** — Remoção de OS (`AlertDialog` + `useMutation` DELETE)
  - Critério de pronto: remover reflete na lista e no Swagger
    (testado via curl, `204`)

- [x] **T007** — Registrar rota no menu lateral (`_app.tsx`, ícone
      `Wrench`)
  - Critério de pronto: item "Ordens de Serviço" aparece entre
    "Veículos" e "Usuários"; `npm run lint` limpo

- [x] **T008 (parcial)** — Testar os cenários da `spec.md`
  - Confirmado por fora do navegador: rota `/ordens-servico` resolve
    (`200`); payloads de criar OS, adicionar item e atualizar
    (incluindo `tecnicoId: null`) testados via curl direto contra a
    API real com exatamente o formato que o front envia — todos
    compatíveis; dados de teste removidos depois
  - **Não verificado no navegador de verdade**: cascata visual
    cliente→veículo, toasts, fallback do campo técnico pra usuário
    não-Admin, comportamento da UI — extensão Claude in Chrome não
    conectada nesta sessão

## Ajustes pós-feedback do usuário

- [x] `/api/Usuarios` (leitura) deixou de exigir role Admin no backend
      — campo "Técnico responsável" agora funciona pra qualquer perfil
      logado (testado via curl: `Financeiro` → `GET /api/Usuarios`
      `200`; `POST/PUT/DELETE` continuam `403` pra não-Admin)
- [x] Modal de criar unificado com o de editar: status, técnico,
      diagnóstico, solução, data de conclusão, aprovação e a seção de
      peças aparecem já na criação — não precisa mais criar e depois
      editar pra completar a OS
- [x] Criação com todos os campos + itens vira uma sequência
      create → update → `POST` de cada item, numa mutation só; testado
      via curl replicando exatamente essa sequência (`201` → `204` →
      `201` do item → `GET` confirma status "Em Andamento",
      diagnóstico e item salvos, valor total correto)
- [x] `npm run lint` limpo depois da mudança; `tsc --noEmit` sem erro
      no arquivo da feature

## Verificação Final

- [x] `npm run lint` sem erros
- [ ] Todos os cenários da spec testados manualmente em `npm run dev`
      — pendente, ver T008
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal introduzida fora dos tokens
      semânticos

## Ajustes pendentes (rodada de specs 2026-09-13)

- [x] **T009** — Remover `previsaoTermino` de `OrdemServicoApi`, `Form`
      e do formulário (input + label) de criar/editar OS
  - Coluna removida na API (`specs/specs/ordens-servico/` do
    `connectasys_api`); campo some do modal e do documento impresso;
    `npx tsc --noEmit` sem erro novo

- [x] **T010** — Filtrar o `Select` de técnico responsável por
      `role === "Mecânico"` (design 2.1)
  - `UsuarioApi` ganhou `role`; `mecanicos = usuarios.filter(u =>
    u.role === "Mecânico")`; lista vazia mostra item desabilitado

- [x] **T011** — Checagem de conflito de agenda ao escolher técnico
      (design 2.2), incluindo o `AlertDialog` de conflito com
      "Cancelar"/"Alterar", e sincronização do Agendamento vinculado à
      OS (criar/atualizar/remover conforme técnico e horário mudam)
  - Testado ponta a ponta via curl replicando exatamente a sequência
    que o front faz (POST OS → PUT OS → POST Agendamento vinculado →
    PUT sem self-conflito → DELETE ao limpar técnico); dados de teste
    removidos depois
  - **Não verificado no navegador de verdade** (extensão Claude in
    Chrome não conectada nesta sessão) — pendente confirmação visual
    do usuário: abrir o modal de conflito, clicar "Alterar" e conferir
    a navegação pra `/calendario`

- [x] **T012** — Revisão de formatação da tela (espaçamento/hierarquia
      visual do documento impresso, RNF-03) — seções com cabeçalho e
      espaçamento no bloco `hidden print:block`; nota de orientação
      sobre cabeçalho/rodapé do navegador abaixo do título da tela
  - **Não verificado visualmente** — pendente confirmação do usuário
