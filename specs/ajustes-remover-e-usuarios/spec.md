# Especificação: Botão de Remover Vermelho e Gestão de Usuário Restrita

**Pasta:** `specs/ajustes-remover-e-usuarios/` · **Status:** aprovado
**Data:** 2026-09-08 · **Fase seguinte:** `/planejar ajustes-remover-e-usuarios`

## 1. Visão Geral

Dois ajustes de usabilidade reportados pelo usuário:

1. O botão de confirmar exclusão não estava saindo vermelho em nenhuma
   tela do sistema.
2. Um usuário sem permissão de Admin conseguia clicar em editar/excluir
   usuário e só descobria que não podia depois de um erro — a ação
   deveria nem aparecer disponível pra ele.

## 2. Cenários de Uso

### Cenário 1: Confirmar exclusão
- **Dado** um usuário confirmando a remoção de qualquer registro do
  sistema (usuário, cliente, veículo, OS, peça, conta)
- **Quando** o diálogo de confirmação aparece
- **Então** o botão de confirmar remoção é vermelho

### Cenário 2: Tela de Usuários sem permissão de Admin
- **Dado** um usuário logado sem papel Admin
- **Quando** ele abre a tela de Usuários
- **Então** ele vê a lista, mas não vê os botões de criar, editar ou
  excluir usuário

### Cenário 3: Tela de Usuários com permissão de Admin
- **Dado** um usuário logado como Admin
- **Quando** ele abre a tela de Usuários
- **Então** ele vê normalmente os botões de criar, editar e excluir

## 3. Requisitos Funcionais

- **RF-01:** O botão de confirmar exclusão deve ser vermelho em
  qualquer diálogo de confirmação do sistema.
- **RF-02:** A tela de Usuários deve esconder as ações de
  criar/editar/excluir para quem não tem papel Admin.

## 4. Fora de Escopo

- Mudar quem pode gerenciar usuários — continua sendo só Admin, essa
  spec só faz a tela refletir isso antes do clique.

## 5. Suposições e Perguntas em Aberto

- Nenhuma — o comportamento de permissão em si (só Admin gerencia
  usuário) já existia na API antes desta correção; só a UI não
  refletia.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
