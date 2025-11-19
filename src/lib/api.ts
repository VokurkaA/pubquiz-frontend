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
      mode: "cors",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    throw new Error(`Network error calling ${method} ${url}: ${reason}. Check API availability.`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API ${method} ${url} failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`
    );
  }

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
export type ApiQuiz = {
  id: string;
  name: string;
  questions: Array<{
    id?: string;
    text: string;
    answers: Array<{ id?: string; text: string; isCorrect: boolean }>;
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
  // Returns the instance UUID string directly
  createInstance: (quizId: string, body?: unknown) =>
    request<string>(`/quiz/${encodeURIComponent(quizId)}/instance`, {
      method: "POST",
      body,
    }),
  getInstance: (instanceId: string) =>
    request<{ quizId: string; state: "active" | "completed" | "paused" }>(
      `/quiz/instance/${encodeURIComponent(instanceId)}`
    ),
  deleteInstance: (instanceId: string) =>
    request<void>(`/quiz/instance/${encodeURIComponent(instanceId)}`, { method: "DELETE" }),
  updateInstanceState: (instanceId: string, state: "active" | "completed" | "paused") =>
    request<unknown>(`/quiz/instance/${encodeURIComponent(instanceId)}/state`, {
      method: "POST",
      body: state,
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
  return (q.questions || []).map((qq) => {
    const questionText = qq.text;
    const answersRaw = qq.answers || [];
    const answers: string[] = answersRaw.map((a) => a.text);
    const idx = answersRaw.findIndex((a) => a.isCorrect);
    const correctIndex = idx >= 0 ? idx : null;
    return { questionText, answers, correctIndex };
  });
}
