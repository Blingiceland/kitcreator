import { notFound } from "next/navigation";
import { getChannel, isTemplate, CHANNELS } from "@/lib/kit";
import { TemplateFrame } from "@/components/template-frame";
import { ImageLed, type TemplateData } from "@/components/templates/image-led";

type Search = {
  channel?: string;
  thema?: string;
  title?: string;
  subtitle?: string;
  date?: string;
  img?: string;
};

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
  const data: TemplateData = {
    img: searchParams.img || "/test-image.jpg",
    title: searchParams.title || "Titill",
    subtitle: searchParams.subtitle,
    date: searchParams.date,
  };

  return (
    <>
      <style>{`body{margin:0!important;overflow:hidden!important;background:transparent!important}`}</style>
      <div style={{ width: channel.w, height: channel.h }}>
        <TemplateFrame channel={channel} theme={theme}>
          <ImageLed data={data} />
        </TemplateFrame>
      </div>
    </>
  );
}
