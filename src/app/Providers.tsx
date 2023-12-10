"use client";

import { createContext, useEffect, useState } from "react";

// Contexts

export const UserContext = createContext({
  user: "Both",
  setUser: (user: string) => {},
});

export const WindowWidthContext = createContext({ windowWidth: 0 });

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
    <WindowWidthContext.Provider value={{ windowWidth }}>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </WindowWidthContext.Provider>
  );
}
