"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from "react";

/**
 * Providers component to wrap the application with necessary contexts.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => {
    try {
      const url = process.env.NEXT_PUBLIC_CONVEX_URL || "https://migrated-to-postgres-placeholder.convex.cloud";
      return new ConvexReactClient(url);
    } catch (e) {
      console.warn("Failed to initialize Convex client:", e);
      return null as any;
    }
  });

  if (!client) {
    return <>{children}</>;
  }

  return (
    <ConvexProvider client={client}>
      {children}
    </ConvexProvider>
  );
}
