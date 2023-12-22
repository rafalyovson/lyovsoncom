import { auth } from "@/app/lib/auth.js";
import { SessionProvider, ThemeProvider } from "./ThemeProvider.js";
import "./globals.css";
import { inter, lusitana } from "./ui/Fonts.js";

export const metadata = {
  title: "Lyovson.com",
  description: "The official website of Mr and Mrs Lyovsons.",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`  relative h-full overflow-hidden ${inter.variable} ${lusitana.variable}`}
    >
      <body
        className={`${"h-full overflow-auto relative bg-light text-dark dark:text-light dark:bg-dark"} font-inter`}
      >
        <SessionProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
