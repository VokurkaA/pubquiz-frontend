import { z } from "zod";

export const apiAnswerSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string(),
  isCorrect: z.boolean(),
});

export const apiQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  text: z.string(),
  answers: z.array(apiAnswerSchema),
});

export const apiQuizSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  questions: z.array(apiQuestionSchema),
});

export const apiQuizListSchema = z.array(apiQuizSchema);

export const apiInstanceSchema = z.object({
  quizId: z.string().uuid(),
  state: z.enum(["active", "completed", "paused"]),
});

export const apiAnswerSubmissionSchema = z.object({
  questionId: z.string().uuid(),
  answerId: z.string().uuid(),
  team: z.number().int(),
});

export const apiAnswerListSchema = z.array(
  z.object({
    id: z.string().uuid(),
    questionId: z.string().uuid(),
    answerId: z.string().uuid(),
    team: z.number().int(),
    submittedAt: z.string(),
  })
);
