/**
 * Sponsor lockup — two reserved strips (top: lead pair; bottom: all together)
 * so they never collide with artwork. v0 renders sponsors as text wordmarks;
 * v1 swaps in logo art. Sized in cqmin so the strips stay sane in any aspect.
 */
import * as React from "react";
import { BRAND } from "@/lib/kit";

function Wordmark({ text, h }: { text: string; h: number }) {
  return (
    <span className="font-display uppercase leading-none text-bone" style={{ fontSize: `${h}cqmin` }}>
      {text}
    </span>
  );
}

export function SponsorTop() {
  const [lead, ...rest] = BRAND.sponsors;
  return (
    <div className="relative z-[45] flex items-center justify-between gap-[4cqmin] border-b-[0.35cqmin] border-bone px-[5cqmin] py-[2.4cqmin]">
      {lead && <Wordmark text={lead} h={4.6} />}
      <div className="flex items-center gap-[3cqmin]">
        {rest[0] && <Wordmark text={rest[0]} h={4.6} />}
      </div>
    </div>
  );
}

export function SponsorBottom() {
  return (
    <div className="relative z-[45] flex flex-wrap items-center justify-center gap-x-[3.4cqmin] gap-y-[1cqmin] border-t-[0.35cqmin] border-bone px-[5cqmin] py-[2.4cqmin]">
      {BRAND.sponsors.map((s, i) => (
        <React.Fragment key={s}>
          {i > 0 && (
            <span aria-hidden className="shrink-0 bg-bone" style={{ height: "3cqmin", width: "0.3cqmin" }} />
          )}
          <Wordmark text={s} h={3} />
        </React.Fragment>
      ))}
    </div>
  );
}
