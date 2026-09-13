type MarqueeProps = {
  items: string[];
};

export function Marquee({ items }: MarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="animate-marquee flex w-max gap-3">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:border-accent/40 hover:text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent to-primary" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
