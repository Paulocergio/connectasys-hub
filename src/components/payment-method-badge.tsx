import { CreditCard, Zap, Barcode, Banknote, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const CONFIG: Record<string, { icon: typeof Banknote; bg: string; fg: string }> = {
  cartão: { icon: CreditCard, bg: "bg-status-info-bg", fg: "text-status-info-fg" },
  pix: { icon: Zap, bg: "bg-status-neutral-bg", fg: "text-status-neutral-fg" },
  boleto: { icon: Barcode, bg: "bg-status-warning-bg", fg: "text-status-warning-fg" },
  dinheiro: { icon: Banknote, bg: "bg-status-success-bg", fg: "text-status-success-fg" },
};

function Pill({
  icon: Icon,
  bg,
  fg,
  label,
}: {
  icon: typeof Banknote;
  bg: string;
  fg: string;
  label: string;
}) {
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

export function PaymentMethodBadge({ formaPagamento }: { formaPagamento: string | null }) {
  if (!formaPagamento) {
    return <Pill icon={Minus} bg="bg-muted" fg="text-muted-foreground" label="Não informado" />;
  }

  const { icon, bg, fg } = CONFIG[formaPagamento.trim().toLowerCase()] ?? {
    icon: Banknote,
    bg: "bg-muted",
    fg: "text-muted-foreground",
  };
  return <Pill icon={icon} bg={bg} fg={fg} label={formaPagamento} />;
}
