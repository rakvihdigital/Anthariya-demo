import type { Metadata } from "next";
import Image from "@/components/QualityImage";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { CONFIG } from "@/lib/config";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Anthariya by Nidhi Gowda, a saree boutique celebrating India's weaves, its weavers and the women who wear them.",
};

const JOURNEY = [
  { n: "i", title: "Sourced", text: "Handpicked from weaving clusters and trusted makers across India." },
  { n: "ii", title: "Inspected", text: "Every inch checked by hand for weave, zari, colour and finish." },
  { n: "iii", title: "Styled", text: "Paired with blouse ideas and, if you wish, tailored to your measure." },
  { n: "iv", title: "Delivered", text: "Wrapped with care and sent to your door, ready to celebrate." },
];

const VALUES: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "Authenticity", text: "Honest descriptions, real fabrics and true colours. What you see is what you drape." },
  { icon: "loom", title: "Respect for Craft", text: "We celebrate the weavers and printers whose skill turns thread into heirlooms." },
  { icon: "heart", title: "Personal Care", text: "From choosing the right saree to styling the blouse, we’re with you at every step." },
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero crumb="About Us" title={<>The heart <em>behind</em> the drape</>}
        lead="“Anthariya” speaks of the inner self, the grace that lives within. Our sarees are made to bring it out." />

      <section className="section">
        <div className="container about-intro">
          <Reveal className="about-intro__media" variant="stagger">
            <figure><Image src={IMAGES.mayuri} alt="Emerald and rani pink silk saree" sizes="(max-width: 960px) 60vw, 380px" /></figure>
            <figure><Image src={IMAGES.ajrakh} alt="Ivory ajrakh cotton saree" sizes="(max-width: 960px) 50vw, 300px" /></figure>
            <div className="about-intro__badge"><div><Image src={IMAGES.crestGold} alt="" sizes="80px" />Handpicked<br />with love</div></div>
          </Reveal>
          <Reveal variant="stagger" delay={0.15}>
            <span className="eyebrow">Our Story</span>
            <h2 className="h2">Where <em>tradition</em> meets the woman of today</h2>
            <p className="lead">Anthariya began with Nidhi Gowda’s lifelong love for sarees: the rustle of a new Kanjivaram, the scent of a cotton fresh off the block-printing table, the pride of draping something truly beautiful.</p>
            <p className="lead">What started as a passion became a boutique, a curated home for weaves from India’s great textile traditions. We work closely with weavers and trusted suppliers to bring you sarees that are authentic, wearable and made to last.</p>
            <div className="signature">
              <div><span className="script">Nidhi Gowda</span><small>Founder, Anthariya</small></div>
            </div>
            <Link href="/shop" className="btn btn--plum">Explore the Collection <Icon name="arrow" arrow /></Link>
          </Reveal>
        </div>
      </section>

      {/* The Art of Draping Traditions */}
      <section className="section section--cream draping">
        <div className="container">
          <SectionHead crest="plum" script="Tradition" eyebrow="We love what we do" title={<>The art of <em>draping traditions</em></>} />
          <div className="draping__text">
            <Reveal className="draping__col">
              <span className="draping__no">i</span>
              <p>Founded by Nidhi Gowda, Anthariya reflects the timeless elegance of India’s rich textile heritage, thoughtfully reimagined for the contemporary woman. Each collection is a harmonious blend of tradition and modernity, crafted with a deep appreciation for artisanal excellence. Our designs celebrate the strength, grace and individuality of women who carry the essence of heritage into today’s world with confidence and style.</p>
            </Reveal>
            <Reveal className="draping__col" delay={0.12}>
              <span className="draping__no">ii</span>
              <p>Our sarees are sourced directly from skilled weavers, eliminating middlemen so you receive authentic craftsmanship at the best price. From semi-silk daily elegance to rich pure Kanjeevaram bridal collections, we bring you a wide variety that suits every taste and celebration. We assure you of premium quality and genuine fabrics at a reasonable price, so you can shop with complete confidence and experience beauty.</p>
            </Reveal>
          </div>
          <Reveal className="insta-accounts" variant="stagger">
            {CONFIG.social.instagramAccounts.map((a) => (
              <a key={a.handle} href={a.url} target="_blank" rel="noopener" className="insta-account">
                <span className="insta-account__ring"><span><Icon name="instagram" /></span></span>
                <span className="insta-account__text">
                  <strong>{a.name}</strong>
                  <small>{a.note}</small>
                  <span className="insta-account__handle">{a.handle}</span>
                </span>
                <span className="insta-account__follow" aria-hidden="true"><Icon name="arrow" /></span>
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <SectionHead crest="plum" eyebrow="From Loom to You" title={<>The journey of <em>every saree</em></>} />
          <Reveal className="journey" variant="stagger">
            {JOURNEY.map((j) => (
              <div key={j.n} className="journey__step">
                <div className="journey__num">{j.n}</div>
                <h3>{j.title}</h3>
                <p>{j.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--plum on-dark">
        <div className="container">
          <SectionHead gold light eyebrow="What We Stand For" title={<>Our <em>values</em></>} />
          <Reveal className="values" variant="stagger">
            {VALUES.map((v, k) => (
              <div key={v.title} className="value">
                <span className="value__no">0{k + 1}</span>
                <div className="value__icon"><Icon name={v.icon} /></div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Visit Us" title={<>Step into <em>our boutique</em></>} lead="Shelves full of colour, and all the time you need to find the one." />
          <Reveal className="boutique" variant="stagger">
            <figure><Image src={IMAGES.gulaab} alt="Inside the Anthariya boutique" sizes="(max-width: 960px) 50vw, 380px" /><figcaption>The Boutique</figcaption></figure>
            <figure><Image src={IMAGES.raatRani} alt="Saree shelves at the Anthariya boutique" sizes="(max-width: 960px) 50vw, 380px" /><figcaption>Our Shelves</figcaption></figure>
            <div className="boutique__text">
              <h3 className="h3">A personal <em>styling</em> experience</h3>
              <p>Visit us to see, feel and drape the sarees before you choose.</p>
              <ul>
                <li><Icon name="check" />One-on-one saree consultations</li>
                <li><Icon name="check" />Bridal &amp; trousseau shopping</li>
                <li><Icon name="check" />Custom blouse stitching</li>
                <li><Icon name="check" />Video-call shopping from anywhere</li>
              </ul>
              <Link href="/contact" className="btn btn--gold">Plan Your Visit <Icon name="arrow" arrow /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--cream">
        <Reveal className="container cta-band" variant="stagger">
          <Image className="sec-head__crest" src={IMAGES.crestPlum} alt="" sizes="90px" />
          <h2 className="display">Find the saree that feels like <em>you</em></h2>
          <p className="lead">Browse the collection online, or tell us what you’re dreaming of and we’ll help you find it.</p>
          <div className="btns">
            <Link href="/shop" className="btn btn--plum">Shop Now <Icon name="arrow" arrow /></Link>
            <Link href="/contact" className="btn btn--line">Contact Us</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
