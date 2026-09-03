---
description: Cria a especificação (spec.md) de uma nova feature seguindo o fluxo SDD do projeto
argument-hint: <descrição em linguagem natural da feature>
---

Você está na fase **Especificar** do fluxo SDD deste projeto. Leia
`specs/constitution.md` (Artigos I, III e VII) antes de continuar — ela é
a constituição do projeto e é imutável.

Pedido do usuário para esta feature: $ARGUMENTS

Faça o seguinte, em ordem:

1. Gere um `slug` curto em português, minúsculo, sem espaço nem acento
   (ex.: `landingpage`, `crud-usuarios`) a partir da descrição do usuário.
   Se `specs/{slug}/` já existir, pergunte ao usuário se é pra continuar a
   feature existente ou escolher outro nome.
2. Se a descrição do usuário for vaga demais para escrever requisitos
   testáveis, faça no máximo 2-3 perguntas objetivas antes de escrever a
   spec — não invente requisitos importantes.
3. Copie `.claude/templates/spec-template.md` para
   `specs/{slug}/spec.md` e preencha todas as seções. **Não** inclua
   nenhuma decisão técnica (nomes de componentes, rotas, bibliotecas,
   estrutura de dados) — isso pertence à fase de design.
4. Escreva os requisitos funcionais (RF-xx) de forma testável e sem
   ambiguidade. Preencha "Fora de escopo" mesmo que pareça óbvio.
5. Marque a checklist de qualidade da spec no final do arquivo, item por
   item — só marque o que de fato está satisfeito.
6. Ao terminar, mostre ao usuário um resumo curto (não o arquivo inteiro)
   e informe o caminho do arquivo criado e o próximo passo:
   `/planejar {slug}`.

Não crie `design.md` ou `tasks.md` nesta fase, mesmo que pareça óbvio como
implementar. Não escreva nenhum código de aplicação.
