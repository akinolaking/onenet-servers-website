/**
 * E2E: Navigation — HTTP-level tests via Playwright APIRequestContext
 * No browser required. Tests actual server responses.
 */
const { test, expect, request } = require('@playwright/test');

const BASE = 'http://localhost:4321';

const PAGES = [
  { path: '/',                  title: 'OneNet Servers' },
  { path: '/about',             title: 'About' },
  { path: '/contact',           title: 'Contact' },
  { path: '/digital-identity',  title: 'Digital Identity' },
  { path: '/community',         title: 'Future of Productivity' },
  { path: '/hosting/web',       title: 'Web Hosting' },
  { path: '/hosting/wordpress', title: 'WordPress' },
  { path: '/hosting/reseller',  title: 'Reseller' },
  { path: '/hosting/vps',       title: 'VPS' },
  { path: '/domains',           title: 'Domain' },
  { path: '/domains/transfer',  title: 'Transfer' },
  { path: '/domains/ng',        title: '.NG' },
  { path: '/email',             title: 'Email' },
  { path: '/security/ssl',      title: 'SSL' },
  { path: '/security/oneguard', title: 'OneGuard' },
  { path: '/legal/terms',       title: 'Terms' },
  { path: '/legal/privacy',     title: 'Privacy' },
  { path: '/legal/agreement',   title: 'Agreement' },
];

let ctx;
test.beforeAll(async () => {
  ctx = await request.newContext({ baseURL: BASE });
});
test.afterAll(async () => { await ctx.dispose(); });

test.describe('HTTP 200 — all 18 pages', () => {
  for (const pg of PAGES) {
    test(`GET ${pg.path} → 200`, async () => {
      const res = await ctx.get(pg.path);
      expect(res.status()).toBe(200);
    });
  }
});

test.describe('Page titles', () => {
  for (const pg of PAGES) {
    test(`${pg.path} contains "${pg.title}" in <title>`, async () => {
      const res = await ctx.get(pg.path);
      const html = await res.text();
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      expect(titleMatch).not.toBeNull();
      expect(titleMatch[1]).toMatch(new RegExp(pg.title, 'i'));
    });
  }
});

test.describe('Content-Type headers', () => {
  test('HTML pages return text/html', async () => {
    const res = await ctx.get('/');
    expect(res.headers()['content-type']).toContain('text/html');
  });
  test('/shared/main.js returns application/javascript', async () => {
    const res = await ctx.get('/shared/main.js');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('javascript');
  });
  test('/shared/tokens.css returns text/css', async () => {
    const res = await ctx.get('/shared/tokens.css');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('css');
  });
  test('/assets/logo.svg returns image/svg+xml', async () => {
    const res = await ctx.get('/assets/logo.svg');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('svg');
  });
});

test.describe('Shared CSS files all load', () => {
  const CSS = ['tokens','layout','components','nav','footer','animations'];
  for (const f of CSS) {
    test(`/shared/${f}.css → 200`, async () => {
      const res = await ctx.get(`/shared/${f}.css`);
      expect(res.status()).toBe(200);
    });
  }
});

test.describe('404 for non-existent paths', () => {
  test('GET /does-not-exist → 404', async () => {
    const res = await ctx.get('/does-not-exist');
    expect(res.status()).toBe(404);
  });
});
