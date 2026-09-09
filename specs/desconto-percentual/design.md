# Design: Desconto da OS em Percentual

**Pasta:** `specs/desconto-percentual/` · **Spec:** `specs/desconto-percentual/spec.md`
**Status:** aprovado · **Fase seguinte:** `/tarefas desconto-percentual`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Não introduz cor nova
- [x] Textos de UI em português

## 2. Resumo da Abordagem

O campo `Desconto` da entidade `OrdemServico` (API) muda de semântica
(continua `decimal`, mesma coluna — não é valor monetário, passa a ser
percentual 0-100). O cálculo de valor total, que existia duplicado em
4 handlers diferentes da API, é corrigido nos 4 lugares pra usar a
fórmula percentual. No frontend, o campo de desconto troca a máscara de
dinheiro por uma máscara de percentual, e a impressão passa a derivar o
valor em reais do desconto a partir do total já calculado pela API.

## 3. Rotas e Telas

Nenhuma rota nova — mudança em `/ordens-servico`.

## 4. Componentes

Nenhum componente novo.

## 5. Modelo de Dados

`OrdemServico.Desconto` (API): `decimal`, 0–100, mesma coluna
`decimal(10,2)` — sem migration. Fórmula:

```
subtotal = valorMaoDeObra + soma(itens)
valorTotal = subtotal - subtotal * desconto / 100
```

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** `Math.Clamp(desconto, 0, 100)` nos handlers de criar e
  atualizar OS, como defesa mesmo que o front não seja a única forma de
  chamar a API.
- **Decisão registrada com o usuário:** 2 Ordens de Serviço no banco de
  dev tinham desconto em R$ antes da mudança (ex.: R$50 sobre uma OS de
  R$32.323,23). Reinterpretar como percentual mudaria o total
  drasticamente (50% em vez de R$50). Os dois registros foram zerados
  manualmente no banco antes de subir a mudança.
- **Risco:** a fórmula de valor total estava duplicada em `Update`,
  `AddItem`, `RemoveItem` de item e no DTO — os 4 lugares precisam ficar
  sincronizados se a regra mudar de novo no futuro.

## 8. Estratégia de Verificação

- `dotnet build` e `npm run lint` limpos.
- Testar manualmente: aplicar 10% de desconto numa OS de R$1.000 e
  confirmar total de R$900; tentar digitar mais de 100% e confirmar que
  trava; imprimir e conferir que mostra o percentual e o valor em R$.
- **Verificado nesta rodada:** desconto de 10% aplicado numa OS real de
  teste, valor persistido corretamente no banco.
