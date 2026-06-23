import { NextResponse } from "next/server";
import { getRenderBrowser } from "@/lib/render-browser";
import { CHANNELS, isTemplate } from "@/lib/kit";
import { makeZip } from "@/lib/zip";

// Renders every channel and returns the whole kit as one ZIP. Heavier than a
// single render (6 captures in one request) — needs the Pro plan headroom.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const FORWARD = [
  "title", "subtitle", "date", "img", "pos", "logo", "event", "sponsors",
  "base", "ink", "accent", "accent2", "fdisp", "fbody", "tex", "box", "case",
] as const;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const template = url.searchParams.get("template") ?? "image-led";
  if (!isTemplate(template)) {
    return NextResponse.json({ error: "Unknown template" }, { status: 404 });
  }

  let browser;
  try {
    browser = await getRenderBrowser();
    const page = await browser.newPage();
    const files: { name: string; buf: Buffer }[] = [];

    for (const channel of CHANNELS) {
      const params = new URLSearchParams({ channel: channel.id });
      for (const k of FORWARD) {
        const v = url.searchParams.get(k);
        if (v) params.set(k, v);
      }
      await page.setViewport({ width: channel.w, height: channel.h, deviceScaleFactor: channel.scale });
      await page.goto(`${url.origin}/render/${template}/raw?${params.toString()}`, { waitUntil: "load", timeout: 40_000 });
      await page.evaluate(async () => {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
        const imgs = Array.from(document.images);
        await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
      });
      const el = await page.$("[data-frame]");
      const shot = await (el ?? page).screenshot({ type: "png" });
      files.push({ name: `${channel.id}.png`, buf: Buffer.from(shot) });
    }

    const body = new Uint8Array(makeZip(files.map((f) => ({ name: f.name, data: f.buf }))));
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="creator-kit.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[kit] failed", err);
    return NextResponse.json({ error: "Kit render failed" }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
