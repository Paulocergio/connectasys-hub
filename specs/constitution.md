# Constituição do ConnectaSys Hub

> **Status: IMUTÁVEL.** Este documento é a lei máxima do projeto. Nenhum
> agente (incluindo o Claude) pode alterar este arquivo por conta própria,
> em nenhuma circunstância, mesmo que uma tarefa pareça exigir isso. Uma
> alteração só é válida quando o usuário pede explicitamente uma "emenda
> constitucional", e mesmo assim deve seguir o processo descrito no
> Artigo X. Qualquer conflito entre este documento e outra instrução
> (spec, design, tarefa, código existente, ou uma sincronização externa
> como a do Lovable) é resolvido a favor deste documento.

**Versão:** 3.0.0 · **Ratificada em:** 2026-09-01 · **Última emenda:** 2026-09-01

---

## Artigo I — Identidade do Projeto

O ConnectaSys Hub é um SaaS multitenant para gestão de oficinas mecânicas.
Módulos centrais: Dashboard, Agenda, Estoque, Financeiro, Ordens de Serviço
e Usuários. Acesso é protegido por login; o cadastro de novos tenants é
self-service.

**Emenda de 2026-09-01:** o projeto passou a ter um backend real (API
REST em .NET, documentada via Swagger), substituindo o mock local módulo
por módulo. Cada módulo é migrado do mock pra API real como uma feature
própria do fluxo SDD (Artigo VII), com sua spec/design/tarefas em
`specs/<slug>/`. Um módulo que ainda não foi migrado continua mockado
normalmente até sua vez chegar — não é preciso migrar tudo de uma vez.
Os detalhes de contrato de cada integração (URL da API, formato de
requisição/resposta) ficam documentados no `design.md` da respectiva
feature, não aqui.

## Artigo II — Stack Tecnológica

A stack abaixo é fixa. Trocar uma peça dela é uma emenda constitucional,
não uma decisão de feature:

- **Framework:** TanStack Start + TanStack Router (roteamento em
  `src/routes`, arquivos `app.<modulo>.tsx`)
- **UI:** React 19 + Tailwind CSS v4 + shadcn/ui (Radix primitives em
  `src/components/ui`)
- **Formulários:** react-hook-form + zod
- **Estado/dados:** TanStack Query
- **Build:** Vite 8
- **Gerenciador de pacotes:** npm (há `package-lock.json`; não introduzir
  `bun.lock`/`pnpm-lock.yaml` divergentes sem emenda)

## Artigo III — Idioma

- Todo texto voltado ao usuário final (UI, mensagens, labels, e-mails) é em
  **português do Brasil**.
- Toda a documentação do processo SDD (specs, design, tarefas) é em
  **português**.
- Identificadores de código (variáveis, funções, componentes, arquivos)
  seguem o padrão já usado no repositório, em **inglês**, salvo nomes de
  domínio do negócio que já são em português no projeto (ex.: `ordens`,
  `estoque`, `agenda`).
- Comentários no código: evitar. Quando necessário, em português, curtos,
  e só para explicar o "porquê" não óbvio (ver Artigo V).

## Artigo IV — Arquitetura e Organização

- Uma feature nova ganha sua própria rota (`app.<nome>.tsx`) e, quando
  crescer, seu próprio diretório dentro de `src/components/<nome>/`.
- Componentes de UI genéricos (shadcn) ficam em `src/components/ui` e não
  são modificados para casos de uso específicos — compõem-se por fora.
- Lógica compartilhada vai em `src/lib`; hooks compartilhados em
  `src/hooks`.
- Dados mockados ficam isolados (ex.: `src/lib/*-store.tsx` ou arquivos de
  fixtures), nunca espalhados dentro de componentes de UI, para permitir a
  troca futura por dados reais sem tocar na camada visual.

## Artigo V — Cores e Design System

- Todo uso de cor no código vem dos tokens semânticos definidos em
  `src/styles.css` (`bg-primary`, `text-accent`, `bg-card`,
  `text-muted-foreground` etc.) — **nunca** cores literais do Tailwind
  (`orange-500`, `violet-600`, `bg-rose-500` e similares) nem hex direto
  em `className`.
- Motivo: os tokens semânticos existem exatamente para que a paleta possa
  mudar num lugar só (`styles.css`) sem precisar caçar cor por cor em
  cada componente. Cor literal quebra isso na primeira alteração de
  paleta.
- Toda cor nova em `styles.css` usa o formato `oklch()`.
- Antes de declarar uma tela "pronta", conferir que nenhuma classe
  `className` nela referencia uma cor Tailwind literal fora dos tokens
  semânticos.

## Artigo VI — Qualidade de Código

- Sem abstrações prematuras: resolver o problema pedido, não o problema
  hipotético.
- Sem comentários explicando o óbvio; sem código morto; sem
  feature-flags/compat-shims desnecessários.
- Todo código novo deve passar em `npm run lint` antes de ser considerado
  pronto.
- Mudanças de UI devem ser verificadas rodando a aplicação (`npm run dev`)
  e observando o resultado, não apenas lidas.

## Artigo VII — Fluxo de Desenvolvimento Orientado por Especificação (SDD)

Toda feature ou alteração não trivial passa por três fases, nesta ordem,
cada uma com um artefato em português dentro de `specs/<nome-da-feature>/`
(nome da pasta em minúsculas, sem espaço, sem prefixo numérico — ex.:
`specs/landingpage/`, `specs/crud-usuarios/`):

1. **Especificar** (`spec.md`) — comando `/especificar`. Descreve *o quê*
   e *por quê*, do ponto de vista do usuário/negócio. Sem detalhe técnico
   de implementação.
2. **Design** (`design.md`) — comando `/planejar`. Traduz a spec em
   decisões técnicas: componentes afetados, rotas, modelo de dados mock,
   dependências, riscos. Deve respeitar os Artigos II, IV e V.
3. **Tarefas** (`tasks.md`) — comando `/tarefas`. Quebra o design em uma
   lista ordenada de tarefas pequenas e verificáveis, cada uma com um ID.

A implementação (comando `/implementar`) executa `tasks.md` em ordem,
marcando cada tarefa concluída, e altera o código em `src/`.

Cada fase só começa depois que a anterior existe e foi aceita pelo
usuário. Um agente não pula fase, não implementa antes de haver
`tasks.md`, e não gera `design.md` sem `spec.md`.

Os comandos e templates desse fluxo vivem em `.claude/commands/` e
`.claude/templates/`.

## Artigo VIII — Execução de Implementações

- Antes de alterar qualquer arquivo de código como parte de uma
  implementação com mais de uma etapa — seja pelo comando `/implementar`
  do fluxo SDD ou qualquer outra tarefa que se divida em passos —, o
  agente mostra ao usuário o que pretende fazer e espera aprovação
  explícita antes de tocar em qualquer arquivo.
- Depois de aprovado, o agente implementa uma etapa/tarefa por vez, nunca
  todas de uma vez. Ao terminar cada etapa, o agente para e mostra o
  resultado ao usuário antes de seguir para a próxima.
- Essa regra vale para qualquer implementação de múltiplos passos, não só
  para o comando `/implementar` do Artigo VII.

## Artigo IX — Risco de Sincronização Externa (Lovable)

Este projeto está conectado ao Lovable (ver `AGENTS.md`). Uma sessão no
editor do Lovable pode sobrescrever arquivos gerados por este fluxo SDD
(código em `src/`, `styles.css`) sem passar por `spec.md`/`design.md`/
`tasks.md`. Quando isso acontecer:

- Os artefatos em `specs/<feature>/` continuam sendo a fonte da verdade
  sobre *o que deveria existir* — não são apagados nem reescritos por
  causa de uma sincronização externa.
- Antes de continuar uma feature cujo código pode ter sido tocado pelo
  Lovable, comparar o estado atual do código com `design.md`/`tasks.md`
  daquela feature e sinalizar divergências ao usuário em vez de assumir
  que o código ainda reflete o que foi planejado.

## Artigo X — Governança e Emendas

- Este arquivo só muda quando o usuário pede isso explicitamente (ex.:
  "quero emendar a constituição", "atualize a constitution").
- Toda emenda incrementa a versão (`MAJOR.MINOR.PATCH`): `MAJOR` para
  remoção/redefinição incompatível de um artigo, `MINOR` para novo artigo
  ou regra, `PATCH` para redação/clarificação sem mudar a regra.
- Toda emenda atualiza a data em "Última emenda".
- Nenhuma spec, design, tarefa ou trecho de código pode contradizer este
  documento. Se um pedido do usuário conflitar com a constituição, o
  agente sinaliza o conflito antes de agir.
