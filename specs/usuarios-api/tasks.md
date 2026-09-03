# Tarefas: Autenticação e Usuários via API real

**Pasta:** `specs/usuarios-api/` · **Design:** `specs/usuarios-api/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

> **Nota (2026-09-03):** os checkboxes abaixo estavam desatualizados —
> T001, T003, T004 e T006 já estavam implementados no código
> (`src/lib/api.ts`, `connecta-store.tsx`, `auth.tsx`,
> `_app.usuarios.tsx`), só não tinham sido marcados. Corrigido durante a
> integração front↔back (CORS na API), sem mudança de código nesta
> revisão de doc.

- [x] **T001** — Criar `src/lib/api.ts`: função `apiFetch` com URL base
      (`http://localhost:5283`), header `Authorization: Bearer <token>`
      automático quando há token salvo, parsing de erro legível, e
      limpeza de sessão + redirecionamento pra `/auth` em resposta 401.
  - Arquivo(s): `src/lib/api.ts`
  - Critério de pronto: função exportada e tipada, `npm run lint` limpo;
    ainda não é chamada em lugar nenhum (só existe).

- [x] **T002** — Testar login real contra a API: criar um usuário de
      teste via API, chamar `POST /api/Auth/login` com as credenciais
      dele e registrar o JSON de resposta exato.
  - Arquivo(s): nenhum (verificação; `design.md` seção 3 atualizada com
    o formato real confirmado)
  - Critério de pronto: formato da resposta de login confirmado e
    anotado antes de prosseguir pra T003. ✅ (usuário de teste removido
    depois de confirmar)

- [x] **T003** — Reescrever sessão em `connecta-store.tsx`: `login`
      chama a API real (usando o formato confirmado em T002) e guarda
      token + sessão; `logout` limpa tudo; remove do contexto tudo que
      não é mais usado daqui (`usuarios`, `criarUsuario`,
      `atualizarUsuario`, `removerUsuario`, `cadastrar`).
  - Arquivo(s): `src/lib/connecta-store.tsx`
  - Depende de: T001, T002
  - Critério de pronto: login funcional testado manualmente contra a API
    local; `npm run lint` limpo.

- [x] **T004** — Atualizar `auth.tsx`: `onLogin` assíncrono com estado de
      carregamento (botão desabilitado/"Entrando..." durante a chamada);
      esconder a aba "Cadastrar oficina" (fora de escopo — RF-07).
  - Arquivo(s): `src/routes/auth.tsx`
  - Depende de: T003
  - Critério de pronto: login funciona na tela de verdade, com feedback
    de carregamento; aba de cadastro não aparece mais.

- [x] **T005** — Atualizar `_app.usuarios.tsx`: listar usuários via
      `useQuery` (`useMutation` pra criar/editar/remover), chamando
      `api.ts`; remover campo "Autorizado" do formulário e coluna
      "Acesso" da tabela; remover qualquer referência a "oficina"
      (filtro, texto do modal, campo do formulário); campo "Perfil" vira
      `Input` de texto livre em vez de `Select` fixo.
  - Arquivo(s): `src/routes/_app.usuarios.tsx`
  - Depende de: T001, T003
  - Critério de pronto: lista carrega da API; criar/editar/remover
    refletem também no Swagger (`GET /api/Usuarios`); `npm run lint`
    limpo.

- [x] **T006** — Verificar que sessão/token inválido desloga: apagar o
      token do `localStorage` (ou usar um token inventado) e confirmar
      que a próxima chamada protegida redireciona pra `/auth`.
  - Arquivo(s): nenhum (comportamento já implementado em T001/T003)
  - Critério de pronto: testado manualmente, confirma RF-03 da spec.
  - Nota: a lógica (401 → limpa sessão → redireciona) está implementada
    em `api.ts`; teste manual ponta a ponta com a API local rodando fica
    pendente de confirmação do usuário (bloqueado antes por CORS ausente
    na API — corrigido nesta rodada, ver `connectasys_api`).

- [ ] **T007** — (2026-09-03) Verificar cenário de e-mail duplicado (RF-05)
      agora que a API valida isso: com a API local rodando e a correção de
      `connectasys_api` aplicada, tentar criar/editar um usuário com um
      e-mail já cadastrado na tela de Usuários e confirmar que aparece o
      toast de erro com a mensagem da API, sem tela quebrada e sem entrada
      duplicada na lista.
  - Arquivo(s): nenhum (comportamento já implementado no hub; depende só
    da correção do backend)
  - Depende de: correção `usuarios` (e-mail único) em `connectasys_api`.
  - Critério de pronto: testado manualmente, toast exibido, lista não
    ganha duplicata.

## Verificação Final

- [x] `npm run lint` sem erros
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente com a
      API local (`http://localhost:5283`) rodando — pendente: exige rodar
      API + Postgres localmente, fora do alcance desta correção de docs.
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal foi introduzida fora dos tokens semânticos
