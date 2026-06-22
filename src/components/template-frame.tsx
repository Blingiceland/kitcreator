/**
 * The frame every template renders inside: fixed channel size, container-query
 * context, theme, the reserved sponsor strips (top/bottom), and the grain +
 * halftone print texture. The template layout fills the middle.
 */
import * as React from "react";
import type { ChannelDef } from "@/lib/kit";
import { Filters, Grain, Halftone } from "@/components/primitives";
import { SponsorTop, SponsorBottom } from "@/components/sponsors";

export function TemplateFrame({
  channel,
  theme,
  children,
}: {
  channel: ChannelDef;
  theme: "light" | "dark";
  children: React.ReactNode;
}) {
  // Safe-area inset for placements the platform crops (e.g. FB page cover):
  // pad the lockup inward while the background + grain still bleed full.
  const safe = channel.safeInsetPct
    ? {
        paddingTop: (channel.h * channel.safeInsetPct.y) / 100,
        paddingBottom: (channel.h * channel.safeInsetPct.y) / 100,
        paddingLeft: (channel.w * channel.safeInsetPct.x) / 100,
        paddingRight: (channel.w * channel.safeInsetPct.x) / 100,
      }
    : undefined;

  return (
    <div
      data-frame
      data-theme={theme === "dark" ? "dark" : undefined}
      className="relative flex flex-col overflow-hidden bg-base text-bone"
      style={{ width: channel.w, height: channel.h, containerType: "size", ...safe }}
    >
      <Filters />
      <SponsorTop />
      <div className="relative flex-1 overflow-hidden">{children}</div>
      <SponsorBottom />
      <Halftone className="z-40 opacity-[0.16]" />
      <Grain />
    </div>
  );
}
