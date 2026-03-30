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
const CURRENCY_SYMBOLS = { USD: '$', GBP: '£', NGN: '₦' };
const CURRENCY_LABELS  = { USD: 'USD', GBP: 'GBP', NGN: 'NGN' };
const CURRENCY_PREFIXES = { USD: 'US', GBP: 'UK', NGN: 'NG' };
const PLAN_ALIASES = {
  em_starter: 'email_starter',
  em_business: 'email_pro',
  em_enterprise: 'email_proplus'
};

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

function normalizePlanKey(plan) {
  return PLAN_ALIASES[plan] || plan;
}

function getPlanCard(plan) {
  const normalizedPlan = normalizePlanKey(plan);
  return document.querySelector(`[data-plan="${normalizedPlan}"]`);
}

function getPlanPriceData(plan) {
  const planCard = getPlanCard(plan);
  const priceEl = planCard ? planCard.querySelector('.plan-num') : null;
  if (!priceEl || !priceEl.dataset) return null;
  return priceEl.dataset;
}

function parsePriceValue(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getPreferredPrice(dataset) {
  if (!dataset) return null;

  const currencyKey = currentCurrency.toLowerCase();
  const preferredCycle = isAnnual ? 'a' : 'm';
  const preferred = parsePriceValue(dataset[`${preferredCycle}${currencyKey.charAt(0).toUpperCase()}${currencyKey.slice(1)}`]);
  if (preferred !== null) return preferred;

  const fallbacks = [
    `m${currencyKey.charAt(0).toUpperCase()}${currencyKey.slice(1)}`,
    `a${currencyKey.charAt(0).toUpperCase()}${currencyKey.slice(1)}`,
    'mUsd', 'aUsd', 'mGbp', 'aGbp', 'mNgn', 'aNgn'
  ];

  for (const key of fallbacks) {
    const value = parsePriceValue(dataset[key]);
    if (value !== null) return value;
  }

  return null;
}

function getPlanBillingMode(dataset) {
  if (!dataset) return 'monthly';

  const hasMonthly = ['mUsd', 'mGbp', 'mNgn'].some(key => parsePriceValue(dataset[key]) !== null);
  const hasAnnual = ['aUsd', 'aGbp', 'aNgn'].some(key => parsePriceValue(dataset[key]) !== null);

  if (hasMonthly && hasAnnual) return isAnnual ? 'annual-billed-monthly' : 'monthly';
  if (hasAnnual) return 'annual-only';
  return 'monthly';
}

function getPeriodLabel(dataset) {
  const mode = getPlanBillingMode(dataset);
  if (mode === 'annual-only') return '/yr';
  if (mode === 'annual-billed-monthly') return '/mo (billed annually)';
  return '/mo';
}

function updateTextByCurrency() {
  $$('[data-text-usd], [data-text-ngn], [data-text-gbp]').forEach(el => {
    const attr = `text${currentCurrency.charAt(0) + currentCurrency.slice(1).toLowerCase()}`;
    if (el.dataset[attr]) el.textContent = el.dataset[attr];
  });
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

  /* Mobile nav accordion — handled natively by <details>/<summary> elements */
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

    /* Associate button ↔ dropdown panel */
    if (!dropdown.id) dropdown.id = 'dd-' + Math.random().toString(36).slice(2, 7);
    btn.setAttribute('aria-controls', dropdown.id);

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

    /* Focusable items in this dropdown */
    function focusableItems() {
      return [...dropdown.querySelectorAll('a[href], button:not([disabled])')];
    }

    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    btn.addEventListener('click', () => {
      const isOpen = dropdown.classList.contains('nav-dropdown--open');
      isOpen ? close() : open();
      if (!isOpen) {
        /* Move focus to first item on keyboard-triggered open */
        requestAnimationFrame(() => {
          const first = focusableItems()[0];
          if (first) first.focus();
        });
      }
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); open(); requestAnimationFrame(() => { const first = focusableItems()[0]; if (first) first.focus(); }); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const isOpen = dropdown.classList.contains('nav-dropdown--open'); isOpen ? close() : open(); }
      if (e.key === 'Escape') { close(); btn.focus(); }
    });

    /* Arrow key navigation inside dropdown */
    dropdown.addEventListener('keydown', (e) => {
      const items2 = focusableItems();
      const idx = items2.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (idx < items2.length - 1) items2[idx + 1].focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); if (idx > 0) items2[idx - 1].focus(); else { close(); btn.focus(); } }
      if (e.key === 'Escape')    { close(); btn.focus(); }
      if (e.key === 'Tab')       { close(); }
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

  function switchCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem('onenet_currency', currency);

    /* Update dropdown trigger label */
    const flagEl  = $('#currency-flag-icon');
    const labelEl = $('#currency-label');
    if (flagEl)  flagEl.textContent  = CURRENCY_PREFIXES[currency];
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
    btn.textContent = btn.dataset.currency;
    btn.addEventListener('click', () => switchCurrency(btn.dataset.currency));
  });

  /* Remove decorative flag glyphs from dropdown options */
  $$('.currency-option').forEach(opt => {
    if (opt.firstChild && opt.firstChild.nodeType === Node.TEXT_NODE) {
      opt.firstChild.textContent = '';
    }
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

  /* Update plan cards from live HTML data attributes */
  $$('[data-plan]').forEach(el => {
    const priceEl = el.querySelector('.plan-num');
    const numEl = el.querySelector('.plan-num');
    const symEl = el.querySelector('.plan-sym');
    const perEl = el.querySelector('.plan-per');
    const dataset = priceEl ? priceEl.dataset : null;
    const price = getPreferredPrice(dataset);

    if (price === null) return;

    if (numEl) numEl.textContent = currentCurrency === 'NGN' ? Math.round(price).toLocaleString('en-NG') : price.toFixed(2);
    if (symEl) symEl.textContent = sym;
    if (perEl) perEl.textContent = getPeriodLabel(dataset);

    /* Show/hide secondary currency lines */
    const ngnLine = el.querySelector('[data-show-currency="NGN"]');
    const gbpLine = el.querySelector('[data-show-currency="GBP"]');
    if (ngnLine) ngnLine.style.display = currentCurrency !== 'NGN' ? 'block' : 'none';
    if (gbpLine) gbpLine.style.display = currentCurrency !== 'GBP' ? 'block' : 'none';
  });

  /* Update renewal price spans */
  $$('[data-renew-usd]').forEach(el => {
    if (currentCurrency === 'USD' && el.dataset.renewUsd) el.textContent = el.dataset.renewUsd;
    else if (currentCurrency === 'GBP' && el.dataset.renewGbp) el.textContent = el.dataset.renewGbp;
    else if (currentCurrency === 'NGN' && el.dataset.renewNgn) el.textContent = el.dataset.renewNgn;
  });

  /* Update sticky CTA price when plan key is provided */
  const stickyCta = $('#sticky-cta[data-sticky-from]');
  if (stickyCta) {
    const plan = stickyCta.dataset.stickyFrom;
    const priceData = getPlanPriceData(plan);
    const ctaPrice = getPreferredPrice(priceData);
    const stickyPrice = stickyCta.querySelector('.sticky-price');
    const stickyPeriod = stickyCta.querySelector('.sticky-period');

    if (stickyPrice && ctaPrice !== null) {
      stickyPrice.textContent = formatPrice(
        currentCurrency === 'NGN' ? Math.round(ctaPrice) : ctaPrice,
        currentCurrency
      );
    }
    if (stickyPeriod) {
      stickyPeriod.textContent = getPeriodLabel(priceData);
    }
  }

  /* Update TLD chip prices */
  $$('.tld-price[data-usd]').forEach(el => {
    if (currentCurrency === 'USD' && el.dataset.usd) el.textContent = el.dataset.usd;
    else if (currentCurrency === 'NGN' && el.dataset.ngn) el.textContent = el.dataset.ngn;
    else if (currentCurrency === 'GBP' && el.dataset.gbp) el.textContent = el.dataset.gbp;
  });

  updateTextByCurrency();

  /* Simple data-m / data-a / data-usd / data-gbp / data-ngn fallback */
  $$('[data-m]').forEach(el => {
    el.textContent = isAnnual ? el.dataset.a : el.dataset.m;
  });
  $$('[data-usd]').forEach(el => {
    el.style.display = currentCurrency === 'USD' ? '' : 'none';
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

  /* Respect prefers-reduced-motion — skip animation, just show */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Number(el.dataset.delay || 0);
        if (delay) {
          setTimeout(() => el.classList.add('is-visible'), delay * 90);
        } else {
          el.classList.add('is-visible');
        }
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -32px 0px'
  });

  elements.forEach(el => observer.observe(el));

  /* Lazy-load images that are below the fold */
  $$('img:not([loading])').forEach(img => {
    const rect = img.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    }
  });
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

  /* Ensure result containers announce to screen readers */
  if (available) { available.setAttribute('role', 'status'); available.setAttribute('aria-live', 'polite'); available.setAttribute('aria-atomic', 'true'); }
  if (taken)     { taken.setAttribute('role', 'alert');  taken.setAttribute('aria-live', 'assertive'); taken.setAttribute('aria-atomic', 'true'); }

  /* Label the search input */
  if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', 'Search for a domain name');

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

  /* Wire up aria-controls / id pairs */
  items.forEach((item, i) => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;
    const answerId = 'faq-a-' + i;
    answer.id = answerId;
    btn.setAttribute('aria-controls', answerId);
    answer.setAttribute('role', 'region');
  });

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

function initTestimonials() {
  const avatarClasses = ['testi-av-a', 'testi-av-b', 'testi-av-c', 'testi-av-d', 'testi-av-e', 'testi-av-f', 'testi-av-g'];

  $$('.testi-card').forEach((card, index) => {
    const avatar = card.querySelector('.testi-avatar');
    if (!avatar) return;

    if (!avatar.className.match(/testi-av-[a-z]/)) {
      avatar.classList.add(avatarClasses[index % avatarClasses.length]);
    }

    if (!avatar.textContent.trim()) {
      const sourceName = card.querySelector('.testi-name')?.textContent
        || card.querySelector('.testi-author strong')?.textContent
        || '';
      const initials = sourceName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join('');

      avatar.textContent = initials || 'ON';
    }
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
      const submitBtn = form.querySelector('button[type="submit"]');
      let status = form.querySelector('.exit-bar-status');

      if (!emailInput || !emailInput.value.trim()) {
        if (emailInput) emailInput.focus();
        return;
      }
      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      if (!status) {
        status = document.createElement('p');
        status.className = 'exit-bar-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.appendChild(status);
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      /* In production: POST to /api/subscribe or WHMCS */
      status.textContent = 'Sent. Check your inbox shortly.';
      emailInput.value = '';

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
/* Track the element that opened the modal so focus returns on close */
let _authModalOpener = null;

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

  /* Focus trap — cycle focus within modal panel */
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeAuthModal(); return; }
    if (e.key !== 'Tab') return;

    const panel = modal.querySelector('.auth-modal-panel');
    if (!panel) return;
    const focusable = [...panel.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.closest('[hidden]'));
    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}

function openAuthModal() {
  const modal  = $('#auth-modal');
  const iframe = $('#auth-iframe');
  if (!modal) return;

  /* Remember where focus was */
  _authModalOpener = document.activeElement;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  /* Load iframe src on first open */
  if (iframe && !iframe.src) iframe.src = '/login.php';

  /* Ensure first tab is active */
  const firstTab = $('.auth-tab');
  if (firstTab && !firstTab.classList.contains('auth-tab--active')) firstTab.click();

  /* Focus the close button (first focusable element in panel) */
  const closeBtn = modal.querySelector('.auth-modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 80);
}

function closeAuthModal() {
  const modal = $('#auth-modal');
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';

  /* Return focus to the element that opened the modal */
  if (_authModalOpener && typeof _authModalOpener.focus === 'function') {
    setTimeout(() => _authModalOpener.focus(), 60);
    _authModalOpener = null;
  }
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
  const label = count > 99 ? '99+' : String(count);
  badge.textContent = label;
  badge.hidden = count < 1;
  /* Update accessible label */
  const cart = badge.closest('#nav-cart');
  if (cart) cart.setAttribute('aria-label', count > 0 ? `View cart — ${label} item${count !== 1 ? 's' : ''}` : 'View cart');
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
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Added to cart! <a href="/cart.php">View cart &#x2192;</a>`;
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
  initTestimonials();
  initExitBar();
  initPricingTabs();
  initLottieFallbacks();
  initSmoothScroll();
  initHeroChrome();
  initActiveNav();
});
