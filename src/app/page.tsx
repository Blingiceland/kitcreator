"use client";

import * as React from "react";
import { Download, X, Plus, Upload, ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  CHANNELS,
  FONTS,
  DEFAULT_LOOK,
  buildStyle,
  type ChannelDef,
  type BrandColors,
  type SponsorItem,
  type TextureKind,
  type BoxStyle,
} from "@/lib/kit";
import { tripletToHex, hexToTriplet } from "@/lib/colors";
import { TemplateFrame } from "@/components/template-frame";
import { ImageLed } from "@/components/templates/image-led";

const STEPS = ["Viðburður", "Mynd", "Litir", "Letur", "Lógó & sponsorar", "Klárt"];

const QUICK_PALETTES: { name: string; c: BrandColors }[] = [
  { name: "Hreint", c: { base: "248 248 246", ink: "24 24 27", accent: "37 99 235", accent2: "16 185 129" } },
  { name: "Nótt", c: { base: "12 12 16", ink: "240 240 245", accent: "0 200 180", accent2: "255 90 160" } },
  { name: "Hlýtt", c: { base: "245 240 232", ink: "30 24 20", accent: "200 80 50", accent2: "210 150 60" } },
  { name: "Mónó", c: { base: "255 255 255", ink: "17 17 17", accent: "17 17 17", accent2: "120 120 120" } },
];

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("upload failed");
  const { url } = await res.json();
  return url as string;
}

export default function Wizard() {
  const [step, setStep] = React.useState(0);

  // content
  const [event, setEvent] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [date, setDate] = React.useState("");

  // assets
  const [img, setImg] = React.useState("");
  const [logo, setLogo] = React.useState("");
  const [sponsors, setSponsors] = React.useState<SponsorItem[]>([]);
  const [sponsorName, setSponsorName] = React.useState("");

  // look (neutral defaults — deliberately not silkscreen)
  const [colors, setColors] = React.useState<BrandColors>(DEFAULT_LOOK.colors);
  const [fonts, setFonts] = React.useState(DEFAULT_LOOK.fonts);
  const [texture, setTexture] = React.useState<TextureKind>(DEFAULT_LOOK.texture);
  const [boxStyle, setBoxStyle] = React.useState<BoxStyle>(DEFAULT_LOOK.boxStyle);
  const [titleCase, setTitleCase] = React.useState<"upper" | "normal">(DEFAULT_LOOK.titleCase);

  const [previewId, setPreviewId] = React.useState(CHANNELS[0].id);
  const previewChannel = CHANNELS.find((c) => c.id === previewId) ?? CHANNELS[0];

  const style = buildStyle({ colors, fonts, texture, boxStyle, titleCase });
  const data = { img, logo, event, title, subtitle, date };

  function downloadUrl(channel: ChannelDef, ext: "png" | "jpeg" | "pdf") {
    const p = new URLSearchParams({
      template: "image-led",
      channel: channel.id,
      ext,
      base: colors.base, ink: colors.ink, accent: colors.accent, accent2: colors.accent2,
      fdisp: fonts.display, fbody: fonts.body,
      tex: texture, box: boxStyle, case: titleCase,
    });
    if (event) p.set("event", event);
    if (title) p.set("title", title);
    if (subtitle) p.set("subtitle", subtitle);
    if (date) p.set("date", date);
    if (img) p.set("img", img);
    if (logo) p.set("logo", logo);
    if (sponsors.length) p.set("sponsors", JSON.stringify(sponsors));
    return `/api/render?${p.toString()}`;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Creator kit · v0</p>
        <h1 className="font-display text-3xl uppercase leading-none text-bone sm:text-5xl">Kitcreator</h1>
      </header>

      {/* Stepper */}
      <ol className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={
                "flex items-center gap-2 border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors " +
                (i === step ? "border-accent bg-accent text-[color:rgb(var(--c-base))]" : i < step ? "border-bone text-bone" : "border-bone/40 text-bone-faint")
              }
            >
              <span className="tabular-nums">{i + 1}</span> {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        {/* Step panel */}
        <div className="flex flex-col gap-6">
          {step === 0 && (
            <Panel title="Viðburður">
              <Field label="Nafn viðburðar" value={event} onChange={setEvent} placeholder="t.d. Jónsmessuhátíð" />
              <Field label="Titill (atriði/efni)" value={title} onChange={setTitle} placeholder="Nafn atriðis" />
              <Field label="Undirtitill" value={subtitle} onChange={setSubtitle} placeholder="Staður · borg" />
              <Field label="Dagsetning" value={date} onChange={setDate} placeholder="21. júní 2026" />
            </Panel>
          )}

          {step === 1 && (
            <Panel title="Aðalmynd">
              <ImageUpload label="Veldu mynd" value={img} onChange={setImg} />
              <p className="font-mono text-[11px] leading-relaxed text-bone-faint">
                Myndin fyllir út í allt settið. Hægt að sleppa — þá kemur hlutlaus bakgrunnur.
              </p>
            </Panel>
          )}

          {step === 2 && (
            <Panel title="Litir">
              <Control label="Fljótval">
                {QUICK_PALETTES.map((q) => (
                  <Pill key={q.name} active={false} onClick={() => setColors(q.c)}>{q.name}</Pill>
                ))}
              </Control>
              <Control label="Sérsníða">
                <Swatch label="Grunnur" value={colors.base} onChange={(v) => setColors({ ...colors, base: v })} />
                <Swatch label="Blek" value={colors.ink} onChange={(v) => setColors({ ...colors, ink: v })} />
                <Swatch label="Áhersla" value={colors.accent} onChange={(v) => setColors({ ...colors, accent: v })} />
                <Swatch label="Áhersla 2" value={colors.accent2} onChange={(v) => setColors({ ...colors, accent2: v })} />
              </Control>
              <Control label="Áferð">
                {(["none", "soft", "grain"] as TextureKind[]).map((t) => (
                  <Pill key={t} active={texture === t} onClick={() => setTexture(t)}>
                    {t === "none" ? "Slétt" : t === "soft" ? "Mjúk" : "Grain"}
                  </Pill>
                ))}
              </Control>
            </Panel>
          )}

          {step === 3 && (
            <Panel title="Letur">
              <FontSelect label="Fyrirsagnir" value={fonts.display} onChange={(v) => setFonts({ ...fonts, display: v })} />
              <FontSelect label="Meginmál / smátt" value={fonts.body} onChange={(v) => setFonts({ ...fonts, body: v })} />
              <Control label="Há-/lágstafir í titli">
                <Pill active={titleCase === "normal"} onClick={() => setTitleCase("normal")}>Eðlilegt</Pill>
                <Pill active={titleCase === "upper"} onClick={() => setTitleCase("upper")}>HÁSTAFIR</Pill>
              </Control>
              <Control label="Box-stíll">
                {(["flat", "outline", "stamp"] as BoxStyle[]).map((b) => (
                  <Pill key={b} active={boxStyle === b} onClick={() => setBoxStyle(b)}>
                    {b === "flat" ? "Flatt" : b === "outline" ? "Útlína" : "Stimpill"}
                  </Pill>
                ))}
              </Control>
            </Panel>
          )}

          {step === 4 && (
            <Panel title="Lógó & sponsorar">
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Lógó viðburðar</p>
                <ImageUpload label="Veldu lógó (gegnsætt PNG)" value={logo} onChange={setLogo} />
              </div>
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Sponsorar</p>
                <div className="flex gap-2">
                  <input
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && sponsorName.trim()) {
                        e.preventDefault();
                        setSponsors([...sponsors, { name: sponsorName.trim() }]);
                        setSponsorName("");
                      }
                    }}
                    placeholder="Nafn styrktaraðila"
                    className="h-11 flex-1 border-2 border-bone bg-base px-3 font-mono text-sm text-bone outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => { if (sponsorName.trim()) { setSponsors([...sponsors, { name: sponsorName.trim() }]); setSponsorName(""); } }}
                    className="inline-flex h-11 items-center gap-1.5 border-2 border-bone bg-bone px-3 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))]"
                  >
                    <Plus size={14} /> Nafn
                  </button>
                  <SponsorLogoButton onAdd={(url) => setSponsors([...sponsors, { logo: url }])} />
                </div>
                {sponsors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sponsors.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-2 border-2 border-bone px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-bone">
                        {s.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.logo} alt="" className="h-4 w-auto" />
                        ) : (
                          s.name
                        )}
                        <button type="button" onClick={() => setSponsors(sponsors.filter((_, j) => j !== i))} aria-label="Fjarlægja">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Panel>
          )}

          {step === 5 && (
            <Panel title="Klárt — sæktu settið">
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
              <p className="font-mono text-[11px] text-bone-faint">Hvert niðurhal rendrast í hárri upplausn (~5–11s).</p>
            </Panel>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="inline-flex items-center gap-2 border-2 border-bone px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-bone transition-colors hover:bg-base-card disabled:opacity-40"
            >
              <ArrowLeft size={14} /> Til baka
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="inline-flex items-center gap-2 border-2 border-accent bg-accent px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))]"
              >
                Áfram <ArrowRight size={14} />
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                <Check size={14} /> Tilbúið
              </span>
            )}
          </div>
        </div>

        {/* Persistent preview */}
        <div className="flex flex-col items-center gap-3 lg:items-end">
          <div className="shrink-0 border-2 border-bone" style={{ width: 340, height: (340 / previewChannel.w) * previewChannel.h }}>
            <div style={{ width: previewChannel.w, height: previewChannel.h, transform: `scale(${340 / previewChannel.w})`, transformOrigin: "top left" }}>
              <TemplateFrame channel={previewChannel} style={style} sponsors={sponsors}>
                <ImageLed data={data} style={style} />
              </TemplateFrame>
            </div>
          </div>
          <div className="flex max-w-[340px] flex-wrap gap-1.5">
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPreviewId(c.id)}
                className={"border px-2 py-1 font-mono text-[9px] uppercase tracking-widest transition-colors " + (previewId === c.id ? "border-accent bg-accent text-[color:rgb(var(--c-base))]" : "border-bone text-bone-dim")}
              >
                {c.label.split(" · ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- UI bits ---------- */

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 border-2 border-bone p-5">
      <p className="font-display text-xl uppercase leading-none text-bone">{title}</p>
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
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{label}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full max-w-xs border-2 border-bone bg-base px-2 font-mono text-sm text-bone outline-none focus:border-accent">
        {FONTS.map((f) => (
          <option key={f.family} value={f.family}>{f.label}</option>
        ))}
      </select>
      <p className="mt-2 text-2xl text-bone" style={{ fontFamily: `'${value}'` }}>Aa Bb Cc 123</p>
    </div>
  );
}

function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      onChange(await uploadFile(f));
    } catch {
      alert("Upphlað mistókst");
    }
    setBusy(false);
  }
  return (
    <div className="flex items-center gap-4">
      <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 border-2 border-bone bg-bone px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))] disabled:opacity-50"
      >
        <Upload size={14} /> {busy ? "Hleð upp…" : value ? "Skipta um" : label}
      </button>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-14 w-14 border-2 border-bone object-cover" />
      )}
    </div>
  );
}

function SponsorLogoButton({ onAdd }: { onAdd: (url: string) => void }) {
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      onAdd(await uploadFile(f));
    } catch {
      alert("Upphlað mistókst");
    }
    setBusy(false);
    if (ref.current) ref.current.value = "";
  }
  return (
    <>
      <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="inline-flex h-11 items-center gap-1.5 border-2 border-bone px-3 font-mono text-[11px] uppercase tracking-widest text-bone disabled:opacity-50"
      >
        <Upload size={14} /> {busy ? "…" : "Lógó"}
      </button>
    </>
  );
}
