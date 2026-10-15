import Image from "next/image";
import type { ReactNode } from "react";
import { IMAGES } from "@/lib/images";
import { Reveal } from "./Reveal";

/** Centered section heading: optional crown crest, eyebrow, title and lead. */
export function SectionHead({ crest, script, eyebrow, title, lead, gold = false, light = false }: {
  crest?: "plum" | "gold"; /** a large, faint script word set behind the heading */ script?: string; eyebrow: string; title: ReactNode; lead?: string; gold?: boolean; light?: boolean;
}) {
  return (
    <Reveal as="header" className="sec-head" variant="stagger">
      {script && <span className="sec-head__script" aria-hidden="true">{script}</span>}
      {crest && <Image className="sec-head__crest" src={crest === "gold" ? IMAGES.crestGold : IMAGES.crestPlum} alt="" sizes="90px" />}
      <span className={`eyebrow eyebrow--center${gold ? " eyebrow--gold" : ""}`}>{eyebrow}</span>
      <h2 className="h2" style={light ? { color: "var(--ivory)" } : undefined}>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}
