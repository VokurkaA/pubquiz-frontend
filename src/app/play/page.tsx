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
import { PlayIcon, UsersIcon, CameraIcon, CameraOffIcon } from "lucide-react";
import { toast } from "sonner";

const SHAPES: AnswerShape[] = ["triangle", "diamond", "circle", "square"];
const COLORS: Readonly<AnswerTileColor[]> = [
  { base: "bg-red-500", hover: "hover:bg-red-600" },
  { base: "bg-blue-500", hover: "hover:bg-blue-600" },
  { base: "bg-yellow-500", hover: "hover:bg-yellow-600" },
  { base: "bg-green-500", hover: "hover:bg-green-600" },
] as const;

const ALLOWED_IDS = [992, 960, 800, 36];

type ViewState = "SELECT" | "PRESENTING";

interface ArMarker {
  id: number;
  corners: Array<{ x: number; y: number }>;
}

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

  // Scanner State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detectorRef = useRef<any>(null);
  const [showCamera, setShowCamera] = useState(true);
  const [detectedAnswers, setDetectedAnswers] = useState<string[]>(["-", "-", "-", "-"]);

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

  // Scanner Logic (Merged from Scan page)
  useEffect(() => {
    if (view !== "PRESENTING" || !showCamera) return;

    let streaming = true;
    let animationFrameId: number;

    // Capture refs to variable to safely cleanup
    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;

    const loadScripts = () =>
      new Promise<void>((resolve) => {
        if (window.CV && window.AR) {
          resolve();
          return;
        }
        const cvScript = document.createElement("script");
        cvScript.src = "/libs/cv.js";
        cvScript.async = true;
        cvScript.onload = () => {
          const arucoScript = document.createElement("script");
          arucoScript.src = "/libs/aruco.js";
          arucoScript.async = true;
          arucoScript.onload = () => {
            console.info("CV and js-aruco loaded");
            resolve();
          };
          document.body.appendChild(arucoScript);
        };
        document.body.appendChild(cvScript);
      });

    const startCamera = async () => {
      if (!videoEl) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoEl.srcObject = stream;

        await new Promise<void>((resolve) => {
          videoEl.addEventListener("loadedmetadata", () => resolve(), { once: true });
        });

        videoEl.play();

        if (!detectorRef.current && window.AR) {
          detectorRef.current = new window.AR.Detector({ dictionaryName: "ARUCO" });
        }

        animationFrameId = requestAnimationFrame(processFrame);
      } catch (err) {
        console.error("Camera access error:", err);
        toast.error("Camera access failed");
      }
    };

    const processFrame = () => {
      if (!streaming || !videoEl || !canvasEl || !detectorRef.current) return;

      const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      if (canvasEl.width !== videoEl.videoWidth || canvasEl.height !== videoEl.videoHeight) {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
      }

      if (videoEl.videoWidth === 0 || videoEl.videoHeight === 0) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

      try {
        const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
        const markers = detectorRef.current.detect(imageData) as ArMarker[];

        ctx.lineWidth = 3;

        const currentAnswers = ["-", "-", "-", "-"];

        markers.forEach((marker) => {
          // Check if marker is in our allowed list
          const playerIndex = ALLOWED_IDS.indexOf(marker.id);

          // Draw corners
          const corners = marker.corners;
          ctx.strokeStyle = playerIndex >= 0 ? "lime" : "red";
          ctx.beginPath();
          for (let i = 0; i < corners.length; i++) {
            const c = corners[i];
            ctx.moveTo(c.x, c.y);
            const next = corners[(i + 1) % corners.length];
            ctx.lineTo(next.x, next.y);
          }
          ctx.stroke();
          ctx.closePath();

          if (playerIndex >= 0) {
            const rotation = getMarkerRotation(marker) / 90 + 2;
            // Map rotation to A/B/C/D. Rounding handles slight tilt.
            const opts = ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B", "C", "D"];
            const answer = opts[Math.round(rotation)];
            currentAnswers[playerIndex] = answer;

            // Draw ID and Answer
            const x = Math.min(...corners.map((c) => c.x));
            const y = Math.min(...corners.map((c) => c.y));
            ctx.fillStyle = "lime";
            ctx.font = "bold 24px monospace";
            ctx.fillText(`${answer} (${marker.id})`, x, y - 10);
          }
        });

        // Update state if changed (simple check to reduce re-renders)
        setDetectedAnswers((prev) => {
          if (prev.join() !== currentAnswers.join()) {
            return currentAnswers;
          }
          return prev;
        });
      } catch (err) {
        console.warn("Detection error:", err);
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    loadScripts().then(() => startCamera());

    return () => {
      streaming = false;
      cancelAnimationFrame(animationFrameId);
      if (videoEl?.srcObject) {
        (videoEl.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [view, showCamera]);

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
      setDetectedAnswers(["-", "-", "-", "-"]); // Reset detected answers for new question
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
      if (e.key.toLowerCase() === "c") setShowCamera((s) => !s);
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
          <div className="flex items-center gap-4">
            {/* Live Detection Results */}
            <div className="hidden items-center gap-2 font-mono text-xs sm:flex">
              {detectedAnswers.map((ans, i) => (
                <div
                  key={i}
                  className={`flex h-6 w-6 items-center justify-center rounded border ${
                    ans !== "-" ? "bg-primary text-primary-foreground border-primary" : "opacity-50"
                  }`}
                >
                  {ans}
                </div>
              ))}
            </div>
            <div>{quiz?.name}</div>
          </div>
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

      {/* Content Area: Split between Question/Answers and Camera */}
      <div className="grid min-h-0 grid-rows-[auto_1fr] gap-6 lg:grid-cols-[1fr_auto] lg:grid-rows-1">
        {/* Left: Question & Answers */}
        <div className="flex flex-col gap-8">
          <Card className="w-full border-none bg-transparent shadow-none">
            <h1 className="text-center text-3xl leading-tight font-bold text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              {question.questionText}
            </h1>
          </Card>

          <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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
          </div>
        </div>

        {/* Right: Camera Preview */}
        <div className="flex flex-col gap-2">
          {showCamera && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black/10 lg:w-80 xl:w-96">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover opacity-0"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-contain" />
              <div className="absolute right-2 bottom-2 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                {t("pages.play.liveScan")}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCamera(!showCamera)}
              className="text-muted-foreground"
            >
              {showCamera ? (
                <>
                  <CameraOffIcon className="mr-2 size-4" /> {t("pages.play.hideCamera")}
                </>
              ) : (
                <>
                  <CameraIcon className="mr-2 size-4" /> {t("pages.play.showCamera")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getMarkerRotation(marker: ArMarker) {
  const c = marker.corners;
  // Take top-left and top-right corners
  const dx = c[1].x - c[0].x;
  const dy = c[1].y - c[0].y;
  // Angle in radians
  const angleRad = Math.atan2(dy, dx);
  // Convert to degrees
  const angleDeg = angleRad * (180 / Math.PI);
  return angleDeg;
}
