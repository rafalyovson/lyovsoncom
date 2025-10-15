import config from "@payload-config";
import type { Metadata } from "next";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { Suspense } from "react";
import { createContactAction } from "@/actions/create-contact-action";
import {
  GridCard,
  GridCardSection,
  GridCardSubscribe,
  GridCardUserSocial,
  SkeletonCard,
} from "@/components/grid";

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
      <GridCard>
        <GridCardSection className="col-start-1 col-end-4 row-start-1 row-end-4 grid place-items-center">
          {`Welcome, ${user.user?.name} `}
        </GridCardSection>
      </GridCard>
      <GridCardSubscribe
        description="Stay up to date with our latest posts and projects."
        emoji="👋"
        handleSubmit={createContactAction}
        title="Subscribe to Lyovson.com"
      />

      <GridCardUserSocial />
    </>
  );
}

export const metadata: Metadata = {
  title: "Playground - Interactive Demos | Lyovson.com",
  description:
    "Explore interactive demos, experiments, and test features on the Lyovson.com playground. Try out new components and functionality.",
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
    title: "Playground - Interactive Demos",
    description:
      "Explore interactive demos, experiments, and test features on the Lyovson.com playground.",
    type: "website",
    url: "/playground",
  },
  twitter: {
    card: "summary",
    title: "Playground - Interactive Demos",
    description: "Explore interactive demos and experiments on Lyovson.com.",
    creator: "@lyovson",
    site: "@lyovson",
  },
  robots: {
    index: true,
    follow: true,
  },
};
