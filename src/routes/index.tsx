import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Check,
  Gauge,
  Star,
  ArrowRight,
  Building2,
  ChevronDown,
  Sparkles,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Blob } from "@/components/landing/Blob";
import { OficinaIllustration } from "@/components/landing/OficinaIllustration";
import { BentoGrid } from "@/components/landing/BentoGrid";
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

const depoimentos = [
  {
    nome: "Marcos Silva",
    cargo: "Auto Center Silva",
    texto:
      "Trocamos três planilhas e um caderno por um painel só. Hoje eu sei o status de cada OS sem levantar da cadeira.",
    iniciais: "MS",
    cor: "primary",
  },
  {
    nome: "Camila Rocha",
    cargo: "Rápido Motors",
    texto:
      "O alerta de estoque mínimo já evitou parar serviço no meio por falta de peça. Pagou a assinatura no primeiro mês.",
    iniciais: "CR",
    cor: "accent",
  },
  {
    nome: "José Almeida",
    cargo: "Oficina do Zé",
    texto:
      "Minha equipe não é grande fã de sistema, mas esse pegaram rápido. A agenda visual fez toda diferença no dia a dia.",
    iniciais: "JA",
    cor: "chart4",
  },
] as const;

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
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
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
            <a href="#depoimentos" className="transition-colors hover:text-foreground">
              Depoimentos
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
        <section className="relative overflow-hidden px-5 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem]" />
          <Blob className="pointer-events-none absolute -top-24 -left-32 h-96 w-96 text-primary/8" />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="animate-in fade-in slide-in-from-bottom-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-xs font-bold tracking-wider text-primary uppercase duration-700">
              <Sparkles className="h-3.5 w-3.5" />
              Sistema multitenant para oficinas
            </span>

            <h1 className="animate-in fade-in slide-in-from-bottom-6 mt-7 text-5xl leading-[1.02] font-bold tracking-tight delay-100 duration-700 fill-mode-both sm:text-6xl lg:text-7xl">
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

            <p className="animate-in fade-in slide-in-from-bottom-6 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground delay-200 duration-700 fill-mode-both">
              Ordens de serviço, agenda de box, estoque de peças e financeiro. O ConnectaSys tira a
              gestão do caderno e coloca sua equipe no mesmo ritmo.
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-6 mt-10 flex flex-wrap justify-center gap-4 delay-300 duration-700 fill-mode-both">
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

            <div className="animate-in fade-in mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 delay-500 duration-700 fill-mode-both">
              {[
                ["1.240", "oficinas ativas"],
                ["380 mil", "OS emitidas"],
                ["4,9/5", "satisfação"],
              ].map(([n, l], i) => (
                <div key={l} className="flex items-center gap-8">
                  {i > 0 && <span className="hidden h-8 w-px bg-border sm:block" />}
                  <p className="flex items-baseline gap-1.5 font-mono text-sm text-muted-foreground">
                    <span className="text-base font-bold text-foreground">{n}</span>
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            id="recursos"
            className="animate-in fade-in slide-in-from-bottom-8 relative mx-auto mt-16 max-w-5xl scroll-mt-24 delay-500 duration-1000 fill-mode-both"
          >
            <BentoGrid />
          </div>
        </section>

        {/* MARQUEE */}
        <section className="border-y border-border/60 bg-gradient-to-r from-primary/[0.03] via-transparent to-accent/[0.03] py-10">
          <p className="mb-6 text-center font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Oficinas que já organizam a operação com o ConnectaSys
          </p>
          <Marquee items={oficinasFicticias} />
        </section>

        {/* DEPOIMENTOS */}
        <section id="depoimentos" className="mx-auto max-w-6xl px-5 py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-chart-4/30 bg-chart-4/10 px-3 py-1 font-mono text-xs font-bold tracking-wider text-chart-4 uppercase">
              Quem já usa
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight">
              Oficinas de verdade, resultado de verdade
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Donos de oficina que trocaram o caderno pelo ConnectaSys.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {depoimentos.map((d) => {
              const c = corMap[d.cor];
              return (
                <div
                  key={d.nome}
                  className="flex flex-col rounded-2xl border border-border bg-card/80 p-6 transition-colors hover:border-border/100"
                >
                  <div className="flex gap-0.5 text-chart-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 leading-relaxed text-foreground/90">“{d.texto}”</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${c.bg} ${c.text}`}
                    >
                      {d.iniciais}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{d.nome}</p>
                      <p className="font-mono text-xs text-muted-foreground">{d.cargo}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="relative overflow-hidden px-5 py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-accent/[0.03]" />
          <Blob className="pointer-events-none absolute -top-16 -left-20 h-72 w-72 text-primary/6" />
          <Blob className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 text-accent/6" />

          <div className="relative mx-auto max-w-6xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs font-bold tracking-wider text-primary uppercase">
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
                    className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                      p.destaque
                        ? "border-primary/50 bg-card shadow-xl shadow-primary/10 lg:-translate-y-3"
                        : "border-border bg-card/80 hover:-translate-y-1 hover:border-border/100"
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
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs font-bold tracking-wider text-accent uppercase">
              Dúvidas
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight">Perguntas frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((item, idx) => (
              <div
                key={idx}
                className={`overflow-hidden rounded-2xl border bg-card/80 transition-colors duration-300 ${
                  openFaq === idx ? "border-primary/30" : "border-border hover:border-border/100"
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
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-8 py-20 text-center shadow-2xl shadow-primary/20 sm:px-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/30" />
            <Blob className="pointer-events-none absolute -top-16 -left-10 h-64 w-64 text-white/10" />

            <div className="pointer-events-none absolute -right-6 -bottom-12 hidden w-72 opacity-30 drop-shadow-2xl sm:block">
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

      <footer className="border-t border-border/40 bg-gradient-to-b from-transparent to-foreground/[0.02] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
            <div>
              <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                  <Gauge className="h-4 w-4 text-white" />
                </span>
                <span>
                  Connecta<span className="text-primary">Sys</span>
                </span>
              </Link>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Gestão completa para oficinas mecânicas. Feito para quem vive o dia a dia da
                oficina.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a
                href="#recursos"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Recursos
              </a>
              <a
                href="#depoimentos"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Depoimentos
              </a>
              <a
                href="#planos"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Planos
              </a>
              <a
                href="#faq"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Perguntas
              </a>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-primary"
              >
                Acessar sistema
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row">
            <span>© 2026 ConnectaSys — Gestão para oficinas mecânicas</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              Todos os sistemas operacionais
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
