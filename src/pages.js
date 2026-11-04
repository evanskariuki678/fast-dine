import { BASE, escapeHtml, escapeAttr, loginReturnPath, currentPath } from "./utils.js";
import { state, save, subtotal, cartQty, money, promoDiscount, selectedPayment, paymentName, read } from "./state.js";
import { categories, stores, productsByStore, image } from "./catalog.js";
import { header, footer, categoryTiles, storeCard, dealProductCards, section } from "./components.js";

export const settings = [
  { id: "profile", title: "Personal details", icon: "♙", path: "/en/profile" },
  { id: "past-orders", title: "Past orders", icon: "◷", path: "/en/profile/past-orders" },
  { id: "account", title: "Account", icon: "⚙", path: "/en/profile/account" },
  { id: "phone-number", title: "Phone number", icon: "⌕", path: "/en/profile/account/phone-number" },
  { id: "change-password", title: "Change password", icon: "▣", path: "/en/profile/account/change-password" },
  { id: "payment-methods", title: "Payment methods", icon: "▤", path: "/en/profile/account/payment-methods" },
  { id: "promo-codes", title: "Promo codes", icon: "✦", path: "/en/profile/account/promo-codes" },
  { id: "gift-cards", title: "Gift cards", icon: "▧", path: "/en/profile/account/gift-cards" },
  { id: "invoice-information", title: "Invoice information", icon: "▥", path: "/en/profile/account/invoice-information" },
  { id: "privacy-settings", title: "Privacy settings", icon: "◈", path: "/en/profile/account/privacy-settings" },
  { id: "language", title: "Language", icon: "文", path: "/en/profile/language" }
];

export function categoryTitle(id) {
  return categories.find(item => item.id === id)?.title || "Stores";
}

export function homePage() {
  const filtered = stores.filter(store => {
    const matches = !state.search || `${store.name} ${store.cuisine} ${store.category}`.toLowerCase().includes(state.search.toLowerCase());
    const category = state.categoryFilter === "all" || store.category === state.categoryFilter;
    return matches && category;
  });
  const showSearch = state.search || state.categoryFilter !== "all";
  return `<main class="home-page">
    <section class="hero-section">
      <div class="hero-copy"><div class="hero-kicker"><span>✳</span> YOUR NEIGHBOURHOOD, ON THE WAY</div><h1>Good things,<br><em>coming your way.</em></h1><p>Food, groceries and little everyday joys, delivered across Nairobi.</p>
        <div class="hero-address"><span class="pin-icon">⌖</span><input id="hero-address" placeholder="Where should we deliver?" value="${escapeAttr(state.profile.address)}"><button data-action="set-address">Find my spot <span>→</span></button></div>
        <div class="hero-note"><span class="tiny-check">✓</span> Fast local delivery <span class="note-dot">·</span> Made for Nairobi</div>
      </div>
      <div class="hero-art"><div class="hero-shape"></div><img src="${image("photo-1565299624946-b28f40a0ae38", 1100)}" alt="Freshly baked pizza with colourful toppings"/><div class="floating-note floating-note-one"><span>✦</span><div><strong>Little joys,</strong><small>right to your door</small></div></div><div class="floating-note floating-note-two"><span>⏱</span><div><strong>30 min</strong><small>your meal's on its way</small></div></div><div class="hero-sticker">made<br>for you<span>♥</span></div></div>
      <span class="hero-sparkle sparkle-one">✳</span><span class="hero-sparkle sparkle-two">✦</span>
    </section>
    <section class="category-section"><div class="section-heading"><div><p class="eyebrow">A LITTLE BIT OF EVERYTHING</p><h2>What are you in the mood for?</h2></div><span class="small-caption">All around Nairobi <span>⌖</span></span></div>${categoryTiles()}</section>
    <section class="deal-banner"><div class="deal-copy"><span class="deal-label">A LITTLE SOMETHING EXTRA</span><h2>Good finds.<br>Even better prices.</h2><p>Fresh picks and everyday favourites on special today.</p><button class="button-dark" data-category="deals">Explore Fast Dine Deals <span>→</span></button></div><div class="deal-image"><img src="${image("photo-1542838132-92c53300491e", 1000)}" alt="Fresh market produce"><div class="deal-burst"><b>UP TO</b><strong>40%</strong><b>OFF</b></div></div></section>
    ${showSearch ? section(state.search ? `Results for “${escapeHtml(state.search)}”` : `${categoryTitle(state.categoryFilter)} near you`, "A few lovely places to start.", filtered) : section("A few local favourites", "Loved by your neighbours, ready when you are.", stores.filter(store => store.category === "food").slice(0, 4), "AROUND THE CORNER")}
    ${!showSearch ? `<section class="feature-strip"><div class="feature-icon">🥬</div><div><p class="eyebrow">FRESH FROM THE MARKET</p><h3>Your weekly shop, sorted.</h3><p>Fresh produce, pantry essentials and a few treats for the week ahead.</p></div><button data-category="groceries">Shop groceries <span>→</span></button><div class="feature-art"><img src="${image("photo-1540420773420-3366772f4999", 660)}" alt="Colourful fresh vegetables"></div></section>${section("Something for every day", "Good food and good finds, from places around the corner.", stores.filter(store => ["groceries", "pharmacy", "shops", "alcohol"].includes(store.category)).slice(0, 4), "NEARBY & READY")}` : ""}
    <section class="promise-row"><div><span>⌖</span><strong>Made for your neighbourhood</strong><p>Nearby places you know and love.</p></div><div><span>✿</span><strong>A little more thoughtful</strong><p>Local picks, delivered with care.</p></div><div><span>◷</span><strong>On your time</strong><p>Easy ordering, right when you need it.</p></div></section>
    ${footer()}
  </main>`;
}

export function englishLandingPage() {
  const featuredStores = stores.filter(store => store.category === "food").slice(0, 4);
  return `<main class="english-home">
    <section class="english-hero">
      <div class="english-hero-copy"><p class="hero-kicker"><span>✳</span> THE FAST DINE · NAIROBI</p><h1>Food delivery<br><em>and more.</em></h1><p>Groceries, local shops, pharmacy essentials and your next favourite meal — all brought to your door.</p><form class="english-address" data-form="english-address"><span class="pin-icon">⌖</span><input name="address" placeholder="Enter your Nairobi delivery address" aria-label="Delivery address" required><button>Find places <span>→</span></button></form><button class="english-location-link" data-route="${BASE}">Explore Nairobi <span>↗</span></button></div>
      <div class="english-hero-art"><div class="english-art-orbit"></div><img src="${image("photo-1547592180-85f173990554", 1000)}" alt="Freshly prepared bowl of food"><span class="hero-sticker hero-sticker-floating">fresh & ready<span>♥</span></span></div>
    </section>
    <section class="english-featured"><div class="section-heading"><div><p class="eyebrow">AROUND THE CORNER</p><h2>Popular in Nairobi</h2><p class="section-description">Local favourites and familiar names, ready when you are.</p></div><button class="text-link" data-route="${BASE}/categories/food_1">Browse food <span>→</span></button></div><div class="store-grid">${featuredStores.map(storeCard).join("")}</div></section>
    <section class="english-perks"><article><span>⌖</span><p class="eyebrow">NEAR YOU</p><h3>Find places around your neighbourhood</h3><p>Start with Kilimani or set a delivery address to explore what’s nearby.</p><button data-route="${BASE}">Explore Nairobi <b>→</b></button></article><article><span>◷</span><p class="eyebrow">ON YOUR TIME</p><h3>Food and everyday essentials</h3><p>Browse restaurants, groceries, pharmacy and shops in one place.</p><button data-category="groceries">Browse categories <b>→</b></button></article><article><span>♡</span><p class="eyebrow">MADE FOR YOU</p><h3>A little more convenience</h3><p>Save your details, keep track of orders and make each visit easier.</p><button data-route="/en/profile">Your account <b>→</b></button></article></section>
    <section class="english-kenya"><div><p class="eyebrow">CURRENTLY SERVING</p><h2>Kenya <span>🇰🇪</span></h2><p>Good things are on the way in Nairobi.</p></div><button class="button-dark" data-route="${BASE}">Go to Nairobi <span>→</span></button></section>
    ${footer()}
  </main>`;
}

export function categoryPage(category) {
  const list = stores.filter(store => store.category === category.id);
  const chips = category.id === "food" ? ["Popular", "Chicken", "Burgers", "Cafe & coffee", "Bakery", "Desserts", "All restaurants"] : category.id === "groceries" ? ["Supermarket", "Fruit & veg", "Bakery", "Dairy", "Drinks", "Household"] : category.id === "pharmacy" ? ["Pharmacy", "Beauty", "Baby care", "Wellness"] : category.id === "shops" ? ["Flowers", "Beauty", "Home", "Gifts", "Electronics"] : category.id === "alcohol" ? ["Wine", "Beer", "Spirits", "Mixers", "Snacks"] : ["Top deals", "Pantry", "Fresh picks", "Bundles"];
  const found = list.filter(store => !state.search || `${store.name} ${store.cuisine}`.toLowerCase().includes(state.search.toLowerCase()));
  const heroImage = category.id === "food" ? image("photo-1547592180-85f173990554", 800) : category.id === "groceries" ? image("photo-1542838132-92c53300491e", 800) : category.id === "pharmacy" ? image("photo-1596462502278-27bfdc403348", 800) : category.id === "alcohol" ? image("photo-1510812431401-41d2bd2722f3", 800) : image("photo-1490750967868-88aa4486c946", 800);
  const eyebrow = category.id === "food" ? "RESTAURANTS AROUND NAIROBI" : "DELIVERED AROUND NAIROBI";
  const heading = category.id === "food" ? "Restaurants near you" : "All stores";
  const description = category.id === "food" ? "Explore local favourites, cafes and comfort food" : category.subtitle;
  const paletteClass = category.id === "food" ? "palette-food" : category.id === "groceries" ? "palette-groceries" : category.id === "pharmacy" ? "palette-pharmacy" : "";
  return `<main class="listing-page ${paletteClass}"><div class="breadcrumbs"><button data-route="${BASE}">Nairobi</button><span>›</span><b>${category.title}</b></div><section class="listing-hero ${category.tone}"><div><span class="listing-icon">${category.icon}</span><p class="eyebrow">${eyebrow}</p><h1>${category.title}</h1><p>${description}.</p></div><div class="listing-art"><img src="${heroImage}" alt=""></div></section><div class="listing-content"><div class="chip-row">${chips.map((chip, index) => `<button class="filter-chip ${index === 0 ? "selected" : ""}" data-filter-chip="${escapeAttr(chip)}">${chip}</button>`).join("")}<button class="filter-button" data-action="sort">☷ <span>Sort & filter</span></button></div><div class="listing-header"><div><p class="eyebrow">PICKED FOR YOU</p><h2>${heading} <span class="result-count">${found.length}</span></h2></div><label class="sort-label">Sort by <select id="sort-select"><option>Recommended</option><option>Top rated</option><option>Fastest delivery</option></select></label></div><div class="store-grid store-grid-large" id="listing-stores">${found.map(storeCard).join("")}</div>${!found.length ? `<div class="empty-state"><span>🔎</span><h3>No places found</h3><p>Try a different search or choose another category.</p><button class="button-dark" data-action="clear-search">Clear search</button></div>` : ""}</div>${footer()}</main>`;
}

export function storeDetailPage(store) {
  const products = productsByStore[store.id] || [];
  const isFood = store.category === "food";
  const isPharmacy = store.category === "pharmacy";
  const tabs = isFood ? ["Popular", ...new Set(products.map(product => product.tag).filter(Boolean))] : ["All products", ...Array.from(new Set(products.map(product => product.tag).filter(Boolean))).slice(0, 7)];
  const sectionName = isFood ? "Menu" : isPharmacy ? "Pharmacy & beauty essentials" : store.category === "groceries" ? "Groceries & household" : "Today's offers";
  const breadcrumbCategory = isFood ? "Food" : isPharmacy ? "Pharmacy & Beauty" : "Groceries";
  const breadcrumbPath = `${BASE}/categories/${isFood ? "food_1" : isPharmacy ? "pharmacy-beauty_3" : "groceries_4"}`;
  const eyebrow = isFood ? "MADE FRESH, READY FOR YOU" : isPharmacy ? "EVERYDAY CARE, CLOSE BY" : "YOUR EVERYDAY SHOPPING, MADE EASY";
  const detailEyebrow = isFood ? "GOOD FOOD, PICKED FOR YOU" : isPharmacy ? "CARE & WELLNESS, PICKED FOR YOU" : "GOOD FINDS, PICKED FOR YOU";
  const searchPlaceholder = `Search ${store.name}`;
  const paletteClass = isFood ? "palette-food" : isPharmacy ? "palette-pharmacy" : store.category === "groceries" ? "palette-groceries" : "";
  return `<main class="listing-page store-detail-page ${isFood ? "food-menu-page" : ""} ${paletteClass}"><div class="breadcrumbs"><button data-route="${BASE}">Nairobi</button><span>›</span><button data-route="${breadcrumbPath}">${breadcrumbCategory}</button><span>›</span><b>${store.name}</b></div><section class="store-page-hero"><img src="${store.image}" alt=""><div class="store-page-copy"><span class="store-badge">${store.badge}</span><p class="eyebrow">${eyebrow}</p><h1>${store.name}</h1><p>${store.description}</p><div class="store-modal-meta"><span>★ ${store.rating} (${store.count})</span><span>◷ ${store.time}</span><span>${money(store.fee)} delivery</span></div></div></section><div class="store-detail-tags">${tabs.map((tab, i) => `<button class="filter-chip ${i === 0 ? "selected" : ""}" data-filter-chip="${escapeAttr(tab)}">${tab}</button>`).join("")}<label class="store-detail-search">⌕ <input id="store-search" aria-label="Search ${escapeAttr(store.name)} menu" placeholder="${escapeAttr(searchPlaceholder)}"></label></div><div class="store-detail-layout"><section><div class="listing-header"><div><p class="eyebrow">${detailEyebrow}</p><h2>${sectionName} <span class="result-count">${products.length}</span></h2></div><span class="store-open-label"><i></i> Open now</span></div><div class="deal-product-grid" id="deal-products">${dealProductCards(products, store.id)}</div></section><aside class="store-side-card"><span class="side-card-icon">${isFood ? "🍽️" : "🧺"}</span><p class="eyebrow">YOUR BASKET</p><h3>${cartQty() ? `${cartQty()} lovely pick${cartQty() > 1 ? "s" : ""}` : "Room for something good"}</h3><p>${cartQty() ? `${money(subtotal())} subtotal · ${money(store.fee)} delivery` : `Choose something from the menu to get started.`}</p><button class="button-dark full-width" data-action="cart">${cartQty() ? "View basket" : isFood ? "Browse menu" : "Browse offers"} <span>→</span></button></aside></div>${footer()}</main>`;
}

export function authPageUrl(page, mode = state.authMode, method = state.authMethod) {
  const params = new URLSearchParams({ returnPath: loginReturnPath() });
  if (page === "verify") { params.set("mode", mode); params.set("method", method); }
  const path = page === "login" ? "/en/login" : `/en/login/${page}`;
  return `${path}?${params.toString()}`;
}

export function loginPage() {
  const returnPath = loginReturnPath();
  const path = currentPath();
  const page = path === "/en/login/signup" ? "signup" : path === "/en/login/verify" ? "verify" : path === "/en/login/recovery" ? "recovery" : "login";
  const params = new URLSearchParams(window.location.search);
  if (page === "signup") state.authMode = "signup";
  if (page === "login") state.authMode = "login";
  if (page === "verify") state.authMode = params.get("mode") || state.authMode;
  state.authMethod = "email";
  const maskedIdentity = state.authIdentity.includes("@")
    ? `${state.authIdentity[0]}•••${state.authIdentity.slice(state.authIdentity.indexOf("@"))}`
    : "";
  let authBody;
  if (state.signedIn) {
    authBody = `<div class="auth-success-mark">✓</div><p class="eyebrow">THE FAST DINE ACCOUNT</p><h1>You're already in.</h1><p class="auth-intro">Your account is ready. Head back to Nairobi and find something lovely.</p><button class="button-dark full-width" data-route="${returnPath}">Continue to Nairobi <span>→</span></button><button class="auth-secondary" data-route="/en/profile">Manage account</button>`;
  } else if (page === "verify" && state.authMode !== "signup") {
    authBody = `<p class="eyebrow">PASSWORD SIGN-IN</p><h1>Use your password to log in.</h1><p class="auth-intro">Email verification codes are only used to confirm new accounts. Log in with your email and password instead.</p><button class="button-dark full-width" data-route="${authPageUrl("login")}">Back to log in <span>→</span></button>`;
  } else if (page === "verify" && !state.authIdentity) {
    authBody = `<p class="eyebrow">VERIFICATION</p><h1>Start with your details.</h1><p class="auth-intro">For privacy, your contact details aren't in this link. Return to the first step and request a new sign-in code.</p><button class="button-dark full-width" data-route="${authPageUrl("login")}">Back to log in <span>→</span></button>`;
  } else if (page === "verify") {
    authBody = `<button class="auth-back-step" data-auth-step="${state.authMode === "signup" ? "signup" : "login"}">← Change details</button><p class="eyebrow">STEP 2 OF 2 · VERIFY EMAIL</p><h1>Check your inbox.</h1><p class="auth-intro">Enter the 6-digit code sent to <strong>${escapeHtml(maskedIdentity)}</strong> to ${state.authMode === "signup" ? "finish creating your account" : "continue to your account"}.</p><form class="auth-form" data-form="verify"><label>Email verification code<input id="auth-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="6-digit code" required autofocus></label>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<button class="button-dark full-width">Verify and continue <span>→</span></button></form><div class="settings-note">Supabase checks your code and creates your signed-in session. Never share the code with anyone.</div><button class="auth-secondary" data-action="auth-resend">Didn't receive a code? Send again</button>`;
  } else if (page === "recovery") {
    const resetLinkRequested = params.get("mode") === "reset";
    const canSetNewPassword = resetLinkRequested && state.passwordRecoveryReady;
    const recoveryBody = canSetNewPassword
      ? `<p class="auth-intro">Choose a new password for your account.</p><form data-form="password-reset" class="auth-form"><label>New password<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><label>Confirm new password<input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<button class="button-dark full-width">Save new password <span>→</span></button></form>`
      : state.recoveryEmailSent
        ? `<p class="auth-intro">If an account exists for that email, a password reset link is on its way. Check your inbox and spam folder.</p><button class="auth-secondary" data-action="recovery-resend">Send another reset link</button>`
        : `<p class="auth-intro">${resetLinkRequested ? "This reset link may have expired or already been used. Enter your email to request a fresh one." : "Enter the email address on your account and we'll send you a secure password reset link."}</p><form data-form="recovery" class="auth-form"><label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" value="${escapeAttr(state.authIdentity || state.profile.email)}" required></label>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<button class="button-dark full-width">Send password reset link <span>→</span></button></form>`;
    authBody = `<button class="auth-back-step" data-auth-step="login">← Back to log in</button><p class="eyebrow">ACCOUNT RECOVERY</p><h1>Reset your password.</h1>${recoveryBody}`;
  } else if (page === "signup") {
    authBody = `<div class="auth-mode-tabs"><button data-auth-mode="login">Log in</button><button class="active" data-auth-mode="signup">Create account</button></div><p class="eyebrow">STEP 1 OF 2 · YOUR DETAILS</p><h1>Let's get you started.</h1><p class="auth-intro">Create your account with an email and password. We'll email you a six-digit code to verify your address.</p>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<form data-form="signup" class="auth-form"><label>Full name<input name="name" autocomplete="name" placeholder="Your name" value="${escapeAttr(state.authDraft.name || "")}" required></label><label>Email address<input name="email" type="email" autocomplete="email" placeholder="you@example.com" value="${escapeAttr(state.authDraft.email || "")}" required></label><label>Password<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><label>Confirm password<input name="confirm" type="password" autocomplete="new-password" minlength="8" required></label><label class="auth-consent"><input type="checkbox" name="demoTerms" required><span>I agree to the Terms and Privacy Policy. <button type="button" data-action="auth-terms">Read the note</button></span></label><button class="button-dark full-width">Create account <span>→</span></button></form><p class="auth-terms">Have an account? <button data-auth-mode="login">Log in</button></p>`;
  } else {
    authBody = `<div class="auth-mode-tabs"><button class="active" data-auth-mode="login">Log in</button><button data-auth-mode="signup">Create account</button></div><p class="eyebrow">SIGN IN</p><h1>Good to see you.</h1><p class="auth-intro">Log in with the email address and password for your account.</p>${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}<form data-form="login" class="auth-form"><label>Email address<input name="identity" type="email" autocomplete="email" placeholder="you@example.com" value="${escapeAttr(state.authIdentity || state.profile.email)}" required></label><label>Password<input name="password" type="password" autocomplete="current-password" minlength="8" required></label><button class="button-dark full-width">Log in <span>→</span></button></form>${state.authResendAvailable ? `<button class="auth-secondary auth-resend-link" data-action="auth-resend">Resend email verification code</button>` : ""}<div class="auth-problems"><span>Having trouble?</span><button data-auth-step="recovery">Forgot your password?</button></div><p class="auth-terms">By continuing, you agree to the <button type="button" data-action="auth-terms">Terms and Privacy Policy</button>.</p><div class="auth-preview-note"><span>✓</span><p>Supabase verifies your email and manages your account session. Your password is never stored in this app.</p></div>`;
  }
  return `<main class="auth-page"><div class="auth-breadcrumb"><button data-route="${returnPath}">← Back to Nairobi</button><span>THE FAST DINE ACCOUNT</span></div><div class="auth-layout"><section class="auth-card"><img class="auth-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine">${authBody}</section><aside class="auth-art"><img src="${image("photo-1547592180-85f173990554", 1000)}" alt="A freshly prepared meal"><div class="auth-art-caption"><span>GOOD FOOD, GOOD COMPANY</span><h2>Your next favourite<br>is just around the corner.</h2><p>Nairobi's local spots, ready when you are.</p></div><span class="auth-art-sticker">fresh<br>& local ✳</span></aside></div>${footer()}</main>`;
}

export function profilePage(path) {
  const current = settings.find(item => item.path === path) || settings[0];
  const body = profileContent(current);
  return `<main class="profile-page"><div class="breadcrumbs"><button data-route="${BASE}">Home</button><span>›</span><b>My account</b>${current.id !== "profile" ? `<span>›</span><b>${current.title}</b>` : ""}</div><div class="profile-layout"><aside class="profile-sidebar"><div class="profile-intro"><span class="profile-avatar">${(state.profile.name || "T").trim().charAt(0).toUpperCase()}</span><div><small>GOOD TO SEE YOU</small><h2>${escapeHtml(state.profile.name || "Your account")}</h2><span>${escapeHtml(state.profile.email || "Your details, all in one place")}</span></div></div><nav class="profile-nav">${settings.map(item => `<button class="profile-nav-item ${current.id === item.id ? "active" : ""}" data-route="${item.path}"><span>${item.icon}</span>${item.title}<b>›</b></button>`).join("")}<button class="profile-nav-item signout-link" data-action="logout"><span>↪</span>Sign out</button></nav></aside><section class="profile-content"><p class="eyebrow">YOUR FAST DINE ACCOUNT</p><h1>${current.title}</h1>${body}</section></div>${footer()}</main>`;
}

export function profileContent(item) {
  if (item.id === "past-orders") {
    return state.orders.length
      ? `<div class="past-order-list">${state.orders.map(order => `<article class="past-order-card"><div class="past-order-header"><div><strong>${escapeHtml(order.store || "The Fast Dine")}</strong><small>${escapeHtml(new Date(order.createdAt).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" }))}</small></div><span class="order-status-badge ${order.persisted ? "order-status-persisted" : ""}">${escapeHtml(order.status || "Order confirmed")}</span></div><div class="past-order-items">${order.items.map(entry => `<span>${entry.qty} × ${escapeHtml(entry.name)}</span>`).join("")}</div><div class="past-order-footer"><div><small>Total paid</small><b>${money(order.total)}</b></div><span class="order-pill">${order.persisted ? "Saved to Supabase" : "Saved on this device"}</span></div></article>`).join("")}</div>`
      : `<div class="settings-empty"><span>◷</span><h3>No past orders yet.</h3><p>When you place an order, you'll find the details here.</p><button class="button-dark" data-route="${BASE}">Find something to eat <span>→</span></button></div>`;
  }
  if (item.id === "profile") {
    return `<p class="profile-lead">Your personal details make checkouts quicker.</p><form class="settings-form" data-form="profile"><label>Your name<input name="name" autocomplete="name" value="${escapeAttr(state.profile.name)}"></label><label>Email address<input name="email" type="email" autocomplete="email" value="${escapeAttr(state.profile.email)}"></label><label>Phone number<input name="phone" type="tel" autocomplete="tel" value="${escapeAttr(state.profile.phone)}"></label><label>Delivery address<input name="address" value="${escapeAttr(state.profile.address)}"></label><label>Apartment or floor <span class="optional">OPTIONAL</span><input name="apartment" value="${escapeAttr(state.profile.apartment)}"></label><label>Delivery note <span class="optional">OPTIONAL</span><textarea name="note" placeholder="Gate codes or helpful directions">${escapeHtml(state.profile.note)}</textarea></label><div class="form-footer"><span>Saved to your Fast Dine account</span><button class="button-dark">Save changes <span>→</span></button></div></form>`;
  }
  if (item.id === "phone-number") {
    return `<p class="profile-lead">We use your phone number to give the courier a call if they need help finding you.</p><form class="settings-form narrow-form" data-form="phone-number"><label>Kenyan mobile number<input name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678" value="${escapeAttr(state.profile.phone || "")}" required pattern="^(?:\\+?254|0)?[17]\\d{8}$"></label><div class="form-footer"><span>Standard Kenyan mobile numbers only</span><button class="button-dark">Save phone number <span>→</span></button></div></form>`;
  }
  if (item.id === "change-password") {
    return `<p class="profile-lead">Choose a strong password with at least 8 characters.</p><form class="settings-form narrow-form" data-form="change-password"><label>New password<input name="newPassword" type="password" autocomplete="new-password" minlength="8" required></label><label>Confirm new password<input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required></label><div class="form-footer"><span>Must be at least 8 characters</span><button class="button-dark">Update password <span>→</span></button></div></form>`;
  }
  if (item.id === "account") {
    return `<p class="profile-lead">Manage your account credentials and security settings.</p><div class="account-actions-list"><div class="account-action-card"><div><strong>Sign out of your account</strong><p>End your active session on this device.</p></div><button class="button-outline" data-action="logout">Sign out</button></div></div>`;
  }
  if (item.id === "payment-methods") {
    return `<p class="profile-lead">Manage how you like to pay. Choose a preferred method for faster checkout.</p><div class="payment-method-list">${state.payments.map(method => `<article class="payment-method-card ${method.isDefault ? "default" : ""}"><div><span class="payment-icon">${method.type === "card" ? "💳" : method.type === "mpesa" ? "📱" : "💵"}</span><div><strong>${escapeHtml(paymentName(method))}</strong>${method.isDefault ? `<span class="default-badge">Preferred</span>` : ""}</div></div><div class="payment-method-actions">${method.isDefault ? "" : `<button data-default-payment="${escapeAttr(method.id)}">Set as preferred</button>`}<button class="payment-delete-button" data-delete-payment="${escapeAttr(method.id)}" aria-label="Remove ${escapeAttr(paymentName(method))}">×</button></div></article>`).join("")}</div><button class="button-outline add-payment-button" data-action="add-payment-method">+ Add payment method</button><div class="settings-note">Payment methods are saved on this device.</div>`;
  }
  if (item.id === "promo-codes") {
    return `<p class="profile-lead">Add an offer to your account before checkout. Valid offers appear automatically in your order summary.</p><form class="settings-form narrow-form promo-code-form" data-form="promo-code"><label>Promo code<input name="code" placeholder="Enter a code" autocomplete="off" required></label><div class="form-footer"><span>Preview code: FAST10</span><button class="button-dark">Apply code <span>→</span></button></div></form>${state.promoCode ? `<div class="applied-promo"><span>✦</span><div><b>${escapeHtml(state.promoCode)} applied</b><small>10% off eligible item subtotal in this preview.</small></div><button data-action="remove-promo">Remove</button></div>` : ""}<div class="settings-note">This preview accepts FAST10 only. Promo availability and terms would be confirmed by the live service.</div>`;
  }
  if (item.id === "gift-cards") {
    return `<p class="profile-lead">A little treat for someone you love (or for your future self).</p><div class="gift-card-preview"><div><span>FAST DINE GIFT CARD</span><strong>Good things<br>are better shared.</strong><b>THE FAST DINE</b></div><div class="gift-card-side"><span>GIFT CARDS</span><h3>Send a little joy.</h3><p>Choose an amount, add a note, and make someone's day.</p><button class="button-dark" data-action="gift-card">Explore gift cards <span>→</span></button></div></div><div class="settings-note">Gift cards are a demo feature in this preview.</div>`;
  }
  if (item.id === "invoice-information") {
    return `<p class="profile-lead">Add your billing details for invoices on future orders.</p><form class="settings-form" data-form="invoice"><label>Business or full name<input name="invoiceName" placeholder="Name on your invoice" value="${escapeAttr(read("tamu-invoice", {}).name || "")}"></label><label>PIN / Tax number<input name="pin" placeholder="Optional tax PIN" value="${escapeAttr(read("tamu-invoice", {}).pin || "")}"></label><label>Billing address<textarea name="invoiceAddress" placeholder="Street, area, city">${escapeHtml(read("tamu-invoice", {}).address || "")}</textarea></label><div class="form-footer"><span>Only used for your invoices.</span><button class="button-dark">Save invoice details <span>→</span></button></div></form>`;
  }
  if (item.id === "privacy-settings") {
    return `<p class="profile-lead">You're in control of what we send and how your data is used.</p><div class="privacy-options"><label><span><b>Offers & good finds</b><small>Occasional updates about new spots and offers.</small></span><input type="checkbox" data-privacy="offers" ${state.privacy.offers ? "checked" : ""}><i></i></label><label><span><b>Help us make The Fast Dine better</b><small>Share anonymous usage data to improve your experience.</small></span><input type="checkbox" data-privacy="analytics" ${state.privacy.analytics ? "checked" : ""}><i></i></label></div><div class="settings-note">Your choices are saved on this device.</div>`;
  }
  if (item.id === "language") {
    return `<p class="profile-lead">Choose the language you'd like to use around The Fast Dine.</p><div class="language-options">${[["English", "English", "🇬🇧"], ["Kiswahili", "Kiswahili", "🇰🇪"]].map(([id, title, flag]) => `<button class="language-option ${read("tamu-language", "English") === id ? "selected" : ""}" data-language="${id}"><span>${flag}</span><b>${title}</b>${read("tamu-language", "English") === id ? `<strong>✓</strong>` : `<small>›</small>`}</button>`).join("")}</div>`;
  }
  return "";
}

export function checkoutPage() {
  const fee = state.cart.length ? (stores.find(store => store.id === state.cart[0].store)?.fee ?? 79) : 0;
  const serviceFee = state.cart.length ? 25 : 0;
  const discount = promoDiscount();
  const total = subtotal() + fee + serviceFee - discount;
  const activePayment = selectedPayment();
  const store = stores.find(item => item.id === state.cart[0]?.store);
  const itemCountLabel = `${cartQty()} ${cartQty() === 1 ? "item" : "items"}`;
  const steps = ["Cart", "Delivery", "Payment", "Review"];
  const progress = steps.map((title, index) => {
    const number = index + 1;
    const current = number === state.checkoutStep;
    return `<button type="button" class="checkout-progress-step ${number < state.checkoutStep ? "complete" : ""} ${current ? "current" : ""}" data-checkout-step="${number}" aria-current="${current ? "step" : "false"}" ${number > state.checkoutStep || state.submittingOrder ? "disabled" : ""}><span>${number < state.checkoutStep ? "✓" : number}</span><b>${title}</b><small>${["Your items", "Where to bring it", "How to pay", "Check your order"][index]}</small></button>`;
  }).join("");

  const cartItems = state.cart.map(item => {
    const product = productsByStore[item.store]?.find(p => p.id === item.id);
    return `<article class="checkout-item-row"><img src="${product?.image || ""}" alt="${escapeAttr(item.name)}"><div class="checkout-item-details"><b>${escapeHtml(item.name)}</b><small>${money(item.price)} each</small></div><div class="quantity-control"><button type="button" data-qty="${item.id}" data-delta="-1">−</button><span>${item.qty}</span><button type="button" data-qty="${item.id}" data-delta="1">＋</button></div><strong>${money(item.price * item.qty)}</strong></article>`;
  }).join("");

  const reviewItems = state.cart.map(item => `<div class="checkout-review-item"><span>${item.qty} × ${escapeHtml(item.name)}</span><b>${money(item.price * item.qty)}</b></div>`).join("");
  const deliverySummary = state.profile.address ? `<div class="checkout-summary-tile"><p><b>${escapeHtml(state.profile.name || "Recipient")}</b> &middot; ${escapeHtml(state.profile.phone || "No phone added")}</p><p>${escapeHtml(state.profile.address)}${state.profile.apartment ? `, ${escapeHtml(state.profile.apartment)}` : ""}</p>${state.profile.note ? `<small>${escapeHtml(state.profile.note)}</small>` : ""}<button type="button" data-action="address">Change delivery address</button></div>` : `<p class="checkout-warning">Add your delivery address to see where to bring your order.</p><button type="button" class="button-outline" data-action="address">Add delivery address</button>`;
  const paymentSummary = activePayment ? `<div class="checkout-summary-tile"><p><strong>${escapeHtml(paymentName(activePayment))}</strong></p><small>${activePayment.type === "card" ? "Saved card" : activePayment.type === "mpesa" ? "M-Pesa payment" : "Pay on delivery"}</small><button type="button" data-checkout-step="3">Change payment method</button></div>` : `<p class="checkout-warning">Choose a payment method before completing your order.</p><button type="button" class="button-outline" data-action="add-payment-method">Choose payment method</button>`;

  let content;
  if (state.checkoutStep === 1) {
    content = `<section class="checkout-stage-card"><div class="checkout-section-heading"><span class="step-icon">🛒</span><div><h2>Your basket</h2><p>${state.cart.length ? `Items from ${escapeHtml(store?.name || "your store")}` : "Your basket is empty."}</p></div></div><div class="checkout-cart-items">${state.cart.length ? cartItems : `<div class="checkout-empty-notice"><p>Add a few items before continuing.</p><button type="button" class="button-dark" data-route="${BASE}">Find places <span>→</span></button></div>`}</div></section>`;
  } else if (state.checkoutStep === 2) {
    content = `<section class="checkout-stage-card"><div class="checkout-section-heading"><span class="step-icon">⌖</span><div><h2>Delivery address</h2><p>Where should we bring your order?</p></div></div><form id="checkout-delivery-form" class="checkout-delivery-form" data-form="checkout-delivery"><label>Recipient name<input name="name" autocomplete="name" value="${escapeAttr(state.profile.name)}" required></label><label>Kenyan mobile number<input name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678" value="${escapeAttr(state.profile.phone)}" required pattern="^(?:\\+?254|0)?[17]\\d{8}$"></label><label class="checkout-address-field">Delivery address<div class="address-input-wrapper"><input name="address" value="${escapeAttr(state.profile.address)}" required><button type="button" data-action="address">Choose on map</button></div></label><label>Apartment / Suite <span class="optional">OPTIONAL</span><input name="apartment" placeholder="Floor, flat or office number" value="${escapeAttr(state.profile.apartment)}"></label><label>Delivery instructions <span class="optional">OPTIONAL</span><textarea name="note" rows="2" placeholder="Gate codes or landmark directions">${escapeHtml(state.profile.note)}</textarea></label></form></section>`;
  } else if (state.checkoutStep === 3) {
    content = `<section class="checkout-stage-card"><div class="checkout-section-heading"><span class="step-icon">💳</span><div><h2>Payment method</h2><p>How would you like to pay?</p></div></div><div class="checkout-payment-options">${state.payments.map(method => `<label class="checkout-payment-tile ${state.checkoutPaymentId === method.id ? "selected" : ""}"><input type="radio" name="checkoutPayment" value="${escapeAttr(method.id)}" ${state.checkoutPaymentId === method.id ? "checked" : ""}><div><b>${escapeHtml(paymentName(method))}</b><small>${method.type === "card" ? "Saved card" : method.type === "mpesa" ? "M-Pesa payment" : "Pay on delivery"}</small></div></label>`).join("")}</div><button type="button" class="checkout-add-payment" data-action="add-payment-method">+ Add a payment method</button><p class="checkout-safe-note">This preview does not process payments. Never enter your card security code, M-Pesa PIN or one-time password here.</p></section>`;
  } else {
    content = `<section class="checkout-stage-card checkout-review-stage"><div class="checkout-section-heading"><span class="step-icon">✓</span><div><h2>Review your order</h2><p>Check your delivery details and items before placing your order.</p></div></div><div class="checkout-review-group"><div><h3>Delivery</h3>${deliverySummary}</div><div><h3>Payment</h3>${paymentSummary}</div></div><div class="checkout-review-items"><div class="checkout-review-items-heading"><h3>Your items <small>${itemCountLabel}</small></h3><button type="button" data-checkout-step="1">Edit cart</button></div>${state.cart.length ? reviewItems : `<p class="checkout-empty-notice">Your basket is empty.</p>`}</div><label class="checkout-terms-confirm"><input id="checkout-terms" type="checkbox" ${state.checkoutTermsAccepted ? "checked" : ""}><span>I confirm my delivery details are correct and understand payment is not processed on this page.</span></label><p class="checkout-safe-note">Placing your order saves it to your Fast Dine account. Payment is not processed by this page.</p></section>`;
  }

  let action;
  if (state.checkoutStep === 1) action = `<button type="button" class="button-dark checkout-primary-action" data-action="checkout-continue" ${state.cart.length ? "" : "disabled"}>Continue to delivery <span>→</span></button>`;
  else if (state.checkoutStep === 2) action = `<button type="submit" form="checkout-delivery-form" class="button-dark checkout-primary-action">Continue to payment <span>→</span></button>`;
  else if (state.checkoutStep === 3) action = `<button type="button" class="button-dark checkout-primary-action" data-action="checkout-continue" ${activePayment ? "" : "disabled"}>Review order <span>→</span></button>`;
  else action = `<button type="button" class="button-dark checkout-primary-action" data-action="place-order" ${state.cart.length && activePayment && state.checkoutTermsAccepted && !state.submittingOrder ? "" : "disabled"}>${state.submittingOrder ? "Saving order..." : "Place order"} <span>→</span></button>`;

  const back = state.checkoutStep > 1 ? `<button type="button" class="checkout-back-action" data-action="checkout-back">← Back to ${steps[state.checkoutStep - 2]}</button>` : `<button type="button" class="checkout-back-action" data-route="${BASE}">← Continue shopping</button>`;
  return `<main class="checkout-page"><div class="breadcrumbs"><button data-route="${BASE}">Home</button><span>›</span><b>Checkout</b></div><div class="checkout-title"><div><p class="eyebrow">SECURE CHECKOUT</p><h1>${steps[state.checkoutStep - 1]}</h1><p>${["Your items", "Where to bring it", "How to pay", "Check your order"][state.checkoutStep - 1]} · ${itemCountLabel}</p></div><span class="checkout-lock">🔒 Your details stay protected</span></div><nav class="checkout-progress" aria-label="Checkout progress">${progress}</nav><div class="checkout-layout"><section class="checkout-main">${content}<div class="checkout-stage-footer">${back}</div></section><aside class="checkout-summary"><div class="summary-sticky"><p class="eyebrow">ORDER SUMMARY</p><h2>${itemCountLabel}</h2><div class="checkout-summary-items">${state.cart.map(item => `<div><span>${item.qty} × ${escapeHtml(item.name)}</span><b>${money(item.price * item.qty)}</b></div>`).join("") || "<p>Your items will appear here.</p>"}</div><div class="summary-line"><span>Subtotal</span><b>${money(subtotal())}</b></div><div class="summary-line"><span>Delivery <small>${store?.name ? `From ${escapeHtml(store.name)}` : "Local delivery"}</small></span><b>${money(fee)}</b></div><div class="summary-line"><span>Service fee</span><b>${money(serviceFee)}</b></div>${discount ? `<div class="summary-line promo-discount"><span>${escapeHtml(state.promoCode)} discount</span><b>−${money(discount)}</b></div>` : ""}<button type="button" class="promo-button" data-route="/en/profile/account/promo-codes">${state.promoCode ? `${escapeHtml(state.promoCode)} applied · Manage promo` : "+ Add a promo code"}</button><div class="summary-total"><span>Total to pay</span><strong>${money(total)}</strong></div>${action}<p class="checkout-terms">Your order is saved to your account. Payment is not processed by this checkout.</p></div><div class="checkout-help"><span>♡</span><div><b>Need a hand?</b><small>Questions about your order? <a href="mailto:hello@fastdine.example">Contact support</a></small></div></aside></div>${footer()}</main>`;
}
