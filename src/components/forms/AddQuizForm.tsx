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

type AddQuizFormProps = {
  className?: string;
  onSubmit?: (data: QuizFormValues) => Promise<void> | void;
};

const defaultAnswer = { text: "" };
const defaultQuestion = {
  questionText: "",
  answers: [defaultAnswer, defaultAnswer],
  correctIndex: 0,
};

export function AddQuizForm({ className, onSubmit }: AddQuizFormProps) {
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

  const handleSubmit = form.handleSubmit((values) => {
    const payload = {
      name: values.name,
      questions: values.questions.map((q) => ({
        question_text: q.questionText,
        answers: q.answers.map((a, idx) => ({ text: a.text, isCorrect: idx === q.correctIndex })),
      })),
    };

    if (onSubmit) onSubmit(values);
    // TODO: replace with actual submission logic
    console.log("Quiz payload", payload);
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
                <FormLabel>Quiz name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. General Knowledge #1" {...field} />
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
                <div className="text-sm font-medium">Question {qIndex + 1}</div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                  disabled={questionFields.length <= 1}
                  className="w-full sm:w-auto"
                >
                  Remove question
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`questions.${qIndex}.questionText`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question text</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type the question here" {...field} />
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
              Add question
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">
            Create quiz
          </Button>
          <Button
            type="reset"
            variant="secondary"
            onClick={() => form.reset()}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}

function AnswersEditor({ parentIndex }: { parentIndex: number }) {
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
            <FormLabel>Answers (choose the correct one)</FormLabel>
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
                            <Input placeholder={`Answer ${aIndex + 1}`} {...answerField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => removeAnswer(aIndex)}
                      disabled={!canRemove}
                      className="w-full sm:w-auto"
                    >
                      Remove
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
          Add answer
        </Button>
      </div>
    </div>
  );
}

// Helper because RHF useFormContext throws if used outside a FormProvider, but we control it in this file
import { useFormContext, type FieldValues } from "react-hook-form";
function useFormContextSafe<T extends FieldValues>() {
  return useFormContext() as unknown as import("react-hook-form").UseFormReturn<T>;
}

export default AddQuizForm;
