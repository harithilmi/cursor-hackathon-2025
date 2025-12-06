import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  themeColor: "white",
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
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
            <Toaster />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
