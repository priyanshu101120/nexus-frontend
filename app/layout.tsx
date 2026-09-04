import { Authprovider } from "@/context/Authcontext";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata: Metadata = {
  title: "Nexus — Connected workspace",
  description: "Everything your team needs. Connected in one place.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
      <body>
        <Authprovider>{children}</Authprovider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
