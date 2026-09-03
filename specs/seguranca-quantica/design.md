# Design: Segurança de Transporte e Postura Pós-Quântica

**Pasta:** `specs/seguranca-quantica/` · **Spec:** `specs/seguranca-quantica/spec.md`
**Status:** rascunho · **Fase seguinte:** `/tarefas seguranca-quantica`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II — nenhuma lib de UI/estado nova
- [x] Nenhuma dependência nova sem justificativa explícita abaixo
- [x] Segue a organização de pastas do Artigo IV (`src/lib/api.ts` já é o
      lugar certo pra isso)
- [x] Todas as cores usam os tokens semânticos do Artigo V — não aplicável
      (não muda nenhuma tela)
- [x] Dados mockados isolados de componentes de UI — não aplicável
- [x] Textos de UI em português — a única mensagem de erro tocada
      (falha de conexão HTTPS) segue o padrão já existente em `api.ts`

## 2. Resumo da Abordagem

`API_BASE_URL`, hoje uma constante fixa em `http://localhost:5283`
(`src/lib/api.ts:1`), passa a vir de uma variável de ambiente de build
(`VITE_API_URL`, já suportada pela config compartilhada do projeto — ver
comentário em `vite.config.ts`), com fallback para o endereço HTTPS local
da API (`https://localhost:7074`, perfil `https` já existente no
`launchSettings.json` do `connectasys_api`). Isso satisfaz RF-01 (nunca
falar HTTP com a API) tanto em desenvolvimento quanto em produção, sem
fixar no código um domínio de produção que ainda não existe (pergunta em
aberto na `spec.md`).

Nenhuma tela, componente ou fluxo visual muda — é uma alteração de
configuração de rede em `src/lib/api.ts` e um arquivo `.env.example`
novo para documentar a variável.

## 3. Rotas e Telas

Nenhuma. Esta feature não adiciona nem altera rota/tela.

## 4. Componentes

Nenhum componente novo ou alterado.

## 5. Modelo de Dados (mock)

Não aplicável — não há dado mockado envolvido.

## 6. Dependências Novas

Nenhuma.

## 7. Riscos e Decisões

- **Decisão:** usar `import.meta.env.VITE_API_URL` em vez de uma
  constante fixa. A config compartilhada do projeto
  (`@lovable.dev/vite-tanstack-config`) já injeta variáveis `VITE_*`
  automaticamente — não é infraestrutura nova, só passar a usar o que já
  existe.
- **Risco:** se `VITE_API_URL` não for definida no ambiente de produção
  (quando ele existir), o app cai no fallback `https://localhost:7074`,
  que não funciona fora da máquina de desenvolvimento. Mitigação: quando
  a hospedagem de produção for decidida, configurar `VITE_API_URL` lá é
  um passo explícito de deploy — documentado no `.env.example` desta
  feature para não ser esquecido.
- **Achado, não resolvido aqui:** o build da Cloudflare já configurado
  como alvo padrão (`.gitignore` ignora `.wrangler/`/`.dev.vars`,
  `vite.config.ts` menciona nitro/cloudflare) sugere que o hub deve ser
  publicado atrás da rede da Cloudflare, que já oferece HTTPS por padrão
  e suporte a troca de chaves híbrida pós-quântica na borda — reforça que
  a recomendação de PQC em TLS (ver `design.md` do `connectasys_api`)
  tende a já vir resolvida do lado do hospedeiro do frontend, sem exigir
  nada deste repositório. Fica como informação para a spec de deploy
  futura, não uma tarefa desta feature.
- **Token em `localStorage`:** mencionado como fora de escopo na
  `spec.md` (RF/seção 5) — é exposição a XSS, não a ataque quântico; não
  é tocado aqui.

## 8. Estratégia de Verificação

- `npm run lint` limpo após a mudança.
- Criar `.env.local` (já ignorado por `*.local` no `.gitignore`) com
  `VITE_API_URL=https://localhost:7074`, rodar `npm run dev`, confirmar
  no DevTools (aba Network) que as chamadas à API saem para
  `https://localhost:7074/...`.
- Com a API local rodando via `dotnet run --launch-profile https` (após
  a mudança equivalente em `connectasys_api`) e o certificado de
  desenvolvimento confiável (`dotnet dev-certs https --trust`), testar
  login manualmente na tela `/auth` e confirmar que funciona ponta a
  ponta sobre HTTPS.
- Sem `VITE_API_URL` definida, confirmar que o fallback local ainda
  funciona (não quebra o fluxo de quem não configurou `.env.local`).
