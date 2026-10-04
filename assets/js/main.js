/* =========================================================
   Metro Cleaners & Renovators Ltd: site interactions
   Plain JavaScript, no libraries.
   ========================================================= */
(function () {
  'use strict';

  // Business details used by the quote form and WhatsApp links
  var BUSINESS_EMAIL = 'info@metrocleaners.co.ke';
  var WHATSAPP_NUMBER = '254706385869';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header shadow once the page scrolls ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.menu-toggle');

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) setMenu(false);
  });

  /* ---------- Highlight the nav link for the section in view ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Scroll animations: fade in and slide up ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Cursor glow (desktop only) ---------- */
  var aura = document.querySelector('.cursor-aura');
  var ring = document.querySelector('.cursor-ring');
  var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var auraPos = { x: mouse.x, y: mouse.y };
  var ringPos = { x: mouse.x, y: mouse.y };
  var cursorRunning = false;

  function cursorEnabled() {
    return finePointer.matches && !reduceMotion.matches && aura && ring;
  }

  function cursorLoop() {
    if (!cursorRunning) return;
    // The aura trails softly behind the pointer; the ring follows closely
    auraPos.x += (mouse.x - auraPos.x) * 0.12;
    auraPos.y += (mouse.y - auraPos.y) * 0.12;
    ringPos.x += (mouse.x - ringPos.x) * 0.35;
    ringPos.y += (mouse.y - ringPos.y) * 0.35;
    aura.style.transform = 'translate3d(' + auraPos.x + 'px,' + auraPos.y + 'px,0)';
    ring.style.transform = 'translate3d(' + ringPos.x + 'px,' + ringPos.y + 'px,0)';
    requestAnimationFrame(cursorLoop);
  }

  document.addEventListener('mousemove', function (e) {
    if (!cursorEnabled()) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!cursorRunning) {
      cursorRunning = true;
      auraPos.x = ringPos.x = mouse.x;
      auraPos.y = ringPos.y = mouse.y;
      document.body.classList.add('cursor-active');
      requestAnimationFrame(cursorLoop);
    }
  });

  document.addEventListener('mouseleave', function () {
    document.body.classList.remove('cursor-active');
    cursorRunning = false;
  });

  // Grow the ring over anything clickable
  document.addEventListener('mouseover', function (e) {
    if (ring) ring.classList.toggle('is-hovering', !!e.target.closest('a, button, input, select, textarea, label'));
  });

  function onPointerModeChange() {
    if (!cursorEnabled()) {
      cursorRunning = false;
      document.body.classList.remove('cursor-active');
    }
  }
  [finePointer, reduceMotion].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener('change', onPointerModeChange);
    else if (mq.addListener) mq.addListener(onPointerModeChange);
  });

  /* ---------- Spotlight: cards light up where the cursor is ---------- */
  document.querySelectorAll('.spotlight').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Hero parallax: image and cards shift with the mouse ---------- */
  var hero = document.querySelector('.hero');
  var depthEls = document.querySelectorAll('.hero [data-depth]');
  if (hero && depthEls.length) {
    hero.addEventListener('mousemove', function (e) {
      if (!finePointer.matches || reduceMotion.matches) return;
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;
      var dy = (e.clientY - r.top) / r.height - 0.5;
      depthEls.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth')) || 1;
        el.style.transform = 'translate3d(' + (-dx * 14 * d) + 'px,' + (-dy * 14 * d) + 'px,0)';
      });
    });
    hero.addEventListener('mouseleave', function () {
      depthEls.forEach(function (el) { el.style.transform = ''; });
    });
  }

  /* ---------- Hide photos that fail to load (the brand gradient shows instead) ---------- */
  document.querySelectorAll('.hero__image img, .why__image img').forEach(function (img) {
    function hide() { img.style.visibility = 'hidden'; }
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide(); // already failed before this script ran
  });

  /* ---------- Social icons: pages not created yet ---------- */
  document.querySelectorAll('[data-social]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (link.getAttribute('href') === '#') e.preventDefault();
    });
  });

  /* ---------- WhatsApp button: show "Chat with us" briefly after load ---------- */
  var waFloat = document.querySelector('.whatsapp-float');
  if (waFloat) {
    setTimeout(function () {
      waFloat.classList.add('show-label');
      setTimeout(function () { waFloat.classList.remove('show-label'); }, 4000);
    }, 2500);
  }

  /* ---------- Quote form: opens the visitor's email app, pre-filled ---------- */
  var form = document.getElementById('quote-form');
  var success = document.getElementById('form-success');
  var serviceSelect = document.getElementById('f-service');
  var waFallback = document.getElementById('whatsapp-fallback');
  var resetBtn = document.getElementById('form-reset');

  // "Get a quote" links pick the matching service in the form
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!serviceSelect) return;
      serviceSelect.value = link.getAttribute('data-service');
      clearError(serviceSelect);
      if (form && form.hidden) showForm();
    });
  });

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, message) {
    var field = fieldOf(input);
    field.classList.add('has-error');
    field.querySelector('.field__error').textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var field = fieldOf(input);
    if (!field) return;
    field.classList.remove('has-error');
    field.querySelector('.field__error').textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var phone = form.elements.phone;
    var service = form.elements.service;
    var message = form.elements.message;

    [name, phone, service, message].forEach(clearError);

    if (name.value.trim().length < 2) { setError(name, 'Please enter your name.'); ok = false; }

    var digits = phone.value.replace(/[^\d]/g, '');
    if (digits.length < 9 || digits.length > 13) {
      setError(phone, 'Please enter a valid phone number, e.g. 0712 345678.');
      ok = false;
    }

    if (!service.value) { setError(service, 'Please choose a service.'); ok = false; }
    if (message.value.trim().length < 5) { setError(message, 'Please tell us a little about the job.'); ok = false; }

    if (!ok) {
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
    }
    return ok;
  }

  function showForm() {
    form.hidden = false;
    success.hidden = true;
  }

  if (form) {
    form.addEventListener('input', function (e) {
      if (e.target.matches('input, select, textarea')) clearError(e.target);
    });
    form.addEventListener('change', function (e) {
      if (e.target.matches('select')) clearError(e.target);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var service = form.elements.service.value;
      var message = form.elements.message.value.trim();

      var subject = 'New Inquiry: ' + service;
      var body =
        'Hello Metro Cleaners & Renovators,\n\n' +
        'I would like a free quote. Here are my details:\n\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Service required: ' + service + '\n\n' +
        'Message:\n' + message + '\n\n' +
        'Sent from the Metro Cleaners website.';

      var mailto = 'mailto:' + BUSINESS_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      // Same details, ready to send on WhatsApp if the email app doesn't open
      var waText =
        'Hello Metro Cleaners, I would like a free quote.\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Service: ' + service + '\n' +
        'Message: ' + message;
      if (waFallback) waFallback.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waText);

      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });

      window.location.href = mailto;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      showForm();
      form.elements.name.focus();
    });
  }
})();
