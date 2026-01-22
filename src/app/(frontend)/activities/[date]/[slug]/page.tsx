import {
  Book,
  Building2,
  Film,
  Gamepad2,
  Info,
  Mic,
  Music,
  Trophy,
  User,
  Video,
} from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";

import { GridCard, GridCardActivityReview, GridCardHeroActivity, GridCardSection } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import RichText from "@/components/RichText";
import { cn } from "@/lib/utils";
import type { Activity, Reference } from "@/payload-types";
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

export const dynamicParams = true;

const activityTypeLabels: Record<string, string> = {
  read: "Read",
  watch: "Watched",
  listen: "Listened",
  play: "Played",
  visit: "Visited",
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

function getReviews(activity: Activity) {
  if (!activity.reviews || activity.reviews.length === 0) {
    return [];
  }

  return activity.reviews.filter((review) => {
    // Only include reviews that have at least a note or rating
    const hasNote = review.note && review.note.trim().length > 0;
    const hasRating = review.rating !== null && review.rating !== undefined;
    return hasNote || hasRating;
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
  const reviews = getReviews(activity);

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

  // Get reference info for icon
  const referenceType = referenceObj?.type || "other";
  const activityLabel = activityTypeLabels[activity.activityType] || activity.activityType;

  // Get participant details for display (filter to objects and dedupe by id)
  const participantObjects = activity.participants?.filter(
    (p): p is Exclude<typeof p, number> => typeof p === "object" && p !== null
  ) || [];
  const participants = participantObjects.filter(
    (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
  );

  // Format finish date
  const finishDate = activity.finishedAt ? new Date(activity.finishedAt) : null;
  const finishDay = finishDate ? finishDate.getDate() : null;
  const finishMonthYear = finishDate
    ? finishDate.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    : null;

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <GridCardHeroActivity activity={activity} title={pageTitle} />

      {/* Info Card - Left side, row 2 on tablet (beside hero's second row) */}
      <GridCard
        className={cn(
          "col-start-1 col-end-2 row-start-4 row-end-5",
          "g2:col-start-1 g2:col-end-2 g2:row-start-2 g2:row-end-3",
          "g3:col-start-1 g3:col-end-2 g3:row-start-2 g3:row-end-3"
        )}
      >
        {/* Top section - Info text spanning rows 1-2, all columns */}
        <GridCardSection className="col-start-1 col-end-4 row-start-1 row-end-3 flex flex-col justify-center overflow-hidden px-6 py-4">
          {activity.notes ? (
            <div className="relative">
              {/* Info icon indicator */}
              <Info
                aria-hidden="true"
                className="glass-text-secondary absolute -top-1 left-0 h-4 w-4 opacity-50"
              />
              <div className="prose prose-sm glass-stagger-1 prose-headings:glass-text prose-p:glass-text prose-a:glass-text prose-li:glass-text prose-blockquote:glass-text-secondary max-w-none pl-2 pt-4">
                <RichText
                  className="h-full"
                  content={activity.notes}
                  enableGutter={false}
                  enableProse={true}
                />
              </div>
            </div>
          ) : (
            <p className="glass-text-secondary text-center text-sm">No additional info</p>
          )}
        </GridCardSection>

        {/* Bottom row - Column 1: Activity type icon + label */}
        <GridCardSection className="col-start-1 col-end-2 row-start-3 row-end-4 flex flex-col items-center justify-center gap-1">
          {referenceType === "book" && <Book aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "movie" && <Film aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "tvShow" && <Film aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "videoGame" && <Gamepad2 aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "music" && <Music aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "podcast" && <Mic aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "series" && <Book aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "person" && <User aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "company" && <Building2 aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "video" && <Video aria-hidden="true" className="glass-text h-6 w-6" />}
          {referenceType === "match" && <Trophy aria-hidden="true" className="glass-text h-6 w-6" />}
          {!["book", "movie", "tvShow", "videoGame", "music", "podcast", "series", "person", "company", "video", "match"].includes(referenceType) && <Info aria-hidden="true" className="glass-text h-6 w-6" />}
          <span className="glass-text-secondary text-xs font-medium">{activityLabel}</span>
        </GridCardSection>

        {/* Bottom row - Column 2: Participants with icons */}
        <GridCardSection className="col-start-2 col-end-3 row-start-3 row-end-4 flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex flex-col items-center gap-0.5">
                <User aria-hidden="true" className="glass-text h-5 w-5" />
                <span className="glass-text-secondary text-[10px]">
                  {participant.name?.split(" ").at(0) || "?"}
                </span>
              </div>
            ))}
          </div>
        </GridCardSection>

        {/* Bottom row - Column 3: Finish date */}
        <GridCardSection className="col-start-3 col-end-4 row-start-3 row-end-4 flex flex-col items-center justify-center">
          {finishDate ? (
            <time className="flex flex-col items-center" dateTime={activity.finishedAt || ""}>
              <span className="glass-text text-2xl font-bold leading-none">{finishDay}</span>
              <span className="glass-text-secondary text-[10px] uppercase tracking-wider">
                {finishMonthYear}
              </span>
            </time>
          ) : (
            <span className="glass-text-secondary text-xs">—</span>
          )}
        </GridCardSection>
      </GridCard>

      {/* Reviews - Right side, side by side on desktop */}
      {reviews.map((review, index) => {
        // On g3 (desktop): place side by side (2 per row) in columns 2-3
        // Column 2 for even indices (0, 2, 4...), Column 3 for odd indices (1, 3, 5...)
        const isEven = index % 2 === 0;

        return (
          <GridCardActivityReview
            key={`review-${typeof review.lyovson === "object" ? review.lyovson.id : review.lyovson}-${index}`}
            review={review}
            className={cn(
              "col-start-1 col-end-2",
              "g2:col-start-2 g2:col-end-3",
              isEven
                ? "g3:col-start-2 g3:col-end-3"
                : "g3:col-start-3 g3:col-end-4"
            )}
          />
        );
      })}
    </>
  );
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

