# Design: Contas a Pagar

**Pasta:** `specs/contas-a-pagar/` · **Spec:** `specs/contas-a-pagar/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas contas-a-pagar`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Router, React 19,
      Tailwind v4, shadcn/ui, TanStack Query) — mesmo padrão de
      `_app.usuarios.tsx`
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Todas as cores usam os tokens semânticos do Artigo V
- [x] Dados mockados isolados — não aplicável, tela consome API real
      diretamente (mesmo padrão de Usuários)
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Nova rota `_app.contas-a-pagar.tsx`, réplica do padrão já usado em
`_app.usuarios.tsx`: tabela + busca, modal (`Dialog`) de criar/editar,
`AlertDialog` de confirmação de remoção, dados via `useQuery`/
`useMutation` chamando `apiFetch` (`src/lib/api.ts`) em `/api/ContasPagar`.
Entrada nova no menu lateral (`_app.tsx`, array `itens`).

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/contas-a-pagar` | `src/routes/_app.contas-a-pagar.tsx` | Nova | Lista + CRUD de contas a pagar |

## 4. Componentes

Nenhum componente novo fora da própria rota — segue o padrão de
`_app.usuarios.tsx` (tudo na página, usando primitivas de
`src/components/ui`: `Button`, `Input`, `Label`, `Dialog`,
`AlertDialog`, `Badge` para o status).

| Componente | Local | Novo/Reuso | Notas |
|---|---|---|---|
| `Badge` | `src/components/ui/badge` | Reuso | `Atrasada` → `variant="destructive"`; `Pendente` → `variant="secondary"`; `Paga` → `variant="default"` com `className="bg-accent text-accent-foreground border-transparent"` (token semântico `accent`, já definido em `styles.css` nos dois temas — composição por fora via `className`, sem alterar `badge.tsx`, conforme Artigo IV) |

## 5. Modelo de Dados

Tipo TypeScript espelhando `ContaPagarDto` da API (`connectasys_api`):

```ts
type ContaPagarApi = {
  id: number;
  descricao: string;
  fornecedor: string;
  valor: number;
  dataVencimento: string; // ISO
  dataPagamento: string | null;
  status: "Pendente" | "Paga" | "Atrasada";
  dataCadastro: string;
};

type Form = {
  descricao: string;
  fornecedor: string;
  valor: string; // input controlado como texto, convertido pra number ao enviar
  dataVencimento: string; // yyyy-mm-dd, formato do <input type="date">
  dataPagamento: string; // "" = não paga
};
```

Não há mock — dado vem sempre da API, mesmo padrão de Usuários.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão (revisão 2026-09-13, substitui a decisão original abaixo):**
  `Valor` continua sendo um `<input type="text" inputMode="decimal">`
  controlado (não `type="number"` nativo — ver Suposições da spec,
  RNF-03), mas passa a aplicar **máscara de dinheiro em tempo real**
  enquanto o usuário digita, em vez de texto livre validado só no
  submit:
  ```ts
  function formatarMascaraDinheiro(valorDigitado: string): string {
    const digitos = valorDigitado.replace(/\D/g, ""); // só dígitos
    const centavos = (Number(digitos) / 100).toFixed(2);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(centavos));
  }
  ```
  `onChange` roda o texto digitado por essa função e grava o resultado
  formatado (`"R$ 1.234,56"`) direto no estado do form; ao montar o
  payload, `paraNumero(valor)` (já existente) desfaz a máscara pra
  `number`. Mesmo padrão reaproveitado em Contas a Receber e no campo
  "Valor" de item/mão de obra de Ordens de Serviço.
- **Decisão original (2026-09-03, mantida como contexto):** `Valor` é
  editado como texto no formulário (`type="text"` com
  `inputMode="decimal"`), convertido para `number` só no momento de
  montar o payload — evita os problemas de UX do `<input type="number">`
  nativo com vírgula decimal em pt-BR. Formatação de exibição na tabela
  usa `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
  Este é exatamente o mesmo mecanismo que qualquer tela de valores
  monetários no projeto vai precisar — não é abstração prematura, é o
  requisito RNF-02 desta própria feature.
- **Decisão:** `DataPagamento` no formulário usa `<input type="date">`
  vazio = não paga. Ao montar o payload de `PUT`, string vazia vira
  `null`.
- **Decisão:** `POST` (criar) nunca envia `dataPagamento` — reflete
  RF-03/critério de aceite da API (toda conta nasce pendente).
- **Risco:** o `id` de `ContaPagar` na API é `number` (não `Guid`, ao
  contrário de `Usuario`) — o tipo `ContaPagarApi` e as chamadas
  (`/api/ContasPagar/${id}`) usam `number` consistentemente; atenção
  pra não copiar o padrão de `string` de `_app.usuarios.tsx` por engano.

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Com a API local rodando (`https://localhost:7074`, HTTPS conforme
  `seguranca-quantica`), testar manualmente em `npm run dev`:
  - Criar conta sem vencimento passado → aparece como "Pendente"
  - Criar conta com vencimento no passado (ajustando a data no form) →
    aparece como "Atrasada"
  - Editar informando data de pagamento → vira "Paga"
  - Editar removendo/limpando a busca, confirmar filtro por descrição e
    fornecedor
  - Remover conta → confirma modal, some da lista
  - Desligar a API e tentar criar → toast de erro, sem tela quebrada
