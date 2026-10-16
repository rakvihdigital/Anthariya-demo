import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { StageBackdrop } from "./StageBackdrop";

/** Page header on the red curtain stage, centred like a stage title (About, Contact). */
export function PageHero({ crumb, title, lead, style, compact = false }: { crumb: string; title: ReactNode; lead: string; style?: CSSProperties; compact?: boolean }) {
  return (
    <section className={`page-hero page-hero--stage on-dark${compact ? " page-hero--compact" : ""}`} style={style}>
      <StageBackdrop />
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">{crumb}</span></nav>
        <h1 className="display">{title}</h1>
        <p className="lead">{lead}</p>
      </div>
    </section>
  );
}
