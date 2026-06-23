// ---------------------------------------------------------------------------
// Kit configuration — the single hardcoded "project" for v0.
//
// The LOOK is a configurable layer (StyleConfig): a project picks a preset and
// (later) tweaks palette/fonts/logos. Templates read the active style instead of
// hardcoding one aesthetic — this is what makes it a product, not a one-off.
// In v1+ this becomes per-tenant data.
// ---------------------------------------------------------------------------

import { mix } from "./colors";

export type ChannelKind = "social" | "print" | "screen";

/** One output size / channel. */
export interface ChannelDef {
  id: string;
  label: string;
  w: number;
  h: number;
  kind: ChannelKind;
  scale: number;
  safeInsetPct?: { x: number; y: number };
}

/** A colour set (rgb triplets, e.g. "232 228 218"), one per theme. */
export interface Palette {
  base: string;
  baseCard: string;
  ink: string;
  inkDim: string;
  inkFaint: string;
  accent: string;
  accent2: string;
}

export type TextureKind = "grain" | "soft" | "none";
export type BoxStyle = "stamp" | "flat" | "outline";

/** A look: typography + texture + box treatment + light/dark palettes. */
export interface StylePreset {
  id: string;
  name: string;
  fonts: { display: string; body: string; mono?: string };
  texture: TextureKind;
  boxStyle: BoxStyle;
  titleCase: "upper" | "normal";
  light: Palette;
  dark: Palette;
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

/** Look presets — each a distinct, ready-made aesthetic. */
export const PRESETS: StylePreset[] = [
  {
    id: "silkscreen",
    name: "Silkscreen",
    fonts: { display: "Archivo Black", body: "Sora", mono: "JetBrains Mono" },
    texture: "grain",
    boxStyle: "stamp",
    titleCase: "upper",
    light: { base: "232 228 218", baseCard: "222 217 205", ink: "18 16 15", inkDim: "60 56 54", inkFaint: "104 98 94", accent: "226 92 60", accent2: "226 168 60" },
    dark: { base: "18 16 15", baseCard: "30 28 26", ink: "236 232 222", inkDim: "170 164 154", inkFaint: "120 114 106", accent: "236 110 78", accent2: "236 180 80" },
  },
  {
    id: "clean",
    name: "Clean",
    fonts: { display: "Space Grotesk", body: "Inter", mono: "Inter" },
    texture: "none",
    boxStyle: "flat",
    titleCase: "normal",
    light: { base: "248 248 246", baseCard: "240 240 237", ink: "24 24 27", inkDim: "90 90 96", inkFaint: "150 150 156", accent: "37 99 235", accent2: "16 185 129" },
    dark: { base: "17 18 20", baseCard: "28 29 33", ink: "244 244 245", inkDim: "161 161 170", inkFaint: "113 113 122", accent: "96 165 250", accent2: "52 211 153" },
  },
  {
    id: "editorial",
    name: "Editorial",
    fonts: { display: "Fraunces", body: "Inter", mono: "Inter" },
    texture: "soft",
    boxStyle: "outline",
    titleCase: "normal",
    light: { base: "245 242 235", baseCard: "236 232 223", ink: "26 22 20", inkDim: "92 84 78", inkFaint: "150 140 132", accent: "168 50 50", accent2: "196 138 60" },
    dark: { base: "22 19 18", baseCard: "33 29 27", ink: "240 234 226", inkDim: "176 166 156", inkFaint: "128 120 112", accent: "214 92 84", accent2: "214 168 96" },
  },
  {
    id: "neon",
    name: "Neon / Night",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono", mono: "JetBrains Mono" },
    texture: "none",
    boxStyle: "flat",
    titleCase: "upper",
    light: { base: "245 245 250", baseCard: "235 235 245", ink: "18 18 28", inkDim: "90 90 110", inkFaint: "150 150 170", accent: "0 170 150", accent2: "220 40 140" },
    dark: { base: "10 10 18", baseCard: "20 20 32", ink: "235 235 245", inkDim: "150 150 170", inkFaint: "110 110 130", accent: "0 230 200", accent2: "255 60 160" },
  },
];

/** Curated font choices (all loaded globally in layout). */
export const FONTS: { family: string; label: string }[] = [
  { family: "Archivo Black", label: "Archivo Black" },
  { family: "Space Grotesk", label: "Space Grotesk" },
  { family: "Fraunces", label: "Fraunces (serif)" },
  { family: "Sora", label: "Sora" },
  { family: "Inter", label: "Inter" },
  { family: "JetBrains Mono", label: "JetBrains Mono" },
];

/** The four brand colours a project sets; the rest of the palette is derived. */
export interface BrandColors {
  base: string;
  ink: string;
  accent: string;
  accent2: string;
}

/** Expand the four chosen colours into the full palette the templates use. */
export function fullPalette(c: BrandColors): Palette {
  return {
    base: c.base,
    baseCard: mix(c.base, c.ink, 0.06),
    ink: c.ink,
    inkDim: mix(c.ink, c.base, 0.4),
    inkFaint: mix(c.ink, c.base, 0.62),
    accent: c.accent,
    accent2: c.accent2,
  };
}

/** A sponsor: a wordmark (name) and/or an uploaded transparent logo (url). */
export interface SponsorItem {
  name?: string;
  logo?: string;
}

/** A fully-resolved look handed to the frame/template at render time. */
export interface ResolvedStyle {
  palette: Palette;
  fonts: { display: string; body: string; mono: string };
  texture: TextureKind;
  boxStyle: BoxStyle;
  titleCase: "upper" | "normal";
}

/** Neutral, simple starting look (deliberately NOT the silkscreen preset). */
export const DEFAULT_LOOK = {
  colors: { base: "248 248 246", ink: "24 24 27", accent: "37 99 235", accent2: "16 185 129" } as BrandColors,
  fonts: { display: "Space Grotesk", body: "Inter" },
  texture: "none" as TextureKind,
  boxStyle: "flat" as BoxStyle,
  titleCase: "normal" as "upper" | "normal",
};

/** Build a resolved style straight from explicit knobs (what the wizard edits). */
export function buildStyle(opts: {
  colors: BrandColors;
  fonts: { display: string; body: string };
  texture: TextureKind;
  boxStyle: BoxStyle;
  titleCase: "upper" | "normal";
}): ResolvedStyle {
  return {
    palette: fullPalette(opts.colors),
    fonts: { display: opts.fonts.display, body: opts.fonts.body, mono: opts.fonts.body },
    texture: opts.texture,
    boxStyle: opts.boxStyle,
    titleCase: opts.titleCase,
  };
}

/** Resolve a preset + optional palette/font overrides into a concrete style. */
export function resolveStyle(opts: {
  presetId: string;
  theme: "light" | "dark";
  colors?: BrandColors;
  fonts?: { display: string; body: string };
}): ResolvedStyle {
  const p = getPreset(opts.presetId);
  const palette = opts.colors ? fullPalette(opts.colors) : opts.theme === "dark" ? p.dark : p.light;
  return {
    palette,
    fonts: {
      display: opts.fonts?.display ?? p.fonts.display,
      body: opts.fonts?.body ?? p.fonts.body,
      mono: p.fonts.mono ?? opts.fonts?.body ?? p.fonts.body,
    },
    texture: p.texture,
    boxStyle: p.boxStyle,
    titleCase: p.titleCase,
  };
}

/** Seed brand colours from a preset+theme (starting point for the pickers). */
export function seedColors(presetId: string, theme: "light" | "dark"): BrandColors {
  const p = getPreset(presetId);
  const pal = theme === "dark" ? p.dark : p.light;
  return { base: pal.base, ink: pal.ink, accent: pal.accent, accent2: pal.accent2 };
}

export const TEMPLATES = ["image-led", "typo-led"] as const;
export type TemplateId = (typeof TEMPLATES)[number];

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  "image-led": "Mynd-þung",
  "typo-led": "Týpó-þung",
};

export function getChannel(id: string | undefined): ChannelDef | undefined {
  return CHANNELS.find((c) => c.id === id);
}

export function getPreset(id: string | undefined): StylePreset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}

export function isTemplate(id: string | undefined): id is TemplateId {
  return (TEMPLATES as readonly string[]).includes(id ?? "");
}
