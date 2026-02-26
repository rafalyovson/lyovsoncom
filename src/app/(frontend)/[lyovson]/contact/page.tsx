import { Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { GridCard, GridCardSection } from "@/components/grid";
import { getLyovsonProfile } from "@/utilities/get-lyovson-profile";
import { getServerSideURL } from "@/utilities/getURL";
import { SOCIAL_ICON_MAP } from "@/utilities/social-icons";

interface PageProps {
  params: Promise<{ lyovson: string }>;
}

const PUBLIC_EMAIL = "hello@lyovson.com";

export default async function Page({ params }: PageProps) {
  const { lyovson: username } = await params;
  const user = await getLyovsonProfile(username);

  if (!user) {
    return notFound();
  }

  return (
    <>
      <h1 className="sr-only">{user.name} contact</h1>

      <GridCard
        className="g2:col-start-2 g2:col-end-3 g3:col-end-4 g2:row-auto g2:row-start-2 aspect-auto h-auto g3:w-[var(--grid-card-2x1)]"
        interactive={false}
      >
        <GridCardSection className="col-span-3 row-span-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="glass-text font-bold text-2xl">
              Contact {user.name}
            </h2>
            <p className="glass-text-secondary mt-2 text-sm">
              Reach out via public channels below.
            </p>
          </div>
        </GridCardSection>

        <GridCardSection className="col-span-3 row-span-2 p-6">
          <ul className="flex h-full flex-col justify-center gap-4">
            <li>
              <Link
                className="glass-text glass-interactive flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)]"
                href={`mailto:${PUBLIC_EMAIL}`}
              >
                <Mail aria-hidden="true" className="h-5 w-5" />
                <span>{PUBLIC_EMAIL}</span>
              </Link>
            </li>

            {(user.socialLinks || []).map((link) => {
              const iconConfig = SOCIAL_ICON_MAP[link.platform];
              if (!iconConfig) {
                return null;
              }

              const Icon = iconConfig.icon;

              return (
                <li key={link.url}>
                  <a
                    className="glass-text glass-interactive flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)]"
                    href={link.url}
                    rel="noopener"
                    target="_blank"
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                    <span>{iconConfig.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </GridCardSection>
      </GridCard>
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lyovson: username } = await params;
  const user = await getLyovsonProfile(username);

  if (!user) {
    return {
      metadataBase: new URL(getServerSideURL()),
      title: "Not Found | Lyóvson.com",
      description: "The requested page could not be found.",
    };
  }

  const name = user.name || username;
  const title = `${name} Contact | Lyóvson.com`;
  const description = `Public contact links for ${name}.`;

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    alternates: {
      canonical: `/${username}/contact`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${username}/contact`,
    },
    twitter: {
      card: "summary",
      title,
      description,
      creator: "@lyovson",
      site: "@lyovson",
    },
  };
}
