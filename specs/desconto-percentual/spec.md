# Especificação: Desconto da OS em Percentual

**Pasta:** `specs/desconto-percentual/` · **Status:** aprovado
**Data:** 2026-09-08 · **Fase seguinte:** `/planejar desconto-percentual`

## 1. Visão Geral

O campo "Desconto" da Ordem de Serviço é hoje um valor monetário fixo
(ex.: R$ 20,00), que não acompanha o tamanho da OS. Passa a ser um
percentual (ex.: 10%), aplicado sobre mão de obra + peças — o modelo
mais comum de negociação de desconto numa oficina.

## 2. Cenários de Uso

### Cenário 1: Aplicar desconto numa OS
- **Dado** uma OS com mão de obra e peças totalizando um valor
- **Quando** o usuário informa um percentual de desconto
- **Então** o valor total da OS é reduzido nesse percentual

### Cenário 2: Limite do percentual
- **Dado** o usuário digitando o desconto
- **Quando** ele tenta informar mais de 100%
- **Então** o valor fica travado em 100%

### Cenário 3: Impressão com desconto
- **Dado** uma OS com desconto aplicado
- **Quando** o usuário imprime a OS
- **Então** o documento mostra o percentual aplicado e o valor em reais
  efetivamente abatido

### Cenário 4: OS sem desconto
- **Dado** uma OS sem desconto informado
- **Quando** o valor total é calculado
- **Então** ele é igual à soma de mão de obra e peças, sem alteração

## 3. Requisitos Funcionais

- **RF-01:** O campo "Desconto" deve aceitar um percentual de 0 a 100.
- **RF-02:** O valor total da OS deve ser calculado como (mão de obra +
  peças) reduzido pelo percentual de desconto.
- **RF-03:** A conta a receber gerada automaticamente ao concluir a OS
  deve refletir o valor já com desconto aplicado.
- **RF-04:** A impressão da OS deve mostrar o percentual de desconto e
  o valor em reais correspondente.

## 4. Fora de Escopo

- Desconto por item individual — o percentual é sempre sobre o total
  da OS.

## 5. Suposições e Perguntas em Aberto

- Suposição revisada com o usuário: Ordens de Serviço já existentes no
  banco antes desta mudança tinham "Desconto" como valor em reais;
  reinterpretar esse valor como percentual mudaria o total delas.
  Decisão tomada com o usuário: zerar manualmente o desconto das OS de
  teste existentes antes de aplicar a mudança de significado do campo.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
