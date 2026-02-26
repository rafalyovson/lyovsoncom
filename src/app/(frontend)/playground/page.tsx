import config from "@payload-config";
import type { Metadata } from "next";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { Suspense } from "react";
import {
  GridCard,
  GridCardSection,
  GridCardUserSocial,
  SkeletonCard,
} from "@/components/grid";
import { getServerSideURL } from "@/utilities/getURL";

export default function SuspensePlayground() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <Playground />
    </Suspense>
  );
}

async function Playground() {
  const headers = await nextHeaders();
  const payload = await getPayload({ config });
  const user = await payload.auth({ headers });

  if (!user?.user) {
    redirect("/admin");
  }

  return (
    <>
      <h1 className="sr-only">Playground - Interactive Demos</h1>

      <GridCard>
        <GridCardSection className="col-start-1 col-end-4 row-start-1 row-end-4 grid place-items-center">
          {`Welcome, ${user.user?.name} `}
        </GridCardSection>
      </GridCard>

      <GridCardUserSocial />
    </>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: "Playground - Interactive Demos | Lyóvson.com",
  description:
    "Explore interactive demos, experiments, and test features on the Lyóvson.com playground. Try out new components and functionality.",
  keywords: [
    "playground",
    "interactive demos",
    "experiments",
    "test features",
    "web development",
  ],
  alternates: {
    canonical: "/playground",
  },
  openGraph: {
    siteName: "Lyóvson.com",
    title: "Playground - Interactive Demos",
    description:
      "Explore interactive demos, experiments, and test features on the Lyóvson.com playground.",
    type: "website",
    url: "/playground",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Playground - Interactive Demos - Lyóvson.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Playground - Interactive Demos",
    description: "Explore interactive demos and experiments on Lyóvson.com.",
    creator: "@lyovson",
    site: "@lyovson",
    images: [
      {
        url: "/og-image.png",
        alt: "Playground - Interactive Demos - Lyóvson.com",
        width: 1200,
        height: 630,
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};
