/**
 * Split layout — image in its own band (object-contain, so the whole photo shows
 * with NO cropping), text block beneath on the solid ground. Best for portrait
 * photos that would get chopped by a full-bleed cover. Reads the resolved style.
 */
import * as React from "react";
import type { ResolvedStyle } from "@/lib/kit";
import type { TemplateData } from "./image-led";
import { fitSize, plate } from "@/components/primitives";

export function Split({ data, style }: { data: TemplateData; style: ResolvedStyle }) {
  const { img, imgPos, logo, event, title, subtitle, date } = data;
  const caseClass = style.titleCase === "upper" ? "uppercase" : "normal-case";

  const chip =
    style.boxStyle === "stamp"
      ? { className: "-rotate-1 bg-accent text-[color:rgb(var(--c-base))]", style: { ...plate("rgb(var(--c-bone))"), fontSize: "2.8cqmin" } }
      : style.boxStyle === "outline"
        ? { className: "border-[0.3cqmin] border-accent text-accent", style: { fontSize: "2.6cqmin" } }
        : { className: "bg-accent text-[color:rgb(var(--c-base))]", style: { fontSize: "2.6cqmin" } };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Image band — contained, never cropped. Fixed share of the height; the
          image is absolute so it can't drive the band taller than its share. */}
      <div className="relative shrink-0 bg-base-card" style={{ height: "55%" }}>
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" className="absolute inset-0 h-full w-full object-contain p-[2cqmin]" style={{ objectPosition: imgPos || "center" }} />
        )}
        {(logo || event) && (
          <div className="absolute left-[4cqmin] top-[4cqmin]">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={event ?? ""} style={{ height: "7cqmin", width: "auto", objectFit: "contain" }} />
            ) : (
              <span className="font-mono uppercase leading-none tracking-[0.2em] text-bone" style={{ fontSize: "2.2cqmin" }}>
                {event}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Text band */}
      <div className="flex flex-1 flex-col items-start justify-center gap-[2cqmin] border-t-[0.4cqmin] border-bone p-[5cqmin]">
        {date && (
          <span className={"font-display uppercase leading-none " + chip.className} style={{ paddingInline: "2cqmin", paddingBlock: "1cqmin", ...chip.style }}>
            {date}
          </span>
        )}
        {title && (
          <h1 className={"font-display leading-[0.86] text-bone " + caseClass} style={{ fontSize: `${fitSize(title, 14)}cqmin` }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="font-mono uppercase leading-none tracking-[0.15em] text-bone-dim" style={{ fontSize: "2.4cqmin" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
