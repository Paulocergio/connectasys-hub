# Design: Dashboard com Indicadores Reais

**Pasta:** `specs/dashboard-indicadores/` · **Spec:** `specs/dashboard-indicadores/spec.md`
**Status:** aprovado · **Fase seguinte:** `/tarefas dashboard-indicadores`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Query, sem lib nova)
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Não introduz cor nova
- [x] Textos de UI em português

## 2. Resumo da Abordagem

`_app.dashboard.tsx` passa a consultar 4 endpoints já existentes
(`/api/Clientes`, `/api/Estoque`, `/api/ContasReceber`,
`/api/OrdensServico`), reaproveitando as mesmas `queryKey` já usadas
nas telas de cada módulo (cache compartilhado do TanStack Query — sem
chamada de API nova).

## 3. Rotas e Telas

Nenhuma rota nova — mudança em `/dashboard`.

## 4. Componentes

Nenhum componente novo — reaproveita o layout de cards já existente.

## 5. Modelo de Dados

Sem tipo novo persistido — cálculos derivados em memória a partir dos
DTOs já existentes de cada módulo.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** comparações de data ("hoje", "mês atual") usam
  componentes de data **locais** do navegador (`getFullYear()` /
  `getMonth()` / `getDate()`), não `toISOString()`. Motivo: converter
  pra UTC adianta a data em fusos negativos (ex.: Brasil, UTC-3),
  fazendo uma OS com prazo pra hoje aparecer como atrasada mais cedo do
  que deveria — bug real, encontrado pelo usuário depois da primeira
  entrega e corrigido nesta rodada.
- **Decisão:** datas vindas da API são comparadas como string
  (`slice(0, 10)`/`slice(0, 7)`), não convertidas pra `Date`, evitando
  qualquer conversão de fuso adicional nelas.
- **Risco:** o critério de "estoque baixo" está duplicado entre esta
  tela e `_app.estoque.tsx` — se o critério mudar, precisa atualizar os
  dois lugares.

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Testar manualmente com dados reais no banco e conferir que os 4
  números batem.
- **Verificado nesta rodada:** números conferidos direto no banco (1
  cliente, 1 peça em estoque baixo, 1 OS aberta, 0 atrasadas,
  faturamento R$0 — todos batendo com o estado real dos dados de
  teste).
