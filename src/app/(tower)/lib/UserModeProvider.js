"use client";

import { createContext, useState } from "react";

export const UserModeContext = createContext({
  user: "Both",
  setUser: () => {},
});

export default function UserModeProvider({ children }) {
  const [user, setUser] = useState(() => "Both");

  return (
    <UserModeContext.Provider value={{ user, setUser }}>
      {children}
    </UserModeContext.Provider>
  );
}
