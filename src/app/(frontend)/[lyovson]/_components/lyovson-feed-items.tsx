import {
  GridCardActivityFull,
  GridCardNoteFull,
  GridCardPostFull,
} from "@/components/grid";
import type { LyovsonMixedFeedItem } from "@/utilities/get-lyovson-feed";

interface LyovsonFeedItemsProps {
  items: LyovsonMixedFeedItem[];
}

export function LyovsonFeedItems({ items }: LyovsonFeedItemsProps) {
  return items.map((item, index) => {
    if (item.type === "post") {
      return (
        <GridCardPostFull
          key={`post-${item.data.id}`}
          post={item.data}
          {...(index === 0 && { priority: true })}
        />
      );
    }

    if (item.type === "note") {
      return (
        <GridCardNoteFull
          key={`note-${item.data.id}`}
          note={item.data}
          {...(index === 0 && { priority: true })}
        />
      );
    }

    return (
      <GridCardActivityFull
        activity={item.data}
        key={`activity-${item.data.id}`}
        {...(index === 0 && { priority: true })}
      />
    );
  });
}
