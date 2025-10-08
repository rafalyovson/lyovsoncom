import Image from "next/image";
import { GridCard, GridCardNavItem, GridCardSection } from "@/components/grid";
import { cn } from "@/lib/utils";
import type { Lyovson } from "@/payload-types";
import { SOCIAL_ICON_MAP } from "@/utilities/social-icons";

const MAX_SOCIAL_LINKS = 3;

type Props = {
  user?: Lyovson;
  className?: string;
};

export const GridCardRafa = ({ user, className }: Props) => {
  const socialLinks = user?.socialLinks?.slice(0, MAX_SOCIAL_LINKS) || [];

  const gridPositions = [
    "col-start-1 col-end-2 row-start-6 row-end-7 g3:col-start-4 g3:col-end-5 g3:row-start-3 g3:row-end-4",
    "col-start-2 col-end-3 row-start-6 row-end-7 g3:col-start-5 g3:col-end-6 g3:row-start-3 g3:row-end-4",
    "col-start-3 col-end-4 row-start-6 row-end-7 g3:col-start-6 g3:col-end-7 g3:row-start-3 g3:row-end-4",
  ];

  return (
    <GridCard
      className={cn(
        "g3:col-span-2 g3:row-span-1 row-span-2 g3:h-[400px] h-[816px] g3:w-[816px] g3:grid-cols-6 g3:grid-rows-3 grid-rows-6",
        className
      )}
    >
      <GridCardSection
        className={cn(
          "col-start-1 col-end-4 row-start-1 row-end-4",
          "g3:col-start-1 g3:col-end-4 g3:row-start-1 g3:row-end-4"
        )}
      >
        <Image
          alt={user?.name || "Rafa Lyóvson"}
          className="h-full w-full rounded-md object-cover"
          height={400}
          src={"/rafa-cozy.webp"}
          width={400}
        />
      </GridCardSection>

      <GridCardSection
        className={cn(
          "col-start-1 col-end-4 row-start-4 row-end-6 flex h-full flex-col items-center justify-center px-4 md:px-8",
          "g3:col-start-4 g3:col-end-8 g3:row-start-1 g3:row-end-3"
        )}
      >
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <h1
            className={
              "glass-text text-center font-bold text-2xl md:text-3xl lg:text-4xl"
            }
          >
            {user?.name || "Rafa Lyóvson"}
          </h1>
          <p
            className={
              "glass-text-secondary text-center text-base leading-relaxed"
            }
          >
            {user?.quote || "Watcher on The Road 🛣️"}
          </p>
        </div>
      </GridCardSection>

      {socialLinks.map((link, index) => {
        const iconConfig = SOCIAL_ICON_MAP[link.platform];
        if (!iconConfig) {
          return null;
        }

        const IconComponent = iconConfig.icon;

        return (
          <GridCardNavItem className={cn(gridPositions[index])} key={link.url}>
            <a
              aria-label={`${user?.name || "Rafa Lyóvson"} on ${iconConfig.label}`}
              className="flex flex-col items-center justify-center gap-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)]"
              href={link.url}
              rel="noopener"
              target="_blank"
            >
              <IconComponent className="text-current" size={24} />
              <span className="text-sm">{iconConfig.label}</span>
            </a>
          </GridCardNavItem>
        );
      })}
    </GridCard>
  );
};
