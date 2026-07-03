---
version: alpha
name: Khaadi-design-analysis
description: An inspired interpretation of Khaadi's design language — a warm, editorial ethnic-fashion storefront built on a pure white canvas with a single coral-orange brand accent. The system is photography-first: full-width lifestyle shoots of models in embroidered fabrics carry the emotional weight, while a restrained black-and-white UI (rounded-rectangle cards, pill buttons, uppercase tracked nav) stays quiet underneath so the clothes and the coral accent do the talking. A recurring "editorial band" pattern — dark maroon backdrops with circular-cropped portraits — breaks up the white canvas for seasonal storytelling moments.

colors:
  primary: "#e8613a"
  primary-dark: "#c94f2c"
  ink: "#1a1a1a"
  on-primary: "#ffffff"
  canvas: "#ffffff"
  canvas-cream: "#faf7f2"
  surface-maroon: "#4a201f"
  surface-maroon-elevated: "#5c2b26"
  accent-pink-bar: "#f2a8b8"
  accent-blush: "#f6d9c9"
  shade-20: "#e5e5e5"
  shade-30: "#d4d4d4"
  shade-40: "#a3a3a3"
  shade-50: "#767676"
  shade-60: "#525252"
  hairline: "#e8e8e8"
  success-green: "#1e7d32"
  link-slate: "#5c6b7a"
  price-strike: "#9a9a9a"

typography:
  display-hero:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 72px
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: -0.5px
  script-lead:
    fontFamily: "Big Caslon, Cormorant Garamond, Georgia, serif"
    fontSize: 30px
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.1
    letterSpacing: 0
  heading-section:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  heading-md:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  nav-label:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 1px
    textTransform: uppercase
  product-title:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  product-caption:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.2px
  price-current:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  price-strike:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  body-md:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0.2px
  button-label:
    fontFamily: "Helvetica Neue, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 1px
    textTransform: uppercase

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 16px
  pill: 9999px
  circle: 50%

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px

components:
  nav-bar-primary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-label}"
    rounded: "{rounded.xs}"
    padding: 16px 32px
  nav-bar-top-strip:
    backgroundColor: "{colors.accent-pink-bar}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "0px"
    padding: 6px 0px
  mega-menu-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "0px"
    padding: 32px 48px
  button-add-to-bag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.pill}"
    padding: 16px 32px
  button-add-to-bag-pressed:
    backgroundColor: "{colors.shade-60}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.pill}"
    padding: 16px 32px
  button-quantity-stepper:
    backgroundColor: "{colors.shade-20}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 8px 12px
  button-outline-ink:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-label}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
  size-selector-pill:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: 8px 16px
  size-selector-pill-inactive:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: 8px 16px
  badge-discount:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  badge-tag-neutral:
    backgroundColor: "{colors.shade-20}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  product-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.product-title}"
    rounded: "{rounded.md}"
    padding: 0px
  section-heading-centered:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-section}"
    rounded: "0px"
    padding: 0px
  bestsellers-band:
    backgroundColor: "{colors.surface-maroon}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "0px"
    padding: 64px 32px
  hero-banner-editorial:
    backgroundColor: "{colors.canvas-cream}"
    textColor: "{colors.ink}"
    typography: "{typography.display-hero}"
    rounded: "0px"
    padding: 0px
  breadcrumb-trail:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.link-slate}"
    typography: "{typography.caption}"
    rounded: "0px"
    padding: 12px 0px
  accordion-details:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "0px"
    padding: 16px 0px
  in-stock-tag:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.success-green}"
    typography: "{typography.caption}"
    rounded: "0px"
    padding: 0px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "0px"
    padding: 48px 32px
---

## Overview

Khaadi runs a single-canvas system — pure white throughout — where the brand's identity comes from **photography and one accent color**, not from UI chrome. The nav, buttons, cards, and type are deliberately quiet (black, white, and grey) so that the coral `{colors.primary}` (`#e8613a`) — used only for the logo mark, the "SALE" nav item, and discount badges — reads as a sharp, unmistakable signal against all the neutral surroundings.

A thin `{colors.accent-pink-bar}` strip runs across the very top of every page — a small seasonal flourish above the main nav, usually carrying a promo line. Below it, the nav bar itself is minimal: an uppercase tracked wordmark ("KHAADI" set in the coral bubble-letter logo), a row of uppercase nav labels, and four line-icons (search, wishlist, account, bag) on the right. Hovering a nav item drops a full-width **mega menu** — three plain text columns of subcategories plus a single editorial photo — rather than a boxed dropdown.

Hero moments pair a **bold sans headline** (`{typography.display-hero}`, weight 800) with a **script italic subhead** (`{typography.script-lead}`) — e.g. "BASICS" in heavy black type next to "summer petals" in a delicate italic serif. This headline/script pairing is the brand's signature editorial device, always set over or beside full-bleed lifestyle photography, never on a flat color block.

Product cards are almost invisible as "cards" — no border, no shadow, just an image, a grey category caption, a black product title, and a price row where the original price strikes through in grey and the sale price sits bold in black, capped off with a coral `badge-discount` pill. Deeper in the funnel (bestsellers, seasonal stories), the palette breaks from white into a **maroon editorial band** (`{colors.surface-maroon}`) filled with circular-cropped portrait photography — the one deliberate departure from the white canvas, reserved for storytelling moments rather than commerce.

**Key Characteristics:**
- Single white canvas (`{colors.canvas}`) for nearly the entire site; the only recurring departure is the maroon storytelling band (`{colors.surface-maroon}`).
- One brand accent, `{colors.primary}` coral-orange, used sparingly and consistently: logo, the "SALE" nav label, and discount badges — never as a general UI color.
- Photography carries the brand; UI chrome (buttons, cards, nav) stays black/white/grey so it never competes with the clothing.
- Headline + script-italic pairing (`{typography.display-hero}` + `{typography.script-lead}`) is the signature editorial typographic device for campaign moments.
- Pill shape (`{rounded.pill}`) for primary actions (Add to Bag, outline buttons, badges); small `{rounded.sm}`/`{rounded.md}` radii for cards, size selectors, and steppers.
- Price hierarchy is a fixed pattern: grey strikethrough original → bold black sale price → coral discount-percentage pill.
- A thin coral/pink promo strip tops every page, separate from and above the main nav bar.

## Colors

> **Source pages:** home (`/`), category listing (Sale), product detail page (PDP).

### Brand & Accent
- **Primary** (`{colors.primary}` — `#e8613a`): The only brand color. Used for the KHAADI logo mark, the active "SALE" nav label, and every discount badge (`50% OFF`).
- **Primary Dark** (`{colors.primary-dark}` — `#c94f2c`): Hover/pressed state of coral elements; darker underline on active nav.
- **Accent Pink Bar** (`{colors.accent-pink-bar}` — `#f2a8b8`): The thin promotional strip above the main nav — a softer seasonal cousin of the primary coral.
- **Accent Blush** (`{colors.accent-blush}` — `#f6d9c9`): Soft peach used sparingly in campaign photography backdrops and promo tiles, never as UI fill.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default background for essentially every page — nav, listing, PDP.
- **Canvas Cream** (`{colors.canvas-cream}` — `#faf7f2`): Warm off-white used behind hero/editorial banners to separate them subtly from pure-white commerce sections.
- **Surface Maroon** (`{colors.surface-maroon}` — `#4a201f`): Dark storytelling band background (e.g. "Bestsellers" circular-portrait section) — the system's one bold surface departure.
- **Surface Maroon Elevated** (`{colors.surface-maroon-elevated}` — `#5c2b26`): Slightly lifted tone within the maroon band for layered circular photo frames.
- **Hairline** (`{colors.hairline}` — `#e8e8e8`): 1px dividers between accordion rows, thumbnail borders, table lines.

### Shade Ladder
- **Shade-20** (`{colors.shade-20}` — `#e5e5e5`): Neutral tag background, quantity-stepper button fill.
- **Shade-30** (`{colors.shade-30}` — `#d4d4d4`): Inactive dots in carousel pagination.
- **Shade-40** (`{colors.shade-40}` — `#a3a3a3`): Placeholder/disabled text.
- **Shade-50** (`{colors.shade-50}` — `#767676`): Secondary body text, product captions.
- **Shade-60** (`{colors.shade-60}` — `#525252`): Pressed state of the ink button; deep secondary text.

### Text & Status
- **Ink** (`{colors.ink}` — `#1a1a1a`): Default text color and the fill for all primary (black) buttons — a soft-black rather than pure `#000000`.
- **On Primary** (`{colors.on-primary}` — `#ffffff`): Text on ink-filled buttons and on the maroon band.
- **Success Green** (`{colors.success-green}` — `#1e7d32`): "In Stock" availability label on the PDP.
- **Link Slate** (`{colors.link-slate}` — `#5c6b7a`): Breadcrumb trail links (Home / Sale / Fabrics / …).
- **Price Strike** (`{colors.price-strike}` — `#9a9a9a`): The struck-through original price, always paired with a bold black sale price.

## Typography

### Font Family

The system runs on a single grotesque sans — **Helvetica Neue** (falling back to Arial) — for nearly every role: nav, product titles, prices, buttons, body copy. There is no separate "display" typeface for headings; scale and weight alone create the hierarchy.

The one exception is **script-lead** (`Big Caslon` / `Cormorant Garamond` italic), a serif italic reserved exclusively for the small editorial subhead that pairs with a bold hero headline (e.g. "summer petals" beneath "BASICS"). It never appears in UI, only in campaign moments.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-hero}` | 72px | 800 | 0.95 | Campaign hero headline ("BASICS") |
| `{typography.script-lead}` | 30px | 400 italic | 1.1 | Script subhead paired with hero ("summer petals") |
| `{typography.heading-section}` | 32px | 700 | 1.2 | Centered section titles ("Bestsellers") |
| `{typography.heading-md}` | 20px | 600 | 1.3 | PDP product name |
| `{typography.nav-label}` | 13px | 500 | 1.2 | Top nav items, mega-menu column headers (uppercase) |
| `{typography.product-title}` | 15px | 600 | 1.4 | Product card title |
| `{typography.product-caption}` | 12px | 400 | 1.4 | Product card fabric/print caption ("Printed \| Raw Silk") |
| `{typography.price-current}` | 16px | 700 | 1.3 | Sale/current price |
| `{typography.price-strike}` | 14px | 400 | 1.3 | Struck-through original price |
| `{typography.body-md}` | 15px | 400 | 1.5 | Default body copy, section descriptions |
| `{typography.caption}` | 12px | 400 | 1.45 | Badges, breadcrumbs, fine print |
| `{typography.button-label}` | 14px | 600 | 1.2 | Button text (always uppercase, tracked) |

### Principles
- **One workhorse sans, weight does the work.** Hierarchy comes from size + weight jumps on Helvetica Neue, not from switching families — keeps the UI calm around busy photography.
- **Script is a garnish, never a workhorse.** `{typography.script-lead}` is reserved for one line per hero moment; it never appears in body copy, buttons, or product titles.
- **Buttons are always uppercase and tracked.** `{typography.button-label}` carries +1px letter-spacing and uppercase transform — this is what makes flat black buttons feel deliberate rather than plain.
- **Prices are a fixed two-weight pattern.** Struck-through original (`{typography.price-strike}`, regular, grey) always precedes the bold current price (`{typography.price-current}`, black) — never the reverse order.

## Layout

### Spacing System
- **Base unit**: 8px.
- **Tokens**: `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 24px · `{spacing.xxl}` 32px · `{spacing.huge}` 64px.
- **Section padding**: `{spacing.huge}` 64px top/bottom around storytelling bands (Bestsellers); tightens to `{spacing.xl}` 24px on dense listing grids.
- **Mega-menu padding**: `{spacing.xxl}` 32px vertical, 48px horizontal — generous enough that a 3-column subcategory list plus one photo doesn't feel cramped.

### Grid & Container
- Product listing grids run 4–6 columns on desktop, each card fixed-width with `{spacing.lg}` gutters.
- The PDP splits into a fixed-width vertical thumbnail rail, a large primary image, and a right-hand info column (title, price, size, CTA) — no max-width reading column; the layout is commerce-first, not editorial-first, on this page.
- Hero banners are full-bleed edge-to-edge, breaking any container width.

### Whitespace Philosophy
Commerce pages (listing, PDP) keep whitespace tight and functional — cards sit close together, the info column is compact — because the priority is scanning and buying. Editorial moments (hero banners, the maroon Bestsellers band) open the whitespace up dramatically, giving photography room to breathe. The contrast mirrors the split between "shop it" and "feel it" moments.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | Flat, no shadow | Default — nearly everything: nav, cards, buttons |
| 1 | `0 1px 2px rgba(0,0,0,0.06)` | Sticky nav bar on scroll, floating chat bubble |
| 2 | `0 2px 8px rgba(0,0,0,0.08)` | Mega-menu panel dropdown shadow |
| 3 | `0 8px 24px rgba(0,0,0,0.12)` | Modal / size-guide overlay |

Depth is used extremely sparingly — this system is almost entirely flat. Shadows exist only where something floats above content (dropdown, modal), never as card decoration.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Nav bar container corners (barely visible) |
| `{rounded.sm}` | 6px | Quantity stepper, size-selector pills, thumbnail corners |
| `{rounded.md}` | 8px | Product card image corners |
| `{rounded.lg}` | 16px | Circular photo frame containers in the maroon band (large radius before full circle) |
| `{rounded.pill}` | 9999px | Add to Bag, outline buttons, discount/tag badges, carousel arrows |
| `{rounded.circle}` | 50% | Portrait crops in the Bestsellers band, wishlist/account icon hit-areas |

### Photography Geometry
Listing and hero photography is rectangular, full-bleed with no border or shadow. The one distinctive geometric move is the **circular crop** used exclusively in the maroon storytelling band — portrait photos are masked into large overlapping circles (`{rounded.circle}`), creating a scrapbook / editorial-collage feel that's never used elsewhere on the site.

## Components

### Buttons

**`button-add-to-bag`** — the dominant commerce CTA.
- Background `{colors.ink}`, text `{colors.on-primary}`, type `{typography.button-label}` (uppercase, tracked), padding `{spacing.lg} {spacing.xxl}` (16px 32px), rounded `{rounded.pill}`, full-width on PDP.
- Pressed state `button-add-to-bag-pressed`: background lifts to `{colors.shade-60}`.

**`button-outline-ink`** — secondary action (e.g. "Notify Me", filters).
- Background `{colors.canvas}`, 1px solid `{colors.ink}` border, text `{colors.ink}`, same pill geometry, padding 14px 28px.

**`button-quantity-stepper`** — the +/− quantity control on PDP.
- Background `{colors.shade-20}`, text `{colors.ink}`, rounded `{rounded.sm}` 6px (not pill — this is the one small-radius interactive control), padding 8px 12px.

### Cards & Tags

**`product-card`** — the standard listing/carousel tile.
- Background `{colors.canvas}`, no border, no shadow, rounded `{rounded.md}` on the image only. Stack: image → `{typography.product-caption}` (grey fabric/print line) → `{typography.product-title}` (black) → price row → badge row.

**`badge-discount`** — the coral discount pill on sale items.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 4px 10px. Reads "50% OFF" — the only place coral fills a solid background outside the logo.

**`badge-tag-neutral`** — status pill like "Restocked".
- Background `{colors.shade-20}`, text `{colors.ink}`, otherwise identical shape to `badge-discount`.

**`size-selector-pill`** / **`size-selector-pill-inactive`** — size choice on PDP.
- Active: background `{colors.ink}`, text `{colors.on-primary}`. Inactive: background `{colors.canvas}`, 1px `{colors.hairline}` border, text `{colors.ink}`. Rounded `{rounded.sm}`, not pill — sized like a small square-ish chip (e.g. "3PC").

### Navigation

**`nav-bar-top-strip`** — the thin promo bar above the main nav.
- Background `{colors.accent-pink-bar}`, type `{typography.caption}`, full width, padding 6px vertical. Carries a rotating seasonal message.

**`nav-bar-primary`** — the main nav.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.nav-label}` (uppercase, tracked). Logo left, nav items center, four line-icons (search, wishlist, account, bag) right. The active/hovered "SALE" item switches to `{colors.primary}`.

**`mega-menu-panel`** — full-width dropdown on nav hover.
- Background `{colors.canvas}`, padding `{spacing.xxl}` vertical, 48px horizontal, Level-2 shadow. Three plain-text subcategory columns (bold uppercase column header + regular sentence-case links) plus one editorial photo anchoring the right edge — no card chrome around the columns themselves.

**`breadcrumb-trail`** — PDP wayfinding row.
- Text `{colors.link-slate}` for links, `{colors.ink}` for the current page, type `{typography.caption}`, separated by `>` chevrons.

### Signature Components

**`hero-banner-editorial`** — campaign/collection hero.
- Background `{colors.canvas-cream}` or full-bleed photography, headline in `{typography.display-hero}` (black, weight 800) paired with a `{typography.script-lead}` accent line — the brand's most recognizable typographic signature.

**`bestsellers-band`** — the maroon storytelling section.
- Background `{colors.surface-maroon}`, text `{colors.on-primary}`, padding `{spacing.huge}`. Contains 3+ large `{rounded.circle}` portrait crops arranged in an overlapping arc — the system's one deliberate break from the white canvas and rectangular photography elsewhere.

**`in-stock-tag`** — availability indicator on PDP.
- Text-only, `{colors.success-green}`, type `{typography.caption}`, right-aligned next to the "Size" label — no background fill.

**`accordion-details`** — expandable Details/Fabric section on PDP.
- Background `{colors.canvas}`, 1px `{colors.hairline}` top border, header row in `{typography.heading-md}` with a +/− toggle icon right-aligned; expanded content in `{typography.body-md}`.

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` coral for exactly three things: logo, "SALE" label, discount badges. Never use it as a general accent, link color, or button fill.
- Keep every commerce-page button and card flat (Elevation 0); save shadows for things that truly float (menus, modals).
- Always pair the hero display headline with the script-italic subhead when doing a campaign moment — the two typefaces together are the signature, neither alone is.
- Use `{rounded.pill}` for all primary/secondary buttons and badges; use `{rounded.sm}` only for small functional controls (stepper, size chips).
- Keep the price pattern fixed: grey strikethrough original, then bold black current price, then coral discount badge — in that order.

### Don't
- Don't introduce a second accent color alongside coral — the whole system depends on there being exactly one brand color that reads as "unmissable" because nothing else competes with it.
- Don't apply the circular photo-crop treatment (`{rounded.circle}`) outside the maroon storytelling band; everywhere else photography stays rectangular.
- Don't set body copy, buttons, or product titles in the script typeface — `{typography.script-lead}` is a one-line garnish only.
- Don't add borders or shadows to product cards; the "cardless card" look (just image + text stack) is deliberate.
- Don't mix uppercase-tracked nav typography into product titles or body copy — tracking + uppercase is reserved for nav labels and button text.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop | ≥ 1200px | Full mega-menu, 5–6 column product grid, PDP side-by-side |
| Tablet | 768–1199px | Mega-menu simplifies to accordion-in-drawer, grid drops to 3 columns |
| Mobile | < 768px | Hamburger nav, top strip persists, grid drops to 2 columns, PDP stacks image above info |

### Touch Targets
- `button-add-to-bag` and `button-outline-ink` maintain ≥ 44×44px tap area via 16px vertical padding.
- Size-selector pills and quantity stepper buttons enforce a 40×40px minimum on mobile even though visual padding is smaller.

### Collapsing Strategy
- `{typography.display-hero}` scales 72px → 44px → 32px across desktop/tablet/mobile; the script subhead scales proportionally but never drops below 18px (it must stay legible as a deliberate accent, not disappear).
- Mega-menu collapses into a single-column accordion drawer on mobile — three-column layout is desktop/tablet only.
- Product grid steps 5–6 → 3 → 2 columns; cards keep their aspect ratio rather than cropping tighter.
- The maroon Bestsellers band's overlapping circular photos stack into a horizontal swipeable carousel on mobile.

### Image Behavior
Listing and PDP images use responsive `srcset`. Hero photography crops toward the model's face/upper body on mobile; desktop keeps the full environmental frame.

## Iteration Guide

1. Focus on ONE component at a time.
2. Reference component names and tokens directly (`{colors.primary}`, `{button-add-to-bag}-pressed`, `{rounded.pill}`).
3. Add new variants as separate entries rather than overloading an existing one.
4. Default body to `{typography.body-md}`; reserve `{typography.script-lead}` strictly for one-line editorial accents.
5. When adding a new discount/status badge, follow the `badge-discount` / `badge-tag-neutral` pill shape — never introduce a square badge.
6. Keep coral (`{colors.primary}`) rare by design — if a new component wants it, ask whether it truly needs to compete for attention with the logo and sale badges.
7. The maroon storytelling band and circular photo crop are reserved for narrative/seasonal moments — don't reuse them for standard commerce sections like listing or PDP.
