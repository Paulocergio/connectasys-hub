# Design: Conclusão de OS gera Conta a Receber (frontend)

**Pasta:** `specs/aprovacao-os-conta-receber/` · **Spec:** `specs/aprovacao-os-conta-receber/spec.md`
**Status:** implementado

> Ver nota no `spec.md`: gatilho mudou de uma ação dedicada "Aprovar
> OS" para a transição de `status` para `"Concluído"` no formulário
> normal de edição.

## 1. Verificação Constitucional

- [x] Usa apenas a stack já em uso (TanStack Router, React 19,
      TanStack Query, shadcn/ui)
- [x] Nenhuma dependência nova
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Duas rotas existentes mudam, nenhuma rota nova:

- `_app.ordens-servico.tsx`: os campos manuais de aprovação
  (`aprovacaoClienteNome`/`aprovacaoClienteEm`) continuam existindo
  como sempre estiveram — nenhuma mudança de UI para eles. A mutation
  de `atualizar` (`PUT`) passa a invalidar também a query de Contas a
  Receber, já que salvar uma OS pode gerar uma conta nova no backend.
  Uma mensagem informativa aparece quando a OS editada já está
  "Concluído".
- `_app.contas-a-receber.tsx`: mostra a referência à OS de origem
  quando `ordemServicoId` não é `null` (sem mudança em relação ao
  design anterior).

## 3. `_app.ordens-servico.tsx`

### 3.1 Tipos e formulário

`Form` mantém `aprovacaoClienteNome`/`aprovacaoClienteEm` (não foram
removidos — a primeira versão desta feature tinha removido e precisou
reverter). `montarPayload` e `abrirEdicao` continuam lendo/enviando
os dois campos, exatamente como antes desta feature existir.

### 3.2 Mutation `atualizar` — invalidação extra

```ts
const atualizar = useMutation({
  mutationFn: ({ id, dados }: { id: number; dados: Form }) =>
    apiFetch(`/api/OrdensServico/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, ...montarPayload(dados) }),
    }),
  onSuccess: () => {
    invalidar();
    queryClient.invalidateQueries({ queryKey: ["contas-a-receber"] });
    toast.success("Ordem de serviço atualizada.");
  },
  onError: (erro: Error) => toast.error(erro.message),
});
```

Invalida `["contas-a-receber"]` em **toda** atualização de OS, não só
quando o status muda para "Concluído" — mais simples que checar a
transição no frontend (o backend já garante que só cria a conta na
transição certa; invalidar sem necessidade só custa um refetch extra
se a tela estiver aberta).

### 3.3 Mensagem informativa

Dentro do modal de edição, abaixo dos campos de aprovação manual
(sem removê-los):

```tsx
{editando && osAtual && osAtual.status === "Concluído" && (
  <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
    OS concluída — se ainda não existir, uma conta a receber pendente é gerada
    automaticamente com o valor total (ver Contas a Receber).
  </p>
)}
```

### 3.4 Exclusão de OS

Sem mudança de código — a mutation `remover` já invalida
`["ordens-servico"]`; adicionada a mesma invalidação de
`["contas-a-receber"]` no `onSuccess`, já que excluir a OS pode
excluir (via cascade no backend) uma conta a receber vinculada.

## 4. `_app.contas-a-receber.tsx`

`ordemServicoId` no tipo, referência "OS #N" na tabela e aviso de
origem no modal (ver histórico no `tasks.md` desta pasta) — agora como
`Link` (`@tanstack/react-router`) em vez de texto plano:

```tsx
<Link
  to="/ordens-servico"
  search={{ os: c.ordemServicoId }}
  className="text-xs text-primary underline-offset-2 hover:underline"
>
  OS #{c.ordemServicoId}
</Link>
```

Mesmo padrão no aviso de origem dentro do modal de editar.

## 4a. `_app.ordens-servico.tsx` — deep link vindo de Contas a Receber

A rota ganha `validateSearch` (schema `zod`, mesmo padrão já usado em
`auth.tsx`) aceitando um parâmetro opcional `os` (número):

```ts
const searchSchema = z.object({ os: z.coerce.number().optional() });

export const Route = createFileRoute("/_app/ordens-servico")({
  ssr: false,
  validateSearch: searchSchema,
  component: OrdensServicoPage,
});
```

Dentro do componente, um `useEffect` abre o modal de edição
automaticamente quando `os` está presente e a lista já carregou,
depois limpa o parâmetro da URL (`navigate({ search: {}, replace:
true })`) pra não reabrir se o usuário atualizar a página ou voltar:

```tsx
const { os: osParam } = Route.useSearch();
const navigate = Route.useNavigate();
...
useEffect(() => {
  if (!osParam) return;
  const os = ordens.find((o) => o.id === osParam);
  if (os) {
    abrirEdicao(os);
    navigate({ search: {}, replace: true });
  }
}, [osParam, ordens]);
```

## 4b. Cancelamento remove a conta — sem mudança de código extra

O backend já remove a conta a receber vinculada quando a OS é
cancelada (ver `design.md` do backend). No frontend, a mesma
invalidação de `["contas-a-receber"]` que já existe na mutation
`atualizar` (adicionada na Versão 2) cobre esse caso — nenhum código
novo necessário além do que já estava lá.

## 5. O que foi revertido da primeira versão

- Removido: estado `aprovando`/`nomeAprovador`, mutation `aprovar`,
  bloco condicional de botão "Aprovar OS", e o `AlertDialog` de
  confirmação de aprovação.
- Restaurado: os dois `Input` de "Aprovado por (cliente)" e "Data de
  aprovação" no formulário de edição, exatamente como existiam antes
  desta feature.

## 6. Dependências Novas

Nenhuma.

## 7. Estratégia de Verificação

- `npx tsc --noEmit` sem erros novos nos arquivos alterados.
- `npm run build` sem erros.
- Com a API local rodando, testar manualmente em `npm run dev`:
  - Editar uma OS, mudar status pra "Concluído", salvar → conta nova
    aparece em Contas a Receber com "OS #N".
  - Salvar de novo sem mudar o status → nenhuma conta nova.
  - Excluir uma OS que gerou conta → a conta some de Contas a Receber.
  - Campos "Aprovado por"/"Data de aprovação" continuam editáveis e
    sem efeito nenhum sobre Contas a Receber.
