import { BASE, escapeHtml, escapeAttr, loginReturnPath, currentPath } from "./utils.js";
import { state, cartQty, money, subtotal } from "./state.js";
import { categories, productsByStore } from "./catalog.js";

export function header() {
  const address = state.profile.address || "Kilimani, Nairobi";
  const loginPageOpen = currentPath().startsWith("/en/login");
  const accountTarget = state.signedIn ? "/en/profile" : "/en/login?returnPath=%2Fen%2Fke%2Fnairobi";
  return `<header class="topbar">
    <a href="${BASE}" class="brand" data-route="${BASE}" aria-label="The Fast Dine home"><img class="brand-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine"></a>
    <button class="address-pill" data-action="address"><span class="pin-icon">⌖</span><span class="address-copy"><small>Deliver to</small><strong>${escapeHtml(address)}</strong></span><span class="chevron">⌄</span></button>
    <div class="header-search">
      <span>⌕</span>
      <input id="global-search" placeholder="Dishes, shops, groceries..." value="${escapeAttr(state.search)}" autocomplete="off" aria-label="Search dishes, shops, and groceries"/>
      ${state.search ? `<button type="button" class="search-clear-button" data-action="clear-search" aria-label="Clear search">✕</button>` : ""}
      <kbd title="Press Command+K or Control+K to search">⌘ K</kbd>
      <div id="global-search-results" class="header-search-results" role="listbox" aria-label="Search results" hidden></div>
    </div>
    <div class="header-actions">
      <button class="icon-button search-mobile" data-action="search" aria-label="Search">⌕</button>
      <button class="login-button" data-route="${loginPageOpen ? loginReturnPath() : accountTarget}"><span class="user-icon">♙</span><span>${loginPageOpen ? "Back" : state.signedIn ? escapeHtml(state.profile.name ? state.profile.name.split(" ")[0] : "My account") : "Log in"}</span></button>
      <button class="cart-button" data-action="cart"><span class="cart-icon">▱</span><span class="cart-label">Basket</span>${cartQty() ? `<b class="cart-count">${cartQty()}</b>` : ""}</button>
    </div>
  </header>`;
}

export function categoryTiles(compact = false) {
  return `<div class="category-grid ${compact ? "category-grid-compact" : ""}">${categories.map((cat, i) => `<button class="category-tile ${cat.tone}" data-category="${cat.id}" style="--delay:${i * 45}ms"><span class="category-emoji">${cat.icon}</span><span class="category-label">${cat.title}</span><span class="category-sub">${compact ? "Explore" : cat.subtitle}</span><span class="tile-arrow">↗</span></button>`).join("")}</div>`;
}

export function storeCard(store) {
  const assortmentCount = productsByStore[store.id]?.length || 0;
  const isRetailStore = ["groceries", "pharmacy"].includes(store.category);
  const retailLabel = isRetailStore && assortmentCount
    ? `<span>${store.category === "pharmacy" ? "Personal care & wellness" : "Fresh & everyday essentials"}</span><i></i><span>${assortmentCount} picks</span>`
    : `<span>◷ ${store.time}</span><i></i><span>${store.fee ? `${money(store.fee)} delivery` : "Free delivery"}</span>`;
  return `<article class="store-card" data-store="${store.id}" tabindex="0" role="button" aria-label="Open ${escapeAttr(store.name)}">
    <div class="store-photo-wrap"><img class="store-photo" src="${store.image}" alt="${escapeAttr(store.name)}" loading="lazy"><span class="store-badge">${store.badge}</span><span class="favorite-heart" data-favorite="${store.id}" aria-label="Save ${store.name}">♡</span>${store.promo ? `<span class="promo-tag">${store.promo}</span>` : ""}</div>
    <div class="store-info"><div class="store-title-row"><strong>${store.name}</strong><span class="rating">★ ${store.rating}</span></div><p>${store.cuisine}</p><div class="store-meta">${isRetailStore ? `<span>◷ ${store.time}</span><i></i>${retailLabel}` : `<span>◷ ${store.time}</span><i></i><span>${store.fee ? `${money(store.fee)} delivery` : "Free delivery"}</span>`}</div></div>
  </article>`;
}

export function section(title, description, list, extra = "") {
  const content = list.length
    ? `<div class="store-grid">${list.map(storeCard).join("")}</div>`
    : `<div class="empty-state"><span>🔎</span><h3>No matches yet</h3><p>Try another dish, shop, or category.</p><button class="button-dark" data-action="clear-search">Clear search</button></div>`;
  return `<section class="content-section"><div class="section-heading"><div><p class="eyebrow">${extra || "MADE FOR YOUR DAY"}</p><h2>${title}</h2>${description ? `<p class="section-description">${description}</p>` : ""}</div><button class="text-link" data-action="see-all">See all <span>→</span></button></div>${content}</section>`;
}

export function dealProductCards(products, storeId = "tamu-deals") {
  return products.map(product => `<article class="deal-product-card"><div class="deal-product-image"><img src="${product.image}" alt="${escapeAttr(product.name)}"><span>${product.tag || "Fast Dine pick"}</span></div><div class="deal-product-info"><h3>${product.name}</h3><p>${product.description}</p><div><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}<button data-add="${product.id}" data-store="${storeId}" aria-label="Add ${escapeAttr(product.name)}">＋</button></div></div></article>`).join("");
}

export function footer() {
  return `<footer class="site-footer"><div class="footer-top"><div class="footer-brand"><a class="brand" href="${BASE}" data-route="${BASE}" aria-label="The Fast Dine home"><img class="brand-logo footer-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine"></a><p>Good things, coming your way.<br>Made with a little Nairobi love.</p></div><div><h4>Explore</h4><a href="${BASE}/categories/food_1" data-route="${BASE}/categories/food_1">Food</a><a href="${BASE}/categories/groceries_4" data-route="${BASE}/categories/groceries_4">Groceries</a><a href="${BASE}/categories/shops_22" data-route="${BASE}/categories/shops_22">Shops</a></div><div><h4>Your account</h4><a href="/en/profile" data-route="/en/profile">Profile</a><a href="/en/profile/past-orders" data-route="/en/profile/past-orders">Past orders</a><a href="/en/profile/account/payment-methods" data-route="/en/profile/account/payment-methods">Payment methods</a></div><div><h4>Say hello</h4><a href="mailto:hello@fastdine.example">Help & support</a><a href="/en/profile/account/privacy-settings" data-route="/en/profile/account/privacy-settings">Privacy</a><span class="social-links">◎　◉　✦</span></div></div><div class="footer-bottom"><span>© 2026 The Fast Dine · Nairobi, Kenya</span><span>Made for the good days and the busy ones.</span><a href="/en" data-route="/en">English · KSh</a></div></footer>`;
}

export function mobileDock() {
  const path = currentPath();
  const active = path === BASE || path === "/" || path === "/en" ? "explore" : path.includes("/categories/food_") ? "food" : path.includes("/categories/groceries_") ? "groceries" : path.includes("past-orders") ? "orders" : path.startsWith("/en/profile") || path.startsWith("/en/login") ? "account" : "";
  const accountPath = state.signedIn ? "/en/profile" : "/en/login?returnPath=%2Fen%2Fke%2Fnairobi";
  const links = [
    { id: "explore", label: "Explore", icon: "⌂", path: BASE },
    { id: "food", label: "Food", icon: "✳", path: `${BASE}/categories/food_1` },
    { id: "groceries", label: "Groceries", icon: "♧", path: `${BASE}/categories/groceries_4` },
    { id: "orders", label: "Orders", icon: "◷", path: "/en/profile/past-orders" },
    { id: "account", label: "Account", icon: "♙", path: accountPath }
  ];
  return `<nav class="mobile-dock" aria-label="Main navigation">${links.map(link => `<a href="${link.path}" data-route="${link.path}" class="${active === link.id ? "active" : ""}" ${active === link.id ? 'aria-current="page"' : ""}><span>${link.icon}</span><small>${link.label}</small></a>`).join("")}</nav>`;
}
