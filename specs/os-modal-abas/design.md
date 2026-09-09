# Design: Abas no Modal de Ordem de Serviço

**Pasta:** `specs/os-modal-abas/` · **Spec:** `specs/os-modal-abas/spec.md`
**Status:** aprovado · **Fase seguinte:** `/tarefas os-modal-abas`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II — `Tabs` é um componente
      shadcn/Radix já gerado no projeto (`src/components/ui/tabs.tsx`),
      só nunca tinha sido usado
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV — mudança concentrada
      em `_app.ordens-servico.tsx`
- [x] Não introduz cor nova
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Envolver o conteúdo do `<form>` existente em `<Tabs>`, dividindo os
grupos de campo já existentes em duas `TabsContent`. A aba de peças
ganha `max-h-56 overflow-y-auto` na lista de itens. Validação que hoje
depende de `required` nativo do HTML precisa virar checagem em
JavaScript, porque o Radix Tabs desmonta o conteúdo da aba inativa por
padrão — um campo `required` escondido numa aba que não existe no DOM
não bloqueia o envio do formulário.

## 3. Rotas e Telas

Nenhuma rota nova — mudança dentro de `/ordens-servico`.

## 4. Componentes

- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
  (`src/components/ui/tabs.tsx`) — já existiam no projeto, primeiro uso
  real.

## 5. Modelo de Dados

Nenhuma mudança de tipo — só um novo estado local
`aba: "dados" | "pecas"`, resetado a cada abertura do modal.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** `required` do campo "Descrição do problema" trocado por
  validação em JS dentro de `salvar()`, que também move o usuário de
  volta pra aba "Dados da OS" se faltar cliente, veículo ou descrição —
  necessário por causa do desmonte de conteúdo do Radix Tabs.
- **Risco:** nenhum dado é perdido ao trocar de aba, porque o estado do
  formulário vive no componente pai, não dentro de cada `TabsContent`.

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Testar manualmente: abrir "Nova OS", adicionar 10+ peças, confirmar
  que só a lista rola (não o modal inteiro); tentar salvar faltando um
  campo obrigatório estando na aba de peças e confirmar que volta pra
  aba certa.
