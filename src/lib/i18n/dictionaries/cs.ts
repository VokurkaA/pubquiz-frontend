import type { Dictionary } from "../types";

export const cs: Dictionary = {
  app: {
    title: "PubQuiz",
  },
  sidebar: {
    tools: "Nástroje",
    scanner: "Skenování",
    addQuiz: "Přidat kvíz",
    stats: "Statistiky",
    language: "Jazyk",
    theme: "Téma",
    themeToggle: {
      toggle: "Přepnout styl",
      light: "Světlý",
      dark: "Tmavý",
      system: "Systém",
    },
  },
  ui: {
    common: {
      close: "Zavřít",
    },
    breadcrumb: {
      more: "Více",
    },
    carousel: {
      previousSlide: "Předchozí snímek",
      nextSlide: "Další snímek",
    },
    pagination: {
      previous: "Předchozí",
      next: "Další",
      morePages: "Více stránek",
    },
    sidebar: {
      title: "Postranní panel",
      mobileDescription: "Zobrazuje mobilní postranní panel.",
      toggle: "Přepnout postranní panel",
    },
  },
  pages: {
    scan: {
      title: "Skenování",
      subtitle: "Zde bude skenování pomocí kamery.",
    },
    addQuiz: {
      title: "Přidat nový kvíz",
    },
    stats: {
      title: "Statistiky",
    },
  },
  addQuizForm: {
    nameLabel: "Název kvízu",
    namePlaceholder: "např. Všeobecný přehled #1",
    questionLabel: "Otázka {n}",
    questionTextLabel: "Text otázky",
    answersLabel: "Odpovědi (vyberte správnou)",
    answerPlaceholder: "Odpověď {n}",
    removeQuestion: "Odstranit otázku",
    remove: "Odstranit",
    addQuestion: "Přidat otázku",
    addAnswer: "Přidat odpověď",
    create: "Vytvořit kvíz",
    reset: "Resetovat",
  },
} as const;

export type CsDict = typeof cs;
