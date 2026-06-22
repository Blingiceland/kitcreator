import { NextResponse } from "next/server";
import { getRenderBrowser } from "@/lib/render-browser";
import { getChannel, isTemplate, CHANNELS } from "@/lib/kit";

// Puppeteer needs the Node runtime; never cache (params drive the output).
// maxDuration gives headless Chrome room to cold-start on Vercel (Pro+).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const EXTS = { png: "image/png", jpeg: "image/jpeg", pdf: "application/pdf" } as const;
type Ext = keyof typeof EXTS;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const template = url.searchParams.get("template") ?? "image-led";
  if (!isTemplate(template)) {
    return NextResponse.json({ error: "Unknown template" }, { status: 404 });
  }
  const channel = getChannel(url.searchParams.get("channel") ?? "") ?? CHANNELS[0];
  const theme = url.searchParams.get("thema") === "dark" ? "dark" : "light";
  const extParam = url.searchParams.get("ext") as Ext;
  const ext: Ext = (Object.keys(EXTS) as Ext[]).includes(extParam) ? extParam : "png";

  // Forward the content fields to the bare render page.
  const params = new URLSearchParams({
    channel: channel.id,
    thema: theme,
    title: url.searchParams.get("title") || "Titill",
  });
  for (const k of ["subtitle", "date", "img"] as const) {
    const v = url.searchParams.get(k);
    if (v) params.set(k, v);
  }
  const rawUrl = `${url.origin}/render/${template}/raw?${params.toString()}`;

  let browser;
  try {
    browser = await getRenderBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: channel.w, height: channel.h, deviceScaleFactor: channel.scale });
    await page.goto(rawUrl, { waitUntil: "load", timeout: 40_000 });
    // Ensure web fonts and the photo have painted before capture.
    await page.evaluate(async () => {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })))
      );
    });

    let body: Uint8Array<ArrayBuffer>;
    if (ext === "pdf") {
      body = new Uint8Array(
        await page.pdf({ width: `${channel.w}px`, height: `${channel.h}px`, printBackground: true, pageRanges: "1" })
      );
    } else {
      const el = await page.$("[data-frame]");
      const shot = await (el ?? page).screenshot({ type: ext, ...(ext === "jpeg" ? { quality: 92 } : {}) });
      body = new Uint8Array(shot);
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": EXTS[ext],
        "Content-Disposition": `attachment; filename="kit-${channel.id}-${theme}.${ext}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[render] failed", err);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
