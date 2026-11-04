export const BASE = "/en/ke/nairobi";

export const currentPath = () => window.location.pathname;

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

export function escapeAttr(value = "") {
  return escapeHtml(value);
}

export function loginReturnPath(searchParams = window.location.search) {
  const requested = new URLSearchParams(searchParams).get("returnPath");
  if (!requested) return BASE;
  // Prevent open redirect attacks via protocol-relative, backslash, control chars, or javascript: schemes
  if (
    !requested.startsWith("/")
    || requested.startsWith("//")
    || requested.includes("\\")
    || requested.includes("\r")
    || requested.includes("\n")
    || requested.toLowerCase().startsWith("/javascript:")
  ) {
    return BASE;
  }
  return requested;
}

export function normalizeKenyanPhone(input = "") {
  const cleaned = String(input).replace(/[^\d+]/g, "").trim();
  const digits = cleaned.replace(/\D/g, "");
  let national = "";
  if (digits.startsWith("254") && digits.length === 12) {
    national = digits.slice(3);
  } else if ((digits.startsWith("07") || digits.startsWith("01")) && digits.length === 10) {
    national = digits.slice(1);
  } else if ((digits.startsWith("7") || digits.startsWith("1")) && digits.length === 9) {
    national = digits;
  }
  if (/^[17]\d{8}$/.test(national)) {
    return `+254${national}`;
  }
  return null;
}
