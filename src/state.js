import { supabaseConfigured } from "./supabase.js";

export const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export const readSession = (key, fallback) => {
  try {
    return JSON.parse(sessionStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export function normalizePaymentMethods(value, profile) {
  const defaults = {
    "M-Pesa": { type: "mpesa", label: "M-Pesa", phone: profile.phone || "" },
    "Visa": { type: "card", brand: "Visa", last4: "" },
    "Cash on delivery": { type: "cash", label: "Cash on delivery" }
  };
  const methods = (Array.isArray(value) ? value : []).map((method, index) => {
    const source = typeof method === "string" ? { id: `legacy-${index}`, ...defaults[method] } : method;
    if (!source || !["mpesa", "card", "cash"].includes(source.type)) return null;
    return source.type === "card"
      ? { id: String(source.id || `card-${index}`), type: "card", brand: ["Visa", "Mastercard", "American Express"].includes(source.brand) ? source.brand : "Visa", last4: String(source.last4 || "").replace(/\D/g, "").slice(-4), isDefault: Boolean(source.isDefault) }
      : source.type === "mpesa"
        ? { id: String(source.id || `mpesa-${index}`), type: "mpesa", label: "M-Pesa", phone: String(source.phone || ""), isDefault: Boolean(source.isDefault) }
        : { id: String(source.id || `cash-${index}`), type: "cash", label: "Cash on delivery", isDefault: Boolean(source.isDefault) };
  }).filter(Boolean);
  if (!methods.length) methods.push({ id: "mpesa-default", type: "mpesa", label: "M-Pesa", phone: profile.phone || "", isDefault: true });
  const defaultIndex = Math.max(0, methods.findIndex(method => method.isDefault));
  return methods.map((method, index) => ({ ...method, isDefault: index === defaultIndex }));
}

const storedAuthFlow = readSession("fastdine-auth-flow", {});
const hasPendingAuthFlow = storedAuthFlow.pending === true && storedAuthFlow.method !== "phone";
const initialRouteParams = new URLSearchParams(window.location.search);
const storedProfile = read("tamu-profile", { name: "", email: "", phone: "", address: "Kilimani, Nairobi", apartment: "", note: "" });
const initialSavedAddresses = read("tamu-delivery-addresses", []);

export const state = {
  cart: read("tamu-cart", []),
  checkoutStep: 1,
  checkoutTermsAccepted: false,
  orders: supabaseConfigured ? [] : read("tamu-orders", []),
  submittingOrder: false,
  profile: storedProfile,
  payments: normalizePaymentMethods(read("tamu-payments", []), storedProfile),
  checkoutPaymentId: read("tamu-checkout-payment", ""),
  promoCode: read("tamu-promo-code", ""),
  privacy: read("tamu-privacy", { offers: true, analytics: false }),
  signedIn: supabaseConfigured ? false : read("fastdine-signed-in", false),
  authBootstrapped: !supabaseConfigured,
  supabaseBootstrapped: !supabaseConfigured,
  authMode: initialRouteParams.get("mode") || (hasPendingAuthFlow ? storedAuthFlow.mode : "login"),
  authMethod: "email",
  authIdentity: hasPendingAuthFlow ? storedAuthFlow.identity || "" : "",
  authDraft: hasPendingAuthFlow ? storedAuthFlow.draft || {} : {},
  authError: "",
  authResendAvailable: false,
  recoveryEmailSent: false,
  passwordRecoveryReady: false,
  search: "",
  categoryFilter: "all",
  cartOpen: false,
  storeOpen: null,
  modal: null,
  savedAddresses: Array.isArray(initialSavedAddresses) ? initialSavedAddresses : [],
  selectedAddressId: "",
  deliveryLocation: Number.isFinite(storedProfile.latitude) && Number.isFinite(storedProfile.longitude)
    ? { latitude: storedProfile.latitude, longitude: storedProfile.longitude }
    : null,
  locationError: "",
  locationStatus: "",
  detectingLocation: false,
  loadingAddresses: false,
  supportTopic: null,
  supportRequestTopic: "Something else",
  supportRequests: read("tamu-support-requests", []),
  supportConversation: [],
  supportError: ""
};

if (!state.savedAddresses.length && storedProfile.address) {
  state.savedAddresses.push({
    id: `local-${crypto.randomUUID()}`,
    label: "Home",
    name: storedProfile.name || "",
    phone: storedProfile.phone || "",
    address: storedProfile.address,
    apartment: storedProfile.apartment || "",
    note: storedProfile.note || "",
    latitude: storedProfile.latitude ?? null,
    longitude: storedProfile.longitude ?? null,
    isDefault: true
  });
}

export const money = amount => `KSh ${Number(amount).toLocaleString("en-KE")}`;

export const paymentIcon = method => method.type === "mpesa" ? "M" : method.type === "card" ? method.brand === "American Express" ? "AMEX" : method.brand === "Mastercard" ? "MC" : "VISA" : "💵";

export const paymentName = method => method.type === "card" ? `${method.brand}${method.last4 ? ` ···· ${method.last4}` : ""}` : method.type === "mpesa" ? "M-Pesa" : "Cash on delivery";

export const paymentDescription = method => method.type === "card" ? method.last4 ? "Saved demo card · secure card storage is not connected" : "Demo card option · no card details saved" : method.type === "mpesa" ? method.phone ? `Mobile money · ending ${method.phone.replace(/\D/g, "").slice(-3)}` : "Mobile money · add a number when setting it up" : "Pay in KSh when your order arrives, where available";

export const selectedPayment = () => state.payments.find(method => method.id === state.checkoutPaymentId) || state.payments.find(method => method.isDefault) || state.payments[0] || null;

export const cartQty = () => state.cart.reduce((sum, item) => sum + item.qty, 0);

export const subtotal = () => state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);

export const promoDiscount = () => state.promoCode === "FAST10" ? Math.round(subtotal() * 0.1) : 0;

export const currentPath = () => window.location.pathname;

export const save = () => {
  localStorage.setItem("tamu-cart", JSON.stringify(state.cart));
  if (!supabaseConfigured) localStorage.setItem("tamu-orders", JSON.stringify(state.orders));
  localStorage.setItem("tamu-profile", JSON.stringify(state.profile));
  localStorage.setItem("tamu-payments", JSON.stringify(state.payments));
  localStorage.setItem("tamu-checkout-payment", JSON.stringify(state.checkoutPaymentId));
  localStorage.setItem("tamu-promo-code", JSON.stringify(state.promoCode));
  localStorage.setItem("tamu-privacy", JSON.stringify(state.privacy));
  localStorage.setItem("fastdine-signed-in", JSON.stringify(state.signedIn));
  localStorage.setItem("tamu-support-requests", JSON.stringify(state.supportRequests));
  if (!supabaseConfigured || !state.signedIn) {
    localStorage.setItem("tamu-delivery-addresses", JSON.stringify(state.savedAddresses));
  }
};

export const saveAuthFlow = () => sessionStorage.setItem("fastdine-auth-flow", JSON.stringify({ pending: true, mode: state.authMode, method: "email", identity: state.authIdentity, draft: state.authDraft }));

export const clearAuthFlow = () => sessionStorage.removeItem("fastdine-auth-flow");
