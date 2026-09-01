import { Construction } from "lucide-react";

export function EmModulo({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
        <p className="text-sm text-muted-foreground">{descricao}</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 px-6 py-20 text-center">
        <Construction className="h-8 w-8 text-primary" />
        <p className="mt-4 font-medium">Módulo em construção</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Esta área faz parte do roadmap do ConnectaSys e será liberada em breve.
        </p>
      </div>
    </div>
  );
}
