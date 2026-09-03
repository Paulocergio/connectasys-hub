# Tarefas: Landing Page

**Pasta:** `specs/landingpage/` · **Design:** `specs/landingpage/design.md`
**Status:** landing page já implementada; itens abaixo são a pendência
conhecida de dívida técnica (Artigo V da constituição).

## Já implementado (retroativo)

- [x] **T001** — Header fixo com logo, navegação e ações de login/cadastro
  - Arquivo(s): `src/routes/index.tsx`
- [x] **T002** — Hero com título, subtítulo, CTAs, estatísticas e prévia do produto
  - Arquivo(s): `src/routes/index.tsx`, `src/components/landing/ProductPreview.tsx`
- [x] **T003** — Faixa de prova social (marquee) com nomes fictícios de oficinas
  - Arquivo(s): `src/routes/index.tsx`, `src/components/landing/Marquee.tsx`
- [x] **T004** — Seção de recursos/módulos em grade (bento grid)
  - Arquivo(s): `src/routes/index.tsx`
- [x] **T005** — Seção de planos e preços com destaque para o plano popular
  - Arquivo(s): `src/routes/index.tsx`
- [x] **T006** — FAQ em formato accordion
  - Arquivo(s): `src/routes/index.tsx`
- [x] **T007** — Seção final de CTA e rodapé
  - Arquivo(s): `src/routes/index.tsx`

## Concluído nesta rodada

- [x] **T008** — Trocar todas as cores Tailwind literais (`orange-500`,
      `violet-500`, `emerald-500`, `rose-500`, `sky-500`, `amber-500`) em
      `src/routes/index.tsx` pelos tokens semânticos definidos em
      `src/styles.css` (`bg-primary`, `text-accent`, `chart-3`,
      `chart-4`, `chart-5`), incluindo o `corMap`. De brinde, corrigiu um
      bug pré-existente de classe dinâmica (`` `hover:shadow-${cor}-500/10` ``,
      que o Tailwind não consegue detectar em build) trocando por
      `c.glow` já resolvido.
  - Arquivo(s): `src/routes/index.tsx`
  - Critério de pronto: nenhuma classe `className` na página referencia
    uma cor Tailwind literal fora dos tokens semânticos; `npm run lint`
    limpo; página verificada visualmente em `npm run dev`. ✅

- [x] **T009** — Restaurar a animação da faixa de prova social: adicionar
      de volta o `@keyframes marquee` e a classe `.animate-marquee` em
      `src/styles.css` (foram perdidos numa sincronização externa).
  - Arquivo(s): `src/styles.css`
  - Critério de pronto: a faixa de nomes de oficinas rola continuamente
    em `npm run dev`. ✅

- [x] **T010** — Remover `--gradient-hero` de `src/styles.css`, sem
      nenhuma referência em `src/routes/index.tsx` (token morto).
  - Arquivo(s): `src/styles.css`
  - Critério de pronto: `grep` por `gradient-hero` não retorna nenhum uso
    fora da própria declaração. ✅

- [x] **T011** — (encontrado durante a implementação, não estava listado)
      Recriar `src/components/landing/{Blob,OficinaIllustration,
      ProductPreview,Marquee}.tsx`, que também tinham sido apagados na
      mesma sincronização externa — a página estava quebrando em runtime
      (`Cannot find module '@/components/landing/Blob'`) porque
      `index.tsx` importa esses 4 componentes.
  - Arquivo(s): `src/components/landing/*.tsx`
  - Critério de pronto: `npm run dev` renderiza a página sem erro no
    console/log do servidor. ✅

## Verificação Final

- [x] `npm run lint` sem erros (nos arquivos desta feature — há 4 erros
      de formatação pré-existentes em `src/routes/__root.tsx` e
      `src/routes/auth.tsx`, fora do escopo desta feature)
- [x] Todos os cenários da spec (`spec.md`) testados manualmente em `npm run dev`
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal (`orange-500` etc.) foi introduzida fora dos tokens semânticos
