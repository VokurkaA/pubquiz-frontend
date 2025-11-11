// Simple typed API client for the PubQuiz backend
// Base URL can be configured via NEXT_PUBLIC_API_BASE_URL, defaults to http://127.0.0.1:6767

// Normalize and export a sane default base URL.
// Note: If the app runs over HTTPS and the API is HTTP, the browser will block requests (mixed content),
// resulting in a generic "TypeError: Failed to fetch". Prefer setting NEXT_PUBLIC_API_BASE_URL to an HTTPS endpoint
// or a same-origin reverse proxy.
const RAW_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) ||
  "http://3.70.249.70:6767";

export const API_BASE_URL = RAW_BASE.replace(/\/+$/, "");

function buildUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

type HttpMethod = "GET" | "POST" | "DELETE";

async function request<T>(path: string, opts?: { method?: HttpMethod; body?: unknown }) {
  const { method = "GET", body } = opts || {};
  const url = buildUrl(path);
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      // Explicit CORS mode for clarity; adjust if you need credentials
      mode: "cors",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    // Provide a clearer hint for common failures (network/mixed content/CORS)
    throw new Error(
      `Network error calling ${method} ${url}: ${reason}. ` +
        `Check NEXT_PUBLIC_API_BASE_URL (${API_BASE_URL}), API availability, and CORS/HTTPS configuration.`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API ${method} ${url} failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`
    );
  }
  // Some DELETEs may not return JSON
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined as T;
  return (await res.json()) as T;
}

// Types are kept broad since backend contract isn't fully typed here.
export type ApiQuiz = {
  id: string;
  name: string;
  questions: Array<{
    question_text?: string;
    questionText?: string;
    answers: Array<{ text: string; isCorrect?: boolean } | string>;
  }>;
};

export type ApiQuizList = ApiQuiz[];

export const api = {
  // Quizzes
  getQuizzes: () => request<ApiQuizList>(`/quiz`),
  createQuiz: (quizBody: unknown) => request<ApiQuiz>(`/quiz`, { method: "POST", body: quizBody }),
  getQuiz: (quizId: string) => request<ApiQuiz>(`/quiz/${encodeURIComponent(quizId)}`),
  updateQuiz: (quizId: string, body: unknown) =>
    request<ApiQuiz>(`/quiz/${encodeURIComponent(quizId)}`, { method: "POST", body }),
  deleteQuiz: (quizId: string) =>
    request<void>(`/quiz/${encodeURIComponent(quizId)}`, { method: "DELETE" }),

  // Instances
  createInstance: (quizId: string, body?: unknown) =>
    request<{ id: string }>(`/quiz/${encodeURIComponent(quizId)}/instance`, {
      method: "POST",
      body,
    }),
  getInstance: (instanceId: string) =>
    request<unknown>(`/quiz/instance/${encodeURIComponent(instanceId)}`),
  deleteInstance: (instanceId: string) =>
    request<void>(`/quiz/instance/${encodeURIComponent(instanceId)}`, { method: "DELETE" }),
  updateInstanceState: (instanceId: string, body: unknown) =>
    request<unknown>(`/quiz/instance/${encodeURIComponent(instanceId)}/state`, {
      method: "POST",
      body,
    }),
  postAnswer: (instanceId: string, body: unknown) =>
    request<unknown>(`/quiz/instance/${encodeURIComponent(instanceId)}/answer`, {
      method: "POST",
      body,
    }),
};

// Helper to normalize backend quiz question to UI-friendly shape
export type UiQuestion = { questionText: string; answers: string[]; correctIndex: number | null };

export function quizToUiQuestions(q: ApiQuiz): UiQuestion[] {
  type ApiQuestion = ApiQuiz["questions"][number];
  const toText = (qq: ApiQuestion): string => {
    if ("questionText" in qq && typeof qq.questionText === "string") return qq.questionText;
    if ("question_text" in qq && typeof qq.question_text === "string") return qq.question_text;
    return "";
  };
  const isAnswerObj = (
    a: ApiQuestion["answers"][number]
  ): a is { text: string; isCorrect?: boolean } =>
    typeof a === "object" && a !== null && "text" in a;

  return (q.questions || []).map((qq) => {
    const questionText = toText(qq);
    const answersRaw = qq.answers || [];
    const answers: string[] = answersRaw.map((a) => (typeof a === "string" ? a : a.text));
    const idx = answersRaw.findIndex((a) => isAnswerObj(a) && a.isCorrect === true);
    const correctIndex = idx >= 0 ? idx : null;
    return { questionText, answers, correctIndex };
  });
}
