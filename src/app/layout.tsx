import type { Metadata } from "next";
import "@fontsource/archivo-black";
import "@fontsource/sora";
import "@fontsource/jetbrains-mono";
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
