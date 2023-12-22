"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
export { SessionProvider } from "next-auth/react";

export const ThemeProvider = ({ children, ...props }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
