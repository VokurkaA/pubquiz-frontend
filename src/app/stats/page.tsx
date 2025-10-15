"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";

export default function Stats() {
  const { t } = useI18n();
  return <div className="p-4 text-2xl font-semibold">{t("pages.stats.title")}</div>;
}
