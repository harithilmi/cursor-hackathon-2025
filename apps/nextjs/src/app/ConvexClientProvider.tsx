"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { env } from "~/env";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = useMemo(
    () => new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL),
    [],
  );
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
