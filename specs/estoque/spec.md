# Especificação: Estoque

**Pasta:** `specs/estoque/` · **Status:** aprovado
**Data:** 2026-09-05 · **Última revisão:** 2026-09-13 · **Fase seguinte:** `/planejar estoque`

> **Revisão 2026-09-13** (pedido do usuário): remove-se o campo
> "Estoque Mínimo" (e o aviso visual de estoque baixo que dependia
> dele); o campo "Margem" passa a mostrar duas margens — Margem de
> Venda e Margem de Markup — em vez de uma só. Ver seções abaixo.

> Lado do hub para a feature descrita em `specs/estoque/spec.md` do
> repositório `connectasys_api`: CRUD de peças/materiais em estoque, e
> integração com a tela de Ordens de Serviço (seleção de peça do
> estoque preenche valor unitário automaticamente e debita a
> quantidade). Esta spec cobre a tela nova de Estoque
> (`_app.estoque.tsx`) e a mudança na tela de Ordens de Serviço
> (`_app.ordens-servico.tsx`).

## 1. Visão Geral

Hoje, ao adicionar um item (peça) numa Ordem de Serviço, o usuário
digita descrição e valor unitário livremente — sem nenhum controle de
quanto tem em estoque nem de qual é o preço certo daquela peça. Esta
feature cria uma tela de Estoque (CRUD simples) e conecta ela à tela
de Ordens de Serviço: ao escolher uma peça do estoque no formulário de
item, descrição e valor vêm preenchidos automaticamente, e a
quantidade disponível é debitada.

## 2. Cenários de Uso

### Cenário 1: Listar estoque
- **Dado** um usuário autenticado na tela de Estoque
- **Quando** a tela carrega
- **Então** ele vê a lista de peças (nome, quantidade disponível,
  preço de compra, preço de venda, Margem de Venda e Margem de
  Markup), vinda da API

### Cenário 2: Cadastrar peça no estoque
- **Dado** um usuário preenchendo o formulário "Nova peça"
- **Quando** ele informa nome, quantidade, preço de compra e preço de
  venda, e salva
- **Então** a peça é criada na API e aparece na lista, com a Margem de
  Venda e a Margem de Markup calculadas automaticamente

### Cenário 2a: Editar a margem em vez do preço de venda
- **Dado** o formulário de peça, com preço de compra já preenchido
- **Quando** o usuário digita a Margem de Markup desejada (%) em vez de
  editar o preço de venda diretamente
- **Então** o preço de venda (e, junto, a Margem de Venda exibida) são
  recalculados automaticamente a partir do preço de compra e da Margem
  de Markup informada (ver design.md para as duas fórmulas)

### Cenário 3: Editar peça do estoque
- **Dado** uma peça existente
- **Quando** o usuário altera descrição, quantidade ou valor unitário
  e salva
- **Então** a lista reflete a mudança

### Cenário 4: Remover peça do estoque
- **Dado** uma peça existente
- **Quando** o usuário confirma a remoção
- **Então** ela é removida via API e some da lista

### Cenário 5: Escolher uma peça do estoque ao adicionar item na OS
- **Dado** o formulário de adicionar item, dentro de uma Ordem de
  Serviço
- **Quando** o usuário escolhe uma peça de um seletor de estoque
- **Então** os campos de descrição e valor unitário são preenchidos
  automaticamente com os dados daquela peça, e o usuário só precisa
  informar a quantidade usada

### Cenário 6: Adicionar item sem vincular ao estoque
- **Dado** o mesmo formulário de adicionar item
- **Quando** o usuário não escolhe nenhuma peça do estoque e digita
  descrição/valor manualmente (peça avulsa, não cadastrada)
- **Então** o item é adicionado normalmente, como já funciona hoje,
  sem nenhum efeito no estoque

### Cenário 7: Quantidade insuficiente no estoque
- **Dado** uma peça do estoque com, por exemplo, 2 unidades
  disponíveis
- **Quando** o usuário tenta adicionar um item da OS pedindo 5
  unidades dessa peça
- **Então** o sistema recusa com uma mensagem clara, sem adicionar o
  item nem alterar o estoque

### Cenário 8: Remover item de OS vinculado ao estoque
- **Dado** um item de OS que foi adicionado escolhendo uma peça do
  estoque
- **Quando** o usuário remove esse item da OS
- **Então** a quantidade usada volta pro estoque daquela peça

### Cenário 9: Erro da API
- **Dado** qualquer ação (criar/editar/remover peça, ou adicionar item
  vinculado ao estoque) que falhe na API
- **Quando** o erro acontece
- **Então** o usuário vê uma mensagem legível (toast), sem tela
  quebrada e sem entrada fantasma

## 3. Requisitos Funcionais

- **RF-01:** A tela de Estoque deve listar as peças vindas da API
  real, mostrando nome, quantidade disponível, preço de compra, preço
  de venda, Margem de Venda (%) e Margem de Markup (%).
- **RF-02:** O usuário deve poder cadastrar, editar e remover peças do
  estoque, com confirmação antes de remover.
- **RF-03:** O usuário deve poder buscar/filtrar a lista de estoque
  por nome.
- **RF-09 (revisão 2026-09-13):** O formulário de peça permite editar
  o preço de venda diretamente, ou editar a Margem de Markup (%) —
  nesse caso o preço de venda (e a Margem de Venda derivada) são
  recalculados a partir do preço de compra.
- ~~**RF-10:** Uma peça com quantidade disponível igual ou menor que o
  seu estoque mínimo cadastrado exibe um aviso visual de estoque
  baixo na lista.~~ **Removido (revisão 2026-09-13)** — o campo
  "Estoque Mínimo" e o aviso de estoque baixo saem do sistema por
  completo (formulário, tabela e API/banco — ver
  `specs/specs/estoque/` do `connectasys_api`).
- **RF-04:** A tela de Estoque deve ter uma entrada própria no menu de
  navegação lateral do app.
- **RF-05:** No formulário de adicionar item de uma Ordem de Serviço,
  o usuário deve poder escolher uma peça de um seletor de estoque —
  ao escolher, descrição e valor unitário são preenchidos
  automaticamente (e continuam editáveis apenas como exibição — ver
  Suposições).
- **RF-06:** O formulário de adicionar item continua permitindo
  digitar descrição e valor manualmente, sem escolher nenhuma peça do
  estoque (item avulso, sem vínculo).
- **RF-07:** Depois de adicionar ou remover um item de OS vinculado ao
  estoque, a lista de Estoque deve refletir a nova quantidade sem
  precisar recarregar a página manualmente.
- **RF-08:** Erros de quantidade insuficiente (ou qualquer outro erro
  ao adicionar item vinculado ao estoque) exibem mensagem legível
  (toast), sem alterar o estado local como se tivesse dado certo.

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto uma chamada à API está em andamento (salvar,
  remover), a interface indica carregamento e evita duplo envio.
- **RNF-02:** Valores monetários exibidos formatados em reais
  (R$ 1.234,56), mesmo padrão das outras telas financeiras.

## 5. Fora de Escopo

- Estoque mínimo e qualquer aviso (visual ou notificação) de estoque
  baixo — removido por completo (revisão 2026-09-13).
- Editar a quantidade/vínculo de um item de OS já adicionado — hoje só
  existe criar e remover item, não editar (mesmo limite já existente
  antes desta feature).
- Qualquer indicador de estoque no Dashboard.

## 6. Suposições e Perguntas em Aberto

- Suposição: depois de escolher uma peça do seletor, os campos de
  descrição e valor unitário aparecem preenchidos mas continuam sendo
  os mesmos inputs de texto já existentes (não viram somente-leitura)
  — evita reescrever a validação atual; se o usuário editar o valor
  manualmente depois de escolher a peça, o valor editado é o que vai
  pro servidor como referência de exibição, mas o servidor sempre usa
  o preço atual do estoque como fonte de verdade quando há vínculo
  (`EstoqueId`), conforme a spec do backend.
- Suposição: o seletor de peças do estoque mostra a quantidade
  disponível junto da descrição (ex.: "Filtro de óleo (12 disponíveis)")
  pra o usuário saber antes de tentar adicionar uma quantidade maior
  do que existe.
- Decidido: remover uma peça do estoque não precisa de tratamento
  especial em itens de OS antigos que a referenciam — comportamento
  do backend (mantém o `EstoqueId` mesmo que aponte pra um registro
  que não existe mais).
- **Revisão 2026-09-13 — duas margens:** o pedido do usuário foi
  "acrescentar Margem de Venda e Margem de Markup" ao campo Margem.
  Este documento assume as duas fórmulas de mercado mais comuns
  (nenhuma delas é gravada no banco — ambas continuam calculadas na
  hora, mesma decisão já registrada pra `Margem` antes desta revisão):
  - **Margem de Markup** = `(PrecoVenda − PrecoCompra) / PrecoCompra × 100`
    (é a fórmula que já existia sob o nome "margem de lucro").
  - **Margem de Venda** = `(PrecoVenda − PrecoCompra) / PrecoVenda × 100`
    (lucro como percentual do preço de venda, não do custo — sempre
    menor que a de Markup pro mesmo par de preços).
  Se a intenção do usuário era outra definição pra qualquer uma das
  duas, avisar pra eu ajustar a fórmula.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
