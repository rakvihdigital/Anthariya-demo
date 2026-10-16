import type { Metadata } from "next";
import { AccountPage } from "@/components/AccountPage";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "My Account", description: "Your Anthariya orders, wishlist and details.", robots: { index: false } };

export default function Account() {
  return (
    <main id="main">
      <PageHero compact crumb="My Account" title={<>My <em>Account</em></>} lead="Your orders, wishlist and details, all in one place." />
      <section className="section co-section">
        <div className="container"><AccountPage /></div>
      </section>
    </main>
  );
}
