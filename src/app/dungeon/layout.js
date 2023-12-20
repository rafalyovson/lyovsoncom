import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/db.js";

export default async function Layout({ children }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });

  return (
    <>
      {children}

      <SpeedInsights />
      <Analytics />
    </>
  );
}
