"use client";

import * as React from "react";
import { Upload, Plus } from "lucide-react";
import { FONTS } from "@/lib/kit";
import { tripletToHex, hexToTriplet } from "@/lib/colors";

export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("upload failed");
  const { url } = await res.json();
  return url as string;
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 border-2 border-bone p-5">
      <p className="font-display text-xl uppercase leading-none text-bone">{title}</p>
      {children}
    </div>
  );
}

export function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
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

export function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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

export function Swatch({ label, value, onChange }: { label: string; value: string; onChange: (triplet: string) => void }) {
  return (
    <label className="flex items-center gap-2 border-2 border-bone px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-bone">
      <input type="color" value={tripletToHex(value)} onChange={(e) => onChange(hexToTriplet(e.target.value))} className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0" />
      {label}
    </label>
  );
}

export function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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

export function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
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
      <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex items-center gap-2 border-2 border-bone bg-bone px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:rgb(var(--c-base))] disabled:opacity-50">
        <Upload size={14} /> {busy ? "Hleð upp…" : value ? "Skipta um" : label}
      </button>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-14 w-14 border-2 border-bone object-contain" />
      )}
    </div>
  );
}

export function SponsorLogoButton({ onAdd }: { onAdd: (url: string) => void }) {
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
      <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex h-11 items-center gap-1.5 border-2 border-bone px-3 font-mono text-[11px] uppercase tracking-widest text-bone disabled:opacity-50">
        <Plus size={14} /> {busy ? "…" : "Lógó"}
      </button>
    </>
  );
}

export function FocalPicker({ src, pos, onChange }: { src: string; pos: string; onChange: (p: string) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  function click(e: React.MouseEvent) {
    const r = ref.current!.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
    const y = Math.round(Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)));
    onChange(`${x}% ${y}%`);
  }
  const [px, py] = pos.split(" ");
  return (
    <div ref={ref} onClick={click} className="relative w-64 cursor-crosshair overflow-hidden border-2 border-bone">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block w-full select-none" draggable={false} />
      <span className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-accent/30" style={{ left: px, top: py }} />
    </div>
  );
}
