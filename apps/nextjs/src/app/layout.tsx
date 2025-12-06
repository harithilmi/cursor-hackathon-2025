import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";
import { ConvexClientProvider } from "~/app/ConvexClientProvider";

import "~/app/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://kerjaflow.vercel.app"
      : "http://localhost:3000",
  ),
  title: "KerjaFlow",
  description:
    "A smart job application assistant for Malaysian job seekers powered by AI",
  openGraph: {
    title: "KerjaFlow",
    description:
      "A smart job application assistant for Malaysian job seekers powered by AI",
    url: "https://kerjaflow.vercel.app",
    siteName: "KerjaFlow",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kerjaflow",
    creator: "@kerjaflow",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500"],
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "bg-slate-950 text-slate-200 min-h-screen font-sans antialiased",
          plusJakarta.variable,
          jetbrainsMono.variable,
        )}
      >
        <ClerkProvider
          appearance={{
            variables: {
              colorBackground: "#1e293b",
              colorText: "#e2e8f0",
              colorPrimary: "#6366f1",
              colorInputBackground: "#0f172a",
              colorInputText: "#e2e8f0",
            },
          }}
        >
          <ConvexClientProvider>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
            <Toaster />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
