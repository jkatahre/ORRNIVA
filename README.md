# Orrniva — Home Decor & Lifestyle Catalogue

A premium Indian home decor e-commerce storefront, designed as an editorial **catalogue** rather than a promotional landing page (no banners anywhere). 77 products across Home Accessories, Kitchen & Bar and Gifting, with working filters, sorting, search, cart, wishlist, mock checkout and accounts.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router 7, Lucide, React Hook Form, Context API |
| Backend | Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt |
| Tooling | npm workspaces, Vercel |

## Getting started

```bash
npm install          # installs both workspaces
npm run dev          # frontend on http://localhost:5173 (uses bundled mock data)
npm run build        # production build -> frontend/dist
```

### Running with the API (optional)

```bash
cp backend/.env.example backend/.env      # set MONGODB_URI and JWT_SECRET
npm run seed -w backend                    # loads backend/data/products.json
npm run dev:api                            # http://localhost:5000/api
echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env.local
npm run dev
```

All data access goes through `frontend/src/services/api.ts`. With `VITE_API_URL` unset it uses local mock data and `localStorage`; with it set, the same functions call the Express API. Components don't change.

After editing products in `frontend/src/data/products.ts`, run `npm run export-products -w backend` and re-seed.

## Features

- **Catalogue home page**: typographic masthead with chapter index, category chapters, best sellers, new arrivals, curated edits, trending, festive edit, editorial "plates", brand story, testimonials, inspiration gallery, newsletter.
- **Collections** (`/collections/all`, `/collections/:category`, `/collections/:category/:sub`, curated edits such as `/collections/the-brass-edit`): faceted filters (category, product type, material, availability, price slider and inputs) with live counts, 7 sort options, filter chips, clear all, empty state, and a mobile filter drawer plus sort sheet. Filter state lives in the URL, so it is shareable and works with the back button.
- **Product page**: gallery with thumbnails, arrows, swipe, hover zoom and a fullscreen viewer; quantity, add to bag, buy now, wishlist; tabs for description, specs, shipping, returns and reviews; related and recently viewed products.
- **Search**: weighted search across name, category, material and tags; live suggestions; recent and popular searches; results page with sorting; no-results state.
- **Cart & wishlist**: persisted in `localStorage` and synced across tabs; mini-cart drawer; free-shipping meter; coupons (`ORRNIVA10`, `WELCOME200`, `FESTIVE15`); move between wishlist and bag.
- **Checkout**: validated contact and address form (Indian mobile, PIN code, state list) and UPI, card or COD. Prepaid orders get 5% off up to ₹250; COD adds a ₹49 fee. **No payment details are collected.**
- **Accounts**: register (with live password rules), login, forgot password, profile, order history and order tracking.
- Content pages: About, Contact, FAQ, Track Order, Privacy, Returns, Shipping, 404.

## Project structure

```
frontend/
  public/images/{home-accessories,kitchen-bar,gifting,collections}/   WebP, 2 sizes each
  src/{components/{common,layout,product,cart,filters},pages,context,hooks,data,types,utils,config,services}
backend/
  config/ controllers/ middleware/ models/ routes/ services/ data/ server.js seed.js
```

## Deployment (Vercel)

Import the repository. `vercel.json` builds the frontend workspace and serves `frontend/dist` with SPA rewrites. Deploy the API separately (Render, Railway, Fly.io) and set `VITE_API_URL` in Vercel's environment variables.

## Image credits

Photography is from [Unsplash](https://unsplash.com) under the Unsplash License, resized to WebP. Photo IDs for each image key are in `frontend/public/images/credits.json`. Replace them with your own product photography before launch.
