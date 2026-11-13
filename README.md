# Lorbyte

Static React marketing website built with Vite and Framer Motion.

## Development

Run `npm ci`, then `npm run dev`. Run `npm run build` for production.

## Deploy on Vercel

Import this repository. Framework: Vite. Build command: `npm run build`. Output: `dist`. No environment variables are needed. The included rewrite supports clean URLs and page refreshes.

## Languages

English, French, and Arabic are available from the header and footer. Switching languages preserves the current page and form values. The choice is saved locally and shareable with `?lang=en`, `?lang=fr`, or `?lang=ar`. Arabic sets the document direction to RTL. Content, forms, FAQs, dashboard examples, and all three articles are translated.

Translations live in `src/content.js`. The website uses DM Sans and Noto Sans Arabic, with system fallbacks. Animations respect reduced-motion preferences.

## Contact

Requests are sent through FormSubmit to **contact@lorbyte.com**. Complete FormSubmit's one-time activation in that inbox after the first submission. The form includes loading, success, activation, timeout, and error states, plus a hidden honeypot. Do not include secrets in the site.

## Pages

- Home: /
- How it works: /how-it-works
- Journal: /blog
- Contact: /contact
- Sign-in: https://app.lorbyte.com

Legacy hash links automatically convert to clean URLs. Dashboard data is illustrative.

## Verification

Run `node scripts/check-site.mjs` to verify translation parity, all translated routes, initial language selection, email routing, and deployment configuration.
