---
description: Quebra o design.md de uma feature em uma lista ordenada de tarefas (tasks.md)
argument-hint: <slug da feature, ex. landingpage>
---

Você está na fase **Tarefas** do fluxo SDD deste projeto. Leia
`specs/constitution.md` antes de continuar (é imutável) — em especial o
Artigo VI (qualidade de código) e o Artigo V (cores).

Feature alvo: $ARGUMENTS

Faça o seguinte, em ordem:

1. Localize `specs/{slug}/design.md`. Se não existir, pare e avise o
   usuário a rodar `/planejar` primeiro.
2. Copie `.claude/templates/tasks-template.md` para
   `specs/{slug}/tasks.md`.
3. Gere tarefas (`T001`, `T002`, ...) cobrindo todo o design: cada rota,
   componente, tipo de dado mock e integração descritos em `design.md`
   vira uma ou mais tarefas. Cada tarefa deve:
   - Ser pequena o suficiente para completar e verificar isoladamente.
   - Listar o(s) arquivo(s) que ela cria ou altera.
   - Ter um critério de pronto verificável (não "implementar X", e sim
     "X renderiza sem erro e cobre o cenário Y da spec").
   - Declarar dependência de outra tarefa quando a ordem importar
     (ex.: tipo de dado mock antes do componente que o usa).
4. Ordene as tarefas respeitando as dependências declaradas.
5. Preencha a seção "Verificação Final" do template sem alterá-la
   estruturalmente.
6. Ao terminar, mostre a lista de tarefas ao usuário e informe o próximo
   passo: `/implementar {slug}`.

Não implemente nenhuma tarefa nesta fase.
