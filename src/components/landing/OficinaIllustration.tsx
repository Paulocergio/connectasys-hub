export function OficinaIllustration() {
  return (
    <svg
      viewBox="0 0 480 400"
      className="h-auto w-full"
      role="img"
      aria-label="Carro sobre elevador em uma oficina"
    >
      <ellipse cx="240" cy="336" rx="170" ry="24" className="fill-accent/25" />

      <rect x="76" y="96" width="18" height="216" rx="9" className="fill-muted-foreground/50" />
      <rect x="386" y="96" width="18" height="216" rx="9" className="fill-muted-foreground/50" />
      <rect x="94" y="246" width="76" height="16" rx="8" className="fill-muted-foreground/50" />
      <rect x="310" y="246" width="76" height="16" rx="8" className="fill-muted-foreground/50" />

      <path d="M162 190 L200 132 L280 132 L318 190 Z" className="fill-primary" />
      <rect x="128" y="182" width="224" height="88" rx="26" className="fill-primary" />
      <rect x="150" y="270" width="180" height="14" rx="7" className="fill-primary/70" />

      <rect x="203" y="140" width="76" height="42" rx="10" className="fill-background" />
      <line x1="241" y1="140" x2="241" y2="182" className="stroke-primary" strokeWidth="4" />

      <circle cx="176" cy="272" r="28" className="fill-foreground" />
      <circle cx="176" cy="272" r="11" className="fill-background" />
      <circle cx="304" cy="272" r="28" className="fill-foreground" />
      <circle cx="304" cy="272" r="11" className="fill-background" />

      <circle cx="348" cy="206" r="8" className="fill-background" />
      <rect x="128" y="222" width="18" height="10" rx="5" className="fill-background/70" />

      <g transform="translate(60 40)">
        <circle cx="0" cy="0" r="34" className="fill-accent/20" />
        <path
          d="M4 -14a10 10 0 0 0-13 13l-16 16 5 5 16-16a10 10 0 0 0 13-13z"
          className="fill-accent"
          transform="translate(0 0) scale(1.1)"
        />
      </g>

      <g transform="translate(410 60)">
        <circle cx="0" cy="0" r="26" className="fill-primary/20" />
        <circle cx="0" cy="0" r="6" className="fill-primary" />
      </g>
    </svg>
  );
}
