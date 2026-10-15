# Anthariya by Nidhi Gowda — website (Next.js)

Built with **Next.js 16 (App Router) + React 19 + TypeScript**. Same design as the original HTML site, now as a React app with
real pages for every saree, optimised images and search-engine friendly HTML.

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install        # first time only
npm run dev        # open http://localhost:3000 — the page updates live as you edit
```

To check the finished site exactly as visitors will get it:

```bash
npm run build && npm start
```

## Pages

| Address | Page |
| --- | --- |
| `/` | Home (banner slideshow, weaves, new arrivals, story…) |
| `/shop` | Shop with filters. Links like `/shop?cat=Silk`, `/shop?occ=Wedding`, `/shop?view=wishlist` open pre-filtered |
| `/product/rajkumari` … | One details page per saree (built automatically from the product list) |
| `/about`, `/contact` | About Us, Contact + FAQ |
| `/login`, `/signup` | Account pages |

## Everyday edits

| What | Where |
| --- | --- |
| Phone, WhatsApp number, email, address, hours, social links | `src/lib/config.ts` |
| Sarees: names, prices, descriptions, photos, stock, discounts, ratings | `src/lib/products.ts` |
| Add a new photo | Put it in `src/assets/img/`, then add one `import` line + key in `src/lib/images.ts` |
| Colours, fonts, spacing | `src/app/globals.css` (colour palette at the top) |
| Banner slides on the home page | `SLIDES` in `src/components/HeroSlider.tsx` |

Product fields worth knowing:

- `mrp` — original price. If it is higher than `price`, the card shows a "% off" badge and the struck-out price.
- `rating` / `reviews` — only fill these in from **real** customer reviews; stars appear automatically.
- `inStock: false` — shows "Sold out" and disables Add to Bag.

## Publish it

The easiest host is [Vercel](https://vercel.com) (made by the Next.js team, free plan available):

1. Put this folder in a GitHub repository.
2. Import the repository on Vercel — it detects Next.js automatically.
3. Add the environment variable `NEXT_PUBLIC_SITE_URL` with your real address (see `.env.example`).

Netlify, Cloudflare and any Node.js server also work (`npm run build` then `npm start`).

## Before taking real orders

- **Bag & checkout**: the bag sends the order to WhatsApp — no payment gateway yet (Razorpay / Stripe can be added).
- **Login / Sign up**: designed and validated, but front-end only. The customer's name and email are remembered in their own browser so the header can greet them; **passwords are never stored**. Connect a real account service (Supabase, Firebase or Clerk) before launch.
- **Contact & newsletter forms** show a thank-you message but do not send anything yet — connect them to email (e.g. Resend, Formspree) or a mailing list.
- Replace the placeholder phone number, email, address and policies in `src/lib/config.ts` and the FAQ.

## Folder map

```
src/
  app/            pages (one folder per address) + globals.css + layout.tsx (header/footer shell)
  components/     Header, Footer, ProductCard, HeroSlider, ShopClient, ProductDetail, AuthForms, …
  lib/            config.ts (store settings), products.ts (catalogue), images.ts (photo list)
  assets/img/     all photos and logos
```
