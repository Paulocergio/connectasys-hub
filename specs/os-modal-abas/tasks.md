# Tarefas: Abas no Modal de Ordem de Serviço

**Pasta:** `specs/os-modal-abas/` · **Design:** `specs/os-modal-abas/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

- [x] **T001** — Estrutura de abas ("Dados da OS" / "Peças e materiais")
  - Arquivo(s): `src/routes/_app.ordens-servico.tsx`
  - Critério de pronto: modal abre com as duas abas, campos existentes
    distribuídos corretamente

- [x] **T002** — Scroll interno na lista de peças/materiais
  - Arquivo(s): `src/routes/_app.ordens-servico.tsx`
  - Depende de: T001
  - Critério de pronto: adicionar muitas peças não aumenta a altura do
    modal

- [x] **T003** — Validação move o usuário pra aba certa
  - Arquivo(s): `src/routes/_app.ordens-servico.tsx`
  - Depende de: T001
  - Critério de pronto: tentar salvar sem cliente/veículo/descrição,
    estando na aba de peças, mostra o erro e troca pra "Dados da OS"

## Verificação Final

- [x] `npx tsc --noEmit` e `npm run build` sem erros novos
- [x] HMR do Vite aplicou sem erro
- [ ] Testado manualmente no navegador — pendente confirmação do
      usuário
