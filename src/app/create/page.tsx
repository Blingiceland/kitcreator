"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Lock } from "lucide-react";
import { CHANNELS, TEMPLATES, TEMPLATE_LABELS, buildStyle, type ChannelDef, type TemplateId } from "@/lib/kit";
import { loadProject, styleParams, type Project } from "@/lib/project";
import { Panel, Field, Control, Pill, ImageUpload, FocalPicker } from "@/components/ui";
import { TemplateFrame } from "@/components/template-frame";
import { getTemplateComponent } from "@/components/templates/registry";

export default function Create() {
  const [project, setProject] = React.useState<Project | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  const [selectedId, setSelectedId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [img, setImg] = React.useState("");
  const [imgPos, setImgPos] = React.useState("50% 50%");
  const [templateId, setTemplateId] = React.useState<TemplateId>("image-led");
  const [previewId, setPreviewId] = React.useState(CHANNELS[0].id);

  React.useEffect(() => {
    const p = loadProject();
    setProject(p);
    if (p) setTemplateId(p.templateId);
    setLoaded(true);
  }, []);

  const allArtists = React.useMemo(
    () => (project?.days ?? []).flatMap((d) => d.artists.map((a) => ({ ...a, dayDate: d.date }))),
    [project]
  );

  function selectArtist(id: string) {
    setSelectedId(id);
    const a = allArtists.find((x) => x.id === id);
    if (a) {
      setTitle(a.name);
      setSubtitle([a.venue, a.time].filter(Boolean).join(" · "));
      setDate(a.dayDate);
    }
  }

  if (loaded && !project?.event) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <h1 className="font-display text-3xl uppercase text-bone">Ekkert verkefni</h1>
        <p className="mt-3 font-mono text-sm text-bone-dim">Settu fyrst upp viðburð.</p>
        <Link href="/setup" className="mt-6 inline-flex border-2 border-accent bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))]">Setja upp</Link>
      </main>
    );
  }
  if (!loaded || !project) return null;

  const style = buildStyle({ colors: project.colors, fonts: project.fonts, texture: project.texture, boxStyle: project.boxStyle, titleCase: project.titleCase });
  const data = { img, imgPos, logo: project.logo, event: project.event, title, subtitle, date };
  const previewChannel = CHANNELS.find((c) => c.id === previewId) ?? CHANNELS[0];
  const Template = getTemplateComponent(templateId);

  function contentParams() {
    const p = new URLSearchParams({ ...styleParams(project!), event: project!.event });
    if (title) p.set("title", title);
    if (subtitle) p.set("subtitle", subtitle);
    if (date) p.set("date", date);
    if (img) { p.set("img", img); p.set("pos", imgPos); }
    if (project!.logo) p.set("logo", project!.logo);
    if (project!.sponsors.length) p.set("sponsors", JSON.stringify(project!.sponsors));
    return p;
  }
  function dl(channel: ChannelDef, ext: "png" | "jpeg" | "pdf") {
    const p = contentParams();
    p.set("template", templateId);
    p.set("channel", channel.id);
    p.set("ext", ext);
    return `/api/render?${p.toString()}`;
  }
  function zip() {
    const p = contentParams();
    p.set("template", templateId);
    return `/api/kit?${p.toString()}`;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-bone-dim hover:text-bone"><ArrowLeft size={14} /> Heim</Link>
        <Link href="/setup" className="font-mono text-[11px] uppercase tracking-widest text-bone-dim hover:text-bone">Breyta uppsetningu</Link>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{project.event}</p>
      <h1 className="mb-8 font-display text-3xl uppercase leading-none text-bone sm:text-5xl">Búa til efni</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-6">
          <Panel title="Veldu atriði">
            {allArtists.length > 0 ? (
              <select
                value={selectedId}
                onChange={(e) => selectArtist(e.target.value)}
                className="h-11 w-full border-2 border-bone bg-base px-3 font-mono text-sm text-bone outline-none focus:border-accent"
              >
                <option value="">— Sérsniðið / handvirkt —</option>
                {project.days.map((d) => (
                  <optgroup key={d.id} label={d.date || "Dagur"}>
                    {d.artists.map((a) => (
                      <option key={a.id} value={a.id}>{a.name || "(nafnlaust)"}{a.time ? ` · ${a.time}` : ""}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <p className="font-mono text-[11px] text-bone-faint">Engin dagskrá enn — sláðu inn handvirkt eða bættu við í uppsetningu.</p>
            )}
            <Field label="Titill" value={title} onChange={setTitle} placeholder="Nafn atriðis" />
            <Field label="Undirtitill" value={subtitle} onChange={setSubtitle} placeholder="Venue · tími" />
            <Field label="Dagsetning" value={date} onChange={setDate} placeholder="Fim 6. nóv" />
          </Panel>

          <Panel title="Mynd">
            <ImageUpload label="Veldu mynd" value={img} onChange={(u) => { setImg(u); setImgPos("50% 50%"); }} />
            {img && (
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Fókuspunktur</p>
                <FocalPicker src={img} pos={imgPos} onChange={setImgPos} />
              </div>
            )}
          </Panel>

          <Panel title="Sniðmát">
            <Control label="Útlit">
              {TEMPLATES.map((t) => (
                <Pill key={t} active={templateId === t} onClick={() => setTemplateId(t)}>{TEMPLATE_LABELS[t]}</Pill>
              ))}
            </Control>
            <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-bone-faint">
              <Lock size={11} /> Litir, letur og sponsorar eru læst í lúkk verkefnisins
            </p>
          </Panel>

          <Panel title="Sæktu">
            <a href={zip()} className="inline-flex items-center gap-2 self-start border-2 border-accent bg-accent px-5 py-3 font-display text-sm uppercase tracking-wide text-[color:rgb(var(--c-base))]">
              <Download size={16} /> Sækja allt settið (ZIP)
            </a>
            <div className="overflow-hidden border-2 border-bone">
              {CHANNELS.map((c, i) => (
                <div key={c.id} className={"flex flex-wrap items-center justify-between gap-3 px-4 py-3 " + (i % 2 ? "bg-base-card" : "")}>
                  <div className="font-mono text-xs uppercase tracking-widest text-bone">{c.label}</div>
                  <div className="flex gap-2">
                    {(["png", "jpeg", "pdf"] as const).map((ext) => (
                      <a key={ext} href={dl(c, ext)} className="inline-flex items-center gap-1.5 border-2 border-bone bg-bone px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[color:rgb(var(--c-base))] hover:border-accent hover:bg-accent">
                        <Download size={12} /> {ext}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="flex flex-col items-center gap-3 lg:items-end">
          <div className="flex max-w-[340px] flex-wrap gap-1.5 self-start lg:self-end">
            {TEMPLATES.map((t) => (
              <button key={t} type="button" onClick={() => setTemplateId(t)} className={"border-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest " + (templateId === t ? "border-accent bg-accent text-[color:rgb(var(--c-base))]" : "border-bone text-bone")}>{TEMPLATE_LABELS[t]}</button>
            ))}
          </div>
          <div className="shrink-0 border-2 border-bone" style={{ width: 340, height: (340 / previewChannel.w) * previewChannel.h }}>
            <div style={{ width: previewChannel.w, height: previewChannel.h, transform: `scale(${340 / previewChannel.w})`, transformOrigin: "top left" }}>
              <TemplateFrame channel={previewChannel} style={style} sponsors={project.sponsors}>
                <Template data={data} style={style} />
              </TemplateFrame>
            </div>
          </div>
          <div className="flex max-w-[340px] flex-wrap gap-1.5">
            {CHANNELS.map((c) => (
              <button key={c.id} type="button" onClick={() => setPreviewId(c.id)} className={"border px-2 py-1 font-mono text-[9px] uppercase tracking-widest " + (previewId === c.id ? "border-accent bg-accent text-[color:rgb(var(--c-base))]" : "border-bone text-bone-dim")}>{c.label.split(" · ")[0]}</button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
