# Especificação: Forma de Pagamento

**Pasta:** `specs/forma-pagamento/` · **Status:** rascunho
**Data:** 2026-09-03 · **Fase seguinte:** `/planejar forma-pagamento`

> Melhoria nas telas de Contas a Pagar e Contas a Receber (ambas já
> implementadas — `specs/contas-a-pagar/`, `specs/contas-a-receber/`).
> O backend (`connectasys_api`) ganha o campo `FormaPagamento` nas duas
> entidades como feature própria — ver
> `specs/forma-pagamento/spec.md` naquele repositório. Esta spec cobre
> só a mudança nas duas telas do hub.

## 1. Visão Geral

Hoje, ao marcar uma conta a pagar como paga ou uma conta a receber
como recebida, o usuário só informa a data. Não há registro de como o
pagamento foi feito — cartão, Pix, boleto ou dinheiro. Essa informação
é útil pra conferência de caixa e conciliação. Esta feature adiciona
essa escolha às duas telas existentes, sem criar nenhuma tela nova.

## 2. Cenários de Uso

### Cenário 1: Marcar conta a pagar como paga, informando a forma
- **Dado** um usuário editando uma conta a pagar pendente ou atrasada
- **Quando** ele informa a data de pagamento e escolhe a forma
  (Cartão, Pix, Boleto ou Dinheiro) e salva
- **Então** a conta passa a status "Paga" e a forma escolhida fica
  visível na lista e ao reabrir a conta pra edição

### Cenário 2: Marcar conta a receber como recebida, informando a forma
- **Dado** um usuário editando uma conta a receber pendente ou
  atrasada
- **Quando** ele informa a data de recebimento e escolhe a forma e
  salva
- **Então** a conta passa a status "Paga" e a forma escolhida fica
  visível na lista e ao reabrir a conta pra edição

### Cenário 3: Tentar marcar como paga sem escolher a forma
- **Dado** um usuário que informou a data de pagamento/recebimento mas
  não escolheu a forma
- **Quando** ele tenta salvar
- **Então** o sistema impede o envio e indica que a forma é
  obrigatória nesse caso, sem chamar a API

### Cenário 4: Editar uma conta ainda pendente
- **Dado** um usuário editando uma conta sem informar data de
  pagamento/recebimento (ex: só corrigindo a descrição)
- **Quando** ele salva sem escolher forma de pagamento
- **Então** o sistema aceita normalmente — a forma só é exigida quando
  a conta está sendo marcada como paga/recebida nessa mesma edição

### Cenário 5: Conta ainda não paga, na listagem
- **Dado** uma conta pendente ou atrasada na lista
- **Quando** o usuário olha a coluna de forma de pagamento
- **Então** ela aparece vazia/"—" (sem forma, pois a conta não foi
  paga ainda)

## 3. Requisitos Funcionais

- **RF-01:** O formulário de editar conta (a pagar e a receber) ganha
  um seletor de forma de pagamento com as opções: Cartão, Pix, Boleto,
  Dinheiro.
- **RF-02:** O seletor de forma de pagamento só aparece/fica
  relevante junto do campo de data de pagamento/recebimento (mesma
  área do formulário, já existente e visível só na edição).
- **RF-03:** Se o usuário informar a data de pagamento/recebimento sem
  escolher a forma, o formulário impede o salvamento e indica o campo
  obrigatório.
- **RF-04:** Se o usuário deixar a data de pagamento/recebimento vazia
  (conta continua pendente), a forma de pagamento não é exigida.
- **RF-05:** A tabela de listagem (nas duas telas) ganha uma coluna
  "Forma de pagamento", mostrando o valor quando a conta está paga e
  um indicador de vazio (ex: "—") quando não está.
- **RF-06:** Os textos das opções aparecem em português, como listado
  no RF-01.

## 4. Requisitos Não Funcionais

- **RNF-01:** Nenhuma mudança visual/estrutural fora do formulário e
  da nova coluna — layout geral das duas telas permanece o mesmo.

## 5. Fora de Escopo

- Qualquer forma de pagamento além das 4 listadas.
- Dados extras por forma (ex: bandeira do cartão, chave Pix usada).
- Filtro/busca por forma de pagamento na listagem.
- Indicadores/gráficos de forma de pagamento no dashboard.

## 6. Suposições e Perguntas em Aberto

- Suposição: o nome do campo no formulário é "Forma de pagamento" nas
  duas telas (mesmo em Contas a Receber, onde tecnicamente é um
  recebimento) — mantém consistência com o nome único já decidido no
  backend (`FormaPagamento` nas duas entidades).
- Suposição: a API rejeita (`400`) enviar `dataPagamento`/
  `dataRecebimento` sem `formaPagamento` — o formulário do hub
  replica essa mesma regra no cliente (RF-03) só pra dar feedback
  imediato, não como única camada de validação.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [ ] Suposições/perguntas em aberto foram revisadas com o usuário
