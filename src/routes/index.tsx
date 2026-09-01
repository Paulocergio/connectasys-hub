import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wrench,
  CalendarClock,
  Package,
  Receipt,
  Users,
  BarChart3,
  Check,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConnectaSys — Gestão completa para oficinas mecânicas" },
      {
        name: "description",
        content:
          "ConnectaSys é o sistema multitenant para oficinas mecânicas: ordens de serviço, agenda, estoque, financeiro e equipe em um só lugar.",
      },
      { property: "og:title", content: "ConnectaSys — Gestão para oficinas mecânicas" },
      {
        property: "og:description",
        content: "Ordens de serviço, agenda, estoque e financeiro da sua oficina em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const recursos = [
  { icon: Wrench, t: "Ordens de serviço", d: "Do orçamento à entrega, com histórico por veículo." },
  { icon: CalendarClock, t: "Agenda de box", d: "Distribua serviços entre mecânicos e elevadores." },
  { icon: Package, t: "Estoque de peças", d: "Entradas, saídas e alerta de estoque mínimo." },
  { icon: Receipt, t: "Financeiro", d: "Contas a pagar e receber com fluxo de caixa diário." },
  { icon: Users, t: "Clientes e frotas", d: "Cadastro completo com veículos e contatos." },
  { icon: BarChart3, t: "Indicadores", d: "Ticket médio, produtividade e retorno de clientes." },
];

const planos = [
  {
    nome: "Box",
    preco: "R$ 149",
    desc: "Para oficinas que estão começando a organizar a operação.",
    itens: ["Até 3 usuários", "150 OS por mês", "Agenda e clientes", "Suporte por e-mail"],
    destaque: false,
  },
  {
    nome: "Oficina",
    preco: "R$ 329",
    desc: "O mais escolhido por oficinas com equipe fixa.",
    itens: [
      "Até 12 usuários",
      "OS ilimitadas",
      "Estoque + financeiro",
      "Relatórios gerenciais",
      "Suporte prioritário",
    ],
    destaque: true,
  },
  {
    nome: "Rede",
    preco: "R$ 749",
    desc: "Múltiplas unidades com gestão centralizada.",
    itens: [
      "Usuários ilimitados",
      "Multi-unidades",
      "Permissões avançadas",
      "API e integrações",
      "Gerente de conta",
    ],
    destaque: false,
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Gauge className="h-6 w-6 text-primary" />
            Connecta<span className="text-primary">Sys</span>
          </span>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#recursos" className="hover:text-foreground">
              Recursos
            </a>
            <a href="#planos" className="hover:text-foreground">
              Planos
            </a>
            <a href="#faq" className="hover:text-foreground">
              Perguntas
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth" search={{ tab: "cadastro" }}>
                Criar conta
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section
          className="border-b border-border/50 px-5 py-24"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Sistema multitenant para oficinas
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              A oficina inteira rodando em um só painel
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Ordens de serviço, agenda de box, estoque de peças e financeiro. O ConnectaSys tira a
              gestão do caderno e coloca sua equipe no mesmo ritmo.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="shadow-[var(--shadow-glow)]">
                <Link to="/auth" search={{ tab: "cadastro" }}>
                  Começar teste de 14 dias
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth">Já sou cliente</Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              {[
                ["1.240", "oficinas ativas"],
                ["380 mil", "OS emitidas"],
                ["4,9/5", "satisfação"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-xl border border-border/60 bg-card/60 p-4">
                  <p className="text-2xl font-semibold text-primary">{n}</p>
                  <p className="text-xs text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="recursos" className="mx-auto max-w-6xl px-5 py-24">
          <h2 className="text-3xl font-bold tracking-tight">Tudo que a oficina precisa</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Módulos que conversam entre si — sem planilha paralela.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recursos.map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/50"
              >
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="planos" className="border-y border-border/50 bg-card/30 px-5 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold tracking-tight">Planos e preços</h2>
            <p className="mt-3 text-center text-muted-foreground">
              Sem fidelidade. Cancele quando quiser.
            </p>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {planos.map((p) => (
                <div
                  key={p.nome}
                  className={`relative flex flex-col rounded-2xl border bg-card p-7 ${
                    p.destaque
                      ? "border-primary shadow-[var(--shadow-glow)]"
                      : "border-border/60"
                  }`}
                >
                  {p.destaque && (
                    <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Mais popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{p.nome}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                  <p className="mt-6 text-4xl font-bold">
                    {p.preco}
                    <span className="text-base font-normal text-muted-foreground">/mês</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {p.itens.map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{i}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-7"
                    variant={p.destaque ? "default" : "outline"}
                  >
                    <Link to="/auth" search={{ tab: "cadastro" }}>
                      Assinar {p.nome}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
          <h2 className="text-3xl font-bold tracking-tight">Perguntas frequentes</h2>
          <div className="mt-10 space-y-6">
            {[
              [
                "Preciso instalar algo?",
                "Não. O ConnectaSys roda no navegador do computador, tablet ou celular.",
              ],
              [
                "Consigo separar várias unidades?",
                "Sim. Cada oficina cadastrada tem seus próprios dados, usuários e permissões.",
              ],
              [
                "Como funciona o acesso da equipe?",
                "O administrador cadastra os usuários e define quem está autorizado a entrar no sistema.",
              ],
            ].map(([q, a]) => (
              <div key={q} className="rounded-xl border border-border/60 bg-card p-5">
                <p className="font-medium">{q}</p>
                <p className="mt-2 text-sm text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 px-5 py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span>© 2026 ConnectaSys — Gestão para oficinas mecânicas</span>
          <Link to="/auth" className="hover:text-foreground">
            Acessar sistema
          </Link>
        </div>
      </footer>
    </div>
  );
}
