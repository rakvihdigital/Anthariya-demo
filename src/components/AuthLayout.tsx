import Image from "@/components/QualityImage";
import Link from "next/link";
import { IMAGES, type ImageKey } from "@/lib/images";
import { AuthForm } from "./AuthForms";
import { Icon, type IconName } from "./Icon";

const ART: Record<"login" | "signup", { img: ImageKey; title: React.ReactNode; text: string; perks: [IconName, string][] }> = {
  login: {
    img: "signature",
    title: <>Welcome back to <em>Anthariya</em></>,
    text: "Sign in to see your saved sarees and shop your favourites faster.",
    perks: [["heart", "Your wishlist, saved across visits"], ["whatsapp", "Quicker orders on WhatsApp"], ["gem", "First look at new weaves"]],
  },
  signup: {
    img: "mayuri",
    title: <>Join the <em>Anthariya</em> circle</>,
    text: "Create your account in under a minute and make every visit more personal.",
    perks: [["heart", "Save sarees you love"], ["needle", "Blouse measurements kept handy"], ["gem", "Early access to festive edits"]],
  },
};

export function AuthLayout({ mode }: { mode: "login" | "signup" }) {
  const art = ART[mode];
  return (
    <main id="main">
      <section className="section section--tight">
        <div className="container">
          <div className="auth">
            <aside className="auth__art on-dark">
              <Image src={IMAGES[art.img]} alt="" className="auth__photo" priority sizes="(max-width: 960px) 1px, 540px" />
              <div className="auth__art-body">
                <Image className="auth__crest" src={IMAGES.crestGold} alt="" sizes="80px" />
                <h2 className="h2">{art.title}</h2>
                <p>{art.text}</p>
                <ul className="auth__perks">
                  {art.perks.map(([icon, text]) => <li key={text}><Icon name={icon} />{text}</li>)}
                </ul>
              </div>
            </aside>
            <div className="auth__panel">
              <Image className="auth__mcrest" src={IMAGES.crestPlum} alt="" sizes="80px" />
              <nav className="auth__tabs" aria-label="Account">
                <Link href="/login" className={mode === "login" ? "is-on" : undefined} aria-current={mode === "login" ? "page" : undefined}>Login</Link>
                <Link href="/signup" className={mode === "signup" ? "is-on" : undefined} aria-current={mode === "signup" ? "page" : undefined}>Sign up</Link>
              </nav>
              <AuthForm mode={mode} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
