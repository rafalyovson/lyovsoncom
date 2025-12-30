import { BannerBlock } from "@/blocks/Banner/Component";
import { CodeBlock } from "@/blocks/Code/Component";
import { GIFBlock } from "@/blocks/GIF/Component";
import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { QuoteBlock } from "@/blocks/Quote/Component";
import { XPostBlock } from "@/blocks/XPost/Component";
import { YouTubeBlock } from "@/blocks/YouTube/Component";

type BlockType =
  | "banner"
  | "code"
  | "gif"
  | "mediaBlock"
  | "quote"
  | "xpost"
  | "youtube";

type BlockWithType = {
  blockType: BlockType;
  id?: string;
  [key: string]: unknown;
};

export const RenderBlocks = (props: { blocks: BlockWithType[] }) => {
  const { blocks } = props;

  const hasBlocks = Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (!blockType) {
            return null;
          }

          const key = block.id || `${blockType}-${index}`;
          const blockProps = block as unknown as Record<string, unknown>;

          switch (blockType) {
            case "mediaBlock":
              return (
                <div className="my-16" key={key}>
                  <MediaBlock {...(blockProps as any)} />
                </div>
              );
            case "youtube":
              return (
                <div className="my-16" key={key}>
                  <YouTubeBlock {...(blockProps as any)} />
                </div>
              );
            case "gif":
              return (
                <div className="my-16" key={key}>
                  <GIFBlock {...(blockProps as any)} />
                </div>
              );
            case "banner":
              return (
                <div className="my-16" key={key}>
                  <BannerBlock {...(blockProps as any)} />
                </div>
              );
            case "code":
              return (
                <div className="my-16" key={key}>
                  <CodeBlock {...(blockProps as any)} />
                </div>
              );
            case "quote":
              return (
                <div className="my-16" key={key}>
                  <QuoteBlock {...(blockProps as any)} />
                </div>
              );
            case "xpost":
              return (
                <div className="my-16" key={key}>
                  <XPostBlock {...(blockProps as any)} />
                </div>
              );
            default:
              return null;
          }
        })}
      </>
    );
  }

  return null;
};
