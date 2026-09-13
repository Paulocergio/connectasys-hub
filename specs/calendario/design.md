# Design: Calendário

**Pasta:** `specs/calendario/` · **Spec:** `specs/calendario/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas calendario`

> **Revisão (correção do usuário):** a tela é só leitura — sem
> `Dialog`/`AlertDialog` de criar/editar/remover. `Form`, o seletor de
> horário de 3 minutos e a lógica de conflito vivem só em
> `_app.ordens-servico.tsx` (ver `specs/ordens-servico/design.md` §2.1/
> §2.2), consumidos por essa tela apenas como dados já existentes.

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II — mesmo padrão de
      `_app.ordens-servico.tsx`
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Cores só via tokens semânticos (Artigo V)
- [x] Dados mockados isolados — não aplicável, API real
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Nova rota `_app.calendario.tsx`, só leitura: filtro de data + técnico,
tabela com os agendamentos daquele filtro (`useQuery` em
`/api/Agendamentos`, filtrado no client por dia/técnico — mesmo padrão
de filtro client-side já usado em outras telas do hub). Nenhum
`Dialog`/`AlertDialog`/`useMutation` — a tela não escreve nada.

Ponto de integração com `_app.ordens-servico.tsx` (onde o agendamento
de fato é criado/editado/removido — ver `specs/ordens-servico/design.md`
§2.2): ao escolher um técnico + data/horário no formulário de OS, uma
checagem de conflito roda contra `/api/Agendamentos/conflito`; se
houver conflito, um `AlertDialog` (na própria tela de OS) mostra o
agendamento existente e oferece navegar pra `/calendario` (com
`tecnicoId`/`data` na query string) só pra o usuário **ver** a agenda
daquele técnico naquele dia antes de voltar e escolher outro horário.

## 3. Rotas e Telas

| Rota | Arquivo | Nova/Existente | Descrição |
|---|---|---|---|
| `/calendario` | `src/routes/_app.calendario.tsx` | Nova | Lista/filtro (só leitura) de agendamentos por dia/técnico |
| `/ordens-servico` | `src/routes/_app.ordens-servico.tsx` | Existente | Único lugar que cria/edita/remove o Agendamento vinculado a uma OS (ver `specs/ordens-servico/design.md` §2.2) |

## 4. Modelo de Dados

```ts
type AgendamentoApi = {
  id: number;
  tecnicoId: string;
  clienteId: number | null;
  veiculoId: number | null;
  ordemServicoId: number | null;
  dataHoraInicio: string; // ISO
  dataHoraFim: string | null;
  observacao: string | null;
  status: "Agendado" | "Concluído" | "Cancelado";
  dataCadastro: string;
};
```

Sem `Form` nesta tela — não há nada a submeter. `usuarios` (filtrado
por `role === "Mecânico"`), `clientes` e `veiculos` são buscados só
pra resolver nome/placa nas colunas da tabela.

## 5. Componentes e Layout

Sem componente novo — reaproveita `Table`/`Select`/`Input type="date"`
de `src/components/ui`. Layout:

- Barra de filtro no topo: `Input type="date"` (dia exibido, padrão
  hoje) + `Select` opcional de técnico (só Mecânicos, com item "Todos
  os técnicos").
- Tabela com os agendamentos do filtro: horário, técnico, cliente,
  veículo, status, observação — sem coluna de ações (nada é editável
  aqui).
- Mensagem clara quando a lista está vazia ("Nenhum agendamento neste
  dia").

`search.tecnicoId`/`search.data` (via `validateSearch`) inicializam o
filtro quando a rota é aberta a partir do modal de conflito em Ordens
de Serviço (`navigate({ to: "/calendario", search: { tecnicoId, data } })`)
— não abrem nenhum formulário, só pré-filtram a tabela.

## 6. Integração com Ordens de Serviço

Detalhe técnico completo em `specs/ordens-servico/design.md` §2.2 —
resumo aqui pra manter as duas specs cruzadas:

1. Formulário de OS tem técnico + data/horário de agendamento
   (`step={180}`, incrementos de 3 minutos).
2. Ao ter os dois preenchidos, `useQuery` consulta
   `/api/Agendamentos/conflito?tecnicoId=&dataHora=`.
3. Se vier um agendamento, `AlertDialog` (na tela de OS) mostra os
   detalhes (cliente/horário) com "Cancelar"/"Alterar".
4. "Alterar" navega para `/calendario?tecnicoId={id}&data={data}` —
   só pra visualização; o usuário volta pra aba/tela de OS pra digitar
   outro horário no campo já existente lá.
5. Ao salvar a OS (criar ou editar), `sincronizarAgendamento` (em
   `_app.ordens-servico.tsx`) cria, atualiza ou remove o `Agendamento`
   vinculado via `POST`/`PUT`/`DELETE /api/Agendamentos`, conforme
   técnico e data/horário estejam preenchidos no formulário da OS.

## 7. Dependências Novas

Nenhuma.

## 8. Riscos e Decisões

- **Decisão (correção do usuário):** Calendário é só leitura — toda
  escrita de Agendamento vive em Ordens de Serviço. Evita duas telas
  diferentes conseguindo criar o mesmo tipo de registro de formas
  distintas (uma vinculada a OS, outra avulsa), o que também
  simplifica a regra de negócio: todo agendamento sempre tem
  `ordemServicoId`.
- **Decisão:** a tela é uma lista/agenda de um dia por vez, não uma
  grade visual completa — evita construir um componente de calendário
  do zero (nenhuma lib de calendário está no Artigo II).
- **Risco:** o `Select` de técnico (só Mecânicos) reaproveita a mesma
  lógica já usada em Ordens de Serviço — decisão consciente de
  duplicar esse trecho pequeno em vez de extrair um hook compartilhado
  agora (Artigo VI, sem abstração prematura).

## 9. Estratégia de Verificação

- `npm run lint`/`npx tsc --noEmit` limpos.
- Com a API local rodando, testar manualmente em `npm run dev`:
  - Tela de Calendário carrega os agendamentos do dia (criados via
    Ordens de Serviço)
  - Trocar o filtro de data/técnico → lista atualiza
  - Dia sem agendamento → mensagem clara, não tabela vazia sem
    explicação
  - A partir de Ordens de Serviço: escolher técnico com agendamento no
    mesmo horário → modal de conflito aparece; clicar "Alterar" →
    navega pra `/calendario` com o técnico/data já filtrados,
    mostrando a agenda ocupada daquele técnico
  - Desligar a API e recarregar `/calendario` → mensagem de erro, sem
    tela quebrada
