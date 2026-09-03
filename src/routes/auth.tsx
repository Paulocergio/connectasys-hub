import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Gauge } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { login } = useConnecta();
  const [aba, setAba] = useState<"login" | "cadastro">(tab ?? "login");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

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
            <p className="rounded-lg border border-border/60 bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">
              Cadastro de novas oficinas estará disponível em breve. Peça ao administrador da sua
              oficina pra criar seu acesso.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            ← Voltar para a página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}
