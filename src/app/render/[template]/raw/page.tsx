import { notFound } from "next/navigation";
import { getChannel, isTemplate, resolveStyle, CHANNELS, type BrandColors } from "@/lib/kit";
import { TemplateFrame } from "@/components/template-frame";
import { ImageLed, type TemplateData } from "@/components/templates/image-led";

type Search = Record<string, string | undefined>;

function parseColors(s: Search): BrandColors | undefined {
  const { base, ink, accent, accent2 } = s;
  if (base && ink && accent && accent2) return { base, ink, accent, accent2 };
  return undefined;
}

/** Bare, full-size frame for headless capture (/api/render drives this). */
export default function RawRenderPage({
  params,
  searchParams,
}: {
  params: { template: string };
  searchParams: Search;
}) {
  if (!isTemplate(params.template)) notFound();

  const channel = getChannel(searchParams.channel) ?? CHANNELS[0];
  const theme = searchParams.thema === "dark" ? "dark" : "light";
  const style = resolveStyle({
    presetId: searchParams.still ?? "silkscreen",
    theme,
    colors: parseColors(searchParams),
    fonts: searchParams.fdisp && searchParams.fbody ? { display: searchParams.fdisp, body: searchParams.fbody } : undefined,
  });

  const sponsors = (searchParams.sponsors ?? "").split("|").map((s) => s.trim()).filter(Boolean);

  const data: TemplateData = {
    img: searchParams.img || "/test-image.jpg",
    event: searchParams.event,
    title: searchParams.title ?? "",
    subtitle: searchParams.subtitle,
    date: searchParams.date,
  };

  return (
    <>
      <style>{`body{margin:0!important;overflow:hidden!important;background:transparent!important}`}</style>
      <div style={{ width: channel.w, height: channel.h }}>
        <TemplateFrame channel={channel} style={style} sponsors={sponsors}>
          <ImageLed data={data} style={style} />
        </TemplateFrame>
      </div>
    </>
  );
}
