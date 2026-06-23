"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X, Plus, Trash2 } from "lucide-react";
import {
  CHANNELS,
  TEMPLATES,
  TEMPLATE_LABELS,
  buildStyle,
  type BrandColors,
  type TextureKind,
  type BoxStyle,
} from "@/lib/kit";
import { loadProject, saveProject, uid, EMPTY_PROJECT, type Project, type SchedDay } from "@/lib/project";
import { Panel, Field, Control, Pill, Swatch, FontSelect, ImageUpload, SponsorLogoButton } from "@/components/ui";
import { TemplateFrame } from "@/components/template-frame";
import { getTemplateComponent } from "@/components/templates/registry";

const QUICK_PALETTES: { name: string; c: BrandColors }[] = [
  { name: "Hreint", c: { base: "248 248 246", ink: "24 24 27", accent: "37 99 235", accent2: "16 185 129" } },
  { name: "Nótt", c: { base: "12 12 16", ink: "240 240 245", accent: "0 200 180", accent2: "255 90 160" } },
  { name: "Hlýtt", c: { base: "245 240 232", ink: "30 24 20", accent: "200 80 50", accent2: "210 150 60" } },
  { name: "Mónó", c: { base: "255 255 255", ink: "17 17 17", accent: "17 17 17", accent2: "120 120 120" } },
];

export default function Setup() {
  const [project, setProject] = React.useState<Project>(EMPTY_PROJECT);
  const [loaded, setLoaded] = React.useState(false);
  const [previewId, setPreviewId] = React.useState(CHANNELS[0].id);

  React.useEffect(() => {
    setProject(loadProject() ?? EMPTY_PROJECT);
    setLoaded(true);
  }, []);

  // Persist on every change (after initial load).
  React.useEffect(() => {
    if (loaded) saveProject(project);
  }, [project, loaded]);

  const set = <K extends keyof Project,>(k: K, v: Project[K]) => setProject((p) => ({ ...p, [k]: v }));
  const setColor = (k: keyof BrandColors, v: string) => setProject((p) => ({ ...p, colors: { ...p.colors, [k]: v } }));

  // schedule helpers
  const addDay = () => set("days", [...project.days, { id: uid(), date: "", artists: [] }]);
  const updateDay = (id: string, patch: Partial<SchedDay>) => set("days", project.days.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const removeDay = (id: string) => set("days", project.days.filter((d) => d.id !== id));
  const addArtist = (dayId: string) =>
    set("days", project.days.map((d) => (d.id === dayId ? { ...d, artists: [...d.artists, { id: uid(), name: "", venue: "", time: "" }] } : d)));
  const updateArtist = (dayId: string, aid: string, patch: Partial<{ name: string; venue: string; time: string }>) =>
    set("days", project.days.map((d) => (d.id === dayId ? { ...d, artists: d.artists.map((a) => (a.id === aid ? { ...a, ...patch } : a)) } : d)));
  const removeArtist = (dayId: string, aid: string) =>
    set("days", project.days.map((d) => (d.id === dayId ? { ...d, artists: d.artists.filter((a) => a.id !== aid) } : d)));

  const style = buildStyle({ colors: project.colors, fonts: project.fonts, texture: project.texture, boxStyle: project.boxStyle, titleCase: project.titleCase });
  const sampleArtist = project.days.flatMap((d) => d.artists)[0];
  const sampleDay = project.days.find((d) => d.artists.some((a) => a.id === sampleArtist?.id));
  const previewData = {
    img: "",
    event: project.event,
    title: sampleArtist?.name || "Sýnishorn",
    subtitle: sampleArtist ? [sampleArtist.venue, sampleArtist.time].filter(Boolean).join(" · ") : "Staður · tími",
    date: sampleDay?.date || "",
  };
  const previewChannel = CHANNELS.find((c) => c.id === previewId) ?? CHANNELS[0];
  const Template = getTemplateComponent(project.templateId);

  if (!loaded) return null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-bone-dim hover:text-bone">
          <ArrowLeft size={14} /> Heim
        </Link>
        <Link href="/create" className="inline-flex items-center gap-2 border-2 border-accent bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))]">
          Búa til efni <ArrowRight size={14} />
        </Link>
      </div>
      <h1 className="mb-8 font-display text-3xl uppercase leading-none text-bone sm:text-5xl">Setja upp viðburð</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-6">
          <Panel title="1 · Viðburður">
            <Field label="Nafn viðburðar" value={project.event} onChange={(v) => set("event", v)} placeholder="t.d. Iceland Airwaves 2026" />
          </Panel>

          <Panel title="2 · Lúkk (læst í Create)">
            <Control label="Fljótval litir">
              {QUICK_PALETTES.map((q) => (
                <Pill key={q.name} active={false} onClick={() => set("colors", q.c)}>{q.name}</Pill>
              ))}
            </Control>
            <Control label="Litir">
              <Swatch label="Grunnur" value={project.colors.base} onChange={(v) => setColor("base", v)} />
              <Swatch label="Blek" value={project.colors.ink} onChange={(v) => setColor("ink", v)} />
              <Swatch label="Áhersla" value={project.colors.accent} onChange={(v) => setColor("accent", v)} />
              <Swatch label="Áhersla 2" value={project.colors.accent2} onChange={(v) => setColor("accent2", v)} />
            </Control>
            <FontSelect label="Fyrirsagnir" value={project.fonts.display} onChange={(v) => set("fonts", { ...project.fonts, display: v })} />
            <FontSelect label="Meginmál" value={project.fonts.body} onChange={(v) => set("fonts", { ...project.fonts, body: v })} />
            <Control label="Áferð">
              {(["none", "soft", "grain"] as TextureKind[]).map((t) => (
                <Pill key={t} active={project.texture === t} onClick={() => set("texture", t)}>{t === "none" ? "Slétt" : t === "soft" ? "Mjúk" : "Grain"}</Pill>
              ))}
            </Control>
            <Control label="Box-stíll">
              {(["flat", "outline", "stamp"] as BoxStyle[]).map((b) => (
                <Pill key={b} active={project.boxStyle === b} onClick={() => set("boxStyle", b)}>{b === "flat" ? "Flatt" : b === "outline" ? "Útlína" : "Stimpill"}</Pill>
              ))}
            </Control>
            <Control label="Titill">
              <Pill active={project.titleCase === "normal"} onClick={() => set("titleCase", "normal")}>Eðlilegt</Pill>
              <Pill active={project.titleCase === "upper"} onClick={() => set("titleCase", "upper")}>HÁSTAFIR</Pill>
            </Control>
            <Control label="Sjálfgefið sniðmát">
              {TEMPLATES.map((t) => (
                <Pill key={t} active={project.templateId === t} onClick={() => set("templateId", t)}>{TEMPLATE_LABELS[t]}</Pill>
              ))}
            </Control>
          </Panel>

          <Panel title="3 · Assets">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Lógó viðburðar</p>
              <ImageUpload label="Veldu lógó (gegnsætt PNG)" value={project.logo} onChange={(v) => set("logo", v)} />
            </div>
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Sponsor-lógó / nöfn</p>
              <SponsorRow project={project} setProject={setProject} />
            </div>
          </Panel>

          <Panel title="4 · Dagskrá">
            {project.days.length === 0 && <p className="font-mono text-[11px] text-bone-faint">Engir dagar enn.</p>}
            {project.days.map((d, di) => (
              <div key={d.id} className="border-2 border-bone p-4">
                <div className="mb-3 flex items-center gap-2">
                  <input
                    value={d.date}
                    onChange={(e) => updateDay(d.id, { date: e.target.value })}
                    placeholder={`Dagur ${di + 1} — t.d. Fim 6. nóv`}
                    className="h-10 flex-1 border-2 border-bone bg-base px-3 font-mono text-sm text-bone outline-none focus:border-accent"
                  />
                  <button type="button" onClick={() => removeDay(d.id)} className="border-2 border-bone p-2 text-bone-dim hover:text-bone" aria-label="Eyða degi">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {d.artists.map((a) => (
                    <div key={a.id} className="flex flex-wrap gap-2">
                      <input value={a.name} onChange={(e) => updateArtist(d.id, a.id, { name: e.target.value })} placeholder="Atriði" className="h-9 flex-1 border-2 border-bone bg-base px-2 font-mono text-xs text-bone outline-none focus:border-accent" />
                      <input value={a.venue} onChange={(e) => updateArtist(d.id, a.id, { venue: e.target.value })} placeholder="Venue" className="h-9 w-28 border-2 border-bone bg-base px-2 font-mono text-xs text-bone outline-none focus:border-accent" />
                      <input value={a.time} onChange={(e) => updateArtist(d.id, a.id, { time: e.target.value })} placeholder="kl." className="h-9 w-16 border-2 border-bone bg-base px-2 font-mono text-xs text-bone outline-none focus:border-accent" />
                      <button type="button" onClick={() => removeArtist(d.id, a.id)} className="px-1 text-bone-dim hover:text-bone" aria-label="Eyða atriði"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => addArtist(d.id)} className="mt-3 inline-flex items-center gap-1.5 border-2 border-bone px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-bone"><Plus size={12} /> Atriði</button>
              </div>
            ))}
            <button type="button" onClick={addDay} className="inline-flex items-center gap-1.5 self-start border-2 border-accent bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))]"><Plus size={14} /> Bæta við degi</button>
          </Panel>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-3 lg:items-end">
          <p className="font-mono text-[10px] uppercase tracking-widest text-bone-faint">Sýnishorn af lúkki</p>
          <div className="shrink-0 border-2 border-bone" style={{ width: 320, height: (320 / previewChannel.w) * previewChannel.h }}>
            <div style={{ width: previewChannel.w, height: previewChannel.h, transform: `scale(${320 / previewChannel.w})`, transformOrigin: "top left" }}>
              <TemplateFrame channel={previewChannel} style={style} sponsors={project.sponsors}>
                <Template data={previewData} style={style} />
              </TemplateFrame>
            </div>
          </div>
          <div className="flex max-w-[320px] flex-wrap gap-1.5">
            {CHANNELS.map((c) => (
              <button key={c.id} type="button" onClick={() => setPreviewId(c.id)} className={"border px-2 py-1 font-mono text-[9px] uppercase tracking-widest " + (previewId === c.id ? "border-accent bg-accent text-[color:rgb(var(--c-base))]" : "border-bone text-bone-dim")}>
                {c.label.split(" · ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function SponsorRow({ project, setProject }: { project: Project; setProject: React.Dispatch<React.SetStateAction<Project>> }) {
  const [name, setName] = React.useState("");
  const add = () => {
    if (name.trim()) {
      setProject((p) => ({ ...p, sponsors: [...p.sponsors, { name: name.trim() }] }));
      setName("");
    }
  };
  return (
    <>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Nafn styrktaraðila" className="h-11 flex-1 border-2 border-bone bg-base px-3 font-mono text-sm text-bone outline-none focus:border-accent" />
        <button type="button" onClick={add} className="inline-flex h-11 items-center gap-1.5 border-2 border-bone bg-bone px-3 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))]"><Plus size={14} /> Nafn</button>
        <SponsorLogoButton onAdd={(url) => setProject((p) => ({ ...p, sponsors: [...p.sponsors, { logo: url }] }))} />
      </div>
      {project.sponsors.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.sponsors.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-2 border-2 border-bone px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-bone">
              {s.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.logo} alt="" className="h-4 w-auto" />
              ) : (
                s.name
              )}
              <button type="button" onClick={() => setProject((p) => ({ ...p, sponsors: p.sponsors.filter((_, j) => j !== i) }))} aria-label="Fjarlægja"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
