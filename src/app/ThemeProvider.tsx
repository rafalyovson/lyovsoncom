"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export { SessionProvider } from "next-auth/react";

export const ThemeProvider = ({
  children,
  attribute,
  defaultTheme,
  enableSystem,
  ...props
}: {
  children: ReactNode;
  attribute: "class" | "data-theme";
  defaultTheme: string;
  enableSystem: boolean;
  props?: any;
}) => {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};
