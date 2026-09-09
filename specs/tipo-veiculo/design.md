# Design: Tipo de Veículo

**Pasta:** `specs/tipo-veiculo/` · **Spec:** `specs/tipo-veiculo/spec.md`
**Status:** aprovado · **Fase seguinte:** `/tarefas tipo-veiculo`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV
- [x] Não introduz cor nova
- [x] Textos de UI em português

## 2. Resumo da Abordagem

Campo novo `Tipo` na entidade `Veiculo` (API), com valores fixos
validados (`Carro`/`Moto`/`Caminhão`/`Outros`) no mesmo padrão já usado
pra `Roles`/`StatusOrdemServico`. No frontend, um `Select` no formulário
de veículo e uma coluna nova na tabela.

## 3. Rotas e Telas

Nenhuma rota nova — mudança em `/veiculos`.

## 4. Componentes

Nenhum componente novo — `Select` já usado em outras telas.

## 5. Modelo de Dados

```ts
// src/routes/_app.veiculos.tsx
const TIPOS_VEICULO = ["Carro", "Moto", "Caminhão", "Outros"] as const;
type TipoVeiculo = (typeof TIPOS_VEICULO)[number];
```

API: `Veiculo.Tipo` (string, default `"Carro"`), coluna
`varchar(20)`, migration `AddTipoToVeiculos`.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** validação do tipo tanto no frontend (`Select` sem opção
  de texto livre) quanto no backend (`TiposVeiculo.EhValido`), pra não
  depender só da tela como única forma de gravar um valor inválido.
- **Risco:** nenhum — coluna nova com `HasDefaultValue`, veículos
  existentes recebem o padrão automaticamente ao aplicar a migration.

## 8. Estratégia de Verificação

- `dotnet build` e `npm run lint` limpos.
- Testar manualmente: cadastrar um veículo de cada tipo; confirmar que
  um veículo cadastrado antes da migration aparece como "Carro"; testar
  a busca digitando "moto".
- **Verificado nesta rodada:** migration aplicada no banco de dev,
  veículo existente recebeu "Carro" automaticamente (confirmado direto
  na tabela).
