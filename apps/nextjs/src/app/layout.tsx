import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";
import { ConvexClientProvider } from "~/app/ConvexClientProvider";

import "~/app/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-mono antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ConvexClientProvider>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
