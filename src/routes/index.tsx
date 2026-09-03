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
  Star,
  ArrowRight,
  Building2,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blob } from "@/components/landing/Blob";
import { OficinaIllustration } from "@/components/landing/OficinaIllustration";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { Marquee } from "@/components/landing/Marquee";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConnectaSys — Gestão completa para oficinas mecânicas" },
      {
        name: "description",
        content:
          "ConnectaSys é o sistema multitenant para oficinas mecânicas: ordens de serviço, agenda, estoque, financeiro e equipe em um só lugar.",
      },
      {
        property: "og:title",
        content: "ConnectaSys — Gestão para oficinas mecânicas",
      },
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
  {
    icon: Wrench,
    t: "Ordens de serviço",
    d: "Do orçamento à entrega, com histórico completo por veículo — peças, mão de obra e aprovação do cliente em um só lugar.",
    cor: "primary",
    span: true,
  },
  {
    icon: CalendarClock,
    t: "Agenda de box",
    d: "Distribua serviços entre mecânicos e elevadores com drag-and-drop intuitivo.",
    cor: "accent",
    span: false,
  },
  {
    icon: Package,
    t: "Estoque de peças",
    d: "Entradas, saídas e alerta de estoque mínimo em tempo real.",
    cor: "chart4",
    span: false,
  },
  {
    icon: Receipt,
    t: "Financeiro",
    d: "Contas a pagar e receber com fluxo de caixa diário e projeções.",
    cor: "chart5",
    span: false,
  },
  {
    icon: Users,
    t: "Clientes e frotas",
    d: "Cadastro completo com veículos, contatos e histórico de atendimento.",
    cor: "chart3",
    span: false,
  },
  {
    icon: BarChart3,
    t: "Indicadores",
    d: "Ticket médio, produtividade e retorno de clientes, acompanhados em tempo real pela gerência.",
    cor: "primary",
    span: true,
  },
] as const;

const oficinasFicticias = [
  "Auto Center Silva",
  "Oficina do Zé",
  "Rápido Motors",
  "Elite Auto Peças",
  "Mecânica Bom Preço",
  "Garagem Central",
  "Auto Reparo Nova Era",
  "Oficina Estrada Livre",
];

const planos = [
  {
    nome: "Box",
    icon: Package,
    preco: "R$ 149",
    desc: "Para oficinas que estão começando a organizar a operação.",
    itens: ["Até 3 usuários", "150 OS por mês", "Agenda e clientes", "Suporte por e-mail"],
    destaque: false,
    cor: "chart4",
  },
  {
    nome: "Oficina",
    icon: Star,
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
    cor: "primary",
  },
  {
    nome: "Rede",
    icon: Building2,
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
    cor: "accent",
  },
];

const faqData = [
  {
    q: "Preciso instalar algo?",
    a: "Não. O ConnectaSys roda no navegador do computador, tablet ou celular. É só acessar e usar.",
  },
  {
    q: "Consigo separar várias unidades?",
    a: "Sim. Cada oficina cadastrada tem seus próprios dados, usuários e permissões. A gestão centralizada permite acompanhar tudo de um só lugar.",
  },
  {
    q: "Como funciona o acesso da equipe?",
    a: "O administrador cadastra os usuários e define quem está autorizado a entrar no sistema. Controle total de permissões por função.",
  },
  {
    q: "Posso importar meus dados atuais?",
    a: "Sim. Oferecemos importação em massa via planilha para clientes, veículos e peças. Nosso time ajuda na migração.",
  },
];

const corMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  primary: {
    bg: "bg-primary/12",
    text: "text-primary",
    border: "border-primary/30",
    glow: "shadow-primary/20",
  },
  accent: {
    bg: "bg-accent/12",
    text: "text-accent",
    border: "border-accent/30",
    glow: "shadow-accent/20",
  },
  chart3: {
    bg: "bg-chart-3/12",
    text: "text-chart-3",
    border: "border-chart-3/30",
    glow: "shadow-chart-3/20",
  },
  chart4: {
    bg: "bg-chart-4/12",
    text: "text-chart-4",
    border: "border-chart-4/30",
    glow: "shadow-chart-4/20",
  },
  chart5: {
    bg: "bg-chart-5/12",
    text: "text-chart-5",
    border: "border-chart-5/30",
    glow: "shadow-chart-5/20",
  },
};

function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="landing-theme min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Gradient background mesh */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <span className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <Gauge className="h-5 w-5 text-white" />
            </span>
            Connecta<span className="text-primary">Sys</span>
          </span>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#planos" className="transition-colors hover:text-foreground">
              Planos
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              Perguntas
            </a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Button asChild variant="ghost" size="sm" className="font-medium">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
            >
              <Link to="/auth" search={{ tab: "cadastro" }}>
                Criar conta
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pt-20 pb-16 sm:pt-32 sm:pb-24">
          <Blob className="pointer-events-none absolute -top-24 -left-32 h-[28rem] w-[28rem] animate-pulse text-primary/15" />
          <Blob className="pointer-events-none absolute -right-24 top-10 h-80 w-80 text-accent/15" />

          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-wider text-primary uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Sistema multitenant para oficinas
            </span>

            <h1 className="mt-7 text-5xl leading-[1.02] font-bold tracking-tight sm:text-7xl lg:text-[5.5rem]">
              A oficina inteira em{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  um só painel
                </span>
                <svg
                  aria-hidden
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 9 Q 75 2, 150 6 T 298 5"
                    stroke="url(#underline-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underline-grad" x1="0" x2="1">
                      <stop
                        offset="0%"
                        stopColor="currentColor"
                        className="[color:var(--primary)]"
                      />
                      <stop
                        offset="100%"
                        stopColor="currentColor"
                        className="[color:var(--accent)]"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Ordens de serviço, agenda de box, estoque de peças e financeiro. O ConnectaSys tira a
              gestão do caderno e coloca sua equipe no mesmo ritmo.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-bold shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-primary/50"
              >
                <Link to="/auth" search={{ tab: "cadastro" }}>
                  Começar teste de 14 dias
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2 px-8 font-semibold transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <Link to="/auth">Já sou cliente</Link>
              </Button>
            </div>

            <div className="mt-14 flex flex-wrap justify-center gap-10 sm:gap-14">
              {[
                ["1.240", "oficinas ativas"],
                ["380 mil", "OS emitidas"],
                ["4,9/5", "satisfação"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                    {n}
                  </p>
                  <p className="mt-1 text-sm font-medium tracking-wide text-muted-foreground uppercase">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="absolute inset-x-10 top-8 -z-10 h-full rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-chart-5/15 to-accent/20 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-sm">
              <ProductPreview />
            </div>

            <div className="absolute -bottom-8 -left-6 hidden animate-bounce items-center gap-3 rounded-2xl border border-border/60 bg-card/90 px-5 py-4 shadow-2xl backdrop-blur-md sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                <Star className="h-5 w-5 fill-current" />
              </span>
              <div>
                <p className="text-sm font-bold">4,9 de 5</p>
                <p className="text-xs text-muted-foreground">avaliação das oficinas</p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 hidden items-center gap-3 rounded-2xl border border-border/60 bg-card/90 px-5 py-4 shadow-2xl backdrop-blur-md sm:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-4 text-white shadow-lg">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold">Setup em 5 min</p>
                <p className="text-xs text-muted-foreground">comece a usar hoje</p>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="border-y border-border/60 bg-gradient-to-r from-primary/[0.03] via-transparent to-accent/[0.03] py-10">
          <p className="mb-6 text-center text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Oficinas que já organizam a operação com o ConnectaSys
          </p>
          <Marquee items={oficinasFicticias} />
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="mx-auto max-w-6xl px-5 py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase">
              Módulos
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight">
              Tudo que a oficina precisa
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Módulos que conversam entre si — sem planilha paralela, sem informação perdida.
            </p>
          </div>

          <div className="mt-14 grid auto-rows-[minmax(0,1fr)] gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recursos.map(({ icon: Icon, t, d, cor, span }) => {
              const c = corMap[cor];
              return (
                <div
                  key={t}
                  className={`group relative rounded-3xl border border-border/60 bg-card/60 p-7 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${c.glow} ${span ? "sm:col-span-2" : ""}`}
                >
                  <div
                    className={`absolute inset-0 rounded-3xl ${c.bg} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <span
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} ${c.text} shadow-lg ${c.glow} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold">{t}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{d}</p>
                  </div>
                </div>
              );
            })}

            <a
              href="#planos"
              className="group relative flex flex-col justify-between rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 transition-transform group-hover:scale-110">
                <ArrowRight className="h-7 w-7 transition-transform group-hover:translate-x-1" />
              </span>
              <div>
                <h3 className="mt-5 text-xl font-bold">Ver todos os módulos</h3>
                <p className="mt-3 text-muted-foreground">
                  Conheça os planos disponíveis e escolha o ideal para sua oficina.
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="relative overflow-hidden px-5 py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-accent/[0.03]" />
          <Blob className="pointer-events-none absolute -top-16 -left-20 h-72 w-72 text-primary/10" />
          <Blob className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 text-accent/10" />

          <div className="relative mx-auto max-w-6xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
                Planos
              </span>
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight">
                Um plano pra cada tamanho de oficina
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Sem fidelidade. Cancele quando quiser.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:items-start">
              {planos.map((p) => {
                const c = corMap[p.cor];
                return (
                  <div
                    key={p.nome}
                    className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 ${
                      p.destaque
                        ? "border-primary/40 bg-gradient-to-b from-primary/10 via-card to-card shadow-2xl shadow-primary/15 lg:-translate-y-4 lg:scale-105"
                        : "border-border/60 bg-card/80 shadow-lg backdrop-blur-sm hover:-translate-y-2 hover:shadow-xl"
                    }`}
                  >
                    {p.destaque && (
                      <span className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/30">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        Mais popular
                      </span>
                    )}

                    <span
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                        p.destaque
                          ? "bg-primary text-white shadow-lg shadow-primary/25"
                          : `${c.bg} ${c.text}`
                      }`}
                    >
                      <p.icon className="h-7 w-7" />
                    </span>

                    <h3 className="mt-6 text-2xl font-bold">{p.nome}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{p.desc}</p>

                    <div className="mt-8">
                      <p className="text-5xl font-black tracking-tight">
                        {p.preco}
                        <span className="ml-1 text-lg font-medium text-muted-foreground">/mês</span>
                      </p>
                    </div>

                    <div className="mt-8 flex-1 border-t border-border/60 pt-8">
                      <ul className="space-y-4">
                        {p.itens.map((i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${p.destaque ? "bg-primary/15" : c.bg}`}
                            >
                              <Check
                                className={`h-3.5 w-3.5 ${p.destaque ? "text-primary" : c.text}`}
                              />
                            </span>
                            <span className="text-muted-foreground">{i}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      asChild
                      className={`mt-8 rounded-full font-bold transition-all duration-300 ${
                        p.destaque
                          ? "shadow-lg shadow-primary/25 hover:scale-105 hover:shadow-primary/40"
                          : "border-2 hover:border-primary/30 hover:bg-primary/5"
                      }`}
                      variant={p.destaque ? "default" : "outline"}
                    >
                      <Link to="/auth" search={{ tab: "cadastro" }}>
                        Assinar {p.nome}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-28">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase">
              Dúvidas
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight">Perguntas frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((item, idx) => (
              <div
                key={idx}
                className={`overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 ${
                  openFaq === idx ? "shadow-lg" : "shadow-sm hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-bold">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === idx ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-6 leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-28">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-chart-5 to-accent px-8 py-20 text-center shadow-2xl shadow-primary/20 sm:px-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
            <Blob className="pointer-events-none absolute -top-16 -left-10 h-64 w-64 text-white/10" />

            <div className="pointer-events-none absolute -right-10 -bottom-10 hidden w-56 opacity-20 sm:block">
              <OficinaIllustration />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Pronto para organizar sua oficina?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/90">
                Comece hoje com 14 dias grátis. Sem cartão de crédito, sem burocracia.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-10 rounded-full px-10 font-bold shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link to="/auth" search={{ tab: "cadastro" }}>
                  Criar minha conta
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-gradient-to-b from-transparent to-primary/[0.03] px-5 py-10 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <span className="font-medium">© 2026 ConnectaSys — Gestão para oficinas mecânicas</span>
          <Link to="/auth" className="font-medium transition-colors hover:text-foreground">
            Acessar sistema →
          </Link>
        </div>
      </footer>
    </div>
  );
}
