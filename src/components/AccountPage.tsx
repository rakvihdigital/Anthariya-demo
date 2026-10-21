"use client";

import Image from "@/components/QualityImage";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { money } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { arrivalWindow, initials, loadOrders, METHOD_LABEL, orderDate, type SavedOrder } from "@/lib/orders";
import { byId, productUrl } from "@/lib/products";
import { Icon } from "./Icon";
import { useStore } from "./StoreProvider";

const STAGES = ["Confirmed", "Packed", "Shipped", "Delivered"];

export function AccountPage() {
  const { ready, user, wish, cartCount, signOut } = useStore();
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  useEffect(() => { if (user) setOrders(loadOrders(user.email)); }, [user]);

  if (!ready) return <div className="co-loading" aria-busy="true" />;
  if (!user) {
    return (
      <div className="co-empty">
        <Image src={IMAGES.crestPlum} alt="" sizes="110px" />
        <h2 className="h2">Welcome to <em>Anthariya</em></h2>
        <p>Sign in to see your orders, wishlist and saved details.</p>
        <div className="co-done__cta">
          <Link href="/login" className="btn btn--plum">Login <Icon name="arrow" arrow /></Link>
          <Link href="/signup" className="btn btn--line">Create an account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="acc">
      <aside className="acc__side">
        <div className="acc__profile">
          <span className="acct__avatar acct__avatar--xl">{initials(user.name)}</span>
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </div>
        <div className="acc__stats">
          <Link href="#orders"><b className="num">{orders.length}</b><span>Orders</span></Link>
          <Link href="/shop?view=wishlist"><b className="num">{wish.length}</b><span>Wishlist</span></Link>
          <Link href="/cart"><b className="num">{cartCount}</b><span>In bag</span></Link>
        </div>
        <button type="button" className="acct__out acc__out" onClick={signOut}><Icon name="logout" /> Sign out</button>
      </aside>

      <section className="acc__main" id="orders" aria-label="My orders">
        <header className="co-panel__head"><h2>My orders</h2><span>{orders.length ? `${orders.length} ${orders.length === 1 ? "order" : "orders"}` : "Nothing yet"}</span></header>
        {orders.length === 0 ? (
          <div className="acc__none">
            <Icon name="bag" />
            <p>You haven’t placed an order yet. When you do, it will appear here with its delivery status.</p>
            <Link href="/shop" className="btn btn--plum">Explore the collection</Link>
          </div>
        ) : (
          <ul className="acc__orders">
            {orders.map((o, k) => (
              <li key={o.id} className="acc__order" style={{ "--i": k } as CSSProperties}>
                <div className="acc__order-head">
                  <div><small>Order</small><strong className="num">{o.id}</strong></div>
                  <div><small>Placed</small><strong>{orderDate(o)}</strong></div>
                  <div><small>Payment</small><strong>{METHOD_LABEL[o.method]}</strong></div>
                  <div><small>Total</small><strong className="num">{money(o.total)}</strong></div>
                </div>
                <ol className="acc__track" aria-label="Delivery status">
                  {STAGES.map((s, n) => <li key={s} className={n === 0 ? "is-done" : undefined}><i />{s}</li>)}
                </ol>
                <p className="acc__eta"><Icon name="truck" /> Arriving {arrivalWindow(o)}</p>
                <ul className="acc__items">
                  {o.items.map((it) => {
                    const p = byId(it.id);
                    if (!p) return null;
                    return (
                      <li key={it.id}>
                        <Link href={productUrl(p)} className="co-thumb"><Image src={IMAGES[p.images[0]]} alt="" sizes="56px" /></Link>
                        <span><Link href={productUrl(p)}><strong>{p.name}</strong></Link><small>{p.subtitle} · Qty {it.qty}</small></span>
                        <span className="num">{money(p.price * it.qty)}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
