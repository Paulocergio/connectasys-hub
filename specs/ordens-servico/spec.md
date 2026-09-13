# Especificação: Ordens de Serviço

**Pasta:** `specs/ordens-servico/` · **Status:** rascunho
**Data:** 2026-09-04 · **Última revisão:** 2026-09-13 · **Fase seguinte:** `/planejar ordens-servico`

> **Revisão 2026-09-13** (rodada de ajustes pedida pelo usuário — ver
> `specs/calendario/` para a feature nova de agenda): remove-se o campo
> "Previsão de término"; o seletor de técnico responsável passa a
> listar só usuários com perfil Mecânico; escolher um técnico passa a
> checar o calendário dele antes de salvar; a tela ganha uma revisão
> de formatação. Detalhes de cada mudança nas seções abaixo.

> Backend (`connectasys_api`) já tem o CRUD completo de Ordens de
> Serviço, incluindo itens (peças/materiais) e cálculo de valor total
> — ver `specs/specs/ordens-servico/` naquele repositório. Esta spec
> cobre a tela do hub.

## 1. Visão Geral

A Ordem de Serviço (OS) é o documento central da oficina: registra o
problema relatado, o diagnóstico, o que foi feito, as peças usadas e
o valor cobrado, do momento em que o veículo entra até a entrega. Os
módulos de Clientes e Veículos já existem no hub; esta feature cria a
tela de Ordens de Serviço, vinculando as duas.

## 2. Cenários de Uso

### Cenário 1: Listar ordens de serviço
- **Dado** um usuário autenticado na tela de Ordens de Serviço
- **Quando** a tela carrega
- **Então** ele vê a lista (cliente, veículo, status, data de
  abertura, valor total), vinda da API

### Cenário 2: Abrir uma OS
- **Dado** um usuário preenchendo o formulário "Nova OS"
- **Quando** ele escolhe um cliente, depois um veículo daquele
  cliente, e descreve o problema
- **Então** a OS é criada com status "Aberto" e aparece na lista

### Cenário 3: Editar uma OS (diagnóstico, status, valores)
- **Dado** uma OS existente
- **Quando** o usuário atualiza diagnóstico, solução, status, data de
  conclusão, mão de obra ou desconto
- **Então** a lista e a tela de detalhe refletem a mudança

### Cenário 4: Adicionar/remover peças usadas
- **Dado** o formulário de nova ou editar OS aberto
- **Quando** o usuário adiciona um item (descrição, quantidade, valor
  unitário) ou remove um já existente
- **Então** o valor total exibido é recalculado na hora

### Cenário 5: Veículo depende do cliente escolhido
- **Dado** o formulário de nova/editar OS
- **Quando** o usuário troca o cliente selecionado
- **Então** a lista de veículos disponíveis pra escolher se atualiza
  pra mostrar só os veículos daquele cliente

### Cenário 6: Remover uma OS
- **Dado** uma OS existente
- **Quando** o usuário confirma a remoção
- **Então** ela (e os itens dela) somem da lista

### Cenário 7: Buscar OS
- **Dado** a lista carregada
- **Quando** o usuário digita na busca
- **Então** a lista filtra por nome do cliente, placa do veículo ou
  status

### Cenário 8: Erro da API
- **Dado** qualquer ação que falhe (veículo de outro cliente, status
  inválido, erro de rede)
- **Quando** o erro acontece
- **Então** o usuário vê uma mensagem legível (toast), sem tela
  quebrada

### Cenário 9: Seletor de técnico responsável só lista mecânicos
- **Dado** o formulário de criar/editar OS
- **Quando** o usuário abre o seletor de "Técnico responsável"
- **Então** só aparecem usuários cujo perfil é Mecânico — usuários com
  outros perfis (Admin, Recepcionista, Financeiro) não aparecem na
  lista

### Cenário 10: Conflito de agenda ao escolher o técnico
- **Dado** o formulário de criar/editar OS, com um cliente/veículo já
  informados
- **Quando** o usuário escolhe um técnico (Mecânico) que já tem um
  agendamento marcado no mesmo dia e horário (ver `specs/calendario/`)
- **Então** um modal informa o conflito, mostra os detalhes do
  agendamento existente, e oferece "Cancelar" (fecha o modal, mantém o
  técnico e o horário como estavam) ou "Alterar" (leva o usuário pra
  tela de Calendário, só de consulta, pra ver a agenda ocupada daquele
  técnico antes de voltar e escolher outro horário aqui no formulário)

## 3. Requisitos Funcionais

- **RF-01:** Listar OS com cliente, veículo, status, data de abertura
  e valor total.
- **RF-02:** Criar OS escolhendo cliente e, em seguida, um veículo
  daquele cliente (a lista de veículos filtra pelo cliente
  escolhido), com descrição do problema.
- **RF-03:** Editar uma OS: status (lista fixa: Aberto, Em Andamento,
  Aguardando Peça, Concluído, Cancelado), diagnóstico, solução, data
  de conclusão, mão de obra, desconto, técnico responsável (opcional),
  aprovação do cliente (nome + data). O campo "Previsão de término"
  foi removido (não existe mais na API nem na tabela do banco — ver
  `specs/specs/ordens-servico/` do `connectasys_api`).
- **RF-04:** Adicionar e remover itens (peças), tanto ao criar quanto
  ao editar uma OS; o valor total exibido reflete a soma na hora.
- **RF-05:** Remover uma OS, com confirmação.
- **RF-06:** Buscar/filtrar a lista por cliente, veículo ou status.
- **RF-07:** Entrada própria no menu lateral.
- **RF-08:** O seletor de "Técnico responsável" só lista usuários com
  perfil Mecânico (Cenário 9).
- **RF-09:** Ao escolher um técnico no formulário, o sistema verifica
  se ele já tem um agendamento no mesmo dia/horário selecionado; se
  tiver, mostra o modal de conflito descrito no Cenário 10, em vez de
  permitir salvar direto (regra completa em `specs/calendario/`).

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto uma chamada à API está em andamento, a
  interface indica carregamento e evita duplo envio.
- **RNF-02:** Valores monetários exibidos em reais (R$ 1.234,56).
- **RNF-03:** A tela segue uma hierarquia visual mais clara (espaçamento
  e agrupamento de seções no formulário/detalhe da OS) — pedido do
  usuário ("deixar a tela mais formatada"); o documento impresso de
  uma OS salva tem sua própria spec em `specs/impressao-os/`, incluindo
  a remoção de cabeçalho/rodapé indesejados na impressão.

## 5. Fora de Escopo

- Assinatura digital de verdade — a API só guarda nome + data de
  aprovação, texto simples.
- Impressão/PDF da OS.
- Tela de gestão de peças/estoque — o item da OS é texto livre
  (descrição, quantidade, valor), não vem de um catálogo.

## 6. Suposições e Perguntas em Aberto

- O campo "Técnico responsável" usa a lista de usuários
  (`/api/Usuarios`) — leitura liberada pra qualquer perfil logado
  (ajuste na spec `autorizacao` do `connectasys_api`; só
  criar/editar/remover usuário continua Admin-only). Se a chamada
  falhar por outro motivo (rede, API fora), a tela trata a falha
  graciosamente: o campo de técnico fica indisponível (mostra aviso),
  mas o resto do formulário continua funcionando — atribuir técnico
  não é obrigatório.
- Suposição: a rota da tela é `_app.ordens-servico.tsx`, seguindo o
  padrão já usado.
- **Pergunta em aberto (Cenário 9):** o filtro por perfil Mecânico é
  feito no front (lista completa de `/api/Usuarios`, filtrada por
  `role === "Mecânico"`) ou a API passa a expor um filtro próprio
  (`/api/Usuarios?role=Mecânico`)? Assumido o filtro no front por
  simplicidade — a API já fecha `Role` num conjunto de 4 valores
  fixos (`specs/perfis-usuario` do `connectasys_api`), então não há
  risco de valor inesperado; confirmar se o volume de usuários algum
  dia justifica mover o filtro pro servidor.
- **Pergunta em aberto (Cenário 10):** a verificação de conflito de
  agenda depende do endpoint de checagem definido em
  `specs/calendario/spec.md`. Este documento assume que a OS não fica
  bloqueada de ser salva sem técnico (campo continua opcional); o
  conflito só é checado quando um técnico é de fato escolhido.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
