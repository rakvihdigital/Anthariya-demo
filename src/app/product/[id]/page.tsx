import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { CONFIG } from "@/lib/config";
import { IMAGES } from "@/lib/images";
import { byId, PRODUCTS, productUrl } from "@/lib/products";

export const dynamicParams = false; // only the sarees in the catalogue have pages; anything else is a 404

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/product/[id]">): Promise<Metadata> {
  const p = byId((await params).id);
  if (!p) return {};
  const img = IMAGES[p.images[0]];
  return {
    title: `${p.name}, ${p.subtitle}`,
    description: p.desc,
    alternates: { canonical: productUrl(p) },
    openGraph: { title: `${p.name}, ${p.subtitle} | ${CONFIG.brand}`, description: p.desc, images: [{ url: img.src, width: img.width, height: img.height }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[id]">) {
  const p = byId((await params).id);
  if (!p) notFound();

  // related sarees: same weave first, then the rest
  const related = PRODUCTS.filter((x) => x.id !== p.id)
    .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category) || a.order - b.order)
    .slice(0, 4);

  // structured data so search engines can show price & availability
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name} – ${p.subtitle}`,
    description: p.desc,
    image: `${CONFIG.siteUrl}${IMAGES[p.images[0]].src}`,
    brand: { "@type": "Brand", name: CONFIG.brand },
    category: `${p.category} Saree`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: p.price,
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${CONFIG.siteUrl}${productUrl(p)}`,
    },
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="pd-crumbs">
        <div className="container">
          <nav className="crumbs crumbs--dark" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span>
            <Link href="/shop">Shop</Link><span>/</span>
            <Link href={`/shop?cat=${encodeURIComponent(p.category)}`}>{p.category}</Link><span>/</span>
            <span aria-current="page">{p.name}</span>
          </nav>
        </div>
      </div>

      <section className="container">
        <ProductDetail id={p.id} />
      </section>

      {related.length > 0 && (
        <section className="section section--cream pd-related">
          <div className="container">
            <header className="sec-head sec-head--split">
              <div>
                <span className="eyebrow">Complete the Edit</span>
                <h2 className="h2">You may <em>also love</em></h2>
              </div>
              <Link href="/shop" className="btn-link">View all sarees <Icon name="arrow" /></Link>
            </header>
            <div className="products">
              {related.map((r, k) => <ProductCard key={r.id} p={r} index={k} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
