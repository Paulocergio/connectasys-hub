# Especificação — Impressão da Ordem de Serviço

> **Revisão 2026-09-13** (pedido do usuário): o documento impresso hoje
> mostra data/hora + título ("13/09/2026, 11:07 ConnectaSys") no topo e
> a URL ("localhost:8080/ordens-servico" / "localhost") no rodapé — é o
> cabeçalho/rodapé padrão do navegador, não algo que o app desenha (ver
> "Limitação conhecida" abaixo). Junto, pedido geral de deixar a tela/
> documento "mais formatada" (resolvido — seções com espaçamento no
> documento impresso).
>
> **Revisão 2026-09-13 (correção do usuário):** a primeira tentativa de
> resolver a limitação abaixo foi um texto de orientação na tela
> ("desmarque Cabeçalhos e rodapés...") — o usuário pediu
> explicitamente pra tirar, não quer esse tipo de aviso na interface.
> Removido. A limitação continua existindo (é do navegador, não tem
> solução por CSS/JS), só que agora sem nenhuma UI tentando explicá-la
> — ver Fora de Escopo.

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
- **(Revisão 2026-09-13)** O documento impresso tem hierarquia visual
  clara — seções bem separadas (dados da OS, cliente/veículo,
  diagnóstico/solução, itens, totais, assinatura), com espaçamento e
  tipografia consistentes, não uma lista corrida de campos.

## Limitação conhecida — cabeçalho/rodapé do navegador (fora de escopo)

O texto "13/09/2026, 11:07 ConnectaSys" no topo e "localhost:8080/
ordens-servico" / "localhost" no rodapé **não são desenhados pelo
sistema** — são o cabeçalho/rodapé padrão que o próprio Chrome (e a
maioria dos navegadores) imprime em cima de qualquer página, contendo
data/hora + título da aba, e URL + número da página. Não existe CSS ou
JavaScript que consiga suprimir isso de dentro da página impressa —
é uma opção do diálogo de impressão do navegador ("Mais configurações"
→ desmarcar "Cabeçalhos e rodapés"), controlada pelo usuário a cada
impressão.

**Decidido (correção do usuário):** o sistema não vai tentar orientar
o usuário sobre isso na interface — nem texto explicativo, nem link,
nada. Fica documentado aqui como limitação conhecida da plataforma
(fora do controle do app), sem nenhuma UI associada.
