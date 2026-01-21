import {
  Book,
  Building2,
  Calendar,
  Film,
  Gamepad2,
  Link as LinkIcon,
  Mic,
  Music,
  PenTool,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";

import { GridCard, GridCardSection } from "@/components/grid";
import { Media } from "@/components/Media";
import type { Activity, Reference } from "@/payload-types";

export type GridCardActivityProps = {
  activity: Activity;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
};

const activityTypeLabels: Record<string, string> = {
  read: "Read",
  watch: "Watched",
  listen: "Listened",
  play: "Played",
};

const referenceTypeIcons: Record<string, typeof Book> = {
  book: Book,
  movie: Film,
  tvShow: Film,
  videoGame: Gamepad2,
  music: Music,
  podcast: Mic,
  series: Book,
  person: User,
  company: Building2,
  website: LinkIcon,
  article: LinkIcon,
  video: Video,
  repository: LinkIcon,
  tool: LinkIcon,
  social: LinkIcon,
  other: LinkIcon,
};


function getActivityDate(activity: Activity): { date: string; dateTime?: string; dateSlug?: string } | null {
  const dateTime = activity.finishedAt || activity.startedAt || activity.publishedAt;
  if (dateTime) {
    const dateObj = new Date(dateTime);
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = String(dateObj.getFullYear()).slice(-2);
    const dateSlug = `${month}-${day}-${year}`;
    
    return {
      date: dateObj.toLocaleDateString("en-GB", {
        year: "2-digit",
        month: "short",
        day: "2-digit",
      }),
      dateTime,
      dateSlug,
    };
  }
  return null;
}

export const GridCardActivityFull = ({
  activity,
  className,
  loading,
  priority,
}: GridCardActivityProps) => {
  const { reference, activityType, slug } = activity;

  // Build URL with date and slug: /activities/MM-DD-YY/reference-title
  const dateInfo = getActivityDate(activity);
  const dateSlug = dateInfo?.dateSlug || "unknown";
  const activityUrl = `/activities/${dateSlug}/${slug}`;

  const referenceObj =
    typeof reference === "object" && reference !== null
      ? (reference as Reference)
      : null;
  const referenceTitle = referenceObj?.title || "Unknown";
  const referenceType = referenceObj?.type || "other";
  const referenceImage =
    referenceObj?.image &&
    typeof referenceObj.image === "object" &&
    referenceObj.image !== null &&
    "id" in referenceObj.image
      ? referenceObj.image
      : null;

  const ReferenceIcon = referenceTypeIcons[referenceType] || LinkIcon;
  const activityTypeLabel = activityTypeLabels[activityType] || activityType;

  return (
    <GridCard className={className}>
      {referenceImage && (
        <GridCardSection className="col-start-1 col-end-3 row-start-1 row-end-4">
          <Link
            aria-label={`View activity: ${activityTypeLabels[activityType] || activityType} ${referenceTitle}`}
            className="group block h-full overflow-hidden rounded-lg"
            href={activityUrl}
          >
            <Media
              className="glass-media flex h-full items-center justify-center"
              imgClassName="object-cover h-full w-full"
              pictureClassName="h-full w-full"
              resource={referenceImage}
              {...(loading ? { loading } : {})}
              {...(priority ? { priority } : {})}
            />
          </Link>
        </GridCardSection>
      )}

      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-1 row-end-2 flex h-full flex-col items-center justify-center gap-1"
        }
      >
        <Link className="group block flex flex-col items-center gap-1" href={activityUrl}>
          <ReferenceIcon
            aria-hidden="true"
            className="glass-text h-5 w-5 transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
          />
          <span className="glass-text-secondary text-xs capitalize transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]">
            {activityTypeLabel}
          </span>
        </Link>
      </GridCardSection>

      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-2 row-end-3 flex flex-col justify-evenly gap-2"
        }
      >
        {activity.participants && activity.participants.length > 0 && (
          <>
            {activity.participants
              .filter((participant, index, self) => {
                // Deduplicate participants by ID
                if (typeof participant !== "object" || !participant?.id) {
                  return false;
                }
                return index === self.findIndex((p) => 
                  typeof p === "object" && p?.id === participant.id
                );
              })
              .map((participant, index) => {
                if (typeof participant !== "object" || !participant?.username) {
                  return null;
                }
                return (
                  <Link
                    aria-label={`View ${participant.name}'s profile`}
                    className={`glass-text glass-interactive flex items-center gap-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)] glass-stagger-${Math.min(index + 1, 6)}`}
                    href={{ pathname: `/${participant.username}` }}
                    key={participant.id}
                  >
                    <PenTool aria-hidden="true" className="h-5 w-5" />
                    <span className="font-medium text-xs">
                      {participant.name?.replace(" Lyovson", "")}
                    </span>
                  </Link>
                );
              })}
          </>
        )}

        {dateInfo && (
          <div className="glass-text-secondary flex items-center gap-2 text-xs">
            <Calendar aria-hidden="true" className="h-5 w-5" />
            <time dateTime={dateInfo.dateTime}>
              {dateInfo.date}
            </time>
          </div>
        )}
      </GridCardSection>

      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-3 row-end-4 flex h-full flex-col justify-center"
        }
      >
        <Link className="group block" href={activityUrl}>
          <h2 className="glass-text text-center font-bold text-sm transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]">
            {referenceTitle}
          </h2>
        </Link>
      </GridCardSection>
    </GridCard>
  );
};
