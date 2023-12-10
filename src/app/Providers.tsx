"use client";

import { createContext, useState } from "react";

export const UserContext = createContext({
  user: "Both",
  setUser: (user: string) => {},
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(() => "Both");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
