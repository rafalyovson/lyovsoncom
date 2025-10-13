// Reusable JSON-LD component for structured data
// Handles hydration issues in Next.js App Router

import type { JsonLdProps } from "@/types/schema";

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
      type="application/ld+json"
    />
  );
}
