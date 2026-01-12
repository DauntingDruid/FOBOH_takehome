# FOBOH Pricing App

Simple pricing profile editor with per-product adjustments and "based on" pricing.

## What’s here
- Browse and filter products (search, SKU, category, segment, brand)
- Create and edit pricing profiles (fixed or % adjustments, increase/decrease)
- Per-product overrides within a profile
- “Based on profile” view that shows inherited prices and falls back to default
- Refresh pricing to see adjusted totals before saving

## Stack
- Backend: Node.js/Express (in-memory data), price calculator helper
- Frontend: Next.js/React (app router), Tailwind styles

## Getting started
1) Clone
```bash
git clone https://github.com/DauntingDruid/FOBOH_takehome
cd FOBOH_takehome
```

2) Install deps
```bash
cd foboh-backend && npm install
cd ../foboh-frontend && npm install
```

3) Run backend (port 3000)
```bash
cd foboh-backend
npm start
```

4) Run frontend (port 3001 by default for dev)
```bash
cd ../foboh-frontend
npm run dev
```

Open http://localhost:3001 to use the app.

## Using pricing profiles
- Select a profile to edit, adjust mode (fixed $ or %), and increment/decrement.
- Choose “Based on Profile” to see inherited prices in the table. If a product is not in the base profile, you’ll see `Default - $<price>`.
- Enter per-product adjustment values and click “Refresh Pricing” to preview new prices.
- Click Save to persist in-memory (no database).
- “Create New Profile” adds a draft card; save to add it to the list.

## Data
- Stored in-memory under `foboh-backend/data`. Restarting the server resets changes.
- Default profiles: global wholesale plus a sample discount profile.

## Future Improvements
  - 'Based on' profile: Displaying if product is taking the global wholesale price or the pricing profile price
  - 'Based on' profile: Displaying missing products in current pricing profile when selecting a different pricing profile in the UI
  - Ability to have different price adjustments for products in a pricing profile both fixed and dynamic. 
  - Search bar to search for products by title, sku, category, segment, brand using algorithms like fuzzy search, levenshtein distance, etc
  - Currently I have just set the type to any, but in the future we should create a type for the pricing profile
  - we should also have types for selection type and pricing profile type etc
  - Functionality for Search and product selection can be improved further -> should keep already selected products when switching between search and filters.
  - Can add support for draft, completed status for pricing profiles
  - Keep selections when changing filters
