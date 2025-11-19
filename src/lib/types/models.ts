// Core domain models for the PubQuiz app

export interface Question {
  id?: string;
  text: string;
  answers: string[]; // ordered list of answer options
  correctAnswerIndex: number; // index into `answers`
}

export interface Quiz {
  id?: string;
  name: string;
  questions: Question[];
  description?: string;
}

export type QuizStatus = "draft" | "active" | "finished";

export interface QuizInstance {
  id?: string;
  quizId: string;
  status: QuizStatus;
  startedAt?: string | Date;
  finishedAt?: string | Date;
  currentQuestionIndex?: number;
}

export interface TeamAnswer {
  id?: string;
  quizInstanceId: string;
  teamId: string;
  questionIndex: number; // which question in the quiz (0-based)
  answerIndex: number; // which answer was selected (0-based)
  submittedAt: string | Date;
  correct?: boolean;
}
