/**
 * OneNet Servers — main.js
 * Single JS file. Zero dependencies. Zero frameworks.
 * All 13 functions required by CLAUDE.md Section 4.
 *
 * Functions:
 *  1.  initNav()            — sticky header, transparent → frosted glass
 *  2.  initMobileMenu()     — hamburger + drawer open/close
 *  3.  initCurrencySwitcher() — NGN/GBP/USD price updates
 *  4.  initBillingToggle()  — monthly/annual toggle
 *  5.  initScrollReveal()   — IntersectionObserver reveal
 *  6.  initStickyCTA()      — appears at 600px, hides at footer
 *  7.  initChatFAB()        — chat button handler
 *  8.  initDomainSearch()   — simulated availability result
 *  9.  initFAQ()            — accordion
 * 10.  initTableScrollHint() — compare table swipe hint
 * 11.  initExitBar()         — 85% scroll depth email capture
 * 12.  initPricingTabs()     — homepage pricing tab switcher
 * 13.  initNavDropdowns()    — desktop dropdown menus
 */

'use strict';

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const PRICES = {
  /* Web Hosting */
  wh_starter:  { usd_m: 3.99,  usd_a: 3.91,  gbp_m: 3.71,  gbp_a: 3.63,  ngn_m: 7499,   ngn_a: 7349  },
  wh_lite:     { usd_m: 9.75,  usd_a: 6.34,  gbp_m: 9.07,  gbp_a: 5.90,  ngn_m: 13999,  ngn_a: 9099  },
  wh_premium:  { usd_m: 18.20, usd_a: 11.83, gbp_m: 16.95, gbp_a: 11.02, ngn_m: 24999,  ngn_a: 16249 },
  wh_ultimate: { usd_m: 32.50, usd_a: 21.13, gbp_m: 30.24, gbp_a: 19.66, ngn_m: 44999,  ngn_a: 29249 },
  /* WordPress Hosting */
  wp_starter:  { usd_m: 6.78,  usd_a: 4.41,  gbp_m: 6.33,  gbp_a: 4.11,  ngn_m: 10500,  ngn_a: 6825  },
  wp_lite:     { usd_m: 13.65, usd_a: 8.87,  gbp_m: 12.72, gbp_a: 8.27,  ngn_m: 19999,  ngn_a: 12999 },
  wp_premium:  { usd_m: 52.49, usd_a: 34.12, gbp_m: 48.88, gbp_a: 31.77, ngn_m: 74999,  ngn_a: 48749 },
  wp_ultimate: { usd_m: 105.00,usd_a: 68.25, gbp_m: 97.75, gbp_a: 63.54, ngn_m: 149999, ngn_a: 97499 },
  /* Reseller */
  rsl_starter:  { usd_m: 5.39,  usd_a: 3.93,  gbp_m: 5.02,  gbp_a: 3.66,  ngn_m: 8999,   ngn_a: 6569  },
  rsl_lite:     { usd_m: 14.30, usd_a: 9.30,  gbp_m: 13.32, gbp_a: 8.66,  ngn_m: 22999,  ngn_a: 14949 },
  rsl_grow:     { usd_m: 20.28, usd_a: 13.18, gbp_m: 18.89, gbp_a: 12.28, ngn_m: 31999,  ngn_a: 20799 },
  rsl_enterprise:{ usd_m: 28.60,usd_a: 18.59, gbp_m: 26.64, gbp_a: 17.32, ngn_m: 44999,  ngn_a: 29249 },
  /* VPS */
  vps_starter:  { usd_m: 12.42, usd_a: 11.18, gbp_m: 11.57, gbp_a: 10.41, ngn_m: 19999,  ngn_a: 17999 },
  vps_lite:     { usd_m: 29.11, usd_a: 26.20, gbp_m: 27.12, gbp_a: 24.41, ngn_m: 44999,  ngn_a: 40499 },
  vps_premium:  { usd_m: 43.61, usd_a: 39.25, gbp_m: 40.63, gbp_a: 36.57, ngn_m: 67999,  ngn_a: 61199 },
  vps_ultimate: { usd_m: 92.15, usd_a: 82.94, gbp_m: 85.84, gbp_a: 77.26, ngn_m: 139999, ngn_a: 125999 },
};

const CURRENCY_SYMBOLS = { USD: '$', GBP: '£', NGN: '₦' };
const CURRENCY_LABELS  = { USD: 'USD', GBP: 'GBP', NGN: 'NGN' };

/* State */
let currentCurrency = 'USD';
let isAnnual = false;

/* ═══════════════════════════════════════════════
   UTILITY
═══════════════════════════════════════════════ */
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function formatPrice(amount, currency) {
  if (currency === 'NGN') return '₦' + amount.toLocaleString('en-NG', { maximumFractionDigits: 0 });
  if (currency === 'GBP') return '£' + amount.toFixed(2);
  return '$' + amount.toFixed(2);
}

function debounce(fn, ms = 100) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ═══════════════════════════════════════════════
   1. NAV — sticky + frosted glass
═══════════════════════════════════════════════ */
function initNav() {
  const nav = $('#main-nav');
  if (!nav) return;

  const onScroll = debounce(() => {
    nav.classList.toggle('nav--stuck', window.scrollY > 60);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════
   2. MOBILE MENU
═══════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = $('#nav-hamburger');
  const drawer    = $('#mobile-drawer');
  if (!hamburger || !drawer) return;

  function openMenu() {
    drawer.classList.add('mobile-drawer--open');
    drawer.removeAttribute('aria-hidden');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('nav-hamburger--open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    drawer.classList.remove('mobile-drawer--open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('nav-hamburger--open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('mobile-drawer--open') ? closeMenu() : openMenu();
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('mobile-drawer--open') &&
        !drawer.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  /* Close on ESC */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Mobile nav accordion */
  $$('.mobile-nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.mobile-nav-group');
      const isOpen = group.classList.contains('mobile-nav-group--open');
      $$('.mobile-nav-group--open').forEach(g => g.classList.remove('mobile-nav-group--open'));
      if (!isOpen) group.classList.add('mobile-nav-group--open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });
}

/* ═══════════════════════════════════════════════
   13. NAV DROPDOWNS (desktop)
═══════════════════════════════════════════════ */
function initNavDropdowns() {
  const items = $$('.nav-has-dropdown');
  items.forEach(item => {
    const btn      = item.querySelector('.nav-link-btn') || item.querySelector('.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');
    if (!btn || !dropdown) return;

    let closeTimer;

    function open() {
      clearTimeout(closeTimer);
      $$('.nav-dropdown--open').forEach(d => d.classList.remove('nav-dropdown--open'));
      $$('[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
      dropdown.classList.add('nav-dropdown--open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      closeTimer = setTimeout(() => {
        dropdown.classList.remove('nav-dropdown--open');
        btn.setAttribute('aria-expanded', 'false');
      }, 120);
    }

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    btn.addEventListener('click', () => {
      dropdown.classList.contains('nav-dropdown--open') ? close() : open();
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      if (e.key === 'Escape') close();
    });
  });

  /* Close all on outside click */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-has-dropdown') && !e.target.closest('.currency-dropdown')) {
      closeAllDropdowns();
    }
  });
}

/* ═══════════════════════════════════════════════
   3. CURRENCY SWITCHER (dropdown)
═══════════════════════════════════════════════ */
function initCurrencySwitcher() {
  /* Auto-detect from browser language */
  const lang = navigator.language || 'en-US';
  if (lang.includes('NG') || lang === 'ha' || lang === 'yo' || lang === 'ig') {
    currentCurrency = 'NGN';
  } else if (lang.startsWith('en-GB')) {
    currentCurrency = 'GBP';
  } else {
    currentCurrency = 'USD';
  }
  const saved = localStorage.getItem('onenet_currency');
  if (saved && ['USD','GBP','NGN'].includes(saved)) currentCurrency = saved;

  const FLAGS = { USD: '🇺🇸', GBP: '🇬🇧', NGN: '🇳🇬' };

  function switchCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem('onenet_currency', currency);

    /* Update dropdown trigger label */
    const flagEl  = $('#currency-flag-icon');
    const labelEl = $('#currency-label');
    if (flagEl)  flagEl.textContent  = FLAGS[currency];
    if (labelEl) labelEl.textContent = currency;

    /* Update desktop dropdown options */
    $$('.currency-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.currency === currency);
    });

    /* Update mobile currency buttons */
    $$('.mobile-currency-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.currency === currency);
    });

    /* Legacy: update old currency-btn if still on page */
    $$('.currency-btn').forEach(b => b.classList.toggle('active', b.dataset.currency === currency));

    updateAllPrices();
  }

  /* Desktop currency dropdown */
  const trigger = $('#currency-trigger');
  const menu    = $('#currency-menu');

  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('currency-menu--open');
      closeAllDropdowns();
      if (!isOpen) {
        menu.classList.add('currency-menu--open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  }

  $$('.currency-option').forEach(opt => {
    opt.addEventListener('click', () => {
      switchCurrency(opt.dataset.currency);
      if (menu) menu.classList.remove('currency-menu--open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Mobile currency buttons */
  $$('.mobile-currency-btn').forEach(btn => {
    btn.addEventListener('click', () => switchCurrency(btn.dataset.currency));
  });

  /* Set initial state */
  switchCurrency(currentCurrency);
}

function closeAllDropdowns() {
  $$('.nav-dropdown--open').forEach(d => d.classList.remove('nav-dropdown--open'));
  $$('.currency-menu--open').forEach(m => m.classList.remove('currency-menu--open'));
  $$('.nav-link-btn[aria-expanded="true"], .currency-trigger[aria-expanded="true"]')
    .forEach(b => b.setAttribute('aria-expanded', 'false'));
}

/* ═══════════════════════════════════════════════
   4. BILLING TOGGLE
═══════════════════════════════════════════════ */
function initBillingToggle() {
  const toggles = $$('.toggle-pill');
  if (!toggles.length) return;

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      toggle.classList.toggle('annual', isAnnual);
      toggle.setAttribute('aria-checked', isAnnual);

      /* Update all billing label pairs near this toggle */
      const section = toggle.closest('section') || document;
      const monthlyLabels = $$('.billing-label', section).filter((_, i) => i % 2 === 0);
      const annualLabels  = $$('.billing-label', section).filter((_, i) => i % 2 !== 0);
      monthlyLabels.forEach(l => l.classList.toggle('active', !isAnnual));
      annualLabels.forEach(l  => l.classList.toggle('active', isAnnual));

      updateAllPrices();
      syncPlanCardUrls();
    });
  });
}

/* Sync plan card CTA href with current billing cycle */
function syncPlanCardUrls() {
  $$('.plan-card a[data-monthly-url], .plan-card a[data-annual-url]').forEach(link => {
    if (isAnnual && link.dataset.annualUrl) link.href = link.dataset.annualUrl;
    if (!isAnnual && link.dataset.monthlyUrl) link.href = link.dataset.monthlyUrl;
  });
}

/* ═══════════════════════════════════════════════
   PRICE UPDATE ENGINE
═══════════════════════════════════════════════ */
function updateAllPrices() {
  const sym = CURRENCY_SYMBOLS[currentCurrency];
  const period = isAnnual ? '_a' : '_m';
  const currKey = currentCurrency.toLowerCase() + period;

  /* Update elements with data-plan + data-price-key */
  $$('[data-plan]').forEach(el => {
    const plan = el.dataset.plan;
    if (!PRICES[plan]) return;
    const price = PRICES[plan][currKey];
    if (price === undefined) return;

    const numEl = el.querySelector('.plan-num');
    const symEl = el.querySelector('.plan-sym');
    const perEl = el.querySelector('.plan-per') || el.querySelector('.plan-billing-label');

    if (numEl) numEl.textContent = currentCurrency === 'NGN' ? Math.round(price).toLocaleString('en-NG') : price.toFixed(2).split('.')[0];
    if (symEl) symEl.textContent = sym;
    if (perEl) perEl.textContent = isAnnual ? '/mo (billed annually)' : '/mo';

    /* Show/hide secondary currency lines */
    const ngnLine = el.querySelector('[data-show-currency="NGN"]');
    const gbpLine = el.querySelector('[data-show-currency="GBP"]');
    if (ngnLine) ngnLine.style.display = currentCurrency !== 'NGN' ? 'block' : 'none';
    if (gbpLine) gbpLine.style.display = currentCurrency !== 'GBP' ? 'block' : 'none';
  });

  /* Simple data-m / data-a / data-usd / data-gbp / data-ngn fallback */
  $$('[data-m]').forEach(el => {
    el.textContent = isAnnual ? el.dataset.a : el.dataset.m;
  });
  $$('[data-usd]').forEach(el => {
    if (currentCurrency === 'USD') el.style.display = '';
  });
  $$('[data-ngn]').forEach(el => {
    el.style.display = currentCurrency === 'NGN' ? '' : 'none';
  });
  $$('[data-gbp]').forEach(el => {
    el.style.display = currentCurrency === 'GBP' ? '' : 'none';
  });
}

/* ═══════════════════════════════════════════════
   5. SCROLL REVEAL
═══════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('is-visible'), delay * 80);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════
   6. STICKY CTA BAR
═══════════════════════════════════════════════ */
function initStickyCTA() {
  const bar    = $('#sticky-cta');
  const footer = $('#main-footer');
  const close  = $('.sticky-cta-close');
  if (!bar) return;

  let dismissed = false;

  if (close) {
    close.addEventListener('click', () => {
      dismissed = true;
      bar.classList.remove('sticky-cta--visible');
    });
  }

  const onScroll = debounce(() => {
    if (dismissed) return;
    const scrolled = window.scrollY;
    const triggerPoint = 600;

    /* Hide when footer is visible */
    let footerVisible = false;
    if (footer) {
      const fr = footer.getBoundingClientRect();
      footerVisible = fr.top < window.innerHeight;
    }

    bar.classList.toggle('sticky-cta--visible', scrolled > triggerPoint && !footerVisible);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ═══════════════════════════════════════════════
   7. CHAT FAB
═══════════════════════════════════════════════ */
function initChatFAB() {
  const fab = $('#chat-fab');
  if (!fab) return;

  fab.addEventListener('click', () => {
    /* In production: replace with Crisp.chat or Intercom open */
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    } else if (window.Intercom) {
      window.Intercom('show');
    } else {
      /* Fallback: open contact page */
      window.location.href = '/contact';
    }
  });
}

/* ═══════════════════════════════════════════════
   8. DOMAIN SEARCH
═══════════════════════════════════════════════ */
function initDomainSearch() {
  const form      = $('#domain-search-form');
  const input     = $('#domain-search-input');
  const available = $('#domain-result-available');
  const taken     = $('#domain-result-taken');
  const availText = $('#domain-result-available-text');
  const takenText = $('#domain-result-taken-text');
  const regBtn    = $('#domain-register-btn');

  if (!form || !input) return;

  /* TLD chip click — fill input */
  $$('.tld-chip[data-tld]').forEach(chip => {
    chip.addEventListener('click', () => {
      const tld = chip.dataset.tld;
      const current = input.value.trim();
      const baseName = current.split('.')[0] || 'yourbrand';
      input.value = baseName + tld;
      input.focus();
    });
  });

  function showAvailable(domain, price) {
    if (available) {
      available.hidden = false;
      if (availText) availText.textContent = `✓ ${domain} is available — from ${price}/yr`;
      if (regBtn) regBtn.href = `/cart.php?a=add&domain=${encodeURIComponent(domain)}&domainaction=register`;
    }
    if (taken) taken.hidden = true;
  }

  function showTaken(domain) {
    if (taken) {
      taken.hidden = false;
      if (takenText) takenText.textContent = `✗ ${domain} is already taken`;
    }
    if (available) available.hidden = true;
  }

  async function checkDomain(domain) {
    /* Show loading state */
    if (available) available.hidden = true;
    if (taken)     taken.hidden     = true;
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Checking…'; btn.disabled = true; }

    try {
      const res = await fetch(`/api/domain-check.php?domain=${encodeURIComponent(domain)}`, {
        credentials: 'same-origin', cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.available) {
          showAvailable(domain, data.price || '$15.00');
        } else {
          showTaken(domain);
        }
        if (btn) { btn.textContent = 'Search'; btn.disabled = false; }
        return;
      }
    } catch (_) { /* fall through to simulation */ }

    /* Fallback simulation */
    simulateSearch(domain);

    if (btn) { btn.textContent = 'Search'; btn.disabled = false; }
  }

  function simulateSearch(query) {
    const isNgDomain = query.endsWith('.ng') || query.endsWith('.com.ng');
    const length = query.split('.')[0].length;
    const simulatedAvailable = (length % 2 === 0) || isNgDomain;
    if (simulatedAvailable) {
      const tld = query.includes('.') ? query.substring(query.indexOf('.')) : '.com';
      const prices = { '.ng':'$23.40', '.com.ng':'$11.25', '.com':'$15.00', '.co.uk':'$8.12', '.ai':'$95.24', '.dev':'$19.04', '.xyz':'$3.42' };
      showAvailable(query, prices[tld] || '$15.00');
    } else {
      showTaken(query);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    if (!query || query.length < 2) return;

    /* Add TLD if none present */
    const domain = query.includes('.') ? query : query + '.com';
    checkDomain(domain);
    input.value = domain;
  });
}

/* ═══════════════════════════════════════════════
   9. FAQ ACCORDION
═══════════════════════════════════════════════ */
function initFAQ() {
  const items = $$('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');

      /* Close all */
      items.forEach(i => {
        i.classList.remove('faq-item--open');
        const a = i.querySelector('.faq-a');
        const b = i.querySelector('.faq-q');
        if (a) { a.hidden = true; }
        if (b) { b.setAttribute('aria-expanded', 'false'); }
      });

      /* Open this one if it was closed */
      if (!isOpen) {
        item.classList.add('faq-item--open');
        answer.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ═══════════════════════════════════════════════
   10. COMPARISON TABLE SCROLL HINT
═══════════════════════════════════════════════ */
function initTableScrollHint() {
  const wraps = $$('.table-scroll-wrap');
  wraps.forEach(wrap => {
    const inner = wrap.querySelector('.table-inner');
    const hint  = wrap.querySelector('.table-scroll-hint');
    if (!inner || !hint) return;

    inner.addEventListener('scroll', () => {
      if (inner.scrollLeft > 20) {
        hint.classList.add('table-scroll-hint--hidden');
      }
    }, { passive: true, once: true });
  });
}

/* ═══════════════════════════════════════════════
   11. EXIT BAR (85% scroll depth)
═══════════════════════════════════════════════ */
function initExitBar() {
  const bar   = $('#exit-bar');
  const close = $('#exit-bar-close');
  const form  = $('#exit-bar-form');
  if (!bar) return;

  /* Only show once per session */
  if (sessionStorage.getItem('onenet_exit_shown')) return;

  let fired = false;

  const onScroll = debounce(() => {
    if (fired) return;
    const scrollPct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
    if (scrollPct >= 0.85) {
      fired = true;
      bar.hidden = false;
      bar.classList.add('exit-bar--visible');
      sessionStorage.setItem('onenet_exit_shown', '1');
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  if (close) {
    close.addEventListener('click', () => {
      bar.classList.remove('exit-bar--visible');
      setTimeout(() => { bar.hidden = true; }, 300);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value) return;
      /* In production: POST to /api/subscribe or WHMCS */
      form.innerHTML = '<p style="color:var(--green);font-weight:600;font-size:14px">✓ Sent! Check your inbox shortly.</p>';
      setTimeout(() => {
        bar.classList.remove('exit-bar--visible');
        setTimeout(() => { bar.hidden = true; }, 300);
      }, 2000);
    });
  }
}

/* ═══════════════════════════════════════════════
   12. PRICING TABS (homepage preview)
═══════════════════════════════════════════════ */
function initPricingTabs() {
  const tabGroups = $$('.pricing-tabs');
  tabGroups.forEach(group => {
    const tabs  = $$('.pricing-tab', group);
    const panels = $$('.pricing-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const target = tab.dataset.tab;
        panels.forEach(panel => {
          panel.hidden = panel.dataset.panel !== target;
        });
      });
    });
  });
}

/* ═══════════════════════════════════════════════
   LOTTIE FALLBACK HANDLER (Fix 17)
═══════════════════════════════════════════════ */
function initLottieFallbacks() {
  /* If lottie-player fails to register as custom element, show fallback */
  const check = setTimeout(() => {
    if (!customElements.get('lottie-player')) {
      $$('.lottie-player').forEach(player => {
        player.style.display = 'none';
        const fallback = player.nextElementSibling;
        if (fallback && fallback.classList.contains('lottie-fallback')) {
          fallback.style.display = 'block';
        }
      });
    }
  }, 3000);

  /* Cancel check if lottie loads fine */
  document.addEventListener('lottie-player-load', () => clearTimeout(check));
}

/* ═══════════════════════════════════════════════
   SMOOTH ANCHOR SCROLLING
═══════════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════
   HERO BROWSER CHROME ANIMATION (product pages)
═══════════════════════════════════════════════ */
function initHeroChrome() {
  /* Pulse the stat numbers in the hero chrome mockup */
  const stats = $$('.hero-stat-num');
  stats.forEach(stat => {
    const final = stat.textContent;
    /* Only animate if it's a number */
    if (parseFloat(final)) {
      stat.style.opacity = '0';
      setTimeout(() => {
        stat.style.transition = 'opacity .4s ease';
        stat.style.opacity = '1';
      }, 600);
    }
  });
}

/* ═══════════════════════════════════════════════
   ACTIVE NAV LINK
═══════════════════════════════════════════════ */
function initActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  $$('.nav-link, .nav-link-btn, .nav-dropdown a, .mobile-nav-link, .mobile-nav-sub a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.replace(/\/$/, '') || '/';
    if (path === linkPath || (linkPath !== '/' && path.startsWith(linkPath))) {
      link.classList.add('nav-link--active');
    }
  });
}

/* ═══════════════════════════════════════════════
   AUTH MODAL
═══════════════════════════════════════════════ */
function initAuthModal() {
  const modal   = $('#auth-modal');
  const iframe  = $('#auth-iframe');
  const tabs    = $$('.auth-tab');
  if (!modal) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('auth-tab--active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('auth-tab--active');
      tab.setAttribute('aria-selected','true');
      if (iframe) {
        const src = tab.dataset.tab === 'signup' ? '/register.php' : '/login.php';
        if (iframe.src !== location.origin + src) iframe.src = src;
      }
    });
  });

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeAuthModal();
  });
}

function openAuthModal() {
  const modal  = $('#auth-modal');
  const iframe = $('#auth-iframe');
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  /* Load iframe src on first open */
  if (iframe && !iframe.src) iframe.src = '/login.php';
  /* Ensure first tab is active */
  const firstTab = $('.auth-tab');
  if (firstTab && !firstTab.classList.contains('auth-tab--active')) firstTab.click();
  /* Trap focus on close button */
  const closeBtn = modal.querySelector('.auth-modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 60);
}

function closeAuthModal() {
  const modal = $('#auth-modal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════
   CART COUNT
═══════════════════════════════════════════════ */
function initCartCount() {
  fetchCartCount();
}

async function fetchCartCount() {
  try {
    const res = await fetch('/api/cart-count.php', { credentials: 'same-origin', cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    updateCartBadge(data.count || 0);
  } catch (e) {
    /* Silently fail — cart count is non-critical */
  }
}

function updateCartBadge(count) {
  const badge = $('#cart-count');
  if (!badge) return;
  badge.textContent = count > 99 ? '99+' : String(count);
  badge.hidden = count < 1;
}

/* ═══════════════════════════════════════════════
   AJAX ADD-TO-CART
═══════════════════════════════════════════════ */
function initAjaxCart() {
  /* Match explicit .btn-add-cart OR any plan-card CTA link to /cart.php?a=add */
  const cartLinks = [
    ...$$('.btn-add-cart'),
    ...$$('.plan-card a[href*="/cart.php?a=add"], .plan-card a[data-monthly-url]')
      .filter(el => !el.classList.contains('btn-add-cart'))
  ];

  cartLinks.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      /* Respect billing toggle: prefer data-monthly/annual-url if billing state is known */
      let href = btn.getAttribute('href') || btn.dataset.cartUrl;
      if (isAnnual && btn.dataset.annualUrl) href = btn.dataset.annualUrl;
      if (!isAnnual && btn.dataset.monthlyUrl) href = btn.dataset.monthlyUrl;
      if (!href || !href.includes('/cart.php')) {
        window.location.href = href;
        return;
      }

      const originalText = btn.innerHTML;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v10M8 6l4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Adding…';
      btn.style.pointerEvents = 'none';

      try {
        await fetch(href, { credentials: 'same-origin', redirect: 'manual' });
        await fetchCartCount();
        showCartToast(href);
      } catch (err) {
        window.location.href = href;
        return;
      } finally {
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.pointerEvents = '';
        }, 1200);
      }
    });
  });
}

function showCartToast(href) {
  let toast = $('#cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Added to cart! <a href="/cart.php">View cart →</a>`;
  toast.classList.add('cart-toast--visible');
  setTimeout(() => toast.classList.remove('cart-toast--visible'), 3500);
}

/* ═══════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initNavDropdowns();
  initMobileMenu();
  initCurrencySwitcher();
  initAuthModal();
  initCartCount();
  initAjaxCart();
  initBillingToggle();
  initScrollReveal();
  initStickyCTA();
  initChatFAB();
  initDomainSearch();
  initFAQ();
  initTableScrollHint();
  initExitBar();
  initPricingTabs();
  initLottieFallbacks();
  initSmoothScroll();
  initHeroChrome();
  initActiveNav();
});
