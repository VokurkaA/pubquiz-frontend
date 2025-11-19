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
    play: "Hraj",
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
      loading: "Načítání",
      error: "Chyba",
      saved: "Uloženo",
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
      totalQuizzes: "Počet kvízů",
      numberOfSessions: "Počet sezení kvízu",
      questions: "Otázky",
      acrossSessions: "Napříč všemi sezeními",
      accuracy: "Přesnost",
      correctRatio: "Poměr správných odpovědí",
      lastPlayed: "Naposledy hráno",
      mostRecentSession: "Nejnovější sezení",
      emptyTitle: "Zatím žádné statistiky",
      emptyDescription:
        "Zahrajte si kvíz a zde uvidíte statistiky. Pro rychlý náhled načtěte ukázková data.",
      loadDemo: "Načíst ukázková data",
      questionsCount_one: "{n} otázka",
      questionsCount_other: "{n} otázek",
      votesCount_one: "{n} hlas",
      votesCount_other: "{n} hlasů",
      percent: "{n}%",
      percentCorrect: "{n}% správně",
    },
    offline: {
      title: "Jste offline",
      description:
        "Zdá se, že není k dispozici internetové připojení. Některé funkce nemusí fungovat.",
      retry: "Zkusit znovu",
      goHome: "Domů",
    },
    play: {
      title: "Hraj",
      button: "Stiskni mě",
      questionIndicator: "Otázka {i} z {n}",
      reveal: "Zobrazit",
      hide: "Skrýt",
      next: "Další",
      skip: "Přeskočit",
      fullscreen: "Na celou obrazovku",
      exitFullscreen: "Ukončit celou obrazovku",
      noQuestions: "Nejsou dostupné žádné otázky.",
      selectQuizDescription: "Vyberte kvíz pro zahájení nové relace.",
      noQuizzesFound: "Nebyly nalezeny žádné kvízy.",
      createOne: "Vytvořit nový?",
      startSession: "Spustit relaci",
      quizCompleted: "Kvíz dokončen!",
      backToMenu: "Zpět do menu",
      sessionId: "ID relace:",
      liveScan: "Živý sken",
      showCamera: "Zobrazit kameru",
      hideCamera: "Skrýt kameru",
      team: "Tým {n}",
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
