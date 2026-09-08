# Especificação — Impressão da Ordem de Serviço

## Objetivo

Permitir que o usuário imprima uma Ordem de Serviço (OS) a partir da tela
de Ordens de Serviço, gerando um documento com os dados da OS pronto para
ser entregue/assinado pelo cliente ou arquivado pela oficina.

## Contexto / Motivação

Hoje a única forma de "levar a OS pro papel" é copiar os dados
manualmente. A oficina precisa de um documento físico para:

- o cliente assinar aprovando o serviço/os valores;
- anexar ao veículo durante o reparo;
- arquivo da oficina.

## Escopo

- Botão "Imprimir" na listagem de Ordens de Serviço (ação por linha),
  abrindo o diálogo de impressão do navegador com um documento formatado
  da OS selecionada.
- O documento impresso contém: identificação da OS (número, status,
  datas), dados do cliente e do veículo, técnico responsável, descrição
  do problema/diagnóstico/solução, lista de peças e serviços (itens) com
  valores, mão de obra, desconto e valor total, e um campo para
  assinatura do cliente.
- Fora de escopo: geração de PDF sem o diálogo do navegador, envio por
  e-mail/WhatsApp, e dados de cabeçalho da oficina (nome, CNPJ, logo) —
  não existe hoje um cadastro desses dados no sistema.

## Critérios de aceite

- Ao clicar em "Imprimir" numa OS da listagem, o navegador abre o
  diálogo de impressão já com o conteúdo da OS formatado, sem o menu
  lateral do sistema.
- O documento é legível em papel branco mesmo com o tema escuro ativo na
  tela.
- Cancelar a impressão não deixa a tela em um estado inconsistente.
