# Especificação: Abas no Modal de Ordem de Serviço

**Pasta:** `specs/os-modal-abas/` · **Status:** aprovado
**Data:** 2026-09-08 · **Fase seguinte:** `/planejar os-modal-abas`

## 1. Visão Geral

O modal de criar/editar Ordem de Serviço reúne muitos campos e, além
disso, uma lista de peças/materiais que cresce conforme a OS tem mais
itens. Numa OS com muitas peças, o modal fica maior que a tela,
obrigando a rolar o diálogo inteiro pra achar o botão de salvar. A tela
precisa de uma organização que não cresça sem limite.

## 2. Cenários de Uso

### Cenário 1: Abrir o modal
- **Dado** um usuário abrindo "Nova OS" ou editando uma existente
- **Quando** o modal abre
- **Então** ele vê duas abas — "Dados da OS" e "Peças e materiais" —
  começando na primeira

### Cenário 2: Adicionar muitas peças
- **Dado** o usuário na aba "Peças e materiais"
- **Quando** ele adiciona várias peças, mais do que cabe na tela
- **Então** a lista de peças ganha rolagem própria, e o modal não cresce
  além de um tamanho fixo

### Cenário 3: Trocar de aba sem perder dado
- **Dado** o usuário com campos preenchidos na aba "Dados da OS"
- **Quando** ele troca pra aba "Peças e materiais" e volta
- **Então** tudo que foi preenchido continua lá

### Cenário 4: Tentar salvar com campo obrigatório faltando
- **Dado** o usuário na aba "Peças e materiais", sem ter preenchido
  cliente, veículo ou descrição do problema
- **Quando** ele tenta salvar
- **Então** a tela avisa qual informação falta e volta pra aba "Dados
  da OS" automaticamente

## 3. Requisitos Funcionais

- **RF-01:** O modal deve separar os campos gerais da OS e a seção de
  peças/materiais em abas distintas.
- **RF-02:** A lista de peças/materiais deve ter altura máxima fixa com
  rolagem própria, independente de quantos itens existirem.
- **RF-03:** Os botões de ação (Fechar/Salvar) devem ficar sempre
  visíveis, fora da área das abas.
- **RF-04:** Validação de campos obrigatórios deve indicar em qual aba
  está o problema e levar o usuário até ela.

## 4. Fora de Escopo

- Mudar quais campos existem no formulário.
- Mudar o fluxo de adicionar/remover peça em si (só a apresentação).

## 5. Suposições e Perguntas em Aberto

- Nenhuma — mudança de apresentação sem impacto em dado ou contrato de
  API.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
