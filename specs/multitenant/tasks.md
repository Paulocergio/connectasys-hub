# Tarefas: Multitenant (cadastro self-service)

**Pasta:** `specs/multitenant/` · **Design:** `specs/multitenant/design.md`
**Status:** implementado · **Fase seguinte:** `/implementar multitenant`

- [x] **T001** — `connecta-store.tsx`: tipo `RegistrarDados`, campo
      `trialExpiraEmUtc` em `Sessao`/`LoginResponse`, helper interno
      `aplicarSessao` extraído de `login`, nova função `registrar`
  - `npx tsc --noEmit` sem erro novo

- [x] **T002** — `auth.tsx`: formulário real na aba "Cadastrar
      oficina" (nome da oficina, nome do usuário, e-mail, telefone,
      senha, confirmar senha), substituindo o texto "em breve"
  - Validação de senha≠confirmação no front antes de chamar a API
  - Sucesso → auto-login + toast + navega pro `/dashboard`
  - Erro (e-mail em uso, etc.) → mesmo card de erro do login

- [x] **T003** — Landing page (`index.tsx`): "14 dias" → "3 dias" nos
      dois textos (botão do hero, seção de CTA final)

- [x] **T005** (revisão 2026-09-13) — `auth.tsx`: modal de aceite de
      termos do período de teste (RF-06)
  - Estados `termosAceitos`/`termosAbertos`; `Checkbox` + link no
    formulário; `Dialog` com contrato completo (prazo por dia
    calendário com exemplo, bloqueio automático, exclusão definitiva
    sem backup em destaque, orientação de contato)
  - Botão de envio desabilitado até aceitar (`disabled={enviando ||
    !termosAceitos}`) + checagem redundante em `onCadastro`
  - Botão "Entendi e aceito" do modal marca a caixa e fecha o modal
  - `npx tsc --noEmit`/`npx eslint`/`npm run build` sem erro novo

- [ ] **T004** — Testar os cenários da `spec.md` com a API local
      rodando
  - Testado via curl o fluxo completo (cadastro, e-mail duplicado,
    isolamento, teste expirado) — ver `specs/specs/multitenant/tasks.md`
    do `connectasys_api`, usando exatamente os mesmos payloads que
    este formulário envia
  - **Não verificado no navegador de verdade** (extensão Claude in
    Chrome não conectada nesta sessão) — pendente confirmação do
    usuário: preencher o formulário em `npm run dev`, conferir
    auto-login e redirecionamento, e também abrir/fechar o modal de
    termos e confirmar que o botão de envio só libera depois do aceite

## Verificação Final

- [x] `npx tsc --noEmit` sem erro novo
- [x] `npx eslint` sem erro novo
- [x] `npm run build` sem erro
- [ ] Todos os cenários da spec testados manualmente em `npm run dev`
      — pendente confirmação do usuário (sem navegador nesta sessão)
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal introduzida fora dos tokens
      semânticos
