# Tarefas: Calendário

**Pasta:** `specs/calendario/` · **Design:** `specs/calendario/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar calendario`

> **Revisão (correção do usuário):** a tela é só leitura. As tarefas
> T002/T003 da versão anterior (Dialog de criar/editar, AlertDialog de
> remover) foram revertidas — não existem mais nesta tela.

- [x] **T001** — Criar `src/routes/_app.calendario.tsx`: filtro de
      data + técnico, listagem só leitura via `useQuery` em
      `/api/Agendamentos`
  - `npx tsc --noEmit`/`npx eslint`/`npm run build` sem erro novo

- [x] **T004** — Registrar rota no menu lateral (`_app.tsx`, ícone
      `CalendarClock`) e permissão (`permissoes.ts`, mesmos papéis de
      Ordens de Serviço: Admin/Mecânico/Recepcionista)

- [x] **T005** — Integração com Ordens de Serviço: checagem de
      conflito ao escolher técnico + `AlertDialog` de conflito
      (Cancelar/Alterar) + sincronização do Agendamento vinculado à OS
      — tudo implementado em `_app.ordens-servico.tsx` (ver
      `specs/ordens-servico/tasks.md` T011); "Alterar" navega pra
      `/calendario?tecnicoId=&data=`, que esta tela lê via
      `validateSearch` só pra pré-filtrar a listagem (sem abrir
      formulário nenhum)

- [ ] **T006** — Testar os cenários da `spec.md` com a API local
      rodando
  - Testado via curl o fluxo completo de criação/conflito/edição/
    remoção do Agendamento a partir de Ordens de Serviço — ver
    `specs/ordens-servico/tasks.md` T011
  - **Não verificado no navegador de verdade** (extensão Claude in
    Chrome não conectada nesta sessão) — pendente confirmação do
    usuário: abrir `/calendario`, conferir a listagem e o filtro, e o
    fluxo completo a partir do modal de conflito em Ordens de Serviço

## Verificação Final

- [x] `npx tsc --noEmit` sem erro novo (só os 10 erros pré-existentes
      documentados em `contas-a-pagar/tasks.md`)
- [x] `npx eslint` sem erro novo
- [ ] Todos os cenários da spec testados manualmente em `npm run dev`
      — pendente confirmação do usuário (sem navegador nesta sessão)
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal introduzida fora dos tokens
      semânticos
