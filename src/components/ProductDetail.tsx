"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { CONFIG, money } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { byId, CARE, COLOR_HEX, OCCASION_INFO, offPct, productUrl, WEAVE_IMAGE, WEAVE_NAME, WEAVE_NOTES } from "@/lib/products";
import { Icon } from "./Icon";
import { Badge, Stars } from "./ProductCard";
import { useStore } from "./StoreProvider";

export function ProductDetail({ id }: { id: string }) {
  const p = byId(id)!;
  const { wish, toggleWish, addToCart, toast } = useStore();
  const [img, setImg] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [url, setUrl] = useState(`${CONFIG.siteUrl}${productUrl(p)}`);
  const buyRef = useRef<HTMLDivElement>(null);

  const on = wish.includes(p.id);
  const off = offPct(p);

  useEffect(() => {
    setUrl(window.location.href);
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  // phones: show the add-to-bag bar once the main button has scrolled away
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setSticky(!en.isIntersecting && en.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.body.classList.toggle("has-sticky", sticky);
    return () => document.body.classList.remove("has-sticky");
  }, [sticky]);

  const share = encodeURIComponent(url);
  const copyLink = () =>
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
      .then(() => toast("Link copied"), () => toast("Copy the link from your address bar"));

  return (
    <>
      <div className="pd">
        <div className={`pd-gallery${p.images.length > 1 ? "" : " is-single"}`}>
          {p.images.length > 1 && (
            <div className="pd-thumbs">
              {p.images.map((im, n) => (
                <button key={im} type="button" className={`pd-thumb${n === img ? " is-on" : ""}`} aria-label={`View image ${n + 1}`} onClick={() => setImg(n)}>
                  <Image src={IMAGES[im]} alt="" sizes="90px" />
                </button>
              ))}
            </div>
          )}
          <div className={`pd-main${zoom ? " is-zoom" : ""}`}
            onMouseEnter={() => canHover && setZoom(true)} onMouseLeave={() => setZoom(false)}
            onMouseMove={(e) => {
              if (!canHover) return;
              const r = e.currentTarget.getBoundingClientRect();
              setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
            }}>
            <Image src={IMAGES[p.images[img]]} alt={`${p.name}, ${p.subtitle}`} priority sizes="(max-width: 960px) 100vw, 600px"
              quality={85} placeholder="blur" style={{ transformOrigin: origin }} />
            <Badge p={p} />
            <span className="pd-main__hint"><Icon name="search" /> Hover to zoom</span>
          </div>
        </div>

        <div className="pd-info">
          <span className="eyebrow">{WEAVE_NAME[p.category]} · {p.occasion.join(" & ")}</span>
          <h1 className="pd-title">{p.name}</h1>
          <p className="pd-sub">{p.subtitle}</p>
          {p.rating && <p className="pd-rating"><Stars p={p} /><span>{p.reviews ? `${p.reviews} reviews` : ""}</span></p>}

          <div className="pd-price">
            <div>
              <strong>{money(p.price)}</strong>
              {off > 0 && <><s>{money(p.mrp!)}</s><span className="pd-off">{off}% off</span></>}
              <small>Inclusive of all taxes</small>
            </div>
            <span className="pd-price__ship"><Icon name="truck" /><span>Delivered in <b><span className="num">5–6</span> days</b><br />across India</span></span>
          </div>

          <p className="pd-desc">{p.desc}</p>

          {/* the saree at a glance: each detail shown the way it looks */}
          <div className="pd-attrs">
            <Link href={`/shop?cat=${encodeURIComponent(p.category)}`} className="pd-attr">
              <span className="pd-attr__visual pd-attr__visual--img"><Image src={IMAGES[WEAVE_IMAGE[p.category]]} alt="" sizes="52px" /></span>
              <span><small>Weave</small><strong>{WEAVE_NAME[p.category]}</strong></span>
            </Link>
            {p.color && (
              <Link href={`/shop?color=${encodeURIComponent(p.color)}`} className="pd-attr">
                <span className="pd-attr__visual pd-attr__visual--swatch" style={{ "--sw": COLOR_HEX[p.color] ?? "#c9b8a6" } as CSSProperties} />
                <span><small>Colour</small><strong>{p.color}</strong></span>
              </Link>
            )}
            <div className="pd-attr pd-attr--wide">
              <span className="pd-attr__label">Perfect for</span>
              <div className="pd-occ">
                {p.occasion.map((o) => (
                  <Link key={o} href={`/shop?occ=${encodeURIComponent(o)}`} className="pd-occ__item">
                    <span className="pd-occ__icon"><Icon name={OCCASION_INFO[o].icon} /></span>
                    <span><strong>{o}</strong><small>{OCCASION_INFO[o].note}</small></span>
                  </Link>
                ))}
              </div>
            </div>
            <div className={`pd-attr pd-attr--wide pd-avail${p.inStock ? "" : " is-out"}`}>
              <span className="pd-avail__dot" />
              <span><strong>{p.inStock ? "In stock" : "Sold out"}</strong><small>{p.inStock ? "Ready to ship, gift-wrapped with care" : "Message us and we’ll let you know when it’s back"}</small></span>
            </div>
          </div>

          <div className="pd-buy" ref={buyRef}>
            <div className="qty">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((n) => Math.max(1, n - 1))}><Icon name="minus" /></button>
              <span>{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((n) => n + 1)}><Icon name="plus" /></button>
            </div>
            <button type="button" className="btn btn--plum" disabled={!p.inStock} onClick={() => addToCart(p.id, qty)}>
              <Icon name="bag" /> {p.inStock ? "Add to Bag" : "Sold out"}
            </button>
            <button type="button" className={`pd-wish${on ? " is-on" : ""}`} aria-pressed={on} aria-label="Save to wishlist" onClick={() => toggleWish(p.id)}>
              <Icon name="heart" />
            </button>
          </div>
          <p className="pd-pay"><Icon name="shield" /> Secure checkout · Cash on Delivery, Cards &amp; UPI</p>
          <ul className="pd-perks">
            <li><span><Icon name="truck" /></span><strong><span className="num">5–6</span> day delivery</strong></li>
            <li><span><Icon name="needle" /></span><strong>Blouse stitching</strong></li>
            <li><span><Icon name="shield" /></span><strong>7-day exchange</strong></li>
          </ul>
          <div className="pd-share">
            <span>Share</span>
            <a href={`https://wa.me/?text=${share}`} target="_blank" rel="noopener" aria-label="Share on WhatsApp"><Icon name="whatsapp" /></a>
            <button type="button" aria-label="Copy link" onClick={copyLink}><Icon name="link" /></button>
          </div>
        </div>
      </div>

      {/* the full story, laid out as cards rather than hidden behind tabs */}
      <div className="pd-story">
        <article className="pd-card pd-card--story">
          <span className="eyebrow">The Story</span>
          <h2 className="h3">About <em>{p.name}</em></h2>
          <p className="pd-dropcap">{p.desc}</p>
          <p>{WEAVE_NOTES[p.category]}</p>
        </article>
        <article className="pd-card">
          <span className="eyebrow">Fabric &amp; Details</span>
          <dl className="pd-specs">{Object.entries(p.specs).map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
          <h3 className="pd-card__sub">Caring for it</h3>
          <ul className="pd-list">{CARE[p.category].map((c) => <li key={c}><Icon name="check" />{c}</li>)}</ul>
        </article>
        <article className="pd-card">
          <span className="eyebrow">Shipping &amp; Returns</span>
          <ul className="pd-steps">
            <li><span><Icon name="truck" /></span><div><strong>Delivered in <span className="num">5–6</span> days</strong><small>Anywhere in India, with tracking</small></div></li>
            <li><span><Icon name="gem" /></span><div><strong>Gift-ready packaging</strong><small>Wrapped by hand in our boutique</small></div></li>
            <li><span><Icon name="shield" /></span><div><strong>7-day exchange</strong><small>Unused, with tags intact</small></div></li>
            <li><span><Icon name="needle" /></span><div><strong>Blouse stitching</strong><small>Tailored to your measurements</small></div></li>
          </ul>
          <p className="pd-card__note">Stitched blouses, fall-pico finished sarees and sale items can’t be exchanged.</p>
        </article>
      </div>

      {/* Sticky add-to-bag bar (phones) */}
      <div className={`pd-sticky${sticky ? " is-on" : ""}`} aria-hidden={!sticky}>
        <Image src={IMAGES[p.images[0]]} alt="" sizes="50px" />
        <div><strong>{p.name}</strong><span>{money(p.price)}</span></div>
        <button type="button" className="btn btn--plum" disabled={!p.inStock} tabIndex={sticky ? 0 : -1} onClick={() => addToCart(p.id, qty)}>
          {p.inStock ? "Add to Bag" : "Sold out"}
        </button>
      </div>
    </>
  );
}
