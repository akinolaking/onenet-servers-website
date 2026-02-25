# CLAUDE.md — OneNet Servers Website Rebuild

## Project Overview

Rebuild the **OneNet Servers** (onenetservers.net) hosting company website from WordPress (Elementor + ACF) to a modern Vue 3 + TypeScript + Tailwind CSS stack with Directus headless CMS and WHMCS API integration.

OneNet Servers is a Nigerian-based web hosting company (a ConqolX Technologies Limited Company, RC-1775966) serving businesses across Africa, North America, Europe, and Asia. Their products include web hosting, WordPress hosting, reseller hosting, domain registration, business email, SSL certificates, website security (OneGuard), and web design services. Their WHMCS billing portal lives at `host.onenetservers.net`.

A **Figma design file** exists for this project. All component styling, spacing, typography, and visual details should follow the Figma designs precisely. Where the Figma design doesn't cover a specific element, use the existing live site as reference and maintain visual consistency.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | **Nuxt 3** (Vue 3 Composition API + TypeScript, SSR/SSG) |
| Styling | **Tailwind CSS 3** with custom theme |
| Headless CMS | **Directus** (self-hosted, open-source) |
| CMS Database | **PostgreSQL** |
| Billing/Commerce | **WHMCS REST API** (existing at host.onenetservers.net) |
| Deployment | **VPS** — Nginx reverse proxy, PM2, Docker |
| Version Control | **Git** monorepo |
| Testing | **Vitest** (unit), **Playwright** (e2e) |
| CI/CD | **GitHub Actions** |

---

## Brand & Design Tokens

These values are derived from the current live site. The Figma file is the source of truth — override these if Figma specifies differently.

```
Colors:
  primary:        #4338F5  (brand purple — buttons, headers, promo bar, footer bg)
  primary-hover:  #3730D9
  primary-light:  #EFF2FE  (light blue-gray section backgrounds)
  secondary:      #000000  (headings, body text)
  accent-green:   #22C55E  (green highlights, "Confidence" accent text)
  accent-yellow:  #FACC15  (savings badges, promo highlights)
  white:          #FFFFFF
  gray-100:       #F9FAFB
  gray-500:       #6B7280
  gray-900:       #111827
  success:        #16A34A
  error:          #DC2626

Typography:
  Font Family:     Match Figma (current site uses system/sans-serif)
  Hero Headings:   48-64px, font-weight 800-900
  Section Headings: 32-40px, font-weight 700
  Body:            16-18px, font-weight 400
  Small:           14px

Buttons:
  Primary:    bg-primary, text-white, rounded-full, px-8 py-3
  Secondary:  bg-white, border border-gray-300, text-secondary, rounded-full
  Ghost:      bg-transparent, text-primary, underline

Cards:
  border: 1px solid primary (thin purple border)
  border-radius: 12-16px
  shadow: subtle on hover

Spacing & Layout:
  Max content width: 1280px
  Section padding: py-16 to py-24
  Grid gap: gap-6 to gap-8
```

---

## Repository Structure

```
onenet-servers/
├── frontend/                    # Nuxt 3 application
│   ├── app.vue
│   ├── nuxt.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css         # Tailwind directives + global styles
│   │   ├── fonts/
│   │   └── images/              # Static images, decorative SVGs
│   ├── components/
│   │   ├── layout/              # AppHeader, AppFooter, MobileNav, PromoBar
│   │   ├── ui/                  # BaseButton, BaseCard, BaseInput, etc.
│   │   ├── blocks/              # CMS-driven block components
│   │   └── shared/              # GoogleRating, PriceDisplay, DomainSearchWidget
│   ├── composables/             # useDirectus, useWhmcs, useSeo, etc.
│   ├── layouts/
│   │   ├── default.vue
│   │   └── blank.vue            # For legal pages, minimal layout
│   ├── pages/
│   │   ├── index.vue            # Homepage
│   │   └── [...slug].vue        # Dynamic CMS-driven pages
│   ├── server/
│   │   ├── api/
│   │   │   └── whmcs/           # Secure WHMCS API proxy routes
│   │   └── middleware/
│   ├── plugins/
│   ├── types/                   # TypeScript type definitions
│   │   ├── cms.ts
│   │   ├── whmcs.ts
│   │   └── ui.ts
│   ├── services/
│   │   └── whmcs/               # WHMCS client class
│   └── utils/                   # Currency formatters, helpers
├── cms/                         # Directus configuration
│   ├── snapshots/               # Directus schema snapshots (migrations)
│   ├── seeds/                   # Initial content seed data
│   ├── extensions/              # Custom Directus hooks/endpoints
│   └── uploads/                 # Asset exports from current site
├── docker/
│   ├── docker-compose.yml       # Local dev: Directus + PostgreSQL
│   ├── docker-compose.prod.yml  # Production: full stack
│   ├── nginx/
│   │   └── default.conf         # Nginx reverse proxy config
│   └── Dockerfile.frontend
├── docs/
│   ├── cms-editor-guide.md      # How editors create pages with blocks
│   ├── whmcs-integration.md     # WHMCS API integration documentation
│   └── deployment.md            # VPS deployment guide
├── .github/
│   └── workflows/
│       ├── ci.yml               # Lint, typecheck, test on PR
│       └── deploy.yml           # Deploy to VPS on push to main
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── CLAUDE.md                    # This file
└── README.md
```

---

## PHASE 1 — Project Scaffolding & Infrastructure

### Task 1.1: Initialize Nuxt 3 Project
- Run `npx nuxi@latest init frontend` with TypeScript enabled
- Configure `nuxt.config.ts`:
  - Enable SSR
  - Register Tailwind CSS module (`@nuxtjs/tailwindcss`)
  - Register Nuxt Image module (`@nuxt/image`)
  - Register Nuxt SEO module (`@nuxtjs/seo`)
  - Set app head defaults (charset, viewport, favicon)
  - Configure runtime config for `DIRECTUS_URL`, `WHMCS_API_URL`, `WHMCS_API_IDENTIFIER`, `WHMCS_API_SECRET`, `SITE_URL`
- Configure `tailwind.config.ts` with the brand design tokens above
- Set up `tsconfig.json` with strict mode and path aliases
- Install and configure ESLint (`@nuxt/eslint-config`) + Prettier
- Create `.env.example` with all required environment variables

### Task 1.2: Directus CMS Docker Setup
- Create `docker/docker-compose.yml`:
  - `directus` service: latest Directus image, port 8055
  - `postgres` service: PostgreSQL 15, persistent volume
  - Shared network
- Configure Directus environment:
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
  - `DB_CLIENT=pg`, connection to postgres service
  - `PUBLIC_URL=http://localhost:8055` (dev) / `https://cms.onenetservers.net` (prod)
  - `CORS_ENABLED=true`, `CORS_ORIGIN` set to frontend URL
  - `STORAGE_LOCATIONS=local`
- Create Directus roles: `Admin`, `Editor` (can manage content, cannot manage schema), `API` (read-only, for frontend)
- Generate a static API token for the `API` role (used by Nuxt)

### Task 1.3: WHMCS API Service Layer
Create `frontend/services/whmcs/WhmcsClient.ts`:

```typescript
// This class is ONLY used server-side (in /server/api/whmcs/ routes)
// API credentials never reach the client
class WhmcsClient {
  private baseUrl: string
  private identifier: string
  private secret: string

  // Methods to implement:
  async checkDomainAvailability(domain: string): Promise<DomainCheckResult>
  async getTldPricing(): Promise<TldPricingResult>
  async getProducts(groupId?: number): Promise<ProductsResult>
  async addToCart(params: CartAddParams): string  // Returns WHMCS cart URL
  async addClient(params: ClientParams): Promise<ClientResult>
  async createSsoToken(clientId: number): Promise<SsoTokenResult>
  async getInvoices(clientId: number): Promise<InvoicesResult>
}
```

Create Nuxt server API routes in `frontend/server/api/whmcs/`:

| Route | Method | Purpose |
|---|---|---|
| `/api/whmcs/domain-check` | POST | Check domain availability via `DomainWhois` |
| `/api/whmcs/tld-pricing` | GET | Get all TLD pricing (cached 1 hour) |
| `/api/whmcs/products` | GET | Get hosting products and pricing |
| `/api/whmcs/cart-url` | POST | Generate WHMCS cart URL with product/domain params |
| `/api/whmcs/register` | POST | Register new client via `AddClient` |
| `/api/whmcs/sso` | POST | Generate SSO auto-login URL via `CreateSsoToken` |

---

## PHASE 2 — Directus CMS Schema & Content Models

All collections should be created via Directus schema snapshots for reproducibility. Store snapshots in `cms/snapshots/`.

### Task 2.1: `site_settings` (Singleton)
| Field | Type | Notes |
|---|---|---|
| `site_name` | string | "OneNet Servers" |
| `tagline` | string | "Your Website, Always Up!" |
| `logo` | file (SVG) | |
| `logo_dark` | file (SVG) | White version for dark backgrounds |
| `phone_primary` | string | "02013-309-154" |
| `phone_international` | string | "+4473338807775" |
| `email` | string | "support@onenetservers.net" |
| `address` | text | "VeniaHub 8, The Providence St, Lekki Phase 1, Lagos 100252, Nigeria" |
| `address_map_url` | string | Google Maps link |
| `google_rating` | decimal | 4.9 |
| `google_review_count` | integer | 20 |
| `google_review_url` | string | Google review page URL |
| `social_facebook` | string | "https://www.facebook.com/onenetservers/" |
| `social_twitter` | string | "https://www.twitter.com/_onenetservers" |
| `social_instagram` | string | "https://www.instagram.com/onenet.servers" |
| `social_linkedin` | string | "https://www.linkedin.com/company/onenetservers" |
| `social_youtube` | string | "https://www.youtube.com/@onenetservers" |
| `promo_bar_enabled` | boolean | |
| `promo_bar_text` | string | "Ready to launch your business or personal online presence? Get started with 30% off!" |
| `promo_bar_cta_text` | string | "Get Started" |
| `promo_bar_cta_url` | string | WHMCS cart URL with promo code |
| `company_name` | string | "ConqolX Technologies Limited" |
| `company_reg_number` | string | "RC-1775966" |
| `copyright_year_start` | integer | 2015 |
| `payment_methods` | JSON | Array of {name, logo} for Flutterwave, Stripe, Bitcoin, PayPal |
| `live_chat_enabled` | boolean | |
| `live_chat_provider` | string | "brevo" |
| `live_chat_widget_id` | string | |

### Task 2.2: `navigation` Collection
| Field | Type | Notes |
|---|---|---|
| `id` | auto UUID | |
| `label` | string | Display text |
| `url` | string (nullable) | Internal path or external URL |
| `icon` | file (nullable) | SVG icon for mega-menu items |
| `description` | string (nullable) | Subtitle text in mega-menu dropdown |
| `parent` | M2O self-reference | null = top-level |
| `sort` | integer | |
| `location` | enum | `main_menu`, `footer_products`, `footer_tools`, `footer_company`, `footer_resources` |
| `is_external` | boolean | Opens in new tab |

Seed data for main_menu (from live site):
```
Domains (parent)
  ├── Register Domain Name -> /register-domain-name/
  ├── Domain Transfer -> /domain-transfer/
  └── Domains Resources -> https://host.onenetservers.net/knowledgebase/7/Domain
Hosting (parent)
  ├── Web Hosting -> /web-hosting
  ├── WordPress Hosting -> /wordpress-hosting
  └── Reseller Hosting -> /reseller-hosting
Email & Security (parent)
  ├── Business eMail -> /business-email
  ├── OneGuard Security -> /oneweb-guard/
  └── Premium SSL Certificate -> /ssl-certificates/
Hire Us (parent)
  ├── Web Design -> /our-services/website-design/
  ├── SEO & Content Creation -> (coming soon)
  └── All Our Services -> /our-services/
```

Sign-in dropdown items (hardcoded in component, not CMS-driven):
```
Client Area -> https://host.onenetservers.net/login
Business eMail -> https://odinson.onenetservers.com:100/
WordPress Cloud Hosting -> https://kent.onenetservers.com/login
Plesk Hosting Panel -> https://hank.onenetservers.com:8443/
Reseller Hosting Panel -> https://odinson.onenetservers.com:8443/
```

### Task 2.3: `pages` Collection (Page Builder)
| Field | Type | Notes |
|---|---|---|
| `id` | auto UUID | |
| `title` | string | |
| `slug` | string (unique) | URL path |
| `meta_title` | string | SEO title |
| `meta_description` | text | SEO description |
| `og_image` | file | |
| `status` | enum | `published`, `draft`, `archived` |
| `date_created` | datetime | Auto |
| `date_updated` | datetime | Auto |
| `blocks` | M2A (Many-to-Any) | Ordered list of block items |

Use Directus **Many-to-Any (M2A)** relationship for the `blocks` field. This allows editors to add any combination of block types in any order to build pages.

### Task 2.4: Block Collections

Create each of these as a separate Directus collection. The `pages.blocks` M2A field references all of them.

**`block_hero`**
| Field | Type |
|---|---|
| `eyebrow_text` | string |
| `headline` | string |
| `description` | text |
| `image` | file |
| `bullet_points` | JSON array of `{text: string, tooltip?: string}` |
| `primary_cta_text` | string |
| `primary_cta_url` | string |
| `secondary_cta_text` | string |
| `secondary_cta_url` | string |
| `show_google_rating` | boolean |
| `trial_note_text` | string |
| `variant` | enum: `split` (text+image), `centered`, `full_bg_image` |

**`block_tabbed_hero`** (Homepage-specific — hero with tab switcher)
| Field | Type |
|---|---|
| `tabs` | JSON array of `{label: string, id: string}` |
| `tab_contents` | O2M -> `block_tabbed_hero_item` |

**`block_tabbed_hero_item`**
| Field | Type |
|---|---|
| `tab_id` | string (matches parent tab id) |
| `headline` | string |
| `description` | text |
| `bullet_points` | JSON array of `{text: string, tooltip?: string}` |
| `image` | file |
| `primary_cta_text` | string |
| `primary_cta_url` | string |
| `secondary_cta_text` | string |
| `secondary_cta_url` | string |
| `note_text` | string |

**`block_pricing_section`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `toggle_tabs` | JSON array of `{label: string, category: string}` |
| `plans` | O2M -> `pricing_plan` |
| `included_features_headline` | string |
| `included_features` | JSON array of `{icon: string, title: string, description: string}` |
| `footer_notes` | JSON array of strings |

**`pricing_plan`**
| Field | Type |
|---|---|
| `name` | string |
| `emoji` | string (optional, e.g., "sparkle") |
| `badge_text` | string (e.g., "For SMEs/Single Sites") |
| `description` | text |
| `price` | decimal |
| `currency_symbol` | string (default "NGN") |
| `billing_period` | string (e.g., "Per month") |
| `discount_label` | string (e.g., "+2 months Free") |
| `savings_label` | string (e.g., "Saved NGN37,800/yr") |
| `cta_text` | string |
| `cta_url` | string (WHMCS cart URL with pid and billing cycle) |
| `features` | JSON array of strings |
| `is_featured` | boolean |
| `category` | enum: `wp_hosting`, `web_hosting`, `reseller`, `email`, `ssl`, `oneguard` |
| `sort` | integer |

**`block_features_grid`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `features` | JSON array of `{icon: string, title: string, description: string}` |
| `columns` | integer (2, 3, or 4) |
| `variant` | enum: `card_bordered`, `icon_left`, `minimal` |
| `background` | enum: `white`, `light`, `dark` |

**`block_domain_search`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `placeholder_text` | string |
| `button_text` | string (e.g., "Search Domain" or "Transfer Domain") |
| `action_type` | enum: `register`, `transfer` |
| `show_whois_note` | boolean |
| `whois_note_text` | string |
| `footer_text` | string |
| `footer_link_text` | string |
| `footer_link_url` | string |
| `background` | enum: `white`, `light` |

**`block_domain_pricing_carousel`**
| Field | Type |
|---|---|
| `tld_prices` | O2M -> `domain_tld_price` |
| `footer_text` | string |

**`domain_tld_price`**
| Field | Type |
|---|---|
| `tld` | string (e.g., ".com", ".ng", ".ai") |
| `regular_price` | string |
| `sale_price` | string |
| `currency_symbol` | string |
| `badge` | enum (nullable): `new`, `hot`, `sale` |
| `sort` | integer |

Seed TLDs from the live site: .com, .africa, .io, .estate, .co, .ai, .ng, .dev, .shop, .com.ng, .info, .biz

**`block_text_with_image`**
| Field | Type |
|---|---|
| `eyebrow` | string |
| `headline` | string |
| `description` | text |
| `image` | file |
| `image_position` | enum: `left`, `right` |
| `bullet_points` | JSON array of `{icon: string, title: string, description: string}` |
| `cta_text` | string |
| `cta_url` | string |
| `background` | enum: `white`, `light`, `dark` |
| `show_uptime_badge` | boolean |
| `show_support_badge` | boolean |

**`block_performance_chart`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `tech_icons` | JSON array of file references (WordPress, PHP, LiteSpeed, etc.) |
| `chart_bars` | JSON array of `{label: string, value: number, sublabel: string, color: string}` |
| `faster_badge_text` | string (e.g., "5x faster") |
| `cta_text` | string |
| `cta_url` | string |

**`block_global_reach`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `map_image` | file |
| `stats` | JSON array of `{label: string, value: string}` |

**`block_testimonials`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `show_google_rating` | boolean |
| `testimonials` | O2M -> `testimonial` |

**`testimonial`**
| Field | Type |
|---|---|
| `source_name` | string (e.g., "HostingPill", "HostAdvice", "WebsitePlanet") |
| `source_logo` | file |
| `rating` | integer (1-5) |
| `content` | text |
| `read_more_url` | string |
| `sort` | integer |

**`block_faq`**
| Field | Type |
|---|---|
| `headline` | string |
| `subtext` | string |
| `show_search` | boolean |
| `search_placeholder` | string |
| `category_tabs` | JSON array of `{label: string, id: string}` |
| `items` | O2M -> `faq_item` |

**`faq_item`**
| Field | Type |
|---|---|
| `question` | string |
| `answer` | text (rich text / markdown) |
| `category` | string (matches tab id) |
| `sort` | integer |

**`block_cta_banner`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `primary_cta_text` | string |
| `primary_cta_url` | string |
| `secondary_cta_text` | string |
| `secondary_cta_url` | string |
| `background` | enum: `primary`, `dark`, `gradient` |
| `pre_sale_text` | string |
| `pre_sale_link_text` | string |
| `pre_sale_link_url` | string |
| `show_google_rating` | boolean |

**`block_partners_carousel`**
| Field | Type |
|---|---|
| `headline` | string |
| `logos` | JSON array of file references |

**`block_rich_text`**
| Field | Type |
|---|---|
| `content` | WYSIWYG text |
| `max_width` | enum: `narrow` (640px), `medium` (768px), `full` (1280px) |

**`block_contact_form`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `contact_info_headline` | string |
| `contact_info_description` | text |
| `contact_image` | file |
| `form_headline` | string |
| `form_description` | text |
| `submit_text` | string |
| `success_message` | string |

**`block_service_cards`**
| Field | Type |
|---|---|
| `eyebrow` | string |
| `headline` | string |
| `description` | text |
| `cards` | JSON array of `{icon: string, title: string, description: string, cta_text: string, cta_url: string, badge?: string}` |

**`block_comparison_table`**
| Field | Type |
|---|---|
| `headline` | string |
| `description` | text |
| `columns` | JSON array of `{header: string}` |
| `rows` | JSON array of `{feature: string, values: string[]}` |

---

## PHASE 3 — Frontend Vue Components

### Task 3.1: Layout Components (`/frontend/components/layout/`)

**`PromoBar.vue`**
- Sticky top bar with primary background color
- Displays promo text from `site_settings`
- CTA button on the right
- Dismissible (stores dismissed state in localStorage)
- Hidden when `promo_bar_enabled` is false

**`AppHeader.vue`**
- Sticky below PromoBar
- White background with subtle bottom border
- Left: Logo (links to `/`)
- Center: Main navigation with mega-menu dropdowns
  - Each top-level item opens a dropdown panel on hover/click
  - Dropdown items have icon + title + description
- Right section:
  - Phone icon + "02013-309-154" (tel: link)
  - "Help Center" link -> WHMCS knowledgebase
  - User icon + "Sign-in" dropdown with these links:
    - Client Area -> https://host.onenetservers.net/login
    - Business eMail -> https://odinson.onenetservers.com:100/
    - WordPress Cloud Hosting -> https://kent.onenetservers.com/login
    - Plesk Hosting Panel -> https://hank.onenetservers.com:8443/
    - Reseller Hosting Panel -> https://odinson.onenetservers.com:8443/
  - Each sign-in item has title + subtitle description
- Mobile: Hamburger icon triggers `MobileNav`

**`MobileNav.vue`**
- Off-canvas slide-in panel from right
- Logo at top, close button
- Accordion-style submenus for each nav group
- Phone, Help Center, Sign-in links
- Social media icons at bottom

**`AppFooter.vue`**
- Primary (purple) background, white text
- Desktop: 5 columns
  - Column 1: Brand description, address, phone, email, social icons (Facebook, Twitter, Instagram, LinkedIn)
  - Column 2 "Domain & Hosting": Web Hosting, WordPress Hosting, Business Email, Reseller Hosting, Domain Name Search, Domain Name Transfer, Premium SSL Cert
  - Column 3 "Tools (coming soon)": Website Builder, Online Store, Image Converter, Doc Converter, AI Logo Generator, AI Business Name Tool, SEO Analyser, Payment Gateway, Invoicing App
  - Column 4 "Company": About Us, Contact Us, HostAdvice Review, Help Center, Blog & Newsletters, Report Abuse, Start2Dev, Careers, Sitemap
  - Column 5 "Resources": cPanel Tutorial, Plesk Tutorial, Reseller Tutorial, WordPress Tutorial, Domain Tutorial, SSL Certs Tutorial, Network Status, WHOIS Check
- Mobile: Accordion columns
- Bottom bar: Copyright text, Privacy/Terms/Agreement/Sitemap links, payment method logos (Flutterwave, Bitcoin, Stripe, PayPal)

### Task 3.2: UI Primitives (`/frontend/components/ui/`)

| Component | Description |
|---|---|
| `BaseButton.vue` | Props: `variant` (primary/secondary/outline/ghost), `size` (sm/md/lg), `href` (renders as `<a>` or `<NuxtLink>`), `loading`, `disabled`, `icon-left`, `icon-right`. Primary = rounded-full purple. |
| `BaseCard.vue` | Wrapper with configurable border, shadow, padding, border-radius. |
| `BaseInput.vue` | Text input with floating/top label, validation error display, optional icon. |
| `BaseSelect.vue` | Dropdown select with custom styling. |
| `BaseTextarea.vue` | Multi-line input with character count option. |
| `BaseAccordion.vue` | Single collapsible item. Supports purple gradient background variant (FAQ style) or minimal variant. |
| `BaseAccordionGroup.vue` | Wraps multiple `BaseAccordion` items with optional single-open behavior. |
| `BaseTabs.vue` | Horizontal tab list. Props: `tabs` array, `modelValue` for active tab. Emits `update:modelValue`. Supports pill style (homepage) and underline style. |
| `BaseBadge.vue` | Small label. Variants: `new` (green), `hot` (red), `sale` (yellow), `default` (gray). |
| `BaseModal.vue` | Accessible dialog overlay with focus trap, escape to close. |
| `BaseTooltip.vue` | Hover/focus tooltip with arrow. |
| `BaseCarousel.vue` | Horizontal scroll carousel with prev/next buttons, auto-play option, responsive slides. |
| `IconComponent.vue` | Dynamic SVG icon loader. Loads icons from `assets/icons/` by name. |

### Task 3.3: Shared Components (`/frontend/components/shared/`)

**`GoogleRatingBadge.vue`**
- Google logo + 5 star icons (filled based on rating) + "Rating: 4.9/5 | 20 Google reviews" text
- Links to Google review page
- Data from `site_settings`

**`PriceDisplay.vue`**
- Props: `amount` (number), `currency` (string, default "NGN"), `period` (string, e.g., "Per month"), `discount_label`, `savings_label`
- Renders formatted price with currency symbol
- Optional yellow savings badge
- Optional discount label

**`DomainSearchWidget.vue`**
- Large search input + submit button
- Props: `action_type` ("register" or "transfer"), `placeholder`, `button_text`
- On submit: calls `/api/whmcs/domain-check` via `useDomainSearch` composable
- Shows loading spinner during search
- Displays results: green badge if available, red if taken, with pricing
- "Add to Cart" button -> redirects to WHMCS cart URL
- Below input: optional TLD badge row (using `BaseBadge`)

**`TldPriceBadge.vue`**
- Displays a single TLD card: extension name, strike-through regular price, sale price
- Optional NEW/HOT/SALE badge

### Task 3.4: Block Components (`/frontend/components/blocks/`)

Each block component receives its data as props (typed from `cms.ts`).

| Component | Notes |
|---|---|
| `BlockHero.vue` | Supports 3 variants. Split variant = left text, right image. Centered = full-width centered text. FullBg = text over background image (About page). |
| `BlockTabbedHero.vue` | Homepage hero with horizontal tab pills (Web Hosting / Domain Names / Business Emails / Website & SEO). Each tab swaps the hero content. |
| `BlockPricingSection.vue` | Optional tab toggle at top (WordPress / Web Hosting). Renders `PricingCard` sub-components in a responsive 3-column grid. Below: included features grid (6 items, icon+title+description). Footer notes. |
| `PricingCard.vue` | Sub-component: plan name, emoji, badge, description, price display, CTA button, feature checklist with checkmarks. Purple border, rounded corners. |
| `BlockFeaturesGrid.vue` | Responsive grid of feature cards. Each card: icon, title, description. Card variant has thin border. |
| `BlockDomainSearch.vue` | Wrapper around `DomainSearchWidget` with headline, description, background. |
| `BlockDomainPricingCarousel.vue` | Horizontal auto-scrolling carousel of `TldPriceBadge` components with prev/next buttons. |
| `BlockTextWithImage.vue` | Two-column layout: text content on one side, image on the other. Supports flipped image position. Optional uptime/support badges. |
| `BlockPerformanceChart.vue` | Left: tech icons row + horizontal bar chart comparing OpenLiteSpeed vs Nginx vs Apache performance. Right: headline, description, CTA. "5x faster" badge. |
| `BlockGlobalReach.vue` | Headline + description on left, map image on right. Light background. |
| `BlockTestimonials.vue` | Left: headline + description + Google rating. Right: horizontal scrolling cards with quote icon, star rating, review text, source logo, read more link. |
| `BlockFaq.vue` | Optional search bar. Optional category tabs. Accordion items underneath. Purple gradient background on accordion headers. |
| `BlockCtaBanner.vue` | Full-width or contained banner with headline, description, CTAs. Primary purple background with white text. Optional "Got pre-sale questions?" link. Optional Google rating display. |
| `BlockPartnersCarousel.vue` | Auto-scrolling logo carousel. |
| `BlockRichText.vue` | Renders WYSIWYG content with proper typography styles (prose). |
| `BlockContactForm.vue` | Two-column: left = contact info + image, right = form (First Name, Last Name, Email, Phone, Company, Message, Submit). |
| `BlockServiceCards.vue` | Grid of service cards with icons, titles, descriptions, CTAs. |
| `BlockComparisonTable.vue` | Responsive comparison table (used for cPanel vs WordPress hosting). |
| **`BlockRenderer.vue`** | **Core component.** Receives the M2A `blocks` array from a page. Maps each block's `collection` name to the correct Vue component using a registry map. Renders all blocks in order. |

BlockRenderer collection-to-component mapping:
```typescript
const blockRegistry: Record<string, Component> = {
  'block_hero': BlockHero,
  'block_tabbed_hero': BlockTabbedHero,
  'block_pricing_section': BlockPricingSection,
  'block_features_grid': BlockFeaturesGrid,
  'block_domain_search': BlockDomainSearch,
  'block_domain_pricing_carousel': BlockDomainPricingCarousel,
  'block_text_with_image': BlockTextWithImage,
  'block_performance_chart': BlockPerformanceChart,
  'block_global_reach': BlockGlobalReach,
  'block_testimonials': BlockTestimonials,
  'block_faq': BlockFaq,
  'block_cta_banner': BlockCtaBanner,
  'block_partners_carousel': BlockPartnersCarousel,
  'block_rich_text': BlockRichText,
  'block_contact_form': BlockContactForm,
  'block_service_cards': BlockServiceCards,
  'block_comparison_table': BlockComparisonTable,
}
```

---

## PHASE 4 — Pages & Routing

### Task 4.1: Dynamic Page Route
Create `frontend/pages/[...slug].vue`:
- Fetch page from Directus by matching slug
- If not found, throw `createError({ statusCode: 404 })`
- Set SEO meta from page's `meta_title`, `meta_description`, `og_image`
- Pass `page.blocks` array to `<BlockRenderer :blocks="page.blocks" />`

### Task 4.2: Homepage
Create `frontend/pages/index.vue`:
- Fetch homepage from Directus (slug = `home` or id-based)
- Sections in order:
  1. `BlockTabbedHero` — 4 tabs: Web Hosting, Domain Names, Business Emails, Website & SEO
  2. Trust bar: "Hosting solutions trusted by over 500 businesses" + Google Rating
  3. `BlockPricingSection` — with WordPress/Web Hosting toggle, 3 plans each, included features grid
  4. `BlockTextWithImage` — "All-In-One Website Hosting Platform" with dashboard screenshot
  5. `BlockPerformanceChart` — "Built for lightning-fast WordPress performance"
  6. `BlockTextWithImage` — "Reliable hosting built for all webmasters" with feature cards (99.9% Uptime, All-In-One, Go Live in Minutes, 24x7 Support)
  7. `BlockTextWithImage` — "True cloud for webmaster"
  8. `BlockGlobalReach` — "We are proud to serve businesses across Africa, N.America, Europe & Asia"
  9. `BlockTestimonials` — "What customers are saying about us"
  10. `BlockFaq` — with category tabs (Popular, cPanel, WordPress)
  11. `BlockCtaBanner` — "Everything You Need to Get Your Website Started"
  12. Mobile section: `BlockDomainSearch` + `BlockDomainPricingCarousel` + `BlockPricingSection` (mobile-specific layouts)
  13. `BlockPartnersCarousel` — "Trusted Partners"

### Task 4.3: Product/Service Pages

Each of these pages follows a similar pattern: Hero -> Pricing -> Features -> Performance/Benefits -> FAQ -> CTA. Build them using the CMS block system.

| Page | Slug | Key Blocks |
|---|---|---|
| Web Hosting | `/web-hosting` | Hero (split), Pricing (Web Lite/Premium/Ultimate), Features Grid, Text+Image, FAQ, CTA |
| WordPress Hosting | `/wordpress-hosting` | Hero (split, AI builder screenshot), Pricing (WP Lite/Premium/Ultimate), Features Grid, FAQ, CTA |
| Reseller Hosting | `/reseller-hosting` | Hero (split), Pricing (RS Starter/Grow/Enterprise), Features Grid, FAQ, CTA |
| Domain Registration | `/register-domain-name` | Domain Search (register), Domain Pricing Carousel, Features, FAQ, CTA |
| Domain Transfer | `/domain-transfer` | Domain Search (transfer), Transfer Steps, FAQ, CTA |
| Business Email | `/business-email` | Hero, Pricing (3 email plans), Features, FAQ, CTA |
| SSL Certificates | `/ssl-certificates` | Hero, SSL Plan Comparison (Sectigo PositiveSSL, Multi-Domain, Business EV), Features, FAQ |
| OneGuard Security | `/oneweb-guard` | Hero, Security Plan Pricing (Basic/Premium/Pro Premium), Features, FAQ |
| Our Services | `/our-services` | Hero centered, Service Cards Grid |
| Website Design | `/our-services/website-design` | Hero, Portfolio/Process Section, CTA |
| About | `/about` | Full-width hero with bg image, Company Story, Stats, Team/Values |
| Contact Us | `/contact-us` | Hero (purple bg), Two-column Contact Form |
| Legal Pages | `/privacy`, `/terms`, `/agreement`, `/imprint` | Rich Text block only |
| 404 Error | (error page) | Custom illustration + "Page Not Found" + search/home CTA |

---

## PHASE 5 — WHMCS Integration

### Task 5.1: Server-Side API Proxy
Create Nuxt server routes in `/frontend/server/api/whmcs/`:

- `POST /api/whmcs/domain-check` — Check domain availability
  - Input: `{ domain: string }`
  - Calls WHMCS `DomainWhois` action
  - Returns: `{ available: boolean, domain: string, tld: string }`

- `GET /api/whmcs/tld-pricing` — Get all TLD pricing
  - Calls WHMCS `GetTLDPricing`
  - Returns cached TLD price list (cache 1 hour)

- `GET /api/whmcs/products` — Get hosting/service products
  - Calls WHMCS `GetProducts`
  - Returns product groups and pricing

- `POST /api/whmcs/cart/add` — Add to cart
  - Redirects user to WHMCS cart URL with product/domain parameters

- `POST /api/whmcs/register` — Register new client
  - Calls WHMCS `AddClient`
  - Returns client ID and redirect token

- `GET /api/whmcs/sso` — Generate SSO login URL
  - Calls WHMCS `CreateSsoToken`
  - Returns auto-login URL for `host.onenetservers.net`

### Task 5.2: Cart Flow Integration
- All "Choose this Plan" buttons should generate WHMCS cart URLs:
  - Format: `https://host.onenetservers.net/cart.php?a=add&pid={PRODUCT_ID}&billingcycle=annually&promocode=NGLaunch`
- Domain search results should link to:
  - `https://host.onenetservers.net/cart.php?a=add&domain=register&query={DOMAIN}`
- "Sign-in" dropdown should offer:
  - Client Area link -> `https://host.onenetservers.net/clientarea.php`
  - SSO auto-login (if token available)

### Task 5.3: Pricing Sync Strategy
- Pricing shown on the Vue site comes from Directus CMS (manually managed, matches WHMCS)
- Optionally, create a Directus hook/extension or cron job that periodically syncs WHMCS product prices into Directus collections
- The CMS is the source of truth for display; WHMCS is the source of truth for billing

---

## PHASE 6 — Composables & Utilities

### Task 6.1: Vue Composables
Create in `/frontend/composables/`:

- `useDirectus.ts` — Directus SDK wrapper, fetch pages, blocks, settings, navigation
- `useWhmcs.ts` — WHMCS API calls (via the `/api/whmcs/` proxy)
- `useSiteSettings.ts` — Global site settings from Directus (cached)
- `useNavigation.ts` — Fetch and structure navigation tree
- `useDomainSearch.ts` — Domain search state management (query, loading, results)
- `usePricing.ts` — Currency formatting, price display helpers
- `useSeo.ts` — Meta tag management per page (from CMS data)
- `useForm.ts` — Generic form state, validation, submission

### Task 6.2: TypeScript Types
Create in `/frontend/types/`:

- `cms.ts` — All Directus collection interfaces (Page, Block*, PricingPlan, Testimonial, Navigation, SiteSettings, etc.)
- `whmcs.ts` — WHMCS API request/response types (DomainCheckResult, Product, TldPricing, Client, Order, SsoToken)
- `ui.ts` — Component prop types (ButtonVariant, CardVariant, TabItem, etc.)

---

## PHASE 7 — SEO, Performance & Accessibility

### Task 7.1: SEO
- Implement `useSeoMeta()` on every page from CMS `meta_title` and `meta_description`
- Generate `sitemap.xml` dynamically from Directus pages
- Add `robots.txt`
- Implement JSON-LD structured data (Organization, Product, FAQ, BreadcrumbList)
- Open Graph and Twitter Card meta tags from CMS `og_image`

### Task 7.2: Performance
- Nuxt Image module (`@nuxt/image`) for responsive images, lazy loading, WebP conversion
- Enable ISR (Incremental Static Regeneration) for product/pricing pages
- Cache Directus API responses at the Nuxt server level (5-minute TTL)
- Preload critical fonts
- Tailwind purge for minimal CSS

### Task 7.3: Accessibility
- All interactive elements keyboard-navigable
- ARIA labels on icons, navigation, modals
- Skip-to-content link
- Focus-visible styles
- Color contrast compliance (WCAG AA)
- Screen reader-friendly pricing tables

---

## PHASE 8 — Deployment & DevOps

### Task 8.1: VPS Deployment Setup
- Write production `docker-compose.prod.yml`:
  - Directus container (Node.js)
  - PostgreSQL container
  - Nuxt 3 container (Node.js, `nuxt build` output)
  - Nginx container (reverse proxy, SSL termination)
- Create Nginx config:
  - `onenetservers.net` -> Nuxt app
  - `cms.onenetservers.net` -> Directus admin
  - `host.onenetservers.net` -> existing WHMCS (unchanged)
- SSL via Let's Encrypt / Certbot
- PM2 ecosystem file for Nuxt process management

### Task 8.2: CI/CD Pipeline
- GitHub Actions workflow:
  - On push to `main`: lint, type-check, build, deploy to VPS via SSH
  - On push to `staging`: deploy to staging environment
- Environment variable management (`.env.production`)

### Task 8.3: Directus Content Migration
- Write seed scripts to populate Directus with initial content from the current WordPress site:
  - All page content, pricing plans, domain TLD prices, testimonials, FAQs, navigation structure
  - Export images/assets to Directus file storage
- Document the CMS editor workflow for creating new pages with blocks

---

## PHASE 9 — Testing & QA

### Task 9.1: Unit Tests
- Vitest for component unit tests
- Test all composables (especially `useDomainSearch`, `usePricing`)
- Test WHMCS API proxy routes with mocked responses

### Task 9.2: E2E Tests
- Playwright for critical user flows:
  - Homepage loads correctly with all blocks
  - Domain search returns results
  - "Choose this Plan" navigates to correct WHMCS cart URL
  - Navigation dropdowns work
  - Mobile responsive menu works
  - Contact form submits successfully

### Task 9.3: Cross-Browser & Responsive QA
- Test on Chrome, Firefox, Safari, Edge
- Test responsive breakpoints: 375px, 768px, 1024px, 1280px, 1536px
- Verify all blocks render correctly at all breakpoints

---

## Execution Order for Claude Code

1. **Phase 1** — Set up repo, Nuxt, Tailwind, Directus Docker, WHMCS service
2. **Phase 2** — Create all Directus schemas via migrations/scripts
3. **Phase 3.1-3.2** — Build layout + UI primitive components
4. **Phase 3.3** — Build shared components (GoogleRating, PriceDisplay, DomainSearch)
5. **Phase 3.4** — Build all block components + BlockRenderer
6. **Phase 4** — Wire up page routing and dynamic rendering
7. **Phase 5** — WHMCS integration (domain search, cart URLs, SSO)
8. **Phase 6** — Composables and type definitions
9. **Phase 7** — SEO, performance, accessibility
10. **Phase 8** — Docker deployment, Nginx, CI/CD
11. **Phase 9** — Tests and QA
12. **Phase 2 (seed)** — Migrate current site content into Directus

---

## Key WHMCS Endpoints Reference

| WHMCS Action | Purpose | Used By |
|---|---|---|
| `DomainWhois` | Check domain availability | DomainSearchWidget |
| `GetTLDPricing` | Retrieve TLD pricing | Domain pricing pages |
| `GetProducts` | Get hosting product details/pricing | Pricing sync |
| `AddOrder` | Create new order | Cart integration |
| `AddClient` | Register new customer | Registration flow |
| `CreateSsoToken` | Generate auto-login token | Sign-in dropdown |
| `GetClientsDetails` | Retrieve client info | Account management |
| `GetInvoices` | List client invoices | Client area integration |

## External Service URLs (Do Not Change)

| Service | URL |
|---|---|
| WHMCS Client Area | https://host.onenetservers.net/login |
| WHMCS Cart | https://host.onenetservers.net/cart.php |
| WHMCS Knowledgebase | https://host.onenetservers.net/knowledgebase |
| WHMCS Support Ticket | https://host.onenetservers.net/submitticket.php |
| Business eMail Webmail | https://odinson.onenetservers.com:100/ |
| WordPress Cloud Panel | https://kent.onenetservers.com/login |
| Plesk Hosting Panel | https://hank.onenetservers.com:8443/ |
| Reseller Hosting Panel | https://odinson.onenetservers.com:8443/ |
| Network Status | https://host.onenetservers.net/serverstatus.php |
| Google Reviews | https://g.page/r/CdPrQsvgFUmrEB0/review |
