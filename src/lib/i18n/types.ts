// Central i18n dictionary shape used to enforce parity across locales
// Any change here must be reflected in all dictionaries (en, cs, ...)
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
    common: { close: string };
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
    stats: { title: string };
    offline: { title: string; description: string; retry: string; goHome: string };
    play: {
      title: string;
      button: string;
      questionIndicator: string; // Question {i} of {n}
      reveal: string;
      hide: string;
      next: string;
      fullscreen: string;
      exitFullscreen: string;
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
