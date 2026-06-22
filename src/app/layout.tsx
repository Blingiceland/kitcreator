import type { Metadata } from "next";
// All preset fonts are loaded globally; the active preset picks via CSS vars.
import "@fontsource/archivo-black";
import "@fontsource/sora";
import "@fontsource/jetbrains-mono";
import "@fontsource/space-grotesk";
import "@fontsource/inter";
import "@fontsource/fraunces";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kitcreator",
  description: "Eitt upphlað — allt settið.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is">
      <body>{children}</body>
    </html>
  );
}
