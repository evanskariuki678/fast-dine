export function toast(message, type = "info") {
  const root = document.querySelector("#toast-root");
  if (!root) return;
  const isErr = type === "error" || /error|failed|couldn't|invalid|denied|timed out/i.test(String(message));
  const isSucc = type === "success" || /saved|added|updated|ready|signed in/i.test(String(message));
  const finalType = type !== "info" ? type : isErr ? "error" : isSucc ? "success" : "info";

  const toastEl = document.createElement("div");
  toastEl.className = `toast toast-${finalType}`;
  toastEl.setAttribute("role", finalType === "error" ? "alert" : "status");

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.textContent = finalType === "success" ? "✓" : finalType === "error" ? "!" : "ℹ";

  const text = document.createElement("span");
  text.className = "toast-text";
  text.textContent = String(message);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "toast-close";
  closeBtn.setAttribute("aria-label", "Close notification");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    toastEl.classList.add("toast-out");
    setTimeout(() => toastEl.remove(), 200);
  });

  toastEl.append(icon, text, closeBtn);
  root.replaceChildren(toastEl);

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toastEl.classList.add("toast-out");
    setTimeout(() => toastEl.remove(), 250);
  }, 3200);
}
