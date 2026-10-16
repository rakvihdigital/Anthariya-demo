import type { StaticImageData } from "next/image";
import ajrakh from "@/assets/img/ajrakh-ivory-cotton.jpg";
import bannerGulaab from "@/assets/img/banner-gulaab-ivory-organza.jpg";
import bannerRajkumari from "@/assets/img/banner-rajkumari-plum-silk.jpg";
import bannerSignature from "@/assets/img/banner-signature-black-mango-silk.jpg";
import crestGold from "@/assets/img/crest-gold.png";
import crestPlum from "@/assets/img/crest-plum.png";
import gulaab from "@/assets/img/gulaab-ivory-organza.jpg";
import logoGold from "@/assets/img/logo-gold.png";
import logoGoldMark from "@/assets/img/logo-gold-mark.png";
import logoPlum from "@/assets/img/logo-plum.png";
import mayuri from "@/assets/img/mayuri-emerald-silk.jpg";
import raatRani from "@/assets/img/raat-rani-black-georgette.jpg";
import rajkumariDetail from "@/assets/img/rajkumari-plum-silk-detail.jpg";
import rajkumari from "@/assets/img/rajkumari-plum-silk.jpg";
import signature from "@/assets/img/signature-black-mango-silk.jpg";
import vanam from "@/assets/img/vanam-green-banarasi.jpg";

/** Every photo used on the site. Add a new photo: put it in src/assets/img, import it here, give it a key. */
export const IMAGES = {
  ajrakh,
  bannerGulaab,
  bannerRajkumari,
  bannerSignature,
  crestGold,
  crestPlum,
  gulaab,
  logoGold,
  logoGoldMark,
  logoPlum,
  mayuri,
  raatRani,
  rajkumariDetail,
  rajkumari,
  signature,
  vanam,
} satisfies Record<string, StaticImageData>;

export type ImageKey = keyof typeof IMAGES;
