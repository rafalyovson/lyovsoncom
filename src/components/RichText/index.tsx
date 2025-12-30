import type React from "react";
import { cn } from "@/lib/utils";
import { serializeLexical } from "./serialize";

type Props = {
  className?: string;
  content: Record<string, any>;
  enableGutter?: boolean;
  enableProse?: boolean;
};

const RichText = async ({
  className,
  content,
  enableGutter = true,
  enableProse = true,
}: Props) => {
  if (!content) {
    return null;
  }

  const serializedContent =
    content &&
    !Array.isArray(content) &&
    typeof content === "object" &&
    "root" in content
      ? await serializeLexical({ nodes: content?.root?.children })
      : null;

  return (
    <div
      className={cn(
        {
          container: enableGutter,
          "max-w-none": !enableGutter,
          "prose dark:prose-invert mx-auto": enableProse,
        },
        className
      )}
    >
      {serializedContent}
    </div>
  );
};

export default RichText;
