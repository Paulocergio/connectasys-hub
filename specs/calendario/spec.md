# Especificação: Calendário

**Pasta:** `specs/calendario/` · **Status:** rascunho
**Data:** 2026-09-13 · **Última revisão:** 2026-09-13 · **Fase seguinte:** `/planejar calendario`

> **Revisão (correção do usuário):** a tela de Calendário é **só
> leitura** — lista/filtra os agendamentos que já existem, pra
> consulta. Agendamentos nascem e são editados **exclusivamente** a
> partir do formulário de Ordens de Serviço (campos de técnico +
> data/horário lá — ver `specs/ordens-servico/spec.md`, Cenários 9/10).
> Não existe "Novo agendamento", editar ou remover na tela de
> Calendário. Os Cenários/RFs abaixo foram atualizados pra refletir
> isso; o texto original (CRUD completo na própria tela) foi a leitura
> inicial do pedido, corrigida depois pelo usuário.

> Backend (`connectasys_api`) ganha o CRUD completo de Agendamentos,
> incluindo o endpoint de checagem de conflito — ver
> `specs/specs/calendario/` naquele repositório. Esta spec cobre a
> tela do hub e o ponto de integração com a tela de Ordens de Serviço
> (`specs/ordens-servico/spec.md`, Cenários 9 e 10).

## 1. Visão Geral

Cada mecânico da oficina tem uma agenda de horários. Hoje não existe
nenhum controle disso — dois atendimentos podem ser marcados pro mesmo
mecânico no mesmo horário sem ninguém perceber até o conflito
acontecer na prática. O agendamento em si é criado dentro do
formulário de Ordens de Serviço, ao escolher técnico e horário (ver
`specs/ordens-servico/spec.md`, Cenários 9/10) — o sistema verifica ali
se o técnico já está ocupado naquele horário. Esta feature cria a tela
de Calendário como o lugar **só de consulta** pra ver essa agenda
consolidada, filtrando por dia e por técnico.

## 2. Cenários de Uso

### Cenário 1: Ver a agenda de um dia
- **Dado** um usuário autenticado na tela de Calendário
- **Quando** a tela carrega (ou o usuário troca o dia/técnico
  filtrado)
- **Então** ele vê os agendamentos daquele dia (horário, técnico,
  cliente/veículo se houver, status, observação), vindos da API —
  todos gerados a partir de Ordens de Serviço

### Cenário 2: Nenhum agendamento no dia
- **Dado** a tela de Calendário com um dia/técnico filtrado
- **Quando** não existe nenhum agendamento pra aquele filtro
- **Então** a tela mostra uma mensagem clara ("Nenhum agendamento
  neste dia"), não uma tabela vazia sem explicação

### Cenário 3: Conflito ao escolher técnico numa OS
- **Dado** o formulário de criar/editar Ordem de Serviço, com um
  técnico e horário de agendamento já escolhidos
- **Quando** o técnico escolhido já tem um agendamento marcado no
  mesmo horário
- **Então** um modal mostra o conflito com os detalhes do agendamento
  existente, e oferece "Cancelar" ou "Alterar" (leva pra esta tela de
  Calendário, já filtrada por aquele técnico/dia, pra o usuário
  **ver** os horários ocupados antes de voltar pro formulário da OS e
  escolher outro horário) — detalhe completo em
  `specs/ordens-servico/spec.md`, Cenário 10. A tela de Calendário em
  si não tem ação nenhuma pra "resolver" o conflito — só mostra a
  agenda pra consulta.

### Cenário 4: Erro da API
- **Dado** a tela de Calendário, se a chamada que busca os
  agendamentos falhar
- **Quando** o erro acontece
- **Então** o usuário vê uma mensagem legível, sem tela quebrada

## 3. Requisitos Funcionais

- **RF-01:** A tela de Calendário lista os agendamentos de um dia
  (com filtro de data, padrão hoje), vindos da API real; filtrável por
  técnico.
- **RF-02:** A tela é **somente leitura** — sem criar, editar ou
  remover agendamento. Essas ações existem só no formulário de Ordens
  de Serviço (`specs/ordens-servico/spec.md`).
- **RF-03:** A tela tem entrada própria no menu de navegação lateral.
- **RF-04:** A tela aceita ser aberta a partir do fluxo de Ordens de
  Serviço (ação "Alterar" do modal de conflito — Cenário 3), com
  técnico e data já filtrados.

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto a chamada à API está em andamento, a interface
  indica carregamento.
- **RNF-02:** Datas e horários exibidos no formato pt-BR
  (`13/09/2026`, `09:03`).

## 5. Fora de Escopo

- Criar, editar ou remover agendamento nesta tela — fica inteiramente
  no formulário de Ordens de Serviço (RF-02).
- Recorrência de agendamentos.
- Notificação/lembrete (e-mail, push) de agendamento próximo.
- Visualização em grade de calendário mês/semana com arrastar-e-soltar
  — a tela é uma lista/agenda de um dia por vez.
- Configuração de expediente/folga por técnico.
- Integração com calendário externo (Google Calendar etc.).

## 6. Suposições e Perguntas em Aberto

- Suposição: a tela é uma lista/agenda de um dia por vez (com filtro
  de técnico), não uma grade visual completa mês/semana — mais simples
  de construir com os componentes já existentes no projeto (`Table`,
  `Select`) e evita ter que desenhar uma grade de horários densa por
  causa do slot de 3 minutos usado no formulário de OS (ver
  `specs/ordens-servico/spec.md`). Se o usuário esperava uma visão tipo
  Google Calendar (grade de horas), avisar pra eu ajustar o design.
- O vínculo de um agendamento com uma OS (`ordemServicoId`) é sempre
  preenchido — todo agendamento nasce do fluxo de Ordens de Serviço
  (revisão desta spec); não existe mais agendamento avulso, sem OS.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário —
      escopo corrigido pelo próprio usuário (tela só leitura)
