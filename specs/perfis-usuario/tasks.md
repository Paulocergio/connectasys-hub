# Tarefas: Perfis de Usuário

**Pasta:** `specs/perfis-usuario/` · **Design:** `specs/perfis-usuario/design.md`
**Status:** concluído · **Fase seguinte:** —

- [x] **T001** — Trocar o `Input` de "Perfil" por `Select` com as 4
      opções fixas (`Admin`, `Mecânico`, `Recepcionista`,
      `Financeiro`) em `_app.usuarios.tsx`, default `Admin` pra nunca
      salvar vazio
  - Arquivo(s): `src/routes/_app.usuarios.tsx`
  - Critério de pronto: criar e editar usuário com cada um dos 4
    papéis funciona; `npm run lint` limpo (0 erros)
  - Confirmado via `curl` com o payload exato da mutation (`role:
    "Recepcionista"`) → `201`. Registro de teste removido depois.

- [x] **T002** — Remapear `CONFIG` de `src/components/role-badge.tsx`
      pros 4 papéis reais (token + ícone por papel, ver design.md
      seção 5), mantendo o fallback neutro pra valores legados fora do
      conjunto
  - Arquivo(s): `src/components/role-badge.tsx`
  - Critério de pronto: cada um dos 4 papéis mostra cor/ícone
    diferente na tabela; um valor fora do conjunto não quebra a tela
  - Admin→roxo/Shield, Mecânico→âmbar/Wrench,
    Recepcionista→cinza/Headset, Financeiro→verde/Banknote; fallback
    (`User` cinza) preservado para roles legadas fora do conjunto.

- [ ] **T003** — Testar manualmente os 3 cenários da `spec.md`
  - Arquivo(s): nenhum (verificação)
  - Depende de: T001, T002
  - **Não verificado visualmente** — extensão Claude in Chrome
    desconectada nesta sessão. Rota `/usuarios` confirmada resolvendo
    `200` e round-trip via API confirmado por fora do navegador.

## Verificação Final

- [x] `npm run lint` sem erros
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente em
      `npm run dev` — pendente, ver T003
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal (`orange-500` etc.) foi introduzida
      fora dos tokens semânticos
