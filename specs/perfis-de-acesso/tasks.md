# Tarefas: Perfis de Acesso (Controle de Permissão)

**Pasta:** `specs/perfis-de-acesso/` · **Design:** `specs/perfis-de-acesso/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

- [x] **T001** — Mapa de permissões
  - Arquivo(s): `src/lib/permissoes.ts`
  - Critério de pronto: `podeAcessar(papel, pagina)` cobre os 8 módulos

- [x] **T002** — Menu lateral filtrado por perfil
  - Arquivo(s): `src/routes/_app.tsx`
  - Depende de: T001
  - Critério de pronto: cada perfil só vê os itens permitidos + Dashboard

- [x] **T003** — Guarda de rota (`beforeLoad`) nas 7 páginas restritas
  - Arquivo(s): `_app.contas-a-pagar.tsx`, `_app.contas-a-receber.tsx`,
    `_app.clientes.tsx`, `_app.veiculos.tsx`, `_app.ordens-servico.tsx`,
    `_app.estoque.tsx`, `_app.usuarios.tsx`
  - Depende de: T001
  - Critério de pronto: URL direta sem permissão redireciona pro
    Dashboard

- [x] **T004** — API: `[Authorize(Roles=...)]` nos métodos de escrita
  - Arquivo(s): `ClientesController.cs`, `EstoqueController.cs`,
    `VeiculosController.cs`, `OrdensServicoController.cs`,
    `ContasPagarController.cs`, `ContasReceberController.cs`
  - Depende de: T001 (mesmo mapa de papéis, espelhado no backend)
  - Critério de pronto: cada `Create`/`Update`/`Delete` exige o(s)
    papel(is) certo(s); leitura continua aberta

## Verificação Final

- [x] `npx tsc --noEmit`, `dotnet build` e `npm run build` sem erros
      novos
- [x] Todas as 8 rotas testadas via `curl`, retornando 200
- [ ] Testado manualmente logando com cada um dos 4 papéis — pendente
      confirmação do usuário
