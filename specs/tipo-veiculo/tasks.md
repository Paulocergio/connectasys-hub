# Tarefas: Tipo de Veículo

**Pasta:** `specs/tipo-veiculo/` · **Design:** `specs/tipo-veiculo/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

- [x] **T001** — API: campo `Tipo` + migration + validação
  - Arquivo(s): `Common/TiposVeiculo.cs`, `Veiculo.cs`,
    `VeiculoConfiguration.cs`, migration `AddTipoToVeiculos`,
    `CreateVeiculo`/`UpdateVeiculo` (Command + Handler)
  - Critério de pronto: migration aplicada, `TipoInvalido` rejeitado
    com 400

- [x] **T002** — API: expor `Tipo` nas queries
  - Arquivo(s): `VeiculoDto.cs`, `GetAllVeiculos`, `GetVeiculoById`,
    `GetVeiculosByClienteId`
  - Depende de: T001
  - Critério de pronto: `GET /api/Veiculos` devolve `tipo`

- [x] **T003** — Frontend: `Select` de tipo no formulário
  - Arquivo(s): `src/routes/_app.veiculos.tsx`
  - Depende de: T002
  - Critério de pronto: formulário exige um dos 4 tipos, "Carro"
    pré-selecionado

- [x] **T004** — Frontend: coluna na tabela + busca por tipo
  - Arquivo(s): `src/routes/_app.veiculos.tsx`
  - Depende de: T003
  - Critério de pronto: coluna "Tipo" visível; busca por "moto" filtra
    corretamente

## Verificação Final

- [x] `dotnet build`, `npx tsc --noEmit` e `npm run build` sem erros
      novos
- [x] Confirmado no banco: veículo existente recebeu "Carro"
      automaticamente
- [ ] Testado manualmente cadastrando um veículo de cada tipo —
      pendente confirmação do usuário
