import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import type { Lyovson } from "@/payload-types";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lyovson: string }>;
};

type FontClass = "font-sans" | "font-serif" | "font-mono";

const fontMap: Record<string, FontClass> = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

export default async function Layout({ children, params }: LayoutProps) {
  const { lyovson: username } = await params;

  const payload = await getPayload({ config: configPromise });

  // Fetch lyovson to get font preference
  const lyovsonResult = await payload.find({
    collection: "lyovsons",
    where: {
      username: {
        equals: username,
      },
    },
    limit: 1,
  });

  if (!lyovsonResult?.docs?.[0]) {
    return notFound();
  }

  const lyovson = lyovsonResult.docs[0] as Lyovson;
  const fontClass = fontMap[lyovson.font || "sans"] || "font-sans";

  return <div className={`contents ${fontClass}`}>{children}</div>;
}
