// The Project — everything an organizer sets up once (event, locked look,
// assets, schedule). Persisted to localStorage for v0 (single browser, no auth);
// later this moves to a DB with accounts + sharing.
import {
  DEFAULT_LOOK,
  type BrandColors,
  type SponsorItem,
  type TextureKind,
  type BoxStyle,
  type TemplateId,
} from "./kit";

export interface SchedArtist {
  id: string;
  name: string;
  venue: string;
  time: string;
}
export interface SchedDay {
  id: string;
  date: string;
  artists: SchedArtist[];
}

export interface Project {
  event: string;
  // look (locked during Create)
  colors: BrandColors;
  fonts: { display: string; body: string };
  texture: TextureKind;
  boxStyle: BoxStyle;
  titleCase: "upper" | "normal";
  templateId: TemplateId;
  // assets
  logo: string;
  sponsors: SponsorItem[];
  // schedule
  days: SchedDay[];
}

export const EMPTY_PROJECT: Project = {
  event: "",
  colors: DEFAULT_LOOK.colors,
  fonts: DEFAULT_LOOK.fonts,
  texture: DEFAULT_LOOK.texture,
  boxStyle: DEFAULT_LOOK.boxStyle,
  titleCase: DEFAULT_LOOK.titleCase,
  templateId: "image-led",
  logo: "",
  sponsors: [],
  days: [],
};

const KEY = "kitcreator.project.v1";

export function loadProject(): Project | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return { ...EMPTY_PROJECT, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function saveProject(p: Project): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore quota / private mode */
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

/** The locked-look params shared by every render in a project. */
export function styleParams(p: Project): Record<string, string> {
  return {
    base: p.colors.base,
    ink: p.colors.ink,
    accent: p.colors.accent,
    accent2: p.colors.accent2,
    fdisp: p.fonts.display,
    fbody: p.fonts.body,
    tex: p.texture,
    box: p.boxStyle,
    case: p.titleCase,
  };
}
