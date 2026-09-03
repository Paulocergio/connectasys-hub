# Especificação: Contas a Pagar

**Pasta:** `specs/contas-a-pagar/` · **Status:** rascunho
**Data:** 2026-09-03 · **Fase seguinte:** `/planejar contas-a-pagar`

> Primeira parte do módulo Financeiro migrada do mock pra API real
> (Artigo I). O backend (`connectasys_api`) já tem o CRUD completo e
> testado — ver `specs/contas-pagar/spec.md` naquele repositório. Esta
> spec cobre só a tela do hub.

## 1. Visão Geral

A oficina precisa controlar as contas que tem a pagar — fornecedores,
aluguel, contas de consumo etc. — sabendo quais estão pendentes, pagas
ou atrasadas. Hoje não existe nenhuma tela pra isso no hub (o módulo
Financeiro foi removido do menu numa limpeza anterior). Esta feature
cria a tela de Contas a Pagar, consumindo a API real já pronta.

## 2. Cenários de Uso

### Cenário 1: Listar contas a pagar
- **Dado** um usuário autenticado na tela de Contas a Pagar
- **Quando** a tela carrega
- **Então** ele vê a lista de contas (descrição, fornecedor, valor,
  vencimento, status), vinda da API

### Cenário 2: Cadastrar conta a pagar
- **Dado** um usuário preenchendo o formulário "Nova conta"
- **Quando** ele informa descrição, fornecedor, valor e vencimento e salva
- **Então** a conta é criada na API, aparece na lista com status
  "Pendente" (ou "Atrasada" se o vencimento já passou)

### Cenário 3: Marcar conta como paga
- **Dado** uma conta pendente ou atrasada na lista
- **Quando** o usuário edita a conta e informa a data de pagamento
- **Então** a conta passa a aparecer com status "Paga"

### Cenário 4: Editar conta a pagar
- **Dado** uma conta existente
- **Quando** o usuário altera descrição, fornecedor, valor ou vencimento
  e salva
- **Então** a lista reflete a mudança

### Cenário 5: Remover conta a pagar
- **Dado** uma conta existente
- **Quando** o usuário confirma a remoção
- **Então** ela é removida via API e some da lista

### Cenário 6: Erro da API
- **Dado** qualquer ação (criar/editar/remover) que falhe na API
- **Quando** o erro acontece
- **Então** o usuário vê uma mensagem legível (toast), sem tela quebrada
  e sem entrada fantasma na lista

## 3. Requisitos Funcionais

- **RF-01:** A tela deve listar as contas a pagar vindas da API real.
- **RF-02:** Cada conta exibida mostra: descrição, fornecedor, valor,
  data de vencimento, e status ("Pendente", "Paga" ou "Atrasada") — o
  status vem pronto da API, a tela não recalcula isso.
- **RF-03:** O usuário deve poder cadastrar uma nova conta (descrição,
  fornecedor, valor, vencimento). Data de pagamento não é preenchida na
  criação — toda conta nasce pendente.
- **RF-04:** O usuário deve poder editar uma conta existente, incluindo
  informar a data de pagamento (o que muda o status pra "Paga").
- **RF-05:** O usuário deve poder remover uma conta, com confirmação
  antes de efetivar.
- **RF-06:** O usuário deve poder buscar/filtrar a lista por descrição
  ou fornecedor.
- **RF-07:** A tela deve ter uma entrada própria no menu de navegação
  lateral do app.

## 4. Requisitos Não Funcionais

- **RNF-01:** Enquanto uma chamada à API está em andamento (salvar,
  remover), a interface indica carregamento e evita duplo envio.
- **RNF-02:** Valores monetários são exibidos formatados em reais
  (R$ 1.234,56).

## 5. Fora de Escopo

- Contas a Receber — feature própria, futura (a API já tem o CRUD
  pronto, mas a tela é separada).
- Cadastro de fornecedores como entidade própria (campo é texto livre,
  espelhando a API).
- Pagamento parcial, recorrência de contas fixas, anexo de comprovante,
  vínculo com ordens de serviço — nenhum desses existe na API hoje.
- Indicadores/gráficos financeiros no dashboard — fica pra quando o
  módulo Financeiro tiver mais partes migradas.

## 6. Suposições e Perguntas em Aberto

- Suposição: o campo `Status` retornado pela API (`Pendente`/`Paga`/
  `Atrasada`) é usado como veio, sem tradução ou recomputação no
  frontend.
- Suposição: a rota da tela segue o padrão já usado
  (`_app.contas-a-pagar.tsx`), consistente com `_app.usuarios.tsx` e
  `_app.dashboard.tsx`.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
