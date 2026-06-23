// Template registry — maps a template id to its render component. Adding a
// template means: create the component, add it here, and add its id+label in
// kit.ts (TEMPLATES / TEMPLATE_LABELS). The wizard and the raw render page both
// drive off this, so neither hardcodes a list.
import type { ReactElement } from "react";
import type { ResolvedStyle } from "@/lib/kit";
import { ImageLed, type TemplateData } from "./image-led";
import { TypoLed } from "./typo-led";
import { Split } from "./split";

export type TemplateComponent = (props: { data: TemplateData; style: ResolvedStyle }) => ReactElement;

export const TEMPLATE_COMPONENTS: Record<string, TemplateComponent> = {
  "image-led": ImageLed,
  "typo-led": TypoLed,
  split: Split,
};

export function getTemplateComponent(id: string): TemplateComponent {
  return TEMPLATE_COMPONENTS[id] ?? ImageLed;
}
