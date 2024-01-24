"use client";

import { createContext, useState } from "react";

export const UserModeContext = createContext({
  user: "Both",
  setUser: (_: string) => {},
});

export default function UserModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(() => "Both");

  return (
    <UserModeContext.Provider
      value={{ user, setUser: (value: string) => setUser(value) }}
    >
      {children}
    </UserModeContext.Provider>
  );
}
