"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { IMAGES, type ImageKey } from "@/lib/images";
import { Icon } from "./Icon";

type Slide = {
  /** `thumb` is the portrait shown in the "Up next" box when the banner photo is a wide landscape. */
  img: ImageKey; thumb?: ImageKey; pos: string; posM: string;
  /** a wide landscape photo that fills the whole banner; other photos sit on the right over a blurred copy of themselves */
  wide?: boolean;
  /** where the slow zoom grows from; "50% 0%" keeps the top of the photo (her head) in frame */
  zoomFrom?: string; alt: string; short: string;
  eyebrow: string; title: React.ReactNode; lead: string;
  cta: [string, string]; cta2: [string, string];
};

const SLIDES: Slide[] = [
  {
    img: "bannerSignature", thumb: "signature", wide: true, pos: "66% 30%", posM: "66% 30%", short: "Signature Silks",
    alt: "Model in a black and mango yellow silk saree with red and gold zari border, in a sunlit temple courtyard",
    eyebrow: "New Season · 2026", title: <>Woven in heritage, <em>draped</em> in grace</>,
    lead: "Handpicked silks with liquid-gold zari, chosen for the moments you will remember forever.",
    cta: ["/shop", "Shop the Collection"], cta2: ["/about", "Our Story"],
  },
  {
    img: "mayuri", pos: "50% 22%", posM: "50% 18%", short: "The Wedding Edit",
    alt: "Model in an emerald and rani pink bridal silk saree",
    eyebrow: "The Wedding Edit", title: <>Bridal silks made for <em>forever</em></>,
    lead: "Emerald, rani pink and temple borders, for the bride and the women who stand beside her.",
    cta: ["/shop?occ=Wedding", "Shop Wedding Sarees"], cta2: ["/shop", "View All"],
  },
  {
    img: "bannerRajkumari", thumb: "rajkumariDetail", wide: true, pos: "36% 30%", posM: "50% 30%", short: "Kanjivaram Silks",
    alt: "Model in a plum Kanjivaram silk saree with lilac and gold zari border, on a flower-filled terrace at sunset",
    eyebrow: "Kanjivaram Silks", title: <>Pure zari, <em>timeless</em> silk</>,
    lead: "Royal plum, lilac borders and gold butta: heirloom drapes made to be cherished.",
    cta: ["/shop?cat=Silk", "Shop Silk Sarees"], cta2: ["/shop", "View All"],
  },
  {
    img: "bannerGulaab", thumb: "gulaab", wide: true, pos: "73% 20%", posM: "74% 15%", zoomFrom: "70% 8%", short: "The Organza Edit",
    alt: "Model in an ivory organza saree with painted roses, standing in the Anthariya boutique",
    eyebrow: "The Organza Edit", title: <>Light as air, <em>lovely</em> as a rose</>,
    lead: "Painted roses on ivory organza, finished with a scalloped, bead-edged border.",
    cta: ["/shop?cat=Organza", "Shop Organza"], cta2: ["/shop", "View All"],
  },
];

const DUR = 7000;

// gold dust motes drifting up through the banner: [left %, delay s, duration s, size px]
const DUST: [number, number, number, number][] = [
  [8, 0, 11, 3], [17, 4.2, 13, 2], [26, 1.6, 10, 2.5], [34, 6.8, 12, 2], [43, 2.9, 14, 3], [52, 8.1, 11, 2],
  [61, 0.8, 13, 2.5], [69, 5.4, 10, 2], [77, 3.3, 12, 3], [85, 7.2, 14, 2], [92, 1.1, 11, 2.5], [12, 9.4, 12, 2],
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [back, setBack] = useState(false);
  const iRef = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const x0 = useRef<number | null>(null);
  const hero = useRef<HTMLElement>(null);

  // as the page scrolls away, the banner drifts slower than the page and its text lifts and fades
  useEffect(() => {
    const el = hero.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const run = () => {
      const p = Math.min(Math.max(window.scrollY / el.offsetHeight, 0), 1);
      el.style.setProperty("--hs", p.toFixed(4));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(run); };
    window.addEventListener("scroll", onScroll, { passive: true });
    run();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const go = useCallback((n: number, dir: 1 | -1) => {
    const next = (n + SLIDES.length) % SLIDES.length;
    if (next === iRef.current) return;
    setPrev(iRef.current);
    setBack(dir < 0);
    iRef.current = next;
    setI(next);
  }, []);

  // autoplay: every slide change (automatic or chosen) restarts the 7-second countdown,
  // and the outgoing slide is cleared once its exit animation is done
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => go(iRef.current + 1, 1), DUR);
    const t = setTimeout(() => setPrev(null), 1600);
    return () => { clearTimeout(timer.current); clearTimeout(t); };
  }, [i, go]);

  // desktop: the photo drifts gently against the pointer for a sense of depth
  const raf = useRef(0);
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2, my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => { el.style.setProperty("--mx", mx.toFixed(3)); el.style.setProperty("--my", my.toFixed(3)); });
  };

  return (
    <section
      ref={hero}
      className={`hero${back ? " is-back" : ""}`}
      aria-roledescription="carousel" aria-label="Featured collections"
      style={{ "--dur": `${DUR}ms` } as CSSProperties}
      onPointerMove={onMove}
      onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (x0.current === null) return;
        const dx = e.changedTouches[0].clientX - x0.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1, dx < 0 ? 1 : -1);
        x0.current = null;
      }}
    >
      {SLIDES.map((s, k) => {
        const on = k === i;
        const Title = k === 0 ? "h1" : "h2";
        return (
          <div key={s.img} className={`hero__slide${s.wide ? " hero__slide--wide" : ""}${on ? " is-active" : ""}${k === prev ? " is-prev" : ""}`}
            aria-roledescription="slide" aria-label={`${k + 1} of ${SLIDES.length}`} aria-hidden={!on} inert={!on}
            style={{ "--pos": s.pos, "--pos-m": s.posM, "--zo": s.zoomFrom ?? "50% 50%" } as CSSProperties}>
            {!s.wide && <div className="hero__backdrop" aria-hidden="true"><Image src={IMAGES[s.img]} alt="" sizes="480px" /></div>}
            <div className="hero__media">
              <Image src={IMAGES[s.img]} alt={s.alt} priority={k === 0} sizes="(max-width: 960px) 100vw, 64vw" quality={85} />
            </div>
            <div className="hero__content container on-dark">
              <div className="hero__text">
                <span className="hero__line"><span className="eyebrow eyebrow--gold">{s.eyebrow}</span></span>
                <Title className="display hero__line"><span>{s.title}</span></Title>
                <span className="hero__line hero__flourish-line" aria-hidden="true"><span className="hero__flourish" /></span>
                <p className="lead hero__line"><span>{s.lead}</span></p>
                <div className="hero__cta hero__line"><span>
                  <Link href={s.cta[0]} className="btn btn--gold">{s.cta[1]} <Icon name="arrow" arrow /></Link>
                  <Link href={s.cta2[0]} className="btn btn--ghost">{s.cta2[1]}</Link>
                </span></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ornaments over every slide: drifting gold dust and frame corners */}
      <div className="hero__dust" aria-hidden="true">
        {DUST.map(([x, d, t, z], k) => <i key={k} style={{ left: `${x}%`, animationDelay: `${d}s`, animationDuration: `${t}s`, width: z, height: z } as CSSProperties} />)}
      </div>
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <svg key={c} className={`hero__corner hero__corner--${c}`} viewBox="0 0 64 64" aria-hidden="true">
          <path d="M2 62V22C2 11 11 2 22 2h40" />
          <path d="M10 62V30c0-11 9-20 20-20h32" opacity=".55" />
          <path d="M18 28c0-6 4-10 10-10 4 0 6 3 6 6s-2 5-5 5c-2 0-3-1-3-3" />
          <circle cx="2" cy="62" r="2.2" /><circle cx="62" cy="2" r="2.2" />
        </svg>
      ))}

      <div className="hero__ui">
        <div className="container hero__ui-inner">
          <div className="hero__count"><span key={i} className="hero__num">0{i + 1}</span><small>/ 0{SLIDES.length}</small></div>
          <div className="hero__bars">
            {SLIDES.map((s, k) => (
              <button key={s.img} className={`hero__bar${k === i ? " is-active" : k < i ? " is-done" : ""}`} type="button"
                aria-label={`Go to slide ${k + 1}`} aria-current={k === i} onClick={() => go(k, k > i ? 1 : -1)}>
                <i key={k === i ? `on-${i}` : "off"} />
              </button>
            ))}
          </div>
          <div className="hero__arrows">
            <button type="button" className="hero__arrow" aria-label="Previous slide" data-prev onClick={() => go(i - 1, -1)}><Icon name="arrow" /></button>
            <button type="button" className="hero__arrow" aria-label="Next slide" onClick={() => go(i + 1, 1)}><Icon name="arrow" /></button>
          </div>
          {/* every slide as a small arch window; the active one is outlined in gold */}
          <div className="hero__thumbs">
            {SLIDES.map((s, k) => (
              <button key={s.img} type="button" className={`hero__thumb${k === i ? " is-on" : ""}`} aria-label={`Show ${s.short}`} aria-current={k === i}
                onClick={() => go(k, k > i ? 1 : -1)}>
                <span className="hero__thumb-img"><Image src={IMAGES[s.thumb ?? s.img]} alt="" sizes="70px" /></span>
                <span className="hero__thumb-label">{s.short}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
