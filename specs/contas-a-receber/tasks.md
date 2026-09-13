# Tarefas: Contas a Receber

**Pasta:** `specs/contas-a-receber/` · **Design:** `specs/contas-a-receber/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar contas-a-receber`

- [x] **T001** — Criar `src/routes/_app.contas-a-receber.tsx`: listagem
      (tabela com cliente, descrição, valor formatado em R$, vencimento,
      badge de status) + busca por descrição/nome de cliente, via
      `useQuery` em `/api/ContasReceber` e `/api/Clientes` (para resolver
      `clienteId → nome`, com fallback `"Cliente #{id}"` se não
      encontrado)
  - Arquivo(s): `src/routes/_app.contas-a-receber.tsx`
  - Critério de pronto: lista carrega da API real, mostrando o nome do
    cliente (não o `clienteId` cru); `npm run lint` limpo (confirmado, 0
    erros)
  - Confirmado por fora do navegador (extensão Claude in Chrome não
    conectada nesta sessão): `GET http://localhost:8082/contas-a-receber`
    → `200`, sem exceção de SSR; `GET
    https://localhost:7074/api/ContasReceber` e `.../api/Clientes` com
    `Origin: http://localhost:8082` → `200`, CORS ok (banco sem contas
    ainda, lista vazia). **Renderização real da tabela/estados de
    loading/erro não verificada visualmente** — precisa de teste manual
    do usuário ou reconexão da extensão (mesma limitação registrada em
    `contas-a-pagar/tasks.md`, T005).

- [x] **T002** — Adicionar modal de criar/editar (`Dialog` +
      `useMutation` para `POST`/`PUT`), com campos cliente (`Select`
      populado por `/api/Clientes`), descrição, valor, vencimento e (só
      na edição) data de recebimento
  - Arquivo(s): `src/routes/_app.contas-a-receber.tsx`
  - Depende de: T001
  - Critério de pronto: criar e editar refletem na lista e no Swagger
    (`GET /api/ContasReceber`); trocar o cliente na edição reflete o
    novo nome na lista
  - **Bug de backend encontrado e corrigido durante a verificação:** o
    payload `dataVencimento`/`dataRecebimento` no formato `yyyy-mm-dd`
    (produzido pelo `<input type="date">`) causava `500` em
    `POST`/`PUT /api/ContasReceber` (`DateTime.Kind=Unspecified` vs
    coluna `timestamp with time zone` no Postgres) — `ContasPagar` não
    tinha esse problema por já aplicar `DateTime.SpecifyKind`. Corrigido
    em `connectasys_api` (`CreateContaReceberHandler`,
    `UpdateContaReceberHandler`); detalhes em
    `connectasys_api/specs/specs/contas-receber/tasks.md` ("Correção
    pós-conclusão").
  - Confirmado via `curl` direto na API (mesmo payload que o formulário
    monta): `POST` com `dataVencimento` `yyyy-mm-dd` → `201`; `PUT`
    trocando cliente e informando `dataRecebimento` → `204`, `GET`
    seguinte confirma `clienteId` novo e `status` "Paga"; `PUT` com
    `clienteId` inexistente → `400`. Registro de teste removido depois.
    Renderização visual do modal não verificada (extensão Claude in
    Chrome desconectada, mesma limitação do T001).

- [x] **T003** — Validação do formulário (RF-08): botão "Salvar"
      desabilitado sem `clienteId` selecionado; `valor` checado como
      `> 0` antes de montar o payload (interrompe o submit com toast se
      inválido); `Select` mostra item desabilitado "Nenhum cliente
      cadastrado" quando `/api/Clientes` retorna lista vazia
  - Arquivo(s): `src/routes/_app.contas-a-receber.tsx`
  - Depende de: T002
  - Critério de pronto: tentar salvar sem cliente não dispara nenhuma
    chamada à API; valor `0` ou vazio é rejeitado antes do `POST`/`PUT`
  - Verificado por leitura de código (extensão do navegador
    desconectada): `salvar()` retorna antes de `criar.mutate`/
    `atualizar.mutate` tanto quando `form.clienteId` está vazio quanto
    quando `Number(valor) > 0` é falso, em ambos os casos com
    `toast.error` explicando o motivo; botão "Salvar" também fica
    `disabled` quando `clientes.length === 0`. `npm run lint` limpo (0
    erros).

- [x] **T004** — Adicionar remoção (`AlertDialog` de confirmação +
      `useMutation` para `DELETE`)
  - Arquivo(s): `src/routes/_app.contas-a-receber.tsx`
  - Depende de: T001
  - Critério de pronto: remover reflete na lista e no Swagger
  - Confirmado via `curl` direto na API: criar conta de teste → `201`;
    `DELETE` → `204`; `GET` do id removido → `404`; `DELETE` de id
    inexistente → `404`. `npm run lint` limpo (0 erros).

- [x] **T005** — Registrar a rota no menu lateral (`_app.tsx`, array
      `itens`), com ícone (`lucide-react`, `HandCoins`)
  - Arquivo(s): `src/routes/_app.tsx`
  - Depende de: T001
  - Critério de pronto: item aparece no menu, navega pra tela
  - `npm run lint` limpo (0 erros); layout `/dashboard` segue resolvendo
    `200` após a mudança. Item visível no menu não verificado
    visualmente (extensão do navegador desconectada).

- [ ] **T006** — Testar manualmente os 7 cenários da `spec.md` com a API
      local rodando (HTTPS, conforme `seguranca-quantica`)
  - Arquivo(s): nenhum (verificação)
  - Depende de: T001, T002, T003, T004, T005
  - Critério de pronto: cada cenário (listar, cadastrar, marcar como
    recebida, editar, remover, cadastrar sem cliente, erro de API)
    confirmado na tela real

## Verificação Final

- [ ] `npm run lint` sem erros
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente em `npm run dev`
- [ ] Nenhum item da checklist constitucional do design ficou pendente
- [ ] Nenhuma cor Tailwind literal (`orange-500` etc.) foi introduzida fora dos tokens semânticos

## Ajustes pendentes (rodada de specs 2026-09-13)

- [x] **T007** — Aplicar máscara de dinheiro em tempo real no campo
      "Valor" (cadastrar e editar), mesmo mecanismo de Contas a Pagar
  - `mascaraMoeda`/`formatarNumero`/`paraNumero` adicionados; `npx tsc
    --noEmit` e `npx eslint` sem erro novo
  - **Não verificado visualmente no navegador** — pendente confirmação
    do usuário
