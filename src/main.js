import { BASE, currentPath, escapeHtml, escapeAttr, loginReturnPath, normalizeKenyanPhone } from "./utils.js";
import { toast } from "./toast.js";
import { categories, stores, productsByStore, loadSupabaseCatalog } from "./catalog.js";
import { state, save, saveAuthFlow, clearAuthFlow } from "./state.js";
import { supabase, supabaseConfigured } from "./supabase.js";
import { readableAuthError, resendSignupConfirmation, writeCustomerProfile, initializeSupabaseAuth, signOutCustomer } from "./auth.js";
import { openDeliveryLocation, refreshSavedAddresses, saveDeliveryAddress, deleteSavedAddress, chooseSavedAddress } from "./addresses.js";
import { detectDeliveryLocation, renderLocationMessage } from "./map.js";
import {
  SUPPORT_EMAIL,
  addProduct,
  updateQty,
  advanceCheckout,
  goToCheckoutStep,
  submitOrder,
  addPaymentMethod,
  setDefaultPayment,
  removePaymentMethod,
  askSupportAssistant,
  supportEmailHref
} from "./order.js";
import { header, mobileDock, dealProductCards, storeCard } from "./components.js";
import {
  homePage,
  englishLandingPage,
  categoryPage,
  storeDetailPage,
  loginPage,
  authPageUrl,
  profilePage,
  checkoutPage
} from "./pages.js";
import { renderOverlay } from "./modals.js";

export function navigate(path) {
  state.modal = null;
  state.storeOpen = null;
  state.cartOpen = false;
  if (path.endsWith("/order-summary") && currentPath() !== path) {
    state.checkoutStep = 1;
    state.checkoutTermsAccepted = false;
  }
  if (currentPath() !== path) history.pushState({}, "", path);
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

export function render() {
  const path = currentPath();
  const app = document.querySelector("#app");
  if (!app) return;

  const category = categories.find(item => item.path === path);
  const routedStore = stores.find(store => store.slug && path === `${BASE}/stores/${store.slug}`);

  if (supabaseConfigured && path.startsWith("/en/profile")) {
    if (!state.authBootstrapped) {
      app.innerHTML = `<main class="auth-page"><section class="auth-card"><img class="auth-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine"><p class="eyebrow">THE FAST DINE ACCOUNT</p><h1>Checking your session…</h1><p class="auth-intro">One moment while we securely load your account.</p></section></main>`;
      return;
    }
    if (!state.signedIn) {
      const destination = `${path}${window.location.search}`;
      history.replaceState({}, "", `/en/login?returnPath=${encodeURIComponent(destination)}`);
      return render();
    }
  }

  if (path === "/en/auth/callback") {
    app.innerHTML = `<main class="auth-page"><section class="auth-card"><img class="auth-logo" src="/assets/the-fast-dine-logo.png" alt="The Fast Dine"><p class="eyebrow">SECURE SIGN-IN</p><h1>Finishing sign-in…</h1><p class="auth-intro">We're checking your Supabase verification link.</p></section></main>`;
  } else if (path === "/en") {
    app.innerHTML = `${header()}${englishLandingPage()}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  } else if (path.startsWith("/en/login")) {
    app.innerHTML = `${header()}${loginPage()}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  } else if (path.endsWith("/order-summary")) {
    app.innerHTML = `${header()}${checkoutPage()}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  } else if (path.startsWith("/en/profile")) {
    app.innerHTML = `${header()}${profilePage(path)}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  } else if (routedStore) {
    app.innerHTML = `${header()}${storeDetailPage(routedStore)}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  } else if (category && category.id !== "deals") {
    app.innerHTML = `${header()}${categoryPage(category)}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  } else if (path.includes("/stores/glovo-bargains-nbo")) {
    app.innerHTML = `${header()}${storeDetailPage(stores.find(item => item.id === "tamu-deals"))}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  } else if (category?.id === "deals") {
    app.innerHTML = `${header()}${categoryPage(category)}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  } else {
    app.innerHTML = `${header()}${homePage()}<button class="help-fab" data-action="help"><span>☏</span> Help</button>${mobileDock()}`;
  }

  renderOverlay();
  document.title = routedStore
    ? `${routedStore.name} menu — The Fast Dine`
    : category
      ? `${category.title} delivery in Nairobi — The Fast Dine`
      : path === "/en"
        ? "Food delivery and more — The Fast Dine"
        : path.startsWith("/en/login") || path === "/en/auth/callback"
          ? "Account access — The Fast Dine"
          : path.startsWith("/en/profile")
            ? "Your account — The Fast Dine"
            : path.endsWith("/order-summary")
              ? "Your order — The Fast Dine"
              : "The Fast Dine — Good things, on the way";
}

// Global click event delegation
document.addEventListener("click", event => {
  const route = event.target.closest("[data-route]");
  if (route) {
    event.preventDefault();
    navigate(route.dataset.route);
    return;
  }
  const checkoutStep = event.target.closest("[data-checkout-step]");
  if (checkoutStep) {
    goToCheckoutStep(Number(checkoutStep.dataset.checkoutStep), render);
    return;
  }
  const placeholderSupportLink = event.target.closest('a[href="mailto:hello@fastdine.example"]');
  if (placeholderSupportLink) {
    event.preventDefault();
    state.modal = "support";
    state.supportRequestTopic = "Something else";
    state.supportTopic = "request";
    renderOverlay();
    return;
  }
  const category = event.target.closest("[data-category]");
  if (category) {
    const target = categories.find(item => item.id === category.dataset.category);
    if (target) navigate(target.path);
    return;
  }
  const addPayment = event.target.closest("[data-payment-add]");
  if (addPayment) {
    const type = addPayment.dataset.paymentAdd;
    if (type === "mpesa") {
      state.modal = "add-payment-mpesa";
      renderOverlay();
    } else if (type === "card") {
      state.modal = "add-payment-card";
      renderOverlay();
    } else if (type === "cash") {
      addPaymentMethod({ id: "cash-delivery", type: "cash", label: "Cash on delivery" }, render);
    }
    return;
  }
  const setDefault = event.target.closest("[data-default-payment]");
  if (setDefault) {
    setDefaultPayment(setDefault.dataset.defaultPayment, render);
    return;
  }
  const removePayment = event.target.closest("[data-remove-payment]");
  if (removePayment) {
    removePaymentMethod(removePayment.dataset.removePayment, render);
    return;
  }
  const store = event.target.closest(".store-card");
  if (store && !event.target.closest("[data-favorite]")) {
    const selectedStore = stores.find(item => item.id === store.dataset.store);
    if (selectedStore?.slug) navigate(`${BASE}/stores/${selectedStore.slug}`);
    else if (store.dataset.store === "tamu-deals") navigate(`${BASE}/stores/glovo-bargains-nbo`);
    else {
      state.storeOpen = store.dataset.store;
      renderOverlay();
    }
    return;
  }
  const add = event.target.closest("[data-add]");
  if (add) {
    addProduct(add.dataset.add, add.dataset.store, render);
    return;
  }
  const qty = event.target.closest("[data-qty]");
  if (qty) {
    updateQty(qty.dataset.qty, Number(qty.dataset.delta), render);
    return;
  }
  const close = event.target.closest("[data-close]");
  if (close && (close === event.target || close.tagName === "BUTTON")) {
    if (close.dataset.close === "cart") state.cartOpen = false;
    else if (close.dataset.close === "store") state.storeOpen = null;
    else state.modal = null;
    renderOverlay();
    return;
  }
  const useAddress = event.target.closest("[data-use-address]");
  if (useAddress) {
    chooseSavedAddress(useAddress.dataset.useAddress, render);
    return;
  }
  const deleteAddress = event.target.closest("[data-delete-address]");
  if (deleteAddress) {
    void deleteSavedAddress(deleteAddress.dataset.deleteAddress, renderOverlay);
    return;
  }
  const supportTopic = event.target.closest("[data-support-topic]");
  if (supportTopic) {
    state.supportTopic = supportTopic.dataset.supportTopic || null;
    renderOverlay();
    return;
  }
  const supportRequestTopic = event.target.closest("[data-support-request-topic]");
  if (supportRequestTopic) {
    state.supportRequestTopic = supportRequestTopic.dataset.supportRequestTopic;
    state.supportTopic = "request";
    state.supportError = "";
    renderOverlay();
    return;
  }
  const supportPrompt = event.target.closest("[data-support-prompt]");
  if (supportPrompt) {
    askSupportAssistant(supportPrompt.dataset.supportPrompt, renderOverlay);
    return;
  }
  const authMode = event.target.closest("[data-auth-mode]");
  if (authMode) {
    state.authMode = authMode.dataset.authMode;
    state.authError = "";
    state.authResendAvailable = false;
    saveAuthFlow();
    navigate(authPageUrl(state.authMode === "signup" ? "signup" : "login"));
    return;
  }
  const authStep = event.target.closest("[data-auth-step]");
  if (authStep) {
    const nextPage = authStep.dataset.authStep;
    if (nextPage === "login" || nextPage === "signup") state.authMode = nextPage;
    state.authError = "";
    saveAuthFlow();
    navigate(authPageUrl(nextPage));
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "cart") {
    state.cartOpen = !state.cartOpen;
    state.storeOpen = null;
    state.modal = null;
    renderOverlay();
  } else if (action === "address") {
    openDeliveryLocation(renderOverlay, renderLocationMessage);
  } else if (action === "checkout-address") {
    const form = document.querySelector("#checkout-delivery-form");
    if (form) {
      const data = new FormData(form);
      state.profile.name = String(data.get("name") || "").trim();
      state.profile.email = String(data.get("email") || "").trim();
      state.profile.phone = String(data.get("phone") || "").trim();
      state.profile.address = String(data.get("address") || "").trim();
      state.profile.apartment = String(data.get("apartment") || "").trim();
      state.profile.note = String(data.get("note") || "").trim();
      save();
    }
    openDeliveryLocation(renderOverlay, renderLocationMessage);
  } else if (action === "checkout-continue") {
    advanceCheckout(render);
  } else if (action === "checkout-back") {
    goToCheckoutStep(state.checkoutStep - 1, render);
  } else if (action === "login") {
    navigate("/en/login?returnPath=%2Fen%2Fke%2Fnairobi");
  } else if (action === "search") {
    state.modal = "search";
    renderOverlay();
    setTimeout(() => document.querySelector("#modal-search")?.focus(), 20);
  } else if (action === "help") {
    state.supportTopic = null;
    state.supportError = "";
    state.modal = "support";
    renderOverlay();
  } else if (action === "detect-location") {
    detectDeliveryLocation();
  } else if (action === "auth-resend") {
    void resendSignupConfirmation(render, authPageUrl, navigate);
  } else if (action === "recovery-resend") {
    state.recoveryEmailSent = false;
    state.authError = "";
    render();
  } else if (action === "auth-terms") {
    state.modal = "auth-terms";
    renderOverlay();
  } else if (action === "contact-support") {
    state.supportTopic = "request";
    state.supportRequestTopic = "Something else";
    state.supportError = "";
    state.modal = "support";
    renderOverlay();
  } else if (action === "set-address") {
    const value = document.querySelector("#hero-address")?.value.trim();
    if (value) {
      state.profile.address = value;
      save();
      render();
      toast("Delivery spot saved");
    } else {
      openDeliveryLocation(renderOverlay, renderLocationMessage);
    }
  } else if (action === "location") {
    detectDeliveryLocation();
  } else if (action === "instructions") {
    state.modal = "instructions";
    renderOverlay();
  } else if (action === "promo") {
    navigate("/en/profile/account/promo-codes");
  } else if (action === "add-payment-method") {
    state.modal = "payment-method-picker";
    renderOverlay();
  } else if (action === "remove-promo") {
    state.promoCode = "";
    save();
    render();
    toast("Promo removed from this preview order.");
  } else if (action === "sort") {
    state.modal = "sort";
    renderOverlay();
  } else if (action === "place-order") {
    submitOrder({ render, renderOverlay, navigate });
  } else if (action === "view-orders") {
    navigate("/en/profile/past-orders");
  } else if (action === "logout") {
    void signOutCustomer(navigate, render);
  } else if (action === "gift-card") {
    toast("Gift cards are coming soon.");
  } else if (action === "clear-search") {
    state.search = "";
    state.categoryFilter = "all";
    render();
  } else if (action === "apply-filter") {
    const value = document.querySelector("input[name=sort]:checked")?.value;
    state.modal = null;
    render();
    if (value === "Top rated") {
      document.querySelectorAll(".store-grid").forEach(grid =>
        [...grid.children]
          .sort((a, b) => Number(b.querySelector(".rating")?.textContent?.match(/[\d.]+/)?.[0] || 0) - Number(a.querySelector(".rating")?.textContent?.match(/[\d.]+/)?.[0] || 0))
          .forEach(node => grid.append(node))
      );
    }
  } else if (action === "see-all") {
    state.categoryFilter = "all";
    const sectionEl = document.querySelector(".store-grid");
    sectionEl?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const filter = event.target.closest("[data-filter-chip]");
  if (filter) {
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("selected"));
    filter.classList.add("selected");
    const needle = filter.dataset.filterChip.toLowerCase();
    const currentStore = stores.find(store => store.slug && currentPath() === `${BASE}/stores/${store.slug}`);
    if (currentStore || currentPath().includes("/stores/glovo-bargains-nbo")) {
      const isDealsPage = currentPath().includes("/stores/glovo-bargains-nbo");
      const activeStore = currentStore || stores.find(s => s.id === "tamu-deals");
      const allProducts = productsByStore[activeStore.id] || [];
      const filtered = needle === "popular" || needle === "all products" || needle === "all restaurants" || needle.startsWith("today")
        ? allProducts
        : allProducts.filter(product => `${product.name} ${product.description} ${product.tag || ""}`.toLowerCase().includes(needle.split(" ")[0]));
      const grid = document.querySelector("#deal-products");
      if (grid) grid.innerHTML = filtered.length ? dealProductCards(filtered, activeStore.id) : `<div class="filter-empty">No exact matches in this collection yet.</div>`;
      const heading = document.querySelector(".store-detail-layout .listing-header h2");
      if (heading) heading.innerHTML = `${escapeHtml(isDealsPage ? "Today's offers" : filter.dataset.filterChip === "Popular" ? "Menu" : filter.dataset.filterChip)} <span class="result-count">${filtered.length}</span>`;
    } else {
      const categoryItem = categories.find(item => item.path === currentPath());
      const currentStores = stores.filter(item => item.category === categoryItem?.id);
      const terms = needle.split(/\s+/).filter(term => term !== "&");
      const filtered = needle === "popular" || needle === "all restaurants"
        ? currentStores
        : currentStores.filter(item => terms.some(term => `${item.name} ${item.cuisine}`.toLowerCase().includes(term)));
      const grid = document.querySelector("#listing-stores");
      if (grid) grid.innerHTML = filtered.length ? filtered.map(storeCard).join("") : `<div class="filter-empty">No exact matches yet. Try another collection.</div>`;
      const count = document.querySelector(".listing-header .result-count");
      if (count) count.textContent = String(filtered.length);
    }
  }

  const language = event.target.closest("[data-language]");
  if (language) {
    localStorage.setItem("tamu-language", language.dataset.language);
    render();
    toast(`${language.dataset.language} selected`);
  }
  const searchTerm = event.target.closest("[data-search-term]");
  if (searchTerm) {
    state.search = searchTerm.dataset.searchTerm;
    state.modal = null;
    navigate(BASE);
  }
  const reorder = event.target.closest("[data-reorder]");
  if (reorder) {
    const order = state.orders.find(item => item.id === reorder.dataset.reorder);
    if (order) {
      state.cart = order.items.map(item => ({ ...item }));
      save();
      state.cartOpen = true;
      render();
    }
  }
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    favorite.classList.toggle("is-favorite");
    favorite.textContent = favorite.classList.contains("is-favorite") ? "♥" : "♡";
    toast(favorite.classList.contains("is-favorite") ? "Saved to your favourites" : "Removed from favourites");
  }
});

// Input handling
document.addEventListener("input", event => {
  if (event.target.matches("#store-search")) {
    const query = event.target.value.toLowerCase().trim();
    const currentStore = stores.find(store => store.slug && currentPath() === `${BASE}/stores/${store.slug}`);
    const storeId = currentStore?.id || "tamu-deals";
    const filtered = (productsByStore[storeId] || []).filter(product =>
      `${product.name} ${product.description} ${product.tag || ""}`.toLowerCase().includes(query)
    );
    const grid = document.querySelector("#deal-products");
    if (grid) grid.innerHTML = filtered.length ? dealProductCards(filtered, storeId) : `<div class="filter-empty">No finds match that search yet.</div>`;
    const heading = document.querySelector(".store-detail-layout .listing-header h2 .result-count");
    if (heading) heading.textContent = filtered.length;
    return;
  }

  if (event.target.matches("#global-search, #modal-search")) {
    state.search = event.target.value;
    if (event.target.id === "modal-search") {
      document.querySelectorAll("[data-search-term]").forEach(el => {
        el.hidden = !el.textContent.toLowerCase().includes(state.search.toLowerCase());
      });
      return;
    }
    const path = currentPath();
    if (path === BASE || path === "/" || categories.some(item => item.path === path)) render();
    setTimeout(() => {
      const input = document.querySelector("#global-search");
      if (input) {
        input.focus();
        input.setSelectionRange(state.search.length, state.search.length);
      }
    }, 0);
  }
});

// Change handling
document.addEventListener("change", event => {
  if (event.target.matches('input[name="checkoutPayment"]')) {
    state.checkoutPaymentId = event.target.value;
    save();
    document.querySelectorAll(".checkout-payment-tile").forEach(option => {
      option.classList.toggle("selected", option.contains(event.target));
    });
  }
  if (event.target.matches("#checkout-terms")) {
    state.checkoutTermsAccepted = event.target.checked;
    render();
  }
  if (event.target.matches("[data-privacy]")) {
    state.privacy[event.target.dataset.privacy] = event.target.checked;
    save();
    toast("Privacy preference saved");
  }
  if (event.target.id === "sort-select") {
    const grid = document.querySelector("#listing-stores");
    if (!grid) return;
    const items = [...grid.children];
    if (event.target.value === "Top rated") {
      items.sort((a, b) => Number(b.querySelector(".rating")?.textContent.match(/[\d.]+/)?.[0] || 0) - Number(a.querySelector(".rating")?.textContent.match(/[\d.]+/)?.[0] || 0));
    }
    if (event.target.value === "Fastest delivery") {
      items.sort((a, b) => Number(a.textContent.match(/\d+/)?.[0] || 0) - Number(b.textContent.match(/\d+/)?.[0] || 0));
    }
    items.forEach(item => grid.append(item));
  }
});

// Form submit handling
document.addEventListener("submit", async event => {
  const form = event.target;
  const kind = form.dataset.form;
  if (!kind) return;
  event.preventDefault();
  const data = new FormData(form);

  if (kind === "checkout-delivery") {
    const profile = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      address: String(data.get("address") || "").trim(),
      apartment: String(data.get("apartment") || "").trim(),
      note: String(data.get("note") || "").trim()
    };
    if (!profile.name || !profile.phone || !profile.address) {
      toast("Enter your name, phone number and delivery address to continue.");
      return;
    }
    Object.assign(state.profile, profile);
    state.checkoutStep = 3;
    save();
    render();
  } else if (kind === "support-chat") {
    const question = String(data.get("question") || "").trim();
    if (question) askSupportAssistant(question, renderOverlay);
  } else if (kind === "support-request") {
    const request = {
      requestId: `FD-${Date.now().toString(36).toUpperCase()}`,
      topic: String(data.get("topic") || "").trim(),
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      orderNumber: String(data.get("orderNumber") || "").trim(),
      message: String(data.get("message") || "").trim(),
      createdAt: new Date().toISOString()
    };
    if (!request.topic || !request.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email) || !request.message) {
      state.supportError = "Enter your name, a valid reply email, and a message.";
      renderOverlay();
      return;
    }
    state.supportRequests.unshift(request);
    state.supportTopic = "requests";
    state.supportError = "";
    save();
    renderOverlay();
    if (supabase) {
      void (async () => {
        try {
          const user = (await supabase.auth.getUser())?.data?.user;
          await supabase.from("support_tickets").insert({
            ticket_number: request.requestId,
            user_id: user?.id || null,
            topic: request.topic,
            customer_name: request.name,
            email: request.email,
            order_number: request.orderNumber || null,
            message: request.message
          });
        } catch (err) {
          console.warn("Support ticket sync note:", err);
        }
      })();
    }
    toast(SUPPORT_EMAIL
      ? "Request saved. Review and send the email draft to contact support."
      : "Request saved on this device; you can review it anytime.");
    if (SUPPORT_EMAIL) window.location.href = supportEmailHref(request);
  } else if (kind === "profile") {
    state.profile.name = data.get("name").trim();
    state.profile.email = data.get("email").trim();
    state.profile.phone = data.get("phone").trim();
    state.profile.address = data.get("address").trim();
    state.profile.apartment = (data.get("apartment") || "").trim();
    state.profile.note = (data.get("note") || "").trim();
    save();
    render();
    toast("Your details are saved");
  } else if (kind === "phone-number" || kind === "phone") {
    const phone = normalizeKenyanPhone(data.get("phone"));
    if (!phone) {
      toast("Enter a valid Kenyan mobile number (e.g. 0712 345 678 or +254 712 345 678).", "error");
      return;
    }
    state.profile.phone = phone;
    save();
    render();
    toast("Phone number updated.", "success");
  } else if (kind === "change-password" || kind === "password") {
    const newPassword = data.get("newPassword") || data.get("password");
    const confirmPassword = data.get("confirmPassword") || data.get("confirm");
    if (newPassword !== confirmPassword) {
      toast("Those new passwords don't match yet.");
      return;
    }
    if (!supabase) {
      toast("Supabase is not configured. Check the VITE_SUPABASE settings.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast(readableAuthError(error));
      return;
    }
    form.reset();
    toast("Your password has been updated.");
  } else if (kind === "recovery") {
    state.authIdentity = data.get("email").trim().toLowerCase();
    state.authError = "";
    if (!supabase) {
      state.authError = "Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.";
      render();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.authIdentity)) {
      state.authError = "Enter a valid email address.";
      render();
      return;
    }
    try {
      const redirectTo = new URL(authPageUrl("recovery"), window.location.origin);
      redirectTo.searchParams.set("mode", "reset");
      const { error } = await supabase.auth.resetPasswordForEmail(state.authIdentity, { redirectTo: redirectTo.toString() });
      if (error) throw error;
      state.recoveryEmailSent = true;
      render();
    } catch (error) {
      state.authError = readableAuthError(error);
      render();
    }
  } else if (kind === "password-reset") {
    const password = data.get("password");
    if (password !== data.get("confirm")) {
      state.authError = "Those new passwords don't match yet.";
      render();
      return;
    }
    if (!supabase) {
      state.authError = "Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.";
      render();
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      state.passwordRecoveryReady = false;
      state.recoveryEmailSent = false;
      state.authError = "";
      navigate(loginReturnPath());
      toast("Your password has been reset. You're signed in.");
    } catch (error) {
      state.authError = readableAuthError(error);
      render();
    }
  } else if (kind === "address") {
    const address = {
      label: String(data.get("label") || "").trim() || "Home",
      name: state.profile.name || "",
      phone: state.profile.phone || "",
      address: String(data.get("address") || "").trim(),
      apartment: String(data.get("apartment") || "").trim(),
      note: state.profile.note || "",
      latitude: state.deliveryLocation?.latitude ?? null,
      longitude: state.deliveryLocation?.longitude ?? null
    };
    if (!address.address) {
      state.locationError = "Enter a delivery address before saving.";
      renderLocationMessage();
      return;
    }
    try {
      state.profile.address = address.address;
      state.profile.apartment = address.apartment;
      const saveButton = form.querySelector('button[type="submit"], button:not([type])');
      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Saving address…";
      }
      await saveDeliveryAddress(address);
      if (address.latitude !== null && address.longitude !== null) {
        state.profile.latitude = address.latitude;
        state.profile.longitude = address.longitude;
      } else {
        delete state.profile.latitude;
        delete state.profile.longitude;
      }
      state.modal = null;
      state.locationError = "";
      save();
      render();
      toast("Delivery address saved for checkout.");
    } catch (error) {
      console.error("Could not save the delivery address:", error);
      state.locationError = error.message || "We couldn't save that address. Please try again.";
      renderOverlay();
    }
  } else if (kind === "instructions") {
    state.profile.note = data.get("note").trim();
    state.modal = null;
    save();
    render();
    toast("Delivery note saved");
  } else if (kind === "login") {
    state.authIdentity = data.get("identity").trim().toLowerCase();
    state.authMethod = "email";
    state.authMode = "login";
    state.authError = "";
    state.authResendAvailable = false;
    try {
      if (!supabase) throw new Error("Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.");
      const identity = state.authIdentity.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity)) throw new Error("Enter a valid email address.");
      const credentials = { email: identity, password: data.get("password") };
      const { data: authData, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      if (!authData.user) throw new Error("Supabase did not return a signed-in customer.");
      const returnPath = loginReturnPath();
      await writeCustomerProfile(authData.user);
      clearAuthFlow();
      navigate(returnPath);
      toast("You're signed in to The Fast Dine.");
    } catch (error) {
      state.authError = readableAuthError(error);
      state.authResendAvailable = error?.code === "email_not_confirmed" || /email not confirmed|email_not_confirmed/i.test(String(error?.message || ""));
      clearAuthFlow();
      render();
    }
  } else if (kind === "signup") {
    state.authDraft = { name: data.get("name").trim(), email: data.get("email").trim().toLowerCase() };
    state.authMethod = "email";
    state.authIdentity = state.authDraft.email;
    state.authMode = "signup";
    state.authError = "";
    state.authResendAvailable = false;
    try {
      if (!supabase) throw new Error("Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.");
      if (data.get("password") !== data.get("confirm")) throw new Error("Those passwords don't match.");
      const password = data.get("password");
      if (typeof password !== "string" || password.length < 8) throw new Error("Use a password with at least 8 characters.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.authIdentity)) throw new Error("Enter a valid email address.");
      const { data: authData, error } = await supabase.auth.signUp({
        email: state.authIdentity,
        password,
        options: {
          data: { full_name: state.authDraft.name }
        }
      });
      if (error) throw error;
      if (authData.user?.identities?.length === 0) {
        state.authMode = "login";
        state.authError = "If you already have an account with this email, log in instead. If it still needs verification, you can request a new code there.";
        navigate(authPageUrl("login"));
        return;
      }
      if (authData.session && authData.user) {
        const returnPath = loginReturnPath();
        await writeCustomerProfile(authData.user);
        clearAuthFlow();
        navigate(returnPath);
        toast("Your account is ready.");
      } else {
        saveAuthFlow();
        navigate(authPageUrl("verify"));
        toast("Check your email for a six-digit verification code.");
      }
    } catch (error) {
      state.authError = readableAuthError(error);
      state.authResendAvailable = false;
      clearAuthFlow();
      render();
    }
  } else if (kind === "verify") {
    if (state.authMode !== "signup") {
      state.authError = "Email verification codes are only for confirming new accounts. Log in with your email and password.";
      render();
      return;
    }
    if (!supabase) {
      state.authError = "Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.";
      render();
      return;
    }
    const token = data.get("code").trim();
    if (!/^\d{6}$/.test(token)) {
      state.authError = "Enter the six-digit code from your email.";
      render();
      return;
    }
    const identity = state.authIdentity;
    const returnPath = loginReturnPath();
    state.authError = "";
    try {
      const credentials = { email: identity, token, type: "signup" };
      const { data: authData, error } = await supabase.auth.verifyOtp(credentials);
      if (error) throw error;
      if (!authData.user) throw new Error("Supabase did not return a signed-in customer.");
      await writeCustomerProfile(authData.user);
      clearAuthFlow();
      state.authError = "";
      navigate(returnPath);
      toast("You're signed in to The Fast Dine.");
    } catch (error) {
      state.authError = readableAuthError(error);
      state.authResendAvailable = false;
      render();
    }
  } else if (kind === "english-address") {
    state.profile.address = data.get("address").trim();
    save();
    navigate(BASE);
  } else if (kind === "payment-card") {
    addPaymentMethod({ id: `card-${Date.now()}`, type: "card", brand: data.get("brand"), last4: data.get("last4").trim() }, render);
  } else if (kind === "payment-mpesa") {
    const phone = normalizeKenyanPhone(data.get("phone"));
    if (!phone) {
      toast("Enter a valid Kenyan mobile number (e.g. 0712 345 678).", "error");
      return;
    }
    addPaymentMethod({ id: `mpesa-${Date.now()}`, type: "mpesa", label: "M-Pesa", phone }, render);
  } else if (kind === "promo-code") {
    const code = data.get("code").trim().toUpperCase();
    if (code !== "FAST10") {
      toast("That code isn't available in this preview.");
      return;
    }
    state.promoCode = code;
    save();
    render();
    toast("FAST10 applied to your preview checkout.");
  } else if (kind === "invoice") {
    localStorage.setItem("tamu-invoice", JSON.stringify({
      name: data.get("invoiceName"),
      pin: data.get("pin"),
      address: data.get("invoiceAddress")
    }));
    render();
    toast("Invoice information saved");
  }
});

// History popstate navigation
window.addEventListener("popstate", () => {
  state.modal = null;
  state.storeOpen = null;
  state.cartOpen = false;
  render();
});

// Keyboard shortcuts
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    state.modal = "search";
    renderOverlay();
    setTimeout(() => document.querySelector("#modal-search")?.focus(), 20);
  }
  if ((event.key === "Enter" || event.key === " ") && event.target.closest(".store-card")) {
    event.preventDefault();
    const storeId = event.target.closest(".store-card").dataset.store;
    const store = stores.find(item => item.id === storeId);
    if (store?.slug) navigate(`${BASE}/stores/${store.slug}`);
    else {
      state.storeOpen = storeId;
      renderOverlay();
    }
  }
  if (event.key === "Escape") {
    state.modal = null;
    state.storeOpen = null;
    state.cartOpen = false;
    renderOverlay();
  }
});

// Initial boot
if (currentPath() === "/") {
  history.replaceState({}, "", BASE);
}

initializeSupabaseAuth({
  render,
  authPageUrl,
  refreshSavedAddresses: () => refreshSavedAddresses(renderOverlay),
  navigate
});

// Dynamic Supabase Catalog fetching (with graceful offline fallback)
loadSupabaseCatalog(render);

// Initial render
render();
