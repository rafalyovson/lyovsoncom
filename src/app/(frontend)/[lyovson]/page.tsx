import configPromise from "@payload-config";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { getPayload } from "payload";
import { GridCardUser } from "@/components/grid/card/user";
import { JsonLd } from "@/components/JsonLd";
import RichText from "@/components/RichText";
import type { Lyovson, Media } from "@/payload-types";
import { generatePersonSchema } from "@/utilities/generate-json-ld";
import { getAuthorPosts } from "@/utilities/get-author-posts";
import { getServerSideURL } from "@/utilities/getURL";

type PageProps = {
  params: Promise<{ lyovson: string }>;
};

export default async function Page({ params }: PageProps) {
  "use cache";

  const { lyovson: username } = await params;

  // Add cache tags for lyovson's posts
  cacheTag("posts");
  cacheTag("lyovsons");
  cacheTag(`lyovson-${username}`);
  cacheLife("authors");

  const response = await getAuthorPosts(username);

  if (!response) {
    return notFound();
  }

  const { user } = response;

  // Extract avatar URL for schema
  const avatarMedia: Media | null =
    user?.avatar && typeof user.avatar === "object"
      ? (user.avatar as Media)
      : null;
  const avatarUrl = avatarMedia?.url
    ? `${getServerSideURL()}${avatarMedia.url}`
    : undefined;

  // Extract social links
  const socialLinks = {
    twitter: user.socialLinks?.find((s) => s.platform === "x")?.url,
    github: user.socialLinks?.find((s) => s.platform === "github")?.url,
    linkedin: user.socialLinks?.find((s) => s.platform === "linkedin")?.url,
  };

  // Generate Person schema
  const personSchema = generatePersonSchema({
    name: user.name,
    username: user.username,
    bio: user.quote || undefined,
    avatarUrl,
    socialLinks,
  });

  return (
    <>
      <JsonLd data={personSchema} />

      <GridCardUser
        className={
          "g2:col-start-2 g3:col-start-2 g2:col-end-3 g3:col-end-4 g2:row-start-1 g2:row-end-2 g4:self-start"
        }
        user={user}
      />
      {user?.bio && (
        <article className="glass-card glass-interactive g2:col-start-2 g2:col-end-3 g3:col-end-4 g2:row-auto g2:row-start-2 g3:w-[816px] w-[400px] rounded-lg p-6">
          <div className="prose prose-lg glass-stagger-3 prose-headings:glass-text prose-p:glass-text prose-a:glass-text prose-li:glass-text prose-blockquote:glass-text-secondary max-w-none">
            <RichText
              className="h-full"
              content={user.bio}
              enableGutter={false}
              enableProse={true}
            />
          </div>
        </article>
      )}
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lyovson: username } = await params;
  const response = await getAuthorPosts(username);

  if (!response) {
    return {
      title: "Not Found",
    };
  }

  const { user } = response;
  const name = user.name || username;
  const description =
    user.quote ||
    `Posts, articles, and insights by ${name}. Explore their thoughts and creative work.`;

  const avatarMedia: Media | null =
    user?.avatar && typeof user.avatar === "object"
      ? (user.avatar as Media)
      : null;

  const imageUrl = avatarMedia?.url || null;

  return {
    title: `${name} - Posts & Writing | Lyovson.com`,
    description,
    keywords: [
      name,
      "writing",
      "articles",
      "blog posts",
      "insights",
      "Lyovson",
    ],
    alternates: {
      canonical: `/${username}`,
    },
    openGraph: {
      title: `${name} - Posts & Writing`,
      description,
      type: "profile",
      url: `/${username}`,
      firstName: name.split(" ")[0],
      lastName: name.split(" ").slice(1).join(" ") || undefined,
      username,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 400,
              height: 400,
              alt: `${name}'s avatar`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Posts & Writing`,
      description,
      creator: "@lyovson",
      site: "@lyovson",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: `${name}'s avatar`,
            },
          ]
        : undefined,
    },
    other: {
      "profile:username": username,
      "article:author": name,
    },
  };
}

export async function generateStaticParams() {
  "use cache";
  cacheTag("lyovsons");
  cacheLife("static"); // Build-time data doesn't change often

  const payload = await getPayload({ config: configPromise });
  const lyovsons = await payload.find({
    collection: "lyovsons",
    limit: 100,
  });

  return lyovsons.docs
    .filter(
      (lyovson): lyovson is Lyovson =>
        typeof lyovson === "object" &&
        "username" in lyovson &&
        !!lyovson.username
    )
    .map((lyovson) => ({
      lyovson: lyovson.username as string,
    }));
}
