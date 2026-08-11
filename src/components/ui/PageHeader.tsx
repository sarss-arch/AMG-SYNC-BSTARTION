import type { ReactNode } from "react";

export function PageHeader({
  title, subtitle, meta
}: { title: string; subtitle: string; meta?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <div className="page-subtitle">{subtitle}</div>
      </div>
      {meta ? <div className="meta-row">{meta}</div> : null}
    </header>
  );
}
