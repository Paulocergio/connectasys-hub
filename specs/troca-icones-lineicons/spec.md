# Especificação: Troca de Ícones para Lineicons

**Pasta:** `specs/troca-icones-lineicons/` · **Status:** aprovado
**Data:** 2026-09-08 · **Fase seguinte:** `/planejar troca-icones-lineicons`

## 1. Visão Geral

Pedido direto do usuário: trocar a biblioteca de ícones usada nas
telas do app por Lineicons, referenciando o catálogo em
lineicons.com. Escolha de identidade visual, sem problema funcional na
biblioteca anterior.

## 2. Cenários de Uso

### Cenário 1: Navegar pelo app
- **Dado** um usuário navegando por qualquer tela do app
- **Quando** ele vê o menu lateral, botões de ação e badges de status
- **Então** os ícones vêm da Lineicons, não da biblioteca anterior

### Cenário 2: Ícone sem equivalente exato na Lineicons
- **Dado** um ícone que a versão gratuita da Lineicons não tem (ex.:
  chave de boca)
- **Quando** a tela é renderizada
- **Então** aparece o ícone mais próximo disponível, mantendo um
  significado reconhecível

## 3. Requisitos Funcionais

- **RF-01:** Nenhuma tela do produto deve usar a biblioteca de ícones
  anterior diretamente.
- **RF-02:** Cada ícone trocado deve ter um equivalente visualmente
  reconhecível, mesmo quando não idêntico ao original.

## 4. Fora de Escopo

- Ícones internos dos componentes de UI genéricos (diálogo, seletor,
  menu suspenso etc.) — continuam na biblioteca anterior, por serem
  peça de infraestrutura do kit de UI, não "ícone do produto".
- Comprar a versão paga (Pro) da Lineicons.

## 5. Suposições e Perguntas em Aberto

- Suposição confirmada com o usuário: pra ícones sem equivalente exato
  na versão gratuita (chave de boca, seta pra direita, pacote,
  triângulo de alerta, entre outros), usar o ícone mais próximo
  disponível é aceitável, em vez de manter duas bibliotecas ou pagar
  pela versão Pro.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
