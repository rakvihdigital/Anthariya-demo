"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { CONFIG, money, waHello } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { byId, matches, PRODUCTS, productUrl } from "@/lib/products";
import { activeKey, NAV } from "./Header";
import { Icon } from "./Icon";
import { Price } from "./ProductCard";
import { useStore } from "./StoreProvider";

/* ---------- Mobile menu ---------- */
function MobileMenu() {
  const { panel, closePanels, user } = useStore();
  const open = panel === "menu";
  const active = activeKey(usePathname());
  return (
    <aside className={`drawer drawer--left menu${open ? " is-open" : ""}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
      <div className="drawer__head">
        <Link href="/" className="menu__logo" aria-label="Anthariya home" onClick={closePanels}>
          <Image src={IMAGES.logoPlum} alt="Anthariya by Nidhi Gowda" sizes="140px" />
        </Link>
        <button className="icon-btn menu__close" type="button" aria-label="Close menu" onClick={closePanels}><Icon name="close" /></button>
      </div>
      <div className="menu__body">
        <nav className="menu__nav" aria-label="Mobile">
          {NAV.map((n, k) => (
            <Link key={n.key} href={n.href} className={active === n.key ? "is-active" : undefined} onClick={closePanels}
              aria-current={active === n.key ? "page" : undefined} style={{ "--i": k } as CSSProperties}>
              <span className="menu__label">{n.label}</span><Icon name="arrow" />
            </Link>
          ))}
        </nav>
        <Link href={user ? "/account" : "/login"} className="menu__account" onClick={closePanels} style={{ "--i": NAV.length } as CSSProperties}>
          <span className="menu__account-icon"><Icon name="user" /></span>
          <span><strong>{user ? `Hi, ${user.name.split(" ")[0]}` : "My Account"}</strong><small>{user ? "Orders, wishlist & details" : "Login or create an account"}</small></span>
          <Icon name="arrow" />
        </Link>
        <Link href="/shop" className="menu__feature" onClick={closePanels} style={{ "--i": NAV.length + 1 } as CSSProperties}>
          <Image src={IMAGES.bannerSignature} alt="" sizes="360px" />
          <span><small>New Season · 2026</small><strong>Shop the <em>Collection</em></strong></span>
        </Link>
      </div>
      <div className="menu__foot">
        <a href={CONFIG.phoneHref} className="menu__call"><Icon name="phone" />{CONFIG.phone}</a>
        <div className="menu__social">
          <a href={CONFIG.social.instagram} aria-label="Instagram" target="_blank" rel="noopener"><Icon name="instagram" /></a>
          <a href={waHello()} aria-label="WhatsApp" target="_blank" rel="noopener"><Icon name="whatsapp" /></a>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Search ---------- */
function SearchOverlay() {
  const { panel, closePanels } = useStore();
  const open = panel === "search";
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 60); }, [open]);
  const term = q.trim().toLowerCase();
  const hits = term ? PRODUCTS.filter((p) => matches(p, term)) : [];
  const go = (href: string) => { closePanels(); setQ(""); router.push(href); };

  return (
    <div className={`search${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open} role="dialog" aria-label="Search">
      <div className="search__inner container">
        <form className="search__form" role="search" onSubmit={(e) => { e.preventDefault(); go(`/shop${term ? `?q=${encodeURIComponent(q.trim())}` : ""}`); }}>
          <Icon name="search" />
          <input ref={input} type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search Kanjivaram, Organza, Ajrakh…" aria-label="Search sarees" autoComplete="off" />
          <button className="icon-btn" type="button" aria-label="Close search" onClick={closePanels}><Icon name="close" /></button>
        </form>
        <div className="search__suggest">
          <span>Popular:</span>
          <Link href="/shop?cat=Silk" onClick={closePanels}>Silk Sarees</Link>
          <Link href="/shop?cat=Banarasi" onClick={closePanels}>Banarasi</Link>
          <Link href="/shop?cat=Organza" onClick={closePanels}>Organza</Link>
          <Link href="/shop?occ=Wedding" onClick={closePanels}>Wedding Edit</Link>
        </div>
        <div className="search__results">
          {term && (hits.length ? hits.map((p) => (
            <Link key={p.id} href={productUrl(p)} className="search__hit" onClick={() => { closePanels(); setQ(""); }}>
              <Image src={IMAGES[p.images[0]]} alt="" sizes="70px" />
              <div><strong>{p.name}</strong><span>{p.subtitle} · {money(p.price)}</span></div>
            </Link>
          )) : <p style={{ color: "var(--ink-soft)" }}>No sarees match “{q.trim()}”. Try silk, organza or cotton.</p>)}
        </div>
      </div>
    </div>
  );
}

/* ---------- Quick view ---------- */
function QuickView() {
  const { panel, quickId, closePanels, wish, toggleWish, addToCart } = useStore();
  const open = panel === "quickview";
  const p = byId(quickId);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  useEffect(() => { setImg(0); setQty(1); }, [quickId]);
  const on = p ? wish.includes(p.id) : false;

  return (
    <div className={`modal${open ? " is-open" : ""}`} aria-hidden={!open} inert={!open} role="dialog" aria-modal="true" aria-label="Product details"
      onClick={(e) => { if (e.target === e.currentTarget) closePanels(); }}>
      <div className="modal__panel">
        {p && (
          <>
            <button type="button" className="icon-btn modal__close" aria-label="Close" onClick={closePanels}><Icon name="close" /></button>
            <div className="qv__gallery">
              <div className="qv__main"><Image src={IMAGES[p.images[img]]} alt={p.name} sizes="(max-width: 720px) 100vw, 480px" placeholder="blur" /></div>
              {p.images.length > 1 && (
                <div className="qv__thumbs">
                  {p.images.map((im, n) => (
                    <button key={im} type="button" className={n === img ? "is-on" : undefined} aria-label={`Image ${n + 1}`} onClick={() => setImg(n)}>
                      <Image src={IMAGES[im]} alt="" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="qv__info">
              <span className="eyebrow">{p.category} · {p.occasion.join(" & ")}</span>
              <h2>{p.name}</h2>
              <p className="qv__sub">{p.subtitle}</p>
              <p className="qv__price"><Price p={p} /><small>Inclusive of all taxes</small></p>
              <p className="qv__desc">{p.desc}</p>
              <dl className="qv__specs">{Object.entries(p.specs).map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
              <div className="qv__buy">
                <div className="qty">
                  <button type="button" aria-label="Decrease" onClick={() => setQty((n) => Math.max(1, n - 1))}><Icon name="minus" /></button>
                  <span>{qty}</span>
                  <button type="button" aria-label="Increase" onClick={() => setQty((n) => n + 1)}><Icon name="plus" /></button>
                </div>
                <button type="button" className="btn btn--plum" disabled={!p.inStock} onClick={() => addToCart(p.id, qty)}>{p.inStock ? "Add to bag" : "Sold out"}</button>
              </div>
              <div className="qv__row2">
                <Link href="/cart" className="btn btn--line" onClick={closePanels}><Icon name="bag" /> View bag</Link>
                <button type="button" className={`qv__wish${on ? " is-on" : ""}`} aria-pressed={on} aria-label="Save to wishlist" onClick={() => toggleWish(p.id)}><Icon name="heart" /></button>
              </div>
              <ul className="qv__perks">
                <li><Icon name="truck" /> Delivered across India in 5–6 days</li>
                <li><Icon name="needle" /> Blouse stitching available on request</li>
                <li><Icon name="shield" /> Easy 7-day exchange on unused sarees</li>
              </ul>
              <Link href={productUrl(p)} className="btn-link" onClick={closePanels}>View full details <Icon name="arrow" /></Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Toast, scrim, floating buttons ---------- */
function Toast() {
  const { toastMsg } = useStore();
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!toastMsg) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);
  return (
    <div className={`toast${on ? " is-on" : ""}`} role="status" aria-live="polite">
      {toastMsg && <><Icon name="check" /><span>{toastMsg.node}</span></>}
    </div>
  );
}

function Fabs() {
  const [top, setTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <a href={waHello()} className="fab fab--wa" aria-label="Chat with us on WhatsApp" target="_blank" rel="noopener"><Icon name="whatsapp" /></a>
      <button type="button" className={`fab fab--top${top ? " is-on" : ""}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="up" /></button>
    </>
  );
}

export function Overlays() {
  const { panel, closePanels } = useStore();
  const path = usePathname();
  // close any open drawer after navigating to another page
  useEffect(() => { closePanels(); }, [path, closePanels]);
  return (
    <>
      <MobileMenu />
      <SearchOverlay />
      <div className={`scrim${panel && panel !== "search" ? " is-on" : ""}`} onClick={closePanels} />
      <QuickView />
      <Toast />
      <Fabs />
    </>
  );
}
