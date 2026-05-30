// Del Tinto al Odiel — SPA con secciones independientes

(function () {
  const { MENU, MENU_ORDER, REVIEWS, PAIRINGS, GALLERY } = window.RESTAURANT_DATA;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // ---------- Menú móvil ----------
  const mobile = document.getElementById("mobile-menu");
  const toggle = document.querySelector("[data-menu-open]");
  function openMobile() {
    lastFocused = document.activeElement;
    mobile.classList.add("open");
    mobile.setAttribute("aria-hidden", "false");
    toggle && toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    const firstBtn = mobile.querySelector(".nav-list button");
    if (firstBtn) firstBtn.focus();
  }
  function closeMobile(restore) {
    if (!mobile.classList.contains("open")) return;
    mobile.classList.remove("open");
    mobile.setAttribute("aria-hidden", "true");
    toggle && toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (restore !== false && lastFocused) lastFocused.focus();
  }
  document.querySelectorAll("[data-menu-open]").forEach(b => b.addEventListener("click", openMobile));
  document.querySelectorAll("[data-menu-close]").forEach(b => b.addEventListener("click", () => closeMobile()));

  // ---------- Barra de acción móvil ----------
  const mobileBar = document.getElementById("mobile-bar");
  function updateBar(view) {
    // se oculta en Inicio (el hero ya tiene sus CTA) y cuando hay overlay abierto
    const overlayOpen = mobile.classList.contains("open") ||
      document.getElementById("modal").classList.contains("open") ||
      document.getElementById("lightbox").classList.contains("open");
    const show = view !== "home" && !overlayOpen;
    mobileBar.classList.toggle("show", show);
  }

  // ---------- Routing ----------
  const views = ["home", "carta", "bodega", "eventos", "galeria", "opiniones", "contacto"];
  const header = document.querySelector(".header");
  let currentView = "home";

  function setView(name, push = true) {
    if (!views.includes(name)) name = "home";
    currentView = name;
    document.querySelectorAll(".view").forEach(v => {
      const on = v.dataset.view === name;
      v.classList.toggle("active", on);
      v.setAttribute("aria-hidden", on ? "false" : "true");
    });
    document.querySelectorAll("[data-nav]").forEach(b => b.classList.toggle("active", b.dataset.nav === name));

    const onDark = (name === "home");
    header.classList.toggle("on-dark", onDark);
    header.classList.toggle("solid", !onDark);

    document.querySelectorAll(".view").forEach(v => { v.scrollTop = 0; });

    if (push) {
      const hash = name === "home" ? "" : "#" + name;
      if (window.location.hash !== hash) {
        history.pushState({ view: name }, "", hash || window.location.pathname);
      }
    }
    closeMobile(false);
    updateBar(name);
    document.title = (name === "home" ? "" : titleFor(name) + " · ") + "Del Tinto al Odiel · Aracena";
  }
  function titleFor(n) {
    return { carta: "Carta", bodega: "Bodega", eventos: "Eventos", galeria: "Galería", opiniones: "Opiniones", contacto: "Contacto" }[n] || "";
  }

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-nav]");
    if (!t) return;
    e.preventDefault();
    setView(t.dataset.nav);
  });

  window.addEventListener("popstate", () => {
    const name = (window.location.hash || "#home").replace("#", "") || "home";
    setView(name, false);
  });

  const initial = (window.location.hash || "#home").replace("#", "") || "home";
  setView(initial, false);

  // ---------- Carta ----------
  const tabsEl = document.getElementById("carta-tabs");
  const mainHeadEl = document.getElementById("carta-head");
  const listEl = document.getElementById("carta-list");

  function renderCarta(activeKey) {
    tabsEl.innerHTML = MENU_ORDER.map(k => {
      const m = MENU[k];
      return `<button class="carta-tab ${k === activeKey ? "active" : ""}" data-tab="${k}" aria-pressed="${k === activeKey}">
        <span>${m.label}</span>
        <span class="count">${String(m.items.length).padStart(2, "0")}</span>
      </button>`;
    }).join("");
    tabsEl.querySelectorAll(".carta-tab").forEach(t => t.addEventListener("click", () => renderCarta(t.dataset.tab)));

    const m = MENU[activeKey];
    mainHeadEl.innerHTML = `<h3>${m.label}</h3><span class="meta">${m.items.length} platos</span>`;
    listEl.innerHTML = m.items.map(item => `
      <div class="menu-item">
        <div>
          <div class="menu-item-name">${item.name}${item.tag ? `<span class="menu-item-tag">${item.tag}</span>` : ""}</div>
          <div class="menu-item-desc">${item.desc}</div>
        </div>
        <div class="menu-item-price">${item.price}</div>
      </div>`).join("");

    const activeTab = tabsEl.querySelector(".carta-tab.active");
    if (activeTab && tabsEl.scrollWidth > tabsEl.clientWidth) {
      activeTab.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
    }
  }
  renderCarta("parrilla");

  // ---------- Bodega ----------
  const pairEl = document.getElementById("pairings");
  pairEl.innerHTML = PAIRINGS.map(p => `
    <div class="pair-row">
      <div class="dish">${p.dish}</div>
      <div class="wine-name"><strong>${p.wine}</strong><span class="note">${p.note}</span></div>
    </div>`).join("");

  // ---------- Opiniones ----------
  const opEl = document.getElementById("opiniones-grid");
  if (opEl) {
    opEl.innerHTML = REVIEWS.map(r => `
      <article class="opinion">
        <div class="stars" aria-label="5 de 5 estrellas">★★★★★</div>
        <p class="opinion-quote">«${r.text}»</p>
        <div class="opinion-foot">
          <span class="opinion-name">${r.name}</span>
          <span class="opinion-meta">${r.meta} · ${r.when}</span>
        </div>
      </article>`).join("");
  }

  // ---------- Galería + Lightbox ----------
  const galEl = document.getElementById("galeria-grid");
  let currentList = GALLERY.slice();

  function renderGallery(filter) {
    currentList = filter === "todo" ? GALLERY.slice() : GALLERY.filter(g => g.cat === filter);
    galEl.innerHTML = currentList.map((g, i) => `
      <button class="galeria-cell ${i === 0 ? "feat" : ""}" data-cap="${g.cap}" data-i="${i}" aria-label="Ampliar: ${g.cap}">
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

  function openLightbox(i) {
    lbIndex = i;
    showLb();
    lastFocused = document.activeElement;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateBar(currentView);
    lightbox.querySelector("[data-lb-close]").focus();
  }
  function showLb() {
    const g = currentList[lbIndex];
    if (!g) return;
    lbImg.src = g.src;
    lbImg.alt = g.cap;
    lbCap.textContent = g.cap;
  }
  function moveLb(dir) {
    lbIndex = (lbIndex + dir + currentList.length) % currentList.length;
    showLb();
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    updateBar(currentView);
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
          <label for="r-notes">Comentarios <span style="text-transform:none;letter-spacing:0;color:var(--mute);">(opcional)</span></label>
          <textarea id="r-notes" name="notes" rows="2" placeholder="Alergias, mesa preferida, ocasión..."></textarea>
        </div>
      </div>
      <div class="modal-foot">
        <p>¿Prefieres llamar? <a href="tel:+34619028128">619 02 81 28</a></p>
        <button type="submit" class="btn wine">Solicitar reserva</button>
      </div>
    </form>`;

  function openModal() {
    lastFocused = document.activeElement;
    modalBody.innerHTML = formHTML;
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateBar(currentView);
    const d = new Date();
    document.getElementById("r-date").min = d.toISOString().slice(0, 10);
    document.getElementById("r-name").focus();

    document.getElementById("reserve-form").addEventListener("submit", e => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      const dateStr = new Date(data.date + "T00:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      modalBody.innerHTML = `
        <div class="confirmation">
          <div class="script">¡Gracias!</div>
          <h4>Solicitud recibida</h4>
          <p>Te confirmamos por teléfono en breve. Si no recibes llamada en una hora, marca <strong>619 02 81 28</strong>.</p>
          <div class="summary">
            <div><span>A nombre de</span><strong>${data.name}</strong></div>
            <div><span>Día</span><strong>${dateStr}</strong></div>
            <div><span>Hora</span><strong>${data.time}</strong></div>
            <div><span>Comensales</span><strong>${data.people}</strong></div>
          </div>
          <button type="button" class="btn ghost" data-modal-close>Cerrar</button>
        </div>`;
      modalBody.querySelectorAll("[data-modal-close]").forEach(b => b.addEventListener("click", closeModal));
      const c = modalBody.querySelector("[data-modal-close]");
      if (c) c.focus();
    });
  }
  function closeModal() {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    updateBar(currentView);
    if (lastFocused) lastFocused.focus();
  }
  document.querySelectorAll("[data-reserve]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openModal(); }));
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });
  document.querySelectorAll("[data-modal-close]").forEach(b => b.addEventListener("click", closeModal));

  // ---------- Teclado global ----------
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (backdrop.classList.contains("open")) closeModal();
      else if (lightbox.classList.contains("open")) closeLightbox();
      else if (mobile.classList.contains("open")) closeMobile();
      return;
    }
    if (e.key === "Tab") {
      if (backdrop.classList.contains("open")) trapFocus(backdrop, e);
      else if (lightbox.classList.contains("open")) trapFocus(lightbox, e);
      else if (mobile.classList.contains("open")) trapFocus(mobile, e);
    }
    if (lightbox.classList.contains("open")) {
      if (e.key === "ArrowLeft") moveLb(-1);
      else if (e.key === "ArrowRight") moveLb(1);
    }
  });

  // ---------- Año ----------
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  window.__nav = setView;
})();
