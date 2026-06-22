// ---------------------------------------------------------------------------
// Kit configuration — the single hardcoded "project" for v0.
//
// In v1+ this becomes per-tenant data (brand kit + channels chosen by each
// project owner). For v0 it lives in code: one demo brand + a fixed channel set.
// ---------------------------------------------------------------------------

export type ChannelKind = "social" | "print" | "screen";

/** One output size / channel. */
export interface ChannelDef {
  id: string;
  label: string;
  w: number;
  h: number;
  kind: ChannelKind;
  /** Capture deviceScaleFactor (print upscales for DPI). */
  scale: number;
  /** Safe-area inset (% of w/h) for placements FB crops (e.g. page cover). */
  safeInsetPct?: { x: number; y: number };
}

export interface BrandKit {
  name: string;
  tagline: string;
  /** Sponsor wordmarks (v0 renders these as text; v1 swaps in logo art). */
  sponsors: string[];
}

/** The fixed v0 channel set. Landscape and portrait both covered. */
export const CHANNELS: ChannelDef[] = [
  { id: "fb-event", label: "FB viðburður · 1.91:1", w: 1920, h: 1005, kind: "social", scale: 1 },
  { id: "fb-page", label: "FB síða · 16:9", w: 1640, h: 924, kind: "social", scale: 1, safeInsetPct: { x: 4, y: 16 } },
  { id: "ig-square", label: "IG póstur · 1:1", w: 1080, h: 1080, kind: "social", scale: 2 },
  { id: "ig-portrait", label: "IG · 4:5", w: 1080, h: 1350, kind: "social", scale: 2 },
  { id: "story", label: "Story · 9:16", w: 1080, h: 1920, kind: "social", scale: 1 },
  { id: "poster-a3", label: "Plakat · A3", w: 1240, h: 1754, kind: "print", scale: 2 },
];

export const BRAND: BrandKit = {
  name: "Skemmtilegt",
  tagline: "Eitt upphlað — allt settið.",
  sponsors: ["Rás 2", "Thule", "Four Roses"],
};

/** Templates available in v0 (just one layout for now). */
export const TEMPLATES = ["image-led"] as const;
export type TemplateId = (typeof TEMPLATES)[number];

export function getChannel(id: string | undefined): ChannelDef | undefined {
  return CHANNELS.find((c) => c.id === id);
}

export function isTemplate(id: string | undefined): id is TemplateId {
  return (TEMPLATES as readonly string[]).includes(id ?? "");
}
