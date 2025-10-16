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
  GridCardSubscribeConfirmed,
  GridCardUserSocial,
  SkeletonCard,
} from "@/components/grid";
import { SubscribeDemoStates } from "@/components/grid/card/subscribe/demo-states";

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

      <GridCard>
        <GridCardSection className="col-span-3 row-span-3 flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="glass-text font-bold text-2xl">
            Subscribe Card States Demo
          </h2>
          <p className="glass-text-secondary text-sm">
            Form, Success, Error, Info, and Confirmed states
          </p>
        </GridCardSection>
      </GridCard>

      <SubscribeDemoStates />

      <GridCardSubscribeConfirmed />

      <GridCard>
        <GridCardSection className="col-span-3 row-span-3 flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="glass-text font-bold text-2xl">Live Subscribe Card</h2>
          <p className="glass-text-secondary text-sm">
            This one actually works
          </p>
        </GridCardSection>
      </GridCard>

      <GridCardSubscribe
        description="Get notified about new posts and projects"
        handleSubmit={createContactAction}
        title="Subscribe to updates"
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
