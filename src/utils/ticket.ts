/**
 * Print details for a ticket stub: how the title is set, its barcode, and its
 * serial number. Everything is derived deterministically from the ticket so a
 * stub looks the same on every build.
 */

/** FNV-1a-ish string hash, stable across builds. */
export const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/**
 * A barcode as a CSS gradient. Bars are `currentColor`, so it prints in the
 * ticket's ink.
 */
export const barcode = (seed: string, angle = 90): string => {
  let h = hash(seed) || 1;
  const next = () => {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    return h;
  };
  const stops: string[] = [];
  let x = 0;
  while (x < 100) {
    const bar = (1 + (next() % 3)) * 1.1;
    const gap = (1 + (next() % 3)) * 1.1;
    const end = Math.min(100, x + bar);
    stops.push(`currentColor ${x.toFixed(1)}% ${end.toFixed(1)}%`);
    stops.push(`transparent ${end.toFixed(1)}% ${Math.min(100, end + gap).toFixed(1)}%`);
    x = end + gap;
  }
  return `linear-gradient(${angle}deg, ${stops.join(", ")})`;
};

/** A 15-digit stub serial, e.g. "390003921932000". */
export const serial = (seed: string): string =>
  ("39000" + String(hash(seed)).padStart(10, "0")).slice(0, 15);

/**
 * Split a title into a condensed lead line and an expanded tail, like a
 * printed event ticket. Sizes are in cqw (percent of the ticket's width).
 */
export const splitTitle = (title: string) => {
  const words = title.trim().split(/\s+/);
  // Short titles stay on one condensed line.
  let cut = title.trim().length <= 10 ? words.length : 1;
  while (
    cut < words.length - 1 &&
    words.slice(0, cut + 1).join(" ").length <= 9
  ) {
    cut++;
  }
  const lead = words.slice(0, cut).join(" ");
  const tail = words.slice(cut).join(" ");
  const clamp = (min: number, max: number, v: number) =>
    Math.max(min, Math.min(max, v));
  return {
    lead,
    tail,
    // Condensed line shrinks for long single words.
    leadSize: clamp(5.5, 10.5, 88 / Math.max(lead.length, 1)),
    // Expanded line shrinks, then wraps once it reaches a readable floor.
    tailSize: clamp(3, 4.6, 62 / Math.max(tail.length, 1)),
  };
};
