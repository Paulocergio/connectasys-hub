import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Gauge, TriangleAlert } from "@/components/icons";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useConnecta } from "@/lib/connecta-store";
import { Blob } from "@/components/landing/Blob";

const searchSchema = z.object({ tab: z.enum(["login", "cadastro"]).optional() });

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — ConnectaSys" },
      {
        name: "description",
        content: "Acesse o painel da sua oficina ou cadastre sua oficina no ConnectaSys.",
      },
      { property: "og:title", content: "Acesso — ConnectaSys" },
      {
        property: "og:description",
        content: "Login e cadastro de oficinas no sistema ConnectaSys.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const { login, registrar } = useConnecta();
  const [aba, setAba] = useState<"login" | "cadastro">(tab ?? "login");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [termosAbertos, setTermosAbertos] = useState(false);

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    const r = await login(String(f.get("email")), String(f.get("senha")));
    setEnviando(false);
    if (!r.ok) {
      setErro(r.erro ?? "Falha no login.");
      return;
    }
    setErro(null);
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/dashboard" });
  }

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
    if (!r.ok) {
      setErro(r.erro ?? "Falha no cadastro.");
      return;
    }
    setErro(null);
    toast.success("Oficina cadastrada! Seu teste de 3 dias já começou.");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-14">
      <Blob className="pointer-events-none absolute -top-24 -left-32 h-96 w-96 text-accent/25" />
      <Blob className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 text-primary/20" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center gap-2.5 text-lg font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Gauge className="h-5 w-5 text-white" />
          </span>
          Connecta<span className="text-primary">Sys</span>
        </Link>

        <div className="mt-8 rounded-3xl border border-border/60 bg-card/80 p-7 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
            {(["login", "cadastro"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setAba(t);
                  setErro(null);
                }}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  aba === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Entrar" : "Cadastrar oficina"}
              </button>
            ))}
          </div>

          {erro && (
            <p className="mb-5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
              {erro}
            </p>
          )}

          {aba === "login" ? (
            <form onSubmit={onLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="voce@oficina.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" name="senha" type="password" required placeholder="••••••" />
              </div>
              <Button
                type="submit"
                disabled={enviando}
                className="w-full rounded-full font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/40"
              >
                {enviando ? "Entrando..." : "Entrar no sistema"}
              </Button>
            </form>
          ) : (
            <form onSubmit={onCadastro} className="space-y-4">
              <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
                3 dias de teste grátis, sem cartão de crédito.
              </p>
              <div className="space-y-2">
                <Label htmlFor="nomeEmpresa">Nome da oficina</Label>
                <Input
                  id="nomeEmpresa"
                  name="nomeEmpresa"
                  required
                  placeholder="Auto Center Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomeUsuario">Seu nome</Label>
                <Input
                  id="nomeUsuario"
                  name="nomeUsuario"
                  required
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cadastro-email">E-mail</Label>
                <Input
                  id="cadastro-email"
                  name="email"
                  type="email"
                  required
                  placeholder="voce@oficina.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" required placeholder="(11) 99999-9999" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cadastro-senha">Senha</Label>
                  <Input
                    id="cadastro-senha"
                    name="senha"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                  <Input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="termos"
                  checked={termosAceitos}
                  onCheckedChange={(v) => setTermosAceitos(v === true)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="termos"
                  className="text-xs leading-relaxed font-normal text-muted-foreground"
                >
                  Li e aceito os{" "}
                  <button
                    type="button"
                    onClick={() => setTermosAbertos(true)}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    termos do período de teste
                  </button>
                  , incluindo a exclusão dos dados caso o teste expire.
                </Label>
              </div>
              <Button
                type="submit"
                disabled={enviando || !termosAceitos}
                className="w-full rounded-full font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/40"
              >
                {enviando ? "Criando conta..." : "Começar teste de 3 dias"}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            ← Voltar para a página inicial
          </Link>
        </p>
      </div>

      <Dialog open={termosAbertos} onOpenChange={setTermosAbertos}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/12 text-destructive">
                <TriangleAlert className="h-5 w-5" />
              </span>
              <DialogTitle>Termos do período de teste</DialogTitle>
            </div>
            <DialogDescription>Leia com atenção antes de criar sua conta.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm leading-relaxed text-foreground">
            <p>Ao criar sua conta no ConnectaSys, você concorda com o seguinte:</p>

            <ol className="list-decimal space-y-3 pl-5">
              <li>
                Você tem acesso gratuito ao sistema por um período de teste que vai até o fim do dia
                seguinte ao cadastro — por exemplo, cadastrando hoje dia 13, o acesso é bloqueado a
                partir do dia 15.
              </li>
              <li>
                Depois desse prazo, se a assinatura não tiver sido contratada, o acesso é bloqueado
                automaticamente, sem aviso prévio adicional além deste.
              </li>
              <li className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 font-medium text-destructive-foreground">
                Assim que o acesso é bloqueado,{" "}
                <strong>todos os dados da sua oficina são apagados permanentemente</strong> do
                sistema — clientes, veículos, ordens de serviço, estoque, financeiro e usuários.
                Essa exclusão é automática, definitiva, e <strong>não existe backup</strong>: não há
                como recuperar os dados depois disso.
              </li>
              <li>
                Se quiser continuar usando o sistema depois do teste, entre em contato antes do
                vencimento pra combinar a assinatura e evitar a exclusão.
              </li>
            </ol>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="w-full rounded-full font-bold"
              onClick={() => {
                setTermosAceitos(true);
                setTermosAbertos(false);
              }}
            >
              Entendi e aceito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
