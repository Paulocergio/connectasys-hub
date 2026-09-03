---
description: Implementa as tarefas de tasks.md de uma feature, em ordem, marcando cada uma como concluída
argument-hint: <slug da feature, ex. landingpage> [ID da tarefa, opcional]
---

Você está na fase **Implementar** do fluxo SDD deste projeto. Leia
`specs/constitution.md` por inteiro antes de continuar — ela é imutável e
toda implementação deve respeitá-la, especialmente os Artigos II, IV, V,
VI e VIII (aprovação prévia e execução tarefa por tarefa).

Feature alvo (e opcionalmente uma tarefa específica): $ARGUMENTS

Faça o seguinte, em ordem:

1. Localize `specs/{slug}/tasks.md`. Se não existir, pare e avise o
   usuário a rodar `/tarefas` primeiro.
2. Se o argumento incluir um ID de tarefa específico (ex. `T003`), o alvo
   é só essa. Caso contrário, o alvo é a lista de tarefas não marcadas,
   na ordem do arquivo, respeitando as dependências declaradas.
3. **Antes de implementar qualquer coisa**, mostre ao usuário a lista de
   tarefas que você vai executar nesta rodada (ID + descrição curta de
   cada uma, na ordem em que serão feitas) e peça aprovação explícita.
   Não escreva nem altere nenhum arquivo de código antes dessa aprovação.
4. Depois que o usuário aprovar, implemente **uma tarefa por vez**, nunca
   todas de uma vez:
   - Implemente exatamente o que a tarefa descreve, nada além disso
     (Artigo VI: sem abstração prematura, sem escopo extra).
   - Siga as convenções de código já usadas no repositório (ver arquivos
     vizinhos em `src/`).
   - Use só os tokens semânticos de cor definidos em `src/styles.css`
     (Artigo V) — nunca `orange-500`, `violet-600` ou qualquer cor
     Tailwind literal.
   - Verifique o critério de pronto da tarefa antes de marcá-la.
   - Marque a tarefa como `[x]` em `tasks.md` somente depois de verificada.
   - Ao terminar essa tarefa, pare e mostre o resultado ao usuário antes
     de seguir para a próxima da lista aprovada — não emende a próxima
     tarefa em sequência sem essa pausa.
5. Depois que todas as tarefas aprovadas nesta rodada estiverem
   implementadas, rode `npm run lint` e corrija o que ele apontar.
6. Se a mudança afeta a UI, rode `npm run dev` (se não estiver rodando) e
   verifique visualmente os cenários da `spec.md` correspondente antes de
   dar a tarefa por concluída.
7. Marque a "Verificação Final" em `tasks.md` conforme cada item for
   confirmado.
8. Se, durante a implementação, você perceber que o design ou a spec estão
   errados ou incompletos, pare e avise o usuário em vez de improvisar
   uma solução divergente — a implementação não deve se desviar do que foi
   planejado sem que o usuário saiba.
9. Ao terminar, resuma o que foi implementado e o estado de `tasks.md`
   (quantas tarefas concluídas / restantes).
