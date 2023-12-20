"use client";

import { createContext, useState } from "react";
export { SessionProvider } from "next-auth/react";

export const UserContext = createContext({
  user: "Both",
  setUser: (user) => {},
});

export default function UserProvider({ children }) {
  const [user, setUser] = useState(() => "Both");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
