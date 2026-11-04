import { supabase } from "./supabase.js";
import { state, save, read, clearAuthFlow, saveAuthFlow, currentPath } from "./state.js";
import { toast } from "./toast.js";
import { BASE } from "./utils.js";

export function readableAuthError(error) {
  const message = String(error?.message || "");
  const lower = message.toLowerCase();
  const code = String(error?.code || "").toLowerCase();
  if (code === "email_not_confirmed" || /email not confirmed|email_not_confirmed/.test(lower)) return "Your email isn't confirmed yet. Request a new verification code below.";
  if (code === "invalid_credentials" || /invalid login credentials|invalid credentials/.test(lower)) return "We couldn't sign you in with that email and password. Check both details, or create an account if you haven't signed up yet.";
  if (code === "user_already_exists" || /user already registered|user already exists/.test(lower)) return "If you already have an account with this email, log in instead. Unconfirmed accounts can request a new verification code.";
  if (/email address not authorized|email.*not authorized/.test(lower)) return "Supabase's default email sender only delivers to authorized team addresses. Set up custom SMTP to email customers.";
  if (/over_email_send_rate_limit|email rate limit/.test(lower)) return "The default Supabase email sender has reached its limit. Set up custom SMTP for customer sign-in.";
  if (/rate limit|too many requests/.test(lower)) return "Too many code requests. Wait a little, then try again.";
  if (/invalid.*(otp|token)|expired/.test(lower)) return "That code is incorrect or expired. Request a fresh one and try again.";
  return message || "We couldn't complete sign-in. Check your details and try again.";
}

export async function resendSignupConfirmation(render, authPageUrl, navigate) {
  const email = state.authIdentity.trim().toLowerCase();
  if (!supabase) {
    state.authError = "Supabase is not configured. Check the VITE_SUPABASE settings and restart the dev server.";
    render();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    state.authError = "Enter a valid email address before requesting a new verification code.";
    render();
    return;
  }

  try {
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) throw error;
    state.authMode = "signup";
    state.authMethod = "email";
    state.authIdentity = email;
    state.authError = "";
    state.authResendAvailable = false;
    saveAuthFlow();
    navigate(authPageUrl("verify", "signup", "email"));
    toast("If this account still needs verification, a new code is on its way.", "info");
  } catch (error) {
    state.authError = readableAuthError(error);
    state.authResendAvailable = true;
    render();
  }
}

export async function writeCustomerProfile(user) {
  const profileClient = supabase;
  if (!user?.id) return;
  let existing = null;
  let readError = null;
  if (profileClient) {
    const result = await profileClient
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();
    existing = result.data;
    readError = result.error;
    if (readError) console.warn("Could not read the Fast Dine profile:", readError.message);
  }

  const fullName = user.user_metadata?.full_name || existing?.full_name || "";
  const email = user.email || "";
  const phone = user.phone || "";
  const profile = { id: user.id, full_name: fullName };
  if (phone) profile.phone = phone;
  if (profileClient && !existing && !readError) {
    const { error } = await profileClient.from("profiles").upsert(profile, { onConflict: "id" });
    if (error) console.warn("Could not create the Fast Dine profile:", error.message);
  }

  state.profile = {
    ...state.profile,
    name: fullName,
    email,
    phone: phone || existing?.phone || ""
  };
  state.signedIn = true;
  save();
}

export async function refreshCustomerOrders() {
  if (!supabase) return;
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, placed_at, total_kes, delivery_address, payment_method_label, store_id, stores(name), order_items(product_id, product_name, quantity, unit_price_kes)")
    .order("placed_at", { ascending: false });
  if (error) throw error;

  state.orders = (data || []).map(order => ({
    id: order.id,
    orderNumber: order.order_number,
    createdAt: order.placed_at,
    store: order.stores?.name || "Fast Dine order",
    items: (order.order_items || []).map(item => ({
      id: item.product_id?.startsWith(`${order.store_id}__`)
        ? item.product_id.slice(order.store_id.length + 2)
        : item.product_id,
      name: item.product_name,
      qty: item.quantity,
      price: item.unit_price_kes,
      store: order.store_id
    })),
    total: order.total_kes,
    status: order.status,
    address: order.delivery_address?.address_line || "",
    paymentMethod: order.payment_method_label,
    persisted: true
  }));
  save();
}

export async function handleAuthSession(event, session, { render, authPageUrl, refreshSavedAddresses }) {
  state.supabaseBootstrapped = true;
  state.authBootstrapped = true;
  const isPasswordResetReturn = currentPath() === "/en/login/recovery"
    && new URLSearchParams(window.location.search).get("mode") === "reset"
    && Boolean(session?.user);
  if (event === "PASSWORD_RECOVERY" || isPasswordResetReturn) {
    state.passwordRecoveryReady = true;
    state.recoveryEmailSent = false;
    state.authError = "";
  }
  if (!session?.user) {
    state.signedIn = false;
    state.savedAddresses = read("tamu-delivery-addresses", []);
    save();
    if (currentPath() === "/en/auth/callback") {
      state.authError = "That sign-in link expired. Request a new code or link.";
      clearAuthFlow();
      history.replaceState({}, "", authPageUrl("login"));
    }
    render();
    return;
  }

  await writeCustomerProfile(session.user);
  try {
    await refreshCustomerOrders();
  } catch (error) {
    console.error("Could not load saved Fast Dine orders:", error);
    if (currentPath().startsWith("/en/profile")) toast("You're signed in, but your saved orders could not be loaded.", "error");
  }
  try {
    await refreshSavedAddresses();
  } catch (error) {
    console.error("Could not load saved delivery addresses:", error);
  }
  render();
}

export function initializeSupabaseAuth(callbacks) {
  if (!supabase) return;
  supabase.auth.onAuthStateChange((event, session) => {
    window.setTimeout(() => { void handleAuthSession(event, session, callbacks); }, 0);
  });
}

export async function signOutCustomer(navigate, render) {
  try {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  } catch (error) {
    toast(readableAuthError(error), "error");
    return;
  }
  clearAuthFlow();
  sessionStorage.removeItem("fastdine-auth-flow");
  localStorage.removeItem("fastdine-signed-in");
  state.profile.name = "";
  state.profile.email = "";
  state.profile.phone = "";
  state.signedIn = false;
  state.savedAddresses = read("tamu-delivery-addresses", []);
  save();
  navigate(BASE);
  render();
  toast("You've signed out on this device.", "info");
}
