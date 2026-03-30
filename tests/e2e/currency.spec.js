/**
 * E2E: Currency & Pricing — HTML content tests via Playwright APIRequestContext
 */
const { test, expect, request } = require('@playwright/test');
const { parse } = require('node-html-parser');

const BASE = 'http://localhost:4321';
let ctx;

test.beforeAll(async () => { ctx = await request.newContext({ baseURL: BASE }); });
test.afterAll(async () => { await ctx.dispose(); });

async function getDoc(path) {
  const res = await ctx.get(path);
  return parse(await res.text());
}

test.describe('Currency data attributes — plan cards', () => {
  const PLAN_PAGES = [
    '/hosting/web', '/hosting/wordpress', '/hosting/reseller',
    '/hosting/vps', '/email', '/security/oneguard',
  ];

  for (const p of PLAN_PAGES) {
    test(`${p} — .plan-num elements exist`, async () => {
      const doc = await getDoc(p);
      const nums = doc.querySelectorAll('.plan-num');
      expect(nums.length).toBeGreaterThanOrEqual(1);
    });
  }

  for (const p of ['/hosting/web', '/hosting/reseller', '/hosting/vps']) {
    test(`${p} — plan cards have data-m (monthly price)`, async () => {
      const doc = await getDoc(p);
      const withM = doc.querySelectorAll('[data-m]');
      expect(withM.length).toBeGreaterThan(0);
    });

    test(`${p} — plan cards have data-a (annual price)`, async () => {
      const doc = await getDoc(p);
      const withA = doc.querySelectorAll('[data-a]');
      expect(withA.length).toBeGreaterThan(0);
    });
  }
});

test.describe('Currency data attributes — domain tables', () => {
  test('/domains — TLD chip prices have data-usd, data-ngn, data-gbp', async () => {
    const doc = await getDoc('/domains');
    const chips = doc.querySelectorAll('.tld-price[data-usd][data-ngn][data-gbp]');
    expect(chips.length).toBeGreaterThanOrEqual(4);
  });

  test('/domains — pricing table TDs have data-usd', async () => {
    const doc = await getDoc('/domains');
    const tds = doc.querySelectorAll('td[data-usd]');
    expect(tds.length).toBeGreaterThanOrEqual(10);
  });

  test('/domains — pricing table TDs have data-ngn', async () => {
    const doc = await getDoc('/domains');
    const tds = doc.querySelectorAll('td[data-ngn]');
    expect(tds.length).toBeGreaterThanOrEqual(10);
  });

  test('/domains — pricing table TDs have data-gbp', async () => {
    const doc = await getDoc('/domains');
    const tds = doc.querySelectorAll('td[data-gbp]');
    expect(tds.length).toBeGreaterThanOrEqual(10);
  });

  test('/domains/transfer — table TDs have data-usd', async () => {
    const doc = await getDoc('/domains/transfer');
    const tds = doc.querySelectorAll('td[data-usd]');
    expect(tds.length).toBeGreaterThanOrEqual(1);
  });

  test('/domains/ng — table TDs have data-usd', async () => {
    const doc = await getDoc('/domains/ng');
    const tds = doc.querySelectorAll('td[data-usd]');
    expect(tds.length).toBeGreaterThanOrEqual(1);
  });

  test('/security/ssl — table TDs have data-usd', async () => {
    const doc = await getDoc('/security/ssl');
    const tds = doc.querySelectorAll('td[data-usd]');
    expect(tds.length).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Currency data value integrity', () => {
  test('/domains — data-usd values are numeric', async () => {
    const doc = await getDoc('/domains');
    doc.querySelectorAll('td[data-usd]').forEach(td => {
      expect(isNaN(parseFloat(td.getAttribute('data-usd')))).toBe(false);
    });
  });

  test('/domains — data-ngn ≈ data-usd × 1550 (within 5%)', async () => {
    const doc = await getDoc('/domains');
    doc.querySelectorAll('td[data-usd][data-ngn]').forEach(td => {
      const usd = parseFloat(td.getAttribute('data-usd'));
      const ngn = parseInt(td.getAttribute('data-ngn'));
      if (isNaN(usd) || isNaN(ngn) || usd === 0) return;
      expect(Math.abs(ngn - usd * 1550) / (usd * 1550)).toBeLessThan(0.05);
    });
  });

  test('/domains — data-gbp ≈ data-usd × 0.79 (within 5%)', async () => {
    const doc = await getDoc('/domains');
    doc.querySelectorAll('td[data-usd][data-gbp]').forEach(td => {
      const usd = parseFloat(td.getAttribute('data-usd'));
      const gbp = parseFloat(td.getAttribute('data-gbp'));
      if (isNaN(usd) || isNaN(gbp) || usd === 0) return;
      expect(Math.abs(gbp - usd * 0.79) / (usd * 0.79)).toBeLessThan(0.05);
    });
  });
});

test.describe('Billing toggle markup', () => {
  test('/hosting/web — billing toggle element present', async () => {
    const html = await (await ctx.get('/hosting/web')).text();
    const hasBillingToggle = html.includes('billing-toggle') ||
      html.includes('data-cycle-btn') ||
      html.includes('toggle-btn');
    expect(hasBillingToggle).toBe(true);
  });

  test('/hosting/web — annual and monthly labels present', async () => {
    const html = await (await ctx.get('/hosting/web')).text();
    expect(html.toLowerCase()).toMatch(/annual|yearly/);
    expect(html.toLowerCase()).toMatch(/month/);
  });
});
