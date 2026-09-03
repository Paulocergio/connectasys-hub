import { Shield, Wrench, Headset, Banknote, User } from "lucide-react";
import { cn } from "@/lib/utils";

const CONFIG: Record<string, { icon: typeof User; bg: string; fg: string }> = {
  admin: { icon: Shield, bg: "bg-status-info-bg", fg: "text-status-info-fg" },
  mecânico: { icon: Wrench, bg: "bg-status-warning-bg", fg: "text-status-warning-fg" },
  recepcionista: { icon: Headset, bg: "bg-status-neutral-bg", fg: "text-status-neutral-fg" },
  financeiro: { icon: Banknote, bg: "bg-status-success-bg", fg: "text-status-success-fg" },
};

export function RoleBadge({ role }: { role: string }) {
  const {
    icon: Icon,
    bg,
    fg,
  } = CONFIG[role.trim().toLowerCase()] ?? {
    icon: User,
    bg: "bg-muted",
    fg: "text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        bg,
        fg,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {role}
    </span>
  );
}
