import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import type React from "react";
import { Suspense } from "react";
import { Grid, GridCardNav, SkeletonCard } from "@/components/grid";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import { getServerSideURL } from "@/utilities/getURL";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";
import "./globals.css";

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Monaco",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    "monospace",
  ],
  preload: true,
  adjustFontFallback: true,
});

const fontSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: [
    "ui-serif",
    "Georgia",
    "Cambria",
    "Times New Roman",
    "Times",
    "serif",
  ],
  preload: true,
  adjustFontFallback: true,
});

const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  preload: true,
  adjustFontFallback: true,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Draft mode check - enables preview functionality
  await draftMode();

  return (
    <html
      className={cn(fontMono.variable, fontSerif.variable, fontSans.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* Icon and manifest links are now managed by the metadata object below */}
        {/* Site-wide Organization Schema */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe - JSON.stringify on controlled structured data for SEO
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Lyóvson.com",
              url: getServerSideURL(),
              description:
                "Official website of Rafa and Jess Lyóvson",
              inLanguage: "en-US",
              potentialAction: {
                "@type": "SearchAction",
                target: `${getServerSideURL()}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "Lyóvson.com",
                url: getServerSideURL(),
                logo: {
                  "@type": "ImageObject",
                  url: `${getServerSideURL()}/logo-black.webp`,
                  width: 600,
                  height: 60,
                },
                sameAs: [
                  "https://x.com/rafalyovson",
                  "https://github.com/rafalyovson",
                ],
              },
              author: [
                {
                  "@type": "Person",
                  name: "Rafa Lyóvson",
                  url: `${getServerSideURL()}/rafa`,
                },
                {
                  "@type": "Person",
                  name: "Jess Lyóvson",
                  url: `${getServerSideURL()}/jess`,
                },
              ],
            }),
          }}
          type="application/ld+json"
        />
        {/* Performance hints */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin=""
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link href="//vercel.live" rel="dns-prefetch" />
        <link href="//vitals.vercel-insights.com" rel="dns-prefetch" />
      </head>
      <body>
        <Providers>
          <Grid>
            <Suspense fallback={<SkeletonCard />}>
              <GridCardNav />
            </Suspense>

            {children}
          </Grid>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
      <Script
        id="google-analytics-init"
        strategy="lazyOnload"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for GA initialization
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R4R3XJRY28');
          `,
        }}
      />
      <Script
        id="google-analytics-script"
        src="https://www.googletagmanager.com/gtag/js?id=G-R4R3XJRY28"
        strategy="lazyOnload"
      />
    </html>
  );
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: "Lyóvson.com",
    template: "%s | Lyóvson.com",
  },
  description:
    "Official website of Rafa and Jess Lyóvson",
  applicationName: "Lyóvson.com",
  authors: [
    { name: "Rafa Lyóvson", url: `${getServerSideURL()}/rafa` },
    { name: "Jess Lyóvson", url: `${getServerSideURL()}/jess` },
  ],
  generator: "Next.js",
  keywords: [
    "programming",
    "writing",
    "design",
    "philosophy",
    "research",
    "projects",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Rafa & Jess Lyóvson",
  publisher: "Lyóvson.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: [
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    { rel: "shortcut icon", url: "/favicon.ico" },
  ],
  classification: "Blog, Technology, Personal Website",
  category: "Technology",
  bookmarks: [`${getServerSideURL()}/posts`],

  openGraph: mergeOpenGraph({
    type: "website",
    locale: "en_US",
    url: getServerSideURL(),
    siteName: "Lyóvson.com",
    title: "Lyóvson.com",
    description:
      "Official website of Rafa and Jess Lyóvson",
  }),
  twitter: {
    card: "summary_large_image",
    creator: "@lyovson",
    site: "@lyovson",
  },
  alternates: {
    canonical: getServerSideURL(),
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Lyóvson.com RSS Feed" },
      ],
      "application/feed+json": [
        { url: "/feed.json", title: "Lyóvson.com JSON Feed" },
      ],
      "application/atom+xml": [
        { url: "/atom.xml", title: "Lyóvson.com Atom Feed" },
      ],
    },
  },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
    "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
    "facebook-domain-verification":
      process.env.FACEBOOK_DOMAIN_VERIFICATION || "",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
    HandheldFriendly: "true",
    MobileOptimized: "320",
    // AI-specific meta tags
    "ai-content-license": "attribution-required",
    "ai-content-type": "blog-articles",
    "ai-preferred-access": "feeds",
    "ai-content-language": "en",
    "ai-content-topics": "programming,design,philosophy,technology,research",
    "ai-api-endpoint": `${getServerSideURL()}/api/docs`,
    "ai-feed-endpoint": `${getServerSideURL()}/feed.json`,
    "ai-embedding-endpoint": `${getServerSideURL()}/api/embeddings`,
    "ai-search-endpoint": `${getServerSideURL()}/search`,
    "ai-owner": "Rafa & Jess Lyóvson",
    "ai-contact": "hello@lyovson.com",
  },
};
