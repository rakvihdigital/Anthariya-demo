/* Orders placed through the (demo) checkout, kept in this browser. */

export type PayMethod = "cod" | "card" | "upi";
export type SavedOrder = { id: string; total: number; method: PayMethod; date: string; email?: string; items: { id: string; qty: number }[] };

export const ORDERS_KEY = "anthariya-orders";
export const METHOD_LABEL: Record<PayMethod, string> = { cod: "Cash on Delivery", card: "Card", upi: "UPI" };

/** Orders for this shopper, newest first. */
export function loadOrders(email?: string): SavedOrder[] {
  try {
    const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]") as SavedOrder[];
    return all.filter((o) => !email || !o.email || o.email.toLowerCase() === email.toLowerCase()).reverse();
  } catch {
    return [];
  }
}

export function saveOrder(o: SavedOrder) {
  try {
    const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    localStorage.setItem(ORDERS_KEY, JSON.stringify([...all, o]));
  } catch { /* storage unavailable */ }
}

const day = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
/** "21 Oct" style date for an order, and its 5–6 day delivery window */
export const orderDate = (o: SavedOrder) => day(new Date(o.date));
export const arrivalWindow = (o: SavedOrder) => {
  const a = new Date(o.date), b = new Date(o.date);
  a.setDate(a.getDate() + 5); b.setDate(b.getDate() + 6);
  return `${day(a)} – ${day(b)}`;
};
export const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
