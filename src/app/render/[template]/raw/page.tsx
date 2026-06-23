import { notFound } from "next/navigation";
import {
  getChannel,
  isTemplate,
  buildStyle,
  DEFAULT_LOOK,
  CHANNELS,
  type BrandColors,
  type SponsorItem,
  type TextureKind,
  type BoxStyle,
} from "@/lib/kit";
import { TemplateFrame } from "@/components/template-frame";
import { ImageLed, type TemplateData } from "@/components/templates/image-led";
import { TypoLed } from "@/components/templates/typo-led";

type Search = Record<string, string | undefined>;

function parseColors(s: Search): BrandColors {
  return {
    base: s.base || DEFAULT_LOOK.colors.base,
    ink: s.ink || DEFAULT_LOOK.colors.ink,
    accent: s.accent || DEFAULT_LOOK.colors.accent,
    accent2: s.accent2 || DEFAULT_LOOK.colors.accent2,
  };
}

function parseSponsors(raw: string | undefined): SponsorItem[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((x) => x && (x.name || x.logo));
  } catch {
    /* ignore */
  }
  return [];
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
  const style = buildStyle({
    colors: parseColors(searchParams),
    fonts: {
      display: searchParams.fdisp || DEFAULT_LOOK.fonts.display,
      body: searchParams.fbody || DEFAULT_LOOK.fonts.body,
    },
    texture: (searchParams.tex as TextureKind) || DEFAULT_LOOK.texture,
    boxStyle: (searchParams.box as BoxStyle) || DEFAULT_LOOK.boxStyle,
    titleCase: searchParams.case === "upper" ? "upper" : "normal",
  });

  const data: TemplateData = {
    img: searchParams.img || "",
    imgPos: searchParams.pos,
    logo: searchParams.logo,
    event: searchParams.event,
    title: searchParams.title ?? "",
    subtitle: searchParams.subtitle,
    date: searchParams.date,
  };

  return (
    <>
      <style>{`body{margin:0!important;overflow:hidden!important;background:transparent!important}`}</style>
      <div style={{ width: channel.w, height: channel.h }}>
        <TemplateFrame channel={channel} style={style} sponsors={parseSponsors(searchParams.sponsors)}>
          {params.template === "typo-led" ? <TypoLed data={data} style={style} /> : <ImageLed data={data} style={style} />}
        </TemplateFrame>
      </div>
    </>
  );
}
