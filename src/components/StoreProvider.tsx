"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { byId } from "@/lib/products";

export type Panel = "menu" | "cart" | "search" | "quickview" | "filters";
export type CartLine = { id: string; qty: number };
export type User = { name: string; email: string };

type Store = {
  ready: boolean;
  cart: CartLine[];
  cartCount: number;
  cartBump: number;
  wish: string[];
  user: User | null;
  panel: Panel | null;
  quickId: string | null;
  toastMsg: { node: ReactNode; key: number } | null;
  addToCart: (id: string, qty?: number) => void;
  changeQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  openPanel: (p: Panel) => void;
  closePanels: () => void;
  openQuickView: (id: string) => void;
  toast: (node: ReactNode) => void;
  signIn: (u: User) => void;
  signOut: () => void;
};

const StoreContext = createContext<Store | null>(null);

const KEYS = { cart: "anthariya-cart", wish: "anthariya-wish", user: "anthariya-user" };
function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode etc.) */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wish, setWish] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [quickId, setQuickId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<Store["toastMsg"]>(null);
  const [cartBump, setCartBump] = useState(0);
  const lastFocus = useRef<HTMLElement | null>(null);
  const panelRef = useRef(panel);
  const wishRef = useRef(wish);
  useEffect(() => { panelRef.current = panel; }, [panel]);
  useEffect(() => { wishRef.current = wish; }, [wish]);

  // Restore saved bag, wishlist and account after the first render (keeps server and browser HTML identical)
  useEffect(() => {
    setCart(load<CartLine[]>(KEYS.cart, []).filter((l) => byId(l.id) && l.qty > 0));
    setWish(load<string[]>(KEYS.wish, []).filter((id) => byId(id)));
    setUser(load<User | null>(KEYS.user, null));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) save(KEYS.cart, cart); }, [cart, ready]);
  useEffect(() => { if (ready) save(KEYS.wish, wish); }, [wish, ready]);
  useEffect(() => { if (ready) save(KEYS.user, user); }, [user, ready]);

  const toast = useCallback((node: ReactNode) => setToastMsg({ node, key: Date.now() }), []);

  const openPanel = useCallback((p: Panel) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setPanel(p);
  }, []);
  const closePanels = useCallback(() => {
    if (!panelRef.current) return;
    setPanel(null);
    setTimeout(() => lastFocus.current?.focus?.(), 0);
  }, []);

  // Lock page scroll while a drawer / modal is open; Escape closes it
  useEffect(() => {
    document.body.classList.toggle("is-locked", !!panel);
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanels();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel, closePanels]);

  const addToCart = useCallback((id: string, qty = 1) => {
    const p = byId(id);
    if (!p || !p.inStock) return;
    setCart((c) => (c.some((l) => l.id === id) ? c.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...c, { id, qty }]));
    setCartBump((n) => n + 1);
    toast(<><strong>{p.name}</strong> added to your bag · <Link href="/cart" className="toast__link">View bag</Link></>);
  }, [toast]);
  const changeQty = useCallback((id: string, delta: number) => {
    setCart((c) => c.map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0));
  }, []);
  const removeFromCart = useCallback((id: string) => setCart((c) => c.filter((l) => l.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback((id: string) => {
    const p = byId(id);
    if (!p) return;
    const on = !wishRef.current.includes(id);
    wishRef.current = on ? [...wishRef.current, id] : wishRef.current.filter((x) => x !== id);
    setWish(wishRef.current);
    toast(on ? <><strong>{p.name}</strong> saved to your wishlist</> : "Removed from your wishlist");
  }, [toast]);

  const openQuickView = useCallback((id: string) => {
    setQuickId(id);
    openPanel("quickview");
  }, [openPanel]);

  const signIn = useCallback((u: User) => setUser(u), []);
  const signOut = useCallback(() => {
    setUser(null);
    toast("You’ve been signed out");
  }, [toast]);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const value = useMemo<Store>(() => ({
    ready, cart, cartCount, cartBump, wish, user, panel, quickId, toastMsg,
    addToCart, changeQty, removeFromCart, clearCart, toggleWish, openPanel, closePanels, openQuickView, toast, signIn, signOut,
  }), [ready, cart, cartCount, cartBump, wish, user, panel, quickId, toastMsg,
    addToCart, changeQty, removeFromCart, clearCart, toggleWish, openPanel, closePanels, openQuickView, toast, signIn, signOut]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
