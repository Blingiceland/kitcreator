/**
 * Type-led layout — the title carries the design, the photo sits faint behind as
 * a tint. Reads the resolved style for case + box treatment. Because the image
 * is a low-opacity background, its aspect ratio barely matters here.
 */
import * as React from "react";
import type { ResolvedStyle } from "@/lib/kit";
import type { TemplateData } from "./image-led";
import { fitSize, plate } from "@/components/primitives";

export function TypoLed({ data, style }: { data: TemplateData; style: ResolvedStyle }) {
  const { img, imgPos, logo, event, title, subtitle, date } = data;
  const caseClass = style.titleCase === "upper" ? "uppercase" : "normal-case";

  const chip =
    style.boxStyle === "stamp"
      ? { className: "-rotate-1 bg-accent text-[color:rgb(var(--c-base))]", style: { ...plate("rgb(var(--c-bone))"), fontSize: "2.8cqmin" } }
      : style.boxStyle === "outline"
        ? { className: "border-[0.3cqmin] border-accent text-accent", style: { fontSize: "2.6cqmin" } }
        : { className: "bg-accent text-[color:rgb(var(--c-base))]", style: { fontSize: "2.6cqmin" } };

  return (
    <div className="absolute inset-0 flex flex-col justify-center p-[6cqmin]">
      {/* Faint photo tint */}
      <div className="absolute inset-0">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" className="h-full w-full object-cover opacity-[0.26]" style={{ objectPosition: imgPos || "center" }} />
        )}
        <span aria-hidden className="absolute inset-0 bg-base/55" />
      </div>

      {/* Event logo / name, top-left */}
      {(logo || event) && (
        <div className="absolute left-[6cqmin] top-[6cqmin] z-10">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={event ?? ""} style={{ height: "8cqmin", width: "auto", objectFit: "contain" }} />
          ) : (
            <span className="font-mono uppercase leading-none tracking-[0.2em] text-bone" style={{ fontSize: "2.3cqmin" }}>
              {event}
            </span>
          )}
        </div>
      )}

      {/* Big type */}
      <div className="relative z-10 flex flex-col items-start gap-[2.5cqmin]">
        {date && (
          <span className={"font-display uppercase leading-none " + chip.className} style={{ paddingInline: "2cqmin", paddingBlock: "1cqmin", ...chip.style }}>
            {date}
          </span>
        )}
        {title && (
          <h1 className={"font-display leading-[0.84] text-bone " + caseClass} style={{ fontSize: `${fitSize(title, 26)}cqmin` }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="font-mono uppercase leading-none tracking-[0.18em] text-bone-dim" style={{ fontSize: "2.6cqmin" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
