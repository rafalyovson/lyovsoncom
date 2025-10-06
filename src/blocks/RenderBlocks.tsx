import { GIFBlock } from "@/blocks/GIF/Component";
import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { YouTubeBlock } from "@/blocks/YouTube/Component";

type BlockType = "mediaBlock" | "youtube" | "gif";

type BlockWithType = {
  blockType: BlockType;
  id?: string;
  [key: string]: unknown;
};

const blockComponents = {
  mediaBlock: MediaBlock,
  youtube: YouTubeBlock,
  gif: GIFBlock,
};

export const RenderBlocks = (props: { blocks: BlockWithType[] }) => {
  const { blocks } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            // Use block ID if available, fallback to blockType + index for stable key
            const key = block.id || `${blockType}-${index}`;

            return (
              <div className="my-16" key={key}>
                {blockType === "mediaBlock" && (
                  <MediaBlock {...(block as any)} />
                )}
                {blockType === "youtube" && (
                  <YouTubeBlock {...(block as any)} />
                )}
                {blockType === "gif" && <GIFBlock {...(block as any)} />}
              </div>
            );
          }
          return null;
        })}
      </>
    );
  }

  return null;
};
