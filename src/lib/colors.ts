// Tiny colour helpers. Colours are kept as "r g b" triplets (the form CSS vars
// use via rgb(var(--c-…))), with hex conversion for <input type="color">.

export function hexToTriplet(hex: string): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function tripletToHex(t: string): string {
  const [r, g, b] = t.trim().split(/\s+/).map(Number);
  const h = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Blend two triplets; t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
  const pa = a.trim().split(/\s+/).map(Number);
  const pb = b.trim().split(/\s+/).map(Number);
  return pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(" ");
}

/** Perceived luminance 0–255 (for picking multiply vs screen grain). */
export function luminance(t: string): number {
  const [r, g, b] = t.trim().split(/\s+/).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
