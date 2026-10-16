"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/images";
import { AccountMenu } from "./AccountMenu";
import { Icon } from "./Icon";
import { useStore } from "./StoreProvider";

export const NAV = [
  { href: "/", label: "Home", key: "home" },
  { href: "/shop", label: "Shop", key: "shop" },
  { href: "/about", label: "About Us", key: "about" },
  { href: "/contact", label: "Contact Us", key: "contact" },
] as const;

export function activeKey(path: string) {
  if (path === "/") return "home";
  if (path.startsWith("/shop") || path.startsWith("/product")) return "shop";
  if (path.startsWith("/about")) return "about";
  if (path.startsWith("/contact")) return "contact";
  return "";
}

export function Header() {
  const path = usePathname();
  const active = activeKey(path);
  const { ready, cartCount, cartBump, wish, openPanel } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header__inner container">
          <Link href="/" className="brand" aria-label="Anthariya by Nidhi Gowda — Home">
            <Image src={IMAGES.logoGoldMark} alt="Anthariya" priority sizes="140px" />
          </Link>

          <nav className="nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href} className={`nav__link${active === n.key ? " is-active" : ""}`}
                aria-current={active === n.key ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <button className="icon-btn" type="button" aria-label="Search" onClick={() => openPanel("search")}>
              <Icon name="search" />
            </button>
            <Link className="icon-btn" href="/shop?view=wishlist" aria-label={`Wishlist${wish.length ? ` (${wish.length})` : ""}`}>
              <Icon name="heart" />
              <span className="badge" hidden={!ready || wish.length === 0}>{wish.length}</span>
            </Link>
            <AccountMenu />
            <Link className="icon-btn" href="/cart" aria-label={`Shopping bag${cartCount ? ` (${cartCount})` : ""}`}>
              <Icon name="bag" />
              <span key={cartBump} className={`badge${cartBump ? " bump" : ""}`} hidden={!ready || cartCount === 0}>{cartCount}</span>
            </Link>
            <button className="icon-btn header__burger" type="button" aria-label="Open menu" onClick={() => openPanel("menu")}>
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
