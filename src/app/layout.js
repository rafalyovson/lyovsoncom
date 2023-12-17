import { auth } from "@/app/lib/auth.js";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers, { SessionProvider } from "./Providers.js";
import "./globals.css";
import { inter, lusitana } from "./ui/Fonts.js";
import Footer from "./ui/Footer.js";
import Header from "./ui/Header.js";
import Main from "./ui/Main.js";

export const metadata = {
  title: "Lyovson.com",
  description: "The official website of Mr and Mrs Lyovsons.",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${lusitana.variable}  relative h-full overflow-hidden`}
    >
      <body
        className={`${"h-full overflow-auto relative bg-light text-dark dark:text-light dark:bg-dark"} font-inter`}
      >
        <SessionProvider session={session}>
          <Providers>
            <Header />
            <Main>{children}</Main>
            <Footer />
          </Providers>
        </SessionProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
