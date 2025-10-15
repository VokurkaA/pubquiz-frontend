"use client";

import AddQuizForm from "@/components/forms/AddQuizForm";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function AddQuiz() {
  const { t } = useI18n();
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">{t("pages.addQuiz.title")}</h1>
      <AddQuizForm />
    </div>
  );
}
