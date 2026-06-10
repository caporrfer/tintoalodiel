// Del Tinto al Odiel — Editorial de la Sierra
// One-page: velo de entrada, scrollspy, reveals, contadores, carta,
// galería + lightbox, maridajes, opiniones y modal de reserva.

(function () {
  "use strict";

  const { MENU, MENU_ORDER, REVIEWS, PAIRINGS, GALLERY } = window.RESTAURANT_DATA;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  // ---------- Velo de entrada ----------
  const veil = document.getElementById("veil");
  const seen = sessionStorage.getItem("veil-seen");
  const skipVeil = new URLSearchParams(location.search).has("noveil");
  if (reduceMotion || seen || skipVeil) {
    veil.remove();
  } else {
    sessionStorage.setItem("veil-seen", "1");
    document.body.style.overflow = "hidden";
    window.addEventListener("load", () => {
      setTimeout(() => {
        veil.classList.add("lift");
        document.body.style.overflow = "";
        setTimeout(() => veil.remove(), 1100);
      }, 950);
    });
    // Red de seguridad si 'load' tarda demasiado (imágenes lentas)
    setTimeout(() => {
      if (document.body.contains(veil) && !veil.classList.contains("lift")) {
        veil.classList.add("lift");
        document.body.style.overflow = "";
        setTimeout(() => veil.remove(), 1100);
      }
    }, 3200);
  }

  // ---------- Utilidades de foco ----------
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const nodes = [...container.querySelectorAll(FOCUSABLE)].filter(n => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  let lastFocused = null;

  // ---------- Header: estado de scroll + ocultar al bajar ----------
  const header = document.getElementById("header");
  const hero = document.getElementById("inicio");
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > hero.offsetHeight - 90);
    if (y > hero.offsetHeight && y > lastY + 6) header.classList.add("hidden");
    else if (y < lastY - 6 || y <= hero.offsetHeight) header.classList.remove("hidden");
    lastY = y;

    // Progreso de lectura
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    // Parallax suave del hero
    if (!reduceMotion && y < window.innerHeight * 1.2) {
      heroMedia.style.transform = `translateY(${y * 0.18}px)`;
    }

    // Barra móvil: visible pasado el hero (si no hay overlay abierto)
    updateBar();
    ticking = false;
  }
  const progressBar = document.getElementById("progress-bar");
  const heroMedia = document.getElementById("hero-media");
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  // ---------- Scrollspy ----------
  const navLinks = [...document.querySelectorAll(".nav a")];
  const spyTargets = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  spyTargets.forEach(t => spy.observe(t));

  // ---------- Reveals ----------
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        revealer.unobserve(en.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll("section, .marquee").forEach(s => revealer.observe(s));
  // El hero se revela al cargar
  requestAnimationFrame(() => hero.classList.add("in"));

  // ---------- Contadores ----------
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals).replace(".", ",") + suffix;
      return;
    }
    const dur = 1400;
    const t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals).replace(".", ",") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counter = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        animateCount(en.target);
        counter.unobserve(en.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(el => counter.observe(el));

  // ---------- Marquee: duplicar pista para bucle continuo ----------
  const track = document.getElementById("marquee-track");
  if (track && !reduceMotion) track.innerHTML += track.innerHTML;

  // ---------- Imagen flotante en platos insignia ----------
  const dishList = document.getElementById("dish-list");
  const dishFloat = document.getElementById("dish-float");
  if (dishList && dishFloat && finePointer && !reduceMotion) {
    let fx = 0, fy = 0, tx = 0, ty = 0, rafId = null;
    function loop() {
      fx += (tx - fx) * 0.14;
      fy += (ty - fy) * 0.14;
      dishFloat.style.transform = `translate(${fx}px, ${fy}px) scale(1) rotate(2deg)`;
      rafId = requestAnimationFrame(loop);
    }
    dishList.addEventListener("mousemove", e => {
      tx = e.clientX + 28;
      ty = e.clientY - 200;
      // Evita que se salga por la derecha
      tx = Math.min(tx, window.innerWidth - 310);
    });
    dishList.addEventListener("mouseover", e => {
      const row = e.target.closest(".dish-row");
      if (!row) return;
      const src = row.dataset.img;
      if (dishFloat.getAttribute("src") !== src) dishFloat.setAttribute("src", src);
      dishFloat.classList.add("show");
      if (!rafId) { fx = tx; fy = ty; loop(); }
    });
    dishList.addEventListener("mouseleave", () => {
      dishFloat.classList.remove("show");
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    });
  }

  // ---------- Carta ----------
  const tabsEl = document.getElementById("carta-tabs");
  const listEl = document.getElementById("carta-list");

  function renderCarta(activeKey, animate = true) {
    tabsEl.innerHTML = MENU_ORDER.map(k => {
      const m = MENU[k];
      return `<button class="carta-tab ${k === activeKey ? "active" : ""}" data-tab="${k}" aria-pressed="${k === activeKey}">
        <span>${m.label}</span>
        <span class="count">${String(m.items.length).padStart(2, "0")}</span>
      </button>`;
    }).join("");
    tabsEl.querySelectorAll(".carta-tab").forEach(t => t.addEventListener("click", () => renderCarta(t.dataset.tab)));

    const m = MENU[activeKey];
    listEl.classList.remove("fade");
    listEl.innerHTML = m.items.map(item => `
      <div class="menu-item">
        <div class="mi-top">
          <span class="mi-name">${item.name}${item.tag ? `<span class="mi-tag">${item.tag}</span>` : ""}</span>
          <span class="mi-dots"></span>
          <span class="mi-price">${item.price}</span>
        </div>
        <div class="mi-desc">${item.desc}</div>
      </div>`).join("");
    if (animate && !reduceMotion) {
      void listEl.offsetWidth;
      listEl.classList.add("fade");
    }

    // Centrar la pestaña activa SOLO desplazando el contenedor en horizontal
    // (scrollIntoView también desplazaba la página verticalmente al cargar).
    const activeTab = tabsEl.querySelector(".carta-tab.active");
    if (activeTab && tabsEl.scrollWidth > tabsEl.clientWidth) {
      const target = activeTab.offsetLeft - (tabsEl.clientWidth - activeTab.offsetWidth) / 2;
      tabsEl.scrollTo({
        left: Math.max(0, target),
        behavior: animate && !reduceMotion ? "smooth" : "auto",
      });
    }
  }
  renderCarta("parrilla", false);

  // ---------- Maridajes ----------
  const pairEl = document.getElementById("pairings");
  pairEl.innerHTML = PAIRINGS.map(p => `
    <div class="pair-row">
      <div class="pair-dish">${p.dish}</div>
      <div class="pair-wine"><strong>${p.wine}</strong><span class="note">${p.note}</span></div>
    </div>`).join("");

  // ---------- Opiniones ----------
  const opEl = document.getElementById("opiniones-grid");
  opEl.innerHTML = REVIEWS.map(r => `
    <article class="opinion">
      <div class="stars" aria-label="5 de 5 estrellas">★★★★★</div>
      <p class="opinion-quote">«${r.text}»</p>
      <div class="opinion-foot">
        <span class="opinion-name">${r.name}</span>
        <span class="opinion-meta">${r.meta} · ${r.when}</span>
      </div>
    </article>`).join("");

  // ---------- Galería + Lightbox ----------
  const galEl = document.getElementById("galeria-grid");
  let currentList = GALLERY.slice();

  function renderGallery(filter) {
    currentList = filter === "todo" ? GALLERY.slice() : GALLERY.filter(g => g.cat === filter);
    galEl.innerHTML = currentList.map((g, i) => `
      <button class="galeria-cell" data-cap="${g.cap}" data-i="${i}" style="animation-delay:${Math.min(i * 0.05, 0.5)}s" aria-label="Ampliar: ${g.cap}">
        <img src="${g.src}" alt="${g.cap}" loading="lazy" decoding="async">
      </button>`).join("");
  }
  renderGallery("todo");
  document.querySelectorAll(".galeria-filter button").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".galeria-filter button").forEach(x => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("active");
      b.setAttribute("aria-selected", "true");
      renderGallery(b.dataset.filter);
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-cap");
  let lbIndex = 0;

  function showLb() {
    const g = currentList[lbIndex];
    if (!g) return;
    lbImg.src = g.src;
    lbImg.alt = g.cap;
    lbCap.textContent = g.cap;
  }
  function openLightbox(i) {
    lbIndex = i;
    showLb();
    lastFocused = document.activeElement;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateBar();
    lightbox.querySelector("[data-lb-close]").focus();
  }
  function moveLb(dir) {
    lbIndex = (lbIndex + dir + currentList.length) % currentList.length;
    showLb();
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    updateBar();
    if (lastFocused) lastFocused.focus();
  }
  galEl.addEventListener("click", e => {
    const cell = e.target.closest(".galeria-cell");
    if (cell) openLightbox(Number(cell.dataset.i));
  });
  lightbox.querySelector("[data-lb-close]").addEventListener("click", closeLightbox);
  lightbox.querySelector("[data-lb-prev]").addEventListener("click", () => moveLb(-1));
  lightbox.querySelector("[data-lb-next]").addEventListener("click", () => moveLb(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  // ---------- Menú móvil ----------
  const mobile = document.getElementById("mobile-menu");
  const toggle = document.querySelector("[data-menu-open]");
  function openMobile() {
    lastFocused = document.activeElement;
    mobile.classList.add("open");
    mobile.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    updateBar();
    const firstLink = mobile.querySelector(".mobile-nav a");
    if (firstLink) firstLink.focus();
  }
  function closeMobile(restore) {
    if (!mobile.classList.contains("open")) return;
    mobile.classList.remove("open");
    mobile.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    updateBar();
    if (restore !== false && lastFocused) lastFocused.focus();
  }
  document.querySelectorAll("[data-menu-open]").forEach(b => b.addEventListener("click", openMobile));
  document.querySelectorAll("[data-menu-close]").forEach(b => b.addEventListener("click", () => closeMobile(false)));

  // ---------- Barra de acción móvil ----------
  const mobileBar = document.getElementById("mobile-bar");
  function updateBar() {
    const overlayOpen = mobile.classList.contains("open") ||
      backdrop.classList.contains("open") ||
      lightbox.classList.contains("open");
    const show = window.scrollY > hero.offsetHeight * 0.8 && !overlayOpen;
    mobileBar.classList.toggle("show", show);
  }

  // ---------- Modal de reserva ----------
  const backdrop = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const formHTML = `
    <form id="reserve-form" novalidate>
      <div class="field-group">
        <div class="field">
          <label for="r-name">Nombre</label>
          <input id="r-name" name="name" autocomplete="name" required>
        </div>
        <div class="field">
          <label for="r-phone">Teléfono</label>
          <input id="r-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required>
        </div>
        <div class="field">
          <label for="r-date">Fecha</label>
          <input id="r-date" name="date" type="date" required>
        </div>
        <div class="field">
          <label for="r-time">Hora</label>
          <select id="r-time" name="time" required>
            <option value="">—</option>
            <option>13:30</option><option>14:00</option><option>14:30</option><option>15:00</option>
            <option>20:30</option><option>21:00</option><option>21:30</option><option>22:00</option>
          </select>
        </div>
        <div class="field full">
          <label for="r-people">Comensales</label>
          <select id="r-people" name="people" required>
            <option value="">—</option>
            <option>1</option><option>2</option><option>3</option><option>4</option>
            <option>5</option><option>6</option><option>7</option><option>8+</option>
          </select>
        </div>
        <div class="field full">
          <label for="r-notes">Comentarios <span style="text-transform:none;letter-spacing:0;">(opcional)</span></label>
          <textarea id="r-notes" name="notes" rows="2" placeholder="Alergias, mesa preferida, ocasión..."></textarea>
        </div>
      </div>
      <div class="modal-foot">
        <p>¿Prefieres llamar? <a href="tel:+34619028128">619 02 81 28</a></p>
        <button type="submit" class="btn btn-wine">Solicitar reserva</button>
      </div>
    </form>`;

  function openModal() {
    lastFocused = document.activeElement;
    modalBody.innerHTML = formHTML;
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateBar();
    document.getElementById("r-date").min = new Date().toISOString().slice(0, 10);
    document.getElementById("r-name").focus();

    document.getElementById("reserve-form").addEventListener("submit", e => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      const dateStr = new Date(data.date + "T00:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      modalBody.innerHTML = `
        <div class="confirmation">
          <div class="conf-script">¡Gracias!</div>
          <h4>Solicitud recibida</h4>
          <p>Te confirmamos por teléfono en breve. Si no recibes llamada en una hora, marca <strong>619 02 81 28</strong>.</p>
          <div class="summary">
            <div><span>A nombre de</span><strong>${data.name}</strong></div>
            <div><span>Día</span><strong>${dateStr}</strong></div>
            <div><span>Hora</span><strong>${data.time}</strong></div>
            <div><span>Comensales</span><strong>${data.people}</strong></div>
          </div>
          <button type="button" class="btn btn-line-ink" data-modal-close>Cerrar</button>
        </div>`;
      const c = modalBody.querySelector("[data-modal-close]");
      c.addEventListener("click", closeModal);
      c.focus();
    });
  }
  function closeModal() {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    updateBar();
    if (lastFocused) lastFocused.focus();
  }
  document.querySelectorAll("[data-reserve]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openModal(); }));
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });
  document.querySelectorAll(".modal-close").forEach(b => b.addEventListener("click", closeModal));

  // ---------- Teclado global ----------
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (backdrop.classList.contains("open")) closeModal();
      else if (lightbox.classList.contains("open")) closeLightbox();
      else if (mobile.classList.contains("open")) closeMobile();
      return;
    }
    if (e.key === "Tab") {
      if (backdrop.classList.contains("open")) trapFocus(backdrop.querySelector(".modal"), e);
      else if (lightbox.classList.contains("open")) trapFocus(lightbox, e);
      else if (mobile.classList.contains("open")) trapFocus(mobile, e);
    }
    if (lightbox.classList.contains("open")) {
      if (e.key === "ArrowLeft") moveLb(-1);
      else if (e.key === "ArrowRight") moveLb(1);
    }
  });

  // ---------- Año ----------
  document.getElementById("year").textContent = new Date().getFullYear();

  // Estado inicial
  onScroll();
})();
