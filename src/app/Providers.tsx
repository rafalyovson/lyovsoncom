"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { createContext, useEffect, useState } from "react";
export { SessionProvider } from "next-auth/react";
// Contexts

export const UserContext = createContext({
  user: "Both",
  setUser: (user: string) => {},
});

export const WindowWidthContext = createContext({ windowWidth: 0 });

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

// Providers

export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(() => "Both");
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
        <UserContext.Provider value={{ user, setUser }}>
          {children}
        </UserContext.Provider>
      </WindowWidthContext.Provider>
    </ThemeProvider>
  );
}
