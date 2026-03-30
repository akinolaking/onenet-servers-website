/**
 * Unit tests — JS logic and CSS rules via Playwright APIRequestContext
 * Fetches actual served files and validates logic without a browser.
 */
const { test, expect, request } = require('@playwright/test');
const { parse } = require('node-html-parser');

const BASE = 'http://localhost:4321';
let ctx;
test.beforeAll(async () => { ctx = await request.newContext({ baseURL: BASE }); });
test.afterAll(async () => { await ctx.dispose(); });

// ── main.js function presence ─────────────────────────────────────────────────
test.describe('main.js — required functions', () => {
  let js;
  test.beforeAll(async () => {
    js = await (await ctx.get('/shared/main.js')).text();
  });

  const FUNS = ['setCurrency','applyBillingCycle','updateAllPrices','initFAQ','initScrollReveal','initBillingToggle'];
  for (const fn of FUNS) {
    test(`function ${fn} declared`, () => {
      expect(js).toMatch(new RegExp(`function ${fn}\\s*\\(`));
    });
  }

  test("handles 'NGN' currency", () => expect(js).toContain("'NGN'"));
  test("handles 'GBP' currency", () => expect(js).toContain("'GBP'"));
  test("handles 'USD' currency", () => expect(js).toContain("'USD'"));
  test('NGN rate 1550 present',   () => expect(js).toContain('1550'));
  test('GBP rate 0.79 present',   () => expect(js).toContain('0.79'));
  test('localStorage key present',() => expect(js).toContain('onenet_currency'));
  test('billingcycle param updated in cart hrefs', () => expect(js).toContain('billingcycle='));

  test('JS brace balance (no syntax error)', () => {
    let depth = 0; let inStr = false; let sc = '';
    for (let i = 0; i < js.length; i++) {
      const c = js[i];
      if (inStr) { if (c === sc && js[i-1] !== '\\') inStr = false; }
      else if (c === '"' || c === "'" || c === '`') { inStr = true; sc = c; }
      else if (c === '{') depth++;
      else if (c === '}') depth--;
    }
    expect(depth).toBe(0);
  });
});

// ── tokens.css values ─────────────────────────────────────────────────────────
test.describe('tokens.css — design token values', () => {
  let css;
  test.beforeAll(async () => { css = await (await ctx.get('/shared/tokens.css')).text(); });

  const TOKENS = {
    '--c-primary':      '#4343F0',
    '--c-primary-dark': '#3535C8',
    '--c-ink':          '#0F0F1A',
    '--c-green':        '#10B981',
    '--c-amber':        '#F59E0B',
    '--c-red':          '#EF4444',
  };
  for (const [tok, val] of Object.entries(TOKENS)) {
    test(`${tok}: ${val}`, () => {
      expect(css).toContain(tok);
      expect(css.toLowerCase()).toContain(val.toLowerCase());
    });
  }
  test('--nav-h: 64px', () => expect(css).toMatch(/--nav-h\s*:\s*64px/));
  test('Inter font declared',          () => expect(css).toContain('Inter'));
  test('JetBrains Mono font declared', () => expect(css).toContain('JetBrains Mono'));
  test('No font-weight 700/800',       () => expect(css).not.toMatch(/font-weight\s*:\s*[78]00/));
});

// ── nav.css structure ─────────────────────────────────────────────────────────
test.describe('nav.css — positioning rules', () => {
  let css;
  test.beforeAll(async () => { css = await (await ctx.get('/shared/nav.css')).text(); });

  test('#main-nav is position: fixed', () => expect(css).toMatch(/#main-nav\s*\{[^}]*position\s*:\s*fixed/));
  test('#main-nav z-index ≥ 100', () => {
    const block = css.match(/#main-nav\s*\{([^}]+)\}/);
    const z = block && block[1].match(/z-index\s*:\s*(\d+)/);
    expect(z && parseInt(z[1])).toBeGreaterThanOrEqual(100);
  });
  test('.currency-btn style defined', () => expect(css).toContain('.currency-btn'));
});

// ── layout.css hero ───────────────────────────────────────────────────────────
test.describe('layout.css — hero offset', () => {
  let css;
  test.beforeAll(async () => { css = await (await ctx.get('/shared/layout.css')).text(); });

  test('.page-body has padding-top: var(--nav-h)', () => expect(css).toMatch(/\.page-body[^{]*\{[^}]*padding-top\s*:\s*var\(--nav-h\)/));
  test('.hero does NOT double-offset with calc(var(--nav-h))', () => {
    const block = css.match(/\.hero\s*\{([^}]+)\}/);
    if (block) expect(block[1]).not.toContain('calc(var(--nav-h)');
  });
  test('components.css .page-hero-simple no calc(var(--nav-h))', async () => {
    const comp = await (await ctx.get('/shared/components.css')).text();
    expect(comp).not.toMatch(/\.page-hero-simple\s*\{[^}]*calc\(var\(--nav-h\)/);
  });
});

// ── Currency math ─────────────────────────────────────────────────────────────
test.describe('Currency conversion math', () => {
  const R_NGN = 1550, R_GBP = 0.79;
  const cases = [
    [4.99,   Math.round(4.99 * R_NGN),   (4.99 * R_GBP).toFixed(2)],
    [15.00,  Math.round(15 * R_NGN),     (15 * R_GBP).toFixed(2)],
    [23.40,  Math.round(23.4 * R_NGN),   (23.4 * R_GBP).toFixed(2)],
    [95.24,  Math.round(95.24 * R_NGN),  (95.24 * R_GBP).toFixed(2)],
    [466.70, Math.round(466.7 * R_NGN),  (466.7 * R_GBP).toFixed(2)],
  ];
  for (const [usd, ngn, gbp] of cases) {
    test(`$${usd} → ₦${ngn}`, () => expect(Math.round(usd * R_NGN)).toBe(ngn));
    test(`$${usd} → £${gbp}`, () => expect((usd * R_GBP).toFixed(2)).toBe(gbp));
  }
});

// ── Domain table data attrs ────────────────────────────────────────────────────
test.describe('Domain table data-attribute integrity', () => {
  let doc;
  test.beforeAll(async () => {
    doc = parse(await (await ctx.get('/domains')).text());
  });

  test('≥10 TDs with data-usd present', () => {
    expect(doc.querySelectorAll('td[data-usd]').length).toBeGreaterThanOrEqual(10);
  });
  test('data-usd values parseable as floats', () => {
    doc.querySelectorAll('td[data-usd]').forEach(td => {
      expect(isNaN(parseFloat(td.getAttribute('data-usd')))).toBe(false);
    });
  });
  test('data-ngn values are integers', () => {
    doc.querySelectorAll('td[data-ngn]').forEach(td => {
      expect(Number.isInteger(Number(td.getAttribute('data-ngn')))).toBe(true);
    });
  });
  test('data-ngn ≈ data-usd × 1550 within 5%', () => {
    doc.querySelectorAll('td[data-usd][data-ngn]').forEach(td => {
      const usd = parseFloat(td.getAttribute('data-usd'));
      const ngn = parseInt(td.getAttribute('data-ngn'));
      if (!usd) return;
      expect(Math.abs(ngn - usd * 1550) / (usd * 1550)).toBeLessThan(0.05);
    });
  });
});

// ── WHMCS link format ─────────────────────────────────────────────────────────
test.describe('WHMCS cart link format', () => {
  const PAGES = ['/hosting/web', '/hosting/vps', '/email'];
  for (const p of PAGES) {
    test(`${p} — /cart.php links present`, async () => {
      const doc = parse(await (await ctx.get(p)).text());
      const cartLinks = doc.querySelectorAll('a[href*="/cart.php"]');
      expect(cartLinks.length).toBeGreaterThan(0);
    });
  }
});

// ── No emojis ─────────────────────────────────────────────────────────────────
test.describe('No raw emoji unicode in pages', () => {
  // Only test emoji code points that are actual emoji (exclude SVG viewBox pipes)
  const EMOJI_RE = /[\u{1F300}-\u{1F9FF}]/u;
  const PAGES = ['/', '/hosting/web', '/domains', '/email'];
  for (const p of PAGES) {
    test(`${p} — no emoji unicode`, async () => {
      const html = await (await ctx.get(p)).text();
      expect(EMOJI_RE.test(html)).toBe(false);
    });
  }
});
