"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { AnswerTile, type AnswerShape, type AnswerTileColor } from "@/components/play/AnswerTile";
import { PlayHeader } from "@/components/play/PlayHeader";


const demoQuestions = [
	{
		questionText: "When was our company founded?",
		answers: ["1920", "1934", "1924", "1824"],
		correctIndex: 1,
	},
	{
		questionText: "Which language powers Next.js?",
		answers: ["Ruby", "TypeScript/JavaScript", "PHP", "Go"],
		correctIndex: 1,
	},
];

const SHAPES: AnswerShape[] = ["triangle", "diamond", "circle", "square"];
const COLORS: Readonly<AnswerTileColor[]> = [
	{ base: "bg-red-500", hover: "hover:bg-red-600" },
	{ base: "bg-blue-500", hover: "hover:bg-blue-600" },
	{ base: "bg-yellow-500", hover: "hover:bg-yellow-600" },
	{ base: "bg-green-500", hover: "hover:bg-green-600" },
] as const;

export default function PlayPage() {
	const { t } = useI18n();
	const router = useRouter();
	const searchParams = useSearchParams();
	const rootRef = useRef<HTMLDivElement | null>(null);

	// Current question index from the URL (?q=0..n-1)
	const idxFromUrl = Number(searchParams?.get("q") ?? 0);
	const [currentIndex, setCurrentIndex] = useState<number>(
		Number.isFinite(idxFromUrl)
			? Math.max(0, Math.min(demoQuestions.length - 1, idxFromUrl))
			: 0
	);

	const [selected, setSelected] = useState<number | null>(null);
	const [reveal, setReveal] = useState(false);
	const [key, setKey] = useState(0); // reset timer when question changes
	const [isFs, setIsFs] = useState(false);

	const rawT = Number(searchParams?.get("t"));
	const duration =
		Number.isFinite(rawT) && rawT > 0 && rawT <= 300
			? Math.floor(rawT)
			: 25; // seconds

	const question = useMemo(() => demoQuestions[currentIndex], [currentIndex]);

	useEffect(() => {
		// Keep the URL in sync (without full navigation)
		const params = new URLSearchParams(searchParams?.toString());
		const current = params.get("q");
		const target = String(currentIndex);
		if (current !== target) {
			params.set("q", target);
			router.replace(`?${params.toString()}`, { scroll: false });
		}
	}, [currentIndex, router, searchParams]);

	const onSelect = (i: number) => {
		if (reveal) return;
		setSelected(i);
	};

	const onNext = useCallback(() => {
		const next = currentIndex + 1;
		if (next < demoQuestions.length) {
			setCurrentIndex(next);
			setSelected(null);
			setReveal(false);
			setKey((k) => k + 1);
		}
	}, [currentIndex]);

	// Fullscreen controls for projector/TV
	useEffect(() => {
		const handler = () => setIsFs(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", handler);
		return () => document.removeEventListener("fullscreenchange", handler);
	}, []);

	const toggleFullscreen = async () => {
		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			} else {
				const el = rootRef.current ?? document.documentElement;
				await el.requestFullscreen();
			}
		} catch (e) {
			console.warn("Fullscreen toggle failed", e);
		}
	};

	// Keyboard shortcuts for selection/reveal/next and exiting fullscreen
	useEffect(() => {
		const isInteractiveTarget = (target: EventTarget | null) => {
			if (!(target instanceof HTMLElement)) return false;
			const tag = target.tagName;
			return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(tag);
		};

		const handler = (e: KeyboardEvent) => {
			if (/^[1-9]$/.test(e.key)) {
				const i = Number(e.key) - 1;
				if (!reveal && i < question.answers.length) {
					setSelected(i);
				}
			}
			if (e.code === "Space" && !isInteractiveTarget(e.target)) {
				e.preventDefault();
				setReveal((r) => !r);
			}
			if (e.key.toLowerCase() === "r") {
				setReveal((r) => !r);
			}
			if (e.key === "ArrowRight") {
				onNext();
			}
			if (e.key.toLowerCase() === "f") {
				void toggleFullscreen();
			}
			if (e.key === "Escape" && isFs) {
				void document.exitFullscreen();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [isFs, onNext, question.answers.length, reveal]);

	return (
		<div
			ref={rootRef}
			className={`grid min-h-svh gap-6 p-4 sm:p-6 md:p-8 ${isFs ? "bg-black dark:bg-background" : ""}`}
		>
			{/* SR-only announcements for screen readers */}
			<div aria-live="polite" role="status" className="sr-only">
				{reveal ? t("pages.play.reveal") : t("pages.play.hide")}
			</div>

			{/* Header */}
			<PlayHeader
				countdownKey={key}
				seconds={duration}
				questionIndicator={t("pages.play.questionIndicator", {
					i: currentIndex + 1,
					n: demoQuestions.length,
				})}
				isFullscreen={isFs}
				onToggleFullscreen={() => void toggleFullscreen()}
				reveal={reveal}
				onToggleReveal={() => setReveal((r) => !r)}
				onNext={onNext}
				disableNext={currentIndex >= demoQuestions.length - 1}
				fullscreenLabel={t("pages.play.fullscreen")}
				exitFullscreenLabel={t("pages.play.exitFullscreen")}
				revealLabel={t("pages.play.reveal")}
				hideLabel={t("pages.play.hide")}
				nextLabel={t("pages.play.next")}
				onTimerEnd={() => setReveal(true)}
			/>

			{/* Question */}
			<Card className="p-6 sm:p-8">
				<h1 className="text-balance text-center text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
					{question.questionText}
				</h1>
			</Card>

			{/* Answers grid */}
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
				{question.answers.slice(0, 4).map((a, i) => (
					<AnswerTile
						key={i}
						index={i}
						label={a}
						shape={SHAPES[i]}
						color={COLORS[i]}
						selected={selected === i}
						correct={reveal && i === question.correctIndex}
						disabled={reveal}
						onClick={() => onSelect(i)}
					/>
				))}
				{/* If < 4 answers, fill the grid with empty slots for symmetry */}
				{Array.from({ length: Math.max(0, 4 - question.answers.length) }).map(
					(_, k) => (
						<div
							key={`spacer-${k}`}
							className="border-muted/30 bg-muted/30 rounded-xl border p-6 opacity-50"
							role="presentation"
							aria-hidden="true"
						/>
					)
				)}
			</div>
		</div>
	);
}

/* AnswerTile extracted to '@/components/play/AnswerTile' */
