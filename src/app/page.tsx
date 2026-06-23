"use client";

import * as React from "react";
import Link from "next/link";
import { Settings, ImagePlus, ArrowRight } from "lucide-react";
import { loadProject, type Project } from "@/lib/project";

export default function Home() {
  const [project, setProject] = React.useState<Project | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    setProject(loadProject());
    setLoaded(true);
  }, []);

  const hasProject = Boolean(project?.event);
  const artistCount = project?.days.reduce((n, d) => n + d.artists.length, 0) ?? 0;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Creator kit · v0</p>
      <h1 className="font-display text-4xl uppercase leading-none text-bone sm:text-6xl">Kitcreator</h1>
      <p className="mt-3 max-w-md font-mono text-xs uppercase leading-relaxed tracking-widest text-bone-dim">
        Settu upp viðburð einu sinni — svo búa þú og listamenn til allt efnið, læst í lúkkið.
      </p>

      {loaded && (
        <div className="mt-10 border-2 border-bone p-5">
          {hasProject ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Núverandi verkefni</p>
                <p className="font-display text-2xl uppercase leading-none text-bone">{project!.event}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-bone-dim">
                  {project!.days.length} dagar · {artistCount} atriði · {project!.sponsors.length} sponsorar
                </p>
              </div>
            </div>
          ) : (
            <p className="font-mono text-sm text-bone-dim">Ekkert verkefni enn — byrjaðu á að setja upp viðburð.</p>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/setup" className="group flex flex-col gap-3 border-2 border-bone bg-base-card p-5 transition-colors hover:bg-amber">
          <Settings size={22} className="text-bone" />
          <p className="font-display text-xl uppercase leading-none text-bone">1 · Setja upp</p>
          <p className="font-mono text-[11px] uppercase leading-relaxed tracking-widest text-bone-dim">
            Viðburður · lúkk · assets · dagskrá
          </p>
          <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-accent">
            Opna <ArrowRight size={13} />
          </span>
        </Link>

        <Link
          href="/create"
          className={"group flex flex-col gap-3 border-2 border-bone p-5 transition-colors " + (hasProject ? "bg-base-card hover:bg-amber" : "pointer-events-none opacity-40")}
        >
          <ImagePlus size={22} className="text-bone" />
          <p className="font-display text-xl uppercase leading-none text-bone">2 · Búa til efni</p>
          <p className="font-mono text-[11px] uppercase leading-relaxed tracking-widest text-bone-dim">
            Veldu atriði · mynd · sæktu settið
          </p>
          <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-accent">
            {hasProject ? "Opna" : "Settu fyrst upp"} <ArrowRight size={13} />
          </span>
        </Link>
      </div>
    </main>
  );
}
