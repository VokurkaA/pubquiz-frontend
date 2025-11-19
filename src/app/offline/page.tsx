"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function OfflinePage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-xl p-4">
      <Card className="grid gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold">{t("pages.offline.title")}</h1>
        <p className="text-muted-foreground">{t("pages.offline.description")}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => window.location.reload()}>{t("pages.offline.retry")}</Button>
          <Button variant="secondary" asChild>
            <Link href="/">{t("pages.offline.goHome")}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
