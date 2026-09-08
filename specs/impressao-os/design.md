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
