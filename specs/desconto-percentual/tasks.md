# Tarefas: Desconto da OS em Percentual

**Pasta:** `specs/desconto-percentual/` · **Design:** `specs/desconto-percentual/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

- [x] **T001** — API: fórmula percentual no cálculo de valor total
  - Arquivo(s): `OrdemServicoDto.cs`, `UpdateOrdemServicoHandler.cs`,
    `AddItemOrdemServicoHandler.cs`, `RemoveItemOrdemServicoHandler.cs`
  - Critério de pronto: os 4 lugares calculam o mesmo valor pra mesma
    OS

- [x] **T002** — API: `Math.Clamp` no criar/atualizar OS
  - Arquivo(s): `CreateOrdemServicoHandler.cs`,
    `UpdateOrdemServicoHandler.cs`
  - Depende de: T001
  - Critério de pronto: desconto fora de 0-100 é travado no limite mais
    próximo

- [x] **T003** — Migração de dado: zerar desconto das OS de teste
      existentes
  - Arquivo(s): nenhum (ação direta no banco, combinada com o usuário)
  - Depende de: T001
  - Critério de pronto: OS #20 e #21 com desconto = 0 antes de subir a
    mudança

- [x] **T004** — Frontend: máscara de percentual + impressão
  - Arquivo(s): `src/routes/_app.ordens-servico.tsx`
  - Depende de: T001
  - Critério de pronto: campo aceita 0-100%, impressão mostra
    percentual + valor em R$

## Verificação Final

- [x] `dotnet build` e `npm run build` sem erros novos
- [x] Testado com dado real: 10% aplicado numa OS de teste, valor
      persistido corretamente
- [ ] Impressão com desconto testada visualmente — pendente confirmação
      do usuário
