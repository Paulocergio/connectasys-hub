# Tarefas: Clientes

**Pasta:** `specs/clientes/` · **Design:** `specs/clientes/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar clientes`

- [x] **T001** — Criar `src/routes/_app.clientes.tsx`: listagem
      (tabela com nome, documento formatado, telefone, email,
      cidade/UF) + busca por nome/documento/email, via `useQuery` em
      `/api/Clientes`
  - Arquivo(s): `src/routes/_app.clientes.tsx`
  - Critério de pronto: lista carrega da API real; `npm run lint`
    limpo (confirmado)

- [x] **T002** — Adicionar modal de criar/editar (`Dialog` +
      `useMutation` para `POST`/`PUT`), com campo único "Documento"
      (CPF/CNPJ) e o autofill de CNPJ via BrasilAPI
  - Arquivo(s): `src/routes/_app.clientes.tsx`
  - Depende de: T001
  - Critério de pronto: payload testado via curl compatível com a API
    real (criar com CNPJ + endereço → `201`, campos salvos
    corretamente); `npm run lint` limpo

- [x] **T003** — Adicionar o autofill de CEP via ViaCEP pro fluxo de
      CPF (11 dígitos), com campo "Razão Social" visível só quando
      documento é CNPJ
  - Arquivo(s): `src/routes/_app.clientes.tsx`
  - Depende de: T002
  - Critério de pronto: implementado junto com T002 (mesmo arquivo/
      formulário) — `consultarCep` dispara no blur do campo CEP
      quando atinge 8 dígitos

- [x] **T004** — Adicionar remoção (`AlertDialog` de confirmação +
      `useMutation` para `DELETE`)
  - Arquivo(s): `src/routes/_app.clientes.tsx`
  - Depende de: T001
  - Critério de pronto: implementado junto com T002/T003; testado via
    curl (`DELETE /api/Clientes/{id}` → `204`)

- [x] **T005** — Registrar a rota no menu lateral (`_app.tsx`, array
      `itens`), com ícone `Contact` — antes do item de Veículos
  - Arquivo(s): `src/routes/_app.tsx`
  - Depende de: T001
  - Critério de pronto: item "Clientes" aparece entre "Contas a
    Receber" e "Veículos"; `npm run lint` limpo (mesmo CRLF
    pré-existente de outros arquivos, não relacionado a esta mudança)

- [ ] **T006 (parcial)** — Testar manualmente os 8 cenários da
      `spec.md` com a API local rodando (`https://localhost:7074`)
  - Arquivo(s): nenhum (verificação)
  - Depende de: T001, T002, T003, T004, T005
  - Confirmado por fora do navegador: rota `/clientes` resolve
    (`200`), payload de criar com CNPJ/endereço testado direto contra
    a API real e removido depois
  - **Não verificado**: os autofills de CNPJ/CEP rodando de fato no
    navegador (BrasilAPI/ViaCEP chamados do client-side), edição,
    busca, remoção pela UI, e o cenário de documento/CEP não
    encontrado — extensão Claude in Chrome não conectada nesta sessão.
    Precisa de teste manual do usuário ou reconexão da extensão.

## Ajustes pós-implementação

- [x] Documento/CNPJ duplicado: API agora retorna `409` (ver
      `clientes-documento` no `connectasys_api`); o toast de erro
      genérico (`apiFetch`/`extrairMensagemErro`) já exibe a mensagem
      sem mudança nenhuma no front — confirmado que nenhum ajuste era
      necessário aqui além do backend.
- [x] Colar CNPJ/CEP com máscara (`17.184.037/0001-10`) não disparava
      a consulta — corrigido: gatilho movido pro `onChange` (dispara
      ao atingir 14/8 dígitos) e `maxLength` do input aumentado pra
      não cortar o texto colado antes da extração dos dígitos (ver
      `design.md`, seção 7). `npm run lint` limpo depois da mudança.

## Verificação Final

- [x] `npm run lint` sem erros (nos arquivos desta feature)
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente em
      `npm run dev` — pendente, ver T006
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal foi introduzida fora dos tokens
      semânticos
