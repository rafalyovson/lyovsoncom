"use client";

import { useEffect } from "react";

function injectPreconnect(href: string, crossOrigin?: boolean) {
  const existing = document.querySelector(
    `link[rel="preconnect"][href="${href}"]`
  );
  if (existing) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = href;
  if (crossOrigin) {
    link.crossOrigin = "";
  }
  document.head.appendChild(link);
}

export function AdminFontProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    injectPreconnect("https://fonts.googleapis.com");
    injectPreconnect("https://fonts.gstatic.com", true);
  }, []);

  return children;
}
