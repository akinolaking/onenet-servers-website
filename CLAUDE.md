# CLAUDE.md — OneNet Servers Website Build
## Master Prompt for Claude Code

---

## 0. WHAT THIS IS

You are building the complete public-facing website for **OneNet Servers**, a web hosting and domain registrar operating in Nigeria (Lagos) and the UK (London), incorporated as **ConqolX Technologies Limited** (UK RC: 14565201 · Nigeria RC: 1775966).

This is a **pure HTML/CSS/Vanilla JS** project. No frameworks, no build tools, no npm. Every file must be a standalone `.html` file that opens directly in a browser. The design system lives in `shared/` and every page `<link>`s to it.

You have been handed:
- `CLAUDE.md` — this file (your complete specification)
- `DESIGN_AUDIT.md` — the 20 UX/conversion fixes you must implement on every page
- `CONTENT.md` — all copy, pricing, USPs, brand voice, and page-by-page content
- `COMPONENTS.md` — every reusable HTML component with exact markup
- `shared/tokens.css` — design tokens (colours, spacing, typography, shadows, radius)
- `shared/components.css` — reusable component styles
- `shared/layout.css` — grid, container, section styles
- `shared/nav.css` — navigation styles
- `shared/footer.css` — footer styles
- `shared/animations.css` — scroll reveals, transitions
- `shared/main.js` — all shared JavaScript (nav, chat, sticky CTA, domain search, FAQ, billing toggle, currency, modals)
- `assets/logo.svg` — the brand logo (already in place, do NOT modify)
- `assets/icons/` — inline SVG icon library
- Page HTML shells — every page exists as a skeleton; you fill the content

---

## 1. BRAND SPECIFICATION

### Colour Palette
```
Primary blue:       #4343F0   (buttons, links, icons, active states)
Blue dark:          #3535C8   (hover states)
Blue light:         #6868F3   (gradients)
Blue extra light:   #EEEEFF   (backgrounds, badges)
Blue extra xs:      #F5F5FF   (page tints)

Ink (headings):     #0F0F1A
Body text:          #3D3D5C
Muted text:         #7878A0
Border/line:        #E4E4F0
Background:         #FFFFFF
Background alt:     #F8F8FD
Background 3:       #F0F0FA

Green (success):    #10B981
Amber (NGN price):  #F59E0B
Red (error):        #EF4444
```

### Typography
- **Primary font:** Inter — weights 300, 400, 500, 600 ONLY. **Never use 700 or 800.**
- **Secondary font:** Lato — weights 300, 400 (italic 300, italic 400). Used for body copy paragraphs, plan descriptions, feature descriptions, testimonials.
- **Monospace:** JetBrains Mono — for prices, code, domain chips, registration numbers.
- Load via Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lato:ital,opsz,wght@0,6..12,300;0,6..12,400;1,6..12,300&family=JetBrains+Mono:wght@400;500&display=swap`

### Logo
The logo is at `../assets/logo.svg` (or `assets/logo.svg` from root). It is the full wordmark with the cloud/server icon. Use it inline via `<img>` or `<object>`. The icon-only mark is the `<path>` elements 2–7 of the SVG (the cloud shape). Never recolour the logo.

### Voice & Tone
- Confident but not arrogant. Direct. Human.
- Never corporate-speak. Never "leverage", "synergy", "cutting-edge".
- Gen Z and Millennial primary audience. They read fast, scan first, read when convinced.
- Nigerian and UK market simultaneously. Naira prices are amber `#F59E0B`. GBP prices are shown as secondary.
- Psychological conversion principles: outcome-first headlines, loss aversion, social proof proximate to price, risk reversal, objection elimination.

---

## 2. THE 20 FIXES — IMPLEMENT ON EVERY RELEVANT PAGE

These are non-negotiable. Every fix must be visible in the delivered HTML.

### Fix 1 — Floating Chat Button
Every page has a fixed chat FAB (floating action button) bottom-right. HTML:
```html
<button class="chat-fab" aria-label="Open live chat" onclick="openChat()">
  <!-- chat icon SVG -->
  <span class="chat-fab-label">Chat with us</span>
</button>
```
On mobile it sits at `bottom: 80px; right: 16px` so it clears the sticky CTA bar.

### Fix 2 — Competitor Comparison Section
Web Hosting, WordPress, VPS, Reseller, and Email pages each have a `<section class="comparison-section">` with a 5-column table: Feature | OneNet | Competitor A | Competitor B | Competitor C. OneNet column is visually highlighted. Competitors are generic ("Popular UK Host", "Budget NG Host") — no brand names.

### Fix 3 — Annual/Monthly Toggle with Savings Badge
Every pricing section (Homepage preview AND all product pages) has the billing toggle visible. The `data-m` and `data-a` attributes on price elements allow `main.js` to swap values. The "Save up to 35%" badge is always visible next to the Annual label.

### Fix 4 — Hero Objection Kill (Micro-copy under CTA)
Every hero CTA button is followed immediately by:
```html
<div class="cta-reassurance">
  <span class="reassurance-item">
    <svg><!-- check icon --></svg> No credit card required
  </span>
  <span class="reassurance-item">
    <svg><!-- check icon --></svg> Cancel anytime
  </span>
  <span class="reassurance-item">
    <svg><!-- check icon --></svg> Free migration included
  </span>
</div>
```

### Fix 5 — Proximate Social Proof Above Pricing
Every pricing section is preceded by a 3-avatar + star rating + quote strip:
```html
<div class="pricing-proof">
  <div class="proof-avatars"><!-- 4 avatar divs --></div>
  <div class="proof-stars">★★★★★</div>
  <p class="proof-quote">"Migrated from Bluehost, load time went from 4s to under 800ms." — Adebola O.</p>
</div>
```

### Fix 6 — How It Works Section
Homepage and all product pages have a 3-step "How it works" section:
- Step 1: Choose your plan
- Step 2: We set up your environment (automated, 2–5 minutes)  
- Step 3: You go live (we support every step)
Use numbered circles, connected by a subtle line, icons per step.

### Fix 7 — Nigerian Market Section (Homepage only)
A dedicated section on the homepage titled "Built for Nigeria. Powered from London." with: naira payment via Paystack, NiRA accreditation, .ng domain specialisation, local support hours, SCUML compliance, Digital Identity Initiative CTA.

### Fix 8 — Sticky CTA Bar on Product Pages
Web Hosting, WordPress, VPS, Reseller, SSL, OneGuard pages each have:
```html
<div class="sticky-cta" id="sticky-cta">
  <div class="sticky-cta-text">
    <strong>Web Hosting from $3.99/mo</strong> · LiteSpeed · CloudLinux · 30-day guarantee
  </div>
  <div class="sticky-cta-actions">
    <a href="#plans" class="btn btn-white btn-sm">See plans</a>
    <a href="/checkout" class="btn btn-primary btn-sm">Get started</a>
  </div>
</div>
```
The bar appears after the user scrolls 600px past the hero. It hides when the footer is visible.

### Fix 9 — Domain Search with Result State
The domain search bar (Homepage hero and Domains page) shows a result state after the user types and hits Search:
- Available: green background, "✓ yourdomain.ng is available — £X/yr" + "Register now" CTA
- Taken: red background, "✗ yourdomain.ng is taken — try yourdomain.com.ng" + alternative suggestions
For the prototype, simulate with JS: domains ending in `.available` show green; all others show "Try these alternatives".

### Fix 10 — Security Trust Badge Strip (Product page heroes)
Every product page hero (below the headline/sub copy, above the CTA) has a horizontal strip of 5 badges:
30-day MBG · Free SSL · NiRA Accredited · SCUML · UK Registered
HTML: `<div class="hero-trust-strip"><div class="trust-badge">...</div></div>`

### Fix 11 — Currency Switcher in Nav
The nav has a compact currency selector: `NGN | GBP | USD`. Selecting one updates all prices on the page via `main.js`. Default is auto-detected from `navigator.language` (en-NG → NGN, en-GB → GBP, else USD).

### Fix 12 — Lottie Animations on "Included Features" Cards
The "What's included" / "All plans include" section uses `<lottie-player>` on the icon of 3 of the 6 cards (alternating). Use public LottieFiles CDN URLs. The lottie-player script is loaded in `<head>`.

### Fix 13 — Exit Intent / Scroll Depth Email Capture
A bottom-of-page floating bar (NOT a modal) appears when the user has scrolled 85% of the page and hasn't started filling in a form:
```html
<div class="exit-bar" id="exit-bar">
  <p>Not ready yet? Get our <strong>free domain transfer checklist</strong>.</p>
  <form class="exit-bar-form">
    <input type="email" placeholder="your@email.com">
    <button type="submit" class="btn btn-primary btn-sm">Send it free</button>
  </form>
  <button class="exit-bar-close">✕</button>
</div>
```

### Fix 14 — Phone Numbers in Footer
Both phone numbers must appear in the footer contact column:
- 🇳🇬 Nigeria: +234 201 330 9154
- 🇬🇧 UK: +44 7333 880 7775
- Email: support@onenetservers.net

### Fix 15 — Future of Productivity Community Section (Homepage)
A section after the DII block promoting the "Future of Productivity" monthly event series. Free to attend. SDG 4, 8, 10 aligned. CTA: "View upcoming events →"

### Fix 16 — Meta Tags / SEO on Every Page
Every HTML file's `<head>` must include:
```html
<meta name="description" content="[page-specific 155 char description]">
<meta property="og:title" content="[Page Title] | OneNet Servers">
<meta property="og:description" content="[same as meta description]">
<meta property="og:image" content="https://onenetservers.net/assets/og-[page].jpg">
<meta property="og:url" content="https://onenetservers.net/[path]">
<link rel="canonical" href="https://onenetservers.net/[path]">
```
Plus FAQPage JSON-LD schema on all product pages, Organization JSON-LD on homepage, BreadcrumbList on all inner pages.

### Fix 17 — Lottie CDN Fallback
Every `<lottie-player>` element has a `<noscript>` fallback image and a static SVG/CSS animation fallback class that activates if the Lottie script fails to load. The script is loaded with `defer` and a `try/catch` wrapper in `main.js`.

### Fix 18 — Comparison Table Mobile Scroll Indicator
The comparison table wrapper has:
```html
<div class="table-scroll-wrap">
  <div class="table-scroll-hint">← Swipe to compare →</div>
  <div class="table-inner"><!-- table --></div>
</div>
```
The hint hides once the user has scrolled the table horizontally.

### Fix 19 — Reseller Page
`hosting/reseller.html` must exist as a full page (not a stub). It includes: hero, how it works (for agencies), 4 plan cards (RSL Starter → RSL Enterprise), white-label feature list, WHMCS billing section, comparison table, testimonial, FAQ, CTA.

### Fix 20 — Client Area / Dashboard Preview
The hero section of the Web Hosting page, WordPress page, and VPS page each include a stylised browser chrome mockup showing a blurred-but-legible screenshot-style illustration of: the Plesk panel (Web Hosting), PanelAlpha (WordPress), or a VPS terminal + stats card (VPS). Built entirely in CSS/HTML — no real screenshots needed.

---

## 3. COMPLETE PAGE LIST

Build ALL of these. No stubs, no "coming soon" pages.

### Root
| File | URL | Title |
|------|-----|-------|
| `index.html` | `/` | Home |
| `about.html` | `/about` | About Us |
| `contact.html` | `/contact` | Contact Us |
| `digital-identity.html` | `/digital-identity` | Digital Identity Initiative |
| `community.html` | `/community` | Future of Productivity |

### Hosting
| File | URL | Title |
|------|-----|-------|
| `hosting/web.html` | `/hosting/web` | Web Hosting |
| `hosting/wordpress.html` | `/hosting/wordpress` | WordPress Hosting |
| `hosting/reseller.html` | `/hosting/reseller` | Reseller Hosting |
| `hosting/vps.html` | `/hosting/vps` | Cloud VPS |

### Domains
| File | URL | Title |
|------|-----|-------|
| `domains/index.html` | `/domains` | Domain Registration |
| `domains/transfer.html` | `/domains/transfer` | Domain Transfer |
| `domains/ng.html` | `/domains/ng` | .NG Domains |

### Security
| File | URL | Title |
|------|-----|-------|
| `security/ssl.html` | `/security/ssl` | SSL Certificates |
| `security/oneguard.html` | `/security/oneguard` | OneGuard Security |

### Email
| File | URL | Title |
|------|-----|-------|
| `email/index.html` | `/email` | Business Email |

### Legal
| File | URL | Title |
|------|-----|-------|
| `legal/terms.html` | `/legal/terms` | Terms of Service |
| `legal/privacy.html` | `/legal/privacy` | Privacy Policy |
| `legal/agreement.html` | `/legal/agreement` | Hosting Agreement |

---

## 4. SHARED FILES — BUILD THESE FIRST

Before touching any page, complete all files in `shared/`:

### `shared/tokens.css`
Already partially written. Complete it with all CSS custom properties. Do not change any values — only add what's missing.

### `shared/components.css`
All reusable component styles: buttons, badges, cards, icon boxes, trust bar, pricing cards, FAQ accordion, comparison table, sticky CTA, chat FAB, exit bar, domain search, billing toggle, hero trust strip, testimonial cards, stat items.

### `shared/layout.css`
Container system, section padding, grid helpers, responsive breakpoints:
- Mobile: `< 480px`
- Tablet: `480px – 768px`  
- Laptop: `768px – 1024px`
- Desktop: `1024px – 1280px`
- Wide: `> 1280px`

### `shared/nav.css`
Navigation: fixed, transparent → frosted glass on scroll. Mobile: hamburger → full-screen drawer. Currency selector. All hover/active states.

### `shared/footer.css`
5-column footer grid, brand column, social icons, legal strip, responsive collapse.

### `shared/animations.css`
`.reveal` class: opacity 0 → 1, translateY 24px → 0. Stagger delay classes `.d1`–`.d6`. Lottie floating animation. Trust bar scroll animation. Badge pulse.

### `shared/main.js`
One JS file, zero dependencies. Implements:
1. Nav scroll behaviour (transparent → stuck)
2. Mobile menu open/close
3. Currency switcher (NGN/GBP/USD) — updates all `[data-ngn]`, `[data-gbp]`, `[data-usd]` elements
4. Billing toggle (monthly/annual) — updates all `[data-m]`, `[data-a]` elements
5. Scroll reveal (IntersectionObserver)
6. Sticky CTA bar (appears at 600px scroll, hides when footer visible)
7. Chat FAB click handler (opens Crisp or logs placeholder)
8. Domain search result simulation
9. FAQ accordion
10. Comparison table scroll hint
11. Exit/scroll-depth bar (fires at 85% scroll depth, once per session via sessionStorage)
12. Pricing tab switcher (homepage preview)
13. Mobile menu
14. Smooth anchor scrolling

---

## 5. PAGE-BY-PAGE SECTION SPECIFICATION

### index.html (Homepage)

**Sections in order:**
1. `<nav>` — shared nav with currency switcher
2. `#hero` — Split layout: left (badge, H1, sub, domain search, micro-copy reassurance, social proof row), right (browser chrome card with stats + Lottie)
3. `#trust-bar` — scrolling trust strip
4. `#services` — service cards grid (WP featured wide, Domain, Web Hosting, Email, VPS, Reseller — 2×3)
5. `#how-it-works` — 3-step process (Fix 6)
6. `#why` — split: Lottie left, 5 feature items right
7. `#pricing` — tab switcher preview + 4 plan cards + billing toggle (Fix 3) + proximate social proof (Fix 5)
8. `#nigeria` — Nigerian market section (Fix 7)
9. `#dii` — Digital Identity Initiative card
10. `#community` — Future of Productivity (Fix 15)
11. `#credentials` — Stats + 4 credential cards
12. `#testimonials` — 3 testimonial cards
13. `#cta-banner` — full-width gradient CTA
14. `<footer>` — shared footer with phone numbers (Fix 14)
15. `.chat-fab` — floating chat (Fix 1)
16. `.exit-bar` — scroll depth email capture (Fix 13)

**Hero H1:** `Your domain.<br>Your identity.<br><em class="h-em">Your world online.</em>`
**Hero sub (Lato 300):** "Web hosting, domains, email, and AI tools for the generation building Africa's digital future — from Lagos to London."

---

### hosting/web.html (Web Hosting)

**Sections in order:**
1. `<nav>`
2. `#hero` — centred hero: badge, H1, sub, hero-trust-strip (Fix 10), CTA + reassurance (Fix 4), wh-stats bar (99.9% · <800ms · 9 Regions · 30-day MBG), browser chrome mockup (Fix 20)
3. `#trust-bar`
4. `#plans` — billing toggle (Fix 3) + proximate social proof (Fix 5) + 4 plan cards (Starter, Lite, Premium★, Ultimate)
5. `#included` — 6 "What's included" cards, 3 with Lottie (Fix 12)
6. `#how-it-works` — 3 steps (Fix 6)
7. `#comparison` — competitor comparison table (Fix 2) + mobile scroll hint (Fix 18)
8. `#testimonials` — 2 testimonials
9. `#faq` — 6 FAQ items with accordion
10. `#cta-banner`
11. `<footer>` (Fix 14)
12. `.sticky-cta` "Web Hosting from $3.99/mo" (Fix 8)
13. `.chat-fab` (Fix 1)
14. `.exit-bar` (Fix 13)

**Hero H1:** `Web hosting that actually <em class="h-em">performs.</em>`

**4 Plans:**
| Plan | USD/mo | NGN/mo | GBP/mo | Sites | SSD | BW | Email |
|------|--------|--------|--------|-------|-----|-----|-------|
| Starter | $3.99 | ₦7,499 | £3.71 | 2 | 10GB | 25GB | 10 |
| Lite | $9.75 | ₦13,999 | £9.07 | 3 | 30GB | 25GB | 10 |
| Premium★ | $18.20 | ₦24,999 | £16.95 | 7 | 50GB | 55GB | 10 |
| Ultimate | $32.50 | ₦44,999 | £30.24 | 15 | 100GB | 100GB | 25 |

Annual savings: 35% on Lite, Premium, Ultimate. 2% on Starter (3-month only).

**Included features (6 cards):**
1. Free SSL Certificate (Lottie: shield animation)
2. Daily Automated Backups
3. ImmunifyAV+ Malware Scanning (Lottie: security scan animation)
4. LiteSpeed + CloudLinux
5. Plesk Control Panel
6. Free Domain Migration (Lottie: migration animation)

**Comparison table columns:** Feature | OneNet Starter | OneNet Premium | Budget NG Host | Popular UK Host
**Rows:** Price/mo, CloudLinux isolation, LiteSpeed, ImmunifyAV+, Free migration, Free SSL, Plesk panel, Support response, 30-day MBG

---

### hosting/wordpress.html (WordPress Hosting)

**Sections in order:**
1. `<nav>`
2. `#hero` — hero-trust-strip, H1, sub, CTA + reassurance, browser chrome mockup showing PanelAlpha (Fix 20)
3. `#trust-bar`
4. `#plans` — billing toggle + 4 WP plan cards
5. `#ai-builder` — dedicated section for the AI website builder feature (Lottie of website being built)
6. `#included` — 6 cards (Docker isolation, PanelAlpha panel, AI Builder, Staging, LiteSpeed, Daily backup)
7. `#how-it-works` — 3 steps: Choose template → AI builds your site → Go live in minutes
8. `#comparison` (Fix 2)
9. `#testimonials`
10. `#faq`
11. `#cta-banner`
12. `<footer>` (Fix 14)
13. `.sticky-cta` "WordPress Hosting from $6.78/mo" (Fix 8)
14. `.chat-fab` (Fix 1)
15. `.exit-bar` (Fix 13)

**Hero H1:** `WordPress hosting that <em class="h-em">thinks ahead.</em>`

**4 Plans:**
| Plan | USD/mo | NGN/mo | Instances | SSD | CPU | RAM |
|------|--------|--------|-----------|-----|-----|-----|
| WP Starter | $6.78 | ₦10,500 | 1 | 10GB | 1vCPU | 2GB |
| WP Lite | $13.65 | ₦19,999 | 1 | 25GB | 1vCPU | 2GB |
| WP Premium★ | $52.49 | ₦74,999 | 5 | 100GB | 2vCPU | 6GB |
| WP Ultimate | $105.00 | ₦149,999 | 10 | 200GB | 2vCPU | 8GB |

---

### hosting/reseller.html (Reseller Hosting)

**Sections in order:**
1. `<nav>`
2. `#hero` — audience: agencies, freelancers, developers. Hero trust strip. H1, sub, CTA + reassurance
3. `#trust-bar`
4. `#for-who` — 3 audience cards: "You run a web agency", "You manage 10+ client sites", "You want your own hosting brand"
5. `#plans` — billing toggle + 4 RSL plan cards
6. `#white-label` — white-label features section (private nameservers, your own brand, WHMCS billing, mobile billing app)
7. `#how-it-works` — 3 steps: Pick your plan → Brand it as yours → Manage all clients from one dashboard
8. `#included` — 6 cards (Fix 12)
9. `#comparison` (Fix 2)
10. `#faq`
11. `#cta-banner`
12. `<footer>` (Fix 14)
13. `.sticky-cta` "Reseller Hosting from $5.39/mo" (Fix 8)
14. `.chat-fab` (Fix 1)
15. `.exit-bar` (Fix 13)

**Hero H1:** `Your hosting brand.<br><em class="h-em">Fully yours.</em>`

**4 Plans:**
| Plan | USD/mo | NGN/mo | Storage | Sites | Email |
|------|--------|--------|---------|-------|-------|
| RSL Starter | $5.39 | ₦8,999 | 50GB | Unlimited | Unlimited |
| RSL Lite | $14.30 | ₦22,999 | 100GB | Unlimited | Unlimited |
| RSL Grow★ | $20.28 | ₦31,999 | 150GB | Unlimited | Unlimited |
| RSL Enterprise | $28.60 | ₦44,999 | 200GB | Unlimited | Unlimited |

---

### hosting/vps.html (Cloud VPS)

**Sections in order:**
1. `<nav>`
2. `#hero` — terminal/server visual (Fix 20), hero trust strip, H1, sub, CTA + reassurance
3. `#trust-bar`
4. `#plans` — billing toggle + 4 VPS plan cards
5. `#one-click` — one-click app deploy grid: n8n, Docker, Wireguard, Nextcloud, Gitlab, LAMP, OpenLiteSpeed, Coolify — shown as icon+name tiles
6. `#regions` — world map SVG or grid showing 9 regions with latency indicators
7. `#specs` — detailed specs comparison table (Fix 2 + Fix 18)
8. `#how-it-works` — 3 steps: Choose OS + region → Server provisioned in 60 seconds → Full root access
9. `#faq`
10. `#cta-banner`
11. `<footer>` (Fix 14)
12. `.sticky-cta` "Cloud VPS from $12.42/mo" (Fix 8)
13. `.chat-fab` (Fix 1)
14. `.exit-bar` (Fix 13)

**Hero H1:** `Cloud VPS with <em class="h-em">unlimited bandwidth.</em>`

**4 Plans:**
| Plan | USD/mo | NGN/mo | RAM | vCPU | SSD | Port | Snapshots |
|------|--------|--------|-----|------|-----|------|-----------|
| VPS Starter | $12.42 | ₦19,999 | 8GB | 4 | 150GB | 200Mbit | 1 |
| VPS Lite | $29.11 | ₦44,999 | 24GB | 8 | 400GB | 600Mbit | 3 |
| VPS Premium★ | $43.61 | ₦67,999 | 48GB | 12 | 500GB | 800Mbit | 5 |
| VPS Ultimate | $92.15 | ₦139,999 | 96GB | 18 | 700GB | 1Gbit | Unlimited |

Supported OS: Ubuntu · Debian · AlmaLinux · CentOS · Rocky Linux  
Add-ons: Windows Server (+£20/mo) · Managed service (+£30/mo) · Additional IP (+£6/mo)

---

### domains/index.html (Domain Registration)

**Sections in order:**
1. `<nav>`
2. `#hero` — large domain search bar centred (Fix 9 with full result state), H1, sub, CTA
3. `#tld-grid` — TLD pricing grid: cards for each extension with register price and transfer price
4. `#ng-feature` — .NG domain specialisation section (NiRA accreditation story)
5. `#included` — What every domain includes: WHOIS privacy, DNSSEC, DNS management, email forwarding, URL redirect, free lock
6. `#how-it-works` — 3 steps: Search → Add to cart → Instant activation
7. `#faq`
8. `#cta-banner`
9. `<footer>` (Fix 14)
10. `.chat-fab` (Fix 1)
11. `.exit-bar` (Fix 13)

**Hero H1:** `Find your domain.<br><em class="h-em">Own your identity.</em>`

**TLD Pricing Grid (from live store data):**
| Extension | Register | Renew | Transfer | Notes |
|-----------|----------|-------|----------|-------|
| .com | $15.00 | $15.00 | $15.00 | |
| .ng | $23.40 | $23.40 | $23.40 | NiRA |
| .com.ng | $11.25 | $11.25 | $11.25 | NiRA |
| .co.uk | $8.12 | $8.12 | $8.12 | |
| .uk | $8.12 | $8.12 | $8.12 | |
| .ai | $95.24 | $95.24 | $95.24 | |
| .dev | $19.04 | $19.04 | $19.04 | |
| .io | $44.44 | $44.44 | $44.44 | |
| .shop | $4.99 | $4.99 | $4.99 | |
| .cloud | $6.99 | $6.99 | $6.99 | |
| .xyz | $3.42 | $3.42 | $3.42 | Cheapest |
| .online | $3.80 | $3.80 | $3.80 | |
| .name.ng | $0.00 | $1.00 | N/A | DII only |
| .tech | $10.79 | $10.79 | $10.79 | |
| .me | $12.69 | $12.69 | $12.69 | |
| .net | $15.05 | $15.05 | $15.05 | |
| .org | $13.58 | $13.58 | $13.58 | |

---

### domains/transfer.html (Domain Transfer)

**Sections in order:**
1. `<nav>`
2. `#hero` — H1: "Transfer your domain. Get a free year." Sub: answer-first paragraph (40–60 words). Loss aversion line. Transfer form (domain input + EPP code + checkbox + CTA).
3. `#how-it-works` — 4-step HowTo (HowTo schema): Unlock domain → Get EPP code → Enter here → We handle migration
4. `#what-included` — What you get: free renewal year, zero downtime, DNS migration, WHOIS privacy, DNSSEC, NiRA (for .ng)
5. `#tld-list` — Transferable TLDs table with timelines (.ng = up to 14 days, .name.ng = non-transferable)
6. `#faq` — 7 questions (from the content spec in CONTENT.md)
7. `#cta-banner`
8. `<footer>` (Fix 14)
9. `.chat-fab` (Fix 1)

**Hero H1:** `Transfer your domain.<br><em class="h-em">Get a free year.</em>`

**Loss aversion copy (place below the form):**
"Your current registrar will charge full renewal price. A transfer costs the same — and adds a free year."

---

### security/ssl.html (SSL Certificates)

**Sections in order:**
1. `<nav>`
2. `#hero` — H1: "Every site deserves HTTPS." Sub. Hero trust strip. CTA + reassurance.
3. `#trust-bar`
4. `#ssl-types` — 3 SSL type cards: Domain Validation (DV), Organisation Validation (OV), Extended Validation (EV). Each with: use case, issuance time, trust level visual, price.
5. `#free-ssl` — Section explaining the free Let's Encrypt SSL included on all hosting plans
6. `#how-it-works` — 3 steps
7. `#what-included` — What the SSL includes: 256-bit encryption, browser padlock, Google ranking boost, phishing protection
8. `#faq` — 5 questions
9. `#cta-banner`
10. `<footer>` (Fix 14)
11. `.sticky-cta` (Fix 8)
12. `.chat-fab` (Fix 1)

**SSL Pricing:**
| Type | Cert | Price/yr | Issuance | Warranty |
|------|------|----------|----------|---------|
| Free | Let's Encrypt DV | Included with all hosting | Minutes | — |
| Standard DV | Single domain | $9.99/yr | Minutes | $10K |
| Wildcard DV | All subdomains | $49.99/yr | Minutes | $10K |
| OV Standard | Organisation validated | $79.99/yr | 1–3 days | $1.25M |
| EV Certificate | Green bar / full validation | $149.99/yr | 3–5 days | $1.75M |

---

### security/oneguard.html (OneGuard Security)

**Sections in order:**
1. `<nav>`
2. `#hero` — Dark-tinted hero section (exception to light theme — hero only has a near-black background `#0F0F1A` with blue accents). H1: "Complete website security. One subscription."
3. `#trust-bar`
4. `#what-is` — What OneGuard is: explanation section, key features list
5. `#features` — 6 feature cards: Real-time malware scan, Daily automated backup, Vulnerability patching, DDoS protection, Blacklist monitoring, SSL certificate monitoring
6. `#how-it-works` — 3 steps
7. `#pricing` — Single plan card: OneGuard at $466.70/yr (£432/yr · ₦699,999/yr) — annual only
8. `#comparison` — OneGuard vs. No protection vs. Competitor security tool (Fix 2)
9. `#faq`
10. `#cta-banner`
11. `<footer>` (Fix 14)
12. `.sticky-cta` "Protect your site for $466.70/yr" (Fix 8)
13. `.chat-fab` (Fix 1)

**Hero H1:** `Complete website security.<br><em style="color:#6868F3">One subscription.</em>`
**OneGuard price:** $466.70/yr · £432/yr · ₦699,999/yr (annual only, no monthly option)

---

## 6. NAVIGATION SPECIFICATION

### Desktop Nav (sticky, frosted glass after 60px scroll)
```
[Logo] [Domains ▾] [Hosting ▾] [Email] [Security ▾] [Community] ... [NGN|GBP|USD] [Log in] [Get started]
```

**Domains dropdown:**
- Register a Domain
- Transfer a Domain  
- .NG Domains
- Domain Transfer

**Hosting dropdown (3 columns):**
- Col 1 — Shared: Web Hosting, WordPress Hosting, Reseller Hosting
- Col 2 — Email & Tools: Business Email, Web Design (coming)
- Col 3 — Infrastructure: Cloud VPS, Garium AI (coming)

**Security dropdown:**
- OneGuard Security
- SSL Certificates

### Mobile Nav
- Hamburger at 768px → full-height right drawer
- Accordion for dropdowns
- Currency selector at bottom of drawer
- Two CTA buttons (Log in ghost, Get started primary) at bottom

---

## 7. FOOTER SPECIFICATION

**5 columns:**

**Col 1 — Brand**
- Logo (img, 28px height)
- Tagline: "AI-powered hosting, domains, and email for businesses building Africa's digital future — from Lagos to London."
- Social icons: X, LinkedIn, Instagram, YouTube (SVG, 13px, ghost square buttons)

**Col 2 — Hosting**
- Web Hosting
- WordPress Hosting
- Reseller Hosting
- Cloud VPS
- Garium Private AI

**Col 3 — Domains**
- Register a Domain
- Transfer a Domain
- .NG Domains
- .COM.NG
- TLD Pricing

**Col 4 — Tools & Security**
- Business Email
- SSL Certificates
- OneGuard Security
- Web Design
- Future of Productivity

**Col 5 — Company & Contact**
- About Us
- Contact Us
- Digital Identity Initiative
- **🇳🇬 +234 201 330 9154**   ← Fix 14
- **🇬🇧 +44 7333 880 7775**   ← Fix 14
- **support@onenetservers.net**

**Trust badge row (between columns and legal strip):**
NiRA Accredited | UK RC:14565201 | NG RC:1775966 | SCUML Registered | Green Infrastructure | Tech Nation

**Legal strip:**
"© 2026 OneNet Servers — trading name of ConqolX Technologies Limited. Registered in England & Wales No. 14565201. Registered in Nigeria No. 1775966. SCUML registered. NiRA accredited. Prices shown exclude applicable VAT. Renewal prices may differ from first-term prices."

---

## 8. SCHEMA / JSON-LD (inject in `<head>` of each page)

### Homepage (`index.html`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "OneNet Servers",
      "url": "https://onenetservers.net",
      "logo": "https://onenetservers.net/assets/logo.svg",
      "sameAs": ["https://twitter.com/onenetservers","https://linkedin.com/company/onenetservers"],
      "contactPoint": [
        { "@type": "ContactPoint", "telephone": "+2342013309154", "contactType": "customer support", "areaServed": "NG" },
        { "@type": "ContactPoint", "telephone": "+447333880775", "contactType": "customer support", "areaServed": "GB" }
      ]
    },
    {
      "@type": "WebSite",
      "url": "https://onenetservers.net",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://onenetservers.net/domains?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
```

### Product pages — add FAQPage schema
Build from the FAQ items in each page section. Each page has a `<script type="application/ld+json">` block with the FAQPage schema listing all Q&A pairs.

### Domain Transfer page — add HowTo schema
4-step HowTo for the transfer process.

---

## 9. LOTTIE ANIMATIONS

Load the player once in `<head>`:
```html
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" defer></script>
```

Use these public CDN URLs:
| Purpose | URL |
|---------|-----|
| Server/cloud animation | `https://assets6.lottiefiles.com/packages/lf20_qp1q7mct.json` |
| Globe/domain animation | `https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json` |
| Shield/security animation | `https://assets9.lottiefiles.com/packages/lf20_w51pcehl.json` |
| Server rack animation | `https://assets5.lottiefiles.com/packages/lf20_sy6bevyc.json` |
| Celebration/DII animation | `https://assets3.lottiefiles.com/packages/lf20_qp1q7mct.json` |

Every `<lottie-player>` must have `background="transparent"`, `speed="0.85"`, `loop`, `autoplay`, and a wrapping `<div>` with explicit width/height. Apply Fix 17 fallbacks.

---

## 10. REFERENCE DESIGN — WHAT TO MATCH

The existing `onenet-site.html` in the outputs folder is the **reference design**. Match:
- The exact colour palette, spacing scale, and typography hierarchy
- The card hover lift effect (`transform: translateY(-3px)` + shadow increase)
- The trust bar scrolling animation
- The billing toggle behaviour
- The FAQ accordion

**Do NOT match:**
- The previous design did NOT have: sticky CTA bars, chat FAB, currency switcher, domain result states, exit bar, comparison tables, Nigerian market section, Future of Productivity section, phone numbers in footer, hero trust strips, hero reassurance micro-copy, proximate social proof above pricing, or working Lottie fallbacks.
These are the 20 fixes. They are NEW additions to what exists.

---

## 11. FILE NAMING & PATH CONVENTIONS

```
/index.html                      → base URL /
/about.html                      → /about
/contact.html                    → /contact
/digital-identity.html           → /digital-identity
/community.html                  → /community
/hosting/web.html                → /hosting/web
/hosting/wordpress.html          → /hosting/wordpress
/hosting/reseller.html           → /hosting/reseller
/hosting/vps.html                → /hosting/vps
/domains/index.html              → /domains
/domains/transfer.html           → /domains/transfer
/domains/ng.html                 → /domains/ng
/email/index.html                → /email
/security/ssl.html               → /security/ssl
/security/oneguard.html          → /security/oneguard
/legal/terms.html                → /legal/terms
/legal/privacy.html              → /legal/privacy
/legal/agreement.html            → /legal/agreement
/shared/tokens.css               → design tokens
/shared/components.css           → component styles
/shared/layout.css               → grid + containers
/shared/nav.css                  → navigation
/shared/footer.css               → footer
/shared/animations.css           → reveals + transitions
/shared/main.js                  → all JavaScript
/assets/logo.svg                 → brand logo (already exists)
/assets/icons/                   → SVG icon files
/assets/lottie/                  → .lottie fallback files (optional)
```

All internal `<link>` and `<script>` paths use **root-relative paths** (`/shared/tokens.css`) NOT relative paths (`../../shared/tokens.css`). This ensures consistency regardless of nesting depth.

Each page's `<head>` `<link rel="stylesheet">` block order:
1. Google Fonts
2. `/shared/tokens.css`
3. `/shared/layout.css`
4. `/shared/components.css`
5. `/shared/nav.css`
6. `/shared/footer.css`
7. `/shared/animations.css`
8. (optional) page-specific inline `<style>` block for anything unique

---

## 12. BUILD ORDER

Execute in this exact order to avoid dependency issues:

1. `shared/tokens.css` — complete the existing file
2. `shared/layout.css` — build fresh
3. `shared/components.css` — build fresh
4. `shared/nav.css` — build fresh
5. `shared/footer.css` — build fresh
6. `shared/animations.css` — build fresh
7. `shared/main.js` — build fresh (all 13 functions listed in Section 4)
8. `index.html` — Homepage (reference page, build first, used as visual benchmark)
9. `hosting/web.html` — Web Hosting
10. `hosting/wordpress.html` — WordPress Hosting
11. `hosting/reseller.html` — Reseller Hosting
12. `hosting/vps.html` — Cloud VPS
13. `domains/index.html` — Domain Registration
14. `domains/transfer.html` — Domain Transfer
15. `domains/ng.html` — .NG Domains
16. `email/index.html` — Business Email
17. `security/ssl.html` — SSL Certificates
18. `security/oneguard.html` — OneGuard Security
19. `about.html` — About Us
20. `contact.html` — Contact Us
21. `digital-identity.html` — Digital Identity Initiative
22. `community.html` — Future of Productivity
23. `legal/terms.html`, `legal/privacy.html`, `legal/agreement.html`

---

## 13. QUALITY GATES

Before considering any page "done", verify:

- [ ] All 20 fixes implemented on the page (check the relevant subset per page)
- [ ] All prices are correct and match Section 5 tables
- [ ] Phone numbers appear in footer: +234 201 330 9154 and +44 7333 880 7775
- [ ] Currency switcher works (NGN/GBP/USD)
- [ ] Billing toggle works (Monthly/Annual) where applicable
- [ ] FAQ accordion opens/closes correctly
- [ ] Sticky CTA bar appears after 600px scroll on product pages
- [ ] Chat FAB is present and positioned correctly
- [ ] Exit bar fires at 85% scroll, dismissible, once per session
- [ ] Hero CTA has reassurance micro-copy directly below it
- [ ] Pricing section has proximate social proof above it
- [ ] Mobile responsive: 375px, 768px, 1024px, 1280px — no horizontal overflow
- [ ] No placeholder text left in the file (no "Lorem ipsum", no "[PLACEHOLDER]")
- [ ] JSON-LD schema present and valid
- [ ] Canonical URL and OG meta tags present
- [ ] Logo renders correctly (img src="/assets/logo.svg")
- [ ] Lottie animations have fallback divs
- [ ] Comparison table has mobile scroll hint
- [ ] Domain search result state implemented (domains page + homepage)

---

## 14. DO NOT

- Do NOT use any JavaScript framework (React, Vue, Alpine, etc.)
- Do NOT use any CSS framework (Tailwind, Bootstrap, etc.)
- Do NOT install any npm packages
- Do NOT use emoji in UI text (SVG icons only)
- Do NOT use `font-weight: 700` or `font-weight: 800` — maximum is `600`
- Do NOT hard-code colours — always use CSS custom properties from tokens.css
- Do NOT use relative import paths — always use root-relative (`/shared/...`)
- Do NOT name competitors by brand name in comparison tables
- Do NOT fabricate testimonials with invented names — use the 3 provided in Section 5
- Do NOT leave any stub pages — every page must be complete
- Do NOT use `px` for font sizes in media queries — use `rem` or `em`
- Do NOT break the existing `onenet-site.html` design language — extend it, don't replace it

---

## 15. FINAL DELIVERY

When all pages are built, create a `README.md` in the root with:
1. Complete file tree
2. How to run locally (just open index.html in a browser — no server needed)
3. How to deploy (any static host: Netlify, Vercel, Cloudflare Pages, or direct to server)
4. How to update prices (search for `data-m`, `data-a`, `data-ngn`, `data-gbp`, `data-usd` attributes)
5. How to add a new page (copy the closest existing page, update head meta, update nav active state)
6. Browser support targets (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, Chrome Android 90+, Safari iOS 14+)

---

*End of CLAUDE.md — OneNet Servers Website Build Specification v1.0*
*Prepared for handover to Claude Code — March 2026*
*All content, pricing, and brand information verified against live store and project knowledge base.*
