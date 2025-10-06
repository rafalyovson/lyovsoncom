import { SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import Image from "next/image";
import { GridCard, GridCardNavItem, GridCardSection } from "@/components/grid";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export const GridCardJess = ({ className }: Props) => {
  return (
    <GridCard
      className={cn(
        "g3:col-span-2 g3:row-span-1 row-span-2 g3:h-[400px] h-[816px] g3:w-[816px] g3:grid-cols-6 g3:grid-rows-3 grid-rows-6",
        className
      )}
    >
      <GridCardSection
        className={cn(
          "col-start-1 col-end-4 row-start-2 row-end-5",
          "g3:col-start-1 g3:col-end-4 g3:row-start-1 g3:row-end-4"
        )}
      >
        <Image
          alt={"Jess Lyóvson"}
          className="h-full w-full rounded-md object-cover"
          height={400}
          src={"/jess-cozy.webp"}
          width={400}
        />
      </GridCardSection>

      <GridCardSection
        className={cn(
          "col-start-1 col-end-4 row-start-1 row-end-2 flex h-full flex-col justify-center",
          "g3:col-start-4 g3:col-end-8 g3:row-start-1 g3:row-end-2"
        )}
      >
        <h1 className={"glass-text text-center font-bold text-2xl"}>
          Jess Lyóvson
        </h1>
        <p className={"glass-text-secondary text-center text-sm italic"}>
          Storyteller, creator, and maker of things
        </p>
      </GridCardSection>
      <GridCardNavItem
        className={cn(
          "col-start-1 col-end-2 row-start-5 row-end-6",
          "g3:col-start-4 g3:col-end-5 g3:row-start-2 g3:row-end-3"
        )}
      >
        <a
          aria-label={"Jess Lyóvson on X.com"}
          className="flex flex-col items-center justify-center gap-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)]"
          href={"https://x.com/jesslyovson"}
          rel="noopener"
          target="_blank"
        >
          <SiX className="text-current" size={24} />
          <span className="text-sm">x.com</span>
        </a>
      </GridCardNavItem>
      <GridCardNavItem
        className={cn(
          "col-start-2 col-end-3 row-start-5 row-end-6",
          "g3:col-start-5 g3:col-end-6 g3:row-start-2 g3:row-end-3"
        )}
      >
        <a
          aria-label={"Jess Lyóvson on YouTube"}
          className="flex flex-col items-center justify-center gap-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)]"
          href={"https://www.youtube.com/@hasmikkhachunts1741"}
          rel="noopener"
          target="_blank"
        >
          <SiYoutube className="text-current" size={24} />
          <span className="text-sm">YouTube</span>
        </a>
      </GridCardNavItem>
    </GridCard>
  );
};
