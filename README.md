# Lorbyte

Static React marketing website with Vite and Framer Motion.

## Local development

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
```

Deploy on Vercel by importing this repository. Use Vite, `npm run build`, and the `dist` output directory. No environment variables are needed. Pages use clean History API routes. The included Vercel rewrite serves the app for direct page links and refreshes. Legacy hash links automatically migrate to their clean equivalents.

## Contact form activation

The form posts to FormSubmit and delivers requests to **contact@lorbyte.com** without opening visitors’ email apps. FormSubmit requires the inbox owner to confirm the activation email after the first submission. Complete that confirmation before accepting real requests, then submit a test and verify delivery. No email password or API secret is included in the website.

If FormSubmit is unavailable, visitors see an error with a direct email fallback. Submissions include name, email, company, request type, team, and message. A hidden honeypot is included; FormSubmit also applies its service-side spam controls.

## Pages

- Home: `/`
- How it works: `/how-it-works`
- Blog: `/blog`
- Contact: `/contact`
- Application sign-in: https://app.lorbyte.com

The product dashboard is a demonstration using sample data.
