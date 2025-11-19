export type Dictionary = {
  app: { title: string };
  sidebar: {
    tools: string;
    scanner: string;
    addQuiz: string;
    stats: string;
    play: string;
    language: string;
    theme: string;
    themeToggle: {
      toggle: string;
      light: string;
      dark: string;
      system: string;
    };
  };
  ui: {
    common: { close: string; loading: string; error: string; saved: string };
    breadcrumb: { more: string };
    carousel: { previousSlide: string; nextSlide: string };
    pagination: { previous: string; next: string; morePages: string };
    sidebar: {
      title: string;
      mobileDescription: string;
      toggle: string;
    };
  };
  pages: {
    scan: { title: string; subtitle: string };
    addQuiz: { title: string };
    stats: {
      title: string;
      totalQuizzes: string;
      numberOfSessions: string;
      questions: string;
      acrossSessions: string;
      accuracy: string;
      correctRatio: string;
      lastPlayed: string;
      mostRecentSession: string;
      emptyTitle: string;
      emptyDescription: string;
      loadDemo: string;
      questionsCount_one: string; // {n}
      questionsCount_other: string; // {n}
      votesCount_one: string; // {n}
      votesCount_other: string; // {n}
      percent: string; // {n}
      percentCorrect: string; // {n}
    };
    offline: { title: string; description: string; retry: string; goHome: string };
    play: {
      title: string;
      button: string;
      questionIndicator: string; // Question {i} of {n}
      reveal: string;
      hide: string;
      next: string;
      skip: string;
      fullscreen: string;
      exitFullscreen: string;
      noQuestions: string;
      selectQuizDescription: string;
      noQuizzesFound: string;
      createOne: string;
      startSession: string;
      quizCompleted: string;
      backToMenu: string;
      sessionId: string;
    };
  };
  addQuizForm: {
    nameLabel: string;
    namePlaceholder: string;
    questionLabel: string; // contains token {n}
    questionTextLabel: string;
    answersLabel: string;
    answerPlaceholder: string; // contains token {n}
    removeQuestion: string;
    remove: string;
    addQuestion: string;
    addAnswer: string;
    create: string;
    reset: string;
  };
};
