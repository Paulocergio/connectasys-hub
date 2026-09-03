import { Gauge, CalendarClock, Wrench, Package, Receipt } from "lucide-react";

const navIcons = [Gauge, CalendarClock, Wrench, Package, Receipt];

const stats = [
  ["R$ 8.420", "Faturado hoje"],
  ["24", "OS em aberto"],
  ["96%", "No prazo"],
];

const ordens = [
  {
    veiculo: "Gol 1.6 · Placa ABC-1234",
    servico: "Troca de óleo",
    status: "Em andamento",
    cor: "text-primary",
  },
  {
    veiculo: "HB20 · Placa XYZ-5678",
    servico: "Revisão completa",
    status: "Aguardando peça",
    cor: "text-accent",
  },
  {
    veiculo: "Onix · Placa JKL-9012",
    servico: "Alinhamento",
    status: "Concluído",
    cor: "text-muted-foreground",
  },
];

export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="ml-3 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
          app.connectasys.com.br
        </span>
      </div>

      <div className="flex">
        <div className="hidden w-14 flex-col items-center gap-4 border-r border-border bg-muted/20 py-5 sm:flex">
          {navIcons.map((Icon, i) => (
            <span
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>

        <div className="flex-1 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Ordens de serviço</p>
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
              +12 hoje
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {stats.map(([v, l]) => (
              <div key={l} className="rounded-xl border border-border bg-background p-3">
                <p className="text-lg font-bold">{v}</p>
                <p className="text-[11px] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {ordens.map((o) => (
              <div
                key={o.veiculo}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{o.veiculo}</p>
                  <p className="text-xs text-muted-foreground">{o.servico}</p>
                </div>
                <span className={`text-xs font-medium ${o.cor}`}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
