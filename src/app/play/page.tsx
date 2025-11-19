"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { AnswerTile, type AnswerShape, type AnswerTileColor } from "@/components/play/AnswerTile";
import { PlayHeader } from "@/components/play/PlayHeader";
import { api, quizToUiQuestions, type UiQuestion, type ApiQuiz } from "@/lib/api";
import { PlayIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";

const SHAPES: AnswerShape[] = ["triangle", "diamond", "circle", "square"];
const COLORS: Readonly<AnswerTileColor[]> = [
  { base: "bg-red-500", hover: "hover:bg-red-600" },
  { base: "bg-blue-500", hover: "hover:bg-blue-600" },
  { base: "bg-yellow-500", hover: "hover:bg-yellow-600" },
  { base: "bg-green-500", hover: "hover:bg-green-600" },
] as const;

type ViewState = "SELECT" | "PRESENTING";

export default function PlayPage() {
  const { t } = useI18n();
  const [view, setView] = useState<ViewState>("SELECT");

  // Quiz Selection State
  const [quizList, setQuizList] = useState<ApiQuiz[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Presenter State
  const [quiz, setQuiz] = useState<ApiQuiz | null>(null);
  const [questions, setQuestions] = useState<UiQuestion[]>([]);
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch quizzes on mount
  useEffect(() => {
    api
      .getQuizzes()
      .then((list) => setQuizList(list))
      .catch((err) => toast.error("Failed to load quizzes: " + err.message))
      .finally(() => setIsLoadingList(false));
  }, []);

  // 2. Handle starting a session
  const handleStartSession = async (selectedQuiz: ApiQuiz) => {
    try {
      setIsLoadingList(true);
      const id = await api.createInstance(selectedQuiz.id);
      setInstanceId(id);
      setQuiz(selectedQuiz);
      setQuestions(quizToUiQuestions(selectedQuiz));
      setView("PRESENTING");
      // Reset presenter state
      setCurrentIndex(0);
      setReveal(false);
      setCountdownKey(0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create session");
    } finally {
      setIsLoadingList(false);
    }
  };

  // Presenter Logic
  const question = useMemo(
    () => (questions && questions[currentIndex]) || null,
    [questions, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setReveal(false);
      setCountdownKey((p) => p + 1);
    }
  }, [currentIndex, questions.length]);

  const handleSkip = () => {
    handleNext();
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await rootRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen toggle failed", e);
    }
  };

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (view !== "PRESENTING") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === " " || e.key.toLowerCase() === "r") setReveal((r) => !r);
      if (e.key.toLowerCase() === "f") void toggleFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, reveal, handleNext]);

  // RENDER: SELECTION MODE
  if (view === "SELECT") {
    return (
      <div className="container mx-auto max-w-5xl space-y-8 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("pages.play.title")}</h1>
          <p className="text-muted-foreground">{t("pages.play.selectQuizDescription")}</p>
        </div>

        {isLoadingList ? (
          <div className="flex justify-center py-12">
            <Spinner className="size-8" />
          </div>
        ) : quizList.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-4 py-12 text-center">
            <span>{t("pages.play.noQuizzesFound")}</span>
            <Button asChild variant="link">
              <Link href="/add-quiz">{t("pages.play.createOne")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizList.map((q) => (
              <Card
                key={q.id}
                className="hover:bg-accent/40 group cursor-pointer transition-colors"
                onClick={() => handleStartSession(q)}
              >
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {q.name}
                  </CardTitle>
                  <CardDescription>
                    {q.questions?.length || 0}{" "}
                    {t(
                      q.questions?.length === 1
                        ? "pages.stats.questionsCount_one"
                        : "pages.stats.questionsCount_other",
                      { n: q.questions?.length || 0 }
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg">
                    <PlayIcon className="mr-2 size-4" /> {t("pages.play.startSession")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // RENDER: PRESENTER MODE
  if (!question) {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold">{t("pages.play.quizCompleted")}</h2>
        <Button onClick={() => window.location.reload()}>{t("pages.play.backToMenu")}</Button>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`grid min-h-svh grid-rows-[auto_1fr_auto] gap-6 p-4 transition-colors duration-500 sm:p-6 md:p-8 ${
        isFs ? "dark:bg-background bg-black" : "bg-background"
      }`}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="text-muted-foreground flex items-center justify-between px-1 text-sm">
          <div className="flex items-center gap-2">
            <UsersIcon className="size-4" />
            <span>
              {t("pages.play.sessionId")}{" "}
              <span className="text-foreground font-mono font-bold select-all">{instanceId}</span>
            </span>
          </div>
          <div>{quiz?.name}</div>
        </div>
        <PlayHeader
          countdownKey={countdownKey}
          seconds={30}
          onTimerEnd={() => setReveal(true)}
          questionIndicator={t("pages.play.questionIndicator", {
            i: currentIndex + 1,
            n: questions.length,
          })}
          isFullscreen={isFs}
          onToggleFullscreen={() => void toggleFullscreen()}
          reveal={reveal}
          onToggleReveal={() => setReveal((r) => !r)}
          onNext={handleNext}
          onSkip={handleSkip}
          disableNext={currentIndex >= questions.length - 1}
          revealLabel={t("pages.play.reveal")}
          hideLabel={t("pages.play.hide")}
          nextLabel={t("pages.play.next")}
          skipLabel={t("pages.play.skip")}
          fullscreenLabel={t("pages.play.fullscreen")}
          exitFullscreenLabel={t("pages.play.exitFullscreen")}
        />
      </div>

      {/* Question Area */}
      <div className="flex min-h-0 flex-col items-center justify-center gap-8">
        <Card className="w-full max-w-5xl border-none bg-transparent shadow-none">
          <h1 className="text-center text-3xl leading-tight font-bold text-balance sm:text-4xl md:text-5xl lg:text-6xl">
            {question.questionText}
          </h1>
        </Card>
      </div>

      {/* Answer Grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {question.answers.slice(0, 4).map((ans, i) => (
          <AnswerTile
            key={i}
            index={i}
            label={ans}
            shape={SHAPES[i]}
            color={COLORS[i]}
            correct={reveal && i === question.correctIndex}
            disabled={reveal}
          />
        ))}
        {/* Spacers if fewer than 4 answers */}
        {Array.from({ length: Math.max(0, 4 - question.answers.length) }).map((_, k) => (
          <div
            key={`spacer-${k}`}
            className="border-muted/20 hidden rounded-2xl border-2 border-dashed opacity-20 sm:block"
          />
        ))}
      </div>
    </div>
  );
}
