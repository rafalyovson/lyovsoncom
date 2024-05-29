import { inter, lusitana } from "@/assets/Fonts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Main from "@/components/Main";
import { auth } from "@/data/auth";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider, ThemeProvider } from "./ThemeProvider";
import "./globals.css";

export const metadata = {
  title: "Lyovson.com",
  description: "The official website of Mr and Mrs Lyovsons.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`  relative h-full overflow-hidden ${inter?.variable} ${lusitana?.variable}`}
    >
      <body className={`${"h-full overflow-auto relative "} font-inter`}>
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <Main>{children}</Main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
