/**
 * Sponsor lockup — two reserved strips (top: lead pair; bottom: all together).
 * Each sponsor is an uploaded transparent logo or, failing that, a text
 * wordmark. Sponsors come from the project (no defaults — blank until added).
 * cqmin-sized so the strips stay sane in any aspect.
 */
import * as React from "react";
import type { SponsorItem } from "@/lib/kit";

function Mark({ item, h }: { item: SponsorItem; h: number }) {
  if (item.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.logo} alt={item.name ?? ""} style={{ height: `${h}cqmin`, width: "auto", objectFit: "contain" }} />;
  }
  return (
    <span className="font-display uppercase leading-none text-bone" style={{ fontSize: `${h}cqmin` }}>
      {item.name}
    </span>
  );
}

export function SponsorTop({ sponsors }: { sponsors: SponsorItem[] }) {
  if (sponsors.length === 0) return null;
  const [lead, ...rest] = sponsors;
  return (
    <div className="relative z-[45] flex items-center justify-between gap-[4cqmin] border-b-[0.35cqmin] border-bone px-[5cqmin] py-[2.4cqmin]">
      <Mark item={lead} h={4.6} />
      <div className="flex items-center gap-[3cqmin]">{rest[0] && <Mark item={rest[0]} h={4.6} />}</div>
    </div>
  );
}

export function SponsorBottom({ sponsors }: { sponsors: SponsorItem[] }) {
  if (sponsors.length === 0) return null;
  return (
    <div className="relative z-[45] flex flex-wrap items-center justify-center gap-x-[3.4cqmin] gap-y-[1cqmin] border-t-[0.35cqmin] border-bone px-[5cqmin] py-[2.4cqmin]">
      {sponsors.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span aria-hidden className="shrink-0 bg-bone" style={{ height: "3cqmin", width: "0.3cqmin" }} />}
          <Mark item={s} h={3} />
        </React.Fragment>
      ))}
    </div>
  );
}
