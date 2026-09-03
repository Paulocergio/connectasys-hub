# Design: Forma de Pagamento

**Pasta:** `specs/forma-pagamento/` · **Spec:** `specs/forma-pagamento/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas forma-pagamento`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Router, React 19,
      Tailwind v4, shadcn/ui, TanStack Query) — mesmo padrão das duas
      telas já existentes
- [x] Nenhuma dependência nova (reusa `Select`, já usado em
      `_app.contas-a-receber.tsx`)
- [x] Segue a organização de pastas do Artigo IV — mudança dentro das
      duas rotas já existentes, sem arquivo novo
- [x] Todas as cores usam os tokens semânticos do Artigo V
- [x] Dados mockados isolados — não aplicável, tela consome API real
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Mudança em `_app.contas-a-pagar.tsx` e `_app.contas-a-receber.tsx`
(nenhuma rota nova): campo `formaPagamento` no tipo `Form` e no tipo
`*Api`; `Select` de forma de pagamento adicionado dentro do mesmo bloco
condicional `{editando && (...)}` que já mostra o campo de data de
pagamento/recebimento; nova coluna "Forma de pagamento" na tabela;
validação no cliente espelhando a regra do backend
(`specs/forma-pagamento/spec.md` do `connectasys_api`).

## 3. Rotas e Telas

Nenhuma rota nova — mudança nas duas rotas já existentes:

| Rota | Arquivo | Descrição |
|---|---|---|
| `/contas-a-pagar` | `src/routes/_app.contas-a-pagar.tsx` | + campo e coluna de forma de pagamento |
| `/contas-a-receber` | `src/routes/_app.contas-a-receber.tsx` | + campo e coluna de forma de pagamento |

## 4. Componentes

| Componente | Local | Novo/Reuso | Notas |
|---|---|---|---|
| `Select` | `src/components/ui/select` | Reuso | Mesma composição já usada pro seletor de cliente em Contas a Receber; aqui com 4 opções fixas (não vindas da API) |

## 5. Modelo de Dados

Nas duas rotas, o tipo `*Api` ganha:

```ts
formaPagamento: "Cartão" | "Pix" | "Boleto" | "Dinheiro" | null;
```

E o tipo `Form` ganha:

```ts
formaPagamento: string; // "" = nenhuma escolhida
```

As 4 opções ficam como uma constante no topo do arquivo (mesmo padrão
de `vazio`, não uma abstração nova):

```ts
const FORMAS_PAGAMENTO = ["Cartão", "Pix", "Boleto", "Dinheiro"] as const;
```

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão (RF-02):** o `Select` de forma de pagamento fica dentro do
  mesmo `{editando && (...)}` que já isola o campo de data de
  pagamento/recebimento — hoje um `<div className="space-y-2">` único;
  passa a ser um `<div className="grid gap-4 sm:grid-cols-2">` com os
  dois campos lado a lado, mesmo padrão de layout já usado noutros
  pares de campo do formulário.
- **Decisão (RF-03/RF-04, validação no cliente):** em `salvar()`, antes
  de montar o payload: se `form.dataPagamento`/`dataRecebimento` estiver
  preenchida e `form.formaPagamento` estiver vazia, bloqueia o submit
  com `toast.error` (mesmo mecanismo já usado nas validações de T003 de
  Contas a Receber — sem `react-hook-form`/`zod`, consistente com o
  restante da tela). Se a data estiver vazia, `formaPagamento` é
  simplesmente omitida do payload como `null` (o backend também ignora
  nesse caso — dupla proteção, não validação divergente).
- **Decisão (RF-05, coluna na tabela):** célula mostra
  `c.formaPagamento ?? "—"` — sem badge/cor, só texto, pra não competir
  visualmente com o `StatusBadge` já existente na coluna ao lado.
- **Risco:** `ContaPagarApi`/`ContaReceberApi` já são usados noutros
  pontos do arquivo (ex: `abrirEdicao`) — adicionar o campo é uma
  mudança aditiva (campo a mais), não deveria quebrar nada existente,
  mas os dois `abrirEdicao` precisam ser atualizados pra também copiar
  `formaPagamento` pro `form` (senão a edição de uma conta já paga
  abriria com o seletor vazio em vez de mostrar a forma já gravada).

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Com a API local rodando (já com a migration de
  `forma-pagamento` do `connectasys_api` aplicada), testar
  manualmente em `npm run dev`, nas duas telas:
  - Editar conta pendente, informar data de pagamento/recebimento sem
    escolher forma → bloqueado com toast, nenhuma chamada à API
  - Editar conta pendente, informar data + forma → salva, vira "Paga",
    coluna nova mostra a forma escolhida
  - Reabrir a conta paga pra edição → seletor já vem com a forma
    gravada selecionada
  - Editar uma conta sem mexer na data (ex: só descrição) → salva sem
    exigir forma de pagamento
  - Conta ainda pendente/atrasada → coluna "Forma de pagamento" mostra
    "—"
