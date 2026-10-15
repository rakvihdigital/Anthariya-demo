import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/images";

export default function NotFound() {
  return (
    <main id="main">
      <section className="section">
        <div className="container empty-state" style={{ padding: "70px 20px" }}>
          <Image src={IMAGES.crestPlum} alt="" sizes="110px" />
          <h1 className="h2">This page has <em>wandered off</em></h1>
          <p>The saree or page you were looking for isn’t here. It may have found its home already.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/shop" className="btn btn--plum">Back to Shop</Link>
            <Link href="/" className="btn btn--line">Go to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
