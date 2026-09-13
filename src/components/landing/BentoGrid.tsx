import { CalendarClock, Package, Receipt, BarChart3, TrendUp } from "@/components/icons";
import { ProductPreview } from "@/components/landing/ProductPreview";

function TileHeader({ icon: Icon, label }: { icon: typeof CalendarClock; label: string }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

function AgendaTile() {
  const slots = [
    { h: "09:00", s: "Troca de óleo", t: "Carlos", cor: "bg-primary" },
    { h: "10:30", s: "Revisão completa", t: "Ana", cor: "bg-accent" },
    { h: "14:00", s: "Alinhamento", t: "Bruno", cor: "bg-chart-4" },
  ];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-4">
      <TileHeader icon={CalendarClock} label="Agenda de hoje" />
      <div className="mt-3 flex-1 space-y-2">
        {slots.map((s) => (
          <div key={s.h} className="flex items-center gap-2 text-xs">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.cor}`} />
            <span className="font-mono text-muted-foreground">{s.h}</span>
            <span className="truncate font-medium">{s.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EstoqueTile() {
  const itens = [
    { n: "Óleo 5W30", p: 72, cor: "bg-primary" },
    { n: "Pastilha freio", p: 22, cor: "bg-destructive" },
    { n: "Filtro de ar", p: 95, cor: "bg-accent" },
  ];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-4">
      <TileHeader icon={Package} label="Estoque" />
      <div className="mt-3 flex-1 space-y-2.5">
        {itens.map((i) => (
          <div key={i.n}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="truncate text-muted-foreground">{i.n}</span>
              <span className="font-mono font-medium">{i.p}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${i.cor}`} style={{ width: `${i.p}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceiroTile() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-4">
      <TileHeader icon={Receipt} label="Financeiro" />
      <div className="mt-3 flex-1 space-y-3">
        <div>
          <p className="text-[11px] text-muted-foreground">Receita hoje</p>
          <p className="flex items-baseline gap-1.5 text-lg font-bold">
            R$ 8.420
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-accent">
              <TrendUp className="h-3 w-3" />
              12%
            </span>
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">A pagar essa semana</p>
          <p className="text-lg font-bold text-foreground/80">R$ 2.140</p>
        </div>
      </div>
    </div>
  );
}

function IndicadoresTile() {
  const barras = [40, 65, 50, 80, 60, 95, 70];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-4">
      <TileHeader icon={BarChart3} label="OS por dia" />
      <div className="mt-3 flex flex-1 items-end gap-1.5">
        {barras.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${i === barras.length - 1 ? "bg-primary" : "bg-primary/25"}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:h-[440px] sm:grid-cols-4 sm:grid-rows-[repeat(2,minmax(0,1fr))]">
      <div className="sm:col-span-2 sm:row-span-2">
        <div className="h-full overflow-hidden rounded-2xl border border-border shadow-xl">
          <ProductPreview />
        </div>
      </div>
      <AgendaTile />
      <EstoqueTile />
      <FinanceiroTile />
      <IndicadoresTile />
    </div>
  );
}
