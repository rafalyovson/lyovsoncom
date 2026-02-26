import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { GridCardEmptyState } from "@/components/grid";
import { GridCardProject } from "@/components/grid/card/project";
import { JsonLd } from "@/components/JsonLd";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getLyovsonPortfolioProjects } from "@/utilities/get-lyovson-feed";
import { getServerSideURL } from "@/utilities/getURL";

interface PageProps {
  params: Promise<{ lyovson: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lyovson: username } = await params;

  const response = await getLyovsonPortfolioProjects(username);
  if (!response) {
    return notFound();
  }

  const { user, projects } = response;

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${user.name} - Portfolio`,
    description: `Project portfolio inferred from published work by ${user.name}.`,
    url: `${getServerSideURL()}/${username}/portfolio`,
    itemCount: projects.length,
    items: projects
      .filter((project) => project.slug)
      .map((project) => ({
        url: `${getServerSideURL()}/projects/${project.slug}`,
      })),
  });

  return (
    <>
      <h1 className="sr-only">{user.name} portfolio</h1>
      <JsonLd data={collectionPageSchema} />

      {projects.length > 0 ? (
        projects.map((project) => (
          <GridCardProject key={project.id} project={project} />
        ))
      ) : (
        <GridCardEmptyState
          description={`No project-linked posts were found for ${user.name} yet.`}
          title="Portfolio Coming Soon"
        />
      )}
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lyovson: username } = await params;

  const response = await getLyovsonPortfolioProjects(username);
  if (!response) {
    return {
      metadataBase: new URL(getServerSideURL()),
      title: "Not Found | Lyóvson.com",
      description: "The requested page could not be found.",
    };
  }

  const name = response.user.name || username;
  const title = `${name} Portfolio | Lyóvson.com`;
  const description = `Project portfolio inferred from published work by ${name}.`;

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    alternates: {
      canonical: `/${username}/portfolio`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${username}/portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@lyovson",
      site: "@lyovson",
    },
  };
}
