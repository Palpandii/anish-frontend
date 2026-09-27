# Anish Crackers — Website

Wholesale & retail fireworks storefront for **Anish Crackers, Sivakasi** — built with React,
React Router and Context API. Bilingual (Tamil / English), WhatsApp-based ordering,
219 products across 17 categories from the 2026 price list.

**Live catalog note:** the storefront and admin panel both read products/categories from
the Spring Boot + MySQL backend at runtime (`/api/products`, `/api/categories`) via
`src/data/api.js` — not from `src/data/products.js` directly. That file (and
`categories.js`) is kept as the readable source of truth the backend's `CatalogSeeder`
is generated from; see the backend README for how the database gets populated on first
run. Edit products going forward from the admin panel, or update the seeder's JSON and
redeploy.

## Design

Visual theme is "Sivakasi Gold" — deep maroon, marigold gold and saffron ember over warm
ivory, using the Baloo Thambi 2 (display) and Hind Madurai (body) type pair, both with
proper Tamil glyph support. Colours live as CSS custom properties in `src/index.css`
(`:root`), so the whole site and the admin panel re-theme from one place.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Configure your business details

Copy `.env.example` to `.env` (already done for you) and edit:

- `VITE_WHATSAPP_NUMBER` — WhatsApp order number, international format, digits only
  (e.g. `918072587830` for +91 80725 87830)
- `VITE_ALT_PHONE` — second contact number shown in the footer/contact page
- `VITE_BUSINESS_ADDRESS`, `VITE_BUSINESS_EMAIL`, `VITE_INSTAGRAM`
- `VITE_MAPS_EMBED_URL` — paste a Google Maps "Embed a map" `src` URL to show a live map
  on the Contact page; leave blank to show the address only

Restart `npm run dev` after changing `.env`.

## Adding real product photos

Product image paths are auto-generated as:

```
/public/images/products/<category-id>/<product-slug>.jpg
```

Drop matching JPG/PNG files into `public/images/products/<category-id>/` using the
exact filename referenced in `src/data/products.js` (see the `image` field per product).
Until a photo is added, the product card shows a 🎆 placeholder automatically —
nothing breaks.

Category badge images (optional) go in `public/images/categories/<category-id>.jpg`.

## Adding YouTube videos to a product

Open `src/data/products.js`, find the product, and set `youtube_id` to the video ID
(the part after `watch?v=` in a YouTube URL). Leave it as `""` to hide the video
badge and player on that product.

## Project structure

```
src/
├── components/     Navbar, Footer, Hero, CategoryCard, ProductCard,
│                   QuantitySelector, CartDrawer, LanguageToggle
├── pages/          Home, Products, Categories, ProductDetail, AboutUs, ContactUs
├── data/           products.js (219 items), categories.js (17 categories) — reference
│                   source for the backend seeder; not read by the live site directly
├── context/        CartContext, LanguageContext
├── hooks/          useCart, useCategory
└── utils/          whatsapp.js (order message builder), translations.js (ta/en strings)
```

## Notes

- Cart and language choice persist in `localStorage`, so a page refresh won't lose the order.
- The WhatsApp checkout button builds a pre-filled message with every line item, quantity
  and total, in whichever language is currently selected.
- Tamil UI strings and category names are fully translated. Individual product names
  currently display in English in both languages — add `name_ta` per product in
  `src/data/products.js` if you'd like each one translated too.
