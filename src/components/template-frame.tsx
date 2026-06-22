/**
 * The frame every template renders inside. It applies the active style: the
 * preset's palette + fonts are injected as CSS variables (so every `bg-base` /
 * `text-bone` / `font-display` resolves to the chosen look), texture is
 * conditional, and the sponsor strips + safe-area inset are reserved.
 */
import * as React from "react";
import type { ChannelDef, StylePreset } from "@/lib/kit";
import { Filters, Grain, Halftone } from "@/components/primitives";
import { SponsorTop, SponsorBottom } from "@/components/sponsors";

export function TemplateFrame({
  channel,
  preset,
  theme,
  children,
}: {
  channel: ChannelDef;
  preset: StylePreset;
  theme: "light" | "dark";
  children: React.ReactNode;
}) {
  const p = theme === "dark" ? preset.dark : preset.light;

  const safe = channel.safeInsetPct
    ? {
        paddingTop: (channel.h * channel.safeInsetPct.y) / 100,
        paddingBottom: (channel.h * channel.safeInsetPct.y) / 100,
        paddingLeft: (channel.w * channel.safeInsetPct.x) / 100,
        paddingRight: (channel.w * channel.safeInsetPct.x) / 100,
      }
    : {};

  const vars = {
    "--c-base": p.base,
    "--c-base-card": p.baseCard,
    "--c-bone": p.ink,
    "--c-bone-dim": p.inkDim,
    "--c-bone-faint": p.inkFaint,
    "--c-accent": p.accent,
    "--c-amber": p.accent2,
    "--font-display": `'${preset.fonts.display}'`,
    "--font-body": `'${preset.fonts.body}'`,
    "--font-mono": `'${preset.fonts.mono ?? preset.fonts.body}'`,
  } as React.CSSProperties;

  return (
    <div
      data-frame
      data-theme={theme === "dark" ? "dark" : undefined}
      className="relative flex flex-col overflow-hidden bg-base text-bone"
      style={{ width: channel.w, height: channel.h, containerType: "size", ...vars, ...safe }}
    >
      <Filters />
      <SponsorTop />
      <div className="relative flex-1 overflow-hidden">{children}</div>
      <SponsorBottom />
      {preset.texture === "grain" && <Halftone className="z-40 opacity-[0.16]" />}
      {preset.texture !== "none" && <Grain soft={preset.texture === "soft"} />}
    </div>
  );
}
