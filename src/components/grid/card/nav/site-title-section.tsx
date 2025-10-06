import Link from "next/link";

import { Logo } from "@/components/Logo/Logo";
import { GridCardSection } from "../section";

export const SiteTitleSection = () => {
  return (
    <GridCardSection className={"col-start-1 col-end-4 row-start-1 row-end-3"}>
      <Link
        className={
          "flex h-full flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
        }
        href="/"
      >
        <Logo />
        <div
          aria-label="Site title"
          className={"glass-text text-center font-bold text-3xl"}
          role="banner"
        >
          Lyóvson.com
        </div>
      </Link>
    </GridCardSection>
  );
};
