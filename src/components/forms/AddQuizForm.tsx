"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizFormSchema, type QuizFormValues } from "@/lib/schemas/quiz";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AddQuizFormProps = {
  className?: string;
  onSubmit?: (data: QuizFormValues) => Promise<void> | void;
};

const makeDefaultAnswer = () => ({ text: "" });
const defaultQuestion = {
  questionText: "",
  answers: [makeDefaultAnswer(), makeDefaultAnswer()],
  correctIndex: 0,
};

export function AddQuizForm({ className, onSubmit }: AddQuizFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      name: "",
      questions: [defaultQuestion],
    },
    mode: "onBlur",
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control: form.control, name: "questions" });

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      questions: values.questions.map((q) => ({
        question_text: q.questionText,
        answers: q.answers.map((a, idx) => ({ text: a.text, isCorrect: idx === q.correctIndex })),
      })),
    };

    try {
      await api.createQuiz(payload);
      if (onSubmit) await onSubmit(values);
      toast.success(t("ui.common.saved") ?? "Quiz created");
      // Optionally navigate to play or scan; for now, go to /scan
      router.push("/scan");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(err);
      toast.error(message || "Failed to create quiz");
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("grid gap-6", className)}>
        <Card className="grid gap-4 p-4 sm:p-5 md:p-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("addQuizForm.nameLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("addQuizForm.namePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <div className="grid gap-4">
          {questionFields.map((qField, qIndex) => (
            <Card key={qField.id} className="grid gap-4 p-4 sm:p-5 md:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-sm font-medium">
                  {t("addQuizForm.questionLabel", { n: qIndex + 1 })}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                  disabled={questionFields.length <= 1}
                  className="hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto"
                >
                  {t("addQuizForm.removeQuestion")}
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`questions.${qIndex}.questionText`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("addQuizForm.questionTextLabel")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("addQuizForm.questionTextLabel")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Answers */}
              <AnswersEditor parentIndex={qIndex} />
            </Card>
          ))}

          <div>
            <Button
              type="button"
              variant="outline"
              onClick={() => appendQuestion(defaultQuestion)}
              className="w-full sm:w-auto"
            >
              {t("addQuizForm.addQuestion")}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">
            {t("addQuizForm.create")}
          </Button>
          <Button
            type="reset"
            variant="secondary"
            onClick={() => form.reset()}
            className="w-full sm:w-auto"
          >
            {t("addQuizForm.reset")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function AnswersEditor({ parentIndex }: { parentIndex: number }) {
  const { t } = useI18n();
  const form = useFormContextSafe<QuizFormValues>();
  const {
    fields: answerFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({ control: form.control, name: `questions.${parentIndex}.answers` as const });

  const canAdd = answerFields.length < 4;
  const canRemove = answerFields.length > 2;

  return (
    <div className="grid gap-3">
      <FormField
        control={form.control}
        name={`questions.${parentIndex}.correctIndex` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("addQuizForm.answersLabel")}</FormLabel>
            <FormControl>
              <RadioGroup
                value={String(field.value)}
                onValueChange={(val) => field.onChange(Number(val))}
                className="grid gap-3"
              >
                {answerFields.map((aField, aIndex) => (
                  <div key={aField.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <RadioGroupItem value={String(aIndex)} aria-label={`Answer ${aIndex + 1}`} />
                    <FormField
                      control={form.control}
                      name={`questions.${parentIndex}.answers.${aIndex}.text` as const}
                      render={({ field: answerField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={t("addQuizForm.answerPlaceholder", { n: aIndex + 1 })}
                              {...answerField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (!canRemove) return;
                        const correct = form.getValues(
                          `questions.${parentIndex}.correctIndex` as const
                        );
                        // If removing an answer at or before current correct index,
                        // shift the correctIndex left so it stays valid.
                        if (aIndex === correct) {
                          // After removal, length decreases by 1
                          const nextIndex = Math.max(0, Math.min(correct, answerFields.length - 2));
                          form.setValue(
                            `questions.${parentIndex}.correctIndex` as const,
                            nextIndex,
                            { shouldValidate: true }
                          );
                        } else if (aIndex < correct) {
                          form.setValue(
                            `questions.${parentIndex}.correctIndex` as const,
                            correct - 1,
                            { shouldValidate: true }
                          );
                        }
                        removeAnswer(aIndex);
                      }}
                      disabled={!canRemove}
                      className="hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto"
                    >
                      {t("addQuizForm.remove")}
                    </Button>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => appendAnswer({ text: "" })}
          disabled={!canAdd}
          className="w-full sm:w-auto"
        >
          {t("addQuizForm.addAnswer")}
        </Button>
      </div>
    </div>
  );
}

// Helper because RHF useFormContext throws if used outside a FormProvider, but we control it in this file
import { useFormContext, type FieldValues, type UseFormReturn } from "react-hook-form";
function useFormContextSafe<T extends FieldValues>() {
  return useFormContext() as unknown as UseFormReturn<T>;
}

export default AddQuizForm;
