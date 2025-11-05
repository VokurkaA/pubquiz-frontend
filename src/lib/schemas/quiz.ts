import { z } from "zod";

const trimmedString = z
  .string()
  .transform((s) => s.trim())
  .pipe(z.string().min(1, "This field is required"));

export const answerSchema = z.object({
  text: trimmedString,
});

// Question schema: questionText, answers (1-4), correctIndex pointing to answers index
export const questionSchema = z
  .object({
    questionText: trimmedString,
    answers: z.array(answerSchema).min(2, "At least 2 answers").max(4, "At most 4 answers"),
    // We keep correctIndex as number; UI will bind via string RadioGroup
    correctIndex: z.number().int().min(0, "Pick the correct answer"),
  })
  .superRefine((val, ctx) => {
    // Ensure correctIndex is within the answers array bounds
    if (val.correctIndex < 0 || val.correctIndex >= val.answers.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctIndex"],
        message: "Correct answer must correspond to one of the options",
      });
    }

    // Ensure answers are unique (case-insensitive, trimmed)
    const normalized = val.answers.map((a) => a.text.toLocaleLowerCase());
    const dupIndex = normalized.findIndex((v, i) => normalized.indexOf(v) !== i);
    if (dupIndex !== -1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["answers", dupIndex, "text"],
        message: "Duplicate answer",
      });
    }
  });

export const quizFormSchema = z
  .object({
    name: trimmedString,
    questions: z.array(questionSchema).min(1, "Add at least one question"),
  })
  .superRefine((val, ctx) => {
    // Ensure no duplicate questions across the quiz
    const normalized = val.questions.map((q) => q.questionText.toLocaleLowerCase());
    const dupIndex = normalized.findIndex((v, i) => normalized.indexOf(v) !== i);
    if (dupIndex !== -1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["questions", dupIndex, "questionText"],
        message: "Duplicate question",
      });
    }
  });

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
