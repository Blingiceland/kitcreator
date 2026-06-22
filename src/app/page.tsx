"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { CHANNELS, BRAND, PRESETS, getPreset, type ChannelDef, type StylePreset } from "@/lib/kit";
import { TemplateFrame } from "@/components/template-frame";
import { ImageLed } from "@/components/templates/image-led";

type Theme = "light" | "dark";

const TEST_IMG = "/test-image.jpg";

export default function Builder() {
  const [title, setTitle] = React.useState("Bandið þitt");
  const [subtitle, setSubtitle] = React.useState("Dillon · Reykjavík");
  const [date, setDate] = React.useState("4. júlí 2026");
  const [stillId, setStillId] = React.useState(PRESETS[0].id);
  const [theme, setTheme] = React.useState<Theme>("light");
  const [previewId, setPreviewId] = React.useState(CHANNELS[0].id);

  const preset = getPreset(stillId);
  const previewChannel = CHANNELS.find((c) => c.id === previewId) ?? CHANNELS[0];
  const data = { img: TEST_IMG, title, subtitle, date };

  function downloadUrl(channel: ChannelDef, ext: "png" | "jpeg" | "pdf") {
    const p = new URLSearchParams({ template: "image-led", channel: channel.id, still: stillId, thema: theme, ext, title });
    if (subtitle) p.set("subtitle", subtitle);
    if (date) p.set("date", date);
    return `/api/render?${p.toString()}`;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{BRAND.name} · v0</p>
        <h1 className="font-display text-4xl uppercase leading-none text-bone sm:text-6xl">Kitcreator</h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-bone-dim">{BRAND.tagline}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        {/* Controls */}
        <div className="flex flex-col gap-6">
          <Field label="Titill" value={title} onChange={setTitle} />
          <Field label="Undirtitill" value={subtitle} onChange={setSubtitle} />
          <Field label="Dagsetning" value={date} onChange={setDate} />

          <Control label="Lúkk">
            {PRESETS.map((pr) => (
              <Pill key={pr.id} active={stillId === pr.id} onClick={() => setStillId(pr.id)}>
                {pr.name}
              </Pill>
            ))}
          </Control>

          <Control label="Þema">
            <Pill active={theme === "light"} onClick={() => setTheme("light")}>Ljóst</Pill>
            <Pill active={theme === "dark"} onClick={() => setTheme("dark")}>Dökkt</Pill>
          </Control>

          <Control label="Forskoða snið">
            {CHANNELS.map((c) => (
              <Pill key={c.id} active={previewId === c.id} onClick={() => setPreviewId(c.id)}>
                {c.label}
              </Pill>
            ))}
          </Control>

          <p className="max-w-md font-mono text-[11px] leading-relaxed text-bone-faint">
            v0 notar fasta test-mynd. Upphlað á eigin mynd kemur í Áfanga 2.
          </p>
        </div>

        {/* Preview */}
        <div className="flex justify-center lg:justify-end">
          <Preview channel={previewChannel} preset={preset} theme={theme} data={data} />
        </div>
      </div>

      {/* The kit — every channel, downloadable */}
      <section className="mt-14">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent">Sækja settið</h2>
        <div className="overflow-hidden border-2 border-bone">
          {CHANNELS.map((c, i) => (
            <div
              key={c.id}
              className={"flex flex-wrap items-center justify-between gap-3 px-4 py-3 " + (i % 2 ? "bg-base-card" : "")}
            >
              <div className="font-mono text-xs uppercase tracking-widest text-bone">
                {c.label} <span className="text-bone-faint">· {c.w}×{c.h}</span>
              </div>
              <div className="flex gap-2">
                {(["png", "jpeg", "pdf"] as const).map((ext) => (
                  <a
                    key={ext}
                    href={downloadUrl(c, ext)}
                    className="inline-flex items-center gap-1.5 border-2 border-bone bg-bone px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[color:rgb(var(--c-base))] transition-colors hover:border-accent hover:bg-accent"
                  >
                    <Download size={12} /> {ext}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-bone-faint">
          Hvert niðurhal rendrast í hárri upplausn með headless Chrome (~5–11s).
        </p>
      </section>
    </main>
  );
}

/* ---------- small UI bits ---------- */

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full max-w-md border-2 border-bone bg-base px-3 font-mono text-sm text-bone outline-none focus:border-accent"
      />
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors " +
        (active ? "border-accent bg-accent text-[color:rgb(var(--c-base))]" : "border-bone text-bone hover:bg-base-card")
      }
    >
      {children}
    </button>
  );
}

function Preview({
  channel,
  preset,
  theme,
  data,
}: {
  channel: ChannelDef;
  preset: StylePreset;
  theme: Theme;
  data: { img: string; title: string; subtitle: string; date: string };
}) {
  const previewW = 340;
  const scale = previewW / channel.w;
  return (
    <div className="shrink-0 border-2 border-bone" style={{ width: channel.w * scale, height: channel.h * scale }}>
      <div style={{ width: channel.w, height: channel.h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <TemplateFrame channel={channel} preset={preset} theme={theme}>
          <ImageLed data={data} preset={preset} />
        </TemplateFrame>
      </div>
    </div>
  );
}
