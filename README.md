# OneNet Servers — Website Project

**onenetservers.net** — Pure HTML/CSS/Vanilla JS static site.  
No build tools. No frameworks. No npm. Open any file in a browser.

---

## Project Files for Claude Code

| File | Purpose |
|------|---------|
| `CLAUDE.md` | **START HERE** — complete build specification, all 20 UX fixes, every page spec, quality gates, do-nots |
| `CONTENT.md` | All copy, pricing, USPs, FAQs, testimonials — verbatim source of truth |
| `COMPONENTS.md` | Every reusable HTML component with canonical markup |
| `shared/main.js` | All JavaScript — 13 functions, fully commented |
| `shared/tokens.css` | Design tokens (partial — Claude Code completes) |
| `assets/logo.svg` | Brand logo — do not modify |

---

## Folder Structure (target state after Claude Code builds)

```
onenet-servers/
├── CLAUDE.md                    ← master spec
├── CONTENT.md                   ← all copy
├── COMPONENTS.md                ← component markup
├── README.md                    ← this file
│
├── index.html                   ← Homepage
├── about.html                   ← About Us
├── contact.html                 ← Contact Us
├── digital-identity.html        ← Digital Identity Initiative
├── community.html               ← Future of Productivity
│
├── hosting/
│   ├── web.html                 ← Web Hosting
│   ├── wordpress.html           ← WordPress Hosting
│   ├── reseller.html            ← Reseller Hosting
│   └── vps.html                 ← Cloud VPS
│
├── domains/
│   ├── index.html               ← Domain Registration
│   ├── transfer.html            ← Domain Transfer
│   └── ng.html                  ← .NG Domains
│
├── email/
│   └── index.html               ← Business Email
│
├── security/
│   ├── ssl.html                 ← SSL Certificates
│   └── oneguard.html            ← OneGuard Security
│
├── legal/
│   ├── terms.html
│   ├── privacy.html
│   └── agreement.html
│
├── shared/
│   ├── tokens.css               ← design tokens (partially written)
│   ├── components.css           ← all component styles
│   ├── layout.css               ← grid + containers
│   ├── nav.css                  ← navigation
│   ├── footer.css               ← footer
│   ├── animations.css           ← scroll reveals
│   └── main.js                  ← all JavaScript (complete)
│
└── assets/
    ├── logo.svg                 ← brand logo (in place)
    ├── icons/                   ← SVG icon files
    └── lottie/                  ← local lottie fallbacks (optional)
```

---

## How to Run Locally

1. Open `index.html` directly in any modern browser.
2. For correct root-relative paths (`/shared/...`), serve from a local server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`

---

## How to Deploy

**Netlify (recommended):**
1. Drag the `onenet-servers/` folder into netlify.com/drop
2. Or connect GitHub repo → auto-deploy on push

**Cloudflare Pages:**
1. Connect repo → build command: none → publish directory: `.`

**Direct to server:**
1. Upload all files to `public_html/` on hosting
2. Set the `.htaccess` redirect rules for clean URLs (optional):

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^.]+)$ $1.html [NC,L]
```

---

## How to Update Prices

All prices are controlled in two places:

1. **`shared/main.js`** — `PRICES` constant object at the top of the file.  
   Update the `usd_m`, `usd_a`, `gbp_m`, `gbp_a`, `ngn_m`, `ngn_a` values per plan.

2. **HTML price elements** — Every `<span class="plan-num">` has `data-plan` on its parent  
   `.plan-card`. The `updateAllPrices()` function reads from the `PRICES` object.

For simple one-off changes, search `data-plan="wh_premium"` and update the span content directly.

---

## How to Add a New Page

1. Copy the closest existing page (e.g. copy `hosting/web.html` for a new hosting product)
2. Update `<title>`, `<meta name="description">`, `<link rel="canonical">` and OG tags in `<head>`
3. Update the active nav link: add `nav-link--active` class to the correct nav item OR let `main.js` `initActiveNav()` handle it automatically from the URL path
4. Update `sticky-cta` text if it's a product page
5. Update the JSON-LD schema block

---

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+ |
| Firefox | 88+ |
| Safari  | 14+ |
| Edge    | 90+ |
| Chrome Android | 90+ |
| Safari iOS | 14+ |

IE11 is not supported. No polyfills needed.

---

## Brand Quick Reference

| Token | Value |
|-------|-------|
| Primary blue | `#4343F0` |
| Max font weight | `600` (semibold) |
| Primary font | Inter |
| Body font | Lato |
| Mono font | JetBrains Mono |
| NG phone | +234 201 330 9154 |
| UK phone | +44 7333 880 7775 |
| Support email | support@onenetservers.net |
| UK company no. | 14565201 |
| NG company no. | 1775966 |

---

## The 20 Fixes — Quick Checklist

Every product page must have:
- [ ] Fix 1: `.chat-fab` floating chat button
- [ ] Fix 2: Competitor comparison table (`.comparison-section`)
- [ ] Fix 3: Billing toggle with Save badge
- [ ] Fix 4: CTA reassurance micro-copy (`.cta-reassurance`)
- [ ] Fix 5: Proximate social proof above pricing (`.pricing-proof`)
- [ ] Fix 6: How it works section
- [ ] Fix 7: Nigerian market section (homepage only)
- [ ] Fix 8: Sticky CTA bar (`.sticky-cta`)
- [ ] Fix 9: Domain search with result states (homepage + domains page)
- [ ] Fix 10: Hero trust strip (`.hero-trust-strip`)
- [ ] Fix 11: Currency switcher in nav
- [ ] Fix 12: Lottie on "included" feature cards
- [ ] Fix 13: Exit bar at 85% scroll
- [ ] Fix 14: Phone numbers in footer
- [ ] Fix 15: Future of Productivity section (homepage)
- [ ] Fix 16: Meta tags + JSON-LD schema
- [ ] Fix 17: Lottie fallback divs
- [ ] Fix 18: Table scroll hint on mobile
- [ ] Fix 19: Reseller page (full, not stub)
- [ ] Fix 20: Browser chrome mockup in product hero

---

*OneNet Servers — onenetservers.net*  
*ConqolX Technologies Limited — UK RC:14565201 · Nigeria RC:1775966*
