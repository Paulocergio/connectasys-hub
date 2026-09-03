# Especificação: Contas a Receber

**Pasta:** `specs/contas-a-receber/` · **Status:** rascunho
**Data:** 2026-09-03 · **Fase seguinte:** `/planejar contas-a-receber`

> Segunda parte do módulo Financeiro migrada do mock pra API real
> (Artigo I). O backend (`connectasys_api`) já tem o CRUD completo e
> testado — ver `specs/contas-receber/spec.md` naquele repositório. Esta
> spec cobre só a tela do hub. É a feature que ficou marcada como "fora
> de escopo" em `specs/contas-a-pagar/spec.md`.

## 1. Visão Geral

A oficina precisa controlar os valores que tem a receber de clientes —
serviços prestados, peças vendidas — sabendo quais estão pendentes,
recebidos ou atrasados. Diferente de Contas a Pagar (onde o fornecedor é
só um texto livre), toda conta a receber está vinculada a um cliente já
cadastrado no sistema. Esta feature cria a tela de Contas a Receber,
consumindo a API real já pronta.

## 2. Cenários de Uso

### Cenário 1: Listar contas a receber
- **Dado** um usuário autenticado na tela de Contas a Receber
- **Quando** a tela carrega
- **Então** ele vê a lista de contas (cliente, descrição, valor,
  vencimento, status), vinda da API

### Cenário 2: Cadastrar conta a receber
- **Dado** um usuário preenchendo o formulário "Nova conta"
- **Quando** ele escolhe um cliente já cadastrado, informa descrição,
  valor e vencimento, e salva
- **Então** a conta é criada na API, aparece na lista com status
  "Pendente" (ou "Atrasada" se o vencimento já passou)

### Cenário 3: Marcar conta como recebida
- **Dado** uma conta pendente ou atrasada na lista
- **Quando** o usuário edita a conta e informa a data de recebimento
- **Então** a conta passa a aparecer com status "Paga"

### Cenário 4: Editar conta a receber
- **Dado** uma conta existente
- **Quando** o usuário altera cliente, descrição, valor ou vencimento e
  salva
- **Então** a lista reflete a mudança

### Cenário 5: Remover conta a receber
- **Dado** uma conta existente
- **Quando** o usuário confirma a remoção
- **Então** ela é removida via API e some da lista

### Cenário 6: Cadastrar sem cliente selecionado
- **Dado** um usuário preenchendo o formulário "Nova conta" sem escolher
  um cliente
- **Quando** ele tenta salvar
- **Então** o sistema impede o envio e indica que o cliente é
  obrigatório, sem chamar a API

### Cenário 7: Erro da API
- **Dado** qualquer ação (criar/editar/remover) que falhe na API —
  inclusive tentar salvar com um cliente que não existe mais — Então o
  usuário vê uma mensagem legível (toast), sem tela quebrada e sem
  entrada fantasma na lista

## 3. Requisitos Funcionais

- **RF-01:** A tela deve listar as contas a receber vindas da API real.
- **RF-02:** Cada conta exibida mostra: nome do cliente, descrição,
  valor, data de vencimento, e status ("Pendente", "Paga" ou
  "Atrasada") — o status vem pronto da API, a tela não recalcula isso.
- **RF-03:** O usuário deve poder cadastrar uma nova conta, escolhendo o
  cliente entre os já cadastrados no sistema (não é texto livre). Data
  de recebimento não é preenchida na criação — toda conta nasce
  pendente.
- **RF-04:** O usuário deve poder editar uma conta existente, incluindo
  trocar o cliente e informar a data de recebimento (o que muda o
  status pra "Paga").
- **RF-05:** O usuário deve poder remover uma conta, com confirmação
  antes de efetivar.
- **RF-06:** O usuário deve poder buscar/filtrar a lista por descrição
  ou nome do cliente.
- **RF-07:** A tela deve ter uma entrada própria no menu de navegação
  lateral do app.
- **RF-08:** O formulário não permite salvar sem cliente, descrição,
  valor (maior que zero) e vencimento preenchidos.

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto uma chamada à API está em andamento (salvar,
  remover), a interface indica carregamento e evita duplo envio.
- **RNF-02:** Valores monetários são exibidos formatados em reais
  (R$ 1.234,56).

## 5. Fora de Escopo

- Cadastro/edição/remoção de clientes — a tela só consome a lista de
  clientes já existente pra permitir a escolha; um módulo completo de
  gestão de clientes é feature própria, futura.
- Contas a Pagar — já implementada (`specs/contas-a-pagar/`).
- Recebimento parcial, recorrência, anexo de comprovante, vínculo com
  ordens de serviço, emissão de boleto/nota — nenhum desses existe na
  API hoje.
- Indicadores/gráficos financeiros no dashboard — fica pra quando o
  módulo Financeiro tiver mais partes migradas.

## 6. Suposições e Perguntas em Aberto

- Suposição: o campo `Status` retornado pela API (`Pendente`/`Paga`/
  `Atrasada`) é usado como veio, sem tradução ou recomputação no
  frontend (mesmo padrão de Contas a Pagar).
- Suposição: a rota da tela segue o padrão já usado
  (`_app.contas-a-receber.tsx`), consistente com `_app.contas-a-pagar.tsx`.
- Suposição: se não houver nenhum cliente cadastrado, o formulário de
  nova conta comunica isso claramente (ex.: mensagem no lugar do
  seletor) em vez de mostrar um seletor vazio sem explicação.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [ ] Suposições/perguntas em aberto foram revisadas com o usuário
