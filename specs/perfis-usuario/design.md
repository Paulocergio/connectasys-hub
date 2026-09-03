# Design: Perfis de Usuário

**Pasta:** `specs/perfis-usuario/` · **Spec:** `specs/perfis-usuario/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas perfis-usuario`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II — mesmo padrão de `Select` já
      usado em `_app.contas-a-receber.tsx`
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Todas as cores usam os tokens semânticos do Artigo V — reaproveita
      `status-info`/`status-warning`/`status-success`/`muted`, já
      existentes
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Sem rota nova. Em `_app.usuarios.tsx`: campo `role` do `Input` de texto
livre vira `Select` com as 4 opções fixas. Em
`src/components/role-badge.tsx` (já existe, criado nesta sessão pra
estilizar a coluna "Perfil"): o mapa `CONFIG` — hoje com um palpite
genérico (admin/manager/user) — passa a cobrir exatamente os 4 papéis
reais do domínio.

## 3. Componentes

| Componente | Local | Novo/Reuso | Notas |
|---|---|---|---|
| `Select` | `src/components/ui/select` | Reuso | Mesmo padrão do seletor de cliente em Contas a Receber |
| `RoleBadge` | `src/components/role-badge.tsx` | Ajuste | `CONFIG` remapeado pros 4 papéis reais |

## 4. Modelo de Dados

```ts
const PAPEIS = ["Admin", "Mecânico", "Recepcionista", "Financeiro"] as const;
```

`Form.role` continua `string` (valor do `Select`); `UsuarioApi.role`
continua `string` vindo da API — sem mudança de tipo, só de como é
editado.

## 5. Mapeamento de cor/ícone do `RoleBadge`

| Papel | Token | Ícone |
|---|---|---|
| Admin | `status-info` (roxo, já usado no item ativo da sidebar) | `Shield` |
| Mecânico | `status-warning` (âmbar) | `Wrench` |
| Recepcionista | `muted` (neutro) | `Headset` |
| Financeiro | `status-success` (verde) | `Banknote` |

Fallback (texto fora dos 4, caso a API retorne algo inesperado por
dado legado) continua existindo: `muted` + ícone `User` genérico, sem
quebrar a tela.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** RF-02 (não salvar sem papel) é resolvido pelo próprio
  `Select` sempre ter um valor default (`Admin`, a primeira opção) em
  vez de estado vazio — mais simples que replicar a validação
  "obrigatório" que os outros formulários fazem pra campos que podem
  legitimamente ficar vazios (aqui não faz sentido um usuário sem
  papel).
- **Risco:** usuários já cadastrados antes desta feature podem ter
  `role` fora do conjunto novo (já que era texto livre). O `Select` no
  formulário de edição, se o valor atual não bater com nenhuma das 4
  opções, fica sem seleção visível até o usuário escolher uma — não
  quebra, só não pré-seleciona. O `RoleBadge` cobre esse caso via
  fallback (decisão da seção 5).

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Com a API local rodando (já validando `Role`), testar em `npm run
  dev`: criar usuário escolhendo cada um dos 4 papéis; editar trocando
  o papel; conferir que a coluna mostra o badge certo por papel.
