<<<<<<< HEAD
// Simple typed API client for the PubQuiz backend
// Base URL can be configured via NEXT_PUBLIC_API_BASE_URL, defaults to http://127.0.0.1:6767

// Normalize and export a sane default base URL.
// Note: If the app runs over HTTPS and the API is HTTP, the browser will block requests (mixed content),
// resulting in a generic "TypeError: Failed to fetch". Prefer setting NEXT_PUBLIC_API_BASE_URL to an HTTPS endpoint
// or a same-origin reverse proxy.
=======
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
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
<<<<<<< HEAD
      // Explicit CORS mode for clarity; adjust if you need credentials
=======
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
      mode: "cors",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
<<<<<<< HEAD
    // Provide a clearer hint for common failures (network/mixed content/CORS)
    throw new Error(
      `Network error calling ${method} ${url}: ${reason}. ` +
        `Check NEXT_PUBLIC_API_BASE_URL (${API_BASE_URL}), API availability, and CORS/HTTPS configuration.`
    );
=======
    throw new Error(`Network error calling ${method} ${url}: ${reason}. Check API availability.`);
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API ${method} ${url} failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`
    );
  }
<<<<<<< HEAD
  // Some DELETEs may not return JSON
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return undefined as T;
  return (await res.json()) as T;
}

// Types are kept broad since backend contract isn't fully typed here.
=======

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  // Fallback for text responses (like raw UUIDs)
  const text = await res.text();
  try {
    // Try parsing in case it's a JSON primitive (e.g. "active")
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

// Updated types based on latest backend spec
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
export type ApiQuiz = {
  id: string;
  name: string;
  questions: Array<{
<<<<<<< HEAD
    question_text?: string;
    questionText?: string;
    answers: Array<{ text: string; isCorrect?: boolean } | string>;
=======
    id?: string;
    text: string;
    answers: Array<{ id?: string; text: string; isCorrect: boolean }>;
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
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
<<<<<<< HEAD
  createInstance: (quizId: string, body?: unknown) =>
    request<{ id: string }>(`/quiz/${encodeURIComponent(quizId)}/instance`, {
=======
  // Returns the instance UUID string directly
  createInstance: (quizId: string, body?: unknown) =>
    request<string>(`/quiz/${encodeURIComponent(quizId)}/instance`, {
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
      method: "POST",
      body,
    }),
  getInstance: (instanceId: string) =>
<<<<<<< HEAD
    request<unknown>(`/quiz/instance/${encodeURIComponent(instanceId)}`),
  deleteInstance: (instanceId: string) =>
    request<void>(`/quiz/instance/${encodeURIComponent(instanceId)}`, { method: "DELETE" }),
  updateInstanceState: (instanceId: string, body: unknown) =>
    request<unknown>(`/quiz/instance/${encodeURIComponent(instanceId)}/state`, {
      method: "POST",
      body,
=======
    request<{ quizId: string; state: "active" | "completed" | "paused" }>(
      `/quiz/instance/${encodeURIComponent(instanceId)}`
    ),
  deleteInstance: (instanceId: string) =>
    request<void>(`/quiz/instance/${encodeURIComponent(instanceId)}`, { method: "DELETE" }),
  updateInstanceState: (instanceId: string, state: "active" | "completed" | "paused") =>
    request<unknown>(`/quiz/instance/${encodeURIComponent(instanceId)}/state`, {
      method: "POST",
      body: state,
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
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
<<<<<<< HEAD
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
=======
  return (q.questions || []).map((qq) => {
    const questionText = qq.text;
    const answersRaw = qq.answers || [];
    const answers: string[] = answersRaw.map((a) => a.text);
    const idx = answersRaw.findIndex((a) => a.isCorrect);
>>>>>>> 9e72f3ecb45fb8c2310f24c30f6f93bf48404e7f
    const correctIndex = idx >= 0 ? idx : null;
    return { questionText, answers, correctIndex };
  });
}
