# Design: Ordens de Serviço

**Pasta:** `specs/ordens-servico/` · **Spec:** `specs/ordens-servico/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas ordens-servico`

> **Revisão 2026-09-13:** remove `previsaoTermino` de `OrdemServicoApi`/
> `Form`; `Select` de técnico filtra por `role === "Mecânico"`; ao
> escolher técnico, dispara checagem de conflito de agenda (ver
> `specs/calendario/design.md`) antes de permitir salvar.

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II — mesmo padrão de `_app.clientes.tsx`/`_app.veiculos.tsx`
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV — badge de status novo
      em `src/components/status-ordem-servico-badge.tsx` (componente
      próprio, não altera `status-badge.tsx` que já é tipado só pra
      status financeiro)
- [x] Cores só via tokens semânticos (Artigo V) — badge reusa os
      mesmos tokens `status-success/warning/danger` já usados em
      `StatusBadge`, mais um token neutro pra "Cancelado"
- [x] Dados mockados isolados — não aplicável, API real
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Nova rota `_app.ordens-servico.tsx`: tabela + busca, modal de
criar/editar, `AlertDialog` de remoção — mesmo esqueleto de
`_app.veiculos.tsx`. Diferenças específicas desta tela:

- **Select de cliente → select de veículo em cascata**: ao trocar o
  cliente no formulário, a lista de veículos é buscada de
  `/api/Veiculos/cliente/{clienteId}` (endpoint que já existe) e o
  veículo selecionado é limpo se não pertencer mais ao cliente atual.
- **Modal de criar igual ao de editar** (revisado após feedback do
  usuário: "não posso ter que criar e depois editar"). Todos os campos
  — status, técnico, diagnóstico, solução, data de conclusão,
  aprovação e a seção de peças — aparecem já na criação. Como
  `POST /api/OrdensServico` só aceita os campos mínimos (a OS nasce
  "Aberto"), o botão "Criar OS" dispara create → update (com o resto
  dos campos preenchidos) → um `POST .../itens` pra cada peça
  adicionada no formulário, tudo em sequência numa única mutation —
  invisível pro usuário, que só vê um botão e um resultado. Peças
  adicionadas antes de existir `id` ficam num estado local
  (`itensNovos`) até esse momento.
- **Técnico visível pra qualquer perfil**: `/api/Usuarios` (leitura)
  deixou de ser Admin-only depois do mesmo feedback — só
  criar/editar/remover usuário continua restrito a Admin (spec
  `autorizacao` do `connectasys_api`, ajustada).
  "Somente Admin pode listar técnicos" em vez de quebrar a tela —
  usa `isError` do `useQuery` pra decidir.

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/ordens-servico` | `src/routes/_app.ordens-servico.tsx` | Nova | Lista + CRUD de OS, com peças e cálculo de valor total |

## 4. Componentes

| Componente | Local | Novo/Reuso | Notas |
|---|---|---|---|
| `StatusOrdemServicoBadge` | `src/components/status-ordem-servico-badge.tsx` | Novo | 5 status (Aberto/Em Andamento/Aguardando Peça/Concluído/Cancelado), mesmo padrão visual de `StatusBadge` |

Resto tudo com primitivas de `src/components/ui` (`Dialog`, `Select`,
`Table`/tabela HTML, `AlertDialog`, `Textarea` pros campos de
descrição/diagnóstico/solução que são mais longos).

## 5. Modelo de Dados

```ts
type OrdemServicoApi = {
  id: number;
  clienteId: number;
  veiculoId: number;
  tecnicoId: string | null;
  status: "Aberto" | "Em Andamento" | "Aguardando Peça" | "Concluído" | "Cancelado";
  descricaoProblema: string;
  diagnostico: string | null;
  solucao: string | null;
  dataAbertura: string;
  dataConclusao: string | null;
  valorMaoDeObra: number;
  desconto: number;
  aprovacaoClienteEm: string | null;
  aprovacaoClienteNome: string | null;
  itens: ItemOrdemServicoApi[];
  valorTotal: number; // já vem calculado da API
};

type ItemOrdemServicoApi = {
  id: number;
  ordemServicoId: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
};

type Form = {
  clienteId: string;
  veiculoId: string;
  tecnicoId: string; // "" = sem técnico
  status: string;
  descricaoProblema: string;
  diagnostico: string;
  solucao: string;
  dataConclusao: string;
  valorMaoDeObra: string;
  desconto: string;
  aprovacaoClienteNome: string;
  aprovacaoClienteEm: string;
};
```

`previsaoTermino` removido de `OrdemServicoApi` e `Form` (RF-03 da
spec, revisão 2026-09-13) — a coluna também some da API/banco, ver
`specs/specs/ordens-servico/design.md` do `connectasys_api`.

Não há mock — dado vem sempre da API. `clientes`/`veiculos`/`usuarios`
são buscados como listas auxiliares pra Select e resolução de nome na
tabela (mesmo padrão de `_app.veiculos.tsx` com `clientes`).

### 2.1 Seletor de técnico filtrado por perfil (RF-08)

```ts
const mecanicos = usuarios.filter((u) => u.role === "Mecânico");
```

O `Select` de técnico passa a iterar `mecanicos` em vez de `usuarios`.
Se `mecanicos` vier vazio (nenhum usuário com perfil Mecânico
cadastrado), o `Select` mostra um item desabilitado ("Nenhum mecânico
cadastrado"), mesmo padrão já usado pro `Select` de cliente vazio em
Contas a Receber.

### 2.2 Checagem de conflito de agenda ao escolher técnico (RF-09)

Ao selecionar um `tecnicoId` no formulário (com uma data/hora de
agendamento já definida — ver `specs/calendario/spec.md` pra onde essa
data/hora é escolhida dentro do fluxo de OS), dispara:

```ts
const { data: conflito } = useQuery({
  queryKey: ["calendario", "conflito", tecnicoId, dataHora],
  queryFn: () => apiFetch<AgendamentoApi | null>(
    `/api/Agendamentos/conflito?tecnicoId=${tecnicoId}&dataHora=${dataHora}`
  ),
  enabled: Boolean(tecnicoId && dataHora),
});
```

Se `conflito` não for `null`, abre um `AlertDialog` com os detalhes do
agendamento existente (cliente, veículo, horário) e duas ações:
"Cancelar" (fecha o diálogo, mantém o formulário como estava) e
"Alterar" (navega para `_app.calendario.tsx`, que é só leitura,
levando o técnico e a data pré-filtrados — o usuário vê a agenda
ocupada e volta pra este formulário pra digitar outro horário no campo
já existente aqui). Detalhe completo do endpoint e do modelo de dados
em `specs/calendario/`.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** itens só editáveis com a OS já criada (RF/Fora de
  Escopo da spec) — evita ter que gerenciar uma lista de itens "em
  memória" antes de existir `ordemServicoId` pra vincular.
- **Decisão:** `valorTotal` exibido na tabela e no formulário vem
  pronto da API (`GET` já calcula) — a tela nunca recalcula por conta
  própria, evita divergência.
- **Risco aceito:** campo Técnico depende de `/api/Usuarios`, que é
  Admin-only — usuários não-Admin não conseguem atribuir técnico pela
  UI (podem editar tudo mais). Documentado como suposição aceita na
  spec; resolver de verdade exigiria um endpoint novo no backend
  (fora de escopo aqui).
- **Decisão:** campo "Ano"-like numéricos (`valorMaoDeObra`,
  `desconto`) seguem o mesmo padrão de texto controlado +
  `inputMode="decimal"` já usado em Contas a Pagar, convertidos pra
  `number` só ao montar o payload.
- **Decisão (revisão 2026-09-13):** a checagem de conflito de agenda
  (2.2) só roda quando o formulário já tem técnico **e** data/hora de
  agendamento definidos — evita disparar a query a cada tecla digitada
  no restante do formulário. Se o usuário trocar o técnico ou o
  horário depois de já ter passado pela checagem, ela roda de novo
  (chave da query inclui os dois valores).

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Com a API local rodando, testar manualmente em `npm run dev`:
  - Criar OS: escolher cliente → lista de veículos atualiza →
    escolher veículo → salvar → aparece na lista como "Aberto"
  - Trocar o cliente no formulário depois de já ter escolhido um
    veículo → veículo selecionado é limpo
  - Editar OS: mudar status, adicionar 2 itens, conferir que o valor
    total bate (mão de obra + itens − desconto)
  - Remover um item → valor total atualiza
  - Remover a OS → lista atualiza, itens somem junto (já garantido
    pela API)
  - Buscar por cliente, veículo e status → filtro funciona
  - Logado como não-Admin: campo de técnico mostra aviso em vez de
    quebrar a tela
  - Desligar a API e tentar salvar → toast de erro, sem tela quebrada
