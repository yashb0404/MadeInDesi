# Maaya

Storefront for a hand-rolled nutrition ball and chips brand. Next.js 16, React 19,
Tailwind v4.

```bash
npm run dev
```

## Design direction

**"The banana leaf."** South Indian food is served on one, so the page is one: a pale
leaf-white ground, deep leaf green as the brand colour, turmeric held back for the few
things that must be noticed. Every product photo is warm brown and amber, and they carry
hard against this.

| Token | Value | Role |
| --- | --- | --- |
| `--color-canvas` | `#f5f8ee` | page ground |
| `--color-surface` | `#ffffff` | cards |
| `--color-surface-2` | `#edf3e2` | section bands |
| `--color-ink` | `#14241a` | text, a green-black |
| `--color-leaf` | `#3f8f55` | brand |
| `--color-leaf-deep` | `#1f5c36` | links, prices, eyebrows |
| `--color-turmeric` | `#e39a12` | accent, sparingly |
| `--color-berry` | `#b8405c` | errors only |

All tokens live at the top of `src/app/globals.css` — change them there, not in
components. Component classes (`.u-btn`, `.u-tin`, `.u-field`…) are defined in the same
file and derive everything from those tokens.

- **Display** Bricolage Grotesque · **Body** Instrument Sans · **Data** Martian Mono ·
  **Tamil** Anek Tamil
- **Signature device: kolam.** The rice-flour dot grid drawn on a threshold each morning.
  It is the section divider (`src/components/Kolam.tsx`, two braided lines that draw
  themselves in on scroll) and the floor of the 3D scene
  (`src/components/three/KolamGround.tsx`). It is the only ornament on the site;
  everything else stays quiet on purpose.

> **Editing note:** do not bulk-edit source files with Windows PowerShell 5.1's
> `Get-Content` / `Set-Content`. They default to the ANSI codepage and will silently
> mangle the Tamil strings and em-dashes. Use `[System.IO.File]::ReadAllText($p,
> [System.Text.Encoding]::UTF8)` and write back with `UTF8Encoding($false)`.

## The 3D

The hero objects are **photographs of real balls**, floating at different depths.

An earlier version sculpted spheres and wrapped a crop of a photo around them. It never
worked — tiling the crop printed a grid, mirroring it printed a kaleidoscope, and one
stretched copy smeared at the silhouette. The premise was wrong: you cannot rebuild a
lit, textured object from one flat crop of it. A nutrition ball is a sphere, so a
photograph of one already *is* the object, correctly lit and in focus.

So each is a camera-facing plane, masked to a soft circle, drifting in real 3D space.
Depth and parallax are genuine; the surface is genuine; nothing is synthesised. There
are **no lights in the scene at all** — the photographs carry their own, and relighting
them is what made the old spheres look like wet plastic (`meshBasicMaterial`, not
`meshStandardMaterial`).

- `BallSprites.tsx` — the four sprites, the float/parallax, and the radial alpha mask
  (generated once in a canvas, so the images ship as ~240 KB of JPEG rather than 3.2 MB
  of alpha-channel PNG)
- `KolamGround.tsx` — the dot grid, one InstancedMesh
- `HeroScene.tsx` — hero canvas; skips itself on narrow phones and single-core machines

Cutouts live in `public/cutouts/`. To recut one, take a square crop centred on a single
ball — the mask fades from 90% of the radius, so neighbouring balls at the corners
disappear on their own.

## What to do next

### 1. Photography — done, but worth a second pass

The client's shots are in `public/products/` and served through `next/image`
(AVIF/WebP, responsive `srcset`). They are tall phone portraits (~930×1600), so every
frame on the site crops them centrally.

Optional improvement: re-crop to 4:5 by hand so you control what gets cut, and shoot a
pack shot for each. Do **not** substitute AI-generated product photos — for packaged food
that misrepresents what ships.

`ProductShot.tsx` still falls back to a designed placeholder carrying the Tamil name if a
file goes missing, so a bad path never shows a broken image.

### 2. Pricing and pack sizes (blocking)

Every `price`, `weightGrams` and `pieces` in `src/lib/products.ts` is a placeholder.
Replace with real figures.

### 3. Nutrition panels (blocking for the claims)

Product names carry nutrient and function claims — "Biotin", "Calcium & Iron",
"for your hair & skin". FSSAI requires per-serving values backing those. Fill the
`nutrition` array per product from a lab report; the panel stays hidden while it is
empty. All product copy is deliberately ingredient-led and asserts no benefits.

### 4. Payments

`placeOrder` in `src/app/checkout/CheckoutFlow.tsx` currently validates, generates a
reference and clears the bag. Wire Razorpay in at that call site.

### 5. Before launch

- Set `NEXT_PUBLIC_SITE_URL` so Open Graph image URLs resolve
- Fill in the real FSSAI licence number and contact details in `src/components/Footer.tsx`

## Conventions

- `src/lib/products.ts` is the single source of truth for the catalogue.
- Cart state is zustand + localStorage. Read `useCartHydrated()` before rendering any
  count or total, or the bag flickers from empty on first paint.
- Scroll reveals are CSS-driven (`.u-reveal`); `Reveal.tsx` only flips a data attribute.
  Content is never stranded invisible — there is a `<noscript>` override, an immediate
  show for anything already in the viewport, and a failsafe timer.
