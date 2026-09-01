import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Gauge, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useConnecta } from "@/lib/connecta-store";

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
  const { login, cadastrar } = useConnecta();
  const [aba, setAba] = useState<"login" | "cadastro">(tab ?? "login");
  const [erro, setErro] = useState<string | null>(null);

  function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = login(String(f.get("email")), String(f.get("senha")));
    if (!r.ok) {
      setErro(r.erro ?? "Falha no login.");
      return;
    }
    setErro(null);
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/app/dashboard" });
  }

  function onCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = cadastrar({
      nome: String(f.get("nome")),
      email: String(f.get("email")),
      senha: String(f.get("senha")),
      oficina: String(f.get("oficina")),
      telefone: String(f.get("telefone")),
    });
    if (!r.ok) {
      setErro(r.erro ?? "Falha no cadastro.");
      return;
    }
    setErro(null);
    toast.success("Oficina cadastrada! Faça login para continuar.");
    setAba("login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-14">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Gauge className="h-6 w-6 text-primary" />
          Connecta<span className="text-primary">Sys</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-7">
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
                <Input id="email" name="email" type="email" required placeholder="voce@oficina.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" name="senha" type="password" required placeholder="••••••" />
              </div>
              <Button type="submit" className="w-full">
                Entrar no sistema
              </Button>
              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Demonstração: admin@connectasys.com / 123456. O usuário
                marcos@oficinacentral.com existe, mas está sem autorização de acesso.
              </p>
            </form>
          ) : (
            <form onSubmit={onCadastro} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Seu nome</Label>
                <Input id="nome" name="nome" required placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oficina">Nome da oficina</Label>
                <Input id="oficina" name="oficina" required placeholder="Auto Center Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" required placeholder="(11) 90000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-c">E-mail</Label>
                <Input id="email-c" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha-c">Senha</Label>
                <Input id="senha-c" name="senha" type="password" required minLength={6} />
              </div>
              <Button type="submit" className="w-full">
                Criar minha oficina
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Voltar para a página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}
