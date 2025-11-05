"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";

export default function Stats() {
  const { t } = useI18n();
  return <div className="p-4 text-2xl font-semibold">
    {t("pages.stats.title")}
    <Collapsible>
      <CollapsibleTrigger>
      <Card className="flex-row">
        Quiz 1
        </Card>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Card className="flex-row">
          Dummy otazka 1:
          <CardContent className="flex flex-row flex-1 gap-4 justify-center">
            <p className="text-green-600">A: 5/9</p>
            <p className="text-red-600">B: 3/9</p>
            <p className="text-red-600">C: 1/9</p>
            <p className="text-red-600">D: 0/9</p>
          </CardContent>
        </Card>
        <Card className="flex-row">
          Dummy otazka 2:
          <CardContent className="flex flex-row flex-1 gap-4 justify-center">
            <p className="text-green-600">A: 5/9</p>
            <p className="text-red-600">B: 3/9</p>
            <p className="text-red-600">C: 1/9</p>
            <p className="text-red-600">D: 0/9</p>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>

        <Collapsible>
      <CollapsibleTrigger>
            <Card className="flex-row">
        Quiz 2
        </Card>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Card className="flex-row">
          Dummy otazka 1:
          <CardContent className="flex flex-row flex-1 gap-4 justify-center">
            <p className="text-green-600">A: 5/9</p>
            <p className="text-red-600">B: 3/9</p>
            <p className="text-red-600">C: 1/9</p>
            <p className="text-red-600">D: 0/9</p>
          </CardContent>
        </Card>
        <Card className="flex-row">
          Dummy otazka 2:
          <CardContent className="flex flex-row flex-1 gap-4 justify-center">
            <p className="text-green-600">A: 5/9</p>
            <p className="text-red-600">B: 3/9</p>
            <p className="text-red-600">C: 1/9</p>
            <p className="text-red-600">D: 0/9</p>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
<br></br>
    <Card className="flex-row">
      Dummy samostatna otazka 3:
      <CardContent className="flex flex-row flex-1 gap-4 justify-center">
        <p className="text-green-600">A: 5/9</p>
        <p className="text-red-600">B: 3/9</p>
        <p className="text-red-600">C: 1/9</p>
        <p className="text-red-600">D: 0/9</p>
      </CardContent>
    </Card>
  </div>;
}
