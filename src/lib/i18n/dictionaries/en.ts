import type { Dictionary } from "../types";

export const en: Dictionary = {
  app: {
    title: "PubQuiz",
  },
  sidebar: {
    tools: "Tools",
    scanner: "Scanner",
    addQuiz: "Add quiz",
    stats: "Stats",
    play: "Play",
    language: "Language",
    theme: "Theme",
    themeToggle: {
      toggle: "Toggle theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },
  },
  ui: {
    common: {
      close: "Close",
      loading: "Loading",
      error: "Error",
      saved: "Saved",
    },
    breadcrumb: {
      more: "More",
    },
    carousel: {
      previousSlide: "Previous slide",
      nextSlide: "Next slide",
    },
    pagination: {
      previous: "Previous",
      next: "Next",
      morePages: "More pages",
    },
    sidebar: {
      title: "Sidebar",
      mobileDescription: "Displays the mobile sidebar.",
      toggle: "Toggle Sidebar",
    },
  },
  pages: {
    scan: {
      title: "Scanner",
      subtitle: "Camera-based scanning will be here.",
    },
    addQuiz: {
      title: "Add a new quiz",
    },
    stats: {
      title: "Stats",
      totalQuizzes: "Total quizzes",
      numberOfSessions: "Number of quiz sessions",
      questions: "Questions",
      acrossSessions: "Across all sessions",
      accuracy: "Accuracy",
      correctRatio: "Correct answers ratio",
      lastPlayed: "Last played",
      mostRecentSession: "Most recent session",
      emptyTitle: "No stats yet",
      emptyDescription:
        "Play a quiz to see your statistics here. For a quick preview, load demo data.",
      loadDemo: "Load demo stats",
      questionsCount_one: "{n} question",
      questionsCount_other: "{n} questions",
      votesCount_one: "{n} vote",
      votesCount_other: "{n} votes",
      percent: "{n}%",
      percentCorrect: "{n}% correct",
    },
    offline: {
      title: "You are offline",
      description:
        "It looks like there's no internet connection. Some features may be unavailable.",
      retry: "Retry",
      goHome: "Go home",
    },
    play: {
      title: "Play",
      button: "Press me",
      questionIndicator: "Question {i} of {n}",
      reveal: "Reveal",
      hide: "Hide",
      next: "Next",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit fullscreen",
      noQuestions: "No questions available.",
    },
  },
  addQuizForm: {
    nameLabel: "Quiz name",
    namePlaceholder: "e.g. General Knowledge #1",
    questionLabel: "Question {n}",
    questionTextLabel: "Question text",
    answersLabel: "Answers (choose the correct one)",
    answerPlaceholder: "Answer {n}",
    removeQuestion: "Remove question",
    remove: "Remove",
    addQuestion: "Add question",
    addAnswer: "Add answer",
    create: "Create quiz",
    reset: "Reset",
  },
} as const;

export type EnDict = typeof en;
