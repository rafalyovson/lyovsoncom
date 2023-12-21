"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
export { SessionProvider } from "next-auth/react";
// Contexts

export const ThemeProvider = ({ children, ...props }) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

// Providers

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
