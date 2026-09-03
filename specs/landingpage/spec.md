# Especificação: Landing Page

**Pasta:** `specs/landingpage/` · **Status:** retroativa (feature já existe no código)
**Data:** 2026-09-01 · **Fase seguinte:** `/planejar landingpage` (se houver nova alteração)

> Esta spec foi escrita de forma retroativa, documentando o que já existe
> em `src/routes/index.tsx`, para servir de base a partir de agora. Toda
> alteração futura na landing page deve passar a seguir o fluxo normal
> (spec → design → tasks) a partir daqui.

## 1. Visão Geral

A landing page é a porta de entrada pública do ConnectaSys: precisa
explicar o produto (gestão de oficina mecânica), mostrar os módulos
disponíveis, apresentar os planos de preço e converter o visitante em
cadastro (`/auth?tab=cadastro`) ou login (`/auth`).

## 2. Cenários de Uso

### Cenário 1: Visitante decide começar um teste
- **Dado** um visitante que chega na landing page
- **Quando** ele lê o hero e clica em "Começar teste de 14 dias"
- **Então** é levado para `/auth` com a aba de cadastro já selecionada

### Cenário 2: Visitante já é cliente
- **Dado** um visitante que já tem conta
- **Quando** ele clica em "Entrar" (no header) ou "Já sou cliente" (no hero)
- **Então** é levado para `/auth` na aba de login

### Cenário 3: Visitante avalia os planos
- **Dado** um visitante navegando a seção de planos
- **Quando** ele compara os 3 planos (Box, Oficina, Rede)
- **Então** consegue ver preço, itens incluídos e qual é o mais popular,
  e pode clicar em "Assinar" em qualquer um deles

### Cenário 4: Visitante tira uma dúvida
- **Dado** um visitante na seção de perguntas frequentes
- **Quando** ele clica em uma pergunta
- **Então** a resposta expande/recolhe (accordion), sem navegar pra outra página

## 3. Requisitos Funcionais

- **RF-01:** A página deve exibir um hero com título, subtítulo, dois
  botões de ação (cadastro e login) e estatísticas de credibilidade
  (número de oficinas ativas, OS emitidas, satisfação).
- **RF-02:** A página deve exibir uma prévia visual do produto (mock da
  tela de ordens de serviço) logo abaixo do hero.
- **RF-03:** A página deve exibir uma faixa rolando com nomes de oficinas
  (prova social).
- **RF-04:** A página deve listar os módulos do sistema (Ordens de
  Serviço, Agenda, Estoque, Financeiro, Clientes, Indicadores), cada um
  com ícone, título e descrição.
- **RF-05:** A página deve exibir os 3 planos de preço (Box, Oficina,
  Rede) com preço mensal, itens inclusos e destaque visual para o plano
  mais popular.
- **RF-06:** A página deve ter uma seção de perguntas frequentes em
  formato accordion (uma pergunta aberta por vez).
- **RF-07:** A página deve terminar com uma chamada final para ação
  (criar conta) antes do rodapé.
- **RF-08:** Todos os links de ação devem levar a `/auth`, com a aba
  correta pré-selecionada via parâmetro de busca (`tab=cadastro` ou
  padrão/login).

## 4. Requisitos Não Funcionais

- **RNF-01:** A página deve ser responsiva (mobile, tablet, desktop).
- **RNF-02:** Toda cor usada deve vir dos tokens semânticos de
  `src/styles.css` (Artigo V da constituição) — este requisito está
  **violado no código atual** (ver `design.md`, seção "Dívida técnica").

## 5. Fora de Escopo

- Autenticação real, backend ou persistência de dados (todo o sistema
  ainda é mockado, conforme Artigo I da constituição).
- Internacionalização (a página é só em português).

## 6. Suposições e Perguntas em Aberto

- Os números de credibilidade (1.240 oficinas, 380 mil OS, 4,9/5) e os
  nomes de oficina na faixa de prova social são fictícios — não há
  clientes reais ainda.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
