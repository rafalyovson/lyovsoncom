import type { Metadata } from "next";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { GridCardSubscribeConfirmed } from "@/components/grid";

export default async function SubscriptionConfirmed() {
  "use cache";
  cacheTag("subscription-confirmed");
  cacheLife("static"); // Static confirmation page

  return (
    <>
      <h1 className="sr-only">Subscription Confirmed - Thank You</h1>
      <GridCardSubscribeConfirmed />
    </>
  );
}

export const metadata: Metadata = {
  title: "Subscription Confirmed - Thank You | Lyóvson.com",
  description:
    "Thank you for subscribing to Lyóvson.com! Your subscription has been confirmed and you will receive updates about our latest posts and projects.",
  keywords: [
    "subscription confirmed",
    "newsletter",
    "thank you",
    "email updates",
  ],
  alternates: {
    canonical: "/subscription-confirmed",
  },
  openGraph: {
    siteName: "Lyóvson.com",
    title: "Subscription Confirmed - Thank You",
    description:
      "Thank you for subscribing to Lyóvson.com! Your subscription has been confirmed.",
    type: "website",
    url: "/subscription-confirmed",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Subscription Confirmed - Thank You - Lyóvson.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Subscription Confirmed - Thank You",
    description: "Thank you for subscribing to Lyóvson.com updates!",
    site: "@lyovson",
    creator: "@lyovson",
    images: [
      {
        url: "/og-image.png",
        alt: "Subscription Confirmed - Thank You - Lyóvson.com",
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: false, // Don't index transactional pages
    follow: false,
    noarchive: true,
  },
};
