# Implementation Plan — OneNet Servers Website Rebuild

## Current State
- **Branch**: `claude/plan-setup-from-docs-lsLdw`
- **Repo contents**: CLAUDE.md, .gitignore, README.md (empty project)
- **Available tooling**: Node 22.22.0, npm 10.9.4, Docker 29.2.1, npx

## Execution Strategy

The CLAUDE.md defines 9 phases. Below is the concrete implementation plan broken into **sequential steps** with dependencies called out. Each step produces a working, committable unit.

---

## STEP 1: Nuxt 3 Project Scaffolding (Phase 1.1)

**Goal**: Bootable Nuxt 3 app with Tailwind CSS and correct directory structure.

1. Run `npx nuxi@latest init frontend` with TypeScript
2. Install core dependencies:
   - `@nuxtjs/tailwindcss`
   - `@nuxt/image`
   - `@nuxtjs/seo`
   - `@nuxt/eslint-config`, `prettier`, `eslint-config-prettier`
3. Configure `nuxt.config.ts`:
   - Enable SSR
   - Register modules (tailwindcss, image, seo)
   - Set app head defaults (charset, viewport, favicon)
   - Define `runtimeConfig` for DIRECTUS_URL, WHMCS_API_URL, WHMCS_API_IDENTIFIER, WHMCS_API_SECRET, SITE_URL
4. Create `tailwind.config.ts` with brand design tokens:
   - Colors: primary (#4338F5), primary-hover (#3730D9), primary-light (#EFF2FE), secondary (#000), accent-green, accent-yellow, grays, success, error
   - Typography scale, spacing, max-width (1280px)
5. Create `frontend/assets/css/main.css` with Tailwind directives + global styles
6. Create `tsconfig.json` with strict mode and path aliases
7. Create `.env.example` at repo root
8. Create `.eslintrc.cjs` and `.prettierrc`
9. Create directory scaffolding: `components/{layout,ui,blocks,shared}`, `composables/`, `layouts/`, `pages/`, `server/api/whmcs/`, `plugins/`, `types/`, `services/whmcs/`, `utils/`, `assets/{fonts,images,icons}`
10. Verify: `cd frontend && npm run dev` boots successfully

**Commit**: "Scaffold Nuxt 3 project with Tailwind CSS, design tokens, and directory structure"

---

## STEP 2: Docker / Directus CMS Setup (Phase 1.2)

**Goal**: `docker-compose up` launches Directus + PostgreSQL locally.

1. Create `docker/docker-compose.yml`:
   - `postgres` service: PostgreSQL 15, volume `pgdata`, port 5432
   - `directus` service: latest Directus image, port 8055, linked to postgres
   - Directus env: ADMIN_EMAIL, ADMIN_PASSWORD, DB_CLIENT=pg, CORS_ENABLED=true
2. Create `docker/docker-compose.prod.yml` (placeholder for production)
3. Create `docker/nginx/default.conf` (reverse proxy config)
4. Create `docker/Dockerfile.frontend` (multi-stage Node build)
5. Create `cms/` directories: `snapshots/`, `seeds/`, `extensions/`, `uploads/`
6. Verify: `docker-compose up -d` starts Directus at http://localhost:8055

**Commit**: "Add Docker Compose for Directus CMS and PostgreSQL"

---

## STEP 3: TypeScript Type Definitions (Phase 6.2)

**Goal**: All shared types defined before writing any components or services.

_Moved ahead of components because every component and composable depends on these types._

1. Create `frontend/types/cms.ts`:
   - Interfaces for: SiteSettings, Navigation, Page, all Block types (BlockHero, BlockTabbedHero, BlockTabbedHeroItem, BlockPricingSection, PricingPlan, BlockFeaturesGrid, BlockDomainSearch, BlockDomainPricingCarousel, DomainTldPrice, BlockTextWithImage, BlockPerformanceChart, BlockGlobalReach, BlockTestimonials, Testimonial, BlockFaq, FaqItem, BlockCtaBanner, BlockPartnersCarousel, BlockRichText, BlockContactForm, BlockServiceCards, BlockComparisonTable)
   - M2A block union type
2. Create `frontend/types/whmcs.ts`:
   - DomainCheckResult, TldPricingResult, ProductsResult, CartAddParams, ClientParams, ClientResult, SsoTokenResult, InvoicesResult
3. Create `frontend/types/ui.ts`:
   - ButtonVariant, ButtonSize, CardVariant, TabItem, BadgeVariant, AccordionVariant, etc.

**Commit**: "Define TypeScript types for CMS, WHMCS, and UI components"

---

## STEP 4: WHMCS Service Layer (Phase 1.3)

**Goal**: Server-side WHMCS API client and Nuxt API proxy routes.

1. Create `frontend/services/whmcs/WhmcsClient.ts`:
   - Constructor takes baseUrl, identifier, secret from runtime config
   - Methods: checkDomainAvailability, getTldPricing, getProducts, addToCart, addClient, createSsoToken, getInvoices
   - All methods use `$fetch` to POST to WHMCS API
2. Create Nuxt server API routes in `frontend/server/api/whmcs/`:
   - `domain-check.post.ts` — POST, calls DomainWhois
   - `tld-pricing.get.ts` — GET, calls GetTLDPricing (cached 1 hour)
   - `products.get.ts` — GET, calls GetProducts
   - `cart-url.post.ts` — POST, generates WHMCS cart URL
   - `register.post.ts` — POST, calls AddClient
   - `sso.post.ts` — POST, calls CreateSsoToken
3. Create server utility to instantiate WhmcsClient from runtime config

**Commit**: "Add WHMCS API service layer and server proxy routes"

---

## STEP 5: Composables (Phase 6.1)

**Goal**: Reusable Vue composables for data fetching and state management.

1. `useDirectus.ts` — Directus SDK wrapper: fetchPage, fetchPages, fetchSettings, fetchNavigation, fetchBlocks
2. `useSiteSettings.ts` — Cached singleton for site_settings, provides reactive settings
3. `useNavigation.ts` — Fetch navigation tree, structure into groups (main_menu, footer_*)
4. `useWhmcs.ts` — Client-side wrapper calling `/api/whmcs/*` proxy routes
5. `useDomainSearch.ts` — Reactive state: query, loading, results, error, search()
6. `usePricing.ts` — formatCurrency(amount, currency), formatBillingPeriod()
7. `useSeo.ts` — setSeoMeta(page) helper wrapping useSeoMeta()
8. `useForm.ts` — Generic form state, field validation, submit handler

**Commit**: "Add Vue composables for Directus, WHMCS, SEO, and forms"

---

## STEP 6: Layouts and UI Primitives (Phase 3.1 + 3.2)

**Goal**: Base layout and all reusable UI atoms.

### 6a: Layouts
1. `frontend/layouts/default.vue` — PromoBar + AppHeader + `<slot>` + AppFooter
2. `frontend/layouts/blank.vue` — Minimal: `<slot>` only (legal pages)
3. `frontend/app.vue` — `<NuxtLayout><NuxtPage /></NuxtLayout>`

### 6b: UI Primitives (13 components)
1. `BaseButton.vue` — variant (primary/secondary/outline/ghost), size, href, loading, disabled
2. `BaseCard.vue` — border, shadow, padding, border-radius props
3. `BaseInput.vue` — label, validation error, icon
4. `BaseSelect.vue` — custom dropdown
5. `BaseTextarea.vue` — multi-line + char count
6. `BaseAccordion.vue` — collapsible, supports purple gradient + minimal variant
7. `BaseAccordionGroup.vue` — wraps accordions, single-open mode
8. `BaseTabs.vue` — pill and underline style tabs
9. `BaseBadge.vue` — new/hot/sale/default variants
10. `BaseModal.vue` — focus trap, escape-to-close
11. `BaseTooltip.vue` — hover/focus tooltip
12. `BaseCarousel.vue` — horizontal scroll, prev/next, auto-play
13. `IconComponent.vue` — SVG icon loader from assets/icons/

### 6c: Layout Components
1. `PromoBar.vue` — sticky top bar, CTA, dismissible via localStorage
2. `AppHeader.vue` — logo, mega-menu nav, phone, help center, sign-in dropdown
3. `MobileNav.vue` — off-canvas slide-in, accordion submenus
4. `AppFooter.vue` — 5-column footer, social icons, payment methods, copyright

**Commit**: "Add layouts, UI primitives, and layout components (header, footer, nav)"

---

## STEP 7: Shared Components (Phase 3.3)

**Goal**: Reusable cross-page components.

1. `GoogleRatingBadge.vue` — Google logo + stars + rating text + review link
2. `PriceDisplay.vue` — formatted price, currency, period, discount/savings badge
3. `DomainSearchWidget.vue` — search input, calls useDomainSearch, shows results
4. `TldPriceBadge.vue` — single TLD card with prices and badge

**Commit**: "Add shared components: GoogleRating, PriceDisplay, DomainSearch, TldPriceBadge"

---

## STEP 8: Block Components + BlockRenderer (Phase 3.4)

**Goal**: All 17 CMS block components and the BlockRenderer orchestrator.

Build in this order (simplest to most complex):

1. `BlockRichText.vue` — WYSIWYG content, prose styling
2. `BlockCtaBanner.vue` — headline, CTAs, backgrounds
3. `BlockPartnersCarousel.vue` — auto-scrolling logo carousel
4. `BlockFeaturesGrid.vue` — responsive grid, 3 variants
5. `BlockTextWithImage.vue` — two-column, flippable, badges
6. `BlockGlobalReach.vue` — headline + map + stats
7. `BlockDomainSearch.vue` — wrapper around DomainSearchWidget
8. `BlockDomainPricingCarousel.vue` — TLD price carousel
9. `BlockServiceCards.vue` — grid of service cards
10. `BlockComparisonTable.vue` — responsive table
11. `BlockPerformanceChart.vue` — bar chart + tech icons
12. `BlockTestimonials.vue` — scrolling review cards + Google rating
13. `BlockFaq.vue` — search, tabs, accordion
14. `BlockHero.vue` — 3 variants (split, centered, full_bg_image)
15. `PricingCard.vue` — individual plan card
16. `BlockPricingSection.vue` — tabbed pricing grid + features
17. `BlockTabbedHero.vue` — homepage hero with tab switcher
18. **`BlockRenderer.vue`** — collection-to-component registry map, renders M2A blocks

**Commit**: "Add all CMS block components and BlockRenderer"

---

## STEP 9: Pages and Routing (Phase 4)

**Goal**: All pages wired up with dynamic CMS content.

1. `frontend/pages/index.vue` — Homepage: fetch slug="home", render 13 block sections
2. `frontend/pages/[...slug].vue` — Dynamic catch-all: fetch by slug, 404 if missing, SEO meta, BlockRenderer
3. `frontend/error.vue` — Custom 404 page with illustration
4. Seed content structure reference (page slugs mapped to blocks):
   - `/web-hosting`, `/wordpress-hosting`, `/reseller-hosting`
   - `/register-domain-name`, `/domain-transfer`
   - `/business-email`, `/ssl-certificates`, `/oneweb-guard`
   - `/our-services`, `/our-services/website-design`
   - `/about`, `/contact-us`
   - `/privacy`, `/terms`, `/agreement`, `/imprint`

**Commit**: "Add page routing: homepage, dynamic slug pages, and 404 error page"

---

## STEP 10: WHMCS Cart Integration (Phase 5)

**Goal**: All CTAs connect to WHMCS billing.

1. Wire "Choose this Plan" buttons to generate WHMCS cart URLs:
   `https://host.onenetservers.net/cart.php?a=add&pid={ID}&billingcycle=annually&promocode=NGLaunch`
2. Wire domain search results to WHMCS cart
3. Verify sign-in dropdown hardcoded links
4. Test domain search flow end-to-end (via proxy)

**Commit**: "Wire WHMCS cart integration for pricing CTAs and domain search"

---

## STEP 11: SEO, Performance, Accessibility (Phase 7)

**Goal**: Production-ready optimization.

1. SEO:
   - `useSeoMeta()` on every page from CMS data
   - Sitemap.xml generation from Directus pages
   - `robots.txt`
   - JSON-LD structured data (Organization, Product, FAQ, BreadcrumbList)
   - OG/Twitter meta tags
2. Performance:
   - Nuxt Image: lazy loading, WebP, responsive srcset
   - ISR for product pages
   - Server-side caching of Directus responses (5min TTL)
   - Tailwind purge config
3. Accessibility:
   - Skip-to-content link in default layout
   - ARIA labels on all interactive elements
   - Focus-visible styles in Tailwind config
   - Keyboard navigation on dropdowns, modals, accordions
   - Screen-reader-friendly pricing tables

**Commit**: "Add SEO meta, sitemap, JSON-LD, performance optimizations, and a11y"

---

## STEP 12: Directus Schema Snapshots (Phase 2)

**Goal**: Reproducible CMS schema creation.

1. Create Directus schema snapshot JSON in `cms/snapshots/` covering:
   - `site_settings` singleton (30+ fields)
   - `navigation` collection with self-referencing parent
   - `pages` collection with M2A blocks field
   - All 17 block collections + related collections (pricing_plan, testimonial, faq_item, domain_tld_price, block_tabbed_hero_item)
2. Create `cms/seeds/` scripts for initial content:
   - Site settings with all OneNet Servers data
   - Navigation items (main_menu + all footer groups)
   - Homepage page with ordered blocks
   - Product pages with their block compositions

**Commit**: "Add Directus schema snapshots and content seed data"

---

## STEP 13: Deployment Configuration (Phase 8)

**Goal**: Production-ready Docker and CI/CD setup.

1. `docker/docker-compose.prod.yml`:
   - Directus, PostgreSQL, Nuxt (built), Nginx containers
   - Proper networking, volumes, restart policies
2. `docker/nginx/default.conf`:
   - onenetservers.net → Nuxt (port 3000)
   - cms.onenetservers.net → Directus (port 8055)
   - SSL termination placeholders
3. `docker/Dockerfile.frontend`:
   - Multi-stage: install → build → runtime (node:22-alpine)
4. PM2 ecosystem file (`frontend/ecosystem.config.cjs`)
5. `.github/workflows/ci.yml`: lint, typecheck, test on PR
6. `.github/workflows/deploy.yml`: build + deploy to VPS on push to main

**Commit**: "Add production Docker, Nginx config, and GitHub Actions CI/CD"

---

## STEP 14: Testing (Phase 9)

**Goal**: Unit and E2E test coverage.

1. Install Vitest + `@vue/test-utils` + `@nuxt/test-utils`
2. Unit tests for:
   - Composables: useDomainSearch, usePricing, useNavigation
   - WHMCS server routes (mocked responses)
   - UI primitives: BaseButton, BaseTabs, BaseAccordion
3. Install Playwright
4. E2E tests for:
   - Homepage loads all blocks
   - Navigation dropdowns work
   - Domain search returns results
   - "Choose this Plan" → correct WHMCS URL
   - Mobile responsive menu
   - Contact form submission

**Commit**: "Add Vitest unit tests and Playwright E2E tests"

---

## Dependency Graph

```
Step 1 (Nuxt scaffold)
  ├── Step 2 (Docker/Directus) — independent, parallel OK
  ├── Step 3 (Types) — needs Step 1 for tsconfig
  │     └── Step 4 (WHMCS service) — needs types
  │           └── Step 5 (Composables) — needs WHMCS service + types
  │                 └── Step 6 (Layouts + UI) — needs composables
  │                       └── Step 7 (Shared components) — needs UI primitives
  │                             └── Step 8 (Block components) — needs shared + UI
  │                                   └── Step 9 (Pages) — needs blocks + composables
  │                                         └── Step 10 (WHMCS cart) — needs pages
  └── Step 11 (SEO/Perf/A11y) — needs pages
       └── Step 12 (Directus schemas) — independent, but validates against types
            └── Step 13 (Deployment) — needs everything built
                 └── Step 14 (Tests) — needs everything built
```

## File Count Estimate

| Category | Files | Approx Lines |
|---|---|---|
| Config (nuxt, tailwind, ts, eslint, docker, nginx) | ~12 | ~500 |
| Types | 3 | ~600 |
| WHMCS Service + Server Routes | 8 | ~400 |
| Composables | 8 | ~500 |
| Layout Components | 4 | ~800 |
| UI Primitives | 13 | ~1,300 |
| Shared Components | 4 | ~400 |
| Block Components | 18 | ~2,000 |
| Pages | 3+ | ~300 |
| CMS Snapshots + Seeds | 4+ | ~1,500 |
| Docker + CI/CD | 6 | ~300 |
| Tests | 10+ | ~800 |
| **Total** | **~95 files** | **~9,400 lines** |
