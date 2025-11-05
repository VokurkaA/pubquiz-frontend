"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/LanguageProvider";

type AnswerShape = "triangle" | "diamond" | "circle" | "square";

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
const COLORS = [
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

	const enterFullscreen = async () => {
		try {
			const el = rootRef.current ?? document.documentElement;
			if (!document.fullscreenElement) await el.requestFullscreen();
		} catch (e) {
			console.warn("Fullscreen not available", e);
		}
	};

	const exitFullscreen = async () => {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
		} catch (e) {
			console.warn("Exit fullscreen failed", e);
		}
	};

	// Keyboard shortcuts for selection/reveal/next and exiting fullscreen
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (/^[1-9]$/.test(e.key)) {
				const i = Number(e.key) - 1;
				if (!reveal && i < question.answers.length) {
					setSelected(i);
				}
			}
			if (e.code === "Space") {
				e.preventDefault();
				setReveal((r) => !r);
			}
			if (e.key === "ArrowRight") {
				onNext();
			}
			if (e.key === "Escape" && isFs) {
				void exitFullscreen();
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
			{/* Header */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Countdown
						key={key}
						seconds={duration}
						onEnd={() => setReveal(true)}
					/>
					<div className="text-muted-foreground text-base md:text-lg">
						{t("pages.play.questionIndicator", {
							i: currentIndex + 1,
							n: demoQuestions.length,
						})}
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						onClick={() => (isFs ? exitFullscreen() : enterFullscreen())}
						className="text-base md:text-lg"
						aria-label={isFs ? t("pages.play.exitFullscreen") : t("pages.play.fullscreen")}
					>
						{isFs
							? t("pages.play.exitFullscreen")
							: t("pages.play.fullscreen")}
					</Button>
					<Button
						variant="secondary"
						onClick={() => setReveal((r) => !r)}
					>
						{reveal ? t("pages.play.hide") : t("pages.play.reveal")}
					</Button>
					<Button
						onClick={onNext}
						disabled={currentIndex >= demoQuestions.length - 1}
						className="text-base md:text-lg"
					>
						{t("pages.play.next")}
					</Button>
				</div>
			</div>

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

function AnswerTile({
	index,
	label,
	shape,
	color,
	selected,
	correct,
	disabled,
	onClick,
}: {
	index: number;
	label: string;
	shape: AnswerShape;
	color: { base: string; hover: string };
	selected?: boolean;
	correct?: boolean;
	disabled?: boolean;
	onClick?: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={[
				"rounded-2xl p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				"flex items-center gap-5 sm:gap-6 min-h-40 sm:min-h-48 md:min-h-56 lg:min-h-64",
				color.base,
				color.hover,
				disabled ? "opacity-80" : "",
				selected ? "ring-2 ring-black/30" : "",
				correct ? "ring-4 ring-emerald-400" : "",
				"text-white",
			].join(" ")}
			aria-pressed={disabled ? undefined : selected}
		>
			<div className="bg-white/20 grid h-12 w-12 place-items-center rounded-md sm:h-14 sm:w-14 md:h-16 md:w-16">
				<ShapeIcon shape={shape} />
			</div>
			<div className="flex min-w-0 flex-1 items-center justify-between gap-4">
				<span className="truncate text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
					{label}
				</span>
				<span className="text-white/80 text-base font-bold md:text-lg lg:text-xl">
					{index + 1}
				</span>
			</div>
		</button>
	);
}

function ShapeIcon({ shape }: { shape: AnswerShape }) {
	switch (shape) {
		case "triangle":
			return (
				<svg
					viewBox="0 0 24 24"
					className="h-7 w-7 md:h-8 md:w-8 fill-current"
					aria-hidden
				>
					<polygon points="12,4 22,20 2,20" />
				</svg>
			);
		case "diamond":
			return (
				<svg
					viewBox="0 0 24 24"
					className="h-7 w-7 md:h-8 md:w-8 fill-current"
					aria-hidden
				>
					<polygon points="12,2 22,12 12,22 2,12" />
				</svg>
			);
		case "circle":
			return (
				<svg
					viewBox="0 0 24 24"
					className="h-7 w-7 md:h-8 md:w-8 fill-current"
					aria-hidden
				>
					<circle cx="12" cy="12" r="9" />
				</svg>
			);
		case "square":
		default:
			return (
				<svg
					viewBox="0 0 24 24"
					className="h-7 w-7 md:h-8 md:w-8 fill-current"
					aria-hidden
				>
					<rect x="5" y="5" width="14" height="14" rx="2" />
				</svg>
			);
	}
}

function Countdown({
	seconds,
	onEnd,
}: {
	seconds: number;
	onEnd?: () => void;
}) {
	const [left, setLeft] = useState(seconds);
	useEffect(() => {
		setLeft(seconds);
		const id = setInterval(() => {
			setLeft((s) => {
				if (s <= 1) {
					clearInterval(id);
					onEnd?.();
					return 0;
				}
				return s - 1;
			});
		}, 1000);
		return () => clearInterval(id);
	}, [seconds, onEnd]);

	const total = Number.isFinite(seconds) && seconds > 0 ? seconds : 1; // guard
	const pct = Math.max(0, Math.min(100, (left / total) * 100));
	const center = 32;
	const radius = 24;
	const circ = 2 * Math.PI * radius;
	const dash = (pct / 100) * circ;

	return (
		<div className="flex items-center gap-2">
			<svg viewBox="0 0 64 64" className="h-14 w-14 md:h-16 md:w-16">
				<circle
					cx={center}
					cy={center}
					r={radius}
					stroke="#e5e7eb"
					strokeWidth={6}
					fill="none"
				/>
				<circle
					cx={center}
					cy={center}
					r={radius}
					stroke="#10b981"
					strokeWidth={6}
					fill="none"
					strokeDasharray={`${dash} ${circ - dash}`}
					transform={`rotate(-90 ${center} ${center})`}
					strokeLinecap="round"
				/>
				<text
					x={center}
					y={center + 4}
					textAnchor="middle"
					className="fill-current text-base md:text-lg"
				>
					{left}
				</text>
			</svg>
		</div>
	);
}
