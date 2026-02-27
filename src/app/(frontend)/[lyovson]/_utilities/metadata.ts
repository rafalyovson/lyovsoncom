import type { Metadata } from "next";
import { getServerSideURL } from "@/utilities/getURL";

const BRAND_NAME = "Lyóvson.com";
const DEFAULT_OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Lyóvson.com - Writing, Projects & Research",
} as const;

interface LyovsonMetadataOptions {
  canonicalPath: string;
  description: string;
  nextPath?: string;
  openGraphType?: "website" | "profile";
  prevPath?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  robots?: Metadata["robots"];
  title: string;
  twitterCard?: "summary" | "summary_large_image";
}

function getSocialTitle(title: string): string {
  if (
    title.toLowerCase().includes("lyovson.com") ||
    title.toLowerCase().includes(BRAND_NAME.toLowerCase())
  ) {
    return title;
  }

  return `${title} | ${BRAND_NAME}`;
}

export function buildLyovsonMetadata({
  canonicalPath,
  description,
  nextPath,
  openGraphType = "website",
  prevPath,
  profile,
  robots,
  title,
  twitterCard = "summary_large_image",
}: LyovsonMetadataOptions): Metadata {
  const socialTitle = getSocialTitle(title);

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      ...(prevPath && { prev: prevPath }),
      ...(nextPath && { next: nextPath }),
    },
    openGraph: {
      siteName: BRAND_NAME,
      title: socialTitle,
      description,
      type: openGraphType,
      url: canonicalPath,
      images: [DEFAULT_OG_IMAGE],
      ...(openGraphType === "profile" && {
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        username: profile?.username,
      }),
    },
    twitter: {
      card: twitterCard,
      title: socialTitle,
      description,
      creator: "@lyovson",
      site: "@lyovson",
      images: [DEFAULT_OG_IMAGE],
    },
    ...(robots && { robots }),
  };
}

export function buildLyovsonNotFoundMetadata(): Metadata {
  return {
    metadataBase: new URL(getServerSideURL()),
    title: "Not Found",
    description: "The requested page could not be found.",
    robots: {
      index: false,
      follow: false,
    },
  };
}
