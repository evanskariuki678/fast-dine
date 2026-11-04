import { supabase, supabaseConfigured } from "./supabase.js";
import { state, save } from "./state.js";
import { toast } from "./toast.js";

export function openDeliveryLocation(renderOverlay, renderLocationMessage) {
  state.modal = "address";
  state.locationError = "";
  state.locationStatus = "";
  const saved = state.savedAddresses.find(address =>
    address.address === state.profile.address && address.apartment === state.profile.apartment
  );
  state.selectedAddressId = saved?.id || "";
  if (renderOverlay) renderOverlay();
  if (renderLocationMessage) renderLocationMessage();
  void refreshSavedAddresses(renderOverlay);
}

export async function refreshSavedAddresses(renderOverlay) {
  if (!supabase || !state.signedIn) return;
  state.loadingAddresses = true;
  if (renderOverlay) renderOverlay();
  try {
    const { data, error } = await supabase
      .from("delivery_addresses")
      .select("id,label,recipient_name,phone,address_line,apartment,delivery_note,city,latitude,longitude,is_default,created_at")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    state.savedAddresses = (data || []).map(address => ({
      id: address.id,
      label: address.label || "Home",
      name: address.recipient_name || "",
      phone: address.phone || "",
      address: address.address_line,
      apartment: address.apartment || "",
      note: address.delivery_note || "",
      latitude: address.latitude == null ? null : Number(address.latitude),
      longitude: address.longitude == null ? null : Number(address.longitude),
      isDefault: Boolean(address.is_default)
    }));
    if (!state.selectedAddressId) {
      state.selectedAddressId = state.savedAddresses.find(address =>
        address.address === state.profile.address && address.apartment === state.profile.apartment
      )?.id || "";
    }
    save();
  } catch (error) {
    console.error("Could not load saved delivery addresses:", error);
    state.locationError = "Saved addresses could not be loaded. Check the Supabase delivery-address migration and try again.";
  } finally {
    state.loadingAddresses = false;
    if (state.modal === "address" && renderOverlay) renderOverlay();
  }
}

export async function saveDeliveryAddress(address) {
  if (supabaseConfigured && state.signedIn) {
    if (!supabase) throw new Error("Saved addresses are unavailable because Supabase is not configured.");
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!authData.user) throw new Error("Sign in again before saving this address to your account.");
    const row = {
      user_id: authData.user.id,
      label: address.label,
      recipient_name: address.name,
      phone: address.phone,
      address_line: address.address,
      apartment: address.apartment,
      delivery_note: address.note,
      city: "Nairobi",
      latitude: address.latitude,
      longitude: address.longitude,
      is_default: state.savedAddresses.length === 0 || state.savedAddresses.some(item => item.id === state.selectedAddressId && item.isDefault)
    };
    const query = state.selectedAddressId && !state.selectedAddressId.startsWith("local-")
      ? supabase.from("delivery_addresses").update(row).eq("id", state.selectedAddressId).select().single()
      : supabase.from("delivery_addresses").insert(row).select().single();
    const { data, error } = await query;
    if (error) throw error;
    address.id = data.id;
    address.isDefault = Boolean(data.is_default);
  } else {
    address.id = state.selectedAddressId || `local-${crypto.randomUUID()}`;
    address.isDefault = state.savedAddresses.length === 0 || state.savedAddresses.some(item => item.id === state.selectedAddressId && item.isDefault);
    state.savedAddresses = state.savedAddresses.filter(item => item.id !== address.id);
    state.savedAddresses.unshift(address);
    save();
  }
  state.savedAddresses = state.savedAddresses.filter(item => item.id !== address.id);
  state.savedAddresses.unshift(address);
  state.selectedAddressId = address.id;
}

export async function deleteSavedAddress(id, renderOverlay) {
  try {
    if (supabase && state.signedIn && !id.startsWith("local-")) {
      const { error } = await supabase.from("delivery_addresses").delete().eq("id", id);
      if (error) throw error;
    }
    const wasDefault = state.savedAddresses.find(address => address.id === id)?.isDefault;
    const wasSelected = state.selectedAddressId === id;
    state.savedAddresses = state.savedAddresses.filter(address => address.id !== id);
    if (wasDefault && state.savedAddresses.length) {
      state.savedAddresses[0].isDefault = true;
      if (supabase && state.signedIn && !state.savedAddresses[0].id.startsWith("local-")) {
        const { error } = await supabase.from("delivery_addresses")
          .update({ is_default: true })
          .eq("id", state.savedAddresses[0].id);
        if (error) throw error;
      }
    }
    if (wasSelected) {
      state.selectedAddressId = "";
      const nextAddress = state.savedAddresses.find(address => address.isDefault) || state.savedAddresses[0];
      if (nextAddress) {
        state.profile.address = nextAddress.address;
        state.profile.apartment = nextAddress.apartment;
        state.profile.latitude = nextAddress.latitude;
        state.profile.longitude = nextAddress.longitude;
        state.deliveryLocation = Number.isFinite(nextAddress.latitude) && Number.isFinite(nextAddress.longitude)
          ? { latitude: nextAddress.latitude, longitude: nextAddress.longitude }
          : null;
      } else {
        state.profile.address = "";
        state.profile.apartment = "";
        delete state.profile.latitude;
        delete state.profile.longitude;
        state.deliveryLocation = null;
      }
    }
    save();
    if (renderOverlay) renderOverlay();
    toast("Saved address removed.");
  } catch (error) {
    console.error("Could not remove saved delivery address:", error);
    state.locationError = "We couldn't remove that saved address. Please try again.";
    if (renderOverlay) renderOverlay();
  }
}

export function chooseSavedAddress(id, render) {
  const address = state.savedAddresses.find(item => item.id === id);
  if (!address) return;
  state.selectedAddressId = address.id;
  state.profile.address = address.address;
  state.profile.apartment = address.apartment;
  state.profile.note = address.note;
  state.profile.latitude = address.latitude;
  state.profile.longitude = address.longitude;
  state.deliveryLocation = Number.isFinite(address.latitude) && Number.isFinite(address.longitude)
    ? { latitude: address.latitude, longitude: address.longitude }
    : null;
  save();
  state.modal = null;
  if (render) render();
  toast(`${address.label || "Saved"} address selected for checkout.`);
}
