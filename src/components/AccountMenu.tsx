"use client";

import Image from "@/components/QualityImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { money } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { arrivalWindow, initials, loadOrders, orderDate, type SavedOrder } from "@/lib/orders";
import { byId } from "@/lib/products";
import { Icon } from "./Icon";
import { useStore } from "./StoreProvider";

/** Header account control: a plain icon when signed out; the shopper's initial and name when signed in,
 *  opening a panel with recent orders, shortcuts and sign out. */
export function AccountMenu() {
  const { ready, user, wish, cartCount, signOut } = useStore();
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => { if (open && user) setOrders(loadOrders(user.email)); }, [open, user]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!ready || !user) {
    return (
      <Link className="icon-btn" href="/login" aria-label="Login or sign up" title="Login / Sign up">
        <Icon name="user" />
      </Link>
    );
  }

  const first = user.name.split(" ")[0];
  return (
    <div className={`acct${open ? " is-open" : ""}`} ref={wrap}>
      <button type="button" className="acct__btn" aria-haspopup="menu" aria-expanded={open} aria-label={`My account, ${user.name}`} onClick={() => setOpen((o) => !o)}>
        <span className="acct__avatar">{initials(user.name)}</span>
        <span className="acct__hi"><small>Hi,</small>{first}</span>
        <Icon name="chev" />
      </button>

      {open && (
        <div className="acct__pop" role="menu" aria-label="Account">
          <div className="acct__head">
            <span className="acct__avatar acct__avatar--lg">{initials(user.name)}</span>
            <span><strong>{user.name}</strong><small>{user.email}</small></span>
          </div>

          <div className="acct__orders">
            <div className="acct__label"><span>Recent orders</span>{orders.length > 0 && <Link href="/account" role="menuitem">View all</Link>}</div>
            {orders.length ? orders.slice(0, 2).map((o) => (
              <Link key={o.id} href="/account" className="acct__order" role="menuitem">
                <span className="acct__thumbs">
                  {o.items.slice(0, 3).map((it) => { const p = byId(it.id); return p && <Image key={it.id} src={IMAGES[p.images[0]]} alt="" sizes="40px" />; })}
                </span>
                <span className="acct__order-text">
                  <strong className="num">{o.id}</strong>
                  <small>{orderDate(o)} · <span className="num">{money(o.total)}</span></small>
                  <em><i />Arriving {arrivalWindow(o)}</em>
                </span>
              </Link>
            )) : (
              <p className="acct__none"><Icon name="bag" /> No orders yet. <Link href="/shop" role="menuitem">Start shopping</Link></p>
            )}
          </div>

          <nav className="acct__links" aria-label="Account shortcuts">
            <Link href="/account" role="menuitem"><Icon name="truck" /><span>My orders</span><Icon name="arrow" /></Link>
            <Link href="/shop?view=wishlist" role="menuitem"><Icon name="heart" /><span>My wishlist</span>{wish.length > 0 && <b className="num">{wish.length}</b>}<Icon name="arrow" /></Link>
            <Link href="/cart" role="menuitem"><Icon name="bag" /><span>My bag</span>{cartCount > 0 && <b className="num">{cartCount}</b>}<Icon name="arrow" /></Link>
          </nav>

          <button type="button" className="acct__out" role="menuitem" onClick={() => { setOpen(false); signOut(); }}>
            <Icon name="logout" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
