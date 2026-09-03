# Tarefas: Segurança de Transporte e Postura Pós-Quântica

**Pasta:** `specs/seguranca-quantica/` · **Design:** `specs/seguranca-quantica/design.md`
**Status:** rascunho · **Fase seguinte:** `/implementar seguranca-quantica`

- [x] **T001** — Criar `.env.example` na raiz documentando a variável
      `VITE_API_URL=https://localhost:7074`
  - Arquivo(s): `.env.example`
  - Critério de pronto: arquivo criado, sem segredo nenhum (só
    documenta a variável e o valor local de exemplo)

- [x] **T002** — Alterar `API_BASE_URL` em `src/lib/api.ts` pra ler
      `import.meta.env.VITE_API_URL`, com fallback para
      `https://localhost:7074`
  - Arquivo(s): `src/lib/api.ts`
  - Depende de: T001
  - Critério de pronto: `npm run lint` limpo (0 erros, só warnings
    pré-existentes sem relação); sem `.env.local` configurado, o app
    ainda aponta pro fallback HTTPS local (não mais pro antigo
    `http://localhost:5283`)

- [x] **T003** — Criar `.env.local` (não versionado, já coberto por
      `*.local` no `.gitignore`) com `VITE_API_URL=https://localhost:7074`
      pra uso local
  - Arquivo(s): `.env.local`
  - Depende de: T002
  - Critério de pronto: `npm run dev` sobe normalmente (confirmado,
    `http://localhost:8080`)

- [x] **T004 (parcial)** — Testar login contra a API local rodando em
      HTTPS
  - Arquivo(s): nenhum (verificação)
  - Depende de: T003, e da feature espelhada em `connectasys_api`
    (concluída)
  - Confirmado via chamada HTTP direta simulando exatamente a requisição
    que o hub faz (`Origin: http://localhost:8080` →
    `https://localhost:7074/api/Auth/login`): `200 OK`,
    `Access-Control-Allow-Origin` correto, token retornado — usuário de
    teste criado e removido depois.
  - **Não verificado**: o fluxo real na tela `/auth` pelo navegador — a
    extensão Claude in Chrome não estava conectada nesta sessão. Falta
    confirmação visual do usuário (abrir `http://localhost:8080/auth` e
    logar) antes de marcar T004 como totalmente concluída.

## Verificação Final

- [x] `npm run lint` sem erros
- [ ] Todos os cenários da spec (`spec.md`) testados manualmente em
      `npm run dev` — cenário 1/3 confirmado por chamada HTTP direta
      (ver T004); falta o clique real na tela `/auth` pelo navegador
- [x] Nenhum item da checklist constitucional do design ficou pendente
- [x] Nenhuma cor Tailwind literal foi introduzida fora dos tokens
      semânticos (não aplicável — feature não toca UI)
