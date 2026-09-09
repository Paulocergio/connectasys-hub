# Especificação: Perfis de Acesso (Controle de Permissão)

**Pasta:** `specs/perfis-de-acesso/` · **Status:** aprovado
**Data:** 2026-09-08 · **Fase seguinte:** `/planejar perfis-de-acesso`

> A escolha do papel do usuário (Admin/Mecânico/Recepcionista/
> Financeiro) já existe como campo fixo — ver
> `specs/perfis-usuario/spec.md`, que cobria só essa parte e
> explicitamente deixava "qualquer controle de acesso/permissão
> baseado em papel" fora de escopo. Esta spec cobre exatamente esse
> controle de acesso.

## 1. Visão Geral

Até aqui, qualquer usuário autenticado conseguia navegar e agir em
qualquer módulo do sistema, independente do seu papel. Cada papel deve
passar a ver e operar só os módulos da sua função:

- **Admin**: acesso total.
- **Mecânico**: acesso somente a Ordens de Serviço.
- **Recepcionista**: acesso somente a Veículos e Ordens de Serviço.
- **Financeiro**: acesso somente a Contas a Pagar e Contas a Receber.

## 2. Cenários de Uso

### Cenário 1: Menu reflete o perfil
- **Dado** um usuário logado com um papel específico
- **Quando** ele olha o menu lateral
- **Então** só aparecem os módulos permitidos pro papel dele, mais o
  Dashboard

### Cenário 2: Acesso direto por URL sem permissão
- **Dado** um usuário logado como Mecânico
- **Quando** ele digita a URL de um módulo fora do seu perfil (ex.:
  Contas a Pagar)
- **Então** ele é redirecionado pro Dashboard, sem ver a tela

### Cenário 3: Ação de escrita fora do perfil
- **Dado** um usuário de um perfil sem permissão sobre um módulo
- **Quando** uma tentativa de criar, editar ou excluir um registro
  desse módulo chega na API (por qualquer meio, não só pela tela)
- **Então** a ação é recusada

### Cenário 4: Admin sem restrição
- **Dado** um usuário Admin
- **Quando** ele navega pelo sistema
- **Então** todos os módulos e ações continuam disponíveis, sem
  mudança de comportamento

### Cenário 5: Dashboard como resumo geral
- **Dado** qualquer usuário autenticado, de qualquer perfil
- **Quando** ele acessa o Dashboard
- **Então** ele consegue ver o resumo operacional normalmente — o
  Dashboard não é um módulo restrito por perfil

## 3. Requisitos Funcionais

- **RF-01:** O menu de navegação deve mostrar apenas os módulos
  permitidos para o papel do usuário logado.
- **RF-02:** Acessar diretamente a URL de um módulo sem permissão deve
  redirecionar para o Dashboard.
- **RF-03:** Criar, editar ou excluir um registro de um módulo deve ser
  recusado se o papel do usuário não tiver permissão sobre aquele
  módulo, independente de como a ação chegou até o sistema.
- **RF-04:** O Dashboard deve continuar acessível a qualquer perfil
  autenticado.

## 4. Fora de Escopo

- Restringir a **leitura** (visualização de dados) de módulos fora do
  perfil — decisão consciente, já que o Dashboard soma dados de todos
  os módulos e nenhum perfil não-Admin tem acesso a todos eles. Travar
  leitura exigiria também redesenhar o Dashboard pra esconder cards por
  perfil, o que não fazia parte do pedido original.
- Acesso a Clientes, Estoque e Usuários para papéis além de Admin — não
  foram citados para nenhum dos outros três perfis no pedido original.
- Múltiplos papéis por usuário.

## 5. Suposições e Perguntas em Aberto

- Suposição confirmada com o usuário: leitura de dados via API
  continua aberta a qualquer usuário autenticado (só escrita é
  restrita por perfil), pelo motivo descrito em "Fora de Escopo".

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
