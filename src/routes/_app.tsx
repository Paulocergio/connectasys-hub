import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Gauge,
  LayoutDashboard,
  Users,
  Wallet,
  HandCoins,
  Contact,
  Car,
  Wrench,
  Package,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
} from "@/components/icons";
import { getSessao, useConnecta } from "@/lib/connecta-store";
import { useTema } from "@/lib/tema";
import { podeAcessar, type Pagina } from "@/lib/permissoes";
import { getInitials } from "@/lib/initials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: () => {
    if (!getSessao()) throw redirect({ to: "/auth" });
  },
  component: AppLayout,
});

const itens: { to: string; label: string; icon: typeof LayoutDashboard; pagina: Pagina }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, pagina: "dashboard" },
  { to: "/contas-a-pagar", label: "Contas a Pagar", icon: Wallet, pagina: "contas-a-pagar" },
  {
    to: "/contas-a-receber",
    label: "Contas a Receber",
    icon: HandCoins,
    pagina: "contas-a-receber",
  },
  { to: "/clientes", label: "Clientes", icon: Contact, pagina: "clientes" },
  { to: "/veiculos", label: "Veículos", icon: Car, pagina: "veiculos" },
  { to: "/ordens-servico", label: "Ordens de Serviço", icon: Wrench, pagina: "ordens-servico" },
  { to: "/calendario", label: "Calendário", icon: CalendarClock, pagina: "calendario" },
  { to: "/estoque", label: "Estoque", icon: Package, pagina: "estoque" },
  { to: "/usuarios", label: "Usuários", icon: Users, pagina: "usuarios" },
];

function AppLayout() {
  const [aberta, setAberta] = useState(true);
  const { sessao, logout } = useConnecta();
  const { tema, setTema } = useTema(sessao);
  const navigate = useNavigate();
  const itensVisiveis = itens.filter((item) => podeAcessar(sessao?.papel, item.pagina));

  useEffect(() => {
    document.documentElement.classList.toggle("light", tema === "light");
    return () => {
      document.documentElement.classList.remove("light");
    };
  }, [tema]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 print:hidden ${
          aberta ? "w-64" : "w-[72px]"
        }`}
      >
        <div className="flex h-16 items-center px-4">
          {aberta ? (
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Gauge className="h-6 w-6 shrink-0 text-primary" />
                <span className="truncate font-semibold">
                  Connecta<span className="text-primary">Sys</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAberta((v) => !v)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAberta((v) => !v)}
              className="mx-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {itensVisiveis.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              title={label}
              activeProps={{ className: "bg-sidebar-primary/10 text-sidebar-primary" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Icon className="h-5 w-5 shrink-0" />
              {aberta && <span className="truncate">{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => setTema(tema === "light" ? "dark" : "light")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {tema === "light" ? (
              <Moon className="h-5 w-5 shrink-0" />
            ) : (
              <Sun className="h-5 w-5 shrink-0" />
            )}
            {aberta && <span>{tema === "light" ? "Modo escuro" : "Modo claro"}</span>}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {getInitials(sessao?.nome)}
                  </AvatarFallback>
                </Avatar>
                {aberta && (
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">
                      {sessao?.nome}
                    </span>
                    <span className="block truncate text-xs capitalize">{sessao?.papel}</span>
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuLabel>
                <p className="truncate text-sm font-medium">{sessao?.nome}</p>
                <p className="truncate text-xs font-normal text-muted-foreground capitalize">
                  {sessao?.papel}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate({ to: "/auth", replace: true });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
