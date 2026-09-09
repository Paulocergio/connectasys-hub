# Design: Dark Mode com Persistência

**Pasta:** `specs/dark-mode/` · **Spec:** `specs/dark-mode/spec.md`
**Status:** aprovado · **Fase seguinte:** `/tarefas dark-mode`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II (TanStack Query pra chamada de
      API, sem lib nova)
- [x] Nenhuma dependência nova
- [x] Segue a organização de pastas do Artigo IV (`src/lib/tema.ts`,
      `src/lib/connecta-store.tsx`)
- [x] Não introduz cor nova — reaproveita os tokens já existentes
      (`.light`/escuro padrão)
- [x] Textos de UI em português

## 2. Resumo da Abordagem

O hub já tinha `useTema()` (estado local + `localStorage`). A mudança
troca a fonte da verdade: o tema passa a vir da sessão (devolvida pelo
login), com o `localStorage` como fallback só pra sessões antigas em
cache sem o campo. Trocar o tema atualiza o estado local na hora e
dispara, em paralelo, uma chamada `PATCH` pra salvar no backend.

No lado da API (`connectasys_api`, fora do escopo constitucional deste
repo mas necessário pra feature funcionar): novo campo `Tema` no
usuário, devolvido no login e atualizável por um endpoint próprio que
qualquer usuário autenticado pode chamar pra si mesmo (não é operação
de gestão de usuário, é autoatendimento).

## 3. Rotas e Telas

Nenhuma rota nova — a troca de tema já acontece no menu lateral
(`_app.tsx`), que passa a receber a sessão como parâmetro do hook.

## 4. Componentes

Nenhum componente novo.

## 5. Modelo de Dados

```ts
// src/lib/connecta-store.tsx
export type Sessao = { id: string; nome: string; email: string; papel: string; tema: "light" | "dark" };

// src/lib/tema.ts
export function useTema(sessao: Sessao | null): { tema: Tema; setTema: (t: Tema) => void };
```

`Sessao.tema` vem do `LoginResponseDto` da API (campo `tema`, string
`"light"`/`"dark"`).

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** o `localStorage` continua existindo como fallback — não
  foi removido — pra cobrir o instante antes da sessão carregar e
  sessões antigas em cache sem o campo `tema`.
- **Decisão:** salvar o tema é "fire and forget" (sem retry, sem
  bloquear a UI) — consistente com RNF-01 da spec.
- **Risco:** se dois dispositivos trocarem o tema quase ao mesmo tempo,
  vale o último `PATCH` que chegar — sem controle de conflito, aceitável
  pra esse caso de uso.

## 8. Estratégia de Verificação

- `npm run lint` limpo.
- Com a API local rodando, testar manualmente:
  - Trocar o tema, dar F5 → tema mantém.
  - Trocar o tema, logout, login de novo → tema volta como estava.
  - Conferir no banco (`usuarios.tema`) que o valor foi persistido.
- **Verificado nesta rodada:** usuária de teste trocou pra escuro e o
  valor `dark` ficou salvo no banco — confirmado direto na tabela
  `usuarios`, evidência de que o fluxo funciona ponta a ponta.
