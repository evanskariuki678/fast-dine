import { state } from "./state.js";

export const GEOAPIFY_API_KEY = (import.meta.env.VITE_GEOAPIFY_API_KEY || "").trim();

let deliveryMap;
let deliveryMarker;
let deliveryMapElement;
let L;
let autocompleteTimer;
let autocompleteRequestId = 0;

export function placeDeliveryMarker(latitude, longitude) {
  if (!deliveryMap) return;
  const point = [latitude, longitude];
  if (!deliveryMarker) {
    deliveryMarker = L.marker(point, { draggable: true, title: "Delivery location" })
      .addTo(deliveryMap)
      .on("dragend", () => {
        const position = deliveryMarker.getLatLng();
        void setDeliveryPoint(position.lat, position.lng, true);
      });
  } else {
    deliveryMarker.setLatLng(point);
  }
}

export async function initGeoapifyDeliveryMap() {
  const mapElement = document.querySelector("#delivery-map");
  if (!mapElement || deliveryMapElement === mapElement) return;
  deliveryMapElement = mapElement;
  if (!GEOAPIFY_API_KEY) {
    showMapUnavailable("Configure VITE_GEOAPIFY_API_KEY from your Geoapify project to display the map and search addresses.");
    return;
  }
  try {
    if (!mapElement.isConnected) return;
    const [leafletModule] = await Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css")
    ]);
    L = leafletModule.default;
    deliveryMap?.remove();
    deliveryMarker = undefined;
    const initialPoint = state.deliveryLocation || { latitude: -1.286389, longitude: 36.817223 };
    const map = L.map(mapElement).setView([initialPoint.latitude, initialPoint.longitude], state.deliveryLocation ? 17 : 12);
    deliveryMap = map;
    const tileLayer = L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-carto/{z}/{x}/{y}.png?apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`, {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.geoapify.com/">Geoapify</a>'
    }).addTo(map);
    tileLayer.on("tileerror", () => {
      state.locationError = "Map tiles could not load. Check your Geoapify API key, domain restrictions, and plan.";
      renderLocationMessage();
    });
    if (state.deliveryLocation) {
      placeDeliveryMarker(initialPoint.latitude, initialPoint.longitude);
    }
    map.on("click", event => {
      void setDeliveryPoint(event.latlng.lat, event.latlng.lng, true);
    });
    const searchInput = document.querySelector("#delivery-place-search");
    const suggestions = document.querySelector("#delivery-place-suggestions");
    searchInput?.addEventListener("input", () => {
      clearTimeout(autocompleteTimer);
      const requestId = ++autocompleteRequestId;
      const query = searchInput.value.trim();
      if (!suggestions || query.length < 3) {
        suggestions?.replaceChildren();
        return;
      }
      autocompleteTimer = setTimeout(async () => {
        try {
          const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
          url.search = new URLSearchParams({
            text: query,
            filter: "countrycode:ke",
            bias: "proximity:36.817223,-1.286389",
            limit: "5",
            apiKey: GEOAPIFY_API_KEY
          });
          const response = await fetch(url);
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || `Address search failed (${response.status}).`);
          if (requestId !== autocompleteRequestId || !suggestions.isConnected) return;
          suggestions.replaceChildren();
          for (const feature of data.features || []) {
            const properties = feature.properties;
            const option = document.createElement("button");
            option.type = "button";
            option.className = "delivery-search-suggestion";
            option.setAttribute("role", "option");
            option.textContent = properties.formatted;
            option.addEventListener("click", () => {
              state.profile.address = properties.formatted;
              const addressField = document.querySelector('input[name="address"]');
              if (addressField) addressField.value = properties.formatted;
              searchInput.value = properties.formatted;
              suggestions.replaceChildren();
              void setDeliveryPoint(Number(properties.lat), Number(properties.lon), false);
            });
            suggestions.append(option);
          }
        } catch (error) {
          if (requestId !== autocompleteRequestId) return;
          console.error("Could not search delivery addresses:", error);
          state.locationError = "Address search failed. Check the Geoapify key or enter the address manually.";
          renderLocationMessage();
        }
      }, 250);
    });
    searchInput?.addEventListener("blur", () => {
      setTimeout(() => suggestions?.replaceChildren(), 150);
    });
    updateDeliveryMapCaption();
    if (state.deliveryLocation && !state.profile.address) {
      await reverseGeocodeDeliveryPoint(initialPoint.latitude, initialPoint.longitude);
    }
    setTimeout(() => map.invalidateSize(), 0);
  } catch (error) {
    console.error("Could not initialize the Geoapify map:", error);
    state.locationError = "The map could not be loaded. Check the Geoapify API key and network connection.";
    showMapUnavailable("Check the Geoapify API key and network connection.");
    renderLocationMessage();
  }
}

export function renderLocationMessage() {
  const error = document.querySelector("#location-error");
  if (error) {
    error.textContent = state.locationError;
    error.hidden = !state.locationError;
  }
  const status = document.querySelector("#location-status");
  if (status) {
    status.textContent = state.locationStatus;
    status.hidden = !state.locationStatus;
  }
}

export function updateLocationDetectionButton() {
  const button = document.querySelector("[data-action='detect-location']");
  if (!button) return;
  button.disabled = state.detectingLocation;
  button.textContent = state.detectingLocation ? "Finding your location…" : "⌖ Detect My Location";
}

export function showMapUnavailable(message) {
  const mapElement = document.querySelector("#delivery-map");
  if (!mapElement) return;
  const wrapper = document.createElement("div");
  wrapper.className = "delivery-map-fallback";
  const title = document.createElement("b");
  title.textContent = state.deliveryLocation
    ? `GPS point: ${state.deliveryLocation.latitude.toFixed(5)}, ${state.deliveryLocation.longitude.toFixed(5)}`
    : "Map is unavailable";
  const detail = document.createElement("small");
  detail.textContent = message;
  wrapper.append(title, detail);
  mapElement.replaceChildren(wrapper);
}

export function updateDeliveryMapCaption() {
  const caption = document.querySelector("#delivery-map-caption");
  if (!caption) return;
  const point = state.deliveryLocation;
  caption.textContent = point
    ? `Pin: ${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)} · Move the pin to adjust the address.`
    : "Search for an address or click the map to place a pin.";
}

export async function setDeliveryPoint(latitude, longitude, reverseGeocode) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
  state.selectedAddressId = "";
  state.deliveryLocation = { latitude, longitude };
  state.locationError = "";
  if (deliveryMap) {
    deliveryMap.panTo([latitude, longitude]);
    placeDeliveryMarker(latitude, longitude);
  }
  updateDeliveryMapCaption();
  renderLocationMessage();
  if (reverseGeocode) await reverseGeocodeDeliveryPoint(latitude, longitude);
}

export async function reverseGeocodeDeliveryPoint(latitude, longitude) {
  if (!GEOAPIFY_API_KEY) return;
  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
    url.search = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      format: "json",
      apiKey: GEOAPIFY_API_KEY
    });
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Reverse geocoding failed.");
    const address = data.results?.[0]?.formatted;
    if (!address) throw new Error("Geoapify did not find an address for this pin.");
    const addressField = document.querySelector('input[name="address"]');
    if (addressField) addressField.value = address;
    state.profile.address = address;
    state.locationError = "";
    renderLocationMessage();
  } catch (error) {
    console.error("Could not reverse-geocode the delivery pin:", error);
    state.locationError = "We couldn't find a street address for this pin. Search for the address or enter it manually.";
    renderLocationMessage();
  }
}

export function detectDeliveryLocation() {
  state.locationError = "";
  state.locationStatus = "";
  if (!window.isSecureContext) {
    state.locationError = "Location detection requires HTTPS or localhost. Enter your delivery address below instead.";
    renderLocationMessage();
    return;
  }
  if (!navigator.geolocation) {
    state.locationError = "This browser does not support location detection. Enter your delivery address below instead.";
    renderLocationMessage();
    return;
  }
  state.detectingLocation = true;
  updateLocationDetectionButton();
  navigator.geolocation.getCurrentPosition(
    position => {
      state.selectedAddressId = "";
      state.deliveryLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      state.detectingLocation = false;
      state.locationError = "";
      state.locationStatus = GEOAPIFY_API_KEY
        ? "GPS location detected. Confirm the point on the map or add a street address below."
        : "GPS location detected. Add a street address below; configure Geoapify to display the map.";
      updateLocationDetectionButton();
      updateDeliveryMapCaption();
      renderLocationMessage();
      if (deliveryMap) {
        placeDeliveryMarker(position.coords.latitude, position.coords.longitude);
        deliveryMap.setView([position.coords.latitude, position.coords.longitude], 17);
      } else {
        showMapUnavailable("GPS coordinates are ready to save. Configure Geoapify to display the map and search addresses.");
      }
      if (GEOAPIFY_API_KEY) {
        void reverseGeocodeDeliveryPoint(position.coords.latitude, position.coords.longitude);
      }
    },
    error => {
      state.detectingLocation = false;
      updateLocationDetectionButton();
      state.locationError = error.code === 1
        ? "Location permission was denied. Allow location access in your browser settings, or enter your address manually."
        : error.code === 2
          ? "Your location is unavailable right now. Check your device location settings or enter your address manually."
          : "Location detection timed out. Try again or enter your address manually.";
      renderLocationMessage();
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
}
