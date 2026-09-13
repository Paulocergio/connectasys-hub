# Design: Multitenant (cadastro self-service)

**Pasta:** `specs/multitenant/` · **Spec:** `specs/multitenant/spec.md`
**Status:** implementado · **Fase seguinte:** `/tarefas multitenant`

## 1. Verificação Constitucional

- [x] Usa apenas a stack do Artigo II — mesmo padrão de `_app.auth.tsx`
      já existente (`react-hook-form` não usado aqui, segue o padrão
      leve de `FormData` + `useState` já usado no login, Artigo VI)
- [x] Nenhuma dependência nova
- [x] Textos de UI em português

## 2. Resumo da Abordagem

O isolamento de dados em si é **inteiramente transparente pro hub** —
nenhuma tela de CRUD existente (`_app.clientes.tsx`,
`_app.ordens-servico.tsx` etc.) muda uma linha, porque a filtragem
acontece no backend a partir do token, que o hub já manda em toda
chamada via `apiFetch`. O único trabalho do lado do hub é:

1. `src/lib/connecta-store.tsx`: nova função `registrar`, espelhando
   `login` — mesmo formato de resposta (`LoginResponse`, agora com
   `trialExpiraEmUtc`), mesma forma de aplicar a sessão.
2. `src/routes/auth.tsx`: a aba "Cadastrar oficina" ganha o formulário
   de verdade, no lugar do texto "em breve".
3. `src/routes/index.tsx` (landing): "14 dias" → "3 dias" nos dois
   textos que citavam o período de teste.

## 3. `connecta-store.tsx`

```ts
export type Sessao = {
  id: string; nome: string; email: string; papel: string; tema: Tema;
  trialExpiraEmUtc: string;
};

export type RegistrarDados = {
  nomeEmpresa: string; nomeUsuario: string; email: string; telefone: string; senha: string;
};
```

`aplicarSessao(resposta, email)` — helper interno extraído do corpo de
`login`, reaproveitado por `registrar`, já que as duas produzem
exatamente o mesmo formato de resposta (`LoginResponse`) e o mesmo
efeito colateral (salvar token + sessão, atualizar estado).

```ts
const registrar: Ctx["registrar"] = useCallback(async (dados) => {
  try {
    const resposta = await apiFetch<LoginResponse>("/api/Auth/registrar", {
      method: "POST",
      body: JSON.stringify(dados),
    });
    aplicarSessao(resposta, dados.email);
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro: erro instanceof Error ? erro.message : "Falha no cadastro." };
  }
}, []);
```

## 4. `auth.tsx` — formulário de cadastro

Mesma estrutura visual do formulário de login (mesmo `Dialog`-like
card, `Input`/`Label` do design system). Campos: `nomeEmpresa`,
`nomeUsuario`, `email`, `telefone`, `senha`, `confirmarSenha`.

```tsx
async function onCadastro(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const senha = String(f.get("senha"));
  const confirmarSenha = String(f.get("confirmarSenha"));
  if (senha !== confirmarSenha) {
    setErro("As senhas não coincidem.");
    return;
  }
  if (!termosAceitos) {
    setErro("Você precisa aceitar os termos do período de teste pra continuar.");
    return;
  }
  setEnviando(true);
  const r = await registrar({
    nomeEmpresa: String(f.get("nomeEmpresa")),
    nomeUsuario: String(f.get("nomeUsuario")),
    email: String(f.get("email")),
    telefone: String(f.get("telefone")),
    senha,
  });
  setEnviando(false);
  if (!r.ok) { setErro(r.erro ?? "Falha no cadastro."); return; }
  setErro(null);
  toast.success("Oficina cadastrada! Seu teste de 3 dias já começou.");
  navigate({ to: "/dashboard" });
}
```

Reaproveita o mesmo card de erro (`{erro && <p ...>}`) já usado na aba
de login — cobre tanto erro de cadastro (e-mail em uso) quanto, na aba
de login, o erro de teste expirado (a mensagem da API já vem pronta e
clara, `apiFetch` propaga qualquer `message` de erro não-2xx
automaticamente — nenhum tratamento especial precisou ser adicionado
pro `402` de teste expirado).

## 4.1. Modal de aceite de termos (RF-06)

Dois estados novos em `AuthPage`: `termosAceitos` (controla o
checkbox e libera o botão de envio) e `termosAbertos` (controla o
`Dialog` do contrato). Componentes usados: `Checkbox` e `Dialog` (+
`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogDescription`/`DialogFooter`)
de `@/components/ui/` — ambos já existiam no design system, nenhum
componente novo criado.

Checkbox inline no formulário, com um botão-link que abre o modal:

```tsx
<div className="flex items-start gap-2.5">
  <Checkbox
    id="termos"
    checked={termosAceitos}
    onCheckedChange={(v) => setTermosAceitos(v === true)}
    className="mt-0.5"
  />
  <Label htmlFor="termos" className="text-xs leading-relaxed font-normal text-muted-foreground">
    Li e aceito os{" "}
    <button type="button" onClick={() => setTermosAbertos(true)} className="font-medium text-primary underline-offset-2 hover:underline">
      termos do período de teste
    </button>
    , incluindo a exclusão dos dados caso o teste expire.
  </Label>
</div>
```

Botão de envio recebe `disabled={enviando || !termosAceitos}` —
duas camadas de proteção: o `disabled` visual e a checagem em
`onCadastro` (necessária porque o form ainda pode ser submetido via
Enter mesmo com o botão desabilitado, dependendo do browser).

O `Dialog` do contrato usa um ícone de alerta (`TriangleAlert`) e uma
lista numerada (`<ol>`) com 4 itens: prazo exato (exemplo dia 13→15),
bloqueio automático, um item com destaque visual
(`border-destructive`/`bg-destructive/10`) explicando a exclusão
definitiva sem backup, e a orientação de contato antes do vencimento.
O botão "Entendi e aceito" do rodapé seta `termosAceitos=true` e fecha
o modal (`setTermosAbertos(false)`) — é a única forma de marcar a
caixa a partir do modal; fechar o modal sem clicar no botão (`X` ou
clique fora) não aceita nada.

Texto do CTA de envio também mudou de "Criar conta" pra "Começar teste
de 3 dias" e ganhou uma linha de aviso acima do formulário ("3 dias de
teste grátis, sem cartão de crédito") — reforço visual antes mesmo de
chegar no checkbox.

## 5. Dependências Novas

Nenhuma.

## 6. Riscos e Decisões

- **Decisão:** sem componente/rota nova — tudo dentro do `auth.tsx`
  já existente, só preenchendo o que já era a aba "Cadastrar oficina"
  (o layout de abas já existia, só uma das duas mostrava um
  placeholder).
- **Decisão:** erro de teste expirado usa o mesmo card de erro
  genérico do formulário de login — não precisou de tratamento
  especial porque `apiFetch` já propaga a mensagem de qualquer erro
  HTTP não-2xx (incluindo o novo `402`) do mesmo jeito que propaga
  `401`/`429`.
- **Decisão:** confirmação de senha é validação só de UX no
  front — a API não exige isso (só recebe uma `senha`).
- **Decisão (revisão 2026-09-13):** aceite do contrato é obrigatório e
  bloqueante (checkbox + botão desabilitado até marcar), não um link
  informativo opcional — pedido explícito do usuário depois de definir
  que a exclusão de dados é automática e sem backup; o visitante
  precisa ver isso antes de poder criar a conta, não depois.
- **Decisão:** o aceite é só uma trava de UX no hub — não existe campo
  "aceitouTermos" enviado pra API (`RegistrarCommand` não tem esse
  campo). O contrato em si não é persistido em lugar nenhum além de
  aparecer no modal; se isso precisar virar auditável (guardar
  timestamp de aceite, por exemplo) é um requisito novo, fora do
  escopo desta revisão.

## 7. Estratégia de Verificação

- `npx tsc --noEmit`/`npx eslint`/`npm run build` sem erro novo.
- Backend testado ponta a ponta via curl replicando exatamente o
  payload que este formulário envia (`specs/specs/multitenant/tasks.md`
  do `connectasys_api`) — cadastro, e-mail duplicado, isolamento entre
  empresas, teste expirado.
- **Não verificado no navegador de verdade** (extensão Claude in
  Chrome não conectada nesta sessão) — pendente confirmação do
  usuário: preencher o formulário de cadastro em `npm run dev` e
  conferir o auto-login e o redirecionamento pro dashboard.
