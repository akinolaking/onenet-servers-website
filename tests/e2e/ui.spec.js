/**
 * E2E: UI Structure — DOM tests via Playwright APIRequestContext + node-html-parser
 */
const { test, expect, request } = require('@playwright/test');
const { parse } = require('node-html-parser');

const BASE = 'http://localhost:4321';
let ctx;
test.beforeAll(async () => { ctx = await request.newContext({ baseURL: BASE }); });
test.afterAll(async () => { await ctx.dispose(); });

async function getDoc(path) {
  const res = await ctx.get(path);
  const html = await res.text();
  return { doc: parse(html), html };
}

// ── Nav ──────────────────────────────────────────────────────────────────────
test.describe('Nav structure', () => {
  const ALL = ['/', '/hosting/web', '/domains', '/email', '/legal/terms'];
  for (const p of ALL) {
    test(`${p} — #main-nav present`, async () => {
      const { doc } = await getDoc(p);
      expect(doc.querySelector('#main-nav')).not.toBeNull();
    });
    test(`${p} — /login.php link present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('/login.php');
    });
    test(`${p} — /cart.php link present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('/cart.php');
    });
    test(`${p} — logo img present`, async () => {
      const { doc } = await getDoc(p);
      const logo = doc.querySelector('.nav-brand img, #main-nav img');
      expect(logo).not.toBeNull();
    });
  }
});

// ── Hero ──────────────────────────────────────────────────────────────────────
test.describe('Hero section', () => {
  const PAGES = ['/', '/hosting/web', '/hosting/vps', '/domains', '/email'];
  for (const p of PAGES) {
    test(`${p} — H1 exists and non-empty`, async () => {
      const { doc } = await getDoc(p);
      const h1 = doc.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1.text.trim().length).toBeGreaterThan(5);
    });
    test(`${p} — hero CTA button not href="#"`, async () => {
      const { doc } = await getDoc(p);
      const deadBtns = doc.querySelectorAll('.hero a.btn[href="#"], .hero .btn-primary[href="#"]');
      expect(deadBtns.length).toBe(0);
    });
  }
  test('/ — reassurance microcopy present', async () => {
    const { doc } = await getDoc('/');
    const r = doc.querySelector('.cta-reassurance, .reassurance-item, .hero-reassurance');
    expect(r).not.toBeNull();
  });
});

// ── Pricing ───────────────────────────────────────────────────────────────────
test.describe('Pricing cards', () => {
  const HOSTING = ['/hosting/web', '/hosting/wordpress', '/hosting/reseller', '/hosting/vps'];
  for (const p of HOSTING) {
    test(`${p} — ≥3 plan cards`, async () => {
      const { doc } = await getDoc(p);
      expect(doc.querySelectorAll('.plan-card').length).toBeGreaterThanOrEqual(3);
    });
    test(`${p} — each plan card has a CTA button`, async () => {
      const { doc } = await getDoc(p);
      const cards = doc.querySelectorAll('.plan-card');
      cards.forEach(card => {
        const btn = card.querySelector('a.btn, .btn-primary, .btn');
        expect(btn).not.toBeNull();
      });
    });
    test(`${p} — plan prices visible (.plan-num)`, async () => {
      const { doc } = await getDoc(p);
      expect(doc.querySelectorAll('.plan-num').length).toBeGreaterThanOrEqual(3);
    });
    test(`${p} — 30-day MBG mentioned`, async () => {
      const { html } = await getDoc(p);
      expect(html.toLowerCase()).toMatch(/30.day|money.back/);
    });
  }
});

// ── Footer ────────────────────────────────────────────────────────────────────
test.describe('Footer content', () => {
  const PAGES = ['/', '/hosting/web', '/domains', '/email', '/legal/terms'];
  for (const p of PAGES) {
    test(`${p} — NG phone +234 present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('+234');
    });
    test(`${p} — UK phone +44 present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('+44');
    });
    test(`${p} — company reg 14565201 present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('14565201');
    });
    test(`${p} — NiRA mentioned`, async () => {
      const { html } = await getDoc(p);
      expect(html.toLowerCase()).toContain('nira');
    });
    test(`${p} — support@onenetservers.net present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('support@onenetservers.net');
    });
  }
});

// ── Product page components ───────────────────────────────────────────────────
test.describe('Product page required components', () => {
  const PRODUCT = [
    '/hosting/web', '/hosting/wordpress', '/hosting/reseller', '/hosting/vps',
    '/domains', '/email', '/security/ssl', '/security/oneguard',
  ];
  for (const p of PRODUCT) {
    test(`${p} — sticky CTA present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('sticky-cta');
    });
    test(`${p} — FAQ section present`, async () => {
      const { doc } = await getDoc(p);
      expect(doc.querySelectorAll('.faq-item').length).toBeGreaterThanOrEqual(3);
    });
    test(`${p} — trust badge strip present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toMatch(/trust.badge|hero.trust/i);
    });
  }
});

// ── Universal components ──────────────────────────────────────────────────────
test.describe('Universal components — all 18 pages', () => {
  const ALL = [
    '/', '/about', '/contact', '/digital-identity', '/community',
    '/hosting/web', '/hosting/wordpress', '/hosting/reseller', '/hosting/vps',
    '/domains', '/domains/transfer', '/domains/ng', '/email',
    '/security/ssl', '/security/oneguard',
    '/legal/terms', '/legal/privacy', '/legal/agreement',
  ];
  for (const p of ALL) {
    test(`${p} — chat FAB present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('chat-fab');
    });
    test(`${p} — exit bar present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('exit-bar');
    });
  }
});

// ── SEO ───────────────────────────────────────────────────────────────────────
test.describe('SEO meta tags', () => {
  const ALL = ['/', '/hosting/web', '/domains', '/email', '/security/ssl'];
  for (const p of ALL) {
    test(`${p} — meta description ≥50 chars`, async () => {
      const { doc } = await getDoc(p);
      const meta = doc.querySelector('meta[name="description"]');
      expect(meta).not.toBeNull();
      expect((meta.getAttribute('content') || '').length).toBeGreaterThanOrEqual(50);
    });
    test(`${p} — canonical link present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('rel="canonical"');
    });
    test(`${p} — og:title present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('og:title');
    });
    test(`${p} — JSON-LD schema present`, async () => {
      const { html } = await getDoc(p);
      expect(html).toContain('application/ld+json');
    });
  }
});

// ── Design compliance ─────────────────────────────────────────────────────────
test.describe('Design compliance', () => {
  const CSS_FILES = [
    '/shared/tokens.css', '/shared/layout.css', '/shared/components.css', '/shared/nav.css',
  ];

  test('tokens.css contains --c-primary: #4343F0', async () => {
    const res = await ctx.get('/shared/tokens.css');
    const css = await res.text();
    expect(css).toContain('--c-primary');
    expect(css).toContain('#4343F0');
  });

  test('tokens.css contains --nav-h: 64px', async () => {
    const res = await ctx.get('/shared/tokens.css');
    const css = await res.text();
    expect(css).toMatch(/--nav-h\s*:\s*64px/);
  });

  test('layout.css .hero has no calc(var(--nav-h)) double-offset', async () => {
    const res = await ctx.get('/shared/layout.css');
    const css = await res.text();
    const heroBlock = css.match(/\.hero\s*\{([^}]+)\}/);
    if (heroBlock) expect(heroBlock[1]).not.toContain('calc(var(--nav-h)');
  });

  test('main.js defines setCurrency globally', async () => {
    const res = await ctx.get('/shared/main.js');
    const js = await res.text();
    expect(js).toMatch(/^function setCurrency/m);
  });

  test('main.js defines applyBillingCycle globally', async () => {
    const res = await ctx.get('/shared/main.js');
    const js = await res.text();
    expect(js).toMatch(/^function applyBillingCycle/m);
  });

  test('main.js contains NGN rate 1550', async () => {
    const res = await ctx.get('/shared/main.js');
    const js = await res.text();
    expect(js).toContain('1550');
  });

  test('main.js contains GBP rate 0.79', async () => {
    const res = await ctx.get('/shared/main.js');
    const js = await res.text();
    expect(js).toContain('0.79');
  });

  for (const f of CSS_FILES) {
    test(`${f} — no font-weight: 700 or 800`, async () => {
      const res = await ctx.get(f);
      const css = await res.text();
      expect(css).not.toMatch(/font-weight\s*:\s*[78]00/);
    });
  }
});

// ── Domain search ─────────────────────────────────────────────────────────────
test.describe('Domain search markup', () => {
  test('/ — domain search input present', async () => {
    const { html } = await getDoc('/');
    expect(html).toMatch(/domain.search.input|id="domain-search|type="text"[^>]*domain/i);
  });
  test('/domains — domain search form present', async () => {
    const { doc } = await getDoc('/domains');
    const form = doc.querySelector('#domain-search-form, .domain-search-wrap form, form[id*="domain"]');
    expect(form).not.toBeNull();
  });
});
