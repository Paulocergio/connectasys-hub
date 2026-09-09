# Tarefas: Dark Mode com Persistência

**Pasta:** `specs/dark-mode/` · **Design:** `specs/dark-mode/design.md`
**Status:** implementado · **Fase seguinte:** nenhuma (feature concluída)

- [x] **T001** — Backend: campo `Tema` em `Usuario` + migration +
      devolver no login
  - Arquivo(s): `connectasys_api/src/Core/Domain/Entities/Usuario.cs`,
    `LoginResponseDto.cs`, `LoginHandler.cs`, migration
    `AddTemaToUsuarios`
  - Critério de pronto: login devolve `tema`; migration aplicada no
    banco de dev

- [x] **T002** — Backend: endpoint de autoatendimento pra salvar o
      próprio tema
  - Arquivo(s):
    `connectasys_api/src/API/Controllers/UsuariosController.cs`,
    `Commands/Usuarios/UpdateTemaUsuario/`
  - Depende de: T001
  - Critério de pronto: `PATCH /api/Usuarios/me/tema` funciona pra
    qualquer usuário autenticado, sem exigir papel Admin

- [x] **T003** — Frontend: `Sessao`/login guardam o tema
  - Arquivo(s): `src/lib/connecta-store.tsx`
  - Depende de: T001
  - Critério de pronto: `sessao.tema` populado após login

- [x] **T004** — Frontend: `useTema` prioriza sessão, persiste troca
  - Arquivo(s): `src/lib/tema.ts`, `src/routes/_app.tsx`
  - Depende de: T002, T003
  - Critério de pronto: trocar o tema atualiza a tela na hora e chama o
    `PATCH`

- [x] **T005** — Testar manualmente e no banco
  - Arquivo(s): nenhum (verificação)
  - Depende de: T001–T004
  - Resultado: confirmado no banco (`usuarios.tema = 'dark'` pra uma
    usuária de teste depois de trocar o tema)

## Verificação Final

- [x] `npx tsc --noEmit` e `dotnet build` sem erros novos
- [x] `npm run build` sem erros
- [x] Persistência confirmada com dado real no banco
- [ ] Testado manualmente trocando de navegador/dispositivo — pendente
      confirmação do usuário
