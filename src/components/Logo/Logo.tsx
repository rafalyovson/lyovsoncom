"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
};

export const Logo = (props: Props) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  if (mounted) {
    switch (resolvedTheme) {
      case "light":
        src = "/crest-dark-simple.webp";
        break;
      case "dark":
        src = "/crest-light-simple.webp";
        break;
      default:
        src = "/crest-dark-simple.webp";
        break;
    }
  }

  return (
    <Image
      alt="Lyovson.com Logo"
      className={clsx("", props.className)}
      height={150}
      src={src}
      width={150}
    />
  );
};
