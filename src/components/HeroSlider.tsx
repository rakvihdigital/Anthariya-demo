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
  wide?: boolean; alt: string; short: string;
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
    img: "gulaab", pos: "50% 26%", posM: "50% 20%", short: "The Organza Edit",
    alt: "Model in an ivory organza saree with painted roses",
    eyebrow: "The Organza Edit", title: <>Light as air, <em>lovely</em> as a rose</>,
    lead: "Painted roses on ivory organza, finished with a scalloped, bead-edged border.",
    cta: ["/shop?cat=Organza", "Shop Organza"], cta2: ["/shop", "View All"],
  },
];

const DUR = 7000;

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [back, setBack] = useState(false);
  const [paused, setPaused] = useState(false);
  const iRef = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const startedAt = useRef(0);
  const remaining = useRef(DUR);
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

  const schedule = useCallback((ms: number) => {
    clearTimeout(timer.current);
    remaining.current = ms;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => go(iRef.current + 1, 1), ms);
  }, [go]);

  // every slide change restarts the 7-second countdown and clears the outgoing slide after its exit animation
  useEffect(() => {
    if (!paused) schedule(DUR);
    else remaining.current = DUR;
    const t = setTimeout(() => setPrev(null), 1600);
    return () => clearTimeout(t);
  }, [i]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const pause = () => {
    clearTimeout(timer.current);
    remaining.current -= Date.now() - startedAt.current;
    setPaused(true);
  };
  const resume = () => {
    setPaused(false);
    schedule(Math.max(remaining.current, 800));
  };

  const nx = SLIDES[(i + 1) % SLIDES.length];

  return (
    <section
      ref={hero}
      className={`hero${back ? " is-back" : ""}${paused ? " is-paused" : ""}`}
      aria-roledescription="carousel" aria-label="Featured collections"
      style={{ "--dur": `${DUR}ms` } as CSSProperties}
      onMouseEnter={pause} onMouseLeave={resume}
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
            style={{ "--pos": s.pos, "--pos-m": s.posM } as CSSProperties}>
            {!s.wide && <div className="hero__backdrop" aria-hidden="true"><Image src={IMAGES[s.img]} alt="" sizes="480px" /></div>}
            <div className="hero__media">
              <Image src={IMAGES[s.img]} alt={s.alt} priority={k === 0} sizes="(max-width: 960px) 100vw, 64vw" quality={85} />
            </div>
            <div className="hero__content container on-dark">
              <div className="hero__text">
                <span className="hero__line"><span className="eyebrow eyebrow--gold">{s.eyebrow}</span></span>
                <Title className="display hero__line"><span>{s.title}</span></Title>
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

      <div className="hero__ui">
        <div className="container hero__ui-inner">
          <div className="hero__count"><span>0{i + 1}</span><small>/ 0{SLIDES.length}</small></div>
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
          <button type="button" className="hero__next" aria-label={`Next slide: ${nx.short}`} onClick={() => go(i + 1, 1)}>
            <Image src={IMAGES[nx.thumb ?? nx.img]} alt="" sizes="60px" />
            <span><small>Up next</small><strong>{nx.short}</strong></span>
          </button>
        </div>
      </div>
    </section>
  );
}
