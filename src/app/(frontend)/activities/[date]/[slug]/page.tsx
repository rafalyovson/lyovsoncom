import { Calendar, Star, User } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

import { GridCardContent, GridCardHeroActivity, GridCardSection } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";
import type { Activity } from "@/payload-types";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/utilities/generate-json-ld";
import { getActivity } from "@/utilities/get-activity";
import { getServerSideURL } from "@/utilities/getURL";

type Args = {
  params: Promise<{
    date: string;
    slug: string;
  }>;
};

export const dynamicParams = false;

const activityTypeLabels: Record<string, string> = {
  read: "Read",
  watch: "Watched",
  listen: "Listened",
  play: "Played",
};

function getActivityTitle(
  activity: Activity,
  referenceTitle: string | null
): string {
  if (referenceTitle) {
    return `${activityTypeLabels[activity.activityType] || activity.activityType} ${referenceTitle}`;
  }
  return activityTypeLabels[activity.activityType] || activity.activityType;
}

function getParticipantNames(activity: Activity): string {
  if (!activity.participants || activity.participants.length === 0) {
    return "";
  }

  const names = activity.participants
    .map((p) => {
      if (typeof p === "object" && p !== null && "name" in p) {
        return p.name;
      }
      return null;
    })
    .filter(Boolean);

  return names.join(", ");
}

type ActivityRatingItem = {
  name: string;
  rating: number;
  comment?: string | null;
};

function getRatings(activity: Activity): ActivityRatingItem[] {
  if (!activity.ratings || activity.ratings.length === 0) {
    return [];
  }

  return activity.ratings.map((r) => {
    const lyovson =
      typeof r.lyovson === "object" && r.lyovson !== null ? r.lyovson : null;

    return {
      name: lyovson?.name || "Unknown",
      rating: r.rating,
      comment: r.comment || null,
    };
  });
}

export default async function ActivityPage({ params: paramsPromise }: Args) {
  "use cache";

  const { date, slug } = await paramsPromise;
  const fullPath = `${date}/${slug}`;

  cacheTag("activities");
  cacheTag(`activity-${fullPath}`);
  cacheLife("activities");

  // getActivity searches by slug (reference title), not the full path
  const activity = await getActivity(slug);
  if (!activity) {
    return notFound();
  }

  const referenceObj =
    typeof activity.reference === "object" && activity.reference !== null
      ? activity.reference
      : null;

  const pageTitle = getActivityTitle(activity, referenceObj?.title || null);
  const participantNames = getParticipantNames(activity);
  const ratings = getRatings(activity);

  const articleSchema = generateArticleSchema({
    title: pageTitle || "Activity",
    slug: fullPath,
    pathPrefix: "/activities",
    publishedAt: activity.publishedAt || undefined,
    updatedAt: activity.updatedAt || undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: getServerSideURL() },
    { name: "Activities", url: `${getServerSideURL()}/activities` },
    {
      name: pageTitle || "Activity",
    },
  ]);

  const referenceImage =
    referenceObj?.image && typeof referenceObj.image === "object"
      ? referenceObj.image
      : null;

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <GridCardHeroActivity activity={activity} title={pageTitle} />

      <GridCardContent
        className={cn(
          "g2:col-start-2 g2:col-end-3 g2:row-auto g2:row-start-3",
          "g3:col-end-4 g3:row-start-2 g3:w-[816px]"
        )}
      >
        <div className="prose prose-lg glass-stagger-3 prose-headings:glass-text prose-p:glass-text prose-a:glass-text prose-li:glass-text prose-blockquote:glass-text-secondary max-w-none">
          <ActivityMeta
            finishedAt={activity.finishedAt || null}
            startedAt={activity.startedAt || null}
          />

          <ActivityParticipants names={participantNames} />

          <ActivityRatings ratings={ratings} />

          <ActivityNotes notes={activity.notes || null} />
        </div>
      </GridCardContent>
    </>
  );
}

type ActivityMetaProps = {
  startedAt: string | null;
  finishedAt: string | null;
};

function ActivityMeta({ startedAt, finishedAt }: ActivityMetaProps) {
  if (!(startedAt || finishedAt)) {
    return null;
  }

  return (
    <div className="glass-text-secondary mb-4 flex flex-wrap items-center gap-4 text-sm">
      {startedAt && (
        <div className="flex items-center gap-2">
          <Calendar aria-hidden="true" className="h-4 w-4" />
          <span>Started: {formatLongDate(startedAt)}</span>
        </div>
      )}
      {finishedAt && (
        <div className="flex items-center gap-2">
          <Calendar aria-hidden="true" className="h-4 w-4" />
          <span>Finished: {formatLongDate(finishedAt)}</span>
        </div>
      )}
    </div>
  );
}

function ActivityParticipants({ names }: { names: string }) {
  if (!names) {
    return null;
  }

  return (
    <div className="glass-text-secondary mb-4 flex items-center gap-2 text-sm">
      <User aria-hidden="true" className="h-4 w-4" />
      <span>Participants: {names}</span>
    </div>
  );
}

function ActivityRatings({ ratings }: { ratings: ActivityRatingItem[] }) {
  if (ratings.length === 0) {
    return null;
  }

  return (
    <div className="glass-text-secondary mb-4">
      <h2 className="glass-text mb-2 font-semibold text-lg">Ratings</h2>
      <div className="flex flex-col gap-2">
        {ratings.map((rating) => (
          <div
            className="glass-badge glass-text flex items-center gap-2 px-3 py-2"
            key={`${rating.name}-${rating.rating}-${rating.comment || ""}`}
          >
            <Star aria-hidden="true" className="h-4 w-4 fill-current" />
            <span className="font-medium">
              {rating.name}: {rating.rating}/10
            </span>
            {rating.comment && (
              <span className="text-xs">— {rating.comment}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityNotes({ notes }: { notes: Activity["notes"] | null }) {
  if (!notes) {
    return null;
  }

  return (
    <div className="mt-4">
      <RichText
        className="h-full"
        content={notes}
        enableGutter={false}
        enableProse={true}
      />
    </div>
  );
}

function formatLongDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  "use cache";
  cacheTag("activities");
  cacheLife("static");

  const { getPayload } = await import("payload");
  const configPromise = await import("@payload-config");
  const payload = await getPayload({ config: configPromise.default });
  const activities = await payload.find({
    collection: "activities",
    where: {
      _status: {
        equals: "published",
      },
    },
    limit: 1000,
  });

  return activities.docs
    .filter(
      (activity) =>
        typeof activity === "object" && "slug" in activity && activity.slug
    )
    .map((activity) => {
      const activitySlug = (activity as { slug: string }).slug;
      // Get date from finishedAt, startedAt, or publishedAt
      const dateTime = (activity as { finishedAt?: string; startedAt?: string; publishedAt?: string }).finishedAt ||
        (activity as { startedAt?: string; publishedAt?: string }).startedAt ||
        (activity as { publishedAt?: string }).publishedAt;
      
      if (dateTime) {
        const dateObj = new Date(dateTime);
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const year = String(dateObj.getFullYear()).slice(-2);
        const dateSlug = `${month}-${day}-${year}`;
        
        return {
          date: dateSlug,
          slug: activitySlug,
        };
      }
      
      // Fallback for activities without date
      return {
        date: "unknown",
        slug: activitySlug,
      };
    });
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { date, slug } = await paramsPromise;
  const fullPath = `${date}/${slug}`;

  cacheTag("activities");
  cacheTag(`activity-${fullPath}`);
  cacheLife("activities");

  // getActivity searches by slug (reference title), not the full path
  const activity = await getActivity(slug);
  if (!activity) {
    return {
      title: "Not Found | Lyovson.com",
      description: "The requested activity could not be found",
    };
  }

  const referenceObj =
    typeof activity.reference === "object" && activity.reference !== null
      ? activity.reference
      : null;

  const title = referenceObj?.title
    ? `${activityTypeLabels[activity.activityType] || activity.activityType} ${referenceObj.title}`
    : "Activity";

  return {
    title: `${title} | Lyóvson.com`,
    description: `Activity: ${title}`,
    alternates: {
      canonical: `/activities/${fullPath}`,
    },
    openGraph: {
      title: `${title} | Lyóvson.com`,
      description: `Activity: ${title}`,
      url: `${getServerSideURL()}/activities/${fullPath}`,
      siteName: "Lyóvson.com",
      type: "article",
      publishedTime: activity.publishedAt || undefined,
      modifiedTime: activity.updatedAt || undefined,
    },
    twitter: {
      card: "summary",
      title: `${title} | Lyóvson.com`,
      description: `Activity: ${title}`,
    },
  };
}

