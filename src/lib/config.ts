/* ---------- Store settings (edit these) ---------- */
import type { ImageKey } from "./images";

export const CONFIG = {
  brand: "Anthariya by Nidhi Gowda",
  whatsapp: "919019283218", // country code + number, no "+" or spaces
  phone: "+91 90192 83218",
  phoneHref: "tel:+919019283218",
  email: "anthariyasarees@gmail.com",
  address: ["#976, Old Outer Ring Road, Papareddypalya,", "Nagarabhavi 2nd Stage, Bengaluru - 560072"],
  /** What the map on the contact page searches for. */
  mapQuery: "#976, Old Outer Ring Road, Papareddypalya, Nagarabhavi 2nd Stage, Bengaluru 560072",
  hours: "Mon – Sat · 10:30 am – 8:30 pm",
  freeShippingAbove: 2999,
  /** delivery charge on orders below freeShippingAbove */
  shippingFee: 99,
  /** checkout places a sample order only (no payment is taken and nothing is sent); set false once real payments are connected */
  demoCheckout: true,
  social: {
    instagram: "https://www.instagram.com/anthariya_/",
    instagramHandle: "@anthariya_",
    /** every Instagram account, shown in the footer and on the About page */
    instagramAccounts: [
      { name: "Anthariya", note: "The boutique", about: "New arrivals, festive edits and styling from the boutique.", handle: "@anthariya_", url: "https://www.instagram.com/anthariya_/", photos: ["bannerSignature", "mayuri", "gulaab"] as ImageKey[] },
      { name: "Anthariya Silks", note: "Our silk collection", about: "Kanjivaram, Banarasi and pure silk drapes, up close.", handle: "@anthariya_silks", url: "https://www.instagram.com/anthariya_silks/", photos: ["rajkumari", "vanam", "rajkumariDetail"] as ImageKey[] },
      { name: "Anthariya Fashion Academy", note: "Learn with Nidhi", about: "Draping, styling and design lessons from Nidhi Gowda.", handle: "@anthariya_fashionacademy", url: "https://www.instagram.com/anthariya_fashionacademy/", photos: ["ajrakh", "raatRani", "bannerRajkumari"] as ImageKey[] },
    ],
  },
  /** Public URL of the live site, used for share links and social previews. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const waLink = (text: string) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
export const waHello = () => waLink(`Hello ${CONFIG.brand}! I'd love some help choosing a saree.`);
export const money = (n: number) => "₹" + Number(n).toLocaleString("en-IN");
export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
export const phoneOk = (v: string) => !v.trim() || /^[+\d][\d\s-]{7,}$/.test(v.trim());
