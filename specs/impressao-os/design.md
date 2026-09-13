# Design — Impressão da Ordem de Serviço

## Componentes afetados

- `src/routes/_app.ordens-servico.tsx`: novo botão "Imprimir" (ícone
  `Printer`) nas ações da linha da tabela; novo estado
  `imprimir: OrdemServicoApi | null`; bloco de conteúdo imprimível
  (visível só em `@media print`) renderizado condicionalmente com os
  dados da OS selecionada.
- `src/routes/_app.tsx`: `<aside>` (menu lateral) ganha a classe
  `print:hidden` para não sair na impressão.
- `src/styles.css`: bloco `@media print` sobrescrevendo as variáveis de
  tema (`:root`) com os mesmos valores do tema claro (`.light`),
  garantindo impressão legível em papel independente do tema ativo na
  tela; regra `@page` com margem.

## Fluxo

1. Usuário clica no ícone de impressora na linha da OS.
2. `imprimir` recebe a OS clicada.
3. `useEffect` dispara `window.print()` assim que `imprimir` é definido,
   e escuta o evento `afterprint` para limpar o estado
   (`imprimir = null`) — cobre tanto impressão confirmada quanto
   cancelada.
4. O restante da tela (título, busca, tabela, diálogos) fica marcado
   como `print:hidden`; o bloco imprimível fica `hidden print:block`,
   então só ele aparece na pré-visualização/impressão.

## Dados exibidos no documento

Usa os dados já carregados na página (sem chamada de API nova): número
da OS, status, data de abertura/previsão/conclusão, nome do cliente,
placa/marca/modelo do veículo, nome do técnico (se houver), descrição
do problema, diagnóstico, solução, itens (descrição/quantidade/valor
unitário/subtotal), mão de obra, desconto, valor total, aprovação do
cliente (nome/data, se preenchidos) e uma linha de assinatura do
cliente.

## Riscos

- Nenhuma dependência nova; usa `window.print()` nativo do navegador.
- Diálogos abertos (Radix `Portal`, `Dialog`/`AlertDialog`) não são
  afetados: só renderizam quando `open=true`, e a impressão é
  disparada a partir da linha da tabela, não de dentro de um diálogo
  aberto.

## Revisão 2026-09-13 — formatação e cabeçalho/rodapé do navegador

### Formatação do documento

O bloco `hidden print:block` ganha seções com `<h2>`/`<h3>` e
espaçamento (`space-y-*`, bordas leves `border-border` entre seções)
em vez de campos soltos: (1) cabeçalho da OS (número, status, data de
abertura), (2) cliente/veículo, (3) diagnóstico/solução, (4) tabela de
itens, (5) totais (mão de obra, desconto, valor total), (6) aprovação/
assinatura. Mesmos tokens semânticos do Artigo V (o bloco já roda sob
o override de tema claro do `@media print` existente).

### Cabeçalho/rodapé do navegador — não é resolvível via CSS

Testado: `@page { margin: ... }` controla só a margem do **conteúdo**
da página impressa, não o cabeçalho/rodapé que o Chrome desenha por
cima dele — esse texto (data/hora + título da aba no topo, URL +
paginação no rodapé) é renderizado pelo processo do navegador, fora do
DOM da página, especificamente pra não poder ser manipulado por
JavaScript/CSS de terceiros (mesma razão pela qual sites não conseguem
forjar o que aparece ali). Não existe workaround client-side
confiável e multi-navegador pra isso.

**Encaminhamento (revisado):** a primeira versão adicionava um
parágrafo de orientação na tela sobre desmarcar "Cabeçalhos e
rodapés" — o usuário pediu explicitamente pra remover, não quer esse
tipo de aviso na interface. Removido por completo. Fica só como
limitação conhecida documentada aqui e no `spec.md`, sem nenhuma UI
tentando contornar ou explicar — se o usuário quiser um documento sem
esse cabeçalho/rodapé, a única forma continua sendo desmarcar a opção
manualmente no diálogo do navegador (fora do controle do sistema).
