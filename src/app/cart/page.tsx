import type { Metadata } from "next";
import { CartPage } from "@/components/CartPage";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review your sarees and check out securely: Cash on Delivery, cards and UPI, delivered across India in 5–6 days.",
  robots: { index: false },
};

export default function Cart() {
  return (
    <main id="main">
      <PageHero compact crumb="Your Bag" title={<>Your <em>Bag</em></>} lead="Handpicked for you, wrapped with care and delivered in 5–6 days." />
      <section className="section co-section">
        <div className="container"><CartPage /></div>
      </section>
    </main>
  );
}
