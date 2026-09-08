import { CheckCircle2, Clock, AlertCircle } from "@/components/icons";
import { cn } from "@/lib/utils";

export type StatusFinanceiro = "Pendente" | "Paga" | "Atrasada";

const CONFIG: Record<
  StatusFinanceiro,
  { label: string; icon: typeof Clock; bg: string; fg: string }
> = {
  Paga: {
    label: "Paga",
    icon: CheckCircle2,
    bg: "bg-status-success-bg",
    fg: "text-status-success-fg",
  },
  Pendente: {
    label: "Pendente",
    icon: Clock,
    bg: "bg-status-warning-bg",
    fg: "text-status-warning-fg",
  },
  Atrasada: {
    label: "Atrasada",
    icon: AlertCircle,
    bg: "bg-status-danger-bg",
    fg: "text-status-danger-fg",
  },
};

export function StatusBadge({ status }: { status: StatusFinanceiro }) {
  const { label, icon: Icon, bg, fg } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        bg,
        fg,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
