# Design: Estoque

**Pasta:** `specs/estoque/` · **Spec:** `specs/estoque/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas estoque`

## 1. Verificação Constitucional

- [x] Usa apenas a stack já em uso (TanStack Router, React 19,
      TanStack Query, shadcn/ui) — mesmo padrão de `_app.veiculos.tsx`
- [x] Nenhuma dependência nova
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Duas partes:

1. Nova rota `_app.estoque.tsx`, réplica estrutural de
   `_app.contas-a-pagar.tsx` (tabela + busca, `Dialog` de
   criar/editar, `AlertDialog` de remoção, `useQuery`/`useMutation` +
   `apiFetch` contra `/api/Estoque`). Entrada nova no menu lateral.
2. Mudança em `_app.ordens-servico.tsx`: o formulário de adicionar
   item ganha um `Select` de peça do estoque antes dos campos de
   descrição/valor — ao escolher, os dois campos são preenchidos
   automaticamente.

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/estoque` | `src/routes/_app.estoque.tsx` | Nova | Lista + CRUD de peças em estoque |
| `/ordens-servico` | `src/routes/_app.ordens-servico.tsx` | Existente | Formulário de item ganha seletor de peça do estoque |

## 4. `_app.estoque.tsx`

Mesmo padrão de `_app.contas-a-pagar.tsx`, sem campos de status (peça
de estoque não tem status).

```ts
type EstoqueApi = {
  id: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  dataCadastro: string;
};

type Form = {
  descricao: string;
  quantidade: string; // texto controlado, convertido pra number ao enviar
  valorUnitario: string; // mesma máscara de dinheiro já usada em Contas a Pagar/Receber/OS
};
```

Ícone do menu: `Package` (lucide-react, ainda não usado no projeto,
mas já faz parte da lib já instalada — sem dependência nova).

## 5. `_app.ordens-servico.tsx` — seletor de peça do estoque

### 5.1 Tipos

```ts
type EstoqueApi = { id: number; descricao: string; quantidade: number; valorUnitario: number };

type ItemForm = {
  descricao: string;
  quantidade: string;
  valorUnitario: string;
  estoqueId: string; // "" = peça avulsa, sem vínculo
};
const itemVazio: ItemForm = { descricao: "", quantidade: "", valorUnitario: "", estoqueId: "" };
```

`ItemOrdemServicoApi` ganha `estoqueId: number | null` (reflete o que
a API retorna, ainda que não seja exibido diretamente na lista de
itens já adicionados).

### 5.2 Busca de estoque

```ts
const { data: estoque = [] } = useQuery({
  queryKey: ["estoque"],
  queryFn: () => apiFetch<EstoqueApi[]>("/api/Estoque"),
});
```

### 5.3 Seletor + preenchimento automático

Novo `Select` antes do `Input` de descrição, dentro do mesmo grid de
adicionar item:

```tsx
<Select
  value={itemForm.estoqueId}
  onValueChange={(v) => {
    const peca = estoque.find((e) => String(e.id) === v);
    setItemForm({
      ...itemForm,
      estoqueId: v,
      descricao: peca?.descricao ?? itemForm.descricao,
      valorUnitario: peca ? formatarNumero(peca.valorUnitario) : itemForm.valorUnitario,
    });
  }}
>
  <SelectTrigger className="w-full sm:w-48">
    <SelectValue placeholder="Peça do estoque (opcional)" />
  </SelectTrigger>
  <SelectContent>
    {estoque.map((e) => (
      <SelectItem key={e.id} value={String(e.id)}>
        {e.descricao} ({e.quantidade} disponíveis)
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

Os campos de descrição e valor unitário continuam sendo os mesmos
`Input`s já existentes — só ficam preenchidos depois da escolha,
continuam editáveis (RF-05, Suposição da spec).

### 5.4 Envio

```ts
const adicionarItem = useMutation({
  mutationFn: ({ ordemServicoId, dados }: { ordemServicoId: number; dados: ItemForm }) =>
    apiFetch(`/api/OrdensServico/${ordemServicoId}/itens`, {
      method: "POST",
      body: JSON.stringify({
        ordemServicoId,
        descricao: dados.descricao,
        quantidade: Number(dados.quantidade.replace(",", ".")),
        valorUnitario: paraNumero(dados.valorUnitario),
        estoqueId: dados.estoqueId ? Number(dados.estoqueId) : null,
      }),
    }),
  onSuccess: () => {
    invalidar();
    queryClient.invalidateQueries({ queryKey: ["contas-a-receber"] });
    queryClient.invalidateQueries({ queryKey: ["estoque"] }); // novo
    setItemForm(itemVazio);
    toast.success("Item adicionado.");
  },
  onError: (erro: Error) => toast.error(erro.message),
});
```

`removerItem` também invalida `["estoque"]` no `onSuccess` — a
quantidade pode voltar pro estoque no backend.

Fluxo de criação de OS nova (itens ainda em `itensNovos`, POSTados
depois que a OS é criada): o payload de cada item no loop também
inclui `estoqueId: item.estoqueId ? Number(item.estoqueId) : null`.

## 6. Dependências Novas

Nenhuma (`Package` já disponível via `lucide-react`, já instalado).

## 7. Riscos e Decisões

- **Decisão:** o `Select` de estoque é só uma conveniência de
  preenchimento — não trava os campos de descrição/valor depois de
  escolher. Se o usuário editar o valor manualmente depois de
  escolher a peça, o valor final que vale é sempre o do estoque no
  servidor (`EstoqueId` presente = servidor recalcula), então a
  edição manual do campo não muda o que é cobrado, só a exibição
  local até o refetch — comportamento aceitável, documentado aqui
  (evita reescrever os inputs como somente-leitura).
- **Decisão:** erro de "quantidade insuficiente" (`400` da API) usa o
  mesmo fluxo genérico de toast de erro já existente — sem
  tratamento especial na tela além de não fechar o formulário/limpar
  os campos digitados.
- **Risco:** se a lista de estoque crescer muito, o `Select` sem busca
  própria pode ficar longo — aceitável pro volume atual (mesmo risco
  já aceito no `Select` de clientes em Veículos/Contas a Receber).

## 8. Estratégia de Verificação

- `npx tsc --noEmit` e `npm run build` sem erros.
- Com a API local rodando, testar manualmente em `npm run dev`:
  - Tela de Estoque: criar, editar, remover peça, buscar por descrição
  - Em Ordens de Serviço, adicionar item escolhendo uma peça do
    estoque → descrição/valor preenchidos, item adicionado, estoque
    debitado (conferir na tela de Estoque)
  - Tentar adicionar quantidade maior que o disponível → toast de
    erro, nada adicionado
  - Remover o item da OS → estoque restaurado
  - Adicionar item sem escolher peça (fluxo antigo) → continua
    funcionando normalmente
  - Excluir uma OS com item vinculado a estoque → estoque restaurado
