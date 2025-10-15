"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";

export default function Scan() {
  const { t } = useI18n();
  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <h1 className="mb-2 text-2xl font-semibold">{t("pages.scan.title")}</h1>
      <p className="text-muted-foreground">{t("pages.scan.subtitle")}</p>
    </div>
  );
}
