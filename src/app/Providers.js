"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useEffect, useState } from "react";
export { SessionProvider } from "next-auth/react";
// Contexts

export const WindowWidthContext = createContext({ windowWidth: 0 });

export const ThemeProvider = ({ children, ...props }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

// Providers

export default function Providers({ children }) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WindowWidthContext.Provider value={{ windowWidth }}>
        {children}
      </WindowWidthContext.Provider>
    </ThemeProvider>
  );
}
