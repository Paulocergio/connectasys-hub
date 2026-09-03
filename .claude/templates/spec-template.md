# Especificação: {NOME_DA_FEATURE}

**Pasta:** `specs/{slug}/` · **Status:** rascunho
**Data:** {DATA} · **Fase seguinte:** `/planejar {slug}`

> Esta especificação descreve **o quê** e **por quê**. Não contém nomes de
> componentes, bibliotecas, rotas ou qualquer decisão técnica — isso é
> assunto do design (`design.md`).

## 1. Visão Geral

{1-3 parágrafos: qual problema esta feature resolve, para quem, e por quê
agora. Escrito para alguém que não conhece o código do projeto.}

## 2. Cenários de Uso

Para cada cenário, descrever o fluxo do ponto de vista do usuário:

### Cenário 1: {nome curto}
- **Dado** {contexto/estado inicial}
- **Quando** {ação do usuário}
- **Então** {resultado esperado}

### Cenário 2: {nome curto}
- **Dado** ...
- **Quando** ...
- **Então** ...

## 3. Requisitos Funcionais

Cada requisito deve ser testável e sem ambiguidade.

- **RF-01:** O sistema deve {...}
- **RF-02:** O sistema deve {...}
- **RF-03:** O sistema deve {...}

## 4. Requisitos Não Funcionais

- **RNF-01:** {desempenho, acessibilidade, responsividade, etc., se aplicável}

## 5. Fora de Escopo

- {O que esta feature explicitamente NÃO cobre, para evitar scope creep na fase de design}

## 6. Suposições e Perguntas em Aberto

- {Suposição assumida por falta de informação — deve ser confirmada antes do design}
- {Pergunta que precisa de resposta do usuário}

## Checklist de Qualidade da Spec

- [ ] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [ ] Todo requisito funcional é testável
- [ ] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [ ] Seção "Fora de escopo" preenchida
- [ ] Suposições/perguntas em aberto foram revisadas com o usuário
