/**
 * Shared print-craft primitives — xerox edge warp, off-register plates, grain,
 * halftone, and a text auto-fit helper. Render fully in headless Chrome.
 */
import * as React from "react";

export const xerox = { filter: "url(#xerox)" } as const;

/** Off-register colour plate behind a box (the misaligned second screen). */
export const plate = (ink: string) =>
  ({ filter: "url(#xerox)", boxShadow: `0.05em 0.06em 0 ${ink}` }) as const;

/** Worn-xerox displacement filter. Mount once per rendered frame (global id). */
export function Filters() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
      <filter id="xerox">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.026" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

/** Fractal-noise grain scoped to the frame (multiply on light, screen on dark).
 * `soft` dials the intensity right down for subtler looks. */
export function Grain({ soft = false }: { soft?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={
        "pointer-events-none absolute inset-0 z-50 mix-blend-multiply [[data-theme=dark]_&]:mix-blend-screen " +
        (soft
          ? "opacity-[0.12] [[data-theme=dark]_&]:opacity-[0.06]"
          : "opacity-40 [[data-theme=dark]_&]:opacity-[0.14]")
      }
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/** Halftone dot field overlay. */
export function Halftone({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={"halftone pointer-events-none absolute inset-0 " + className} />;
}

/** Largest font size (in container units) at which the longest word still fits.
 * Archivo Black is wide (~0.82em/char caps). Returns a unitless number. */
export function fitSize(text: string, maxUnits: number, budget = 78): number {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length), 1);
  return Math.min(maxUnits, Math.floor(budget / (longest * 0.82)));
}
