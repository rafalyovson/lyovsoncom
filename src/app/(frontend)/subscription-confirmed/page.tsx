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

  return <GridCardSubscribeConfirmed />;
}

export const metadata: Metadata = {
  title: "Subscription Confirmed - Thank You | Lyovson.com",
  description:
    "Thank you for subscribing to Lyovson.com! Your subscription has been confirmed and you will receive updates about our latest posts and projects.",
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
    title: "Subscription Confirmed - Thank You",
    description:
      "Thank you for subscribing to Lyovson.com! Your subscription has been confirmed.",
    type: "website",
    url: "/subscription-confirmed",
  },
  twitter: {
    card: "summary",
    title: "Subscription Confirmed - Thank You",
    description: "Thank you for subscribing to Lyovson.com updates!",
    site: "@lyovson",
  },
  robots: {
    index: false, // Don't index transactional pages
    follow: false,
    noarchive: true,
  },
};
