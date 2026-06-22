"use client";

import * as React from "react";
import { Download, X, Plus } from "lucide-react";
import {
  CHANNELS,
  PRESETS,
  FONTS,
  getPreset,
  resolveStyle,
  seedColors,
  type ChannelDef,
  type BrandColors,
} from "@/lib/kit";
import { tripletToHex, hexToTriplet } from "@/lib/colors";
import { TemplateFrame } from "@/components/template-frame";
import { ImageLed } from "@/components/templates/image-led";

type Theme = "light" | "dark";
const TEST_IMG = "/test-image.jpg";

export default function Builder() {
  // Content (blank to start)
  const [event, setEvent] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [sponsors, setSponsors] = React.useState<string[]>([]);
  const [sponsorInput, setSponsorInput] = React.useState("");

  // Look
  const [presetId, setPresetId] = React.useState(PRESETS[0].id);
  const [theme, setTheme] = React.useState<Theme>("light");
  const [colors, setColors] = React.useState<BrandColors>(() => seedColors(PRESETS[0].id, "light"));
  const [fonts, setFonts] = React.useState(() => {
    const p = getPreset(PRESETS[0].id);
    return { display: p.fonts.display, body: p.fonts.body };
  });

  // Re-seed palette + fonts when the preset or theme changes.
  React.useEffect(() => {
    setColors(seedColors(presetId, theme));
    const p = getPreset(presetId);
    setFonts({ display: p.fonts.display, body: p.fonts.body });
  }, [presetId, theme]);

  const [previewId, setPreviewId] = React.useState(CHANNELS[0].id);
  const previewChannel = CHANNELS.find((c) => c.id === previewId) ?? CHANNELS[0];

  const style = resolveStyle({ presetId, theme, colors, fonts });
  const data = { img: TEST_IMG, event, title, subtitle, date };

  function addSponsor() {
    const v = sponsorInput.trim();
    if (v) setSponsors([...sponsors, v]);
    setSponsorInput("");
  }

  function downloadUrl(channel: ChannelDef, ext: "png" | "jpeg" | "pdf") {
    const p = new URLSearchParams({
      template: "image-led",
      channel: channel.id,
      still: presetId,
      thema: theme,
      ext,
      base: colors.base,
      ink: colors.ink,
      accent: colors.accent,
      accent2: colors.accent2,
      fdisp: fonts.display,
      fbody: fonts.body,
    });
    if (event) p.set("event", event);
    if (title) p.set("title", title);
    if (subtitle) p.set("subtitle", subtitle);
    if (date) p.set("date", date);
    if (sponsors.length) p.set("sponsors", sponsors.join("|"));
    return `/api/render?${p.toString()}`;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Creator kit · v0</p>
        <h1 className="font-display text-4xl uppercase leading-none text-bone sm:text-6xl">Kitcreator</h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-bone-dim">
          Settu upp viðburðinn þinn — fáðu allt settið.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-8">
          <Section title="Viðburður">
            <Field label="Nafn viðburðar" value={event} onChange={setEvent} placeholder="t.d. Rokk í Reykjavík" />
          </Section>

          <Section title="Efni (þessi mynd)">
            <Field label="Titill" value={title} onChange={setTitle} placeholder="Nafn atriðis" />
            <Field label="Undirtitill" value={subtitle} onChange={setSubtitle} placeholder="Staður · borg" />
            <Field label="Dagsetning" value={date} onChange={setDate} placeholder="4. júlí 2026" />
          </Section>

          <Section title="Sponsorar">
            <div className="flex gap-2">
              <input
                value={sponsorInput}
                onChange={(e) => setSponsorInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSponsor())}
                placeholder="Nafn styrktaraðila"
                className="h-11 flex-1 border-2 border-bone bg-base px-3 font-mono text-sm text-bone outline-none focus:border-accent"
              />
              <button type="button" onClick={addSponsor} className="inline-flex h-11 items-center gap-1.5 border-2 border-bone bg-bone px-3 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))]">
                <Plus size={14} /> Bæta við
              </button>
            </div>
            {sponsors.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sponsors.map((s, i) => (
                  <span key={`${s}-${i}`} className="inline-flex items-center gap-2 border-2 border-bone px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-bone">
                    {s}
                    <button type="button" onClick={() => setSponsors(sponsors.filter((_, j) => j !== i))} aria-label={`Fjarlægja ${s}`}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-bone-faint">
              Texti í v0 · lógó-upphlað (gegnsætt PNG) kemur næst
            </p>
          </Section>

          <Section title="Lúkk">
            <Control label="Preset">
              {PRESETS.map((pr) => (
                <Pill key={pr.id} active={presetId === pr.id} onClick={() => setPresetId(pr.id)}>{pr.name}</Pill>
              ))}
            </Control>
            <Control label="Grunnur">
              <Pill active={theme === "light"} onClick={() => setTheme("light")}>Ljóst</Pill>
              <Pill active={theme === "dark"} onClick={() => setTheme("dark")}>Dökkt</Pill>
            </Control>
            <Control label="Litir">
              <Swatch label="Grunnur" value={colors.base} onChange={(v) => setColors({ ...colors, base: v })} />
              <Swatch label="Blek" value={colors.ink} onChange={(v) => setColors({ ...colors, ink: v })} />
              <Swatch label="Áhersla" value={colors.accent} onChange={(v) => setColors({ ...colors, accent: v })} />
              <Swatch label="Áhersla 2" value={colors.accent2} onChange={(v) => setColors({ ...colors, accent2: v })} />
            </Control>
            <Control label="Letur">
              <FontSelect label="Fyrirsögn" value={fonts.display} onChange={(v) => setFonts({ ...fonts, display: v })} />
              <FontSelect label="Brödtexti" value={fonts.body} onChange={(v) => setFonts({ ...fonts, body: v })} />
            </Control>
          </Section>

          <Control label="Forskoða snið">
            {CHANNELS.map((c) => (
              <Pill key={c.id} active={previewId === c.id} onClick={() => setPreviewId(c.id)}>{c.label}</Pill>
            ))}
          </Control>
          <p className="max-w-md font-mono text-[11px] leading-relaxed text-bone-faint">
            v0 notar fasta test-mynd. Upphlað á eigin mynd kemur í Áfanga 2.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="shrink-0 border-2 border-bone" style={{ width: 340, height: (340 / previewChannel.w) * previewChannel.h }}>
            <div style={{ width: previewChannel.w, height: previewChannel.h, transform: `scale(${340 / previewChannel.w})`, transformOrigin: "top left" }}>
              <TemplateFrame channel={previewChannel} style={style} sponsors={sponsors}>
                <ImageLed data={data} style={style} />
              </TemplateFrame>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent">Sækja settið</h2>
        <div className="overflow-hidden border-2 border-bone">
          {CHANNELS.map((c, i) => (
            <div key={c.id} className={"flex flex-wrap items-center justify-between gap-3 px-4 py-3 " + (i % 2 ? "bg-base-card" : "")}>
              <div className="font-mono text-xs uppercase tracking-widest text-bone">
                {c.label} <span className="text-bone-faint">· {c.w}×{c.h}</span>
              </div>
              <div className="flex gap-2">
                {(["png", "jpeg", "pdf"] as const).map((ext) => (
                  <a key={ext} href={downloadUrl(c, ext)} className="inline-flex items-center gap-1.5 border-2 border-bone bg-bone px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[color:rgb(var(--c-base))] transition-colors hover:border-accent hover:bg-accent">
                    <Download size={12} /> {ext}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ---------- UI bits ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-2 border-bone p-5">
      <p className="font-display text-lg uppercase leading-none text-bone">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full border-2 border-bone bg-base px-3 font-mono text-sm text-bone outline-none placeholder:text-bone-faint focus:border-accent"
      />
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={"border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors " + (active ? "border-accent bg-accent text-[color:rgb(var(--c-base))]" : "border-bone text-bone hover:bg-base-card")}
    >
      {children}
    </button>
  );
}

function Swatch({ label, value, onChange }: { label: string; value: string; onChange: (triplet: string) => void }) {
  return (
    <label className="flex items-center gap-2 border-2 border-bone px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-bone">
      <input type="color" value={tripletToHex(value)} onChange={(e) => onChange(hexToTriplet(e.target.value))} className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0" />
      {label}
    </label>
  );
}

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-bone-dim">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="border-2 border-bone bg-base px-2 py-1 font-mono text-[11px] text-bone outline-none focus:border-accent">
        {FONTS.map((f) => (
          <option key={f.family} value={f.family}>{f.label}</option>
        ))}
      </select>
    </label>
  );
}
