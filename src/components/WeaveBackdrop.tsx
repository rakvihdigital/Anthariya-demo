import type { CSSProperties } from "react";

/**
 * Backdrop for the "Shop by Weave" section: a crimson ground with gold temple borders
 * (top and bottom), hanging kolam chains, sparkles, and faint line mandalas (chakras)
 * that turn slowly. Purely decorative.
 */

/** A line mandala drawn in a 200×200 box centred on 0,0. `petals` changes its character. */
export function Mandala({ petals }: { petals: number }) {
  const ring = (n: number, d: string, key: string) =>
    Array.from({ length: n }, (_, k) => <path key={`${key}${k}`} d={d} transform={`rotate(${(360 / n) * k})`} />);
  const dots = Array.from({ length: petals * 2 }, (_, k) => {
    const a = (k / (petals * 2)) * Math.PI * 2;
    return <circle key={`d${k}`} cx={Math.round(Math.sin(a) * 35000) / 1000} cy={Math.round(-Math.cos(a) * 35000) / 1000} r={1.3} />;
  });
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
      <circle r={30} className="chakra__disc" />
      <g className="chakra__lines">
        {ring(petals, "M0-68C11-76 11-90 0-98C-11-90-11-76 0-68Z", "o")}
        {ring(petals, "M0-70C6-75 6-82 0-87C-6-82-6-75 0-70Z", "oi")}
        {ring(petals * 2, "M-9.2-65A9.2 9.2 0 0 0 9.2-65", "s")}
        <circle r={66} />
        {ring(petals, "M0-40C14-46 14-58 0-64C-14-58-14-46 0-40Z", "m")}
        {ring(petals, "M0-46C7-50 7-56 0-59C-7-56-7-50 0-46Z", "mi")}
        <circle r={38} />
        {dots}
        <circle r={30} />
        {ring(8, "M0-12C6-17 6-24 0-28C-6-24-6-17 0-12Z", "c")}
        <circle r={9} />
        <circle r={4} />
      </g>
    </svg>
  );
}

// positions follow the original artwork (x, y as % of the section; size as % of its height)
const CHAKRAS: { x: number; y: number; s: number; petals: number; dur: number; rev?: boolean }[] = [
  { x: 49.4, y: 40, s: 58, petals: 16, dur: 140 },
  { x: 8.9, y: 29, s: 43, petals: 12, dur: 110, rev: true },
  { x: 91, y: 29, s: 42, petals: 12, dur: 115 },
  { x: 20.8, y: 56, s: 33, petals: 14, dur: 90 },
  { x: 77.8, y: 55, s: 35, petals: 14, dur: 95, rev: true },
  { x: 3, y: 78, s: 48, petals: 16, dur: 130 },
  { x: 97, y: 78, s: 48, petals: 16, dur: 125, rev: true },
  { x: 32.7, y: 85, s: 43, petals: 12, dur: 105, rev: true },
  { x: 66.1, y: 80, s: 43, petals: 12, dur: 100 },
  { x: 32.4, y: 49, s: 14, petals: 10, dur: 55 },
  { x: 66.1, y: 43, s: 14, petals: 10, dur: 60, rev: true },
  { x: 45.6, y: 80, s: 13, petals: 10, dur: 50, rev: true },
  { x: 55.5, y: 80, s: 13, petals: 10, dur: 52 },
  { x: 18.8, y: 84, s: 13, petals: 10, dur: 58 },
  { x: 81.9, y: 84, s: 14, petals: 10, dur: 62, rev: true },
];

export function WeaveBackdrop() {
  return (
    <div className="weave-bg" aria-hidden="true">
      <div className="weave-bg__chakras">
        {CHAKRAS.map((c, k) => (
          <div key={k} className={`chakra${c.rev ? " chakra--rev" : ""}`}
            style={{ left: `${c.x}%`, top: `${c.y}%`, height: `${c.s}%`, "--dur": `${c.dur}s`, "--n": k } as CSSProperties}>
            <Mandala petals={c.petals} />
          </div>
        ))}
      </div>
      <span className="weave-bg__chain weave-bg__chain--1" />
      <span className="weave-bg__chain weave-bg__chain--2" />
      <span className="weave-bg__chain weave-bg__chain--3" />
      <span className="weave-bg__chain weave-bg__chain--4" />
      <span className="weave-bg__sparkle weave-bg__sparkle--1" />
      <span className="weave-bg__sparkle weave-bg__sparkle--2" />
      <span className="weave-bg__border weave-bg__border--top" />
      <span className="weave-bg__border weave-bg__border--bottom" />
    </div>
  );
}
