import type React from "react";
import { GridCardActivityFull } from "@/components/grid";
import type { Activity } from "@/payload-types";

export type Props = {
  activities: Activity[];
};

export const ActivitiesArchive: React.FC<Props> = (props) => {
  const { activities } = props;

  return (
    <>
      {activities?.map((activity, index) => {
        if (typeof activity === "object" && activity !== null) {
          return (
            <GridCardActivityFull
              activity={activity}
              key={activity.slug}
              {...(index === 0 && {
                priority: true,
              })}
            />
          );
        }

        return null;
      })}
    </>
  );
};
