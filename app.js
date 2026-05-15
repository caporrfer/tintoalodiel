// Del Tinto al Odiel — SPA con secciones independientes

(function () {
  const { MENU, MENU_ORDER, REVIEWS, PAIRINGS, GALLERY } = window.RESTAURANT_DATA;

  // ---------- Mobile menu ----------
  const mobile = document.getElementById("mobile-menu");
  function openMobile() { mobile.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeMobile() { mobile.classList.remove("open"); document.body.style.overflow = ""; }
  document.querySelectorAll("[data-menu-open]").forEach(b => b.addEventListener("click", openMobile));
  document.querySelectorAll("[data-menu-close]").forEach(b => b.addEventListener("click", closeMobile));

  // ---------- Routing ----------
  const views = ["home", "carta", "bodega", "eventos", "galeria", "opiniones", "contacto"];
  const header = document.querySelector(".header");

  function setView(name, push = true) {
    if (!views.includes(name)) name = "home";
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.dataset.view === name));
    document.querySelectorAll("[data-nav]").forEach(b => b.classList.toggle("active", b.dataset.nav === name));

    // Header colour adapts to view (only home is on dark photo)
    const onDark = (name === "home");
    header.classList.toggle("on-dark", onDark);
    header.classList.toggle("solid", !onDark);

    // Scroll containers to top
    document.querySelectorAll(".view").forEach(v => { v.scrollTop = 0; });

    if (push) {
      const hash = name === "home" ? "" : "#" + name;
      if (window.location.hash !== hash) history.pushState({ view: name }, "", "/" + hash);
    }
    closeMobile();
    document.title = (name === "home" ? "" : titleFor(name) + " · ") + "Del Tinto al Odiel · Aracena";
  }
  function titleFor(n) {
    return { carta: "Carta", bodega: "Bodega", eventos: "Eventos", galeria: "Galería", opiniones: "Opiniones", contacto: "Contacto" }[n] || "";
  }

  // Event delegation — survives DOM changes, any [data-nav] anywhere works
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

  // Initial route
  const initial = (window.location.hash || "#home").replace("#", "") || "home";
  setView(initial, false);

  // ---------- Carta ----------
  const tabsEl = document.getElementById("carta-tabs");
  const mainHeadEl = document.getElementById("carta-head");
  const listEl = document.getElementById("carta-list");

  function renderCarta(activeKey) {
    tabsEl.innerHTML = MENU_ORDER.map(k => {
      const m = MENU[k];
      return `<button class="carta-tab ${k === activeKey ? "active" : ""}" data-tab="${k}">
        <span>${m.label}</span>
        <span class="count">${String(m.items.length).padStart(2, "0")}</span>
      </button>`;
    }).join("");
    tabsEl.querySelectorAll(".carta-tab").forEach(t => t.addEventListener("click", () => renderCarta(t.dataset.tab)));

    const m = MENU[activeKey];
    mainHeadEl.innerHTML = `
      <h3>${m.label}</h3>
      <span class="meta">${m.items.length} platos</span>
    `;
    listEl.innerHTML = m.items.map(item => `
      <div class="menu-item">
        <div>
          <div class="menu-item-name">${item.name}${item.tag ? `<span class="menu-item-tag">${item.tag}</span>` : ""}</div>
          <div class="menu-item-desc">${item.desc}</div>
        </div>
        <div class="menu-item-price">${item.price}</div>
      </div>
    `).join("");

    // Scroll active tab into view on mobile
    const activeTab = tabsEl.querySelector(".carta-tab.active");
    if (activeTab && tabsEl.scrollWidth > tabsEl.clientWidth) {
      activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }
  renderCarta("parrilla");

  // ---------- Bodega pairings ----------
  const pairEl = document.getElementById("pairings");
  pairEl.innerHTML = PAIRINGS.map(p => `
    <div class="pair-row">
      <div class="dish">${p.dish}</div>
      <div class="wine-name"><strong>${p.wine}</strong><span class="note">${p.note}</span></div>
    </div>
  `).join("");

  // ---------- Opiniones ----------
  const opEl = document.getElementById("opiniones-grid");
  if (opEl) {
    opEl.innerHTML = REVIEWS.map(r => `
      <article class="opinion">
        <div class="stars">★★★★★</div>
        <p class="opinion-quote">«${r.text}»</p>
        <div class="opinion-foot">
          <span class="opinion-name">${r.name}</span>
          <span class="opinion-meta">${r.meta} · ${r.when}</span>
        </div>
      </article>
    `).join("");
  }

  // ---------- Galería ----------
  const galEl = document.getElementById("galeria-grid");
  function renderGallery(filter) {
    const items = filter === "todo" ? GALLERY : GALLERY.filter(g => g.cat === filter);
    galEl.innerHTML = items.map((g, i) => `
      <figure class="galeria-cell ${i === 0 ? "feat" : ""}" data-cap="${g.cap}">
        <img src="${g.src}" alt="${g.cap}" loading="lazy">
      </figure>
    `).join("");
  }
  renderGallery("todo");
  document.querySelectorAll(".galeria-filter button").forEach(b => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".galeria-filter button").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      renderGallery(b.dataset.filter);
    });
  });

  // ---------- Reservation modal ----------
  const backdrop = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const formHTML = `
    <form id="reserve-form">
      <div class="field-group">
        <div class="field">
          <label for="r-name">Nombre</label>
          <input id="r-name" name="name" required>
        </div>
        <div class="field">
          <label for="r-phone">Teléfono</label>
          <input id="r-phone" name="phone" type="tel" required>
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
          <label for="r-notes">Comentarios <em style="font-size:9px;color:var(--mute);text-transform:none;letter-spacing:0;margin-left:6px;">opcional</em></label>
          <textarea id="r-notes" name="notes" rows="2" placeholder="Alergias, mesa preferida, ocasión..."></textarea>
        </div>
      </div>
      <div class="modal-foot">
        <p>¿Prefieres llamar? <a href="tel:+34619028128" style="color:var(--ink);border-bottom:1px solid var(--line);">619 02 81 28</a></p>
        <button type="submit" class="btn wine">Solicitar reserva</button>
      </div>
    </form>
  `;

  function openModal() {
    modalBody.innerHTML = formHTML;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    const d = new Date();
    document.getElementById("r-date").min = d.toISOString().slice(0, 10);

    document.getElementById("reserve-form").addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
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
        </div>
      `;
      modalBody.querySelectorAll("[data-modal-close]").forEach(b => b.addEventListener("click", closeModal));
    });
  }
  function closeModal() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-reserve]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openModal(); }));
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });
  document.querySelectorAll("[data-modal-close]").forEach(b => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (backdrop.classList.contains("open")) closeModal();
      else if (mobile.classList.contains("open")) closeMobile();
    }
  });

  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Helper exposed for HTML onclick
  window.__nav = setView;
})();
