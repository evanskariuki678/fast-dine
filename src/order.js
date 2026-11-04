import { state, save, subtotal, selectedPayment, paymentName, promoDiscount } from "./state.js";
import { stores, productInfo } from "./catalog.js";
import { supabase, supabaseConfigured } from "./supabase.js";
import { toast } from "./toast.js";
import { BASE } from "./utils.js";
import { refreshCustomerOrders } from "./auth.js";

export const SUPPORT_EMAIL = (import.meta.env.VITE_SUPPORT_EMAIL || "").trim();

export function addProduct(productId, storeId, render) {
  if (state.submittingOrder) return;
  const product = productInfo(productId, storeId);
  if (!product) return;
  if (state.cart.length && state.cart[0].store !== storeId) {
    const existingStore = stores.find(s => s.id === state.cart[0].store);
    const targetStore = stores.find(s => s.id === storeId);
    const change = confirm(`Your basket has items from ${existingStore?.name || "another store"}. Start a new basket with ${targetStore?.name || "this store"}?`);
    if (!change) return;
    state.cart = [];
  }
  const item = state.cart.find(entry => entry.id === productId);
  if (item) {
    item.qty += 1;
  } else {
    state.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1, store: storeId });
  }
  save();
  if (render) render();
  toast(`Added ${product.name} to your basket.`, "success");
  const cartBtn = document.querySelector(".cart-button");
  if (cartBtn) {
    cartBtn.classList.remove("bounce");
    void cartBtn.offsetWidth;
    cartBtn.classList.add("bounce");
  }
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.classList.remove("bounce");
    void cartCount.offsetWidth;
    cartCount.classList.add("bounce");
  }
}

export function updateQty(id, delta, render) {
  if (state.submittingOrder) return;
  const item = state.cart.find(entry => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter(entry => entry.id !== id);
  save();
  if (render) render();
}

export function advanceCheckout(render) {
  if (state.submittingOrder) return;
  if (state.checkoutStep === 1) {
    if (!state.cart.length) {
      toast("Add a little something to your basket first.");
      return;
    }
    state.checkoutStep = 2;
  } else if (state.checkoutStep === 3) {
    if (!selectedPayment()) {
      toast("Choose a payment method to continue.");
      return;
    }
    state.checkoutStep = 4;
  }
  if (render) render();
}

export function goToCheckoutStep(step, render) {
  if (state.submittingOrder || !Number.isInteger(step) || step < 1 || step > 4) return;
  if (step > state.checkoutStep) return;
  state.checkoutStep = step;
  if (render) render();
}

export function submitOrder({ render, renderOverlay, navigate }) {
  if (state.checkoutStep !== 4 || !state.checkoutTermsAccepted) {
    toast("Review your order and confirm your delivery details before placing it.");
    return;
  }
  if (!state.cart.length) {
    toast("Add a little something to your basket first.");
    return;
  }
  if (!state.profile.address) {
    state.modal = "address";
    if (renderOverlay) renderOverlay();
    return;
  }
  const payment = selectedPayment();
  if (!payment) {
    if (navigate) navigate("/en/profile/account/payment-methods");
    toast("Add a payment method before checkout.");
    return;
  }
  const store = stores.find(item => item.id === state.cart[0].store);
  if (supabaseConfigured) {
    if (!supabase) {
      toast("Orders are unavailable because Supabase is not configured.");
      return;
    }
    void (async () => {
      try {
        state.submittingOrder = true;
        if (render) render();
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!authData.user) {
          if (navigate) navigate(`/en/login?${new URLSearchParams({ returnPath: `${BASE}/order-summary` })}`);
          toast("Sign in before placing your order.");
          return;
        }

        const { data: order, error } = await supabase.rpc("create_order", {
          p_store_id: state.cart[0].store,
          p_items: state.cart.map(item => ({ product_id: item.id, quantity: item.qty })),
          p_delivery_address: {
            recipient_name: state.profile.name,
            phone: state.profile.phone,
            address_line: state.profile.address,
            apartment: state.profile.apartment,
            delivery_note: state.profile.note,
            city: "Nairobi",
            ...(Number.isFinite(state.profile.latitude) && Number.isFinite(state.profile.longitude)
              ? { latitude: state.profile.latitude, longitude: state.profile.longitude }
              : {})
          },
          p_payment_method_type: payment.type,
          p_payment_method_label: paymentName(payment),
          p_promo_code: state.promoCode || null
        });
        if (error) throw error;
        if (!order?.id) throw new Error("Supabase did not return the saved order.");

        state.orders.unshift({
          id: order.id,
          orderNumber: order.order_number,
          createdAt: order.placed_at,
          store: store?.name || "The Fast Dine",
          items: state.cart.map(item => ({ ...item })),
          total: order.total_kes,
          status: order.status,
          address: state.profile.address,
          paymentMethod: paymentName(payment),
          persisted: true
        });
        state.cart = [];
        save();
        state.modal = "placed";
        if (render) render();
        void refreshCustomerOrders().catch(refreshError => {
          console.error("Order was saved, but order history could not be refreshed:", refreshError);
        });
      } catch (error) {
        console.error("Could not save the Fast Dine order:", error);
        toast(error.message || "We couldn't save your order. Your basket is still here; please try again.");
      } finally {
        state.submittingOrder = false;
        if (render) render();
      }
    })();
    return;
  }

  const fee = store?.fee ?? 79;
  const order = {
    id: `FD-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    store: store?.name || "The Fast Dine",
    items: state.cart.map(item => ({ ...item })),
    total: subtotal() + fee + 25 - promoDiscount(),
    status: "Demo order",
    address: state.profile.address,
    paymentMethod: paymentName(payment),
    promoCode: state.promoCode || "",
    persisted: false
  };
  state.orders.unshift(order);
  state.cart = [];
  save();
  state.modal = "placed";
  if (render) render();
}

export function addPaymentMethod(method, render) {
  const duplicate = state.payments.some(existing =>
    existing.type === method.type && (
      method.type === "cash" ||
      (method.type === "mpesa" && existing.phone.replace(/\D/g, "") === method.phone.replace(/\D/g, "")) ||
      (method.type === "card" && existing.brand === method.brand && existing.last4 === method.last4)
    )
  );
  if (duplicate) {
    state.modal = null;
    if (render) render();
    toast("That payment method is already saved.");
    return;
  }
  const next = { ...method, isDefault: !state.payments.length };
  state.payments.push(next);
  if (next.isDefault) state.checkoutPaymentId = next.id;
  state.modal = null;
  save();
  if (render) render();
  toast(`${paymentName(next)} added to this preview.`);
}

export function setDefaultPayment(id, render) {
  if (!state.payments.some(method => method.id === id)) return;
  state.payments = state.payments.map(method => ({ ...method, isDefault: method.id === id }));
  save();
  if (render) render();
  toast("Preferred payment method updated.");
}

export function removePaymentMethod(id, render) {
  const removed = state.payments.find(method => method.id === id);
  if (!removed) return;
  state.payments = state.payments.filter(method => method.id !== id);
  if (removed.isDefault && state.payments.length) state.payments[0].isDefault = true;
  if (state.checkoutPaymentId === id) {
    state.checkoutPaymentId = state.payments.find(method => method.isDefault)?.id || state.payments[0]?.id || "";
  }
  save();
  if (render) render();
  toast("Payment method removed from this preview.");
}

export function applyPromoCode(code, render) {
  if (code === "FAST10") {
    state.promoCode = code;
    save();
    if (render) render();
    toast("FAST10 applied to your checkout!", "success");
  } else {
    toast("Invalid promo code. Use FAST10 for 10% off.", "error");
  }
}

export function removePromoCode(render) {
  state.promoCode = "";
  save();
  if (render) render();
  toast("Promo code removed.");
}

export function supportAssistantAnswer(question) {
  const text = question.toLowerCase();
  if (/\b(order|delivery|courier|track|status)\b/.test(text)) {
    const latest = state.orders[0];
    return latest
      ? `Your latest order (${latest.orderNumber || "order"}) is ${latest.status || "listed in your order history"}. Open My orders for its details. I can't provide live courier tracking from this help guide.`
      : "I can't find an order on this account yet. Open My orders to check your history, or create a support request if you already placed one.";
  }
  if (/\b(refund\w*|return\w*|cancel\w*|payment\w*|charg\w*|mpesa|m-pesa)\b/.test(text)) {
    return "This site preview does not process payments, cancellations, or refunds. If a real charge or order is involved, create a support request and include its order number. Never share a PIN, password, or one-time code.";
  }
  if (/\b(account|login|log in|password|email|verification|verify|otp|code)\b/.test(text)) {
    return "For account access, check that you use the email you registered with. Use the sign-in or password recovery page for access problems. Never share your password or verification code; create a support request if you remain locked out.";
  }
  if (/\b(medicine|medical|pharmacy|symptom|dose|dosage|prescription)\b/.test(text)) {
    return "I can't give medical or medication advice. Please ask a licensed pharmacist or clinician. For a store or delivery issue, create a support request.";
  }
  if (/\b(address|delivery area|deliver to|location)\b/.test(text)) {
    return "Use the delivery address button near the top of the page to update your address. The storefront is a preview and does not dispatch a courier.";
  }
  return "I couldn't find that in the help guide. Create a support request and describe what you need; requests are saved on this device, and a configured support email is needed to contact the team.";
}

export function askSupportAssistant(question, renderOverlay) {
  state.supportConversation.push({ role: "user", text: question });
  state.supportConversation.push({ role: "assistant", text: supportAssistantAnswer(question) });
  if (renderOverlay) renderOverlay();
  const chat = document.querySelector(".support-chat");
  if (chat) chat.scrollTop = chat.scrollHeight;
}

export function supportEmailHref(request) {
  const subject = `Fast Dine support request ${request.requestId}: ${request.topic}`;
  const body = [
    `Request: ${request.requestId}`,
    `Topic: ${request.topic}`,
    `Name: ${request.name}`,
    `Reply email: ${request.email}`,
    `Order number: ${request.orderNumber || "Not provided"}`,
    "",
    request.message
  ].join("\n");
  return `mailto:${encodeURIComponent(SUPPORT_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
