import type React from "react";
import { cn } from "@/lib/utils";
import { serializeLexical } from "./serialize";

type Props = {
  className?: string;
  content: Record<string, any>;
  enableGutter?: boolean;
  enableProse?: boolean;
};

const RichText: React.FC<Props> = ({
  className,
  content,
  enableGutter = true,
  enableProse = true,
}) => {
  if (!content) {
    return null;
  }

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
      {content &&
        !Array.isArray(content) &&
        typeof content === "object" &&
        "root" in content &&
        serializeLexical({ nodes: content?.root?.children })}
    </div>
  );
};

export default RichText;
