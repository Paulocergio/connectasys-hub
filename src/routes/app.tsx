import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Gauge,
  LayoutDashboard,
  Users,
  Wrench,
  Package,
  Receipt,
  CalendarClock,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { getSessao, useConnecta } from "@/lib/connecta-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app")({
  ssr: false,
  beforeLoad: () => {
    if (!getSessao()) throw redirect({ to: "/auth" });
  },
  component: AppLayout,
});

const itens = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/usuarios", label: "Usuários", icon: Users },
  { to: "/app/ordens", label: "Ordens de serviço", icon: Wrench },
  { to: "/app/agenda", label: "Agenda", icon: CalendarClock },
  { to: "/app/estoque", label: "Estoque", icon: Package },
  { to: "/app/financeiro", label: "Financeiro", icon: Receipt },
] as const;

function AppLayout() {
  const [aberta, setAberta] = useState(true);
  const { sessao, logout } = useConnecta();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ${
          aberta ? "w-64" : "w-[72px]"
        }`}
      >
        <div className="flex h-16 items-center gap-2 px-4">
          <Gauge className="h-6 w-6 shrink-0 text-primary" />
          {aberta && (
            <span className="truncate font-semibold">
              Connecta<span className="text-primary">Sys</span>
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {itens.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              title={label}
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Icon className="h-5 w-5 shrink-0" />
              {aberta && <span className="truncate">{label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => setAberta((v) => !v)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {aberta ? (
              <PanelLeftClose className="h-5 w-5 shrink-0" />
            ) : (
              <PanelLeftOpen className="h-5 w-5 shrink-0" />
            )}
            {aberta && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{sessao?.oficina}</p>
            <p className="truncate text-xs text-muted-foreground">
              {sessao?.nome} · {sessao?.papel}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate({ to: "/auth", replace: true });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
