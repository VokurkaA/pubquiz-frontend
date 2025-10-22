"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Stats() {
  const { t } = useI18n();
  return <div className="p-4 text-2xl font-semibold">
    {t("pages.stats.title")}
    <Card className="flex-row"> 
      Dummy otazka:
      <CardContent className="flex flex-row flex-1 gap-4 justify-center">
        <p className="text-green-600">A: 5/9</p>
        <p className="text-red-600">B: 3/9</p>
        <p className="text-red-600">C: 1/9</p>
        <p className="text-red-600">D: 0/9</p>
        <p>{t("pages.stats.subtitle")}</p>
        </CardContent>
    </Card>
  </div>;
}
