"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

export const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      scriptProps={{ type: "application/json" }}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
