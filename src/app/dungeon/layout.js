import Header from "@/app/dungeon/ui/Header.js";
import { auth } from "@/app/lib/auth.js";
import { prisma } from "@/app/lib/prisma.js";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { redirect } from "next/navigation";

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
      <Header user={user} />

      {children}
      <SpeedInsights />
      <Analytics />
    </>
  );
}
