import type { Metadata } from "next";
import type React from "react";
import { getServerSideURL } from "@/utilities/getURL";

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
