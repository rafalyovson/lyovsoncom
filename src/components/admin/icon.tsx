"use client";
import { useTheme } from "@payloadcms/ui";

import Image from "next/image";

export default function AdminIcon() {
  const { theme } = useTheme();
  const logoSrc =
    theme === "dark" ? "/crest-light-simple.webp" : "/crest-dark-simple.webp";
  return (
    <Image alt="Lyovson.com Logo" height={200} src={logoSrc} width={200} />
  );
}
