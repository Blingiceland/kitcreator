export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
};

/** Serves a locally-uploaded asset (dev fallback for /api/upload). */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!id || id.includes("..") || id.includes("/") || id.includes("\\")) {
    return new Response("bad request", { status: 400 });
  }
  const os = await import("node:os");
  const path = await import("node:path");
  const fs = await import("node:fs/promises");
  const file = path.join(os.tmpdir(), "kitcreator-uploads", id);
  try {
    const buf = await fs.readFile(file);
    const ext = (id.split(".").pop() || "").toLowerCase();
    return new Response(buf, {
      headers: { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "no-store" },
    });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
