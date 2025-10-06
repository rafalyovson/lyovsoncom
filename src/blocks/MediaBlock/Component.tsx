import type { StaticImageData } from "next/image";
import type React from "react";
import { cn } from "src/utilities/cn";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { MediaBlock as MediaBlockProps } from "@/payload-types";

type Props = MediaBlockProps & {
  breakout?: boolean;
  captionClassName?: string;
  className?: string;
  enableGutter?: boolean;
  imgClassName?: string;
  staticImage?: StaticImageData;
  disableInnerContainer?: boolean;
};

export const MediaBlock: React.FC<Props> = (props) => {
  const { captionClassName, className, imgClassName, media, staticImage } =
    props;

  let caption: {
    root: {
      type: string;
      children: unknown[];
    };
  } | null = null;
  if (media && typeof media === "object") {
    caption = media.caption || null;
  }

  return (
    <Card
      className={cn(
        "glass-interactive glass-stagger-1 transition-all duration-300",

        className
      )}
    >
      <CardContent className={cn("p-0", className)}>
        <Media
          className="flex h-full items-center justify-center"
          imgClassName={cn("h-full object-cover", imgClassName)}
          pictureClassName="mt-0 mb-0"
          resource={media}
          src={staticImage}
        />
      </CardContent>
      {caption && (
        <CardFooter
          className={cn(
            "glass-section rounded-lg p-2 transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-border-hover)] focus-visible:ring-offset-2",
            "hover:shadow-md"
          )}
        >
          <RichText
            className={cn(
              "glass-text-secondary w-full text-center text-sm italic",
              captionClassName
            )}
            content={caption}
            enableGutter={false}
          />
        </CardFooter>
      )}
    </Card>
  );
};
