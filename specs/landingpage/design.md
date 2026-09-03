# Design: Landing Page

**Pasta:** `specs/landingpage/` · **Spec:** `specs/landingpage/spec.md`
**Status:** dívida técnica resolvida em 2026-09-01 (ver `tasks.md`)
**Fase seguinte:** nenhuma pendência aberta no momento

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Start/Router, React 19,
      Tailwind v4, shadcn/ui)
- [x] Nenhuma dependência nova além do que já está em `package.json`
- [x] Segue a organização de pastas do Artigo IV
- [ ] **Todas as cores usam os tokens semânticos do Artigo V** — **NÃO
      CUMPRIDO.** O código atual usa cores Tailwind literais
      (`orange-500`, `violet-500`, `emerald-500`, `rose-500`, `sky-500`,
      `amber-500`) em vez de `bg-primary`/`text-accent`/etc. Ver "Dívida
      técnica" abaixo.
- [x] Dados mockados isolados de componentes de UI
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Página única (`src/routes/index.tsx`, rota `/`) com seções empilhadas:
header fixo, hero, faixa de prova social, recursos (bento grid), planos,
FAQ (accordion), CTA final e rodapé. Ilustrações e formas decorativas são
SVG próprios (sem imagens externas). Estado de UI local (accordion do FAQ)
via `useState`, sem necessidade de estado global.

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/` | `src/routes/index.tsx` | Existente | Landing page pública |

## 4. Componentes

| Componente | Local | Novo/Reuso | Notas |
|---|---|---|---|
| `Blob` | `src/components/landing/Blob.tsx` | Reuso | Forma orgânica decorativa (SVG), usada com `currentColor` |
| `OficinaIllustration` | `src/components/landing/OficinaIllustration.tsx` | Reuso | Ilustração flat de carro sobre elevador |
| `ProductPreview` | `src/components/landing/ProductPreview.tsx` | Reuso | Mockup de tela do produto (janela de navegador simulada) |
| `Marquee` | `src/components/landing/Marquee.tsx` | Reuso | Faixa rolando com prova social; depende da classe CSS `.animate-marquee` |
| `Button` | `src/components/ui/button.tsx` | Reuso | shadcn/ui |

## 5. Modelo de Dados (mock)

Todos os dados ficam inline em `src/routes/index.tsx` (arrays de módulo):
`recursos` (módulos), `planos` (preços), `faqData` (perguntas),
`oficinasFicticias` (nomes pra prova social), `corMap` (mapa cor → classes
Tailwind — ver dívida técnica).

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Sincronização externa (Lovable):** este arquivo, `spec.md` e o código
  de `index.tsx` já divergiram uma vez por causa de uma sincronização do
  Lovable que reescreveu a página por fora do fluxo SDD (ver Artigo IX
  da constituição). Antes de confiar neste `design.md` para uma próxima
  alteração, confirmar que `src/routes/index.tsx` ainda bate com o que
  está descrito aqui.

## 8. Dívida Técnica (pendências a virar tarefas)

- **Cores literais do Tailwind:** `corMap` e várias classes em
  `index.tsx` usam `orange-500`, `violet-500`, `emerald-500`, `rose-500`,
  `sky-500`, `amber-500` em vez dos tokens semânticos (`--primary`,
  `--accent` etc.) de `src/styles.css`. Viola o Artigo V da constituição.
- **Animação da faixa de prova social quebrada:** `Marquee.tsx` usa a
  classe `animate-marquee`, mas o `@keyframes marquee` correspondente não
  existe mais em `src/styles.css` (foi perdido na mesma sincronização).
  A faixa deve estar renderizando estática, sem rolar.
- **`--gradient-hero` foi reintroduzido em `styles.css`** mas não é mais
  referenciado em lugar nenhum de `index.tsx` — token morto.

## 9. Estratégia de Verificação

`npm run dev` + navegar a página inteira; `npm run lint`; conferir que
nenhuma classe `className` em `index.tsx` usa uma cor Tailwind literal.
