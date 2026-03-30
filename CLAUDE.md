# CLAUDE.md — OneNet Servers Website Build
## Master Specification v2.0 — March 2026

---

## 0. WHAT THIS IS

You are building the complete public-facing website for **OneNet Servers**, a web hosting and domain registrar incorporated as **ConqolX Technologies Limited** (UK RC: 14565201 · Nigeria RC: 1775966).

**This is the consolidated global website.** It replaces two regional sites (onenetservers.net for Nigeria, onenetservers.co.uk for UK) with a single, globally-positioned destination serving NGN, GBP, and USD audiences without regional lock-in.

**The standard you must match:** GoDaddy, SiteGround, Hostinger, and one.com. These companies have invested years in brand, copy, UX, conversion, and audience understanding. Every page of this site must be at that quality level — no typos, no placeholder copy, no half-built sections.

**Stack:** Pure HTML/CSS/Vanilla JS. No frameworks, no build tools, no npm. Every file is a standalone `.html` that opens directly in a browser. The design system lives in `shared/` and every page `<link>`s to it.

**WHMCS Integration:** WHMCS lives in the same `public_html` directory. `index.php` redirects to `index.html`. All CTAs link directly to `/cart.php`, `/login.php`, `/clientarea.php` — same domain, no redirect trust break.

---

## 1. BRAND SPECIFICATION

### Brand Name
Always written as: **OneNet Servers** — two words, capital O, capital S, capital N. Never "Onenet", never "onenet servers", never "OneNet servers".

### Positioning Statement
**Global presence. Nigerian roots. London registered. Built for every builder.**

OneNet Servers is not a regional hosting company that happens to serve two markets. It is a globally-positioned hosting provider with deep roots in Nigeria and the UK, built for any builder anywhere — with specific structural advantages for Nigerian and UK customers.

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
- **Primary font:** Inter — weights 300, 400, 500, 600 ONLY. Never 700 or 800.
- **Secondary font:** Lato — weights 300, 400 (italic 300, italic 400). Body copy, plan descriptions, testimonials.
- **Monospace:** JetBrains Mono — prices, code, domain chips, registration numbers.
- Load via Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lato:ital,opsz,wght@0,6..12,300;0,6..12,400;1,6..12,300&family=JetBrains+Mono:wght@400;500&display=swap`

### Logo
At `../assets/logo.svg` (or `/assets/logo.svg` from root). Use via `<img>`. Never recolour.

### Voice & Tone
- **Confident, not arrogant.** Direct. Human. Never corporate.
- **No filler words:** "incredibly", "cutting-edge", "leverage", "synergy", "solution", "seamless" — banned.
- **Outcome-first:** Lead with what the customer gets, not what the product does.
- **Short sentences.** One idea per sentence.
- **No adverbs:** "incredibly fast" → "fast". "highly reliable" → "99.9% uptime SLA".
- **UK English spelling:** colour, organisation, recognised, centre, optimise.
- **Address reader as "you"/"your".** Company is "we" or "OneNet Servers".
- **Every CTA is verb + noun:** "Get started free", "See all plans", "Start building", "Find your domain".
- **Audience:** Gen-Z and Millennial primary. They scan first, read when convinced. Front-load value.
- **Multi-market:** Nigeria and UK named explicitly. Global audience implicit.
- **Zero typos. Zero.** Every word proofread before the file is considered done.

---

## 2. THE COMPETITOR STANDARD

These four sites are the benchmark. Study them. Match them.

### GoDaddy (godaddy.com)
- **What they do well:** Scale trust (133,226 reviews), functional copy, feature-forward messaging, depth of product range
- **What to beat:** Their copy is cold and corporate. OneNet Servers is warmer and more human.
- **Borrow:** Price-led entry CTAs, 30-day MBG on every card, clear feature exclusion per tier

### SiteGround (siteground.com)
- **What they do well:** Premium positioning, "real humans" support claim, technical credibility, expert social proof, "Web hosting & beyond" ambition
- **What to beat:** Complex navigation. OneNet Servers is cleaner.
- **Borrow:** "Bullet-proof security" style metaphors, proximate testimonials, save% + renewal disclosure, "Best Value" badge strategy

### Hostinger (hostinger.com)
- **What they do well:** Aggressive value framing, "+X months free" mechanic, AI as hero product, inclusive global audience, countdown urgency
- **What to beat:** Urgency tactics feel manipulative. OneNet Servers is more trustworthy.
- **Borrow:** "+2 months free" framing (already in spec — make it prominent), "Cancel anytime" reassurance, per-testimonial role labels

### one.com
- **What they do well:** Alliterative copywriting craft, named AI ("Aida AI"), "Create It For Me" done-for-you positioning, European trust signals, zero-pressure CTAs
- **What to beat:** Their trial is only 15 days. OneNet Servers offers 30.
- **Borrow:** Three-part alliterative headlines, "Start a free trial" CTA style, "Let us build it for you" secondary CTA, vertical-specific copy (restaurant, portfolio, agency)

### OneNet Servers Differentiators vs All Four
These are genuine and must be built into every page's messaging hierarchy:
1. **30-day money-back guarantee** — one.com only does 15 days. Own this.
2. **+2 months free on annual plans** — no major competitor uses this framing. Own this.
3. **NGN/GBP/USD multi-currency on one site** — unique. Own this.
4. **NiRA accredited registrar** — only Nigerian-rooted UK-registered host. Own this.
5. **Tech Nation Endorsed Founder** — same programme as Monzo, Revolut, Wise. Own this.
6. **Itana Digital Resident** — Africa's first Digital SEZ. Own this.
7. **Digital Identity Initiative** — free year online for qualifying Nigerians. Unique. Own this.
8. **"Shuri" + "Braven" server naming** — cultural identity built into infrastructure. Amplify this.
9. **Free migration on every plan** — GoDaddy charges for this. SiteGround includes on GrowBig+. Own this.
10. **Human support, <2hr response** — SiteGround claims "real humans". Match and exceed.

---

## 3. AUDIENCE

Build every page with all of these audiences in mind. Different sections speak to different segments — the nav and hero must be legible to all.

| Segment | What they need | How to speak to them |
|---|---|---|
| **Gen-Z builders** | Speed, AI tools, no friction | Short copy, outcome-first, AI prominently featured |
| **Millennials / SMEs** | Reliability, value, support | Features + social proof + money-back |
| **Business owners** | Professionalism, uptime, brand trust | Credentials, uptime SLA, testimonials from named businesses |
| **Enterprise** | Performance, SLA, compliance, security | Specific numbers, OneGuard, compliance badges |
| **DevOps / developers** | Root access, CLI, Docker, n8n, Git | Technical specs, one-click apps, VPS page |
| **Resellers / agencies** | White-label, margins, WHMCS, client management | Reseller page, white-label features |
| **Freelancers** | Professional image, low cost, easy management | Domain + email bundle, AI builder |
| **Creators** | Fast setup, AI tools, WordPress | WordPress page, AI builder section |
| **Nigerian market** | NGN pricing, NiRA, local support, no conversion fees | Nigeria section, Paystack, .ng domains |
| **UK market** | GBP pricing, UK registered, GDPR, data sovereignty | UK RC number, footer legal, .co.uk domains |

---

## 4. WHMCS INTEGRATION

**Architecture:** WHMCS lives in the same `public_html` directory as the static HTML files. Same domain. Same session. No cross-domain trust break.

```
public_html/
├── index.html          ← marketing homepage (index.php redirects here)
├── hosting/web.html    ← marketing page
├── [all other marketing pages]
├── shared/             ← CSS + JS design system
├── assets/
├── api/
│   └── domain-check.php  ← thin wrapper for WHMCS domain availability API
├── cart.php            ← WHMCS (untouched)
├── clientarea.php      ← WHMCS (untouched)
├── login.php           ← WHMCS (untouched)
└── index.php           ← WHMCS (redirects to index.html)
```

### CTA URL Construction
Every "Get started" / "Buy now" button links to WHMCS cart with parameters:

```
/cart.php?a=add&pid={WHMCS_PRODUCT_ID}&billingcycle={cycle}
```

Where `{cycle}` = `monthly` | `quarterly` | `annually`

Currency is handled by WHMCS session — user's selected currency persists via cookie.

### Domain Search
```
User types domain → JS calls /api/domain-check.php → returns JSON → UI shows result
User clicks "Register" → /cart.php?a=add&domain={domain}&domainaction=register
User clicks "Transfer" → /cart.php?a=add&domain={domain}&domainaction=transfer
```

### Navigation Links
```
"Log in" → /login.php
"Client area" / "Manage services" → /clientarea.php
"Get started" / "Buy" → /cart.php?a=add&pid=X&billingcycle=Y
```

### Product ID Map (TO BE FILLED before build)
```json
{
  "web_hosting": {
    "starter": { "pid": "TBC", "monthly": "TBC", "annually": "TBC" },
    "lite":    { "pid": "TBC", "monthly": "TBC", "annually": "TBC" },
    "premium": { "pid": "TBC", "monthly": "TBC", "annually": "TBC" },
    "ultimate":{ "pid": "TBC", "monthly": "TBC", "annually": "TBC" }
  },
  "wordpress": { "starter": {}, "lite": {}, "premium": {}, "ultimate": {} },
  "reseller":  { "starter": {}, "lite": {}, "grow": {},   "enterprise": {} },
  "vps":       { "starter": {}, "lite": {}, "premium": {}, "ultimate": {} },
  "email":     { "starter": {}, "business": {}, "enterprise": {} },
  "oneguard":  { "single": {} },
  "ssl":       { "dv": {}, "dv_wildcard": {}, "ov": {}, "ev": {} },
  "currency":  { "USD": 1, "NGN": "TBC", "GBP": "TBC" }
}
```

---

## 5. THE 20 FIXES — IMPLEMENT ON EVERY RELEVANT PAGE

These are non-negotiable. Every fix must be visible in the delivered HTML.

### Fix 1 — Floating Chat Button
Every page has a fixed chat FAB bottom-right:
```html
<button class="chat-fab" aria-label="Open live chat" onclick="openChat()">
  <!-- chat SVG icon -->
  <span class="chat-fab-label">Chat with us</span>
</button>
```
Mobile: `bottom: 80px; right: 16px` (clears sticky CTA bar).

### Fix 2 — Competitor Comparison Section
Web Hosting, WordPress, VPS, Reseller, and Email pages each have `<section class="comparison-section">` with 5-column table: Feature | OneNet | Competitor A | Competitor B | Competitor C. OneNet column highlighted. No brand names for competitors — use "Popular UK Host", "Budget NG Host", "Global Budget Host".

### Fix 3 — Annual/Monthly Toggle with Savings Badge
Every pricing section has the billing toggle visible. `data-m` and `data-a` attributes allow `main.js` to swap values. "Save up to 35%" badge visible next to Annual label. "+2 months free" shown as secondary badge — this is a genuine differentiator.

### Fix 4 — Hero Objection Kill (Micro-copy under CTA)
Every hero CTA button followed immediately by:
```html
<div class="cta-reassurance">
  <span class="reassurance-item"><!-- check icon --> No credit card required</span>
  <span class="reassurance-item"><!-- check icon --> Cancel anytime</span>
  <span class="reassurance-item"><!-- check icon --> Free migration included</span>
</div>
```

### Fix 5 — Proximate Social Proof Above Pricing
Every pricing section preceded by:
```html
<div class="pricing-proof">
  <div class="proof-avatars"><!-- 4 avatar divs --></div>
  <div class="proof-stars">★★★★★</div>
  <p class="proof-quote">"Migrated from Bluehost, load time went from 4s to under 800ms." — Adebola O.</p>
</div>
```

### Fix 6 — How It Works (3 steps)
Homepage and all product pages: numbered circles connected by subtle line.
- Step 1: Choose your plan
- Step 2: We set up your environment (automated, 2–5 minutes)
- Step 3: You go live (support available 24/7)

### Fix 7 — Nigerian Market Section (Homepage only)
Section: "Built for Nigeria. Powered from London." — naira via Paystack, NiRA accreditation, .ng specialisation, local support hours, SCUML compliance, DII CTA.

### Fix 8 — Sticky CTA Bar on Product Pages
Appears after 600px scroll, hides when footer visible:
```html
<div class="sticky-cta" id="sticky-cta">
  <div class="sticky-cta-text">
    <strong>Web Hosting from $3.99/mo</strong> · LiteSpeed · CloudLinux · 30-day guarantee
  </div>
  <div class="sticky-cta-actions">
    <a href="#plans" class="btn btn-white btn-sm">See plans</a>
    <a href="/cart.php?a=add&pid=TBC&billingcycle=annually" class="btn btn-primary btn-sm">Get started</a>
  </div>
</div>
```

### Fix 9 — Domain Search with Result State
Domain search bar (homepage hero and domains page) shows result state after search:
- Available: green, "✓ yourdomain.ng is available — £X/yr" + "Register now" → `/cart.php?a=add&domain=X&domainaction=register`
- Taken: red, "✗ yourdomain.ng is taken — try these:" + alternatives
Prototype: domains ending `.available` show green; all others show alternatives.

### Fix 10 — Security Trust Badge Strip (Product page heroes)
Every product page hero has horizontal strip of 5 badges:
`30-day MBG · Free SSL · NiRA Accredited · SCUML · UK Registered`

### Fix 11 — Currency Switcher in Nav
Nav has `NGN | GBP | USD` selector. Updates all `[data-ngn]`, `[data-gbp]`, `[data-usd]` elements. Default: auto-detected from `navigator.language` (en-NG → NGN, en-GB → GBP, else USD).

### Fix 12 — Lottie Animations on "Included Features" Cards
3 of 6 "What's included" cards use `<lottie-player>`. Script loaded in `<head>` with `defer`.

### Fix 13 — Exit Intent / Scroll Depth Email Capture
Floating bar (NOT modal) at 85% scroll, once per session:
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
Both numbers in footer contact column:
- 🇳🇬 Nigeria: +234 201 330 9154
- 🇬🇧 UK: +44 7333 880 7775
- Email: support@onenetservers.net

### Fix 15 — Future of Productivity Community Section (Homepage)
Section after DII block: free monthly event series. SDG 4, 8, 10 aligned. CTA: "View upcoming events →"

### Fix 16 — Meta Tags / SEO on Every Page
Every `<head>` must include:
```html
<meta name="description" content="[page-specific 155 char description]">
<meta property="og:title" content="[Page Title] | OneNet Servers">
<meta property="og:description" content="[same as meta description]">
<meta property="og:image" content="https://onenetservers.net/assets/og-[page].jpg">
<meta property="og:url" content="https://onenetservers.net/[path]">
<link rel="canonical" href="https://onenetservers.net/[path]">
```
Plus FAQPage JSON-LD on product pages, Organization JSON-LD on homepage, BreadcrumbList on inner pages.

### Fix 17 — Lottie CDN Fallback
Every `<lottie-player>` has `<noscript>` fallback and static CSS animation fallback class.

### Fix 18 — Comparison Table Mobile Scroll Indicator
```html
<div class="table-scroll-wrap">
  <div class="table-scroll-hint">← Swipe to compare →</div>
  <div class="table-inner"><!-- table --></div>
</div>
```
Hint hides after horizontal scroll.

### Fix 19 — Reseller Page
Full page — not a stub. Hero, how it works (agencies), 4 plan cards, white-label features, WHMCS section, comparison, testimonial, FAQ, CTA.

### Fix 20 — Client Area / Dashboard Preview
Hero sections of Web Hosting, WordPress, and VPS pages include stylised browser chrome mockup (CSS/HTML only — no real screenshots): Plesk panel, PanelAlpha, or VPS terminal + stats card respectively.

---

## 6. COMPLETE PAGE LIST

Build ALL of these. No stubs. No "coming soon" pages.

| File | URL | Title |
|------|-----|-------|
| `index.html` | `/` | Home |
| `about.html` | `/about` | About Us |
| `contact.html` | `/contact` | Contact Us |
| `digital-identity.html` | `/digital-identity` | Digital Identity Initiative |
| `community.html` | `/community` | Future of Productivity |
| `hosting/web.html` | `/hosting/web` | Web Hosting |
| `hosting/wordpress.html` | `/hosting/wordpress` | WordPress Hosting |
| `hosting/reseller.html` | `/hosting/reseller` | Reseller Hosting |
| `hosting/vps.html` | `/hosting/vps` | Cloud VPS |
| `domains/index.html` | `/domains` | Domain Registration |
| `domains/transfer.html` | `/domains/transfer` | Domain Transfer |
| `domains/ng.html` | `/domains/ng` | .NG Domains |
| `email/index.html` | `/email` | Business Email |
| `security/ssl.html` | `/security/ssl` | SSL Certificates |
| `security/oneguard.html` | `/security/oneguard` | OneGuard Security |
| `legal/terms.html` | `/legal/terms` | Terms of Service |
| `legal/privacy.html` | `/legal/privacy` | Privacy Policy |
| `legal/agreement.html` | `/legal/agreement` | Hosting Agreement |

---

## 7. SHARED FILES — BUILD THESE FIRST

### `shared/tokens.css`
All CSS custom properties. Values defined in Section 1. Do not change values.

### `shared/components.css`
Buttons, badges, cards, icon boxes, trust bar, pricing cards, FAQ accordion, comparison table, sticky CTA, chat FAB, exit bar, domain search, billing toggle, hero trust strip, testimonial cards, stat items, proof strip.

### `shared/layout.css`
Container system, section padding, grid helpers, responsive breakpoints:
- Mobile: `< 480px` | Tablet: `480px–768px` | Laptop: `768px–1024px` | Desktop: `1024px–1280px` | Wide: `> 1280px`

### `shared/nav.css`
Fixed, transparent → frosted glass on scroll. Mobile: hamburger → full-screen drawer. Currency selector. Dropdowns.

### `shared/footer.css`
5-column grid, brand column, social icons, legal strip, responsive collapse.

### `shared/animations.css`
`.reveal` class: opacity 0→1, translateY 24→0. Stagger delay `.d1`–`.d6`. Lottie floating. Trust bar scroll. Badge pulse.

### `shared/main.js`
Zero dependencies. Implements:
1. Nav scroll (transparent → stuck)
2. Mobile menu open/close
3. Currency switcher (NGN/GBP/USD) — updates `[data-ngn]`, `[data-gbp]`, `[data-usd]`
4. Billing toggle (monthly/annual) — updates `[data-m]`, `[data-a]`
5. Scroll reveal (IntersectionObserver)
6. Sticky CTA bar (600px scroll, hides at footer)
7. Chat FAB click handler
8. Domain search result simulation + `/api/domain-check.php` call
9. FAQ accordion
10. Comparison table scroll hint
11. Exit/scroll-depth bar (85% scroll, once per session via sessionStorage)
12. Pricing tab switcher (homepage)
13. Smooth anchor scrolling

---

## 8. NAVIGATION SPECIFICATION

### Desktop Nav (sticky, frosted glass after 60px scroll)
```
[Logo] [Domains ▾] [Hosting ▾] [Email] [Security ▾] [Community] ... [NGN|GBP|USD] [Log in] [Get started free]
```
"Log in" → `/login.php`
"Get started free" → `/cart.php?a=add&pid={web_starter_pid}&billingcycle=monthly`

**Domains dropdown:**
- Register a Domain
- Transfer a Domain
- .NG Domains

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
- "Log in" (ghost) + "Get started free" (primary) at bottom

---

## 9. FOOTER SPECIFICATION

**5 columns:**

**Col 1 — Brand**
- Logo (28px height)
- Tagline: "AI-powered hosting, domains, and email for businesses building Africa's digital future — from Lagos to London."
- Social: X, LinkedIn, Instagram, YouTube (SVG, ghost square buttons)

**Col 2 — Hosting**
- Web Hosting, WordPress Hosting, Reseller Hosting, Cloud VPS, Garium Private AI

**Col 3 — Domains**
- Register a Domain, Transfer a Domain, .NG Domains, .COM.NG, TLD Pricing

**Col 4 — Tools & Security**
- Business Email, SSL Certificates, OneGuard Security, Web Design, Future of Productivity

**Col 5 — Company & Contact**
- About Us, Contact Us, Digital Identity Initiative
- 🇳🇬 +234 201 330 9154
- 🇬🇧 +44 7333 880 7775
- support@onenetservers.net

**Trust badge row:**
NiRA Accredited | UK RC: 14565201 | NG RC: 1775966 | SCUML Registered | Tech Nation Endorsed | Itana Digital Resident

**Legal strip:**
"© 2026 OneNet Servers — trading name of ConqolX Technologies Limited. Registered in England & Wales No. 14565201. Registered in Nigeria No. 1775966. SCUML registered. NiRA accredited. Prices shown exclude applicable VAT. Renewal prices may differ from first-term prices."

---

## 10. COPY QUALITY GATES

Before any page is considered done, every word must pass this checklist:

### Zero Tolerance Errors (reject if found)
- [ ] Any typo — spell check every page before completion
- [ ] "OneNet servers" (lowercase s) — always "OneNet Servers"
- [ ] Double spaces, double words ("with with"), misused apostrophes
- [ ] "Lorem ipsum" or [PLACEHOLDER] left in file
- [ ] US English spelling on a UK-registered company's site
- [ ] font-weight 700 or 800 — maximum is 600
- [ ] Relative import paths — always root-relative (`/shared/...`)

### Microcopy Standards (competitor-grade)
- [ ] Every button label is verb + noun
- [ ] Every reassurance line is specific ("No credit card required" not "Easy to start")
- [ ] Every stat is substantiated (not "fast" — "sub-800ms avg load")
- [ ] Every discount framed two ways: % saved AND +months free
- [ ] Every plan card shows: price, audience label, key features, MBG badge
- [ ] Every FAQ answer is 2–4 sentences. No one-liners. No essays.
- [ ] Pricing disclosure: "Renews at [price]" shown on all plan cards

### Tone Checklist
- [ ] No adverbs (incredibly, highly, truly, really, very)
- [ ] No banned words (leverage, synergy, cutting-edge, seamless, solutions, robust, innovative)
- [ ] No passive voice in CTAs
- [ ] "You" / "your" dominant — not "the user" or "customers"
- [ ] No sentence starts with "We are" — lead with the reader's outcome

---

## 11. LOTTIE ANIMATIONS

Load once in `<head>`:
```html
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" defer></script>
```

| Purpose | URL |
|---------|-----|
| Server/cloud | `https://assets6.lottiefiles.com/packages/lf20_qp1q7mct.json` |
| Globe/domain | `https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json` |
| Shield/security | `https://assets9.lottiefiles.com/packages/lf20_w51pcehl.json` |
| Server rack | `https://assets5.lottiefiles.com/packages/lf20_sy6bevyc.json` |

Every `<lottie-player>`: `background="transparent"`, `speed="0.85"`, `loop`, `autoplay`. Apply Fix 17 fallbacks.

---

## 12. BUILD ORDER

Execute in this order:

1. `shared/tokens.css`
2. `shared/layout.css`
3. `shared/components.css`
4. `shared/nav.css`
5. `shared/footer.css`
6. `shared/animations.css`
7. `shared/main.js`
8. `index.html`
9. `hosting/web.html`
10. `hosting/wordpress.html`
11. `hosting/reseller.html`
12. `hosting/vps.html`
13. `domains/index.html`
14. `domains/transfer.html`
15. `domains/ng.html`
16. `email/index.html`
17. `security/ssl.html`
18. `security/oneguard.html`
19. `about.html`
20. `contact.html`
21. `digital-identity.html`
22. `community.html`
23. `legal/terms.html`, `legal/privacy.html`, `legal/agreement.html`

---

## 13. QUALITY GATES — FINAL CHECKLIST

Before any page is "done":
- [ ] All 20 fixes implemented (relevant subset per page)
- [ ] All prices correct per CONTENT.md
- [ ] Phone numbers in footer: +234 201 330 9154 and +44 7333 880 7775
- [ ] Currency switcher works
- [ ] Billing toggle works
- [ ] FAQ accordion opens/closes
- [ ] Sticky CTA bar appears at 600px scroll on product pages
- [ ] Chat FAB present and positioned correctly
- [ ] Exit bar fires at 85% scroll, dismissible, once per session
- [ ] Hero CTA has reassurance micro-copy directly below
- [ ] Pricing section has proximate social proof above it
- [ ] WHMCS links: all CTAs link to `/cart.php?a=add&pid=X&billingcycle=Y`
- [ ] "Log in" → `/login.php` | "Client area" → `/clientarea.php`
- [ ] Mobile responsive: 375px, 768px, 1024px, 1280px — no horizontal overflow
- [ ] JSON-LD schema present and valid
- [ ] Canonical URL and OG meta tags present
- [ ] Logo renders correctly (`/assets/logo.svg`)
- [ ] Lottie animations have fallback divs
- [ ] Comparison table has mobile scroll hint
- [ ] Domain search result state implemented
- [ ] Zero typos — every page proofread

---

## 14. DO NOT

- Do NOT use any JS framework (React, Vue, Alpine)
- Do NOT use any CSS framework (Tailwind, Bootstrap)
- Do NOT install npm packages
- Do NOT use emoji in UI text — SVG icons only
- Do NOT use font-weight 700 or 800
- Do NOT hard-code colours — always use CSS custom properties
- Do NOT use relative import paths — always root-relative
- Do NOT name competitors by brand name in comparison tables
- Do NOT leave any stub pages
- Do NOT use `px` for font sizes in media queries — use `rem` or `em`
- Do NOT link to `host.onenetservers.net` — everything is on the same domain
- Do NOT write "OneNet servers" — always "OneNet Servers"

---

*OneNet Servers Website Specification v2.0 — March 2026*
*Competitor standard: GoDaddy · SiteGround · Hostinger · one.com*
*WHMCS integrated · Same public_html · Global positioning · Multi-currency*
