# Design: Contas a Receber

**Pasta:** `specs/contas-a-receber/` · **Spec:** `specs/contas-a-receber/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas contas-a-receber`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Router, React 19,
      Tailwind v4, shadcn/ui, TanStack Query) — mesmo padrão de
      `_app.contas-a-pagar.tsx`
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Todas as cores usam os tokens semânticos do Artigo V
- [x] Dados mockados isolados — não aplicável, tela consome API real
      diretamente (mesmo padrão de Contas a Pagar e Usuários)
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Nova rota `_app.contas-a-receber.tsx`, réplica estrutural de
`_app.contas-a-pagar.tsx` (tabela + busca, `Dialog` de criar/editar,
`AlertDialog` de remoção, `useQuery`/`useMutation` + `apiFetch` contra
`/api/ContasReceber`). A diferença central: o campo `fornecedor` (texto
livre) é substituído por `clienteId`, escolhido num `Select` (shadcn,
reuso de `src/components/ui/select.tsx`) populado por
`GET /api/Clientes`. Entrada nova no menu lateral (`_app.tsx`, array
`itens`).

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/contas-a-receber` | `src/routes/_app.contas-a-receber.tsx` | Nova | Lista + CRUD de contas a receber |

## 4. Componentes

Nenhum componente novo fora da própria rota — segue o padrão de
`_app.contas-a-pagar.tsx`, usando primitivas de `src/components/ui`:
`Button`, `Input`, `Label`, `Select`, `Dialog`, `AlertDialog`, `Badge`.

| Componente | Local | Novo/Reuso | Notas |
|---|---|---|---|
| `Select` | `src/components/ui/select` | Reuso (primeira vez usado numa tela CRUD) | Popula com `clientes` de `GET /api/Clientes`; item mostra `Nome` (e `Email` como texto auxiliar, se couber). Sem dependência nova — componente já existe no projeto. |
| `Badge` | `src/components/ui/badge` | Reuso | Mesmo mapeamento de status de Contas a Pagar: `Atrasada` → `variant="destructive"`; `Pendente` → `variant="secondary"`; `Paga` → `variant="default"` com `className="bg-accent text-accent-foreground border-transparent"` |

## 5. Modelo de Dados

Tipos TypeScript espelhando `ContaReceberDto` e `ClienteDto` da API
(`connectasys_api`):

```ts
type ContaReceberApi = {
  id: number;
  clienteId: number;
  descricao: string;
  valor: number;
  dataVencimento: string; // ISO
  dataRecebimento: string | null;
  status: "Pendente" | "Paga" | "Atrasada";
  dataCadastro: string;
};

type ClienteApi = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
};

type Form = {
  clienteId: string; // valor do <Select>, "" = nada selecionado; convertido pra number ao enviar
  descricao: string;
  valor: string; // input controlado como texto, convertido pra number ao enviar (mesmo padrão de Contas a Pagar)
  dataVencimento: string; // yyyy-mm-dd
  dataRecebimento: string; // "" = não recebida
};
```

A lista de clientes vem de `useQuery(["clientes"], () =>
apiFetch<ClienteApi[]>("/api/Clientes"))`, carregada junto com a tela
(usada tanto pro `Select` do formulário quanto pra resolver `clienteId →
nome` nas linhas da tabela, via `Map` derivado com `useMemo`). Não há
mock — dado vem sempre da API real, mesmo padrão de Contas a Pagar.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão (revisão 2026-09-13):** `Valor` segue exatamente o mesmo
  mecanismo de Contas a Pagar (`design.md` §7 daquela feature) —
  `type="text"` com `inputMode="decimal"`, com máscara de dinheiro
  (`formatarMascaraDinheiro`) aplicada em tempo real no `onChange`,
  convertido pra `number` só ao montar o payload; exibição via
  `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
  (RNF-03, reaproveitado daquela feature).
- **Decisão:** `DataRecebimento` no formulário usa `<input type="date">`
  vazio = não recebida; string vazia vira `null` no payload de `PUT`,
  mesmo padrão de `DataPagamento` em Contas a Pagar.
- **Decisão:** `POST` (criar) nunca envia `dataRecebimento` — reflete
  RF-03 (toda conta nasce pendente).
- **Decisão (RF-08, validação):** o botão "Salvar" fica `disabled`
  enquanto `clienteId` estiver vazio, além do `required` nativo do HTML
  em descrição/valor/vencimento (mesmo mecanismo leve de validação já
  usado em Contas a Pagar e Usuários — sem introduzir
  `react-hook-form`/`zod` nesta tela, pra não divergir do padrão das
  outras telas CRUD do hub, que usam só estado controlado + `required`).
  `Valor` é validado como `> 0` antes de montar o payload; se inválido,
  o `submit` é interrompido e um toast explica o motivo.
- **Decisão (cenário "sem clientes"):** se `GET /api/Clientes` retornar
  lista vazia, o `Select` mostra um item desabilitado ("Nenhum cliente
  cadastrado") no lugar da lista, e o botão "Salvar" permanece
  bloqueado — cobre a suposição da spec sobre esse caso de borda.
- **Decisão (ícone do menu):** `HandCoins` (lucide-react, já disponível
  no projeto) para a entrada "Contas a Receber", em contraste com
  `Wallet` de Contas a Pagar.
- **Risco:** assim como em Contas a Pagar, o `id` de `ContaReceber` e de
  `Cliente` na API é `number` — manter `number` consistentemente nas
  chamadas (`/api/ContasReceber/${id}`), sem copiar por engano o padrão
  `string` de `_app.usuarios.tsx`.
- **Risco:** um cliente pode ser removido depois que uma conta já foi
  criada referenciando-o (fora do controle desta tela). Se
  `clienteId → nome` não resolver no `Map` derivado de `/api/Clientes`,
  a linha da tabela mostra `"Cliente #{clienteId}"` como fallback, em
  vez de quebrar a renderização.

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Com a API local rodando (`https://localhost:7074`), testar
  manualmente em `npm run dev`:
  - Tela carrega e lista contas existentes com nome do cliente
    resolvido corretamente
  - Criar conta escolhendo um cliente, sem vencimento passado → aparece
    como "Pendente"
  - Criar conta com vencimento no passado → aparece como "Atrasada"
  - Tentar salvar sem escolher cliente → botão bloqueado, nenhuma
    chamada à API
  - Editar informando data de recebimento → vira "Paga"
  - Editar trocando o cliente → lista reflete o novo nome
  - Buscar por descrição e por nome de cliente → filtro funciona nos
    dois casos
  - Remover conta → confirma modal, some da lista
  - Desligar a API e tentar criar → toast de erro, sem tela quebrada
