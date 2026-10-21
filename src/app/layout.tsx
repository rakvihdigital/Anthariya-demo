import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IconSprite } from "@/components/Icon";
import { Overlays } from "@/components/Overlays";
import { StoreProvider } from "@/components/StoreProvider";
import { CONFIG } from "@/lib/config";
import "./globals.css";

const cormorant = localFont({
  src: [
    { path: "../assets/fonts/cormorant-garamond-latin.woff2", weight: "400 700", style: "normal" },
    { path: "../assets/fonts/cormorant-garamond-italic-latin.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const jost = localFont({
  src: "../assets/fonts/jost-latin.woff2",
  weight: "300 600",
  variable: "--font-jost",
  display: "swap",
});
const pinyon = localFont({
  src: "../assets/fonts/pinyon-script-latin.woff2",
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const DESC =
  "Anthariya by Nidhi Gowda: a premium saree boutique with handpicked Kanjivaram silks, Banarasi, organza, georgette and hand block-printed cotton sarees.";

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: {
    default: "Anthariya by Nidhi Gowda | Handpicked Silk, Banarasi & Designer Sarees",
    template: "%s | Anthariya by Nidhi Gowda",
  },
  description: DESC,
  openGraph: {
    type: "website",
    siteName: CONFIG.brand,
    description: DESC,
    images: [{ url: "/og.jpg", width: 1152, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#710e45",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`js ${cormorant.variable} ${jost.variable} ${pinyon.variable}`}>
      <body>
        <noscript>
          <style>{`.js [data-reveal],.js [data-reveal]>*,.js [data-reveal] .w{opacity:1!important;clip-path:none!important}.js [data-reveal] .eyebrow::before,.js [data-reveal] .eyebrow::after{transform:none!important}.js [data-reveal] em::after{clip-path:none!important}.js [data-reveal] .weave-bg,.js [data-reveal] .chakra,.js [data-reveal] .weave{opacity:1!important;clip-path:none!important}`}</style>
        </noscript>
        <IconSprite />
        <StoreProvider>
          <Header />
          {children}
          <Footer />
          <Overlays />
        </StoreProvider>
      </body>
    </html>
  );
}
