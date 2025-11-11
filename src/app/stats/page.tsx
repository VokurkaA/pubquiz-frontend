"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";

type AnswerOptionStat = {
  option: string; // e.g. "A", "B", "C", "D"
  count: number;
  correct: boolean;
};

type QuestionStat = {
  question: string;
  options: AnswerOptionStat[]; // length 2..4
};

type QuizStat = {
  id: string;
  name: string;
  playedAt: string; // ISO date
  questions: QuestionStat[];
};

export default function StatsPage() {
  const { t } = useI18n();
  const [data] = useState<QuizStat[]>([]);

  const totals = useMemo(() => {
    const quizzes = data.length;
    const questions = data.reduce((acc, qz) => acc + qz.questions.length, 0);
    const { correct, total } = data.reduce(
      (acc, qz) => {
        qz.questions.forEach((q) => {
          const sum = q.options.reduce((s, o) => s + o.count, 0);
          const corr = q.options.find((o) => o.correct)?.count ?? 0;
          acc.total += sum;
          acc.correct += corr;
        });
        return acc;
      },
      { correct: 0, total: 0 }
    );
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const lastPlayed = data.map((d) => new Date(d.playedAt).getTime()).sort((a, b) => b - a)[0];
    return { quizzes, questions, accuracy, lastPlayed: lastPlayed ? new Date(lastPlayed) : null };
  }, [data]);

  // No backend stats endpoint defined; keeping empty state until implemented on server

  return (
    <div className="container mx-auto grid max-w-6xl gap-6 px-4 py-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">{t("pages.stats.title")}</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("pages.stats.totalQuizzes")}</CardTitle>
            <CardDescription>{t("pages.stats.numberOfSessions")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totals.quizzes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("pages.stats.questions")}</CardTitle>
            <CardDescription>{t("pages.stats.acrossSessions")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totals.questions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("pages.stats.accuracy")}</CardTitle>
            <CardDescription>{t("pages.stats.correctRatio")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {t("pages.stats.percent", { n: totals.accuracy })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("pages.stats.lastPlayed")}</CardTitle>
            <CardDescription>{t("pages.stats.mostRecentSession")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {totals.lastPlayed ? totals.lastPlayed.toLocaleDateString() : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty state */}
      {data.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {/* simple dot */}
              <div className="bg-primary/20 size-6 rounded" />
            </EmptyMedia>
            <EmptyTitle>{t("pages.stats.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("pages.stats.emptyDescription")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent />
        </Empty>
      ) : null}

      {/* Per-quiz details */}
      <div className="grid gap-4">
        {data.map((quiz) => {
          // compute quiz accuracy
          const { correct, total } = quiz.questions.reduce(
            (acc, q) => {
              const sum = q.options.reduce((s, o) => s + o.count, 0);
              const corr = q.options.find((o) => o.correct)?.count ?? 0;
              acc.total += sum;
              acc.correct += corr;
              return acc;
            },
            { correct: 0, total: 0 }
          );
          const accPct = total > 0 ? Math.round((correct / total) * 100) : 0;

          return (
            <Collapsible key={quiz.id}>
              <CollapsibleTrigger asChild>
                <Card className="hover:bg-muted/40 cursor-pointer transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{quiz.name}</CardTitle>
                      <CardDescription>
                        {new Date(quiz.playedAt).toLocaleString()} —{" "}
                        {t(
                          quiz.questions.length === 1
                            ? "pages.stats.questionsCount_one"
                            : "pages.stats.questionsCount_other",
                          { n: quiz.questions.length }
                        )}
                      </CardDescription>
                    </div>
                    <Badge className="text-base" variant="secondary">
                      {t("pages.stats.percentCorrect", { n: accPct })}
                    </Badge>
                  </CardHeader>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid gap-4">
                  {quiz.questions.map((q, idx) => {
                    const totalVotes = q.options.reduce((s, o) => s + o.count, 0) || 1;
                    // Build chart data e.g. [{label:'A', count:5, correct:true}, ...]
                    const chartData = q.options.map((o) => ({
                      label: o.option,
                      count: o.count,
                      correct: o.correct,
                    }));
                    return (
                      <Card key={`${quiz.id}-${idx}`}>
                        <CardHeader>
                          <CardTitle className="text-base">{q.question}</CardTitle>
                          <CardDescription>
                            {t(
                              totalVotes === 1
                                ? "pages.stats.votesCount_one"
                                : "pages.stats.votesCount_other",
                              { n: totalVotes }
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={{
                              correct: { color: "hsl(142 76% 36%)" }, // green-600
                              wrong: { color: "hsl(0 84% 60%)" }, // red-500
                            }}
                            className="h-52 w-full"
                          >
                            <BarChart data={chartData} barSize={28}>
                              <CartesianGrid vertical={false} strokeDasharray="3 3" />
                              <XAxis dataKey="label" tickLine={false} axisLine={false} />
                              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                              <ChartTooltip
                                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                                content={<ChartTooltipContent hideIndicator />}
                              />
                              <Bar dataKey="count">
                                {chartData.map((entry, i) => (
                                  <Cell
                                    key={`cell-${i}`}
                                    fill={
                                      entry.correct ? "var(--color-correct)" : "var(--color-wrong)"
                                    }
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
