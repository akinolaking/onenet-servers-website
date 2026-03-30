/**
 * OneNet Servers — Structural + E2E HTML Tests
 * Tests every committed page against the spec requirements.
 */

const { parse } = require('node-html-parser');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function readPage(filePath) {
  const full = path.join(ROOT, filePath);
  if (!fs.existsSync(full)) throw new Error(`Missing: ${filePath}`);
  return parse(fs.readFileSync(full, 'utf8'));
}

const ALL_PAGES = [
  'index.html',
  'about.html',
  'contact.html',
  'digital-identity.html',
  'community.html',
  'hosting/web.html',
  'hosting/wordpress.html',
  'hosting/reseller.html',
  'hosting/vps.html',
  'domains/index.html',
  'domains/transfer.html',
  'domains/ng.html',
  'email/index.html',
  'security/ssl.html',
  'security/oneguard.html',
  'legal/terms.html',
  'legal/privacy.html',
  'legal/agreement.html',
];

const PRODUCT_PAGES = ALL_PAGES.filter(p =>
  p.startsWith('hosting/') || p.startsWith('domains/') ||
  p.startsWith('email/') || p.startsWith('security/')
);

const PRICE_PAGES = [
  'hosting/web.html', 'hosting/wordpress.html', 'hosting/reseller.html',
  'hosting/vps.html', 'domains/index.html', 'domains/transfer.html',
  'domains/ng.html', 'email/index.html', 'security/ssl.html', 'security/oneguard.html',
];

// ─────────────────────────────────────────────
// 1. PAGE EXISTS
// ─────────────────────────────────────────────
describe('1. All 18 pages exist', () => {
  ALL_PAGES.forEach(p => {
    test(p, () => {
      expect(fs.existsSync(path.join(ROOT, p))).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────
// 2. NAV — structure and links
// ─────────────────────────────────────────────
describe('2. Nav — structure', () => {
  ALL_PAGES.forEach(p => {
    test(`${p} has #main-nav`, () => {
      const doc = readPage(p);
      expect(doc.querySelector('#main-nav')).not.toBeNull();
    });

    test(`${p} login → /login.php`, () => {
      const doc = readPage(p);
      const loginLinks = doc.querySelectorAll('a[href="/login.php"]');
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    });

    test(`${p} has get-started CTA linking to /cart.php`, () => {
      const doc = readPage(p);
      const cartLinks = doc.querySelectorAll('a[href*="/cart.php"]');
      expect(cartLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});

// ─────────────────────────────────────────────
// 3. HEADER — no double nav offset
// ─────────────────────────────────────────────
describe('3. Header offset — layout.css', () => {
  test('layout.css .hero padding does NOT contain calc(var(--nav-h)', () => {
    const css = fs.readFileSync(path.join(ROOT, 'shared/layout.css'), 'utf8');
    const matches = css.match(/\.hero\s*\{[^}]*padding[^}]*calc\(var\(--nav-h\)/g);
    expect(matches).toBeNull();
  });

  test('components.css .page-hero-simple does NOT contain calc(var(--nav-h)', () => {
    const css = fs.readFileSync(path.join(ROOT, 'shared/components.css'), 'utf8');
    const match = css.match(/\.page-hero-simple\s*\{[^}]*calc\(var\(--nav-h\)/);
    expect(match).toBeNull();
  });

  test('.page-body has padding-top: var(--nav-h)', () => {
    const css = fs.readFileSync(path.join(ROOT, 'shared/tokens.css'), 'utf8');
    expect(css).toMatch(/\.page-body\s*\{[^}]*padding-top:\s*var\(--nav-h\)/);
  });
});

// ─────────────────────────────────────────────
// 4. CURRENCY — data attributes on price elements
// ─────────────────────────────────────────────
describe('4. Currency switching — data attributes', () => {
  test('domains/index.html table TDs have data-usd + data-ngn + data-gbp', () => {
    const doc = readPage('domains/index.html');
    const priceTds = doc.querySelectorAll('td[data-usd][data-ngn][data-gbp]');
    expect(priceTds.length).toBeGreaterThanOrEqual(10);
  });

  test('domains/transfer.html table TDs have data-usd', () => {
    const doc = readPage('domains/transfer.html');
    const priceTds = doc.querySelectorAll('td[data-usd]');
    expect(priceTds.length).toBeGreaterThanOrEqual(1);
  });

  test('domains/ng.html table TDs have data-usd', () => {
    const doc = readPage('domains/ng.html');
    const priceTds = doc.querySelectorAll('td[data-usd]');
    expect(priceTds.length).toBeGreaterThanOrEqual(1);
  });

  test('security/ssl.html table TDs have data-usd', () => {
    const doc = readPage('security/ssl.html');
    const priceTds = doc.querySelectorAll('td[data-usd]');
    expect(priceTds.length).toBeGreaterThanOrEqual(1);
  });

  PRICE_PAGES.forEach(p => {
    test(`${p} — plan cards have data-m and data-a (billing toggle)`, () => {
      const doc = readPage(p);
      const planNums = doc.querySelectorAll('.plan-num');
      if (planNums.length === 0) return; // page may not have plan cards
      const withToggle = planNums.filter(el =>
        el.getAttribute('data-m') && el.getAttribute('data-a')
      );
      expect(withToggle.length).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────
// 5. NO EMOJIS in text content
// ─────────────────────────────────────────────
describe('5. No emojis in HTML text', () => {
  const emojiRegex = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/u;

  ALL_PAGES.forEach(p => {
    test(`${p} — no emoji unicode in raw HTML`, () => {
      const raw = fs.readFileSync(path.join(ROOT, p), 'utf8');
      const found = [];
      for (const char of raw) {
        if (emojiRegex.test(char)) found.push(char);
      }
      expect(found).toEqual([]);
    });
  });
});

// ─────────────────────────────────────────────
// 6. NO hardcoded font-weight 700/800
// ─────────────────────────────────────────────
describe('6. No font-weight 700/800', () => {
  const cssFiles = [
    'shared/tokens.css', 'shared/layout.css', 'shared/components.css',
    'shared/nav.css', 'shared/footer.css', 'shared/animations.css',
  ];

  cssFiles.forEach(f => {
    test(`${f} — no font-weight: 700 or 800`, () => {
      const css = fs.readFileSync(path.join(ROOT, f), 'utf8');
      const matches = css.match(/font-weight\s*:\s*[78]00/g);
      expect(matches).toBeNull();
    });
  });

  ALL_PAGES.forEach(p => {
    test(`${p} — no inline font-weight: 700/800`, () => {
      const raw = fs.readFileSync(path.join(ROOT, p), 'utf8');
      const matches = raw.match(/style="[^"]*font-weight\s*:\s*[78]00/g);
      expect(matches).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────
// 7. DESIGN TOKENS — required vars present
// ─────────────────────────────────────────────
describe('7. Design tokens', () => {
  const REQUIRED_TOKENS = [
    '--c-primary', '--c-primary-dark', '--c-ink', '--c-body',
    '--c-muted', '--c-border', '--c-bg', '--c-bg-alt', '--c-green',
  ];

  test('tokens.css has all required CSS custom properties', () => {
    const css = fs.readFileSync(path.join(ROOT, 'shared/tokens.css'), 'utf8');
    REQUIRED_TOKENS.forEach(token => {
      expect(css).toContain(token);
    });
  });

  test('tokens.css --nav-h is defined', () => {
    const css = fs.readFileSync(path.join(ROOT, 'shared/tokens.css'), 'utf8');
    expect(css).toMatch(/--nav-h\s*:/);
  });
});

// ─────────────────────────────────────────────
// 8. CHAT FAB present on all pages
// ─────────────────────────────────────────────
describe('8. Chat FAB', () => {
  ALL_PAGES.forEach(p => {
    test(`${p} has .chat-fab`, () => {
      const doc = readPage(p);
      expect(doc.querySelector('.chat-fab')).not.toBeNull();
    });
  });
});

// ─────────────────────────────────────────────
// 9. EXIT BAR present on all pages
// ─────────────────────────────────────────────
describe('9. Exit bar', () => {
  ALL_PAGES.forEach(p => {
    test(`${p} has #exit-bar`, () => {
      const doc = readPage(p);
      expect(doc.querySelector('#exit-bar')).not.toBeNull();
    });
  });
});

// ─────────────────────────────────────────────
// 10. STICKY CTA on product pages
// ─────────────────────────────────────────────
describe('10. Sticky CTA bar on product pages', () => {
  PRODUCT_PAGES.forEach(p => {
    test(`${p} has .sticky-cta`, () => {
      const doc = readPage(p);
      expect(doc.querySelector('.sticky-cta')).not.toBeNull();
    });
  });
});

// ─────────────────────────────────────────────
// 11. SEO — meta tags and canonical
// ─────────────────────────────────────────────
describe('11. SEO — meta tags', () => {
  ALL_PAGES.forEach(p => {
    test(`${p} has meta description`, () => {
      const doc = readPage(p);
      const meta = doc.querySelector('meta[name="description"]');
      expect(meta).not.toBeNull();
      const content = meta?.getAttribute('content') || '';
      expect(content.length).toBeGreaterThan(50);
    });

    test(`${p} has canonical link`, () => {
      const doc = readPage(p);
      expect(doc.querySelector('link[rel="canonical"]')).not.toBeNull();
    });

    test(`${p} has og:title`, () => {
      const doc = readPage(p);
      expect(doc.querySelector('meta[property="og:title"]')).not.toBeNull();
    });
  });
});

// ─────────────────────────────────────────────
// 12. FOOTER — phone numbers and legal text
// ─────────────────────────────────────────────
describe('12. Footer — contact info', () => {
  ALL_PAGES.forEach(p => {
    test(`${p} has NG phone number`, () => {
      const raw = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(raw).toContain('+234');
    });

    test(`${p} has UK phone number`, () => {
      const raw = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(raw).toContain('+44');
    });

    test(`${p} has company registration`, () => {
      const raw = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(raw).toContain('14565201');
    });
  });
});

// ─────────────────────────────────────────────
// 13. MAIN.JS — required functions exist
// ─────────────────────────────────────────────
describe('13. main.js — required functions', () => {
  const js = fs.readFileSync(path.join(ROOT, 'shared/main.js'), 'utf8');

  const REQUIRED_FUNCTIONS = [
    'setCurrency', 'applyBillingCycle', 'updateAllPrices',
    'initFAQ', 'initScrollReveal', 'initBillingToggle',
  ];

  REQUIRED_FUNCTIONS.forEach(fn => {
    test(`function ${fn} is defined`, () => {
      expect(js).toMatch(new RegExp(`function ${fn}\\s*\\(`));
    });
  });

  test('setCurrency handles NGN, GBP, USD', () => {
    expect(js).toContain("'NGN'");
    expect(js).toContain("'GBP'");
    expect(js).toContain("'USD'");
  });

  test('currency rates present (1550 NGN, 0.79 GBP)', () => {
    expect(js).toContain('1550');
    expect(js).toContain('0.79');
  });

  test('localStorage key for currency', () => {
    expect(js).toContain('onenet_currency');
  });
});

// ─────────────────────────────────────────────
// 14. NO # or void CTAs on product pages
// ─────────────────────────────────────────────
describe('14. No dead href="#" on CTA buttons', () => {
  PRODUCT_PAGES.forEach(p => {
    test(`${p} — no btn class with href="#"`, () => {
      const doc = readPage(p);
      const deadLinks = doc.querySelectorAll('a.btn[href="#"]');
      expect(deadLinks.length).toBe(0);
    });
  });
});

// ─────────────────────────────────────────────
// 15. PAGE CONTENT DEPTH (not a stub)
// ─────────────────────────────────────────────
describe('15. Page content depth — not a stub', () => {
  ALL_PAGES.forEach(p => {
    test(`${p} is > 200 lines`, () => {
      const raw = fs.readFileSync(path.join(ROOT, p), 'utf8');
      const lines = raw.split('\n').length;
      expect(lines).toBeGreaterThan(200);
    });
  });
});
