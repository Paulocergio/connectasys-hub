# Especificação: Conclusão de OS gera Conta a Receber (frontend)

**Pasta:** `specs/aprovacao-os-conta-receber/` · **Status:** aprovado
**Data:** 2026-09-05 · **Fase seguinte:** `/planejar aprovacao-os-conta-receber`

> **Nota:** a pasta manteve o nome original, mas o gatilho mudou depois
> do feedback do usuário na primeira entrega — não é mais uma ação
> dedicada de "Aprovar OS", é a **mudança de status da OS para
> "Concluído"** no fluxo normal de edição. Ver `tasks.md` para o
> histórico. Lado do hub para a feature de backend descrita em
> `specs/aprovacao-os-conta-receber/spec.md` do repositório
> `connectasys_api`.

## 1. Visão Geral

Quando uma Ordem de Serviço é marcada como "Concluído" (no mesmo
formulário de edição que já existe), a API gera automaticamente uma
conta a receber pendente com o valor da OS. Esta spec cobre só as
telas do hub (`_app.ordens-servico.tsx` e `_app.contas-a-receber.tsx`)
— nenhuma ação nova de UI, só refletir o que a API já faz e manter os
campos de aprovação manual (nome/data) como sempre foram.

## 2. Cenários de Uso

### Cenário 1: Concluir uma OS com valor
- **Dado** uma Ordem de Serviço aberta, com mão de obra e/ou itens
- **Quando** o usuário edita a OS, muda o status para "Concluído" e
  salva
- **Então** a OS é salva normalmente e uma nova conta pendente
  aparece em Contas a Receber com o valor total da OS

### Cenário 2: Salvar de novo uma OS já concluída
- **Dado** uma OS que já está com status "Concluído" (e já gerou
  conta a receber)
- **Quando** o usuário edita outro campo (ex.: diagnóstico) e salva,
  sem mudar o status
- **Então** nenhuma conta nova aparece em Contas a Receber

### Cenário 3: Concluir uma OS com valor total zero
- **Dado** uma OS sem mão de obra e sem itens (valor total zero)
- **Quando** o usuário muda o status para "Concluído" e salva
- **Então** a OS é salva normalmente, mas nenhuma conta nova aparece
  em Contas a Receber

### Cenário 4: Excluir uma OS que já gerou conta a receber
- **Dado** uma OS concluída que já gerou uma conta a receber
- **Quando** o usuário exclui essa OS (confirmando a exclusão)
- **Então** a OS some da lista e a conta a receber gerada por ela
  também some de Contas a Receber

### Cenário 5: Ver a origem de uma conta a receber e navegar até a OS
- **Dado** a lista de Contas a Receber, incluindo contas geradas pela
  conclusão de uma OS e contas lançadas manualmente
- **Quando** o usuário olha a lista ou abre uma conta pra editar
- **Então** ele consegue diferenciar visualmente as duas — a conta
  vinda de OS mostra uma referência clicável à OS de origem (ex.: "OS
  #42"), que ao ser clicada leva direto pra tela de Ordens de Serviço
  já com aquela OS aberta pra edição

### Cenário 5a: Cancelar uma OS que já gerou conta a receber
- **Dado** uma OS concluída que já gerou uma conta a receber
- **Quando** o usuário muda o status da OS pra "Cancelado" e salva
- **Então** a conta a receber gerada por ela desaparece de Contas a
  Receber (a OS continua existindo, só cancelada — diferente de
  excluir a OS)

### Cenário 6a: Alterar o valor de uma OS já concluída
- **Dado** uma OS concluída que já gerou uma conta a receber
- **Quando** o usuário edita a mão de obra/desconto da OS (ou
  adiciona/remove um item) e salva
- **Então** a conta a receber gerada por ela é atualizada com o novo
  valor total, sem precisar editar a conta manualmente

### Cenário 6: Editar uma conta a receber vinda de OS
- **Dado** uma conta a receber com origem em OS
- **Quando** o usuário edita normalmente (ex.: registra o recebimento)
- **Então** funciona exatamente igual a uma conta manual — o vínculo
  com a OS é só informativo, não bloqueia nada

## 3. Requisitos Funcionais

- **RF-01:** Nenhuma ação nova de UI é necessária pra gerar a conta —
  o campo "Status" que já existe no formulário de OS é o gatilho.
- **RF-02:** Os campos "Aprovado por (cliente)" e "Data de aprovação"
  continuam existindo no modal de edição de OS, exatamente como antes
  — sem nenhuma relação com a geração da conta a receber.
- **RF-03:** Depois de salvar uma OS que mudou pra "Concluído", tanto
  a lista de Ordens de Serviço quanto a de Contas a Receber devem
  refletir a mudança sem precisar de recarregar a página manualmente.
- **RF-04:** Na lista e no modal de Contas a Receber, uma conta que
  tem OS de origem exibe essa referência (ex.: "OS #42") de forma
  visível e **clicável**, distinguindo-a de uma conta lançada
  manualmente. Clicar navega pra tela de Ordens de Serviço com a OS
  correspondente já aberta pra edição.
- **RF-05:** Quando o usuário está editando uma OS já concluída, uma
  mensagem informativa (não bloqueante) indica que a conclusão gera
  conta a receber automaticamente, para deixar o comportamento
  explícito.
- **RF-06:** Depois de editar mão de obra/desconto ou adicionar/
  remover item de uma OS já concluída, a lista de Contas a Receber
  deve refletir o novo valor sem precisar recarregar a página
  manualmente.
- **RF-07:** Depois de cancelar uma OS que tinha conta a receber
  vinculada, a lista de Contas a Receber deve refletir a remoção sem
  precisar recarregar a página manualmente.

## 4. Requisitos Não Funcionais

- **RNF-01:** Textos de UI em português, consistentes com o resto do
  hub.

## 5. Fora de Escopo

- Editar o valor ou os dados da conta a receber gerada automaticamente
  a partir da tela de Ordens de Serviço — depois de criada, ela é
  editada normalmente pela própria tela de Contas a Receber.
- Qualquer mudança em Contas a Pagar — esta feature é só do lado
  Receber.
- Mostrar, na tela de Ordens de Serviço, o status de pagamento da
  conta a receber gerada (ex.: se já foi paga).
- Qualquer ação/UI de "aprovar" — os campos de aprovação manual não
  fazem parte desta feature (nunca fizeram, ficam como estavam antes).

## 6. Suposições e Perguntas em Aberto

- Suposição: o valor total exibido para a OS (mão de obra + itens −
  desconto) já calculado hoje na tela é o mesmo valor que a API vai
  usar pra gerar a conta a receber — a tela não recalcula nada, só
  reflete o que a API retorna.
- Decidido: se a OS concluída tiver valor total zero, nenhuma conta a
  receber é criada (comportamento do backend) — a tela não precisa de
  tratamento especial pra esse caso.
- Decidido: excluir uma OS remove a conta a receber vinculada — a
  tela só precisa invalidar a query de Contas a Receber depois de uma
  exclusão de OS bem-sucedida, sem lógica adicional.

## Checklist de Qualidade da Spec

- [x] Nenhum termo de implementação (nome de lib, componente, rota, tabela)
- [x] Todo requisito funcional é testável
- [x] Cenários cobrem o caminho feliz e pelo menos um caso de borda
- [x] Seção "Fora de escopo" preenchida
- [x] Suposições/perguntas em aberto foram revisadas com o usuário
