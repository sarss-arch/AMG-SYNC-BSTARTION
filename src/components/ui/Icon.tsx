import type { ReactNode } from "react";

type IconName =
  | "grid" | "decision" | "chart" | "pulse" | "link" | "users" | "truck"
  | "cart" | "factory" | "leaf" | "process" | "box" | "store"
  | "fingerprint" | "refresh" | "check" | "bars" | "database" | "shield"
  | "bell" | "logout" | "arrow" | "swap" | "clock" | "search";

const paths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  decision: <><path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.5 14.5A7 7 0 1 1 15.5 14.5C14.4 15.2 14 16 14 17h-4c0-1-.4-1.8-1.5-2.5Z"/></>,
  chart: <><path d="M3 3v18h18"/><path d="m6 15 4-5 4 3 5-7"/></>,
  pulse: <><path d="M3 12h4l2-5 4 10 2-5h6"/></>,
  link: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/></>,
  users: <><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7"/><path d="M16 4a4 4 0 0 1 0 8"/><path d="M18 14c2.5.8 4 3 4 7"/></>,
  truck: <><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
  cart: <><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.2 10h10.7l2-7H7"/></>,
  factory: <><path d="M3 21V10l6 3v-3l6 3V6h6v15Z"/><path d="M7 17h2M12 17h2M17 17h2"/></>,
  leaf: <><path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M5 20c2-5 6-8 11-10"/></>,
  process: <><path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="2"/><circle cx="16" cy="17" r="2"/></>,
  box: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5M3 8v8l9 5 9-5V8M12 13v8"/></>,
  store: <><path d="M4 10v10h16V10"/><path d="M3 10 5 4h14l2 6"/><path d="M8 20v-6h8v6"/></>,
  fingerprint: <><path d="M12 11a3 3 0 0 1 3 3c0 3-1 5-2 7"/><path d="M8 21c2-4 1-9 4-12"/><path d="M5 18c1-3 0-7 2-10 3-4 9-4 12 0"/><path d="M4 13c0-6 3-10 8-10 6 0 9 4 9 10"/></>,
  refresh: <><path d="M20 7V3l-3 3a8 8 0 1 0 2 9"/><path d="M20 3h-5"/></>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  bars: <><path d="M5 20V10M12 20V4M19 20v-7"/></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
  shield: <><path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="m9 12 2 2 4-4"/></>,
  bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  logout: <><path d="M10 4H4v16h6"/><path d="m14 8 4 4-4 4M18 12H9"/></>,
  arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
  swap: <><path d="M7 7h12l-3-3M17 17H5l3 3"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>
};

export function Icon({ name, size = 18, className = "" }: { name: IconName | string; size?: number; className?: string }) {
  const node = paths[name as IconName] ?? paths.grid;
  return (
    <svg
      className={className}
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      {node}
    </svg>
  );
}
