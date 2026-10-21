"use client";

import Image from "@/components/QualityImage";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type InputHTMLAttributes } from "react";
import { CONFIG, emailOk, money } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { saveOrder } from "@/lib/orders";
import { byId, COLOR_HEX, productUrl, type Product } from "@/lib/products";
import { Icon, type IconName } from "./Icon";
import { useStore } from "./StoreProvider";

type Step = "bag" | "details" | "payment" | "done";
type Method = "cod" | "card" | "upi";
type Address = { name: string; phone: string; email: string; line: string; city: string; state: string; pin: string };
type Order = { id: string; lines: { p: Product; qty: number }[]; total: number; address: Address; method: Method; from: Date; to: Date };

const STEPS: { id: Exclude<Step, "done">; label: string }[] = [
  { id: "bag", label: "Bag" },
  { id: "details", label: "Delivery" },
  { id: "payment", label: "Payment" },
];
const METHODS: { id: Method; icon: IconName; title: string; note: string }[] = [
  { id: "cod", icon: "cash", title: "Cash on Delivery", note: "Pay in cash or UPI when your saree arrives" },
  { id: "card", icon: "card", title: "Credit / Debit Card", note: "Visa, Mastercard, RuPay" },
  { id: "upi", icon: "upi", title: "UPI", note: "Google Pay, PhonePe, Paytm or any UPI app" },
];
const METHOD_LABEL: Record<Method, string> = { cod: "Cash on Delivery", card: "Card", upi: "UPI" };
const EMPTY: Address = { name: "", phone: "", email: "", line: "", city: "", state: "", pin: "" };

const fmtDay = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };

export function CartPage() {
  const { ready, cart, user, changeQty, removeFromCart, clearCart } = useStore();
  const [step, setStep] = useState<Step>("bag");
  const [addr, setAddr] = useState<Address>(EMPTY);
  const [errs, setErrs] = useState<Partial<Record<keyof Address | "card" | "upi", string>>>({});
  const [method, setMethod] = useState<Method>("cod");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  // prefill the delivery form for a signed-in shopper
  useEffect(() => {
    if (user) setAddr((a) => ({ ...a, name: a.name || user.name, email: a.email || user.email }));
  }, [user]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const lines = useMemo(() => cart.map((l) => ({ p: byId(l.id)!, qty: l.qty })).filter((l) => l.p), [cart]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const freeLeft = Math.max(0, CONFIG.freeShippingAbove - subtotal);
  const shipping = subtotal === 0 || freeLeft === 0 ? 0 : CONFIG.shippingFee;
  const total = subtotal + shipping;

  const set = (k: keyof Address, v: string) => { setAddr((a) => ({ ...a, [k]: v })); setErrs((e) => ({ ...e, [k]: undefined })); };

  const submitDetails = (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errs = {};
    if (addr.name.trim().length < 2) er.name = "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(addr.phone.replace(/\D/g, "").slice(-10))) er.phone = "Please enter a valid 10-digit mobile number.";
    if (!emailOk(addr.email.trim())) er.email = "Please enter a valid email address.";
    if (addr.line.trim().length < 8) er.line = "Please enter your house number, street and area.";
    if (!addr.city.trim()) er.city = "Please enter your city.";
    if (!addr.state.trim()) er.state = "Please enter your state.";
    if (!/^\d{6}$/.test(addr.pin.trim())) er.pin = "Pincode should be 6 digits.";
    setErrs(er);
    if (!Object.keys(er).length) setStep("payment");
  };

  const placeOrder = () => {
    const er: typeof errs = {};
    if (method === "card") {
      const [mm, yy] = card.exp.split("/").map(Number);
      if (card.number.replace(/\D/g, "").length < 15 || !card.name.trim() || !(mm >= 1 && mm <= 12 && yy >= 0) || card.cvv.length < 3)
        er.card = "Please check your card number, name, expiry and CVV.";
    }
    if (method === "upi" && !/^[\w.-]{2,}@[a-z]{2,}$/i.test(upi.trim())) er.upi = "Please enter a valid UPI ID, like name@okbank.";
    setErrs(er);
    if (Object.keys(er).length) return;

    setPlacing(true);
    setTimeout(() => {
      const id = `ANT-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
      const placed: Order = { id, lines, total, address: addr, method, from: addDays(5), to: addDays(6) };
      saveOrder({ id, total, method, date: new Date().toISOString(), email: addr.email.trim(), items: lines.map((l) => ({ id: l.p.id, qty: l.qty })) });
      setOrder(placed);
      clearCart();
      setPlacing(false);
      setStep("done");
    }, 1500);
  };

  if (!ready) return <div className="co-loading" aria-busy="true" />;

  // ---------- order placed ----------
  if (step === "done" && order) {
    return (
      <div className="co-done">
        <div className="co-done__seal"><Icon name="check" /></div>
        <span className="eyebrow eyebrow--center">Order confirmed</span>
        <h2 className="h2">Thank you, <em>{order.address.name.split(" ")[0]}</em></h2>
        <p className="co-done__lead">Your sarees will be wrapped with care and on their way soon. Keep your order number handy for any questions.</p>
        <div className="co-done__card">
          <div className="co-done__meta">
            <div><small>Order number</small><strong className="num">{order.id}</strong></div>
            <div><small>Arriving</small><strong>{fmtDay(order.from)} – {fmtDay(order.to)}</strong></div>
            <div><small>Payment</small><strong>{METHOD_LABEL[order.method]}</strong></div>
            <div><small>Total</small><strong className="num">{money(order.total)}</strong></div>
          </div>
          <ul className="co-done__items">
            {order.lines.map(({ p, qty }) => (
              <li key={p.id}>
                <span className="co-thumb"><Image src={IMAGES[p.images[0]]} alt="" sizes="60px" /></span>
                <span><strong>{p.name}</strong><small>{p.subtitle} · Qty {qty}</small></span>
                <span className="num">{money(p.price * qty)}</span>
              </li>
            ))}
          </ul>
          <p className="co-done__addr"><Icon name="pin" /><span>{order.address.name}, {order.address.line}, {order.address.city}, {order.address.state} – {order.address.pin} · {order.address.phone}</span></p>
        </div>
        <div className="co-done__cta">
          <Link href="/shop" className="btn btn--plum">Continue shopping <Icon name="arrow" arrow /></Link>
          <Link href="/" className="btn btn--line">Back to home</Link>
        </div>
      </div>
    );
  }

  // ---------- empty bag ----------
  if (!lines.length) {
    return (
      <div className="co-empty">
        <Image src={IMAGES.crestPlum} alt="" sizes="110px" />
        <h2 className="h2">Your bag is <em>waiting</em></h2>
        <p>Every great story begins with a single drape. Find the one that feels like you.</p>
        <Link href="/shop" className="btn btn--plum">Explore the collection <Icon name="arrow" arrow /></Link>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const field = (k: keyof Address, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}, wide = false) => (
    <label className={`co-field${wide ? " co-field--wide" : ""}${errs[k] ? " is-invalid" : ""}`}>
      <span>{label}</span>
      <input value={addr[k]} onChange={(e) => set(k, e.target.value)} {...props} />
      {errs[k] && <em>{errs[k]}</em>}
    </label>
  );

  return (
    <>
      <ol className="co-steps" aria-label="Checkout steps">
        {STEPS.map((s, k) => (
          <li key={s.id} className={k < stepIndex ? "is-done" : k === stepIndex ? "is-on" : undefined} aria-current={k === stepIndex ? "step" : undefined}>
            <button type="button" disabled={k >= stepIndex} onClick={() => setStep(s.id)}>
              <span className="co-steps__dot">{k < stepIndex ? <Icon name="check" /> : <span className="num">{k + 1}</span>}</span>{s.label}
            </button>
          </li>
        ))}
      </ol>

      <div className="co">
        <div className="co-main">
          {step === "bag" && (
            <section className="co-panel" aria-label="Items in your bag">
              <header className="co-panel__head"><h2>Your Bag</h2><span>{count} {count === 1 ? "saree" : "sarees"}</span></header>
              <ul className="co-lines">
                {lines.map(({ p, qty }, k) => (
                  <li key={p.id} className="co-line" style={{ "--i": k } as CSSProperties}>
                    <Link href={productUrl(p)} className="co-line__img"><Image src={IMAGES[p.images[0]]} alt={p.name} sizes="120px" /></Link>
                    <div className="co-line__info">
                      <span className="co-line__cat">{p.category}{p.color && <><i style={{ background: COLOR_HEX[p.color] }} />{p.color}</>}</span>
                      <h3><Link href={productUrl(p)}>{p.name}</Link></h3>
                      <p>{p.subtitle}</p>
                      <div className="co-line__row">
                        <div className="qty">
                          <button type="button" aria-label="Decrease quantity" onClick={() => changeQty(p.id, -1)}><Icon name="minus" /></button>
                          <span>{qty}</span>
                          <button type="button" aria-label="Increase quantity" onClick={() => changeQty(p.id, 1)}><Icon name="plus" /></button>
                        </div>
                        <button type="button" className="co-line__remove" onClick={() => removeFromCart(p.id)}><Icon name="trash" /> Remove</button>
                      </div>
                    </div>
                    <strong className="co-line__price num">{money(p.price * qty)}</strong>
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="btn-link co-panel__back"><Icon name="arrow" /> Continue shopping</Link>
            </section>
          )}

          {step === "details" && (
            <form id="co-details" className="co-panel" noValidate onSubmit={submitDetails} aria-label="Delivery details">
              <header className="co-panel__head"><h2>Delivery details</h2><span>Where should we send your sarees?</span></header>
              <div className="co-form">
                {field("name", "Full name", { autoComplete: "name", placeholder: "As it should appear on the parcel" }, true)}
                {field("phone", "Mobile number", { autoComplete: "tel", inputMode: "tel", placeholder: "10-digit mobile number" })}
                {field("email", "Email", { autoComplete: "email", type: "email", placeholder: "For your order updates" })}
                {field("line", "Address", { autoComplete: "street-address", placeholder: "House no., street, area, landmark" }, true)}
                {field("city", "City", { autoComplete: "address-level2" })}
                {field("state", "State", { autoComplete: "address-level1" })}
                {field("pin", "Pincode", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 })}
              </div>
            </form>
          )}

          {step === "payment" && (
            <section className="co-panel" aria-label="Payment">
              <header className="co-panel__head"><h2>Payment</h2><span>Choose how you’d like to pay</span></header>
              <div className="co-methods" role="radiogroup" aria-label="Payment method">
                {METHODS.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={method === m.id} className={`co-method${method === m.id ? " is-on" : ""}`}
                    onClick={() => { setMethod(m.id); setErrs({}); }}>
                    <span className="co-method__icon"><Icon name={m.icon} /></span>
                    <span className="co-method__text"><strong>{m.title}</strong><small>{m.note}</small></span>
                    <span className="co-method__radio" />
                  </button>
                ))}
              </div>

              {method === "card" && (
                <div className="co-card">
                  {/* a live preview of the card being entered */}
                  <div className="co-card__preview" aria-hidden="true">
                    <span className="co-card__chip" />
                    <span className="co-card__brand">Anthariya</span>
                    <span className="co-card__num num">{(card.number || "•••• •••• •••• ••••").padEnd(19, "•")}</span>
                    <span className="co-card__foot"><span>{card.name || "NAME ON CARD"}</span><span className="num">{card.exp || "MM/YY"}</span></span>
                  </div>
                  <div className="co-form co-form--card">
                    <label className="co-field co-field--wide"><span>Card number</span>
                      <input inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={card.number}
                        onChange={(e) => setCard((c) => ({ ...c, number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") }))} /></label>
                    <label className="co-field co-field--wide"><span>Name on card</span>
                      <input autoComplete="cc-name" value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))} /></label>
                    <label className="co-field"><span>Expiry</span>
                      <input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={card.exp}
                        onChange={(e) => setCard((c) => ({ ...c, exp: e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/") }))} /></label>
                    <label className="co-field"><span>CVV</span>
                      <input inputMode="numeric" autoComplete="cc-csc" placeholder="•••" type="password" value={card.cvv}
                        onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} /></label>
                  </div>
                  {errs.card && <p className="co-err">{errs.card}</p>}
                </div>
              )}
              {method === "upi" && (
                <div className="co-form">
                  <label className={`co-field co-field--wide${errs.upi ? " is-invalid" : ""}`}><span>UPI ID</span>
                    <input placeholder="yourname@okbank" value={upi} onChange={(e) => { setUpi(e.target.value); setErrs({}); }} />
                    {errs.upi && <em>{errs.upi}</em>}
                  </label>
                </div>
              )}
              {method === "cod" && <p className="co-note"><Icon name="cash" /> Please keep {money(total)} ready when your parcel arrives. UPI on delivery works too.</p>}

              <div className="co-deliver">
                <Icon name="pin" />
                <span><small>Delivering to</small>{addr.name}, {addr.line}, {addr.city}, {addr.state} – {addr.pin}</span>
                <button type="button" className="btn-link" onClick={() => setStep("details")}>Change</button>
              </div>
            </section>
          )}
        </div>

        {/* order summary */}
        <aside className="co-summary" aria-label="Order summary">
          <h2>Order summary</h2>
          {step !== "bag" && (
            <ul className="co-summary__items">
              {lines.map(({ p, qty }) => (
                <li key={p.id}>
                  <span className="co-thumb"><Image src={IMAGES[p.images[0]]} alt="" sizes="56px" /><b className="num">{qty}</b></span>
                  <span>{p.name}<small>{p.subtitle}</small></span>
                  <span className="num">{money(p.price * qty)}</span>
                </li>
              ))}
            </ul>
          )}
          <dl className="co-summary__rows">
            <dt>Subtotal</dt><dd className="num">{money(subtotal)}</dd>
            <dt>Delivery</dt><dd className="num">{shipping ? money(shipping) : <span className="co-free">Free</span>}</dd>
            <dt className="co-summary__total">Total</dt><dd className="co-summary__total num">{money(total)}</dd>
          </dl>
          {freeLeft > 0 && (
            <div className="co-ship-bar">
              <p>Add <strong className="num">{money(freeLeft)}</strong> more for free delivery</p>
              <span><i style={{ width: `${Math.min(100, (subtotal / CONFIG.freeShippingAbove) * 100)}%` }} /></span>
            </div>
          )}
          <p className="co-eta"><Icon name="truck" /><span>Delivered in <b><span className="num">5–6</span> days</b> · by {fmtDay(addDays(6))}</span></p>

          {step === "bag" && <button type="button" className="btn btn--plum btn--block" onClick={() => setStep("details")}>Proceed to checkout <Icon name="arrow" arrow /></button>}
          {step === "details" && <button type="submit" form="co-details" className="btn btn--plum btn--block">Continue to payment <Icon name="arrow" arrow /></button>}
          {step === "payment" && (
            <button type="button" className={`btn btn--gold btn--block${placing ? " is-busy" : ""}`} disabled={placing} onClick={placeOrder}>
              {placing ? <><span className="co-spin" /> Placing your order…</> : <>Place order · <span className="num">{money(total)}</span></>}
            </button>
          )}
          <p className="co-secure"><Icon name="lock" /> Secure checkout · 7-day exchange</p>
          {CONFIG.demoCheckout && <p className="co-demo">Demo checkout: no payment is taken and no order is sent.</p>}
        </aside>
      </div>
    </>
  );
}
