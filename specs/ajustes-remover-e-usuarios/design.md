# Design: Botão de Remover Vermelho e Gestão de Usuário Restrita

**Pasta:** `specs/ajustes-remover-e-usuarios/` · **Spec:** `specs/ajustes-remover-e-usuarios/spec.md`
**Status:** aprovado · **Fase seguinte:** `/tarefas ajustes-remover-e-usuarios`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Cor vermelha usa o token semântico `destructive` já existente —
      nenhuma cor Tailwind literal introduzida
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Investigação encontrou duas causas raiz distintas:

1. `AlertDialogAction` (o botão "Remover" do diálogo de confirmação) é
   usado do mesmo jeito, sem nenhum `variant`, em 7 telas — todas
   caindo no `variant: "default"` (padrão) do componente. Corrigido no
   componente compartilhado, não em cada tela.
2. "Editar usuário não funciona" era, na prática, um `403 Forbidden` —
   confirmado pelo erro exato no console do navegador
   (`PUT .../api/Usuarios/{id} 403`). O endpoint já era Admin-only na
   API; a tela só não escondia a ação antes do clique.

## 3. Rotas e Telas

Nenhuma rota nova. Mudança em `src/components/ui/alert-dialog.tsx` (7
telas beneficiadas de uma vez) e em `_app.usuarios.tsx`.

## 4. Componentes

- `AlertDialogAction` (`src/components/ui/alert-dialog.tsx`): variant
  padrão trocado pra `destructive`.

## 5. Modelo de Dados

Não se aplica.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Risco avaliado:** `AlertDialogAction` não tem nenhum outro uso no
  projeto além de "Remover" — mudar o padrão do componente inteiro não
  afeta outro fluxo.
- **Decisão:** a checagem de papel na tela de Usuários usa a mesma
  fonte de verdade (`sessao.papel === "Admin"`) que já era usada pra
  desabilitar a exclusão da própria conta — sem introduzir lógica nova
  de permissão no frontend.

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Testar manualmente: abrir o diálogo de remoção em cada uma das 7
  telas e confirmar que o botão é vermelho; logar como não-Admin e
  confirmar que a tela de Usuários esconde as ações de gestão.
