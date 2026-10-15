"use client";

import Link from "next/link";
import { createElement, Fragment, useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/* One shared observer for every element that fades up as it scrolls into view. */
let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          callbacks.get(en.target)?.();
          observer!.unobserve(en.target);
          callbacks.delete(en.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
  }
  return observer;
}

/**
 * up      – fades up out of a soft blur (default)
 * mask    – a curtain lifts off the content while its image settles from a slight zoom
 * stagger – the element stays put and its children rise in one after another
 * scene   – nothing moves by itself; it only gains `is-in` so a whole section can choreograph its own entrance
 */
type Variant = "up" | "mask" | "stagger" | "scene";

type RevealProps = {
  as?: ElementType;
  variant?: Variant;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  children?: ReactNode;
  [attr: string]: unknown;
};

export function Reveal({ as = "div", variant = "up", className, delay, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant === "stagger") Array.from(el.children).forEach((c, k) => (c as HTMLElement).style.setProperty("--i", String(k)));
    if (!("IntersectionObserver" in window)) { setShown(true); return; }
    callbacks.set(el, () => setShown(true));
    const io = getObserver();
    io.observe(el);
    return () => { io.unobserve(el); callbacks.delete(el); };
  }, []);

  return createElement(
    as,
    {
      ref,
      "data-reveal": variant,
      className: [className, shown && "is-in"].filter(Boolean).join(" ") || undefined,
      style: delay ? ({ ...style, "--d": `${delay}s` } as CSSProperties) : style,
      ...rest,
    },
    children,
  );
}

/** A <Link> that fades up into view. */
export function RevealLink({ href, ...rest }: Omit<RevealProps, "as"> & { href: string }) {
  return <Reveal as={Link} href={href} {...rest} />;
}

/** Splits text into words that drift in one by one when an enclosing Reveal comes into view. */
export function Words({ text }: { text: string }) {
  return text.split(" ").map((w, k) => (
    <Fragment key={k}><span className="w" style={{ "--i": k } as CSSProperties}>{w}</span>{" "}</Fragment>
  ));
}
