// One-time "dispense" entrance for tickets (.tk-enter) below the fold.
//
// Tickets already on screen when a page loads are left alone, so a page
// transition never captures them hidden. Everything else is hidden once and
// revealed the first time it scrolls into view, and never re-triggers.

let observer: IntersectionObserver | null = null;

function initReveal() {
  observer?.disconnect();
  observer = null;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const pending = [
    ...document.querySelectorAll<HTMLElement>(".tk-enter:not([data-revealed])"),
  ].filter((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight) {
      el.dataset.revealed = "";
      return false;
    }
    return true;
  });
  if (!pending.length) return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.remove("is-pending");
        el.dataset.revealed = "";
        observer?.unobserve(el);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );

  for (const el of pending) {
    el.classList.add("is-pending");
    observer.observe(el);
  }
}

// With <ClientRouter />, astro:page-load fires on the first load and after
// every navigation (once the new page is in place).
document.addEventListener("astro:page-load", initReveal);
