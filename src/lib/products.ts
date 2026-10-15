import type { IconName } from "@/components/Icon";
import type { ImageKey } from "./images";

export type Category = "Silk" | "Banarasi" | "Organza" | "Georgette" | "Cotton";
export type Occasion = "Wedding" | "Festive" | "Party" | "Everyday";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  occasion: Occasion[];
  price: number;
  /** Original price. When higher than price, the card shows a "% off" badge and a struck-out price. */
  mrp: number | null;
  /** Average star rating from real customer reviews (e.g. 4.8). Leave null to hide stars. */
  rating: number | null;
  reviews: number;
  /** Set to false to show "Sold out" and disable Add to bag. */
  inStock: boolean;
  tag: "" | "New" | "Bestseller" | "Handcrafted";
  order: number;
  color: string;
  images: ImageKey[];
  desc: string;
  specs: Record<string, string>;
}

/* ---------- Product catalogue (edit / add products here) ---------- */
export const PRODUCTS: Product[] = [
  {
    id: "rajkumari", name: "Rajkumari", subtitle: "Plum Kanjivaram Silk",
    category: "Silk", occasion: ["Wedding", "Festive"], price: 18500, tag: "Bestseller", order: 1,
    color: "Plum", inStock: true, mrp: null, rating: null, reviews: 0,
    images: ["rajkumari", "rajkumariDetail"],
    desc: "A regal plum silk with a lilac-and-gold zari border and scattered butta motifs, made for muhurtham mornings and grand celebrations.",
    specs: { Fabric: "Silk with antique-gold zari", Weave: "Kanjivaram", Length: "5.5 m + 0.8 m blouse piece", Care: "Dry clean only" },
  },
  {
    id: "mayuri", name: "Mayuri", subtitle: "Emerald & Rani Pink Silk",
    category: "Silk", occasion: ["Wedding", "Festive"], price: 16900, tag: "New", order: 2,
    color: "Emerald", inStock: true, mrp: null, rating: null, reviews: 0,
    images: ["mayuri"],
    desc: "A deep emerald body framed by a rani-pink border with fine gold stripes. The classic South Indian bridal pairing, rich yet graceful.",
    specs: { Fabric: "Silk with gold zari", Weave: "Kanjivaram", Length: "5.5 m + 0.8 m blouse piece", Care: "Dry clean only" },
  },
  {
    id: "vanam", name: "Vanam", subtitle: "Bottle Green Banarasi",
    category: "Banarasi", occasion: ["Festive"], price: 9800, tag: "", order: 3,
    color: "Green", inStock: true, mrp: null, rating: null, reviews: 0,
    images: ["vanam"],
    desc: "Bottle-green Banarasi with a blush-pink pallu and woven coin motifs. Festive, fluid and effortlessly elegant.",
    specs: { Fabric: "Banarasi soft silk", Weave: "Banarasi", Length: "5.5 m + 0.8 m blouse piece", Care: "Dry clean recommended" },
  },
  {
    id: "gulaab", name: "Gulaab", subtitle: "Ivory Floral Organza",
    category: "Organza", occasion: ["Party", "Festive"], price: 6500, tag: "New", order: 4,
    color: "Ivory", inStock: true, mrp: null, rating: null, reviews: 0,
    images: ["gulaab"],
    desc: "Ivory organza scattered with painted roses and finished with a scalloped, bead-edged border. Light as air, lovely in every photograph.",
    specs: { Fabric: "Organza", Detail: "Scalloped bead-work border", Length: "5.5 m + 0.8 m blouse piece", Care: "Dry clean only" },
  },
  {
    id: "raat-rani", name: "Raat Rani", subtitle: "Midnight Sequin Georgette",
    category: "Georgette", occasion: ["Party"], price: 7200, tag: "", order: 5,
    color: "Black", inStock: true, mrp: null, rating: null, reviews: 0,
    images: ["raatRani"],
    desc: "Midnight-black georgette with tonal sequin trails and a cut-work border. Your answer to every evening invitation.",
    specs: { Fabric: "Georgette", Detail: "Sequin & cut-work border", Length: "5.5 m + 0.8 m blouse piece", Care: "Dry clean only" },
  },
  {
    id: "ajrakh", name: "Ajrakh", subtitle: "Ivory Hand Block Mul Cotton",
    category: "Cotton", occasion: ["Everyday"], price: 4200, tag: "Handcrafted", order: 6,
    color: "Ivory", inStock: true, mrp: null, rating: null, reviews: 0,
    images: ["ajrakh"],
    desc: "Hand block-printed ajrakh on soft mul cotton in ivory, madder red and indigo. Breathable, everyday luxury that only gets softer with time.",
    specs: { Fabric: "Mul cotton", Craft: "Hand block print", Length: "5.5 m + 0.8 m blouse piece", Care: "Gentle hand wash, dry in shade" },
  },
];

/* ---------- How each attribute is shown (shop filters and product page) ---------- */
/** Swatch colour for each saree colour name. Add a line here when you add a new colour. */
export const COLOR_HEX: Record<string, string> = { Plum: "#6b1748", Emerald: "#0e6b50", Green: "#1f5a3b", Ivory: "#f3ead6", Black: "#1d1a1e" };
export const OCCASION_INFO: Record<Occasion, { icon: IconName; note: string }> = {
  Wedding: { icon: "rings", note: "Muhurtham & receptions" },
  Festive: { icon: "diya", note: "Pujas & celebrations" },
  Party: { icon: "moon", note: "Evening events" },
  Everyday: { icon: "sun", note: "Work & daywear" },
};
/** A photo that represents each weave. */
export const WEAVE_IMAGE: Record<Category, ImageKey> = { Silk: "mayuri", Banarasi: "vanam", Organza: "gulaab", Georgette: "raatRani", Cotton: "ajrakh" };
export const WEAVE_NAME: Record<Category, string> = { Silk: "Kanjivaram Silk", Banarasi: "Banarasi", Organza: "Organza", Georgette: "Georgette", Cotton: "Ajrakh Cotton" };
export const COLLECTION_INFO: Record<string, { icon: IconName; note: string }> = {
  New: { icon: "gem", note: "Just arrived" },
  Bestseller: { icon: "star", note: "Most loved" },
  Handcrafted: { icon: "loom", note: "Made by hand" },
};

export const byId = (id: string | null | undefined) => PRODUCTS.find((p) => p.id === id);
export const sortedProducts = () => [...PRODUCTS].sort((a, b) => a.order - b.order);
export const productUrl = (p: Pick<Product, "id">) => `/product/${encodeURIComponent(p.id)}`;
export const offPct = (p: Product) => (p.mrp && p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0);
export const matches = (p: Product, q: string) =>
  [p.name, p.subtitle, p.category, p.occasion.join(" "), p.desc].join(" ").toLowerCase().includes(q);

export const WEAVE_NOTES: Record<Category, string> = {
  Silk: "Kanjivaram silks are woven in Kanchipuram, Tamil Nadu, and are loved for their rich silk, bold contrast borders and zari work. They are the classic choice for South Indian weddings and festivals, and are often passed down as heirlooms.",
  Banarasi: "Banarasi sarees are woven in Varanasi and are prized for their intricate brocade motifs, often inspired by florals and buttas. Soft-silk Banarasi drapes fluidly while keeping the woven richness the city is famous for.",
  Organza: "Organza is a sheer, crisp fabric that holds its shape beautifully while staying feather-light. It photographs wonderfully and is a favourite for receptions, parties and day functions.",
  Georgette: "Georgette is a light, flowing fabric with a soft grainy texture. It drapes close to the body, resists creasing and stays comfortable through a long evening.",
  Cotton: "Ajrakh is a centuries-old hand block printing tradition from Kutch and Sindh, built up through layers of printing, resist and dyeing. On soft mul cotton it becomes a breathable saree that grows softer with time.",
};

export const CARE: Record<Category, string[]> = {
  Silk: ["Dry clean only", "Store folded in a muslin cloth, away from direct sunlight", "Refold every few months to protect the zari", "Never spray perfume directly on silk"],
  Banarasi: ["Dry clean recommended", "Store in a muslin cloth to let the fabric breathe", "Refold every few months to protect the zari"],
  Organza: ["Dry clean only", "Steam iron on low heat; avoid direct contact with embellishments", "Store flat or loosely folded"],
  Georgette: ["Dry clean only", "Steam lightly to remove creases", "Store folded with tissue between the sequinned layers"],
  Cotton: ["Gentle hand wash in cold water, separately", "Dry in shade to keep the natural colours rich", "Iron on medium heat"],
};
