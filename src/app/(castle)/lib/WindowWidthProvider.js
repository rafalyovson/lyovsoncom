"use client";

import { createContext, useEffect, useState } from "react";
export { SessionProvider } from "next-auth/react";
// Contexts

export const WindowWidthContext = createContext({ windowWidth: 0 });

// Providers

export default function WindowWidthProvider({ children }) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WindowWidthContext.Provider value={{ windowWidth }}>
      {children}
    </WindowWidthContext.Provider>
  );
}
