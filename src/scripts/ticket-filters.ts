// Client-side search, filtering, and sorting for the /search/ page.
// Tickets are server-rendered; this only toggles `hidden` and reorders the <li>s.

const DEFAULT_SORT = "date-desc";

// Theaters and ratings appear in the URL as slugs, e.g. "AMC Lincoln Square" -> "amc-lincoln-square".
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Sorter = (a: HTMLElement, b: HTMLElement) => number;

const str = (li: HTMLElement, key: string) => li.dataset[key] ?? "";
const num = (li: HTMLElement, key: string) => Number(li.dataset[key] ?? 0);

const byDate = (dir: 1 | -1): Sorter => (a, b) =>
  str(a, "date").localeCompare(str(b, "date")) * dir ||
  str(a, "title").localeCompare(str(b, "title"));

const byPrice = (dir: 1 | -1): Sorter => (a, b) =>
  (num(a, "price") - num(b, "price")) * dir || byDate(-1)(a, b);

const sorters: Record<string, Sorter> = {
  "date-desc": byDate(-1),
  "date-asc": byDate(1),
  "price-desc": byPrice(-1),
  "price-asc": byPrice(1),
  title: (a, b) =>
    str(a, "title").localeCompare(str(b, "title")) || byDate(-1)(a, b),
};

function initTicketFilters() {
  const search = document.querySelector<HTMLInputElement>("#searchInput");
  const theater = document.querySelector<HTMLSelectElement>("#theaterFilter");
  const year = document.querySelector<HTMLSelectElement>("#yearFilter");
  const rating = document.querySelector<HTMLSelectElement>("#ratingFilter");
  const type = document.querySelector<HTMLSelectElement>("#typeFilter");
  const sort = document.querySelector<HTMLSelectElement>("#sortSelect");
  const grid = document.querySelector<HTMLElement>("#ticketResults");
  const count = document.querySelector<HTMLElement>("#resultsCount");
  const clear = document.querySelector<HTMLButtonElement>("#clearFilters");
  const clearEmpty = document.querySelector<HTMLButtonElement>("#clearFiltersEmpty");
  const empty = document.querySelector<HTMLElement>("#noResults");

  // Not on the search page.
  if (
    !search || !theater || !year || !rating || !type || !sort ||
    !grid || !count || !clear || !clearEmpty || !empty
  ) {
    return;
  }

  const items = [...grid.querySelectorAll<HTMLElement>(":scope > li")];
  const selects = [theater, year, rating, type];

  function apply() {
    const q = search!.value.trim().toLowerCase();
    let shown = 0;
    for (const li of items) {
      const match =
        (!q || str(li, "search").includes(q)) &&
        (!theater!.value || li.dataset.theater === theater!.value) &&
        (!year!.value || li.dataset.year === year!.value) &&
        (!rating!.value || li.dataset.rating === rating!.value) &&
        (!type!.value || li.dataset.type === type!.value);
      li.hidden = !match;
      if (match) shown++;
    }
    const filtered = Boolean(q || selects.some((s) => s.value));
    clear!.hidden = !filtered;
    grid!.hidden = shown === 0;
    empty!.hidden = shown > 0;
    count!.textContent = filtered
      ? `Showing ${shown} of ${items.length} tickets`
      : `Showing all ${items.length} tickets`;
  }

  function applySort() {
    grid!.append(...[...items].sort(sorters[sort!.value] ?? sorters[DEFAULT_SORT]));
  }

  // Mirror the current filters into the query string, e.g. ?q=dune&year=2024&sort=price-desc.
  function writeUrl() {
    const params = new URLSearchParams();
    const q = search!.value.trim();
    if (q) params.set("q", q);
    if (theater!.value) params.set("theater", slugify(theater!.value));
    if (year!.value) params.set("year", year!.value);
    if (rating!.value) params.set("rating", slugify(rating!.value));
    if (type!.value) params.set("type", type!.value);
    if (sort!.value !== DEFAULT_SORT) params.set("sort", sort!.value);
    const qs = params.toString();
    history.replaceState(history.state, "", qs ? `?${qs}` : location.pathname);
  }

  // Values that don't match an option are ignored, so stale links fall back to "all".
  function readUrl() {
    const params = new URLSearchParams(location.search);
    const pick = (
      select: HTMLSelectElement,
      value: string | null,
      map = (v: string) => v,
    ) => {
      const option = [...select.options].find((o) => value && map(o.value) === value);
      select.value = option ? option.value : select.options[0].value;
    };
    search!.value = params.get("q") ?? "";
    pick(theater!, params.get("theater"), slugify);
    pick(year!, params.get("year"));
    pick(rating!, params.get("rating"), slugify);
    pick(type!, params.get("type"));
    pick(sort!, params.get("sort"));
  }

  [search, ...selects].forEach((el) =>
    el.addEventListener("input", () => {
      apply();
      writeUrl();
    }),
  );
  sort.addEventListener("input", () => {
    applySort();
    writeUrl();
  });

  function resetFilters() {
    search!.value = "";
    selects.forEach((s) => (s.value = ""));
    sort!.value = DEFAULT_SORT;
    applySort();
    apply();
    writeUrl();
    search!.focus();
  }
  clear.addEventListener("click", resetFilters);
  clearEmpty.addEventListener("click", resetFilters);

  readUrl();
  applySort();
  apply();
}

// With <ClientRouter />, astro:page-load fires on the first load and after every navigation.
document.addEventListener("astro:page-load", initTicketFilters);
