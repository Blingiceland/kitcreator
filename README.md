# Kitcreator

> Eitt upphlað — allt settið. Generates a full set of channel-specific event
> graphics (social + print + screen) from one image, brand-locked.

This is **v0** (proof): one hardcoded brand/project, a fixed test image, and a
fixed set of channels. See [`../eventkit/V0-PLAN.md`](../eventkit/V0-PLAN.md) for
the full plan and [`../eventkit/CONCEPT.md`](../eventkit/CONCEPT.md) for the
product vision.

## What works now (Áfangi 1)

- One adaptive **template** (`image-led`) renders across every channel via
  container-query units (`cqmin`) — square, portrait and landscape, no per-format
  tweaks.
- **Brand frame**: theme (light/dark), grain + halftone print texture, and a
  reserved **sponsor lockup** (top + bottom), with a safe-area inset for the
  FB-page channel.
- **Headless-Chrome render** (`/api/render`) → download **PNG / JPEG / PDF** per
  channel, at print resolution.
- A simple **builder** (`/`) to edit title/subtitle/date, switch theme, preview
  each channel, and download.

## Channels (v0)

FB event 1.91:1 · FB page 16:9 (safe inset) · IG 1:1 · IG 4:5 · Story 9:16 ·
Poster A3. Defined in `src/lib/kit.ts`.

## Stack

Next.js (App Router) · TypeScript · Tailwind · puppeteer-core +
`@sparticuz/chromium` (same render core as the Rokk poster generator).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Local render drives an installed Chrome (auto-detected; set `CHROME_PATH` to
override). On Vercel it uses `@sparticuz/chromium` automatically — needs the
**Pro** plan (some renders exceed the 10s Hobby cap).

## Next (Áfangi 2+)

Image upload (Vercel Blob), ZIP download of the whole kit, more templates, then
multi-tenant brand kits + a template editor. See the v0 plan.
