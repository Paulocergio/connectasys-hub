# Design: {NOME_DA_FEATURE}

**Pasta:** `specs/{slug}/` · **Spec:** `specs/{slug}/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas {slug}`

## 1. Verificação Constitucional

Confirmar contra `specs/constitution.md` antes de detalhar a solução:

- [ ] Usa apenas a stack do Artigo II (TanStack Start/Router, React 19,
      Tailwind v4, shadcn/ui, react-hook-form+zod, TanStack Query)
- [ ] Nenhuma dependência nova sem justificativa explícita abaixo
- [ ] Segue a organização de pastas do Artigo IV
- [ ] Todas as cores usam os tokens semânticos do Artigo V — nenhuma cor
      Tailwind literal (`orange-500`, `violet-600` etc.)
- [ ] Dados mockados isolados de componentes de UI (Artigo IV)
- [ ] Textos de UI em português (Artigo III)

Se algum item não puder ser marcado, isso é um conflito constitucional —
sinalizar ao usuário antes de prosseguir.

## 2. Resumo da Abordagem

{2-4 frases descrevendo a solução técnica em alto nível.}

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/app/{...}` | `src/routes/app.{...}.tsx` | | |

## 4. Componentes

| Componente | Local | Novo/Reuso | Notas |
|---|---|---|---|
| | `src/components/...` | | |

## 5. Modelo de Dados (mock)

{Estruturas/tipos TypeScript dos dados mockados usados por esta feature,
e onde vivem (ex.: `src/lib/{...}-store.tsx`).}

```ts
// exemplo
type {Entidade} = {
  id: string;
};
```

## 6. Dependências Novas

- {Nome da lib} — **justificativa:** {por que a stack atual não resolve}

(Deixar "Nenhuma" se não houver.)

## 7. Riscos e Decisões

- {Risco ou decisão de design não trivial, e a escolha feita}

## 8. Estratégia de Verificação

{Como confirmar que a feature funciona: rodar `npm run dev`, fluxo manual
a testar no navegador, `npm run lint`.}
