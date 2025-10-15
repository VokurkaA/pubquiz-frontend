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
