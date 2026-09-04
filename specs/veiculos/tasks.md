# Tarefas: Veículos

**Pasta:** `specs/veiculos/` · **Design:** `specs/veiculos/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar veiculos`

- [ ] **T001** — Criar `src/routes/_app.veiculos.tsx`: listagem (tabela
      com placa, marca, modelo, ano, cor, nome do cliente) + busca por
      placa/marca/modelo, via `useQuery` em `/api/Veiculos` e
      `/api/Clientes`
  - Arquivo(s): `src/routes/_app.veiculos.tsx`
  - Critério de pronto: lista carrega da API real, coluna de cliente
    mostra o nome (não o id); `npm run lint` limpo

- [ ] **T002** — Adicionar modal de criar/editar (`Dialog` +
      `useMutation` para `POST`/`PUT`), com `Select` de cliente e
      campos placa, marca, modelo, ano, cor
  - Arquivo(s): `src/routes/_app.veiculos.tsx`
  - Depende de: T001
  - Critério de pronto: criar e editar refletem na lista e no Swagger
    (`GET /api/Veiculos`); sem cliente cadastrado, o formulário avisa e
    bloqueia o salvar (Cenário 7 da spec)

- [ ] **T003** — Adicionar remoção (`AlertDialog` de confirmação +
      `useMutation` para `DELETE`)
  - Arquivo(s): `src/routes/_app.veiculos.tsx`
  - Depende de: T001
  - Critério de pronto: remover reflete na lista e no Swagger

- [ ] **T004** — Registrar a rota no menu lateral (`_app.tsx`, array
      `itens`), com ícone (`lucide-react`, `Car`)
  - Arquivo(s): `src/routes/_app.tsx`
  - Depende de: T001
  - Critério de pronto: item aparece no menu, navega pra tela

- [ ] **T005** — Testar manualmente os 7 cenários da `spec.md` com a
      API local rodando (`https://localhost:7074`)
  - Arquivo(s): nenhum (verificação)
  - Depende de: T001, T002, T003, T004

## Verificação Final

- [ ] `npm run lint` sem erros
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente em
      `npm run dev`
- [ ] Nenhum item da checklist constitucional do design ficou pendente
- [ ] Nenhuma cor Tailwind literal foi introduzida fora dos tokens
      semânticos
