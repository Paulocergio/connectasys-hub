# Especificação: Dashboard com Indicadores Reais

**Pasta:** `specs/dashboard-indicadores/` · **Status:** aprovado
**Data:** 2026-09-08 · **Fase seguinte:** `/planejar dashboard-indicadores`

## 1. Visão Geral

O Dashboard existe como layout, mas todos os números eram fixos
("0", "R$ 0,00"). A oficina precisa de um resumo operacional real ao
entrar no sistema: faturamento do mês, peças em falta, clientes
cadastrados e OS em andamento.

## 2. Cenários de Uso

### Cenário 1: Ver faturamento do mês
- **Dado** contas a receber já recebidas dentro do mês atual
- **Quando** o usuário abre o Dashboard
- **Então** ele vê a soma dessas contas como faturamento do mês

### Cenário 2: Ver peças em estoque baixo
- **Dado** itens do estoque com quantidade igual ou abaixo do mínimo
  cadastrado
- **Quando** o usuário abre o Dashboard
- **Então** ele vê quantos itens estão nessa situação

### Cenário 3: Ver clientes ativos
- **Dado** clientes cadastrados no sistema
- **Quando** o usuário abre o Dashboard
- **Então** ele vê o total de clientes cadastrados

### Cenário 4: Ver OS em aberto e atrasadas
- **Dado** Ordens de Serviço com status diferente de Concluído/Cancelado
- **Quando** o usuário abre o Dashboard
- **Então** ele vê quantas estão abertas e, dentro dessas, quantas já
  passaram da previsão de término

### Cenário 5: OS com prazo pra hoje
- **Dado** uma OS aberta com previsão de término no dia de hoje
- **Quando** o Dashboard calcula OS atrasadas
- **Então** essa OS não conta como atrasada (só passa a contar a partir
  do dia seguinte)

## 3. Requisitos Funcionais

- **RF-01:** O Dashboard deve mostrar o faturamento do mês, somando
  apenas contas a receber já recebidas dentro do mês corrente.
- **RF-02:** O Dashboard deve mostrar a quantidade de itens do estoque
  em quantidade igual ou abaixo do mínimo cadastrado.
- **RF-03:** O Dashboard deve mostrar o total de clientes cadastrados.
- **RF-04:** O Dashboard deve mostrar, separadamente, quantas OS estão
  abertas e quantas dessas estão atrasadas.
- **RF-05:** O Dashboard deve ser acessível a qualquer perfil de
  usuário autenticado, como resumo geral.

## 4. Fora de Escopo

- Filtro de período customizado, gráficos, exportação de dados.

## 5. Suposições e Perguntas em Aberto

- Suposição confirmada com o usuário: "faturamento do mês" considera
  apenas dinheiro já recebido (não contas ainda pendentes).

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
