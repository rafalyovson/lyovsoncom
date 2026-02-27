import { BannerBlock as BannerBlockComponent } from "@/blocks/Banner/Component";
import { CodeBlock as CodeBlockComponent } from "@/blocks/Code/Component";
import { GIFBlock as GIFBlockComponent } from "@/blocks/GIF/Component";
import { MediaBlock as MediaBlockComponent } from "@/blocks/MediaBlock/Component";
import { QuoteBlock as QuoteBlockComponent } from "@/blocks/Quote/Component";
import { XPostBlock as XPostBlockComponent } from "@/blocks/XPost/Component";
import { YouTubeBlock as YouTubeBlockComponent } from "@/blocks/YouTube/Component";
import type {
  BannerBlock,
  CodeBlock,
  GIFBlock,
  MediaBlock,
  QuoteBlock,
  XPostBlock,
  YouTubeBlock,
} from "@/payload-types";

type RenderBlock =
  | BannerBlock
  | CodeBlock
  | GIFBlock
  | MediaBlock
  | QuoteBlock
  | XPostBlock
  | YouTubeBlock;

interface Props {
  blocks?: RenderBlock[] | null;
}

function renderBlock(block: RenderBlock, key: string) {
  switch (block.blockType) {
    case "mediaBlock":
      return (
        <div className="my-16" key={key}>
          <MediaBlockComponent {...block} />
        </div>
      );
    case "youtube":
      return (
        <div className="my-16" key={key}>
          <YouTubeBlockComponent {...block} />
        </div>
      );
    case "gif":
      return (
        <div className="my-16" key={key}>
          <GIFBlockComponent {...block} />
        </div>
      );
    case "banner":
      return (
        <div className="my-16" key={key}>
          <BannerBlockComponent {...block} />
        </div>
      );
    case "code":
      return (
        <div className="my-16" key={key}>
          <CodeBlockComponent {...block} />
        </div>
      );
    case "quote":
      return (
        <div className="my-16" key={key}>
          <QuoteBlockComponent {...block} />
        </div>
      );
    case "xpost":
      return (
        <div className="my-16" key={key}>
          <XPostBlockComponent {...block} />
        </div>
      );
    default:
      return null;
  }
}

export const RenderBlocks = ({ blocks }: Props) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id ?? `${block.blockType}-${index}`;
        return renderBlock(block, key);
      })}
    </>
  );
};
