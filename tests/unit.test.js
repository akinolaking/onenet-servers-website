/**
 * OneNet Servers — Unit Tests
 * Tests JS logic and CSS rules in isolation.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ─────────────────────────────────────────────
// Unit: Currency conversion logic
// ─────────────────────────────────────────────
describe('Currency conversion math', () => {
  const NGN_RATE = 1550;
  const GBP_RATE = 0.79;

  test('$4.99 → ₦7,734.5 (rounds to 7735)', () => {
    expect(Math.round(4.99 * NGN_RATE)).toBe(7735);
  });

  test('$15.00 → £11.85', () => {
    expect((15.00 * GBP_RATE).toFixed(2)).toBe('11.85');
  });

  test('$23.40 → ₦36,270', () => {
    expect(Math.round(23.40 * NGN_RATE)).toBe(36270);
  });

  test('$95.24 → £75.24', () => {
    expect((95.24 * GBP_RATE).toFixed(2)).toBe('75.24');
  });

  test('$466.70 → ₦723,385', () => {
    expect(Math.round(466.70 * NGN_RATE)).toBe(723385);
  });
});

// ─────────────────────────────────────────────
// Unit: Domain table data attributes are numeric
// ─────────────────────────────────────────────
describe('Domain table — data-usd values are parseable floats', () => {
  const { parse } = require('node-html-parser');

  test('domains/index.html price TDs have numeric data-usd', () => {
    const html = fs.readFileSync(path.join(ROOT, 'domains/index.html'), 'utf8');
    const doc = parse(html);
    const tds = doc.querySelectorAll('td[data-usd]');
    expect(tds.length).toBeGreaterThan(0);
    tds.forEach(td => {
      const val = td.getAttribute('data-usd');
      const num = parseFloat(val);
      expect(isNaN(num)).toBe(false);
    });
  });

  test('domains/index.html data-ngn values are integers', () => {
    const html = fs.readFileSync(path.join(ROOT, 'domains/index.html'), 'utf8');
    const doc = parse(html);
    const tds = doc.querySelectorAll('td[data-ngn]');
    tds.forEach(td => {
      const val = td.getAttribute('data-ngn');
      expect(Number.isInteger(Number(val)) || val === '0').toBe(true);
    });
  });

  test('domains/index.html data-ngn ≈ data-usd × 1550 (±5%)', () => {
    const html = fs.readFileSync(path.join(ROOT, 'domains/index.html'), 'utf8');
    const doc = parse(html);
    const tds = doc.querySelectorAll('td[data-usd][data-ngn]');
    tds.forEach(td => {
      const usd = parseFloat(td.getAttribute('data-usd'));
      const ngn = parseInt(td.getAttribute('data-ngn'));
      if (isNaN(usd) || isNaN(ngn)) return;
      const expected = usd * 1550;
      const diff = Math.abs(ngn - expected) / expected;
      expect(diff).toBeLessThan(0.05); // within 5%
    });
  });
});

// ─────────────────────────────────────────────
// Unit: CSS token values
// ─────────────────────────────────────────────
describe('CSS design tokens — correct values', () => {
  const css = fs.readFileSync(path.join(ROOT, 'shared/tokens.css'), 'utf8');

  const TOKEN_VALUES = {
    '--c-primary': '#4343F0',
    '--c-primary-dark': '#3535C8',
    '--c-ink': '#0F0F1A',
    '--c-green': '#10B981',
    '--c-amber': '#F59E0B',
    '--c-red': '#EF4444',
  };

  Object.entries(TOKEN_VALUES).forEach(([token, value]) => {
    test(`${token}: ${value}`, () => {
      expect(css).toContain(`${token}`);
      expect(css.toLowerCase()).toContain(value.toLowerCase());
    });
  });

  test('--nav-h: 64px', () => {
    expect(css).toMatch(/--nav-h\s*:\s*64px/);
  });
});

// ─────────────────────────────────────────────
// Unit: Nav CSS — fixed position, z-index
// ─────────────────────────────────────────────
describe('Nav CSS — positioning', () => {
  const css = fs.readFileSync(path.join(ROOT, 'shared/nav.css'), 'utf8');

  test('#main-nav is position: fixed', () => {
    expect(css).toMatch(/#main-nav\s*\{[^}]*position\s*:\s*fixed/);
  });

  test('#main-nav has z-index >= 100', () => {
    const match = css.match(/#main-nav\s*\{([^}]+)\}/);
    expect(match).not.toBeNull();
    const zMatch = match[1].match(/z-index\s*:\s*(\d+)/);
    expect(zMatch).not.toBeNull();
    expect(parseInt(zMatch[1])).toBeGreaterThanOrEqual(100);
  });

  test('.currency-btn.active style present', () => {
    expect(css).toContain('.currency-btn');
  });
});

// ─────────────────────────────────────────────
// Unit: Hero CSS — no double nav offset
// ─────────────────────────────────────────────
describe('Hero CSS — single nav offset', () => {
  const layoutCss = fs.readFileSync(path.join(ROOT, 'shared/layout.css'), 'utf8');
  const componentsCss = fs.readFileSync(path.join(ROOT, 'shared/components.css'), 'utf8');

  test('.hero does not use calc(var(--nav-h) in padding', () => {
    const heroBlock = layoutCss.match(/\.hero\s*\{([^}]+)\}/);
    if (heroBlock) {
      expect(heroBlock[1]).not.toContain('calc(var(--nav-h)');
    }
  });

  test('.page-hero-simple does not use calc(var(--nav-h) in padding', () => {
    expect(componentsCss).not.toMatch(/\.page-hero-simple\s*\{[^}]*calc\(var\(--nav-h\)/);
  });
});

// ─────────────────────────────────────────────
// Unit: main.js — setCurrency is global-safe
// ─────────────────────────────────────────────
describe('main.js — function declarations', () => {
  const js = fs.readFileSync(path.join(ROOT, 'shared/main.js'), 'utf8');

  test('setCurrency is a function declaration (not const/let)', () => {
    expect(js).toMatch(/^function setCurrency/m);
  });

  test('applyBillingCycle is a function declaration', () => {
    expect(js).toMatch(/^function applyBillingCycle/m);
  });

  test('updateAllPrices handles [data-usd][data-ngn][data-gbp]', () => {
    expect(js).toContain('data-usd');
    expect(js).toContain('data-ngn');
    expect(js).toContain('data-gbp');
  });

  test('billing cycle updates cart link hrefs', () => {
    expect(js).toContain('billingcycle=');
  });

  test('no syntax error — valid JS structure (basic check)', () => {
    // Check balanced braces
    let depth = 0;
    let inString = false;
    let strChar = '';
    for (let i = 0; i < js.length; i++) {
      const c = js[i];
      if (inString) {
        if (c === strChar && js[i-1] !== '\\') inString = false;
      } else {
        if (c === '"' || c === "'" || c === '`') { inString = true; strChar = c; }
        else if (c === '{') depth++;
        else if (c === '}') depth--;
      }
    }
    expect(depth).toBe(0);
  });
});

// ─────────────────────────────────────────────
// Unit: WHMCS links — cart.php pattern
// ─────────────────────────────────────────────
describe('WHMCS links — correct cart.php format', () => {
  const { parse } = require('node-html-parser');

  PRODUCT_PAGES_LIST = [
    'hosting/web.html', 'hosting/wordpress.html', 'hosting/reseller.html', 'hosting/vps.html',
    'email/index.html', 'security/ssl.html',
  ];

  PRODUCT_PAGES_LIST.forEach(p => {
    test(`${p} — cart links use /cart.php?a=add`, () => {
      const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
      const doc = parse(html);
      const cartLinks = doc.querySelectorAll('a[href*="/cart.php"]');
      expect(cartLinks.length).toBeGreaterThan(0);
      cartLinks.forEach(link => {
        const href = link.getAttribute('href');
        expect(href).toMatch(/\/cart\.php\?a=add/);
      });
    });
  });
});
