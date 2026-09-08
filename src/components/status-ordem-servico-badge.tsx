import { CircleDot, Loader2, PackageSearch, CheckCircle2, XCircle } from "@/components/icons";
import { cn } from "@/lib/utils";

export type StatusOrdemServico =
  "Aberto" | "Em Andamento" | "Aguardando Peça" | "Concluído" | "Cancelado";

const CONFIG: Record<StatusOrdemServico, { icon: typeof CircleDot; bg: string; fg: string }> = {
  Aberto: {
    icon: CircleDot,
    bg: "bg-status-warning-bg",
    fg: "text-status-warning-fg",
  },
  "Em Andamento": {
    icon: Loader2,
    bg: "bg-accent",
    fg: "text-accent-foreground",
  },
  "Aguardando Peça": {
    icon: PackageSearch,
    bg: "bg-status-warning-bg",
    fg: "text-status-warning-fg",
  },
  Concluído: {
    icon: CheckCircle2,
    bg: "bg-status-success-bg",
    fg: "text-status-success-fg",
  },
  Cancelado: {
    icon: XCircle,
    bg: "bg-status-danger-bg",
    fg: "text-status-danger-fg",
  },
};

export function StatusOrdemServicoBadge({ status }: { status: StatusOrdemServico }) {
  const { icon: Icon, bg, fg } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        bg,
        fg,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}
