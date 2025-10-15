"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-shell/AppSidebar";
import { LanguageProvider, useI18n } from "@/components/i18n/LanguageProvider";

function Header() {
  const { t, locale } = useI18n();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="font-bold">{t("app.title")}</div>
    </header>
  );
}

export default function AppRoot({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
