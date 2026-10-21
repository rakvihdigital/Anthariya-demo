import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import Image from "@/components/QualityImage";
import { CONFIG, waHello } from "@/lib/config";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Anthariya by Nidhi Gowda. Visit our boutique, call, WhatsApp or email us for orders, styling help and blouse stitching.",
};

const FAQ = [
  { q: "How long does delivery take?", a: "Orders are delivered across India within 5–6 days. You’ll receive tracking details as soon as your saree ships." },
  { q: "Do you offer blouse stitching?", a: "Yes. Share your measurements or a well-fitting blouse sample and your preferred design, and we’ll tailor the blouse for you. Stitching typically adds 5–7 days to delivery." },
  { q: "What is your return and exchange policy?", a: "Unused sarees with tags intact can be exchanged within 7 days of delivery. Stitched blouses, fall-pico finished sarees and sale items are not eligible for exchange." },
  { q: "Do colours look the same as in the photos?", a: "We photograph every saree in natural light to stay true to colour, though slight variations can occur between screens. Message us on WhatsApp and we’ll happily share a live video." },
  { q: "How should I care for my silk saree?", a: "Dry clean only, store folded in a muslin cloth away from direct sunlight, and refold every few months to protect the zari. Avoid spraying perfume directly onto silk." },
];

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero crumb="Contact Us" title={<>Let’s <em>talk</em> sarees</>}
        lead="Questions about a weave, an order or the perfect blouse? We’re only a message away."
        style={{ paddingBottom: "clamp(60px,6.5vw,92px)" }} />

      <div className="container">
        <div className="contact-cards">
          <Reveal className="ccard">
            <div className="ccard__icon"><Icon name="pin" /></div>
            <h3>Visit</h3>
            <p>{CONFIG.address[0]}<br />{CONFIG.address[1]}</p>
          </Reveal>
          <Reveal className="ccard" delay={0.08}>
            <div className="ccard__icon"><Icon name="phone" /></div>
            <h3>Call / WhatsApp</h3>
            <p><a href={CONFIG.phoneHref}>{CONFIG.phone}</a><br /><a href={waHello()} target="_blank" rel="noopener">Chat on WhatsApp</a></p>
          </Reveal>
          <Reveal className="ccard" delay={0.16}>
            <div className="ccard__icon"><Icon name="mail" /></div>
            <h3>Email</h3>
            <p><a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a><br />We reply within a day</p>
          </Reveal>
          <Reveal className="ccard" delay={0.24}>
            <div className="ccard__icon"><Icon name="clock" /></div>
            <h3>Hours</h3>
            <p>Monday – Saturday<br />10:30 am – 8:30 pm</p>
          </Reveal>
        </div>
      </div>

      <section className="section">
        <div className="container contact">
          <Reveal>
            <span className="eyebrow">Write to Us</span>
            <h2 className="h2" style={{ margin: "14px 0 14px" }}>Send us a <em>message</em></h2>
            <p className="lead" style={{ marginBottom: 36 }}>Fill in the form and our team will get back to you shortly. For quick answers, WhatsApp is the fastest way to reach us.</p>
            <ContactForm />
          </Reveal>
          <Reveal className="map" delay={0.12}>
            <iframe title="Anthariya boutique location" src={`https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapQuery)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </Reveal>
        </div>
      </section>

      {/* Instagram: one card per account */}
      <section className="section insta-world on-dark">
        <div className="container">
          <SectionHead crest="gold" script="Instagram" gold light eyebrow="Follow our world" title={<>Find us on <em>Instagram</em></>}
            lead="Three corners of Anthariya, each with its own story. Follow along for new drapes, close-ups and lessons from Nidhi." />
          <Reveal className="insta-world__grid" variant="stagger">
            {CONFIG.social.instagramAccounts.map((a) => (
              <a key={a.handle} href={a.url} target="_blank" rel="noopener" className="ig-card">
                <span className="ig-card__badge"><span><Icon name="instagram" /></span></span>
                <strong className="ig-card__name">{a.name}</strong>
                <span className="ig-card__handle">{a.handle}</span>
                <span className="ig-card__note">{a.note}</span>
                <p className="ig-card__about">{a.about}</p>
                <span className="ig-card__photos" aria-hidden="true">
                  {a.photos.map((im) => <span key={im}><Image src={IMAGES[im]} alt="" sizes="120px" /></span>)}
                </span>
                <span className="ig-card__follow"><Icon name="instagram" /> Follow {a.handle}</span>
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--cream" id="faq">
        <div className="container">
          <SectionHead crest="plum" eyebrow="Good to Know" title={<>Frequently <em>asked</em></>} />
          <Reveal className="faq">
            {FAQ.map((f, k) => (
              <details key={f.q} open={k === 0}>
                <summary>{f.q} <i><Icon name="plus" /></i></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
