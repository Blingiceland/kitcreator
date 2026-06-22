import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Accepts a file upload and returns a URL the render pipeline can fetch.
 * On Vercel (BLOB_READ_WRITE_TOKEN present) it stores to Vercel Blob; locally it
 * falls back to a temp dir served by /api/asset — so uploads work in dev with no
 * token. v0: no auth, no cleanup policy yet.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${name}`, buf, { access: "public", contentType: file.type || undefined });
    return NextResponse.json({ url: blob.url });
  }

  // Local dev fallback — write to a temp dir, serve via /api/asset.
  const fs = await import("node:fs/promises");
  const os = await import("node:os");
  const path = await import("node:path");
  const dir = path.join(os.tmpdir(), "kitcreator-uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buf);
  return NextResponse.json({ url: `/api/asset?id=${encodeURIComponent(name)}` });
}
