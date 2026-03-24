# COMPONENTS.md — OneNet Servers HTML Component Library

Every component below is the canonical markup. Claude Code must replicate these patterns exactly. CSS classes map to `shared/components.css`. JS behaviour is in `shared/main.js`.

---

## 1. PAGE SHELL (every page starts with this)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] | OneNet Servers</title>

  <!-- SEO (Fix 16) -->
  <meta name="description" content="[155-char description]">
  <link rel="canonical" href="https://onenetservers.net/[path]">
  <meta property="og:title" content="[Page Title] | OneNet Servers">
  <meta property="og:description" content="[155-char description]">
  <meta property="og:image" content="https://onenetservers.net/assets/og-[page].jpg">
  <meta property="og:url" content="https://onenetservers.net/[path]">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lato:ital,opsz,wght@0,6..12,300;0,6..12,400;1,6..12,300&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <!-- Lottie (Fix 17) -->
  <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" defer></script>

  <!-- Shared Styles -->
  <link rel="stylesheet" href="/shared/tokens.css">
  <link rel="stylesheet" href="/shared/layout.css">
  <link rel="stylesheet" href="/shared/components.css">
  <link rel="stylesheet" href="/shared/nav.css">
  <link rel="stylesheet" href="/shared/footer.css">
  <link rel="stylesheet" href="/shared/animations.css">

  <!-- JSON-LD Schema (Fix 16) -->
  <script type="application/ld+json">
  { /* page-specific schema */ }
  </script>
</head>
<body>

  <!-- Navigation -->
  [NAV COMPONENT]

  <!-- Page content -->
  <main class="page-body">
    <!-- sections here -->
  </main>

  <!-- Footer -->
  [FOOTER COMPONENT]

  <!-- Fixed UI (Fix 1, 8, 13) -->
  [CHAT FAB]
  [STICKY CTA BAR] <!-- product pages only -->
  [EXIT BAR]

  <!-- JS -->
  <script src="/shared/main.js"></script>
</body>
</html>
```

---

## 2. NAVIGATION

```html
<nav class="nav" id="main-nav" aria-label="Main navigation">
  <div class="nav-inner">

    <!-- Logo -->
    <a href="/" class="nav-logo" aria-label="OneNet Servers home">
      <img src="/assets/logo.svg" alt="OneNet Servers" class="nav-logo-img" width="140" height="32">
    </a>

    <!-- Desktop links -->
    <ul class="nav-links" role="list">

      <li class="nav-item nav-has-dropdown">
        <button class="nav-link" aria-haspopup="true" aria-expanded="false">
          Domains
          <svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="nav-dropdown nav-dropdown-sm">
          <a href="/domains" class="nav-dropdown-item">
            <span class="ndi-icon ib-blue"><!-- globe icon --></span>
            <span><strong>Register a Domain</strong><br><small>Search 30+ extensions</small></span>
          </a>
          <a href="/domains/transfer" class="nav-dropdown-item">
            <span class="ndi-icon ib-green"><!-- transfer icon --></span>
            <span><strong>Transfer a Domain</strong><br><small>Free renewal year included</small></span>
          </a>
          <a href="/domains/ng" class="nav-dropdown-item">
            <span class="ndi-icon ib-amber"><!-- ng flag icon --></span>
            <span><strong>.NG Domains</strong><br><small>NiRA accredited registrar</small></span>
          </a>
        </div>
      </li>

      <li class="nav-item nav-has-dropdown">
        <button class="nav-link" aria-haspopup="true" aria-expanded="false">
          Hosting
          <svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="nav-dropdown nav-dropdown-lg">
          <div class="nav-dropdown-col">
            <div class="nav-dropdown-col-title">Shared Hosting</div>
            <a href="/hosting/web" class="nav-dropdown-item">
              <span class="ndi-icon ib-blue"><!-- server icon --></span>
              <span><strong>Web Hosting</strong><br><small>LiteSpeed · CloudLinux · Plesk</small></span>
            </a>
            <a href="/hosting/wordpress" class="nav-dropdown-item">
              <span class="ndi-icon ib-purple"><!-- WP icon --></span>
              <span><strong>WordPress Hosting</strong><br><small>AI Builder · Docker · PanelAlpha</small></span>
            </a>
            <a href="/hosting/reseller" class="nav-dropdown-item">
              <span class="ndi-icon ib-cyan"><!-- reseller icon --></span>
              <span><strong>Reseller Hosting</strong><br><small>White-label · WHMCS billing</small></span>
            </a>
          </div>
          <div class="nav-dropdown-col">
            <div class="nav-dropdown-col-title">Managed Services</div>
            <a href="/email" class="nav-dropdown-item">
              <span class="ndi-icon ib-amber"><!-- email icon --></span>
              <span><strong>Business Email</strong><br><small>CrossBox · No per-user fees</small></span>
            </a>
            <a href="#" class="nav-dropdown-item nav-dropdown-item-disabled">
              <span class="ndi-icon ib-green"><!-- design icon --></span>
              <span><strong>Web Design</strong><br><small>Coming soon</small></span>
            </a>
          </div>
          <div class="nav-dropdown-col">
            <div class="nav-dropdown-col-title">Infrastructure</div>
            <a href="/hosting/vps" class="nav-dropdown-item">
              <span class="ndi-icon ib-red"><!-- cube icon --></span>
              <span><strong>Cloud VPS</strong><br><small>Root access · Unlimited BW</small></span>
            </a>
            <a href="#" class="nav-dropdown-item nav-dropdown-item-disabled">
              <span class="ndi-icon ib-blue"><!-- AI icon --></span>
              <span><strong>Garium Private AI</strong><br><small>Coming soon</small></span>
            </a>
          </div>
        </div>
      </li>

      <li class="nav-item">
        <a href="/email" class="nav-link">Email</a>
      </li>

      <li class="nav-item nav-has-dropdown">
        <button class="nav-link" aria-haspopup="true" aria-expanded="false">
          Security
          <svg class="nav-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="nav-dropdown nav-dropdown-sm">
          <a href="/security/oneguard" class="nav-dropdown-item">
            <span class="ndi-icon ib-red"><!-- shield icon --></span>
            <span><strong>OneGuard Security</strong><br><small>Complete managed protection</small></span>
          </a>
          <a href="/security/ssl" class="nav-dropdown-item">
            <span class="ndi-icon ib-green"><!-- lock icon --></span>
            <span><strong>SSL Certificates</strong><br><small>Free with hosting · Paid SSL available</small></span>
          </a>
        </div>
      </li>

      <li class="nav-item">
        <a href="/community" class="nav-link">Community</a>
      </li>

    </ul>

    <!-- Currency switcher (Fix 11) + CTAs -->
    <div class="nav-right">
      <div class="currency-switcher" id="currency-switcher" role="group" aria-label="Select currency">
        <button class="currency-btn active" data-currency="USD">USD</button>
        <button class="currency-btn" data-currency="GBP">GBP</button>
        <button class="currency-btn" data-currency="NGN">NGN</button>
      </div>
      <a href="https://host.onenetservers.net/clientarea.php" class="btn btn-ghost btn-sm">Log in</a>
      <a href="/domains" class="btn btn-primary btn-sm">Get started</a>
    </div>

    <!-- Mobile hamburger -->
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

  </div><!-- /nav-inner -->

  <!-- Mobile drawer -->
  <div class="mobile-drawer" id="mobile-drawer" aria-hidden="true">
    <div class="mobile-drawer-inner">
      <div class="mobile-drawer-links">
        <!-- accordion items -->
        <div class="mobile-nav-group">
          <button class="mobile-nav-toggle">Domains</button>
          <div class="mobile-nav-sub">
            <a href="/domains">Register a Domain</a>
            <a href="/domains/transfer">Transfer a Domain</a>
            <a href="/domains/ng">.NG Domains</a>
          </div>
        </div>
        <div class="mobile-nav-group">
          <button class="mobile-nav-toggle">Hosting</button>
          <div class="mobile-nav-sub">
            <a href="/hosting/web">Web Hosting</a>
            <a href="/hosting/wordpress">WordPress Hosting</a>
            <a href="/hosting/reseller">Reseller Hosting</a>
            <a href="/hosting/vps">Cloud VPS</a>
          </div>
        </div>
        <a href="/email" class="mobile-nav-link">Email</a>
        <div class="mobile-nav-group">
          <button class="mobile-nav-toggle">Security</button>
          <div class="mobile-nav-sub">
            <a href="/security/oneguard">OneGuard Security</a>
            <a href="/security/ssl">SSL Certificates</a>
          </div>
        </div>
        <a href="/community" class="mobile-nav-link">Community</a>
        <a href="/about" class="mobile-nav-link">About Us</a>
      </div>
      <div class="mobile-drawer-currency">
        <span>Currency:</span>
        <button class="currency-btn active" data-currency="USD">USD</button>
        <button class="currency-btn" data-currency="GBP">GBP</button>
        <button class="currency-btn" data-currency="NGN">NGN</button>
      </div>
      <div class="mobile-drawer-ctas">
        <a href="https://host.onenetservers.net/clientarea.php" class="btn btn-ghost btn-md" style="width:100%">Log in</a>
        <a href="/domains" class="btn btn-primary btn-md" style="width:100%">Get started</a>
      </div>
    </div>
  </div>

</nav>
```

---

## 3. HERO TRUST STRIP (Fix 10 — product pages)

```html
<div class="hero-trust-strip" role="list" aria-label="Trust signals">
  <div class="hts-item" role="listitem">
    <svg class="hts-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
      <path d="M5 4V2.5C5 1.67 5.67 1 6.5 1H7.5C8.33 1 9 1.67 9 2.5V4" stroke="currentColor" stroke-width="1.3"/>
      <circle cx="7" cy="7.5" r="1" fill="currentColor"/>
    </svg>
    <span>30-day money-back</span>
  </div>
  <div class="hts-sep" aria-hidden="true"></div>
  <div class="hts-item" role="listitem">
    <svg class="hts-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.5L11.5 3.5V7C11.5 10 7 12.5 7 12.5C7 12.5 2.5 10 2.5 7V3.5L7 1.5Z" stroke="currentColor" stroke-width="1.3"/>
      <path d="M5 7L6.5 8.5L9.5 5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Free SSL included</span>
  </div>
  <div class="hts-sep" aria-hidden="true"></div>
  <div class="hts-item" role="listitem">
    <svg class="hts-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.3"/>
      <path d="M7 2C7 2 10 4.5 10 7S7 12 7 12" stroke="currentColor" stroke-width="1.3"/>
      <path d="M7 2C7 2 4 4.5 4 7S7 12 7 12" stroke="currentColor" stroke-width="1.3"/>
      <path d="M1.5 7H12.5" stroke="currentColor" stroke-width="1.3"/>
    </svg>
    <span>NiRA accredited</span>
  </div>
  <div class="hts-sep" aria-hidden="true"></div>
  <div class="hts-item" role="listitem">
    <!-- SCUML icon -->
    <span>SCUML registered</span>
  </div>
  <div class="hts-sep" aria-hidden="true"></div>
  <div class="hts-item" role="listitem">
    <!-- UK icon -->
    <span>UK registered</span>
  </div>
</div>
```

---

## 4. CTA REASSURANCE (Fix 4 — under every hero CTA)

```html
<div class="cta-reassurance" role="list" aria-label="Reassurances">
  <div class="reassurance-item" role="listitem">
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5" stroke="#10B981" stroke-width="1.2"/>
      <path d="M4.5 6.5L6 8L9 5" stroke="#10B981" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>No credit card required</span>
  </div>
  <div class="reassurance-item" role="listitem">
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5" stroke="#10B981" stroke-width="1.2"/>
      <path d="M4.5 6.5L6 8L9 5" stroke="#10B981" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Cancel anytime</span>
  </div>
  <div class="reassurance-item" role="listitem">
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5" stroke="#10B981" stroke-width="1.2"/>
      <path d="M4.5 6.5L6 8L9 5" stroke="#10B981" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Free migration included</span>
  </div>
</div>
```

---

## 5. PRICING PROOF (Fix 5 — above every pricing section)

```html
<div class="pricing-proof">
  <div class="pp-avatars" aria-hidden="true">
    <div class="pp-avatar" style="background:var(--blue-xl);color:var(--blue)">AO</div>
    <div class="pp-avatar" style="background:#FEF3C7;color:#92400E">TC</div>
    <div class="pp-avatar" style="background:var(--green-l);color:var(--green-d)">SB</div>
    <div class="pp-avatar" style="background:var(--purple-l);color:var(--purple)">+</div>
  </div>
  <div class="pp-text">
    <div class="pp-stars" aria-label="5 out of 5 stars">★★★★★</div>
    <p class="pp-quote">"Migrated from Bluehost, load time went from 4s to under 800ms." — Adebola O., Lagos</p>
  </div>
</div>
```

---

## 6. BILLING TOGGLE (Fix 3)

```html
<div class="billing-toggle" role="group" aria-label="Select billing period">
  <span class="billing-label active" id="label-monthly">Monthly</span>
  <button
    class="toggle-pill"
    id="billing-toggle"
    role="switch"
    aria-checked="false"
    aria-label="Switch to annual billing"
  >
    <div class="toggle-knob"></div>
  </button>
  <span class="billing-label" id="label-annual">Annual</span>
  <span class="save-badge">Save up to 35%</span>
</div>
```

---

## 7. PLAN CARD — FULL (Web Hosting example)

```html
<div class="plan-card" data-plan="premium">
  <!-- Popular badge: only on the recommended plan -->
  <div class="badge badge-popular">Most popular</div>

  <div class="plan-card-header">
    <div class="plan-name">Premium</div>
    <div class="plan-price">
      <span class="plan-sym" data-usd="$" data-gbp="£" data-ngn="₦">$</span>
      <span class="plan-num"
        data-m="18" data-a="11"
        data-usd-m="18" data-usd-a="11"
        data-gbp-m="16" data-gbp-a="10"
        data-ngn-m="24999" data-ngn-a="15999"
      >18</span>
      <span class="plan-per">.20<span class="plan-billing-label">/mo</span></span>
    </div>
    <div class="plan-ngn" data-show-currency="NGN" style="display:none">₦24,999/mo</div>
    <div class="plan-gbp" data-show-currency="GBP" style="display:none">£16.95/mo</div>
    <div class="plan-desc body-copy">
      The most popular plan for established businesses and freelancers managing multiple clients.
    </div>
  </div>

  <div class="plan-divider"></div>

  <div class="plan-card-body">
    <ul class="plan-feats" role="list">
      <li class="plan-feat">
        <svg class="feat-check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="var(--blue)" stroke-width="1.2"/>
          <path d="M5 7L6.5 8.5L9.5 5.5" stroke="var(--blue)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>7 websites</span>
      </li>
      <li class="plan-feat">
        <svg class="feat-check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="var(--blue)" stroke-width="1.2"/>
          <path d="M5 7L6.5 8.5L9.5 5.5" stroke="var(--blue)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>50 GB SSD storage</span>
      </li>
      <li class="plan-feat">
        <svg class="feat-check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="var(--blue)" stroke-width="1.2"/>
          <path d="M5 7L6.5 8.5L9.5 5.5" stroke="var(--blue)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>WP Toolkit + Joomla Toolkit</span>
      </li>
      <li class="plan-feat">
        <svg class="feat-check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="var(--blue)" stroke-width="1.2"/>
          <path d="M5 7L6.5 8.5L9.5 5.5" stroke="var(--blue)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>CloudLinux + ImmunifyAV+</span>
      </li>
      <li class="plan-feat">
        <svg class="feat-check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="var(--blue)" stroke-width="1.2"/>
          <path d="M5 7L6.5 8.5L9.5 5.5" stroke="var(--blue)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Priority support (&lt;30 min response)</span>
      </li>
    </ul>
  </div>

  <div class="plan-card-footer">
    <a href="https://host.onenetservers.net/cart.php?a=add&pid=PREMIUM_ID" class="btn btn-primary btn-md plan-cta">
      Get started
    </a>
  </div>
</div>
```

---

## 8. FAQ ACCORDION (Fix — all product pages)

```html
<div class="faq-list" role="list">

  <div class="faq-item" role="listitem">
    <button class="faq-q" aria-expanded="false" aria-controls="faq-1-answer">
      <span class="faq-q-text">Can I migrate my existing website for free?</span>
      <svg class="faq-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 4V14M4 9H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="faq-a" id="faq-1-answer" role="region" hidden>
      <p class="body-copy">Yes. Every plan includes a free migration from your current host. Our team handles the full technical migration — files, databases, DNS, and email — with zero downtime. Simply raise a support ticket after signing up.</p>
    </div>
  </div>

  <!-- Repeat pattern for each Q&A -->

</div>
```

---

## 9. COMPARISON TABLE (Fix 2 + Fix 18)

```html
<div class="table-scroll-wrap">
  <div class="table-scroll-hint" aria-label="Scroll to see more columns" role="note">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Swipe to compare all plans
  </div>
  <div class="table-inner" role="region" aria-label="Plan comparison table" tabindex="0">
    <table class="compare-table">
      <caption class="sr-only">Feature comparison between OneNet and competitors</caption>
      <thead>
        <tr>
          <th scope="col" class="col-feature">Feature</th>
          <th scope="col" class="col-onenet">OneNet Starter</th>
          <th scope="col" class="col-onenet col-popular">OneNet Premium ★</th>
          <th scope="col">Budget NG Host</th>
          <th scope="col">Popular UK Host</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-feature">Starting price/mo</td>
          <td class="col-onenet">$3.99</td>
          <td class="col-onenet col-popular">$18.20</td>
          <td>~$1.50</td>
          <td>~$4.99</td>
        </tr>
        <tr>
          <td class="col-feature">CloudLinux isolation</td>
          <td class="col-onenet"><svg class="cmp-cross" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="No"><circle cx="8" cy="8" r="6" stroke="var(--line)" stroke-width="1.3"/><path d="M6 10L10 6M6 6L10 10" stroke="var(--line)" stroke-width="1.3" stroke-linecap="round"/></svg></td>
          <td class="col-onenet col-popular"><svg class="cmp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Yes"><circle cx="8" cy="8" r="6" stroke="var(--green)" stroke-width="1.3"/><path d="M5.5 8L7 9.5L10.5 6.5" stroke="var(--green)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
          <td><svg class="cmp-cross" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="No"><circle cx="8" cy="8" r="6" stroke="var(--line)" stroke-width="1.3"/><path d="M6 10L10 6M6 6L10 10" stroke="var(--line)" stroke-width="1.3" stroke-linecap="round"/></svg></td>
          <td><svg class="cmp-cross" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="No"><circle cx="8" cy="8" r="6" stroke="var(--line)" stroke-width="1.3"/><path d="M6 10L10 6M6 6L10 10" stroke="var(--line)" stroke-width="1.3" stroke-linecap="round"/></svg></td>
        </tr>
        <!-- more rows -->
      </tbody>
    </table>
  </div>
</div>
```

---

## 10. STICKY CTA BAR (Fix 8)

```html
<div class="sticky-cta" id="sticky-cta" aria-live="polite" aria-atomic="true" role="complementary" aria-label="Quick purchase">
  <div class="sticky-cta-text">
    <strong>Web Hosting from $3.99/mo</strong>
    <span class="sticky-cta-sub"> · LiteSpeed · CloudLinux · 30-day guarantee</span>
  </div>
  <div class="sticky-cta-actions">
    <a href="#plans" class="btn btn-ghost btn-sm">See plans</a>
    <a href="https://host.onenetservers.net/cart.php" class="btn btn-primary btn-sm">Get started</a>
  </div>
  <button class="sticky-cta-close" aria-label="Dismiss">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  </button>
</div>
```

---

## 11. CHAT FAB (Fix 1)

```html
<button class="chat-fab" id="chat-fab" aria-label="Open live chat" type="button">
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M11 3C7.13 3 4 5.91 4 9.5C4 11.06 4.57 12.5 5.53 13.64L4 19L9.09 17.14C9.7 17.36 10.34 17.48 11 17.5C14.87 17.5 18 14.59 18 11C18 7.41 14.87 4.5 11 4.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 19L5.53 13.64" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <span class="chat-fab-tooltip" role="tooltip">Chat with us</span>
</button>
```

---

## 12. EXIT BAR (Fix 13)

```html
<div class="exit-bar" id="exit-bar" role="complementary" aria-label="Email signup offer" hidden>
  <div class="exit-bar-inner">
    <div class="exit-bar-text">
      <strong>Not ready yet?</strong>
      <span class="body-copy"> Get our free domain transfer checklist — covers every TLD we support.</span>
    </div>
    <form class="exit-bar-form" id="exit-bar-form" novalidate>
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        aria-label="Email address"
        required
        class="exit-bar-input"
      >
      <button type="submit" class="btn btn-primary btn-sm">Send it free</button>
    </form>
    <button class="exit-bar-close" id="exit-bar-close" aria-label="Dismiss this offer" type="button">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</div>
```

---

## 13. DOMAIN SEARCH WITH RESULT STATE (Fix 9)

```html
<div class="domain-search-wrap" id="domain-search-wrap">
  <form class="domain-search" id="domain-search-form" novalidate role="search" aria-label="Domain search">
    <div class="domain-search-icon" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    <input
      class="domain-search-input"
      id="domain-search-input"
      type="text"
      placeholder="Find your domain — yourbrand.ng"
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
      aria-label="Enter a domain name to search"
    >
    <button type="submit" class="domain-search-btn">Search</button>
  </form>

  <!-- Result states (Fix 9) — shown/hidden by JS -->
  <div class="domain-result domain-result-available" id="domain-result-available" hidden role="status" aria-live="polite">
    <div class="domain-result-info">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="var(--green)" stroke-width="1.3"/>
        <path d="M5.5 8L7 9.5L10.5 6.5" stroke="var(--green)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="domain-result-text" id="domain-result-available-text"></span>
    </div>
    <a href="#" class="btn btn-primary btn-sm" id="domain-register-btn">Register now</a>
  </div>

  <div class="domain-result domain-result-taken" id="domain-result-taken" hidden role="status" aria-live="polite">
    <div class="domain-result-info">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="var(--red)" stroke-width="1.3"/>
        <path d="M5.5 8L7 9.5L10.5 6.5" stroke="var(--line)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="domain-result-text" id="domain-result-taken-text"></span>
    </div>
    <a href="/domains" class="btn btn-secondary btn-sm">Try alternatives</a>
  </div>

  <div class="domain-tlds" role="list" aria-label="Popular domain extensions">
    <button class="tld-chip ng" role="listitem" data-tld=".ng">.ng</button>
    <button class="tld-chip ng" role="listitem" data-tld=".com.ng">.com.ng</button>
    <button class="tld-chip" role="listitem" data-tld=".com">.com</button>
    <button class="tld-chip" role="listitem" data-tld=".co.uk">.co.uk</button>
    <button class="tld-chip" role="listitem" data-tld=".ai">.ai</button>
    <button class="tld-chip" role="listitem" data-tld=".dev">.dev</button>
    <button class="tld-chip" role="listitem" data-tld=".xyz">.xyz</button>
    <span class="tld-more" aria-label="And 24 more extensions">+24 more</span>
  </div>
</div>
```

---

## 14. HOW IT WORKS (3-step, Fix 6)

```html
<section class="section section-bg" id="how-it-works">
  <div class="container">
    <div class="section-header text-center reveal">
      <span class="eyebrow eyebrow-center">Getting started</span>
      <h2 class="h2">Live in under 10 minutes.</h2>
      <p class="lead" style="max-width:480px;margin:0 auto">No technical knowledge required. We handle setup; you get the keys.</p>
    </div>

    <div class="steps-grid reveal">

      <div class="step-item">
        <div class="step-number" aria-hidden="true">01</div>
        <div class="step-connector" aria-hidden="true"></div>
        <div class="step-icon-wrap">
          <!-- icon SVG -->
        </div>
        <div class="step-content">
          <h3 class="h4 step-title">Choose your plan</h3>
          <p class="body-copy step-desc">Pick the product and plan that fits. All plans come with a 30-day money-back guarantee.</p>
        </div>
      </div>

      <div class="step-item">
        <div class="step-number" aria-hidden="true">02</div>
        <div class="step-connector" aria-hidden="true"></div>
        <div class="step-icon-wrap">
          <!-- icon SVG -->
        </div>
        <div class="step-content">
          <h3 class="h4 step-title">We set everything up</h3>
          <p class="body-copy step-desc">Your environment is provisioned automatically. Average activation: 2–5 minutes. Migrations handled by our team.</p>
        </div>
      </div>

      <div class="step-item">
        <div class="step-number" aria-hidden="true">03</div>
        <div class="step-icon-wrap">
          <!-- icon SVG -->
        </div>
        <div class="step-content">
          <h3 class="h4 step-title">You go live</h3>
          <p class="body-copy step-desc">Log in to your panel. Your site is ready. Our support team is available 24/7 if you need anything.</p>
        </div>
      </div>

    </div>
  </div>
</section>
```

---

## 15. LOTTIE PLAYER WITH FALLBACK (Fix 17)

```html
<div class="lottie-wrap" style="width:320px;height:280px;" aria-hidden="true">
  <lottie-player
    src="https://assets6.lottiefiles.com/packages/lf20_qp1q7mct.json"
    background="transparent"
    speed="0.85"
    loop
    autoplay
    class="lottie-player"
    style="width:100%;height:100%"
  ></lottie-player>
  <!-- Fallback: shown if lottie-player fails to load (Fix 17) -->
  <div class="lottie-fallback" aria-hidden="true">
    <div class="lottie-fallback-icon">
      <!-- Static SVG illustration that approximates the animation concept -->
    </div>
  </div>
</div>
```

---

## 16. FOOTER

```html
<footer class="footer" id="main-footer" role="contentinfo">
  <div class="container">

    <!-- Top grid -->
    <div class="footer-grid">

      <!-- Brand column -->
      <div class="footer-brand">
        <a href="/" class="footer-logo-link" aria-label="OneNet Servers home">
          <img src="/assets/logo.svg" alt="OneNet Servers" class="footer-logo-img" width="130" height="30">
        </a>
        <p class="footer-tagline body-copy">
          AI-powered hosting, domains, and email for businesses building Africa's digital future — from Lagos to London.
        </p>
        <div class="footer-socials" role="list" aria-label="Social media links">
          <a href="https://twitter.com/onenetservers" class="footer-soc" aria-label="OneNet Servers on X (Twitter)" role="listitem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 1.5L5 6.5L1 11.5H2.5L5.7 7.4L8.5 11.5H12L7.7 6.2L11.5 1.5H10L7 5.3L4.5 1.5H1Z" fill="currentColor"/></svg>
          </a>
          <a href="https://linkedin.com/company/onenetservers" class="footer-soc" aria-label="OneNet Servers on LinkedIn" role="listitem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M4.5 10V6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="4.5" cy="4.5" r=".75" fill="currentColor"/><path d="M7 10V8C7 7.17 7.67 6.5 8.5 6.5S10 7.17 10 8V10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          </a>
          <a href="https://instagram.com/onenetservers" class="footer-soc" aria-label="OneNet Servers on Instagram" role="listitem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" stroke-width="1.2"/><circle cx="10.5" cy="3.5" r=".75" fill="currentColor"/></svg>
          </a>
          <a href="https://youtube.com/@onenetservers" class="footer-soc" aria-label="OneNet Servers on YouTube" role="listitem">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M5.5 5.5L9 7L5.5 8.5V5.5Z" fill="currentColor"/></svg>
          </a>
        </div>
      </div>

      <!-- Links columns -->
      <nav class="footer-col" aria-label="Hosting links">
        <h3 class="footer-col-h">Hosting</h3>
        <ul role="list">
          <li><a href="/hosting/web">Web Hosting</a></li>
          <li><a href="/hosting/wordpress">WordPress Hosting</a></li>
          <li><a href="/hosting/reseller">Reseller Hosting</a></li>
          <li><a href="/hosting/vps">Cloud VPS</a></li>
          <li><a href="#">Garium Private AI <span class="badge-new badge">Soon</span></a></li>
        </ul>
      </nav>

      <nav class="footer-col" aria-label="Domain links">
        <h3 class="footer-col-h">Domains</h3>
        <ul role="list">
          <li><a href="/domains">Register a Domain</a></li>
          <li><a href="/domains/transfer">Transfer a Domain</a></li>
          <li><a href="/domains/ng">.NG Domains</a></li>
          <li><a href="/domains">.COM.NG</a></li>
          <li><a href="/domains">TLD Pricing</a></li>
        </ul>
      </nav>

      <nav class="footer-col" aria-label="Tools and security links">
        <h3 class="footer-col-h">Tools &amp; Security</h3>
        <ul role="list">
          <li><a href="/email">Business Email</a></li>
          <li><a href="/security/ssl">SSL Certificates</a></li>
          <li><a href="/security/oneguard">OneGuard Security</a></li>
          <li><a href="#">Web Design <span class="badge-new badge">Soon</span></a></li>
          <li><a href="/community">Future of Productivity</a></li>
        </ul>
      </nav>

      <!-- Contact column — Fix 14 -->
      <div class="footer-col footer-contact" aria-label="Contact information">
        <h3 class="footer-col-h">Company &amp; Contact</h3>
        <ul role="list">
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact Us</a></li>
          <li><a href="/digital-identity">Digital Identity Initiative</a></li>
          <li><a href="/legal/terms">Terms of Service</a></li>
          <li><a href="/legal/privacy">Privacy Policy</a></li>
        </ul>
        <div class="footer-phones" aria-label="Phone numbers">
          <a href="tel:+2342013309154" class="footer-phone">
            <span class="footer-phone-flag" aria-hidden="true">🇳🇬</span>
            <span>+234 201 330 9154</span>
          </a>
          <a href="tel:+447333880775" class="footer-phone">
            <span class="footer-phone-flag" aria-hidden="true">🇬🇧</span>
            <span>+44 7333 880 7775</span>
          </a>
          <a href="mailto:support@onenetservers.net" class="footer-email">
            support@onenetservers.net
          </a>
        </div>
      </div>

    </div><!-- /footer-grid -->

    <!-- Trust badges (Fix 10 variant) -->
    <div class="footer-trust" role="list" aria-label="Accreditations and registrations">
      <div class="footer-trust-item" role="listitem">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 7L6.5 8.5L9.5 5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        NiRA Accredited
      </div>
      <div class="footer-trust-sep" aria-hidden="true"></div>
      <div class="footer-trust-item" role="listitem">UK RC: 14565201</div>
      <div class="footer-trust-sep" aria-hidden="true"></div>
      <div class="footer-trust-item" role="listitem">NG RC: 1775966</div>
      <div class="footer-trust-sep" aria-hidden="true"></div>
      <div class="footer-trust-item" role="listitem">SCUML Registered</div>
      <div class="footer-trust-sep" aria-hidden="true"></div>
      <div class="footer-trust-item" role="listitem">Green Infrastructure</div>
      <div class="footer-trust-sep" aria-hidden="true"></div>
      <div class="footer-trust-item" role="listitem">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1L8.5 5H12.5L9.3 7.5L10.5 11.5L7 9L3.5 11.5L4.7 7.5L1.5 5H5.5L7 1Z" fill="currentColor"/></svg>
        Tech Nation Endorsed
      </div>
    </div>

    <!-- Legal strip -->
    <div class="footer-legal">
      <p class="footer-legal-text">
        © 2026 OneNet Servers — trading name of ConqolX Technologies Limited. Registered in England &amp; Wales No. 14565201. Registered in Nigeria No. 1775966. SCUML registered. NiRA accredited. Prices shown exclude applicable VAT. First-term prices apply; renewal rates may differ.
      </p>
    </div>

  </div><!-- /container -->
</footer>
```

---

## 17. SCROLL REVEAL WRAPPER

Wrap any element to be animated on scroll:
```html
<div class="reveal" data-delay="0">
  <!-- content -->
</div>
<!-- Stagger: data-delay="1" through data-delay="5" -->
```

The `main.js` IntersectionObserver adds `.is-visible` when the element enters the viewport. `animations.css` handles the transition.

---

*End of COMPONENTS.md*
