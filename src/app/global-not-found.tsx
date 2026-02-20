import type { Metadata } from "next";
import { getServerSideURL } from "@/utilities/getURL";

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: "404: This page could not be found.",
  description: "The requested page could not be found.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontFamily:
              "system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif",
            height: "100dvh",
            justifyContent: "center",
            margin: 0,
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", margin: 0 }}>404</h1>
            <p style={{ marginTop: "0.5rem", opacity: 0.75 }}>
              This page could not be found.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
