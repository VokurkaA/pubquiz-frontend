#!/usr/bin/env node
/*
  Simple API smoke test:
  - Creates a quiz via POST /quiz
  - Lists quizzes via GET /quiz

  Usage:
    API_BASE_URL="http://localhost:6767" node scripts/test-api.mjs
    # or
    NEXT_PUBLIC_API_BASE_URL="http://localhost:6767" node scripts/test-api.mjs

  Requires Node 18+ (for global fetch). If you're on older Node, install node-fetch
  and set NODE_FETCH_FALLBACK=1 to auto-load it.
*/

const BASE = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://3.70.249.70:6767"
).replace(/\/+$/, "");

async function ensureFetch() {
  if (typeof fetch !== "undefined") return fetch;
  if (process.env.NODE_FETCH_FALLBACK) {
    try {
      const mod = await import("node-fetch");
      return mod.default;
    } catch {
      throw new Error("node-fetch fallback requested but not installed. Run: npm i node-fetch -D");
    }
  }
  throw new Error(
    "This script requires Node 18+ (global fetch) or set NODE_FETCH_FALLBACK=1 with node-fetch installed."
  );
}

function buildUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}`;
}

// Try common envelope shapes to find an array of quizzes
function toArrayFromEnvelope(data) {
  if (Array.isArray(data)) return { arr: data, key: null };
  if (data && typeof data === "object") {
    const keys = ["quizzes", "items", "data", "results", "list"];
    for (const k of keys) {
      if (Array.isArray(data[k])) return { arr: data[k], key: k };
    }
  }
  return { arr: [], key: null };
}

async function requestMeta(method, path, body) {
  const f = await ensureFetch();
  const url = buildUrl(path);
  const res = await f(url, {
    method,
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const ct = res.headers.get("content-type") || "";
  const location = res.headers.get("location") || undefined;
  let data;
  let text;
  if (ct.includes("application/json")) {
    try {
      data = await res.clone().json();
    } catch {
      data = undefined;
    }
    try {
      text = await res.text();
    } catch {
      text = undefined;
    }
  } else {
    try {
      text = await res.text();
    } catch {
      text = undefined;
    }
  }
  if (!res.ok) {
    const extra = text ?? (data !== undefined ? JSON.stringify(data) : "");
    throw new Error(
      `API ${method} ${url} failed: ${res.status} ${res.statusText}${extra ? ` — ${extra}` : ""}`
    );
  }
  return {
    url,
    status: res.status,
    statusText: res.statusText,
    contentType: ct,
    location,
    data,
    text,
  };
}

function makeTestQuizSnakeWithObjs() {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    name: `Test Quiz ${ts}`,
    questions: [
      {
        question_text: "What is 2 + 2?",
        answers: [
          { text: "3", isCorrect: false },
          { text: "4", isCorrect: true },
          { text: "5", isCorrect: false },
        ],
      },
      {
        question_text: "Pick the primary color",
        answers: [
          { text: "Red", isCorrect: true },
          { text: "Cyan", isCorrect: false },
        ],
      },
    ],
  };
}

function makeTestQuizCamelWithObjs() {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    name: `Test Quiz ${ts}`,
    questions: [
      {
        questionText: "What is 2 + 2?",
        answers: [
          { text: "3", isCorrect: false },
          { text: "4", isCorrect: true },
          { text: "5", isCorrect: false },
        ],
      },
      {
        questionText: "Pick the primary color",
        answers: [
          { text: "Red", isCorrect: true },
          { text: "Cyan", isCorrect: false },
        ],
      },
    ],
  };
}

function makeTestQuizSnakeWithStrings() {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    name: `Test Quiz ${ts}`,
    questions: [
      {
        question_text: "What is 2 + 2?",
        answers: ["3", "4", "5"],
        correctIndex: 1,
      },
      {
        question_text: "Pick the primary color",
        answers: ["Red", "Cyan"],
        correctIndex: 0,
      },
    ],
  };
}

function makeTestQuizCamelWithStrings() {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    name: `Test Quiz ${ts}`,
    questions: [
      {
        questionText: "What is 2 + 2?",
        answers: ["3", "4", "5"],
        correctIndex: 1,
      },
      {
        questionText: "Pick the primary color",
        answers: ["Red", "Cyan"],
        correctIndex: 0,
      },
    ],
  };
}

async function getListCandidates() {
  const candidates = ["/quiz", "/quizzes"]; // try common variants
  const results = [];
  for (const p of candidates) {
    try {
      const res = await requestMeta("GET", p);
      const { arr, key } = toArrayFromEnvelope(res.data);
      const count = arr ? arr.length : null;
      results.push({ path: p, ok: true, res, count, key });
    } catch (err) {
      results.push({ path: p, ok: false, err });
    }
  }
  return results;
}

async function createAt(path, body) {
  return requestMeta("POST", path, body);
}

async function main() {
  console.info(`Using API base: ${BASE}`);
  // Probe list endpoints first
  console.info("\nProbing list endpoints...");
  const listProbes = await getListCandidates();
  for (const r of listProbes) {
    if (r.ok) {
      const dtype = r.res && r.res.data && typeof r.res.data;
      const keys =
        r.res && r.res.data && typeof r.res.data === "object" ? Object.keys(r.res.data) : undefined;
      console.info(
        `GET ${r.path} => ${r.res.status} ${r.res.statusText} (${r.res.contentType || "no-ct"}) count=${r.count ?? "n/a"} dtype=${dtype} keys=${keys ? keys.join(",") : "-"} arrayKey=${r.key || "-"}`
      );
    } else {
      console.info(`GET ${r.path} => failed:`, r.err?.message || r.err);
    }
  }

  // Choose preferred endpoint: one that returned an array (prefer /quiz)
  const preferred =
    listProbes.find((r) => r.ok && r.count != null && r.path === "/quiz") ||
    listProbes.find((r) => r.ok && r.count != null);
  const listPath = preferred?.path || "/quiz";
  const baseCount = preferred?.count ?? 0;
  console.info(`\nUsing list endpoint: ${listPath} (baseline count=${baseCount})`);

  const attempts = [
    { label: "snake + answer objs", body: makeTestQuizSnakeWithObjs() },
    { label: "camel + answer objs", body: makeTestQuizCamelWithObjs() },
    { label: "snake + strings + correctIndex", body: makeTestQuizSnakeWithStrings() },
    { label: "camel + strings + correctIndex", body: makeTestQuizCamelWithStrings() },
  ];

  let createdName;
  let success = false;
  for (const attempt of attempts) {
    createdName = attempt.body.name;
    console.info(`\nCreating quiz (attempt: ${attempt.label})...`);
    const postRes = await createAt(listPath, attempt.body);
    console.info(
      `POST ${listPath} => ${postRes.status} ${postRes.statusText} (${postRes.contentType || "no-ct"}) location=${postRes.location || "-"}`
    );
    if (postRes.contentType.includes("application/json")) {
      console.info("Response JSON:", postRes.data);
    } else if (postRes.text) {
      console.info("Response text:", postRes.text);
    }

    const after = await requestMeta("GET", listPath);
    const { arr, key } = toArrayFromEnvelope(after.data);
    console.info(
      `GET ${listPath} => ${after.status} ${after.statusText} (${after.contentType || "no-ct"}) count=${arr ? arr.length : 0} arrayKey=${key || "-"}`
    );
    if (arr.length > baseCount) {
      success = true;
      const found = arr.find((q) => q.name === createdName);
      if (found) {
        console.info("Created quiz appears in list:", { id: found.id, name: found.name });
      } else {
        console.info(
          "List grew but created quiz not found by name; sample:",
          arr.slice(0, 3).map((q) => ({ id: q.id, name: q.name }))
        );
      }
      break;
    }
  }

  if (!success) {
    console.error(
      "\nAll attempts failed to produce a visible quiz in the list. Check API expectations for payload shape or endpoint."
    );
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error("\nTest failed:", err?.message || err);
  process.exitCode = 1;
});
