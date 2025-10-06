import { ThemeProvider } from "next-themes";
import type React from "react";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};
