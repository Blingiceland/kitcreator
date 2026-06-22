/**
 * Sponsor lockup — two reserved strips (top: lead pair; bottom: all together).
 * Sponsors come from the project (no defaults — blank until the user adds them).
 * v0 renders them as text wordmarks; logo-art upload comes next. cqmin-sized.
 */
import * as React from "react";

function Wordmark({ text, h }: { text: string; h: number }) {
  return (
    <span className="font-display uppercase leading-none text-bone" style={{ fontSize: `${h}cqmin` }}>
      {text}
    </span>
  );
}

export function SponsorTop({ sponsors }: { sponsors: string[] }) {
  if (sponsors.length === 0) return null;
  const [lead, ...rest] = sponsors;
  return (
    <div className="relative z-[45] flex items-center justify-between gap-[4cqmin] border-b-[0.35cqmin] border-bone px-[5cqmin] py-[2.4cqmin]">
      <Wordmark text={lead} h={4.6} />
      <div className="flex items-center gap-[3cqmin]">{rest[0] && <Wordmark text={rest[0]} h={4.6} />}</div>
    </div>
  );
}

export function SponsorBottom({ sponsors }: { sponsors: string[] }) {
  if (sponsors.length === 0) return null;
  return (
    <div className="relative z-[45] flex flex-wrap items-center justify-center gap-x-[3.4cqmin] gap-y-[1cqmin] border-t-[0.35cqmin] border-bone px-[5cqmin] py-[2.4cqmin]">
      {sponsors.map((s, i) => (
        <React.Fragment key={`${s}-${i}`}>
          {i > 0 && <span aria-hidden className="shrink-0 bg-bone" style={{ height: "3cqmin", width: "0.3cqmin" }} />}
          <Wordmark text={s} h={3} />
        </React.Fragment>
      ))}
    </div>
  );
}
