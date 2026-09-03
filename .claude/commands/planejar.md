---
description: Cria o design técnico (design.md) de uma feature a partir da sua spec.md
argument-hint: <slug da feature, ex. landingpage>
---

Você está na fase **Design** do fluxo SDD deste projeto. Leia
`specs/constitution.md` por inteiro antes de continuar — ela é a
constituição do projeto, é imutável, e este design não pode contradizê-la.

Feature alvo: $ARGUMENTS

Faça o seguinte, em ordem:

1. Localize `specs/{slug}/spec.md` correspondente ao argumento recebido.
   Se não existir, pare e avise o usuário a rodar `/especificar` primeiro
   — não invente uma spec.
2. Leia a spec inteira. Se algo essencial para o design não estiver claro
   na spec (ambiguidade que bloqueia uma decisão técnica), pergunte ao
   usuário antes de prosseguir, em vez de assumir.
3. Explore o código atual relevante (`src/routes`, `src/components`,
   `src/lib`, `src/styles.css`) para entender convenções existentes que a
   nova feature deve seguir. Se o código dessa área parecer ter sido
   alterado por fora do fluxo SDD (ex.: sincronização do Lovable — ver
   Artigo IX da constituição), avise o usuário antes de basear o design
   nesse código.
4. Copie `.claude/templates/design-template.md` para
   `specs/{slug}/design.md` e preencha todas as seções, incluindo a
   **Verificação Constitucional** no topo — marque cada item honestamente,
   com atenção especial ao Artigo V (cores só via tokens semânticos, nunca
   `orange-500` e afins). Se algum item não puder ser marcado, pare e
   reporte o conflito ao usuário em vez de prosseguir silenciosamente.
5. Todo requisito funcional (RF-xx) da spec deve ser rastreável a algo
   concreto no design (rota, componente ou dado). Se algum RF não tiver
   cobertura, corrija o design antes de finalizar.
6. Ao terminar, mostre um resumo curto ao usuário (não o arquivo inteiro),
   incluindo qualquer dependência nova proposta e por quê, e informe o
   próximo passo: `/tarefas {slug}`.

Não escreva `tasks.md` nem código de aplicação nesta fase.
