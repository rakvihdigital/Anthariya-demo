"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { CONFIG, money, waHello, waLink } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { byId, matches, PRODUCTS, productUrl } from "@/lib/products";
import { activeKey, NAV } from "./Header";
import { Icon } from "./Icon";
import { Price } from "./ProductCard";
import { useStore } from "./StoreProvider";

/* ---------- Mobile menu ---------- */
function MobileMenu() {
  const { panel, closePanels, openPanel, user } = useStore();
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
        <div className="menu__quick" style={{ "--i": NAV.length } as CSSProperties}>
          <button type="button" onClick={() => openPanel("search")}><Icon name="search" /><span>Search</span></button>
          <Link href="/login" onClick={closePanels}><Icon name="user" /><span>{user ? `Hi, ${user.name.split(" ")[0]}` : "Account"}</span></Link>
          <Link href="/shop?view=wishlist" onClick={closePanels}><Icon name="heart" /><span>Wishlist</span></Link>
        </div>
        <Link href="/shop" className="menu__feature" onClick={closePanels} style={{ "--i": NAV.length + 1 } as CSSProperties}>
          <Image src={IMAGES.bannerSignature} alt="" sizes="360px" />
          <span><small>New Season · 2026</small><strong>Shop the <em>Collection</em></strong></span>
        </Link>
      </div>
      <div className="menu__foot">
        <a href={CONFIG.phoneHref} className="menu__call"><Icon name="phone" />{CONFIG.phone}</a>
        <div className="menu__social">
          <a href={CONFIG.social.instagram} aria-label="Instagram" target="_blank" rel="noopener"><Icon name="instagram" /></a>
          <a href={CONFIG.social.facebook} aria-label="Facebook" target="_blank" rel="noopener"><Icon name="facebook" /></a>
          <a href={CONFIG.social.youtube} aria-label="YouTube" target="_blank" rel="noopener"><Icon name="youtube" /></a>
          <a href={waHello()} aria-label="WhatsApp" target="_blank" rel="noopener"><Icon name="whatsapp" /></a>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Shopping bag ---------- */
function CartDrawer() {
  const { panel, closePanels, cart, cartCount, changeQty, removeFromCart } = useStore();
  const open = panel === "cart";
  const lines = cart.map((l) => ({ ...l, p: byId(l.id)! })).filter((l) => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);

  const checkout = () => {
    const rows = lines.map((l, n) => `${n + 1}. ${l.p.name} (${l.p.subtitle}) × ${l.qty} = ${money(l.p.price * l.qty)}`);
    window.open(waLink(`Hello ${CONFIG.brand}! I'd like to order:\n\n${rows.join("\n")}\n\nSubtotal: ${money(subtotal)}`), "_blank", "noopener");
  };

  return (
    <aside className={`drawer drawer--right cart${open ? " is-open" : ""}`} aria-label="Shopping bag" aria-hidden={!open} inert={!open}>
      <div className="drawer__head cart__head">
        <h2 className="cart__title">Your Bag <span>({cartCount})</span></h2>
        <button className="icon-btn" type="button" aria-label="Close bag" onClick={closePanels}><Icon name="close" /></button>
      </div>
      <div className="cart__body">
        {lines.length === 0 ? (
          <div className="cart__empty">
            <Image src={IMAGES.crestPlum} alt="" sizes="120px" />
            <h3>Your bag is empty</h3>
            <p>Every great story begins with a single drape.</p>
            <Link href="/shop" className="btn btn--plum" onClick={closePanels}>Explore the collection</Link>
          </div>
        ) : lines.map(({ id, qty, p }) => (
          <div className="cart__item" key={id}>
            <Image src={IMAGES[p.images[0]]} alt={p.name} sizes="90px" />
            <div>
              <h4><Link href={productUrl(p)} onClick={closePanels}>{p.name}</Link></h4>
              <p>{p.subtitle}</p>
              <div className="cart__price">{money(p.price * qty)}</div>
              <div className="qty">
                <button type="button" aria-label="Decrease quantity" onClick={() => changeQty(id, -1)}><Icon name="minus" /></button>
                <span>{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => changeQty(id, 1)}><Icon name="plus" /></button>
              </div>
            </div>
            <button type="button" className="cart__remove" aria-label={`Remove ${p.name}`} onClick={() => removeFromCart(id)}><Icon name="trash" /></button>
          </div>
        ))}
      </div>
      <div className="cart__foot" hidden={lines.length === 0}>
        <div className="cart__row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
        <p className="cart__note">Shipping &amp; taxes calculated at checkout. Blouse stitching available on request.</p>
        <button type="button" className="btn btn--plum btn--block" onClick={checkout}><Icon name="whatsapp" /> Place order on WhatsApp</button>
        <button type="button" className="btn-link" onClick={closePanels}>Continue shopping</button>
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
                <a className="btn btn--line" target="_blank" rel="noopener"
                  href={waLink(`Hello! I'm interested in "${p.name} – ${p.subtitle}" (${money(p.price)}). Is it available?`)}>
                  <Icon name="whatsapp" /> Enquire on WhatsApp
                </a>
                <button type="button" className={`qv__wish${on ? " is-on" : ""}`} aria-pressed={on} aria-label="Save to wishlist" onClick={() => toggleWish(p.id)}><Icon name="heart" /></button>
              </div>
              <ul className="qv__perks">
                <li><Icon name="truck" /> Free shipping across India above ₹2,999</li>
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
      <CartDrawer />
      <SearchOverlay />
      <div className={`scrim${panel && panel !== "search" ? " is-on" : ""}`} onClick={closePanels} />
      <QuickView />
      <Toast />
      <Fabs />
    </>
  );
}
