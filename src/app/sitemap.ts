import type { MetadataRoute } from "next";
import { CONFIG } from "@/lib/config";
import { PRODUCTS, productUrl } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/shop", "/about", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${CONFIG.siteUrl}${p}`, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${CONFIG.siteUrl}${productUrl(p)}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
