"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/images";
import { Icon } from "./Icon";
import { useStore } from "./StoreProvider";

export const NAV = [
  { href: "/", label: "Home", key: "home" },
  { href: "/shop", label: "Shop", key: "shop" },
  { href: "/about", label: "About Us", key: "about" },
  { href: "/contact", label: "Contact", key: "contact" },
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
  const { ready, cartCount, cartBump, wish, user, openPanel } = useStore();
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
          <div className="header__mobile">
            <button className="icon-btn" type="button" aria-label="Open menu" onClick={() => openPanel("menu")}>
              <Icon name="menu" />
            </button>
            <button className="icon-btn" type="button" aria-label="Search" onClick={() => openPanel("search")}>
              <Icon name="search" />
            </button>
          </div>

          <nav className="nav nav--left" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href} className={`nav__link${active === n.key ? " is-active" : ""}`}
                aria-current={active === n.key ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="brand" aria-label="Anthariya by Nidhi Gowda — Home">
            <Image src={IMAGES.logoGold} alt="Anthariya by Nidhi Gowda" priority sizes="160px" />
          </Link>

          <div className="header__actions">
            <button className="icon-btn hide-sm" type="button" aria-label="Search" onClick={() => openPanel("search")}>
              <Icon name="search" />
            </button>
            <Link className="icon-btn hide-sm" href="/shop?view=wishlist" aria-label={`Wishlist${wish.length ? ` (${wish.length})` : ""}`}>
              <Icon name="heart" />
              <span className="badge" hidden={!ready || wish.length === 0}>{wish.length}</span>
            </Link>
            <Link className={`icon-btn account-btn${user ? " is-in" : ""}`} href="/login"
              aria-label={user ? `My account (${user.name})` : "Login or sign up"} title={user ? `Hi, ${user.name}` : "Login / Sign up"}>
              <Icon name="user" />
            </Link>
            <button className="icon-btn" type="button" aria-label={`Open shopping bag${cartCount ? ` (${cartCount})` : ""}`} onClick={() => openPanel("cart")}>
              <Icon name="bag" />
              <span key={cartBump} className={`badge${cartBump ? " bump" : ""}`} hidden={!ready || cartCount === 0}>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
