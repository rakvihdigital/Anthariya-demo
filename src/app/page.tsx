import Image from "@/components/QualityImage";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { Icon, type IconName } from "@/components/Icon";
import { Parallax } from "@/components/Parallax";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, RevealLink, Words } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { WeaveBackdrop } from "@/components/WeaveBackdrop";
import { CONFIG } from "@/lib/config";
import { IMAGES, type ImageKey } from "@/lib/images";
import { sortedProducts } from "@/lib/products";

const MARQUEE = ["Handpicked Kanjivaram Silks", "Banarasi Weaves", "Hand Block Ajrakh", "Designer Organza", "Blouse Stitching on Request", "Shipping Across India"];

const WEAVES: { href: string; img: ImageKey; title: string; sub: string; pos?: string }[] = [
  { href: "/shop?cat=Silk", img: "mayuri", title: "Silk Sarees", sub: "Kanjivaram" },
  { href: "/shop?cat=Banarasi", img: "vanam", title: "Banarasi", sub: "From Varanasi" },
  { href: "/shop?cat=Cotton", img: "ajrakh", title: "Cotton & Ajrakh", sub: "Hand Block" },
  { href: "/shop?cat=Organza", img: "gulaab", title: "Organza", sub: "Sheer & Light", pos: "50% 20%" },
  { href: "/shop?cat=Georgette", img: "raatRani", title: "Georgette", sub: "Evening Glamour", pos: "50% 20%" },
];

const PROMISE: { icon: IconName; tag: string; title: ReactNode; text: string; feature?: boolean }[] = [
  { icon: "heart", tag: "Chosen one by one", title: "Handpicked Weaves", text: "Every saree is personally chosen for its weave, finish and feel." },
  { icon: "loom", tag: "From India’s looms", title: "Artisan Craft", text: "Celebrating Kanjivaram, Banarasi, ajrakh and the hands behind them." },
  { icon: "needle", tag: "Made to measure", title: "Blouse Stitching", text: "Tailored blouses, stitched to your measurements to complete your look." },
  { icon: "truck", tag: "Across India", title: <>Delivered in <em><span className="num">5–6</span> days</em></>, text: "Gift-ready packaging, shipped with care and at your door within 5–\u20606\u00a0days.", feature: true },
];

const INSTA: ImageKey[] = ["mayuri", "gulaab", "rajkumariDetail", "ajrakh", "vanam", "raatRani"];

export default function HomePage() {
  return (
    <main id="main">
      <HeroSlider />

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...MARQUEE, ...MARQUEE].map((t, k) => <span key={k}>{t}</span>)}
        </div>
      </div>

      {/* Shop by weave */}
      <Reveal as="section" variant="scene" className="section section--weaves on-dark">
        <WeaveBackdrop />
        <div className="container">
          <SectionHead crest="gold" script="Weaves" gold light eyebrow="Shop by Weave" title={<>Six yards of <em>India’s finest</em></>}
            lead="From temple-town silks to sun-washed block prints, explore the weaves that make every occasion unforgettable." />
          <div className="weaves">
            {WEAVES.map((w, k) => (
              <Link key={w.href} href={w.href} className="weave" style={{ "--k": k } as CSSProperties}>
                <div className="weave__img"><Image src={IMAGES[w.img]} alt="" sizes="(max-width: 720px) 45vw, 240px" style={w.pos ? { objectPosition: w.pos } : undefined} /></div>
                <h3>{w.title}</h3><p>{w.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {/* New arrivals */}
      <section className="section section--cream">
        <div className="container">
          <Reveal as="header" className="sec-head sec-head--split">
            <span className="sec-head__script" aria-hidden="true">Curated</span>
            <div>
              <span className="eyebrow">The Curated Edit</span>
              <h2 className="h2">New &amp; <em>much loved</em></h2>
            </div>
            <Link href="/shop" className="btn-link">View all sarees <Icon name="arrow" /></Link>
          </Reveal>
          <div className="products products--3">
            {sortedProducts().slice(0, 6).map((p, k) => <ProductCard key={p.id} p={p} index={k} />)}
          </div>
        </div>
      </section>

      {/* Promo banners */}
      <section className="section">
        <div className="container promo-duo">
          <RevealLink href="/shop?cat=Organza" className="promo" variant="mask">
            <Image src={IMAGES.gulaab} alt="Ivory floral organza saree" sizes="(max-width: 720px) 100vw, 50vw" style={{ objectPosition: "50% 25%" }} />
            <div className="promo__body">
              <span className="eyebrow eyebrow--gold">The Organza Edit</span>
              <h2 className="h2">Soft as a <em>whisper</em></h2>
              <span className="btn-link">Discover organza <Icon name="arrow" /></span>
            </div>
          </RevealLink>
          <RevealLink href="/shop?occ=Party" className="promo" variant="mask" delay={0.15}>
            <Image src={IMAGES.raatRani} alt="Midnight black sequin georgette saree" sizes="(max-width: 720px) 100vw, 50vw" style={{ objectPosition: "50% 25%" }} />
            <div className="promo__body">
              <span className="eyebrow eyebrow--gold">The Evening Edit</span>
              <h2 className="h2">After <em>dark</em></h2>
              <span className="btn-link">Shop party wear <Icon name="arrow" /></span>
            </div>
          </RevealLink>
        </div>
      </section>

      {/* Festive banner */}
      <section className="festive on-dark" aria-label="The Festive Edit">
        <Parallax className="festive__bg"><Image src={IMAGES.rajkumariDetail} alt="" sizes="100vw" /></Parallax>
        <div className="container">
          <Reveal className="festive__box" variant="stagger">
            <span className="eyebrow eyebrow--gold">The Festive Edit</span>
            <h2 className="display">Silks that glow <em>brighter</em> than the diyas</h2>
            <p className="lead">From Deepavali mornings to wedding-season evenings, discover jewel-toned silks with real zari, chosen for the moments you’ll remember.</p>
            <div className="slide__cta">
              <Link href="/shop?occ=Festive" className="btn btn--gold">Shop the Festive Edit <Icon name="arrow" arrow /></Link>
              <Link href="/contact" className="btn btn--ghost">Book a Styling Call</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container story">
          <Reveal className="story__media" variant="mask">
            <div className="arch">
              <div className="arch__img"><Image src={IMAGES.ajrakh} alt="Model seated in an ivory ajrakh hand block-printed saree" sizes="(max-width: 960px) 90vw, 480px" /></div>
            </div>
            <Parallax className="story__inset" speed={50}><Image src={IMAGES.rajkumariDetail} alt="Close-up of zari border on a plum silk saree" sizes="240px" /></Parallax>
          </Reveal>
          <Reveal className="story__text" variant="stagger" delay={0.2}>
            <span className="eyebrow">Our Story</span>
            <h2 className="h2">Every saree <em>holds a story</em></h2>
            <p className="lead">Anthariya was born from a simple belief: a saree is never just six yards of fabric. It is a mother’s blessing, a bride’s first step, a celebration remembered for a lifetime.</p>
            <p className="lead">Founded by Nidhi Gowda, our boutique brings together weaves from India’s celebrated looms, each one handpicked for its craft, its colour and the feeling it carries.</p>
            <div className="signature">
              <div><span className="script">Nidhi Gowda</span><small>Founder, Anthariya</small></div>
            </div>
            <Link href="/about" className="btn btn--line">Read Our Story <Icon name="arrow" arrow /></Link>
          </Reveal>
        </div>
      </section>

      {/* Promise */}
      <section className="section section--plum on-dark">
        <div className="container">
          <SectionHead crest="gold" script="Promise" gold light eyebrow="The Anthariya Promise" title={<>Crafted with <em>care</em>, chosen with love</>} />
          <Reveal className="promise" variant="stagger">
            {PROMISE.map((it) => (
              <div className={`promise__item${it.feature ? " promise__item--feature" : ""}`} key={it.tag}>
                <div className="promise__icon"><Icon name={it.icon} /></div>
                <span className="promise__tag">{it.tag}</span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Founder quote */}
      <section className="section section--cream">
        <div className="container">
          <Reveal as="figure" className="quote">
            <div className="quote__mark" aria-hidden="true">“</div>
            <blockquote><Words text="A saree should feel like coming home: familiar, graceful and entirely you. That is the feeling we fold into every Anthariya drape." /></blockquote>
            <cite><span className="script">Nidhi Gowda</span><small>Founder</small></cite>
          </Reveal>
        </div>
      </section>

      {/* Instagram */}
      <section className="section">
        <div className="container">
          <Reveal className="insta-head">
            <div>
              <span className="eyebrow">Follow the drape</span>
              <h2 className="h3" style={{ marginTop: 12 }}>#<em>DrapedInAnthariya</em></h2>
            </div>
            <a href={CONFIG.social.instagram} target="_blank" rel="noopener" className="btn-link">Follow {CONFIG.social.instagramHandle} <Icon name="arrow" /></a>
          </Reveal>
          <Reveal className="insta" variant="stagger">
            {INSTA.map((k) => (
              <a key={k} href={CONFIG.social.instagram} target="_blank" rel="noopener" aria-label={`Anthariya on Instagram (${CONFIG.social.instagramHandle})`}>
                <Image src={IMAGES[k]} alt="" sizes="(max-width: 720px) 33vw, 220px" /><Icon name="instagram" />
              </a>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
