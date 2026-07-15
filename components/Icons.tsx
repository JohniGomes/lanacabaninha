type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconHome({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

export function IconCalendar({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

export function IconBox({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M21 8 12 3 3 8l9 5 9-5Z" />
      <path d="M3 8v9l9 5 9-5V8" />
      <path d="M12 13v9" />
    </svg>
  );
}

export function IconWallet({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z" />
      <path d="M16 13h.01" />
    </svg>
  );
}

export function IconLogOut({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconTrendingUp({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </svg>
  );
}

export function IconTrendingDown({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m3 7 6 6 4-4 8 8" />
      <path d="M17 17h4v-4" />
    </svg>
  );
}

export function IconBasket({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 10h16l-1.5 9a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 10Z" />
      <path d="m8 10 2-6h4l2 6" />
      <path d="M9 14v3M15 14v3" />
    </svg>
  );
}

export function IconLink({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m9 15 6-6" />
      <path d="M11 6 12.5 4.5a3.5 3.5 0 1 1 5 5L16 11" />
      <path d="m13 18-1.5 1.5a3.5 3.5 0 1 1-5-5L8 13" />
    </svg>
  );
}

export function IconTrash({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="m6 7 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

export function IconCheckCircle({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function IconAlertTriangle({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function IconArrowLeft({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function IconClock({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
