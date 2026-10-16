"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { money, waHello } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { COLLECTION_INFO, COLOR_HEX, matches, OCCASION_INFO, PRODUCTS, WEAVE_IMAGE, type Category, type Occasion, type Product } from "@/lib/products";
import { Icon } from "./Icon";
import { StageBackdrop } from "./StageBackdrop";
import { ProductCard } from "./ProductCard";
import { useStore } from "./StoreProvider";

const PER_PAGE = 9;
const STEP = 500;
const MIN_P = Math.floor(Math.min(...PRODUCTS.map((p) => p.price)) / STEP) * STEP;
const MAX_P = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / STEP) * STEP;
const uniq = <T,>(a: T[]) => [...new Set(a)];
const PROMO: Record<string, string> = { New: "New Arrivals", Bestseller: "Bestsellers", Handcrafted: "Handcrafted" };

type Group = { key: string; title: string; values: string[]; label?: Record<string, string>; test: (p: Product, v: string) => boolean };
/* Options inside a group are OR-ed; groups are AND-ed. */
const GROUPS: Group[] = [
  { key: "cat", title: "By Weave", values: uniq(PRODUCTS.map((p) => p.category)), test: (p, v) => p.category === v },
  { key: "occ", title: "By Occasion", values: uniq(PRODUCTS.flatMap((p) => p.occasion)), test: (p, v) => (p.occasion as string[]).includes(v) },
  { key: "color", title: "By Colour", values: uniq(PRODUCTS.map((p) => p.color).filter(Boolean)), test: (p, v) => p.color === v },
  { key: "promo", title: "Collections", values: Object.keys(PROMO).filter((t) => PRODUCTS.some((p) => p.tag === t)), label: PROMO, test: (p, v) => p.tag === v },
];
const labelOf = (g: Group, v: string) => g.label?.[v] ?? v;
const WEAVE = GROUPS[0];
const POP_GROUPS = GROUPS.slice(1);
/** quick price ranges shown above the slider */
const PRICE_PRESETS: { label: string; lo: number; hi: number }[] = [
  { label: "Under ₹5,000", lo: MIN_P, hi: 5000 },
  { label: "₹5,000 – ₹10,000", lo: 5000, hi: 10000 },
  { label: "₹10,000 – ₹15,000", lo: 10000, hi: 15000 },
  { label: "Above ₹15,000", lo: 15000, hi: MAX_P },
].filter((r) => r.hi > r.lo && PRODUCTS.some((p) => p.price >= r.lo && p.price <= r.hi));
const POP_TITLE: Record<string, string> = { occ: "Occasion", color: "Colour", promo: "Collections" };

const SORTERS: Record<string, (a: Product, b: Product) => number> = {
  featured: (a, b) => a.order - b.order,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

/** true for pale colours, so the tick on their swatch is drawn dark */
const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 170;
};

/** Reads the filters from the address bar. */
export function ShopClient() {
  const params = useSearchParams();
  return <ShopView query={params.toString()} />;
}

/** The shop itself. `query` is the URL query string (empty = whole collection, used for the first server render). */
export function ShopView({ query }: { query: string }) {
  const params = useMemo(() => new URLSearchParams(query), [query]);
  const { wish } = useStore();
  const [pop, setPop] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [lo, setLo] = useState(MIN_P);
  const [hi, setHi] = useState(MAX_P);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);

  // The address bar is the source of truth for filters, so links like /shop?cat=Silk work and can be shared
  const sel = useMemo(() => Object.fromEntries(GROUPS.map((g) => [g.key, new Set(params.getAll(g.key).flatMap((v) => v.split(",")).filter(Boolean))])), [params]);
  const q = (params.get("q") || "").trim().toLowerCase();
  const wishOnly = params.get("view") === "wishlist";

  const writeUrl = (mut: (u: URLSearchParams) => void) => {
    const u = new URLSearchParams(params.toString());
    mut(u);
    const qs = u.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setPage(1);
  };
  const toggle = (key: string, v: string, on: boolean) =>
    writeUrl((u) => {
      const set = new Set(sel[key]);
      if (on) set.add(v); else set.delete(v);
      if (set.size) u.set(key, [...set].join(",")); else u.delete(key);
    });
  const clearAll = () => {
    setLo(MIN_P); setHi(MAX_P);
    writeUrl((u) => { [...GROUPS.map((g) => g.key), "q", "view"].forEach((k) => u.delete(k)); });
  };

  const list = PRODUCTS.filter((p) =>
    GROUPS.every((g) => !sel[g.key].size || [...sel[g.key]].some((v) => g.test(p, v))) &&
    p.price >= lo && p.price <= hi &&
    (!q || matches(p, q)) &&
    (!wishOnly || wish.includes(p.id)),
  ).sort(SORTERS[sort]);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const start = (cur - 1) * PER_PAGE;
  const shown = list.slice(start, start + PER_PAGE);
  const goPage = (n: number) => {
    setPage(n);
    const top = mainRef.current!.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const cats = sel.cat;
  const title = wishOnly ? <>Your <em>Wishlist</em></> : cats.size === 1 ? <>{[...cats][0]} <em>Sarees</em></> : "Shop";
  useEffect(() => {
    document.title = `${wishOnly ? "Your Wishlist" : cats.size === 1 ? `${[...cats][0]} Sarees` : "Shop Sarees"} | Anthariya by Nidhi Gowda`;
  }, [wishOnly, cats]);

  const chips: { key: string; label: string; clear: () => void }[] = [];
  GROUPS.forEach((g) => sel[g.key].forEach((v) => chips.push({ key: `${g.key}|${v}`, label: labelOf(g, v), clear: () => toggle(g.key, v, false) })));
  if (lo > MIN_P || hi < MAX_P) chips.push({ key: "price", label: `Price: ${money(lo)} – ${money(hi)}`, clear: () => { setLo(MIN_P); setHi(MAX_P); setPage(1); } });
  if (q) chips.push({ key: "q", label: `“${q}”`, clear: () => writeUrl((u) => u.delete("q")) });
  if (wishOnly) chips.push({ key: "wish", label: "Wishlist", clear: () => writeUrl((u) => u.delete("view")) });

  const pct = (v: number) => ((v - MIN_P) / (MAX_P - MIN_P)) * 100;
  const priceOn = lo > MIN_P || hi < MAX_P;
  const clearGroup = (key: string) => writeUrl((u) => u.delete(key));

  // filter panels close on a click outside the bar, or with Escape
  useEffect(() => {
    if (!pop) return;
    const onDown = (e: PointerEvent) => { if (!barRef.current?.contains(e.target as Node)) setPop(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPop(null); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [pop]);

  // re-mounting the grid replays the cards' entrance whenever the selection changes
  const gridKey = `${query}|${lo}|${hi}|${sort}|${cur}`;

  return (
    <main id="main">
      <section className="shop-head page-hero--stage on-dark">
        <StageBackdrop />
        <div className="container">
          <span className="shop-head__eyebrow">The Anthariya Collection</span>
          {/* the title sits between two burnished-gold flourishes, like a wedding invitation */}
          <div className="shop-title">
            <span className="shop-title__flourish shop-title__flourish--top" aria-hidden="true" />
            <h1 className="display">{title}</h1>
            <span className="shop-title__flourish shop-title__flourish--bottom" aria-hidden="true" />
          </div>
          <p className="shop-head__lead">Handpicked sarees from India’s finest looms</p>
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">Shop</span></nav>
        </div>
      </section>

      <section className="section section--tight shop-section">
        <div className="container">
          {/* Shop by weave: a rail of round photo badges */}
          <nav className="weave-rail" aria-label="Shop by weave">
            <button type="button" className={`weave-rail__item${cats.size === 0 ? " is-on" : ""}`} aria-pressed={cats.size === 0}
              style={{ "--i": 0 } as CSSProperties} onClick={() => clearGroup("cat")}>
              <span className="weave-rail__img"><Image src={IMAGES.signature} alt="" sizes="96px" /></span>
              <span className="weave-rail__label">All Sarees</span>
            </button>
            {WEAVE.values.map((v, k) => (
              <button key={v} type="button" className={`weave-rail__item${cats.has(v) ? " is-on" : ""}`} aria-pressed={cats.has(v)}
                style={{ "--i": k + 1 } as CSSProperties} onClick={() => toggle("cat", v, !cats.has(v))}>
                <span className="weave-rail__img"><Image src={IMAGES[WEAVE_IMAGE[v as Category]]} alt="" sizes="96px" /></span>
                <span className="weave-rail__label">{v}</span>
              </button>
            ))}
          </nav>

          {/* Filter bar: pill buttons that open small option panels */}
          <div className="fbar" ref={barRef}>
            <div className="fbar__pills">
              {[POP_GROUPS[0], "price" as const, ...POP_GROUPS.slice(1)].map((g) => {
                const key = g === "price" ? "price" : g.key;
                const count = g === "price" ? (priceOn ? 1 : 0) : sel[g.key].size;
                const open = pop === key;
                return (
                  <div key={key} className={`fpill-wrap${open ? " is-open" : ""}`}>
                    <button type="button" className={`fpill${count ? " is-active" : ""}`} aria-expanded={open} aria-haspopup="dialog"
                      onClick={() => setPop(open ? null : key)}>
                      {g === "price" ? "Price" : POP_TITLE[g.key]}
                      {g !== "price" && g.key === "color" && count > 0
                        ? <span className="fpill__dots">{[...sel.color].map((c) => <i key={c} style={{ background: COLOR_HEX[c] }} />)}</span>
                        : count > 0 && <span className="fpill__count">{count}</span>}
                      <Icon name="chev" />
                    </button>
                    {open && (
                      <div className="fpop" role="dialog" aria-label={`${g === "price" ? "Price" : POP_TITLE[g.key]} filter`}>
                        <div className="fpop__head">
                          <strong>{g === "price" ? "Price range" : POP_TITLE[g.key]}</strong>
                          <button className="icon-btn fpop__close" type="button" aria-label="Close" onClick={() => setPop(null)}><Icon name="close" /></button>
                        </div>
                        {g === "price" ? (
                          <div className="fpop__price">
                            <div className="fpop__presets">
                              {PRICE_PRESETS.map((r) => {
                                const on = lo === r.lo && hi === r.hi;
                                return (
                                  <button key={r.label} type="button" className={`fpreset${on ? " is-on" : ""}`} aria-pressed={on}
                                    onClick={() => { if (on) { setLo(MIN_P); setHi(MAX_P); } else { setLo(r.lo); setHi(r.hi); } setPage(1); }}>
                                    {r.label}<em>{((n) => `${n} ${n === 1 ? "saree" : "sarees"}`)(PRODUCTS.filter((p) => p.price >= r.lo && p.price <= r.hi).length)}</em>
                                  </button>
                                );
                              })}
                            </div>
                            <p className="fpop__sub">Or set your own range</p>
                            <p className="drange__out">{money(lo)} — {money(hi)}</p>
                            <div className="drange">
                              <div className="drange__track"><i style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} /></div>
                              <input type="range" min={MIN_P} max={MAX_P} step={STEP} value={lo} aria-label="Minimum price"
                                onChange={(e) => { setLo(Math.min(Number(e.target.value), hi - STEP)); setPage(1); }} />
                              <input type="range" min={MIN_P} max={MAX_P} step={STEP} value={hi} aria-label="Maximum price"
                                onChange={(e) => { setHi(Math.max(Number(e.target.value), lo + STEP)); setPage(1); }} />
                            </div>
                          </div>
                        ) : (
                          <div className={`fpop__opts fpop__opts--${g.key}`}>
                            {g.values.map((v) => {
                              const on = sel[g.key].has(v);
                              const n = PRODUCTS.filter((p) => g.test(p, v)).length;
                              const press = { type: "button" as const, "aria-pressed": on, onClick: () => toggle(g.key, v, !on) };
                              if (g.key === "color") {
                                const hex = COLOR_HEX[v] ?? "#c9b8a6";
                                return (
                                  <button key={v} {...press} className={`fswatch${on ? " is-on" : ""}`} style={{ "--sw": hex } as CSSProperties}>
                                    <span className={`fswatch__dot${isLight(hex) ? " is-light" : ""}`}>{on && <Icon name="check" />}</span>
                                    <span className="fswatch__name">{v}</span><em>{n}</em>
                                  </button>
                                );
                              }
                              const info = g.key === "occ" ? OCCASION_INFO[v as Occasion] : g.key === "promo" ? COLLECTION_INFO[v] : null;
                              return (
                                <button key={v} {...press} className={`ftile${on ? " is-on" : ""}`}>
                                  <span className="ftile__icon">{info && <Icon name={info.icon} />}</span>
                                  <span className="ftile__text">
                                    <strong>{labelOf(g, v)}</strong>
                                    {info && <small>{info.note}</small>}
                                  </span>
                                  <em>{n}</em>
                                  {on && <span className="ftile__tick"><Icon name="check" /></span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <div className="fpop__foot">
                          <button type="button" className="fpop__clear" onClick={() => (g === "price" ? (setLo(MIN_P), setHi(MAX_P), setPage(1)) : clearGroup(g.key))}>Clear</button>
                          <button type="button" className="btn btn--plum fpop__done" onClick={() => setPop(null)}>Show {list.length} {list.length === 1 ? "saree" : "sarees"}</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="fbar__end">
              <p className="fbar__count"><strong>{list.length}</strong> {list.length === 1 ? "saree" : "sarees"}</p>
              <label className="sort">
                <span className="sort__label">Sort</span>
                <span className="select select--pill">
                  <select aria-label="Sort by" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <Icon name="chev" />
                </span>
              </label>
            </div>
            {pop && <div className="fscrim" aria-hidden="true" onClick={() => setPop(null)} />}
          </div>

          <div className="shop-main" ref={mainRef}>
            <div className="active-filters" hidden={!chips.length}>
              <div className="chips">
                {chips.map((c) => <button key={c.key} type="button" className="chip" onClick={c.clear}>{c.label} <Icon name="close" /></button>)}
                {chips.length > 0 && <button type="button" className="chip-clear" onClick={clearAll}>Clear all</button>}
              </div>
            </div>

            <div className="products shop-grid" key={gridKey}>
              {shown.length ? shown.map((p, k) => (
                <div key={p.id} className="shop-grid__cell" style={{ "--i": k } as CSSProperties}><ProductCard p={p} reveal={false} /></div>
              )) : (
                <div className="empty-state">
                  <Image src={IMAGES.crestPlum} alt="" sizes="110px" />
                  <h3>{wishOnly ? "Your wishlist is waiting" : "No sarees found"}</h3>
                  <p>{wishOnly ? "Tap the heart on any saree to save it here." : "Try removing a filter or two to see more of the collection."}</p>
                  <button type="button" className="btn btn--plum" onClick={clearAll}>View all sarees</button>
                </div>
              )}
            </div>

            {pages > 1 && (
              <nav className="pager" aria-label="Pages">
                <button type="button" className="pager__btn" aria-label="Previous page" disabled={cur === 1} onClick={() => goPage(cur - 1)}><Icon name="chev" /></button>
                {Array.from({ length: pages }, (_, k) => (
                  <button key={k} type="button" className={`pager__btn${k + 1 === cur ? " is-on" : ""}`} aria-current={k + 1 === cur ? "page" : undefined} onClick={() => goPage(k + 1)}>{k + 1}</button>
                ))}
                <button type="button" className="pager__btn" aria-label="Next page" disabled={cur === pages} onClick={() => goPage(cur + 1)}><Icon name="chev" /></button>
              </nav>
            )}
          </div>

          {/* Personal styling band */}
          <div className="style-band">
            <Image src={IMAGES.bannerSignature} alt="" sizes="(max-width: 720px) 100vw, 50vw" />
            <div className="style-band__body">
              <span className="eyebrow eyebrow--gold">Personal Styling</span>
              <p>Can’t decide? <em>Let Nidhi help</em> you find the one.</p>
              <a href={waHello()} target="_blank" rel="noopener" className="btn btn--gold"><Icon name="whatsapp" /> Chat with us</a>
            </div>
          </div>
        </div>

        <div className="container">
          <ul className="perks">
            <li><span className="perks__icon"><Icon name="truck" /></span><span><strong>Free Shipping</strong>Across India on orders above ₹2,999</span></li>
            <li><span className="perks__icon"><Icon name="needle" /></span><span><strong>Blouse Stitching</strong>Tailored to your measurements</span></li>
            <li><span className="perks__icon"><Icon name="shield" /></span><span><strong>Easy Exchange</strong>Within 7 days on unused sarees</span></li>
            <li><span className="perks__icon"><Icon name="shield" /></span><span><strong>Secure Payments</strong>UPI, cards &amp; net banking</span></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
