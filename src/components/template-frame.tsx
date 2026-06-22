/**
 * The frame every template renders inside. Applies the resolved style: palette +
 * fonts are injected as CSS variables, texture is conditional, the sponsor
 * strips + safe-area inset are reserved. data-theme follows the ground's
 * luminance so grain blends correctly on light vs dark palettes.
 */
import * as React from "react";
import type { ChannelDef, ResolvedStyle } from "@/lib/kit";
import { luminance } from "@/lib/colors";
import { Filters, Grain, Halftone } from "@/components/primitives";
import { SponsorTop, SponsorBottom } from "@/components/sponsors";

export function TemplateFrame({
  channel,
  style,
  sponsors,
  children,
}: {
  channel: ChannelDef;
  style: ResolvedStyle;
  sponsors: string[];
  children: React.ReactNode;
}) {
  const p = style.palette;
  const isDark = luminance(p.base) < 128;

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
    "--font-display": `'${style.fonts.display}'`,
    "--font-body": `'${style.fonts.body}'`,
    "--font-mono": `'${style.fonts.mono}'`,
  } as React.CSSProperties;

  return (
    <div
      data-frame
      data-theme={isDark ? "dark" : undefined}
      className="relative flex flex-col overflow-hidden bg-base text-bone"
      style={{ width: channel.w, height: channel.h, containerType: "size", ...vars, ...safe }}
    >
      <Filters />
      <SponsorTop sponsors={sponsors} />
      <div className="relative flex-1 overflow-hidden">{children}</div>
      <SponsorBottom sponsors={sponsors} />
      {style.texture === "grain" && <Halftone className="z-40 opacity-[0.16]" />}
      {style.texture !== "none" && <Grain soft={style.texture === "soft"} />}
    </div>
  );
}
