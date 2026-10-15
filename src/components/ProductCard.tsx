"use client";

import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { offPct, productUrl, type Product } from "@/lib/products";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { useStore } from "./StoreProvider";

export function Stars({ p }: { p: Product }) {
  if (!p.rating) return null;
  return (
    <span className="stars" aria-label={`Rated ${p.rating} out of 5`}>
      <Icon name="star" />
      {p.rating.toFixed(1)}
    </span>
  );
}

export function Price({ p }: { p: Product }) {
  const off = offPct(p);
  return <>{money(p.price)}{off > 0 && <> <s>{money(p.mrp!)}</s></>}</>;
}

export function Badge({ p }: { p: Product }) {
  const off = offPct(p);
  if (!p.inStock) return <span className="card__badge card__badge--out">Sold out</span>;
  if (off) return <span className="card__badge card__badge--sale">{off}% off</span>;
  if (p.tag) return <span className="card__badge">{p.tag}</span>;
  return null;
}

const CARD_SIZES = "(max-width: 720px) 50vw, (max-width: 1180px) 33vw, 420px";

export function ProductCard({ p, index = 0, reveal = true }: { p: Product; index?: number; reveal?: boolean }) {
  const { wish, toggleWish, addToCart, openQuickView } = useStore();
  const on = wish.includes(p.id);
  const label = `${p.name}, ${p.subtitle}`;

  const body = (
    <>
      <div className="card__media">
        <Link href={productUrl(p)} className="card__img" aria-label={label}>
          <Image src={IMAGES[p.images[0]]} alt={label} sizes={CARD_SIZES} placeholder="blur" />
          {p.images[1] && <Image className="alt" src={IMAGES[p.images[1]]} alt="" sizes={CARD_SIZES} />}
        </Link>
        <Badge p={p} />
        <button type="button" className={`card__wish${on ? " is-on" : ""}`} aria-pressed={on}
          aria-label={`Save ${p.name} to wishlist`} title="Wishlist" onClick={() => toggleWish(p.id)}>
          <Icon name="heart" />
        </button>
        <button type="button" className="card__quick" aria-label={`Quick view ${p.name}`} onClick={() => openQuickView(p.id)}>
          <Icon name="eye" /><span>Quick View</span>
        </button>
      </div>
      <div className="card__body">
        <div className="card__row">
          <span className="card__cat">{p.category}</span>
          {p.rating ? <Stars p={p} /> : <span className="card__occ">{p.occasion.join(" · ")}</span>}
        </div>
        <h3 className="card__name"><Link href={productUrl(p)}>{p.name}</Link></h3>
        <p className="card__sub">{p.subtitle}</p>
        <div className="card__foot">
          <p className="card__price"><Price p={p} /></p>
          <button type="button" className="card__add" aria-label={`Add ${p.name} to bag`} title={p.inStock ? "Add to bag" : "Sold out"}
            disabled={!p.inStock} onClick={() => addToCart(p.id)}>
            <Icon name="bag" />
          </button>
        </div>
      </div>
    </>
  );

  return reveal
    ? <Reveal as="article" className="card" delay={(index % 3) * 0.08}>{body}</Reveal>
    : <article className="card">{body}</article>;
}
