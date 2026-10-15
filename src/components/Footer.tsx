"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { CONFIG, emailOk } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { Icon } from "./Icon";

function Newsletter() {
  const [msg, setMsg] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    if (!emailOk(email)) { setMsg("Please enter a valid email address."); return; }
    setMsg("Thank you! You're now part of the Anthariya circle.");
    form.reset();
  };
  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <div>
          <p className="eyebrow eyebrow--gold">The Anthariya Circle</p>
          <h2 className="newsletter__title">Be the first to see <em>new weaves</em></h2>
          <p className="newsletter__text">New arrivals, festive edits and styling notes from Nidhi, straight to your inbox. No noise, only beautiful sarees.</p>
        </div>
        <form className="newsletter__form" noValidate onSubmit={submit}>
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" type="email" name="email" placeholder="Your email address" required />
          <button className="btn btn--gold" type="submit">Subscribe</button>
          <p className="form-msg" aria-live="polite">{msg}</p>
        </form>
      </div>
    </section>
  );
}

/** Footer column that becomes a tap-to-open accordion on phones. */
function Col({ title, className = "", children }: { title: string; className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    if (!window.matchMedia("(max-width: 720px)").matches) return;
    setOpen((o) => !o);
  };
  return (
    <div className={`footer__col ${className}${open ? " is-open" : ""}`}>
      <h3 className="footer__h"><button type="button" aria-expanded={open} onClick={toggle}>{title} <Icon name="chev" /></button></h3>
      <ul>{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="zari" aria-hidden="true" />
      <Newsletter />
      <div className="footer__main container">
        <div className="footer__brand">
          <Link href="/" aria-label="Anthariya home"><Image src={IMAGES.logoGold} alt="Anthariya by Nidhi Gowda" sizes="200px" /></Link>
          <p>A saree boutique celebrating the weavers, the weaves and the women who wear them, from Kanjivaram silks to hand block-printed cottons.</p>
          <div className="social">
            <a href={CONFIG.social.instagram} aria-label="Instagram" target="_blank" rel="noopener"><Icon name="instagram" /></a>
            <a href={CONFIG.social.facebook} aria-label="Facebook" target="_blank" rel="noopener"><Icon name="facebook" /></a>
            <a href={CONFIG.social.youtube} aria-label="YouTube" target="_blank" rel="noopener"><Icon name="youtube" /></a>
            <a href={CONFIG.social.pinterest} aria-label="Pinterest" target="_blank" rel="noopener"><Icon name="pinterest" /></a>
          </div>
        </div>
        <Col title="Shop">
          <li><Link href="/shop?cat=Silk">Silk Sarees</Link></li>
          <li><Link href="/shop?cat=Banarasi">Banarasi Sarees</Link></li>
          <li><Link href="/shop?cat=Cotton">Cotton &amp; Ajrakh</Link></li>
          <li><Link href="/shop?cat=Organza">Organza Sarees</Link></li>
          <li><Link href="/shop?cat=Georgette">Georgette Sarees</Link></li>
          <li><Link href="/shop?occ=Wedding">The Wedding Edit</Link></li>
        </Col>
        <Col title="Help">
          <li><Link href="/contact">Contact Us</Link></li>
          <li><Link href="/contact#faq">Shipping &amp; Delivery</Link></li>
          <li><Link href="/contact#faq">Returns &amp; Exchange</Link></li>
          <li><Link href="/contact#faq">Blouse Stitching</Link></li>
          <li><Link href="/contact#faq">Saree Care Guide</Link></li>
          <li><Link href="/about">Our Story</Link></li>
        </Col>
        <Col title="Visit Us" className="footer__visit">
          <li><Icon name="pin" /><span>{CONFIG.address[0]}<br />{CONFIG.address[1]}</span></li>
          <li><Icon name="phone" /><a href={CONFIG.phoneHref}>{CONFIG.phone}</a></li>
          <li><Icon name="mail" /><a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></li>
          <li><Icon name="clock" /><span>{CONFIG.hours}</span></li>
        </Col>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Anthariya by Nidhi Gowda. All rights reserved.</p>
          <p className="footer__pay">Secure payments · UPI · Cards · Net Banking</p>
        </div>
      </div>
    </footer>
  );
}
