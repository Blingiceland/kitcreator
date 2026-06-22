/**
 * Image-led layout — full-bleed photo with the title/date pinned, sitting inside
 * the frame's sponsor strips. Sizes in cqmin so one layout adapts to every
 * channel (square, portrait, landscape) without per-format tweaks.
 */
import * as React from "react";
import { fitSize, plate } from "@/components/primitives";

export interface TemplateData {
  img: string;
  title: string;
  subtitle?: string;
  date?: string;
}

export function ImageLed({ data }: { data: TemplateData }) {
  const { img, title, subtitle, date } = data;
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Full-bleed photo + legibility wash */}
      <div className="absolute inset-0">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-base-card" />
        )}
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-base via-base/35 to-base/5" />
        <span aria-hidden className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-base/60 to-transparent" />
      </div>

      {/* Title block pinned to the bottom */}
      <div className="relative z-10 mt-auto flex flex-col items-start gap-[2cqmin] p-[5cqmin]">
        {date && (
          <span
            className="-rotate-1 bg-accent px-[2cqmin] py-[1cqmin] font-display uppercase leading-none text-[color:rgb(var(--c-base))]"
            style={{ ...plate("rgb(var(--c-bone))"), fontSize: "2.8cqmin" }}
          >
            {date}
          </span>
        )}
        <h1
          className="font-display uppercase leading-[0.85] text-bone"
          style={{ fontSize: `${fitSize(title, 17)}cqmin` }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="font-mono uppercase leading-none tracking-[0.15em] text-bone-dim"
            style={{ fontSize: "2.4cqmin" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
