import type { Metadata } from "next/types";

import { GridCardNotFound } from "@/components/grid";

export default function NotFound() {
  return <GridCardNotFound />;
}

export const metadata: Metadata = {
  title: "Page Not Found (404) | Lyovson.com",
  description:
    "The page you are looking for could not be found. Browse our latest posts, projects, and articles on Lyovson.com.",
  keywords: ["404", "not found", "page not found", "Lyovson.com"],
  alternates: {
    canonical: "/404", // Canonical for 404 pages
  },
  openGraph: {
    title: "Page Not Found (404)",
    description:
      "The page you are looking for could not be found. Browse our latest content instead.",
    type: "website",
    url: "/404",
  },
  twitter: {
    card: "summary",
    title: "Page Not Found (404)",
    description: "The page you are looking for could not be found.",
    site: "@lyovson",
  },
  robots: {
    index: false, // Don't index 404 pages
    follow: true, // But follow links from them
    noarchive: true,
  },
};
