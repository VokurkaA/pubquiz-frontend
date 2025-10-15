import { z } from "zod";

export const answerSchema = z.object({
  text: z.string().min(1, "Answer is required"),
});

// Question schema: questionText, answers (1-4), correctIndex pointing to answers index
export const questionSchema = z
  .object({
    questionText: z.string().min(1, "Question is required"),
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
  });

export const quizFormSchema = z.object({
  name: z.string().min(1, "Quiz name is required"),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
