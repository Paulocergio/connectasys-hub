# Tarefas: Botão de Remover Vermelho e Gestão de Usuário Restrita

**Pasta:** `specs/ajustes-remover-e-usuarios/` · **Design:** `specs/ajustes-remover-e-usuarios/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

- [x] **T001** — Investigar por que o botão de remover não saía
      vermelho
  - Arquivo(s): nenhum (investigação)
  - Resultado: `AlertDialogAction` sem `variant` em 7 telas

- [x] **T002** — Investigar por que editar usuário "não funciona"
  - Arquivo(s): nenhum (investigação)
  - Resultado: `403 Forbidden` — endpoint já era Admin-only, tela não
    refletia isso

- [x] **T003** — `AlertDialogAction` vermelho por padrão
  - Arquivo(s): `src/components/ui/alert-dialog.tsx`
  - Depende de: T001
  - Critério de pronto: as 7 telas mostram o botão vermelho sem
    precisar editar cada uma

- [x] **T004** — Esconder gestão de usuário pra quem não é Admin
  - Arquivo(s): `src/routes/_app.usuarios.tsx`
  - Depende de: T002
  - Critério de pronto: não-Admin não vê criar/editar/excluir; Admin
    continua vendo normalmente

## Verificação Final

- [x] `npx tsc --noEmit` e `npm run build` sem erros novos
- [ ] Testado manualmente: botão vermelho nas 7 telas e menu de
      usuários com/sem Admin — pendente confirmação do usuário
